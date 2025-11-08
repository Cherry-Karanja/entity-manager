#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

const { spawn } = require('child_process')

console.log('🏗️  My_landlord Frontend Production Build')
console.log('==================================')
console.log()

console.log('1. Running pre-build checks...')

// Run type checking first
const typeCheck = spawn('npm', ['run', 'type-check'], { stdio: 'inherit', shell: true })

typeCheck.on('close', (typeCode) => {
  if (typeCode !== 0) {
    console.error('❌ TypeScript check failed! Build aborted.')
    process.exit(1)
  }
  
  console.log('✅ TypeScript check passed!')
  
  // Run linting
  console.log('2. Running ESLint...')
  const lint = spawn('npm', ['run', 'lint'], { stdio: 'inherit', shell: true })
  
  lint.on('close', (lintCode) => {
    if (lintCode !== 0) {
      console.error('❌ ESLint check failed! Build aborted.')
      process.exit(1)
    }
    
    console.log('✅ ESLint check passed!')
    
    // Clean previous build
    console.log('3. Cleaning previous build...')
    const clean = spawn('npm', ['run', 'clean:cache'], { stdio: 'inherit', shell: true })
    
    clean.on('close', () => {
      console.log('✅ Build cache cleaned!')
      
      // Start build
      console.log('4. Building application...')
      const build = spawn('npm', ['run', 'build'], { stdio: 'inherit', shell: true })
      
      build.on('close', (buildCode) => {
        if (buildCode === 0) {
          console.log()
          console.log('🎉 Build completed successfully!')
          console.log('📦 Your application is ready for production.')
          console.log('🚀 Run "npm start" to start the production server.')
        } else {
          console.error('❌ Build failed!')
          process.exit(1)
        }
      })
    })
  })
})
