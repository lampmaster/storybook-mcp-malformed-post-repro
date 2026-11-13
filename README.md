# addon-mcp: a bad request to /mcp crashes `storybook dev`

Plain Storybook 10.6.7 with `@storybook/addon-mcp`.

1. `npm install && npm run storybook`
2. In another terminal:

```sh
curl -i http://127.0.0.1:6006/mcp -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' -d 'null'
```

3. You get a 400, then `storybook dev` exits with code 1.

The same happens with `-d '{"id":1,"method":"tools/list"}'` (no `jsonrpc`) or a batch `-d '[{"jsonrpc":"2.0","id":1,"method":"tools/list"}]'`.

**Fix:** add `"overrides": { "@tmcp/transport-http": "0.9.1" }` to `package.json` and run `npm install` again. The server now answers 400 and keeps running.
