// Simple script to check if the server is running
import http from 'http';

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('Server is running and accessible! ✅');
    process.exit(0);
  } else {
    console.log(`Server responded with status ${res.statusCode} ❌`);
    process.exit(1);
  }
});

req.on('error', (e) => {
  console.error(`Server check failed: ${e.message} ❌`);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timed out. Server not responding. ❌');
  req.destroy();
  process.exit(1);
});

req.end();