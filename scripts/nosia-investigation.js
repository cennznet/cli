// block where Nosia validator active
let start = 12168119;
let end = 12168119 + 5;
let current = start;
let nosiaStash = '5CS75e1T3PcDYpijPQdjwYqpf4LVH6sV8HByAo4unhaanewo';
// Nosia got slashed here for 0.42%
let nosiaSlashEra = 8316;
let slashEraBlockHash;

// nosia has nominators here
// │ blockHeight │                               12170108                               │
// │  blockHash  │ '0x1d44e84dd6e3a381571b79dcdbfc2d28ac703dde65c472032a3220fdde25c596' │
// │ currentEra  │                                 8316

// Nosia was offline in these blocks:
// 12168016
// 12168119
// Still had nominators in block 12168121
for(var i = start; i < end; i++) {
    console.log(`block: ${current}`);
    let blockHash = (await api.rpc.chain.getBlockHash(current)).toString();
    // console.log(blockHash);
    let currentEra = (await api.query.staking.currentEra.at(blockHash)).unwrap().toNumber();
    // console.log(`current era: ${currentEra}`);
    // if (currentEra === nosiaSlashEra && !slashEraBlockHash) {
    //     slashEraBlockHash = blockHash;
    // }
    let exposure = (await api.query.staking.erasStakersClipped.at(blockHash, currentEra, nosiaStash));
    console.table({
        'blockHeight': current,
        'blockHash': blockHash.toString(),
        'currentEra': currentEra,
    });
    console.log(exposure.toJSON());
    current += 17000;
}

console.log("slashEraBlockHash.toString()");