
import { dev } from 'astro';
const server = await dev({
  root: 'C:/Users/Admin/Desktop/Centedge/Centedge Web Rebuild/centedge-astro',
  server: { port: 5000, host: true }
});
console.log('Server started programmatically on port', server.address.port);
