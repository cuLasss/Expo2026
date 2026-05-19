param(
    [int]$Port = 8765
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PidPath = Join-Path $Root ".if-rush-server.pid"
$targets = New-Object System.Collections.Generic.List[int]

function Get-IfRushServerPidFromPort {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $conn) { return $null }

    $procInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $($conn.OwningProcess)" -ErrorAction SilentlyContinue
    if ($procInfo.CommandLine -like "*server.py*" -and $procInfo.CommandLine -like "*if-rush*") {
        return [int]$conn.OwningProcess
    }

    Write-Warning "A porta $Port esta em uso pelo PID $($conn.OwningProcess), mas nao parece ser o servidor do IF Rush."
    return $null
}

function Add-TargetPid([int]$ProcessId) {
    if ($ProcessId -and -not $targets.Contains($ProcessId)) {
        $targets.Add($ProcessId)
    }
}

if (Test-Path $PidPath) {
    $savedPidRaw = (Get-Content $PidPath -Raw).Trim()
    $savedPid = 0
    if ([int]::TryParse($savedPidRaw, [ref]$savedPid)) {
        $procInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $savedPid" -ErrorAction SilentlyContinue
        if ($procInfo.CommandLine -like "*server.py*" -and $procInfo.CommandLine -like "*if-rush*") {
            Add-TargetPid $savedPid
        }
    }
}

$portPid = Get-IfRushServerPidFromPort
if ($portPid) {
    Add-TargetPid $portPid
}

if (-not $targets.Count) {
    if (Test-Path $PidPath) {
        Remove-Item -LiteralPath $PidPath -Force
    }
    Write-Host "Nenhum servidor IF Rush rodando na porta $Port."
    exit 0
}

foreach ($targetPid in $targets) {
    Stop-Process -Id $targetPid -Force -ErrorAction SilentlyContinue
    Write-Host "Servidor IF Rush parado (PID $targetPid)."
}

if (Test-Path $PidPath) {
    Remove-Item -LiteralPath $PidPath -Force
}
