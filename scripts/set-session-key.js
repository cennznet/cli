/*

# How to run
1. Please place the sessions.yaml in the root folder of this repo.
2. `./bin/cennz-cli --endpoint='nikau' --run='scripts/set-session-key.js'`

# TODOs:
1. bring the session config to be a argument of the cli
2. import the result returned from the api.tx.session.seKeys()

```
####################################
#
# Example of sessions.yaml content
#
####################################
---
validator-host-name:
    sr_secret_key: "0x00000000000000000000"
    sr_pub_key: "0x00000000000000000000"
    ed_secret_key: "0x00000000000000000000"
    ed_pub_key: "0x00000000000000000000"
    ec_secret_key: "0x00000000000000000000"
    ec_pub_key: "0x00000000000000000000"
```

*/


function load_session_config(config_path){
    try {
        let fileContents = fs.readFileSync(config_path, 'utf8');
        let data = yaml.load(fileContents);
        return data;
    } catch (e) {
        console.log(e);
    }
}

function trim_hex(s){
    return s.replace(/^0x/, '');
}

function concate_session_keys(keys){
    let ed_key = trim_hex(keys.ed_pub_key);
    let sr_key = trim_hex(keys.sr_pub_key);
    let ec_key = trim_hex(keys.ec_pub_key);
    return "0x"+ed_key+sr_key.repeat(3)+ec_key;
}

function setKeys(private_key, session_key){
    let hexToU8a  = utils.default.hexToU8a;
    let keys = new keyring.Keyring({'type': 'sr25519'});
    let proof = '0x';
    let signer = keys.addFromSeed(hexToU8a(private_key));

    // console.log(private_key)
    // console.log(signer)
    // console.log(session_key)

    api.tx.session
        .setKeys(session_key, proof)
        .signAndSend(signer)
        .then(res => console.log('res:',res));
}

const data = load_session_config('./sessions.yaml')

Object.keys(data).forEach(function(key){
    let keySet = data[key];
    let session_key = concate_session_keys(keySet);

    setKeys(keySet.sr_secret_key, session_key);
});