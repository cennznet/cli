console.log("**********");
console.log("\u001b[34mNode Info\u001b[37m");
console.log("**********");

api.rpc.system.chain().then(c => console.log(`chain: ${c.toHuman()}`));
api.rpc.system.nodeRoles().then(r => console.log(`role: ${r[0]}`));
api.rpc.system.version().then(v => console.log(`client version: ${v.toHuman()}`));
api.rpc.system.localPeerId().then(p => console.log(`peer id: ${p.toHuman()}`));

activeSessionKeys = (await api.query.session.queuedKeys());
activeSessionKeys.map(async ([stash, [gran, audi, imon, babe]]) => {
    let match = [
        (await api.rpc.author.hasKey(babe, 'babe')).toHuman(),
        (await api.rpc.author.hasKey(imon, 'imon')).toHuman(),
        (await api.rpc.author.hasKey(audi, 'audi')).toHuman(),
        (await api.rpc.author.hasKey(gran, 'gran')).toHuman(),
    ];
    if (match.every(v => v == true)) {
        console.log(">>> \u001b[32mACTIVE\u001b[37m validator <<<");
        console.log(`connected to stash 💰: ${stash}\nwith session keys: \n babe 👶: ${babe}\n imon 💓: ${imon}\n audi 🚘: ${audi}\n gran 👴: ${gran}\n`);
        return
    }
});
