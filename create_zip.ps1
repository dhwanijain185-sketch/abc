$projectDir = "D:\paytm ai"
$targetZip = Join-Path $projectDir "paytm-ai-project.zip"

if (Test-Path $targetZip) {
    Remove-Item $targetZip -Force
}

$items = @(
    "docs",
    "public",
    "src",
    "supabase",
    ".gitignore",
    "AGENTS.md",
    "CLAUDE.md",
    "eslint.config.mjs",
    "next-env.d.ts",
    "next.config.ts",
    "package-lock.json",
    "package.json",
    "postcss.config.mjs",
    "README.md",
    "SETUP_ON_NEW_LAPTOP.md",
    "tsconfig.json"
)

$paths = @()
foreach ($item in $items) {
    $p = Join-Path $projectDir $item
    if (Test-Path $p) {
        $paths += $p
    }
}

Write-Host "Compressing $($paths.Count) items into $targetZip..."
Compress-Archive -Path $paths -DestinationPath $targetZip -CompressionLevel Optimal

if (Test-Path $targetZip) {
    $zipFile = Get-Item $targetZip
    $sizeMB = [math]::Round($zipFile.Length / 1MB, 2)
    Write-Host "SUCCESS: Created $targetZip ($sizeMB MB)"
    
    # Also create a copy in D:\ so it's super easy to grab from the root drive
    $rootZip = "D:\paytm-ai-project.zip"
    Copy-Item $targetZip $rootZip -Force
    Write-Host "SUCCESS: Copied also to $rootZip"
} else {
    Write-Error "Failed to create zip file."
}
