#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

const { spawn } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🚀 My_landlord Frontend Development Server')
console.log('===================================')
console.log()
console.log('Choose your development mode:')
console.log('1. Standard mode (next dev)')
console.log('2. Turbopack mode (next dev --turbopack) - recommended')
console.log('3. Production build')
console.log('4. Run type checking')
console.log('5. Run linting')
console.log('6. Setup project')
console.log()

rl.question('Enter your choice (1-6): ', (answer) => {
  let command
  
  switch (answer) {
    case '1':
      console.log('Starting with standard Next.js development mode...')
      command = spawn('npm', ['run', 'dev:standard'], { stdio: 'inherit', shell: true })
      break
    case '2':
      console.log('Starting with Turbopack mode (recommended)...')
      command = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })
      break
    case '3':
      console.log('Building for production...')
      command = spawn('npm', ['run', 'build:production'], { stdio: 'inherit', shell: true })
      break
    case '4':
      console.log('Running TypeScript type checking...')
      command = spawn('npm', ['run', 'type-check'], { stdio: 'inherit', shell: true })
      break
    case '5':
      console.log('Running ESLint...')
      command = spawn('npm', ['run', 'lint'], { stdio: 'inherit', shell: true })
      break
    case '6':
      console.log('Setting up project...')
      command = spawn('npm', ['run', 'setup'], { stdio: 'inherit', shell: true })
      break
    default:
      console.log('Starting with Turbopack mode (default)...')
      command = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true })
  }
  
  command.on('error', (error) => {
    console.error('Failed to start development server:', error.message)
    process.exit(1)
  })
  
  command.on('close', (code) => {
    if (code !== 0 && answer !== '4' && answer !== '5' && answer !== '6') {
      console.error(`Development server exited with code ${code}`)
      process.exit(code)
    } else if (code === 0 && (answer === '4' || answer === '5' || answer === '6')) {
      console.log('✅ Operation completed successfully!')
      process.exit(0)
    }
  })
  
  rl.close()
})