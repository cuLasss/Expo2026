param(
    [int]$Port = 8765,
    [string]$HostName = "127.0.0.1"
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ServerPath = Join-Path $Root "if-rush\server.py"
$PidPath = Join-Path $Root ".if-rush-server.pid"
$OutLog = Join-Path $Root "if-rush-server.log"
$ErrLog = Join-Path $Root "if-rush-server.err.log"
$Url = "http://${HostName}:${Port}/if-rush/"

function Quote-Argument([string]$Value) {
    return '"' + ($Value -replace '"', '\"') + '"'
}

function Test-IfRushUrl {
    try {
        $response = Invoke-WebRequest -UseBasicParsing $Url -TimeoutSec 3
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Get-ProcessCommandLine([int]$ProcessId) {
    $procInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
    return $procInfo.CommandLine
}

if (-not (Test-Path $ServerPath)) {
    throw "Servidor nao encontrado em $ServerPath"
}

if (Test-Path $PidPath) {
    $savedPidRaw = (Get-Content $PidPath -Raw).Trim()
    $savedPid = 0
    if ([int]::TryParse($savedPidRaw, [ref]$savedPid)) {
        $savedProcess = Get-Process -Id $savedPid -ErrorAction SilentlyContinue
        if ($savedProcess -and (Test-IfRushUrl)) {
            Write-Host "IF Rush ja esta rodando em $Url (PID $savedPid)"
            exit 0
        }
    }
}

$portOwner = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($portOwner) {
    $commandLine = Get-ProcessCommandLine $portOwner.OwningProcess
    if ($commandLine -like "*server.py*" -and $commandLine -like "*if-rush*") {
        Set-Content -Path $PidPath -Value $portOwner.OwningProcess -Encoding ASCII
        Write-Host "IF Rush ja esta rodando em $Url (PID $($portOwner.OwningProcess))"
        exit 0
    }
    throw "Porta $Port ja esta em uso pelo PID $($portOwner.OwningProcess). Pare esse processo ou rode com -Port outra_porta."
}

$python = Get-Command python -ErrorAction SilentlyContinue
$arguments = @((Quote-Argument $ServerPath), "--host", $HostName, "--port", "$Port")
if (-not $python) {
    $python = Get-Command py -ErrorAction SilentlyContinue
    $arguments = @("-3") + $arguments
}
if (-not $python) {
    throw "Python nao encontrado no PATH."
}

Remove-Item -LiteralPath $OutLog, $ErrLog -Force -ErrorAction SilentlyContinue

$process = Start-Process `
    -FilePath $python.Source `
    -ArgumentList $arguments `
    -WorkingDirectory $Root `
    -RedirectStandardOutput $OutLog `
    -RedirectStandardError $ErrLog `
    -WindowStyle Hidden `
    -PassThru

Set-Content -Path $PidPath -Value $process.Id -Encoding ASCII
Start-Sleep -Milliseconds 900

if (Test-IfRushUrl) {
    Write-Host "IF Rush rodando em $Url (PID $($process.Id))"
    exit 0
}

Write-Warning "Servidor iniciou, mas ainda nao respondeu em $Url."
Write-Warning "Veja os logs: $OutLog e $ErrLog"
exit 1
