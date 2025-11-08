#!/usr/bin/env node

const { spawn } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🚀 My_landlord Frontend Deployment Script')
console.log('==================================')
console.log()
console.log('Choose deployment target:')
console.log('1. Vercel (recommended)')
console.log('2. Netlify')
console.log('3. Local production build')
console.log('4. Export static site')
console.log()

rl.question('Enter your choice (1-4): ', (answer) => {
  let command
  
  switch (answer) {
    case '1':
      console.log('Deploying to Vercel...')
      console.log('Make sure you have Vercel CLI installed: npm i -g vercel')
      command = spawn('vercel', ['--prod'], { stdio: 'inherit', shell: true })
      break
    case '2':
      console.log('Deploying to Netlify...')
      console.log('Make sure you have Netlify CLI installed: npm i -g netlify-cli')
      command = spawn('netlify', ['deploy', '--prod'], { stdio: 'inherit', shell: true })
      break
    case '3':
      console.log('Building for local production...')
      command = spawn('npm', ['run', 'build:production'], { stdio: 'inherit', shell: true })
      break
    case '4':
      console.log('Exporting static site...')
      command = spawn('npm', ['run', 'export'], { stdio: 'inherit', shell: true })
      break
    default:
      console.log('Invalid choice. Building for local production...')
      command = spawn('npm', ['run', 'build:production'], { stdio: 'inherit', shell: true })
  }
  
  command.on('error', (error) => {
    console.error('Deployment failed:', error.message)
    process.exit(1)
  })
  
  command.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Deployment completed successfully!')
      if (answer === '3') {
        console.log('🚀 Run "npm start" to test the production build locally.')
      }
    } else {
      console.error(`❌ Deployment failed with code ${code}`)
      process.exit(code)
    }
  })
  
  rl.close()
})
