// Subscribe to new finalized blocks
await api.rpc.chain.subscribeNewHeads(async (header) => {
    let parentHash = header.parentHash;
    let block = (await api.rpc.chain.getBlock(parentHash));
    for (extrinsic of block.block.extrinsics) {
        let method = extrinsic.method.method;
        if (method == 'remark') {
            console.log(`${extrinsic.signer.toString()} says:`);
            console.log(`--- ${utils.hexToString(extrinsic.method.args[0].toHex())} ---\n\n`);
        }
    }
});
