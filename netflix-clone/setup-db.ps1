# Setup script for Netflix Clone database
# This script sets up the PostgreSQL database and runs the Prisma migrations

# Configuration
$DB_NAME = "netflix_clone"
$DB_USER = "postgres"
$DB_PASSWORD = "postgres"
$DB_HOST = "localhost"
$DB_PORT = "5432"

# Set DATABASE_URL environment variable
$env:DATABASE_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

Write-Host "Setting up Netflix Clone database..." -ForegroundColor Green

# Check if PostgreSQL is installed
try {
    $pgVersion = psql --version
    Write-Host "PostgreSQL is installed: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "PostgreSQL is not installed or not in PATH. Please install PostgreSQL and try again." -ForegroundColor Red
    Write-Host "You can download PostgreSQL from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

# Create database if it doesn't exist
Write-Host "Creating database if it doesn't exist..." -ForegroundColor Green
$createDbCmd = @"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | findstr /r "1 row" > nul
if errorlevel 1 (
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME"
    echo Database created.
) else (
    echo Database already exists.
)
"@

# Execute the command
Invoke-Expression "cmd /c $createDbCmd"

# Run Prisma migrations
Write-Host "Running Prisma migrations..." -ForegroundColor Green
Set-Location -Path "apps/web"
npx prisma migrate dev --name "netflix_clone_setup"

Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "You can now run 'pnpm dev:all' to start both frontend and backend." -ForegroundColor Green
