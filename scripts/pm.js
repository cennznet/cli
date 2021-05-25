const fs = require('fs');
var blockInfo = {}

for(var i = 5613853; i < 5613916; i++) {
    var b = (await api.rpc.chain.getBlockHash(i))
    let author = (await api.derive.chain.getHeader(b)).author.toHuman();
    var block = (await api.rpc.chain.getBlock(b));
    (await api.derive.chain.getHeader(b)).author.toHuman()
    var header = block.block.header.hash.toHex();

    // let events = (await api.query.system.events.at(header.hash.toHex()))
    let time = (await api.query.timestamp.now.at(header)).toHuman();
    let lateness = (await api.query.babe.lateness.at(header)).toString();
    let stalled = (await api.query.grandpa.stalled.at(header)).toString();
    let currentEra = (await api.query.staking.currentEra.at(header)).toNumber();
    let currentEraStart = (await api.query.staking.currentEraStartSessionIndex.at(header)).toNumber();
    let sessionIndex = (await api.query.session.currentIndex.at(header)).toNumber();
    let finalizedBlock = (await api.rpc.chain.getFinalizedHead(header)).toNumber();

    console.log('block no', i);
    console.log('author', author);
    console.log('time', time);
    console.log('stalled', stalled);
    console.log('current era', currentEra);
    console.log('current era start', currentEraStart);
    console.log('current session index', sessionIndex);
    console.log('finalized block', finalizedBlock);
    blockInfo[i] = {
        time,
        author,
        lateness,
        stalled,
        currentEra,
        currentEraStart,
        sessionIndex,
    }
}

console.log('writing to file....');
let output = JSON.stringify(blockInfo);
fs.writeFileSync('./march-6-block-data.json', output);
console.log('done.');
