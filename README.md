# cennz-cli

commandline tool to interact with cennznet

# Build/Install

Prerequisites:

- Node.js v 10.x
- Access to either the `centrality` or the `centralityexternals` NPM
  registry/repository on Gemfury (ask on the Slack channel `#dev-ops`
  to be added to one of the working registries)
- Gemfury login credentials

```sh-session
$ # It is important to include a trailing slash in the registry URL
$ # You may want to change to use the `centralityexternals` registry
$ # depending on access.
$ npm config set registry https://npm-proxy.fury.io/centrality/
$ npm config set always-auth true
$ npm login
$ npm i @cennznet/cli -g
$ # Test whether it works in principle.
$ bin/run --version
cennz-cli/0.1.3 linux-x64 node-v10.15.1
```

You may want to create a symbolic link for easier execution (wherever
you want it, e.g. in `/usr/local/bin`).

```sh-session
$ ln -s /path/to/bin/run /usr/local/bin/cennz-cli
$ cennz-cli --version
cennz-cli/0.1.3 linux-x64 node-v10.15.1
```

# Install suitable Node.js and Yarn

[check nodejs.org](https://nodejs.org/en/download/package-manager/)

## Install Yarn

[check yarnpkg.com](https://yarnpkg.com/en/docs/install)

# Usage

```sh-session
$ cennz-cli COMMAND
running command...
$ cennz-cli (-v|--version|version)
cennz-cli/0.0.0 darwin-x64 node-v10.13.0
```

# Commands

- [`cennz-cli help [COMMAND]`](#cennz-cli-help-command)
- [`cennz-cli api`](#cennz-cli-hello)
- [`cennz-cli repl`](#cennz-cli-repl)
- [`cennz-cli wallet`](#cennz-cli-wallet)

## `cennz-cli api`

```
USAGE
  $ cennz-cli api

Example
  $ cennz-cli api -c tx -s balances -m transfer --seed="Andrea" --ws="wss://cennznet-node-0.centrality.me:9944" "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
or sign with account in the wallet
  $ cennz-cli api -c tx -s balances -m transfer --sender='5G8fco8mAT3hkprXGRGDYxACZrDsy63y96PATPo4dKcvGmFF' --ws="ws://cennznet-node-0.centrality.me:9944" "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234

OPTIONS
  --seed  seed of sender key
  --sender address  seed of sender key
  --ws websocket end point url
  -c, --category=name category name of the api call, i.e. query, tx, rpc etc.
  -s, --section=name  section name of the api call
  -m, --method=name method name of the api call
  -n, --nonce=number nonce value of transaction
  -p, --passphrase if a passphrase is needed
  -f, --path path to the wallet's vault file
```

## `cennz-cli repl`

```
USAGE
  $ cennz-cli repl [SCRIPT] 

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -e, --evaluate=evaluate  evaluate script and print result
  -p, --passphrase if a passphrase is needed
  -f, --path path to the wallet's vault file [default: /home_directory/.cennz_cli/wallet.json] path to wallet.json
```

Optionally, like "node" cli, `repl` command can go with a script string or file:

```
$ cennz-cli repl -e="toyKeyring.alice.address()"
$ cennz-cli repl myScript.js
```

The script would be evaluated in the REPL context, and the result would be
printed. Note the interactive REPL would not be opened in this case.

To load a file while in the repl enviroment, use `.load` command:

```
$ cennz-cli repl
(cennz-cli)> .load path/to/myScript.js
```

## `cennz-cli wallet`
```
USAGE
  $ cennz-cli wallet:COMMAND

COMMANDS
  wallet:add       add new account by either seedHex or seedText
  wallet:create    Create a new wallet
  wallet:generate  generate a new account and store it in wallet
  wallet:list      list all accounts' address
  wallet:remove    remove the specified address from wallet
```
### Protect Wallet
create your wallet with `-p`
```
$ cennz-cli wallet:create -p
```
and append `-p` to all cennz-cli commands

### Generate an account in Wallet
```
$ cennz-cli wallet:generate [-p]
```

### List all addresses managed by Wallet
```
  $ cennz-cli wallet:list [-p]
```

### Add an account by SEED in Wallet
```
USAGE
  $ cennz-cli wallet:add [-p] --seedText Alice
  $ cennz-cli wallet:add [-p] --seedHex 0x01234...
  OPTIONS
    -p, --passphrase, if a passphrase is needed
    --seedHex=seedHex    seed in hex form (start with 0x)
    --seedText=seedText  seed as a simple text (Alice)

```

### Remove account by address from Wallet
```
USAGE
  $ cennz-cli wallet:remove [-p] '5G8fco8mAT3hkprXGRGDYxACZrDsy63y96PATPo4dKcvGmFF'
  OPTIONS
    -p, --passphrase, if a passphrase is needed
```

## `cennz-cli script`
```
USAGE
  $ cennz-cli script:COMMAND

COMMANDS
  script:list    List all available scripts
  script:run     Run a script
  script:update  Pull changes of scripts from remote
```

## `cennz-cli help [COMMAND]`

display help for cennz-cli

```
USAGE
  $ cennz-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

# The CENNZ REPL Environment

By `cennz-cli repl` command, a REPL(Read-Eval-Print-Loop) would be provided with
prompt:

```
(cennz-cli)>
```

## Beyond NodeJS REPL

`async/await` is supported in repl environment by default:

```
$ (cennz-cli)> const name = await api.rpc.system.chain()
$ (cennz-cli)> name
[String: 'CENNZnet DEV']
```

The REPL context provided some global variables ready for use.

## Keyrings

`keyring` is a `Keyring` instance for key pairs management. For instance, add a
key from seed:

```
(cennz-cli)> const aliceSeed = util.stringToU8a('Alice'.padEnd(32, ' '))
(cennz-cli)> const aliceKey = keyring.addFromSeed(aliceSeed)
(cennz-cli)> aliceKey.toJson()
{ address: '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ',
  encoded:
   '0x3053020101300506032b657004220420416c696365202020202020202020202020202020202020202020202020202020a123032100d172a74cda4c865912c32ba0a80a57ae69abae410e5ccb59dee84e2f4432db4f',
  encoding: { content: 'pkcs8', type: 'none', version: '0' },
  meta: {} }
```

For most of the cases, use `keyring` to store your keys. If you want another
`keyring` to manage a different group of keys, use `Keyring` to create one.

```
(cennz-cli)> const myKeyring = new Keyring()
```

Use `toyKeyring` to access common testing key pairs, incuding our "cryptography
friends" Alice, Bob, Charlie, Dave, Eve, Ferdie, and also Andrea, Brooke,
Courtney, Drew, Emily, Frank.

```
(cennz-cli)> toyKeyring.alice.address()
'5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ'
(cennz-cli)> toyKeyring.andrea.toJson()
{ address: '5EKGZwAuwvVpVaGWZJ3hYDqTSxQCDDUgeMv36M4qLq7wtWLH',
  encoded:
   '0x3053020101300506032b657004220420416e647265612020202020202020202020202020202020202020202020202020a123032100639404ecb02a5069c62c17f755ae0473388ea9698c7475db58e77e5eed980a63',
  encoding: { content: 'pkcs8', type: 'none', version: '0' },
  meta: {} }
```

For more usage of `Keyring`, check `@polkadot/keyring`.

## API

On the REPL start, an websocket connection would be established to the endpoint
provided by `-e, --endpoint` flag.

Use `api` in the REPL to interact with the node:

```
// check chain name
(cennz-cli)> api.rpc.system.chain().then(console.log)
(cennz-cli)> [String: 'CENNZnet DEV']
// get Alice's nonce
(cennz-cli)> api.query.system.accountNonce(toyKeyring.alice.address()).then(nonce => console.log(nonce.toJSON()))
Nonce {
  negative: 0,
  words: [ 0 ],
  length: 1,
  red: null,
  _bitLength: 64,
  _isHexJson: false }
```

### API Cookbook

Getting nonce

```
(cennz-cli)> const nonce = await api.query.system.accountNonce(toyKeyring.alice.address())
```

Balance transfer

//ADDRESS1 - 1st address from wallet (wallet.getAddresses() can display all addresses)

//ADDRESS2 - 2nd address from wallet (wallet.getAddresses() can display all addresses)
```
// Alice transfers 10 to Bob
// Use wallet to sign
api.setSigner(wallet);
(cennz-cli)> const tx = api.tx.balances.transfer(ADDRESS1, 10).signAndSend(ADDRESS2);
```

Generic Assets

```
// create asset
tx = await genericAsset.create({totalSupply: 111}).signAndSend(ADDRESS1);
// check next asset id
nextId = await genericAsset.getNextAssetId()
// check free balance
const freeBalance = await genericAsset.getFreeBalance(1000031, ADDRESS1)
// transfer
tx = await genericAsset.transfer(1, ADDRESS2, 12).signAndSend(ADDRESS1)
Custom runtime storage query


// query via `api.query.myStorage.myFn()`
(cennz-cli)> const nextAssetsId = await api.query.gat.nextAssetsId();
```

Custom runtime module transaction(extrinsic)

```
// create a tx via `api.tx.myModule.myFn()`
(cennz-cli)> const tx = api.tx.myModule.myFn(myParams);
// signing and sending
(cennz-cli)> tx.signAndSend(address)
```

Get storage key

```
// The first parameter is module name, and the second is fn name.
// Note that these two params are cases sensitive.
//
// get storage key of system events.
(cennz-cli)> util.storageKey('System', 'Events')
```

Get system events of a block

```
// pass the block hash as parameter
(cennz-cli)> let events = await utilApi.getSystemEvents('0xbe63d3144ec72a5002f11e4922959edfb088da12e41eb74b43a33fb459b92135')
```

Check `Api` in `@cennznet/api` for more info.

## Others

`argv` the command line arguments

with test.js

```
console.log(argv)
```

```
$ cennz-cli repl test.js 1 2
```

will print

```
[ 'test.js', '1', '2' ]
```

`util` functions.

```
// `isHex`
(cennz-cli)> util.isHex('0xFF')
true
// `numberToHex`
(cennz-cli)> util.numberToHex(1234)
'0x04d2'
```

`polkadotjs` buildin types.

```
(cennz-cli)> Hash
[Function: Hash]
(cennz-cli)> Gas
[Function: Gas]
```

For more about `util` and types, check `polkadotjs` documents.

## Scripts

Some utility scripts are provided in `https://bitbucket.org/centralitydev/cennz-cli-scripts-repo`. 

`cennz-cli script:update` to fetch them to local. (if you have access to that repo).

`cennz-cli script:list` to check all available scripts.

`cennz-cli script:run script-name [arguments]` to run it.

if you want to run your custom script, 
`cennz-cli repl path-to-script [arguments]`

`print-block`

Print the details for a block

Argument:

- empty to print head block
- or a block number
- or a block hash

```
$ cennz-cli script:run print-block 1234
block hash:  0xb45eb54f95c8487817fc4190642741a90f7417ba77c5c7bb48daf959251e1b50
{ block:
   { header:
      { parentHash:
         '0x3fcc44855cedbeb5c96792624ae6581cf7642f53695aa6d90f7ce8776b391d63',
        number: 1234,
        stateRoot:
         '0x84baeb215f5e478ae346413e19aced0911cdd8567388c8b35650a4ad238a5f91',
        extrinsicsRoot:
         '0xb25df17546ca1c4cbdf157a7c320ef33e8fb5e99e6d06f08988f8cf22be5a44d',
        digest: [Object] },
     extrinsics: [ '0x30010000039429075c00000000', '0x1001010100' ] },
  justification: '0x' }

extrinsics details

0x7a66f3f44a3f66c34a67678ce0e12f73eeedf4cc1b4f2e7424e3c923e389b0c4 : set { callIndex: '0x0000', args: { now: 1543973268 } }
0x7b4e1692d4e7bdf649ec489680ab394384966cc7d4254c670e1331bd88572d59 : note_offline { callIndex: '0x0101', args: { offline_val_indices: [] } }
```

`search-tx`

Search and print the details for a particular transaction/extrinsic by its hash

Argument: the extrinsic hash

```
$ cennz-cli script:run search-tx 0x62eef89e8365005731188d5a5ab23c6b1a801201b477780dbb3f07409d381738
Start searching for extrinsic hash: 0x62eef89e8365005731188d5a5ab23c6b1a801201b477780dbb3f07409d381738

Check block:  79036 0x2a2e968c632d47e10d8edf47186600748b69f88932565e5820f2e5e67e7ebcfa
................................................................
Found extrinsic in block 0x7e99c6951ada2f93ba8288bf3ff554e4f6b247860b5a12f58932174a6f9a5ce1
{ parentHash:
   '0x7e8cb10eb46e3c6b9e19e5f9dfc84304c1b51770995f23b2f6780b33a3647854',
  number: 78973,
  stateRoot:
   '0x05d96cb10e66cff2e0fa854706dcbf4189e18fdca1680a595e39fcdb4f15d472',
  extrinsicsRoot:
   '0xe278208405cff7126a10079d29defb0aaf778ffd791eeb90e915dffa4ade3428',
  digest: { logs: [ [Seal] ] } }
set { callIndex: '0x0000', args: { now: 1544515986 } }
Raw data:
 0x300100000392710f5c00000000
```

`find-common-block`

Find the common blocks between local node and DEV node. Useful if you want to
find out when does a fork start

Argument: block height

```
$ cennz-cli script:run find-commom-block 1234
Search for common block height 1234
Found commom block 1234 0x25b95a14a7a15b082c67b641f94d27587a07129cd35add63a5d4e8623a8ddd87
```

`upgrade-runtime`

Upgrade the runtime by submitting a new wasm runtime file.
**WARNING: This could brick the network**

Arguments:
  - seed: the signer seed
  - file: the path to wasm runtimen file

```
$ cennz-cli script:run upgrade-runtime Alice ../demo/v2-cennznet_runtime.compact.wasm
Upgrade commited. Tx hash:  0x682625861d6548f5cbba248e303d7713a4584fefc3c2213233cd51b11ebc04d0
```

`scan-tx`

Search for user created transactions

Argument:
  - blockNumber: block number to start search, 0 or empty for HEAD
  - n: number of blocks to scan, defualt to 1000

```
$ cennz-cli script:run scan-tx 1500 30
Scanning for transactions from block 1500 for 30 blocks
.

Found transactions in block 0x504069095246cef75e3d6ebe12ee97d77279adaa4339d43d2e509d819b0892e5
{ parentHash:
   '0xfdccf0a6f1ec02450d6081f78d4887eda8cc7816f72d52806976818e4b66d488',
  number: 1500,
  stateRoot:
   '0x384be198a52c859349d03ac5ddfe848d2ee3bc05c4cd9d024931dc6106a6223b',
  extrinsicsRoot:
   '0xdda5ced65343af617b7637fe0664c4a9672aa4351c773574c7e76776849a5cd9',
  digest: { logs: [ [Seal] ] } }
transfer 5HoSYe9iMNvjyEs283RgucMPZH8iDoRuEz9SmWixNiRVnxxP { callIndex: '0x0200',
  args:
   { dest: 'FQag', value: '0x00000000000000000000000000002710' } }

...................

Found transactions in block 0x6ba824bde7ae759be24327a556dacc612baee63cf73e2011f06d739a9451f250
{ parentHash:
   '0xdfddc9814a4424422a4247cc8c4320170f5b8db4a832b9c4bb910c9c224c1f12',
  number: 1481,
  stateRoot:
   '0x0a860a60053311748fe23417166e8479efb36eed25f81c2d0c9c3c954e04617d',
  extrinsicsRoot:
   '0x84d2751dd3ee9fcc28121749b92c8beb56dee89719a9d1a892791e33b12e2077',
  digest: { logs: [ [Seal] ] } }
transfer 5HoSYe9iMNvjyEs283RgucMPZH8iDoRuEz9SmWixNiRVnxxP { callIndex: '0x0200',
  args:
   { dest: 'FQag', value: '0x00000000000000000000000000002710' } }

..........
End
```

Create API connection via cenznet-api
```
bin/run repl

const {Api} = require('@cennznet/api')
api = await Api.create({
    provider: 'ws://cennznet-node-0.centrality.cloud:9944'
});
```


For more examples:

* https://cennznet-js-docs.centrality.me/api/latest/index.html
* https://cennznet-js-docs.centralityapp.com/wallet/latest/index.html

## Development

Follow these steps to get started with running the cli

1. Clone the repository
2. Run a `yarn install`
3. run `bin/run repl` to get the repl up and running

You should be ready to start contributing to the repository. We highly recommend
VSCode while you work with TypeScript, however, any editor with good TypeScript
integration will be more than fine.

If you do use VSCode, we highly recommend installing the `Prettier` and `TSLint`
extensions for code linting and autoformatting. Under your Prettier settings,
please make sure to check `Prettier: Tslint Integration` so that your prettier
formatting follows our code style guidelines.
