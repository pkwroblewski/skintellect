# Skintellect Deployment Script for Windows
# Deploys to Vercel with environment variables

Write-Host "🚀 Skintellect Deployment" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel is linked
if (-Not (Test-Path ".vercel")) {
    Write-Host "⚡ Linking to Vercel..." -ForegroundColor Yellow
    vercel link --yes
}

Write-Host "✅ Project linked to Vercel" -ForegroundColor Green
Write-Host ""

# Check environment variables
Write-Host "🔐 Checking environment variables..." -ForegroundColor Yellow

$envCheck = vercel env ls 2>&1
if ($envCheck -match "No Environment Variables") {
    Write-Host ""
    Write-Host "⚠️  No environment variables set!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You need to add these variables in Vercel:" -ForegroundColor Cyan
    Write-Host "  - DATABASE_URL" 
    Write-Host "  - DIRECT_URL"
    Write-Host "  - NEXT_PUBLIC_SITE_URL"
    Write-Host ""
    Write-Host "Run these commands:" -ForegroundColor Yellow
    Write-Host '  vercel env add DATABASE_URL production'
    Write-Host '  vercel env add DIRECT_URL production'
    Write-Host '  vercel env add NEXT_PUBLIC_SITE_URL production'
    Write-Host ""
    
    $continue = Read-Host "Do you want to add them now? (y/n)"
    if ($continue -eq "y") {
        Write-Host ""
        Write-Host "📝 Adding DATABASE_URL..." -ForegroundColor Yellow
        vercel env add DATABASE_URL production
        
        Write-Host ""
        Write-Host "📝 Adding DIRECT_URL..." -ForegroundColor Yellow  
        vercel env add DIRECT_URL production
        
        Write-Host ""
        Write-Host "📝 Adding NEXT_PUBLIC_SITE_URL..." -ForegroundColor Yellow
        vercel env add NEXT_PUBLIC_SITE_URL production
    }
}

Write-Host ""
Write-Host "🚀 Deploying to production..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "🎉 Deployment complete!" -ForegroundColor Green

