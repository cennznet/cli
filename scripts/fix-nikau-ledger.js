let keyring_ = new keyring.Keyring({ 'type': 'sr25519' });
let sudo = keyring_.addFromUri('//Alice//stash');

let keys = [
    api.query.staking.ledger.key('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'),
    api.query.staking.ledger.key('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'),
    api.query.staking.ledger.key('5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y'),
    api.query.staking.ledger.key('5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy'),
    api.query.staking.ledger.key('5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw'),
]
let bond = '1';

let ledger = api.createType('StakingLedger', {
    active: bond,
    total: bond,
    unlocking: null
}).toHex();

let storageKV = {
    [keys[0]]: ledger,
    [keys[1]]: ledger,
    [keys[2]]: ledger,
    [keys[3]]: ledger,
    [keys[4]]: ledger,
};

console.log(JSON.stringify(storageKV))