// A cennz-cli script to upgrade the connected chain runtime
// Usage:
// ./bin/cennz-cli --run=./scripts/runtime-upgrade.js //<sudo URI> </path/to/new-runtime.wasm>

const [_unused, sudoUri, wasmPath] = process.argv.slice(3);
// <<< Change this sudo key to match you network >>>
let ua = utils.hexToU8a(sudoUri);
let sudo = (new keyring.Keyring({type: 'sr25519'})).addFromSeed(ua);
console.log(sudo.address);
const wasm = fs.readFileSync(wasmPath);
const wasmHex = `0x${wasm.toString('hex')}`;
const targetBlockNumber = (await api.rpc.chain.getHeader()).toJSON().number + 10;

await api.tx.sudo.sudo(
    api.tx.scheduler.schedule(targetBlockNumber, null, 0, api.tx.system.setCode(wasmHex))
).signAndSend(sudo);

process.exit();
