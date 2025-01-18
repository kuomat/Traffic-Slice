$secretKeySystemLevel = "CqyTJns6LOXtDRxmlkuNAFfV91UjgreE"
$secretKeyUserLevel = "TqyTJns6LOXtDRxmlkuNAFfV91UjgreEq"

# Check if running with admin privileges
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Error: This script requires administrative privileges. Please run PowerShell as Administrator." -ForegroundColor Red
    exit 1
}
 
# Set the environment variable at the Machine (System) level so it persists
[System.Environment]::SetEnvironmentVariable('TRAFFIC_SLICE_SECRET_KEY', $secretKeySystemLevel, [System.EnvironmentVariableTarget]::Machine)

Write-Host "Environment variable TRAFFIC_SLICE_SECRET_KEY has been set at System level" -ForegroundColor Green

# Set the environment variable at the User level
[System.Environment]::SetEnvironmentVariable('TRAFFIC_SLICE_SECRET_KEY', $secretKeyUserLevel, [System.EnvironmentVariableTarget]::User)

Write-Host "Environment variable TRAFFIC_SLICE_SECRET_KEY has been set at User level" -ForegroundColor Green
