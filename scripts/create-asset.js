// Example create a new generic asset
let keys = new keyring.Keyring({'type': 'sr25519'});
let ownerAddress = '5FWEHQqYMN8YCg8yJxKHnon7Dtx4Psp2xnjvKfQqGC6kUwgv';
let sudoKey = keys.addFromUri('//Nikau');

// 1 million tokens with 18dp
const initialIssuance = '1000000000000000000000000';
const owner = api.registry.createType('Owner', ownerAddress, 1);
const permissions = api.registry.createType('PermissionsV1', { update: owner, mint: owner, burn: owner});
const option = {initialIssuance , permissions};
const assetOptions = api.registry.createType('AssetOptions', option);
const assetInfo = api.registry.createType('AssetInfo', {symbol: 'tERC20', decimalPlaces: 18});

let createTx = api.tx.genericAsset.create(
    ownerAddress,
    assetOptions,
    assetInfo,
);

await api.tx.sudo.sudo(createTx).signAndSend(sudoKey);