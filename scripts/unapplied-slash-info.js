let eraIndex = (await api.query.staking.currentEra()).toNumber();


let unappliedSlashes = []
let eras = []
// find our last known slash
while(eraIndex > 7900) {
    console.log(eraIndex);
    let u = (await api.query.staking.unappliedSlashes(eraIndex));
    let l = u.length;
    if(l > 0) {
       	let indices = [...Array(l).keys()];
        eras.push(eraIndex);
	// let call = api.tx.staking.cancelDeferredSlash(eraIndex, indices);
	// await api.tx.sudo.sudo(call).signAndSend(sudo);
    	console.log(`${l} validators slashed at ${eraIndex}`);
    }
    eraIndex -= 1;
}

