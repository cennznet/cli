let spendingAssetId = (await api.query.genericAsset.spendingAssetId());
let epochDuration = (await api.consts.babe.epochDuration);
let genesisSlot = (await api.query.babe.genesisSlot());

while(true) {
    let finalizedBlock = (await api.rpc.chain.getFinalizedHead());
    let electedStashes = (await api.query.staking.currentElected()).toJSON();

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
    }

    // let disabledValidators = (await api.query.session.disabledValidators());
    // console.log(disabledValidators.toJSON());
    let sessionKeys = await api.query.session.queuedKeys();

    // get grandpa info
    let grandpaVoteInfo = (await api.rpc.grandpa.roundState()).toJSON();
    let noVotes = grandpaVoteInfo.best.prevotes.missing;
    let noPrecommits = grandpaVoteInfo.best.precommits.missing;
    sessionKeys.map(([stash, sessionKeys]) => {
        stashInfo[stash].voted = "✅";
        stashInfo[stash].precommited = "✅";
        if (noVotes.includes(sessionKeys[0].toHuman())) {
            stashInfo[stash].voted = "-";
        }
        if (noPrecommits.includes(sessionKeys[0].toHuman())) {
            stashInfo[stash].precommited = "-";
        }
    });

    // get blocks/online info
    let sessionIndex = await api.query.session.currentIndex();
    for (i = 0; i < electedStashes.length; i++) {
        let stash = electedStashes[i];
        let nBlocks = (await api.query.imOnline.authoredBlocks(sessionIndex, stash));
        stashInfo[stash].blocks = nBlocks > 0 ? nBlocks.toNumber() : "❌";
        // get controller cpay balance
        let cpayBalance = (await api.query.genericAsset.freeBalance(spendingAssetId, stashInfo[stash].controller)).toNumber() / 10000;
        stashInfo[stash].controllerCpay = cpayBalance;
    }


    let currentSlot = (await api.query.babe.currentSlot());
    const epochStartSlot = (await api.query.babe.epochIndex()).mul(epochDuration).iadd(genesisSlot);

    console.clear();
    console.log(`Session progress: ${currentSlot.sub(epochStartSlot)} / ${epochDuration}`);
    console.log(`Finalized block: ${finalizedBlock}`);

    console.table(stashInfo);
}