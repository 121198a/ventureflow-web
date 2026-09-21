// PM2 process management configuration for Hostinger VPS, Linux VPS,
// DigitalOcean Droplets, Hetzner Cloud, and other Node.js hosting environments.
// Usage:
//   pm2 start ecosystem.config.cjs
//   pm2 save
//   pm2 startup

const fs = require('fs');
const path = require('path');

// Prefer standalone server if built with output: 'standalone', otherwise fall back to next start
const standaloneScript = path.join(__dirname, '.next', 'standalone', 'server.js');
const hasStandalone = fs.existsSync(standaloneScript);

module.exports = {
  apps: [
    {
      name: 'ventureflow-web',
      script: hasStandalone ? standaloneScript : 'node_modules/next/dist/bin/next',
      args: hasStandalone ? '' : 'start',
      cwd: __dirname,
      instances: 1, // Single instance suitable for 512MB-1GB RAM VPS; scale to 'max' for multi-core CPUs
      autorestart: true,
      watch: false,
      max_memory_restart: '350M', // Auto-restart if memory exceeds 350MB (crucial for student-budget VPS)
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      time: true,
    },
  ],
};
