Add-Type -AssemblyName System.Drawing

function Create-Mask($srcPath, $dstPath, $boxes) {
    $src = [System.Drawing.Image]::FromFile((Resolve-Path $srcPath))
    $bmp = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
    $g.Dispose()
    $src.Dispose()

    foreach ($box in $boxes) {
        $bx = $box[0]; $by = $box[1]; $bw = $box[2]; $bh = $box[3]
        for ($y = $by; $y -lt ($by + $bh); $y++) {
            for ($x = $bx; $x -lt ($bx + $bw); $x++) {
                $c = $bmp.GetPixel($x, $y)
                # If pixel is near-white or white, make it transparent
                if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
                    $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
                }
            }
        }
    }

    $bmp.Save((Join-Path (Get-Location) $dstPath), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created transparent mask: $dstPath"
}

Create-Mask "frames\frame_airport.png" "frames\mask_airport.png" @(
    @(47, 137, 293, 396),
    @(384, 136, 293, 396),
    @(47, 578, 293, 397),
    @(383, 578, 292, 397)
)

Create-Mask "frames\frame_ghhs_blue.png" "frames\mask_ghhs_blue.png" @(
    @(41, 131, 305, 408),
    @(378, 131, 305, 408),
    @(41, 572, 305, 408),
    @(378, 572, 305, 408)
)

Create-Mask "frames\frame_ghhs_wave.png" "frames\mask_ghhs_wave.png" @(
    @(54, 108, 305, 408),
    @(371, 109, 305, 408),
    @(54, 533, 305, 408),
    @(371, 533, 305, 408)
)

Create-Mask "frames\frame_ghism_white.png" "frames\mask_ghism_white.png" @(
    @(47, 64, 298, 401),
    @(47, 496, 298, 400),
    @(379, 141, 298, 401),
    @(379, 579, 298, 400)
)

Create-Mask "frames\frame_ghism_black.png" "frames\mask_ghism_black.png" @(
    @(49, 69, 293, 396),
    @(49, 502, 293, 396),
    @(382, 146, 293, 396),
    @(382, 583, 293, 396)
)
