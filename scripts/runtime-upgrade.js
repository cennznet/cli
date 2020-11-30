// A cennz-cli script to upgrade the connected chain runtime
// Usage:
// ./bin/cennz-cli script ./scripts/runtime-upgrade.js //<sudo URI> </path/to/new-runtime.wasm>

const fs = require('fs');
var myArgs = process.argv.slice(3);

// <<< Change this sudo key to match you network >>>
keyring.Keyring({type: 'sr25519'}).addFromUri(myargs[1]);
const wasm = fs.readFileSync(myargs[2]);
const wasmHex = `0x${wasm.toString('hex')}`;
await api.tx.sudo.sudo(api.tx.system.setCode(wasmHex)).signAndSend(sudo);
