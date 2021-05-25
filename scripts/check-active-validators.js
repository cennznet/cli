// Go from this block backwards by hours and log the validator set
// commission = 25%
// 0x0ee6b280
let start = 6762881;

while(start > 6740000) {
    let blockHash = (await api.rpc.chain.getBlockHash(start));
    let block = (await api.rpc.chain.getBlock(blockHash));
    let validators = await api.query.session.validators.at(block.block.header.hash);

    console.log(start);
    console.log(validators.toJSON());
    console.log(validators.length);
    start -= 1440;
}