import { connect } from 'cloudflare:sockets';

export default {
	async fetch(request) {
		const hostname = new URL(request.url).searchParams.get('host') ?? 'localhost';
		const openedMs = [];
		for (let i = 0; i < 5; i++) {
			const started = Date.now();
			const socket = connect({ hostname, port: 39999 });
			await socket.opened;
			openedMs.push(Date.now() - started);
			await socket.close();
		}
		return Response.json({ hostname, openedMs });
	},
};
