let k = new keyring.Keyring({type: 'sr25519'});
let p = k.addFromUri('//MyTest');
await api.tx.system.remark('0x1234').signAndSend(p);
