$tempPath = "D:\projects\.expo-temp"
$cachePath = "D:\projects\.npm-cache"

New-Item -ItemType Directory -Force -Path $tempPath, $cachePath | Out-Null
$env:TEMP = $tempPath
$env:TMP = $tempPath
$env:npm_config_cache = $cachePath

& "$PSScriptRoot\..\node_modules\.bin\expo.cmd" start
exit $LASTEXITCODE
