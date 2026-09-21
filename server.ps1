# 공항네컷 (Airport 4-Cuts) Local Backend Server
param(
    [int]$Port = 8899
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$rootDir = $PSScriptRoot
$photosDir = Join-Path $rootDir "photos"
if (!(Test-Path $photosDir)) {
    New-Item -ItemType Directory -Path $photosDir -Force | Out-Null
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "   공항네컷 (Airport 4-Cuts) 서버가 시작되었습니다!   " -ForegroundColor Green
    Write-Host "   주소: $prefix" -ForegroundColor Yellow
    Write-Host "=================================================" -ForegroundColor Cyan
} catch {
    Write-Error "포트 $Port 를 시작할 수 없습니다: $_"
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".wav"  = "audio/wav"
    ".mp3"  = "audio/mpeg"
}

function Send-Response {
    param(
        $Response,
        [int]$StatusCode,
        [string]$ContentType,
        [byte[]]$ContentBytes
    )
    $Response.StatusCode = $StatusCode
    $Response.ContentType = $ContentType
    $Response.AddHeader("Access-Control-Allow-Origin", "*")
    $Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $Response.AddHeader("Access-Control-Allow-Headers", "Content-Type")
    $Response.ContentLength64 = $ContentBytes.Length
    $Response.OutputStream.Write($ContentBytes, 0, $ContentBytes.Length)
    $Response.OutputStream.Close()
}

function Send-JsonResponse {
    param(
        $Response,
        [int]$StatusCode,
        $Data
    )
    $json = $Data | ConvertTo-Json -Depth 5 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    Send-Response -Response $Response -StatusCode $StatusCode -ContentType "application/json; charset=utf-8" -ContentBytes $bytes
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        if ($request.HttpMethod -eq "OPTIONS") {
            Send-Response -Response $response -StatusCode 200 -ContentType "text/plain" -ContentBytes @()
            continue
        }

        $rawUrl = $request.Url.LocalPath
        $urlDecoded = [System.Uri]::UnescapeDataString($rawUrl)
        if ([string]::IsNullOrWhiteSpace($urlDecoded) -or $urlDecoded -eq "/") {
            $urlDecoded = "/index.html"
        }

        # API Handlers
        if ($urlDecoded -eq "/api/printers") {
            $printers = Get-Printer | Select-Object Name, Type, DriverName, PrinterStatus, Shared
            Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                success = $true
                printers = $printers
            }
            continue
        }

        if ($urlDecoded -eq "/api/save" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $data = $body | ConvertFrom-Json

            $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
            $sessionDir = Join-Path $photosDir $timestamp
            New-Item -ItemType Directory -Path $sessionDir -Force | Out-Null

            $savedFiles = @{}

            # Save main strip
            if ($data.mainImage) {
                $base64Data = $data.mainImage -replace '^data:image/[^;]+;base64,', ''
                $imageBytes = [System.Convert]::FromBase64String($base64Data)
                $mainFilePath = Join-Path $sessionDir "airport4cut_$timestamp.png"
                [System.IO.File]::WriteAllBytes($mainFilePath, $imageBytes)
                $savedFiles["main"] = "/photos/$timestamp/airport4cut_$timestamp.png"
                $savedFiles["mainLocal"] = $mainFilePath
            }

            # Save A4 4-in-1 composite
            if ($data.a4Image) {
                $base64A4 = $data.a4Image -replace '^data:image/[^;]+;base64,', ''
                $imageBytesA4 = [System.Convert]::FromBase64String($base64A4)
                $a4FilePath = Join-Path $sessionDir "airport4cut_a4_$timestamp.png"
                [System.IO.File]::WriteAllBytes($a4FilePath, $imageBytesA4)
                $savedFiles["a4"] = "/photos/$timestamp/airport4cut_a4_$timestamp.png"
                $savedFiles["a4Local"] = $a4FilePath
            }

            # Save individual cuts if provided
            if ($data.cuts) {
                $cutUrls = @()
                for ($i = 0; $i -lt $data.cuts.Length; $i++) {
                    $cutBase64 = $data.cuts[$i] -replace '^data:image/[^;]+;base64,', ''
                    $cutBytes = [System.Convert]::FromBase64String($cutBase64)
                    $cutFilePath = Join-Path $sessionDir "cut_$($i + 1).png"
                    [System.IO.File]::WriteAllBytes($cutFilePath, $cutBytes)
                    $cutUrls += "/photos/$timestamp/cut_$($i + 1).png"
                }
                $savedFiles["cuts"] = $cutUrls
            }

            Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                success = $true
                timestamp = $timestamp
                files = $savedFiles
            }
            continue
        }

        if ($urlDecoded -eq "/api/print" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $data = $body | ConvertFrom-Json

            $targetFile = $data.filePath
            $printerName = $data.printerName

            if (-not $printerName) {
                $epson = Get-Printer | Where-Object { $_.Name -like "*L8180*" } | Select-Object -First 1
                if ($epson) { $printerName = $epson.Name }
            }

            Write-Host "인쇄 요청: $targetFile -> $printerName" -ForegroundColor Cyan

            if (Test-Path $targetFile) {
                try {
                    # Print using mspaint /pt or Start-Process
                    $printProcess = Start-Process -FilePath "mspaint.exe" -ArgumentList "/pt `"$targetFile`" `"$printerName`"" -PassThru -WindowStyle Hidden
                    Send-JsonResponse -Response $response -StatusCode 200 -Data @{
                        success = $true
                        message = "인쇄 작업이 $printerName (으)로 전송되었습니다."
                    }
                } catch {
                    Send-JsonResponse -Response $response -StatusCode 500 -Data @{
                        success = $false
                        message = "인쇄 실패: $_"
                    }
                }
            } else {
                Send-JsonResponse -Response $response -StatusCode 404 -Data @{
                    success = $false
                    message = "파일을 찾을 수 없습니다: $targetFile"
                }
            }
            continue
        }

        # Static file handling
        $relativePath = $urlDecoded.TrimStart('/') -replace '/', '\'
        $filePath = Join-Path $rootDir $relativePath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            Send-Response -Response $response -StatusCode 200 -ContentType $contentType -ContentBytes $bytes
        } else {
            $errMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlDecoded")
            Send-Response -Response $response -StatusCode 404 -ContentType "text/plain; charset=utf-8" -ContentBytes $errMsg
        }
    } catch {
        Write-Host "서버 요청 처리 중 오류: $_" -ForegroundColor Red
    }
}
