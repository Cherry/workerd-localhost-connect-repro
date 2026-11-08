# workerd localhost connect() repro

On Windows, `connect()` from `cloudflare:sockets` to `localhost` takes about 2 seconds since wrangler 4.135.0 (workerd 1.20260918.1, the Rust I/O backend), when the server listens on `127.0.0.1` only.

```sh
node server.mjs                      # listens on 127.0.0.1:39999
npx wrangler@4.134.0 dev --port 8781
npx wrangler@4.135.0 dev --port 8782
curl "http://127.0.0.1:8781/?host=localhost"
curl "http://127.0.0.1:8782/?host=localhost"
```

`node server.mjs ::1` listens on `::1` instead, and `?host=127.0.0.1` connects to the IPv4 address directly.

Results on Windows 11, Node 26 (time until `socket.opened`):

| Server on | Connect to | 4.134.0 | 4.135.0, 4.156.0 |
| --- | --- | --- | --- |
| `127.0.0.1` | `localhost` | 1-7ms | 2038-2061ms |
| `::1` | `localhost` | 2049-2064ms | 3-7ms |
| `127.0.0.1` | `127.0.0.1` | 0-6ms | 1-7ms |

`localhost` resolves to `::1`, then `127.0.0.1`. The new backend tries them in that order, the old one tried `127.0.0.1` first, and neither races them, so whichever is wrong costs Windows' ~2s refused-connection timeout on every connect.
