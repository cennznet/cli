let keyring_ = new keyring.Keyring({ 'type': 'sr25519' });

let alice = keyring_.addFromUri('//Alice');
let bob = keyring_.addFromUri('//Bob');
let charlie = keyring_.addFromUri('//Charlie');
let dave = keyring_.addFromUri('//Dave');
let eve = keyring_.addFromUri('//Eve');

console.log('chilling...');
await api.tx.staking.chill().signAndSend(alice);
await api.tx.staking.chill().signAndSend(bob);
await api.tx.staking.chill().signAndSend(charlie);
await api.tx.staking.chill().signAndSend(dave);
await api.tx.staking.chill().signAndSend(eve);
