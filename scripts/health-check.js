#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const path = require('path')

console.log('🔍 Entity Manager Health Check')
console.log('=============================')
console.log()

let allGood = true

// Check for essential files
const essentialFiles = [
  '.env.local',
  'package.json',
  'tailwind.config.ts',
  'tsconfig.json',
  'next.config.ts',
  'postcss.config.mjs'
]

essentialFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file} exists`)
  } else {
    console.log(`❌ ${file} is missing`)
    allGood = false
  }
})

// Check for essential directories
const essentialDirs = [
  'app',
  'components',
  // 'hooks',
  // 'utils',
  'types',
  // 'contexts',
  'scripts'
]

essentialDirs.forEach(dir => {
  if (fs.existsSync(path.join(process.cwd(), dir))) {
    console.log(`✅ ${dir}/ directory exists`)
  } else {
    console.log(`❌ ${dir}/ directory is missing`)
    allGood = false
  }
})

// Check node_modules
if (fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
  console.log('✅ node_modules exists')
} else {
  console.log('❌ node_modules is missing - run "npm install"')
  allGood = false
}

console.log()

if (allGood) {
  console.log('🎉 All checks passed! Your project is properly set up.')
  console.log('🚀 Run "npm run dev" to start development.')
} else {
  console.log('⚠️  Some issues were found. Please address them before continuing.')
  console.log('🔧 Run "npm run setup" to fix common issues.')
}

console.log()
process.exit(allGood ? 0 : 1)