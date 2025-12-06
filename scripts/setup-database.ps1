# Skintellect Database Setup Script for Windows
# Run this after setting up your .env.local file

Write-Host "🚀 Skintellect Database Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-Not (Test-Path ".env.local")) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create .env.local with your database credentials:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host 'DATABASE_URL="postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"'
    Write-Host 'DIRECT_URL="postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"'
    Write-Host 'NEXT_PUBLIC_SITE_URL="http://localhost:3000"'
    Write-Host ""
    exit 1
}

Write-Host "✅ Found .env.local" -ForegroundColor Green
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "📦 Step 1/3: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Step 2: Push schema to database
Write-Host "🗄️ Step 2/3: Pushing schema to database..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push schema to database" -ForegroundColor Red
    Write-Host "   Make sure your DATABASE_URL is correct!" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Schema pushed to database" -ForegroundColor Green
Write-Host ""

# Step 3: Seed database
Write-Host "🌱 Step 3/3: Seeding database with sample data..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database seeded" -ForegroundColor Green
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run dev"
Write-Host "  2. Visit: http://localhost:3000/products/cosrx-advanced-snail-92-cream"
Write-Host ""

