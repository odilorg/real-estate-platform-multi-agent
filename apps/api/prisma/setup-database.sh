#!/bin/bash

# Database Setup Script for Real Estate Platform
# This script helps set up the PostgreSQL database with Prisma

echo "=== Real Estate Platform - Database Setup ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  echo "Please ensure .env file exists with DATABASE_URL configured"
  exit 1
fi

echo "DATABASE_URL is configured"
echo ""

# Check if PostgreSQL is accessible
echo "Checking PostgreSQL connection..."
npx prisma db execute --stdin <<SQL
SELECT 1;
SQL

if [ $? -ne 0 ]; then
  echo ""
  echo "ERROR: Cannot connect to PostgreSQL database"
  echo ""
  echo "Please ensure PostgreSQL is running:"
  echo "  docker-compose -f ../../infra/docker-compose.dev.yml up -d postgres"
  echo ""
  exit 1
fi

echo "PostgreSQL connection successful!"
echo ""

# Apply migrations
echo "Applying database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo ""
  echo "ERROR: Migration failed"
  exit 1
fi

echo ""
echo "Migrations applied successfully!"
echo ""

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo ""
  echo "ERROR: Prisma Client generation failed"
  exit 1
fi

echo ""
echo "=== Database Setup Complete ==="
echo ""
echo "You can now:"
echo "  - Run 'npx prisma studio' to view your database"
echo "  - Start the API server with 'npm run dev'"
echo ""
