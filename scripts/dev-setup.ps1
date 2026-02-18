#!/usr/bin/env pwsh

# Development Setup Script for Acquisitions Project

Write-Host "🔧 Setting up development environment..." -ForegroundColor Blue

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node --version) found" -ForegroundColor Green
Write-Host "✅ npm $(npm --version) found" -ForegroundColor Green

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm ci

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check for .env file
if (!(Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "⚠️  Please update .env file with your configuration" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  No .env file found. Create one with your configuration." -ForegroundColor Yellow
    }
}

# Run lint check
Write-Host "🔍 Running code quality checks..." -ForegroundColor Blue
npm run lint

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Lint issues found. Run 'npm run lint:fix' to auto-fix." -ForegroundColor Yellow
}

# Check Prettier formatting
npm run format:check

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Code formatting issues found. Run 'npm run format' to fix." -ForegroundColor Yellow
}

Write-Host "✅ Development environment setup complete!" -ForegroundColor Green
Write-Host "🚀 Run 'npm run dev' to start the development server" -ForegroundColor Cyan