param(
  [switch]$Write
)

$ErrorActionPreference = "Stop"
$youtubePattern = '(?:youtube\.com/embed/|youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{11})'

function Get-UniqueYoutubeIds {
  param([string]$Html)

  return [regex]::Matches($Html, $youtubePattern) |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object -Unique
}

function Get-SchemaYoutubeIds {
  param([string]$Html)

  $ids = @()
  $blocks = [regex]::Matches(
    $Html,
    '<script type="application/ld\+json">([\s\S]*?)</script>'
  )

  foreach ($block in $blocks) {
    $json = $block.Groups[1].Value
    if ($json -notmatch 'VideoObject') { continue }
    $ids += [regex]::Matches($json, $youtubePattern) |
      ForEach-Object { $_.Groups[1].Value }
  }

  return $ids | Sort-Object -Unique
}

function ConvertTo-JsonString {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return ""
  }

  return ($Value.Trim() | ConvertTo-Json -Compress)
}

function Get-PageTitle {
  param([string]$Html)

  $h1 = [regex]::Match($Html, '<h1[^>]*>([\s\S]*?)</h1>', 'IgnoreCase')
  if ($h1.Success) {
    return (($h1.Groups[1].Value -replace '<[^>]+>', '') -replace '\s+', ' ').Trim()
  }

  $title = [regex]::Match($Html, '<title>([\s\S]*?)</title>', 'IgnoreCase')
  if ($title.Success) {
    return (($title.Groups[1].Value -replace '\s+', ' ') -replace '\s*\|\s*FamiliaUSA1\s*$', '').Trim()
  }

  return "Vídeo do FamiliaUSA1"
}

function Get-PageDescription {
  param([string]$Html)

  $description = [regex]::Match(
    $Html,
    '<meta\s+name="description"\s+content="([^"]*)"',
    'IgnoreCase'
  )

  if ($description.Success) {
    return $description.Groups[1].Value.Trim()
  }

  return "Vídeo incorporado em artigo do FamiliaUSA1 sobre vida de brasileiros nos Estados Unidos."
}

function Get-PostDate {
  param([string]$Html)

  $datePublished = [regex]::Match($Html, '"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})')
  if ($datePublished.Success) {
    return $datePublished.Groups[1].Value
  }

  $dateModified = [regex]::Match($Html, '"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})')
  if ($dateModified.Success) {
    return $dateModified.Groups[1].Value
  }

  return (Get-Date -Format "yyyy-MM-dd")
}

function Get-YoutubeUploadDate {
  param(
    [string]$VideoId,
    [string]$FallbackDate
  )

  try {
    $response = Invoke-WebRequest -Uri "https://www.youtube.com/watch?v=$VideoId" -UseBasicParsing -TimeoutSec 20
    $match = [regex]::Match($response.Content, '"uploadDate":"(\d{4}-\d{2}-\d{2})')
    if ($match.Success) {
      return $match.Groups[1].Value
    }
  } catch {
    # Build-time fallback: keep the site valid even if YouTube is unavailable.
  }

  return $FallbackDate
}

function Add-MissingVideoFields {
  param(
    [string]$Html,
    [string]$VideoId,
    [string]$UploadDate
  )

  $thumbnail = "https://img.youtube.com/vi/$VideoId/maxresdefault.jpg"
  $embedUrl = "https://www.youtube.com/embed/$VideoId"
  $contentUrl = "https://www.youtube.com/watch?v=$VideoId"
  $next = $Html

  if ($next -notlike "*`"thumbnailUrl`": `"$thumbnail`"*") {
    $next = $next.Replace(
      "`"embedUrl`": `"$embedUrl`"",
      "`"thumbnailUrl`": `"$thumbnail`",`n    `"embedUrl`": `"$embedUrl`""
    )
  }

  if ($next -notlike "*`"contentUrl`": `"$contentUrl`"*") {
    $next = $next.Replace(
      "`"embedUrl`": `"$embedUrl`"",
      "`"embedUrl`": `"$embedUrl`",`n    `"contentUrl`": `"$contentUrl`""
    )
  }

  $datePattern = '"uploadDate"\s*:\s*"\d{4}-\d{2}-\d{2}(?:T[^"]*)?"'
  if ($next -match $datePattern) {
    $next = [regex]::Replace($next, $datePattern, "`"uploadDate`": `"$UploadDate`"", 1)
  } elseif ($next -like "*`"thumbnailUrl`": `"$thumbnail`"*") {
    $next = $next.Replace(
      "`"thumbnailUrl`": `"$thumbnail`",",
      "`"thumbnailUrl`": `"$thumbnail`",`n    `"uploadDate`": `"$UploadDate`","
    )
  }

  return $next
}

function New-VideoObjectJsonLd {
  param(
    [string]$Html,
    [string]$VideoId,
    [string]$UploadDate
  )

  $name = ConvertTo-JsonString -Value (Get-PageTitle -Html $Html)
  $description = ConvertTo-JsonString -Value (Get-PageDescription -Html $Html)
  $thumbnail = "https://img.youtube.com/vi/$VideoId/maxresdefault.jpg"
  $embedUrl = "https://www.youtube.com/embed/$VideoId"
  $contentUrl = "https://www.youtube.com/watch?v=$VideoId"

  return @"
    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": $name,
  "description": $description,
  "thumbnailUrl": "$thumbnail",
  "uploadDate": "$UploadDate",
  "embedUrl": "$embedUrl",
  "contentUrl": "$contentUrl"
}
    </script>
"@
}

$files = @()
$files += Get-ChildItem -Path . -Filter *.html -File
$files += Get-ChildItem -Path articles -Filter *.html -File
$failed = $false

foreach ($file in ($files | Sort-Object FullName)) {
  $html = Get-Content -Raw -Encoding UTF8 -LiteralPath $file.FullName
  $embedIds = @(Get-UniqueYoutubeIds -Html $html)
  if ($embedIds.Count -eq 0) { continue }

  $schemaIds = @(Get-SchemaYoutubeIds -Html $html)
  $next = $html
  $fallbackDate = Get-PostDate -Html $html

  foreach ($id in $embedIds) {
    if ($schemaIds -notcontains $id) {
      $uploadDate = Get-YoutubeUploadDate -VideoId $id -FallbackDate $fallbackDate
      $videoJsonLd = New-VideoObjectJsonLd -Html $next -VideoId $id -UploadDate $uploadDate
      $next = $next.Replace("</head>", "$videoJsonLd`n  </head>")
      $schemaIds += $id
    } else {
      $existingDate = [regex]::Match($next, '"uploadDate"\s*:\s*"(\d{4}-\d{2}-\d{2})')
      if ($existingDate.Success) {
        $uploadDate = $existingDate.Groups[1].Value
      } else {
        $uploadDate = Get-YoutubeUploadDate -VideoId $id -FallbackDate $fallbackDate
      }
    }

    $next = Add-MissingVideoFields -Html $next -VideoId $id -UploadDate $uploadDate

    $required = @(
      "`"thumbnailUrl`": `"https://img.youtube.com/vi/$id/maxresdefault.jpg`"",
      "`"embedUrl`": `"https://www.youtube.com/embed/$id`"",
      "`"contentUrl`": `"https://www.youtube.com/watch?v=$id`"",
      "`"uploadDate`": `"$uploadDate`""
    )

    foreach ($token in $required) {
      if ($next -notlike "*$token*") {
        Write-Error "$($file.FullName): missing $token for YouTube video $id"
        $failed = $true
      }
    }
  }

  if ($Write -and $next -ne $html) {
    Set-Content -Encoding UTF8 -NoNewline -LiteralPath $file.FullName -Value $next
    Write-Host "$($file.FullName): updated VideoObject schema"
  }
}

if ($failed) {
  exit 1
}

Write-Host "All YouTube embeds have complete VideoObject schema."
