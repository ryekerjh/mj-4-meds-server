import { createServer } from 'http';

const port = '127.0.0.1'
createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello People\n');
}).listen(3003, port)

console.log('The Server is running at', port);
