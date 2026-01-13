import os from 'os';

export function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }

  return 'localhost';
}

export const HOST =
  process.env.HOST ||
  getLocalIP();
