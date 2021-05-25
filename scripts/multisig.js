
let makeClaim = api.tx.attestation.setClaim(toyKeyring.dave.address, 123, 4);

// Input the addresses that will make up the multisig account.
const multiAddress = hashing.createKeyMulti([
    toyKeyring.alice.address,
    toyKeyring.bob.address,
    toyKeyring.charlie.address,
]);

const SS58Prefix = 42;
const Ss58Address = keyring.encodeAddress(multiAddress, SS58Prefix);
console.log(`\nMultisig Address: ${Ss58Address}`);

const callHash = hashing.blake2AsHex(makeClaim.toU8a());

await api.tx.multisig.asMulti(
    2, // require 2 of 3 to approve
    [toyKeyring.bob.address, toyKeyring.charlie.address], // who else can approve
    {height: 7, index: 1},
    '0x3f1b8e1142ac8d9f63fd32614e86e479ec02645ed4a581d7abb82ca0c45c80cd',
    true,
    1_000_000, // approximate weight of makeClaim
).signAndSend(toyKeyring.alice);

// let block = await api.rpc.chain.getBlock();
// console.log(block.block.header.number);

// await api.tx.multisig.approveAsMulti(
//     2, // require 2 of 3 to approve
//     [toyKeyring.alice.address, toyKeyring.bob.address].sort(), // who else can approve
//     {height: 7, index: 1},
//     '0x3f1b8e1142ac8d9f63fd32614e86e479ec02645ed4a581d7abb82ca0c45c80cd', // the things the group will approve
//     1_000_000, // approximate weight of makeClaim
// ).signAndSend(toyKeyring.charlie);
