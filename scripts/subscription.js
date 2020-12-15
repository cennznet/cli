await api.query.syloDevice.devices('5CUHuuq7jFMqHtVMXiEMucX7vU69jbnrCqMWZ6F8Jq4XyZaK', x => console.log(x.toJSON()));

let tx = api.tx.system.remark('0x1234');
let result = tx.signAndSend(toyKeyring.alice);
console.log(result.toJSON());
console.log((await api.query.system.accountNonce(toyKeyring.alice.address)).toJSON());

