let keyring_ = new keyring.Keyring({ 'type': 'sr25519' });

// Make a few validator accounts
let validators = [
    keyring_.addFromUri('//Alice//stash'),
//     keyring_.addFromUri('//Bob//stash'),
//     keyring_.addFromUri('//Charlie//stash'),
//     keyring_.addFromUri('//Dave//stash'),
//     keyring_.addFromUri('//Eve//stash'),
//     keyring_.addFromUri('//Ferdie//stash'),
];

let validatorAddresses = validators.map(v => v.address.toString());

validators.map(async(v, i) => {
    if (i == 0) {
        (await api.tx.genericAsset.mint(16000, v.address, 10000000 * 10000).signAndSend(v));
        (await api.tx.genericAsset.mint(16001, v.address, 10000000 * 10000).signAndSend(v));
    }
});

//     // await api.tx.utility.batch([
//     //     api.tx.staking.bond(v.address, 100000, 'stash'),
//     //     api.tx.staking.validate({'commission': '0x'})
//     // ]).signAndSend(v);
//     console.log(`staked validator: ${v.address}`);
// });

let nominators = []
for (var i = 1; i <= 1000; i++) {
    let nominator = keyring_.addFromUri(`//$Nominator-${i}`);
    var stake = 100000 + i;
    await api.tx.utility.batch([
        api.tx.genericAsset.mint(16000, nominator.address, stake),
        api.tx.genericAsset.mint(16001, nominator.address, 1000000)
    ]).signAndSend(toyKeyring.alice, async ({status}) => {
        if (status.isFinalized) {
            console.log(`funded nominator: ${nominator.address}, stake: ${stake}`);
            await api.tx.utility.batch([
                api.tx.staking.bond(nominator.address, stake, 'stash'),
                api.tx.staking.nominate([validators[0].address.toString()])
            ]).signAndSend(nominator, ({status}) => {
                if (status.isInBlock) {
                    console.log(`staked nominator: ${nominator.address}`);
                }
            })
        }
    });

    // A terrible sleep
    for (var j = 1; j <= 1000; j++) {}

    nominators.push(nominator);
}