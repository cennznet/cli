# cennz-cli

Minimal REPL env for the CENNZnet API

```bash
# Usage:
./bin/cennz-cli \
  --endpoint=<ws://<host>:<port>|nikau|mainnet> \
  --types=</path/to/types.json> \
  --run=</path/to/customScript.js>
```

## Type creation / decoding
The REPL provides type decoding utilites
```js
const decodedBalance = utils.createType('Balance', 0x12);
```
