param(
    [ValidateSet('install', 'build', 'dev', 'check', 'clean')]
    [string]$Command = 'dev'
)
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
$previousPath = $env:PATH
try {
    $nodeCandidates = @(
        (Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source),
        (Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe')
    )
    $selectedNode = $null
    foreach ($candidate in $nodeCandidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) {
            $version = & $candidate -p 'process.versions.node'
            if ($LASTEXITCODE -eq 0 -and [version]$version -ge [version]'24.15.0' -and [version]$version -lt [version]'25.0.0') {
                $selectedNode = $candidate
                break
            }
        }
    }
    if (-not $selectedNode) { throw 'Please install Node.js 24 LTS (24.15 or newer). See README.md.' }
    $env:PATH = (Split-Path $selectedNode) + ';' + $env:PATH
    $localNpm = Join-Path $PSScriptRoot '.local\npm\bin\npm-cli.js'
    if (Test-Path -LiteralPath $localNpm) {
        $npmArguments = if ($Command -eq 'install') { @('ci', '--cache', '.local/npm-cache') } else { @('run', $Command) }
        & $selectedNode $localNpm @npmArguments
    } else {
        if ($Command -eq 'install') { & npm.cmd ci } else { & npm.cmd run $Command }
    }
    if ($LASTEXITCODE -ne 0) { throw "Blog command failed: $Command (exit $LASTEXITCODE)" }
} finally {
    $env:PATH = $previousPath
    Pop-Location
}
