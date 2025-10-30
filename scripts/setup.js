#!/usr/bin/env node

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Entity Manager Setup Script')
console.log('=============================')
console.log()

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local file not found!')
  console.log('📝 Creating .env.local from template...')

  const envTemplate = `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development

# JWT Configuration (Optional - for client-side validation)
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key`

  fs.writeFileSync(envPath, envTemplate)
  console.log('✅ .env.local created successfully!')
  console.log('🔧 Please update the environment variables as needed.')
  console.log()
}

console.log('🔍 Running project health checks...')
console.log()

// Run type checking
console.log('1. TypeScript type checking...')
const typeCheck = spawn('npm', ['run', 'type-check'], { stdio: 'inherit', shell: true })

typeCheck.on('close', (code) => {
  if (code === 0) {
    console.log('✅ TypeScript check passed!')
  } else {
    console.log('❌ TypeScript check failed!')
  }

  // Run linting
  console.log('2. ESLint checking...')
  const lint = spawn('npm', ['run', 'lint'], { stdio: 'inherit', shell: true })

  lint.on('close', (lintCode) => {
    if (lintCode === 0) {
      console.log('✅ ESLint check passed!')
    } else {
      console.log('❌ ESLint check failed!')
    }

    console.log()
    console.log('🎉 Setup complete!')
    console.log('📋 Available commands:')
    console.log('  npm run dev         - Start development server')
    console.log('  npm run build       - Build for production')
    console.log('  npm run start       - Start production server')
    console.log('  npm run check-all   - Run all checks')
    console.log()

    process.exit(code === 0 && lintCode === 0 ? 0 : 1)
  })
})