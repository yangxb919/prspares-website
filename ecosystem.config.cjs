module.exports = {
  apps: [
    {
      name: 'prspares-website',
      cwd: '.',
      script: 'node_modules/next/dist/bin/next',
      // deploy.yml 传入 nvm 当前 node 的绝对路径；否则 pm2 会沿用守护进程自己的旧 node
      interpreter: process.env.PM2_NODE_INTERPRETER || 'node',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};

