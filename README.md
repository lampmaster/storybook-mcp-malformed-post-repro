# Storybook MCP: malformed POST to /mcp stops `storybook dev`

Minimal React + Vite Storybook 10.6.7 with `@storybook/addon-mcp` 10.6.7, which resolves
`@tmcp/transport-http` 0.8.6.

## Steps

```sh
npm install
npm run storybook   # storybook dev -p 6006 --ci
```

In another terminal, send any one of these:

```sh
# 1. body is JSON null
curl -s -i -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' \
  http://127.0.0.1:6006/mcp -d 'null'

# 2. message without "jsonrpc"
curl -s -i --max-time 10 -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' \
  http://127.0.0.1:6006/mcp -d '{"id":1,"method":"tools/list"}'

# 3. batch
curl -s -i --max-time 10 -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' \
  http://127.0.0.1:6006/mcp -d '[{"jsonrpc":"2.0","id":1,"method":"tools/list"}]'
```

## Result

- 1 answers `400` with a JSON-RPC parse error, then the dev server exits with code 1 on
  `TypeError: Cannot read properties of null (reading 'method')` from
  `@tmcp/transport-http/src/index.js`.
- 2 and 3 get no response (`curl: (52) Empty reply from server`) and the dev server exits
  with code 1 on a `ValiError` thrown from `tmcp`'s `McpServer.receive`.

## With the fix

Add this to `package.json` and run `npm install` again:

```json
"overrides": { "@tmcp/transport-http": "0.9.1" }
```

All three requests then get a `400` JSON-RPC `Invalid Request` error and the dev server keeps
running. Normal MCP clients keep working.
