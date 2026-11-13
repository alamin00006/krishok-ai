param(
  [ValidateSet("apk", "aab")]
  [string]$Target = "apk"
)

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$androidRoot = Join-Path $projectRoot "android"
$javaHome = "C:\Program Files\Android\Android Studio\jbr"
$androidSdk = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$tempPath = "D:\projects\.expo-temp"
$releaseRoot = Join-Path $projectRoot "releases"

if (-not (Test-Path $javaHome)) {
  throw "Android Studio Java runtime not found: $javaHome"
}
if (-not (Test-Path $androidSdk)) {
  throw "Android SDK not found: $androidSdk"
}

New-Item -ItemType Directory -Force -Path $tempPath | Out-Null
New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidSdk
$env:ANDROID_SDK_ROOT = $androidSdk
$env:TEMP = $tempPath
$env:TMP = $tempPath

if (-not (Test-Path $androidRoot)) {
  & (Join-Path $projectRoot "node_modules\.bin\expo.cmd") prebuild --platform android
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Push-Location $androidRoot
try {
  if ($Target -eq "apk") {
    & .\gradlew.bat assembleRelease
    if ($LASTEXITCODE -eq 0) {
      Copy-Item -Force (Join-Path $androidRoot "app\build\outputs\apk\release\app-release.apk") (Join-Path $releaseRoot "krishok-ai-v1.0.0.apk")
    }
  } else {
    & .\gradlew.bat bundleRelease
    if ($LASTEXITCODE -eq 0) {
      Copy-Item -Force (Join-Path $androidRoot "app\build\outputs\bundle\release\app-release.aab") (Join-Path $releaseRoot "krishok-ai-v1.0.0.aab")
    }
  }
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
