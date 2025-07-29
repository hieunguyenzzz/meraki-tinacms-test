#!/usr/bin/env node

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function buildWithApi() {
  console.log('🚀 Starting build process...');
  
  try {
    // Run TinaCMS build (it will use the local database now)
    console.log('🔨 Running TinaCMS build...');
    const tinaBuild = spawn('npx', ['tinacms', 'build', '--local', '--skip-cloud-checks'], {
      stdio: 'inherit'
    });

    await new Promise((resolve, reject) => {
      tinaBuild.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`TinaCMS build failed with code ${code}`));
        }
      });
    });

    console.log('✅ TinaCMS build completed');

    // Run Remix build
    console.log('🔨 Running Remix build...');
    const remixBuild = spawn('npm', ['run', 'build'], {
      stdio: 'inherit'
    });

    await new Promise((resolve, reject) => {
      remixBuild.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Remix build failed with code ${code}`));
        }
      });
    });

    console.log('✅ Build process completed successfully!');

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildWithApi().catch(console.error);