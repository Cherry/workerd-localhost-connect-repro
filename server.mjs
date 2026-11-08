// Echo server on IPv4 loopback only, as Docker publishes ports by default.
import net from 'node:net';

const host = process.argv[2] ?? '127.0.0.1';
net.createServer(socket => socket.pipe(socket)).listen(39999, host, () => console.log(`echo server on ${host}:39999`));
