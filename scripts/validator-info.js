let spendingAssetId = (await api.query.genericAsset.spendingAssetId());
let epochDuration = (await api.consts.babe.epochDuration);
let genesisSlot = (await api.query.babe.genesisSlot());

let centralityStashes = [
    "5CFNYab6UKkZJ87WpW3WVbG8huwpKczvCYpZyrwH37uFj2QM",
    "5CouA8pyo3d5g3rxCL3GxM3tbtMnoUkatxCDFtqmC9u8odgf",
    "5FpNQ5NfhhRMyE1BMCy7fwPXHtd8ht6mME64AFr58y2ehesc",
    "5FH8TLGKiGKxrv94QcvcCarpUhRL8jjXWPntDScXiibeRg7u",
    "5Cm8JHz75TZw5GAAwVV99qFJKPYtxXsP2hn811WpWLo4UDjG"
];

let inactiveBridgeKeys = [
    '0x0292a9a1742ff8688c528910b45e2bbcb4d29a909c706af5ee7e54f212fab7007a',
    '0x034f07e14e8ebf3fbc848d68baea2147588445573bf6ef35d2c4f4159c80ae1d8f',
    '0x03f59a2ce4a802a4f9195b81a05b8c4469be8cb8ea816ae7b687248ed0d82790e4',
    '0x03b6abc46c040d7089acba8cbc2cdaa6ee126d5e8d66f3040dc9df4d4ba2501fe2',
    '0x02781b15d9ffef7cf39ad8ec21cb91e440c74deacc8b591bfb4258b0a8be1d7c77',
    '0x02b018cc86dac180b8f310af90b31c005e32fdfaff0056d1299789b08187a8dfae',
    '0x03ea1f4571d751b238b95826fa75d84fdd797c68fb63a10eb01f33ef4797c477e1',
    '0x03127dfffd400f7ca8e14e4ac985c024fdeeeb5c328185a4fea8dbf5364f1110f4',
    '0x02477fb9dafea26cb7b4dc7a7a731392d9cd8ce4c228601c7488dfc4df4baeb3e6',
    '0x03edde3c8b9f14e4c418d0d7c8a468bc87369d5eafcd618553a8ad1dba42bea5b8',
    '0x027013993315b6b46c80a3a9fb337627d35a23391cbec8378c1d62372a5a8cfd75'
];

while(true) {
    let finalizedBlock = (await api.rpc.chain.getFinalizedHead());
    let electedStashes = (await api.query.session.validators()).toJSON();

    // find controllers
    let stashInfo = (await api.query.staking.bonded.entries()).reduce((map, [stash, controller]) => {
        if (electedStashes.includes(stash.toHuman()[0])) {
            map[stash.toHuman()[0]]= { "controller": controller.toHuman() };
        }
        return map;
    }, {});

    // in next round?
    let nextRoundCandidates = (await api.query.staking.validators.keys()).map(({ args: [stashId] }) => keyring.encodeAddress(stashId));
    for (const [stash, _info] of Object.entries(stashInfo)) {
        stashInfo[stash].candidate = nextRoundCandidates.includes(stash) ? "✅" : "❌";
        stashInfo[stash].centrality = centralityStashes.includes(stash);
    }

    // get blocks/online info
    // let sessionIndex = await api.query.session.currentIndex();
    // for (let i = 0; i < electedStashes.length; i++) {
    //     let stash = electedStashes[i];
    //     let nBlocks = (await api.query.imOnline.authoredBlocks(sessionIndex, stash));
    //     stashInfo[stash].blocks = nBlocks > 0 ? nBlocks.toNumber() : "❌";
    //     // get controller cpay balance
    //     let cpayBalance = (await api.query.genericAsset.freeBalance(spendingAssetId, stashInfo[stash].controller)).toBn() / 10000;
    //     stashInfo[stash].controllerCpay = cpayBalance;
    // }

    let activeSessionKeys = (await api.query.session.queuedKeys());
    activeSessionKeys.map(async ([stash, [gran, audi, imon, babe, bridge]]) => {
        if (inactiveBridgeKeys.includes(bridge.toHex())) {
            stashInfo[stash]['active'] = '❌';
        } else {
            stashInfo[stash]['active'] = '✅';
        }
        stashInfo[stash]['sk:gran(ss58)'] = gran.toString();
        stashInfo[stash]['sk:babe(ss58)'] = babe.toString();
        stashInfo[stash]['sk:bridge(ss58)'] = bridge.toString();
    });

    let currentSlot = (await api.query.babe.currentSlot());
    const epochStartSlot = (await api.query.babe.epochIndex()).mul(epochDuration).iadd(genesisSlot);
    console.clear();
    console.log(`Session progress: ${currentSlot.sub(epochStartSlot)} / ${epochDuration}`);
    console.log(`Finalized block: ${finalizedBlock}`);

    console.table(stashInfo);
}
