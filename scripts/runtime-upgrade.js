// A cennz-cli script to upgrade the connected chain runtime
// Usage:
// ./bin/cennz-cli script ./scripts/runtime-upgrade.js //<sudo URI> </path/to/new-runtime.wasm>

const myArgs = process.argv.slice(3);

console.log(myArgs)

const sudo = (new keyring.Keyring({ type: 'sr25519' })).addFromUri(myArgs[0]);
const wasm = fs.readFileSync(myArgs[1]);
const wasmHex = `0x${wasm.toString('hex')}`;
const setCode = api.tx.system.setCode(wasmHex);
const scheduler = api.tx.sudo.sudo(api.tx.scheduler.scheduleAfter(10, null, 0, setCode));
await scheduler.signAndSend(sudo, ({ status, events }) => {
	if (status.isInBlock) {
		events.forEach(({ event: { data, method } }) => {
			console.log('method::', method.toString());
			console.log('data::', data.toString());
		});
	}

	if (status.isFinalized) {
		process.exit()
	}
});


