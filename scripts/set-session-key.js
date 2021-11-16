// Example to set session key
let keys = new keyring.Keyring({'type': 'sr25519'});
const keys_ = "KEY TO INSERT";
const proof = "PROOF TO ADD";
    const hexToU8a  = utils.default.hexToU8a;
    console.log('hexToU8a',hexToU8a);
    const seed = hexToU8a('UR SEED');
    const signer = keys.addFromSeed(seed);


    api.tx.session.setKeys(
        keys_, proof
    ).signAndSend(signer).then(res => console.log('res:',res));
