// Subscribe to new finalized blocks
await api.rpc.chain.subscribeFinalizedHeads((block) => {
    console.log(block.toJSON());
})
