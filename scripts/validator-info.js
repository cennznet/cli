let candidates = (await api.query.staking.validators.keys()).map(({ args: [stashId] }) => keyring.encodeAddress(stashId));
let electedStashes = (await api.query.staking.currentElected()).toJSON();
let electedStashControllers = (await api.query.staking.bonded.entries()).reduce((map, [stash, controller]) => {
    if (electedStashes.includes(stash.toHuman()[0])) {
        map[stash.toHuman()[0]] = controller.toHuman();
    }
    return map;
}, {});
let sessionKeys = await api.query.session.queuedKeys();

console.log("elected stash + controllers: ", electedStashControllers);
console.log("elected session keys: ", sessionKeys.toJSON());
console.log("next candidate stashes: ", candidates);