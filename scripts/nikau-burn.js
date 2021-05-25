let keys = new keyring.Keyring({'type': 'sr25519'});
let nikau = keys.addFromUri('//Nikau');

let x = {}
const allEntries = await api.query.genericAsset.freeBalance.entries();
allEntries.forEach(([{ args: [assetId, accountId] }, value]) => {
    console.log(`${assetId}: ${accountId} balance ${value.toString()}`);

    x[assetId.toNumber()] = (x[assetId.toNumber()] || api.createType('Balance', 0).toBn()).add(value.toBn());
});

console.log(x['16000'].toString());
console.log(x['16001'].toString());

let acc = ['5FCfAonRZgTFrTd9HREEyeJjDpT397KMzizE6T3DvebLFE7n',
'5FEb2XKfkKQkiVLHqrgDv7xDH1v6w8YP8NHjcdYsZtNc7sck',
'5HKPmK9GYtE1PSLsS1qiYU9xQ9Si1NcEhdeCq9sw5bqu4ns8',
'5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
'5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT',
'5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z',
'5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
'5EV9LcsuZVPS6kSaY6PHvRCGBgVQNpAjyT5sxoZ6ySZQhXDE',
'5FWEHQqYMN8YCg8yJxKHnon7Dtx4Psp2xnjvKfQqGC6kUwgv'];

let kvs = acc.map((a) => {
    return [api.query.genericAsset.freeBalance.key('16001', a), utils.u8aToHex(api.createType('Balance', '100000000').toU8a())]
});

await api.tx.sudo.sudo(api.tx.system.setStorage([
    [api.query.rewards.targetInflationPerStakingEra.key(), utils.u8aToHex(api.createType('Balance', '100000000').toU8a())],
])).signAndSend(nikau);
