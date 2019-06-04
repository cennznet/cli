cennz-cli
========

commandline tool to interact with cennznet


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [The CENNZ REPL Environment](#the-cennz-repl-environment)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @cennznet/cli
$ cennz-cli COMMAND
running command...
$ cennz-cli (-v|--version|version)
@cennznet/cli/0.6.2 darwin-x64 node-v10.13.0
$ cennz-cli --help [COMMAND]
USAGE
  $ cennz-cli COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`cennz-cli api`](#cennz-cli-api)
* [`cennz-cli help [COMMAND]`](#cennz-cli-help-command)
* [`cennz-cli repl [SCRIPT]`](#cennz-cli-repl-script)
* [`cennz-cli script:list`](#cennz-cli-scriptlist)
* [`cennz-cli script:run SCRIPT`](#cennz-cli-scriptrun-script)
* [`cennz-cli script:update`](#cennz-cli-scriptupdate)
* [`cennz-cli wallet:add`](#cennz-cli-walletadd)
* [`cennz-cli wallet:create`](#cennz-cli-walletcreate)
* [`cennz-cli wallet:generate`](#cennz-cli-walletgenerate)
* [`cennz-cli wallet:list`](#cennz-cli-walletlist)
* [`cennz-cli wallet:remove [ADDRESS]`](#cennz-cli-walletremove-address)

## `cennz-cli api`

Send transactions

```
USAGE
  $ cennz-cli api

OPTIONS
  -c, --category=category  category of api call
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -m, --method=method      calling method
  -p, --passphrase         if a passphrase is needed
  -s, --section=section    section of transaction
  --help                   show CLI help
  --seed=seed              seed of sender key
  --sender=sender          address of sender
  --ws=ws                  websocket end point url

DESCRIPTION
  This command sends transactions from one user to another based on flags given to the command. eg:
     $ bin/run api -c tx -s balances -m transfer --seed="Andrea" --ws="wss://cennznet-node-0.centrality.me:9944" 
  "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
     or sign with account in the wallet
     $ bin/run api -c tx -s balances -m transfer --sender='5G8fco8mAT3hkprXGRGDYxACZrDsy63y96PATPo4dKcvGmFF' 
  --ws="ws://cennznet-node-0.centrality.me:9944" "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
```

_See code: [src/commands/api.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/api.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `cennz-cli repl [SCRIPT]`

Start a repl to interact with a node

```
USAGE
  $ cennz-cli repl [SCRIPT]

ARGUMENTS
  SCRIPT  the path of JS file which will be evaluated into context

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -e, --evaluate=evaluate  evaluate script and print result
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase         if a passphrase is needed

DESCRIPTION
  -------------
     1. Connect to a node by websocket:
     $ cennz-cli repl --endpoint="ws://localhost:9944 --passphrase='passphrase' --path='path for wallet vault'

     If no 'endpoint' flag, 'ws://localhost:9944' will be used as default.

     -------------
     2. Optionally, like "node" cli, a expression or JS script could be provided:

     $ cennz-cli repl -p="toyKeyring.alice.address()"
     $ cennz-cli repl myScript.js

     The expression or script would be evaluated in the repl context, and the
     result would be printed.

     -------------
     3. async/await is supported in repl enviroment, you can do:

     $ cennz-cli repl -p="const name = await api.rpc.system.chain()"
     [String: 'CENNZnet DEV']
```

_See code: [src/commands/repl.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/repl.ts)_

## `cennz-cli script:list`

List all available scripts

```
USAGE
  $ cennz-cli script:list
```

_See code: [src/commands/script/list.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/script/list.ts)_

## `cennz-cli script:run SCRIPT`

Run a script

```
USAGE
  $ cennz-cli script:run SCRIPT

OPTIONS
  -c, --endpoint=endpoint  [default: ws://localhost:9944] cennznet node endpoint
  -f, --path=path          [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase         if a passphrase is needed
  --noApi                  pass true if the script doesn't need to connect to the network
```

_See code: [src/commands/script/run.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/script/run.ts)_

## `cennz-cli script:update`

Pull changes of scripts from remote

```
USAGE
  $ cennz-cli script:update

OPTIONS
  --force  force checkout script repo
```

_See code: [src/commands/script/update.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/script/update.ts)_

## `cennz-cli wallet:add`

add new account by either seedHex or seedText

```
USAGE
  $ cennz-cli wallet:add

OPTIONS
  -f, --path=path      [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase     if a passphrase is needed
  --seedHex=seedHex    seed in hex form (start with 0x)
  --seedText=seedText  seed as a simple text (Alice)
```

_See code: [src/commands/wallet/add.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/wallet/add.ts)_

## `cennz-cli wallet:create`

Create a new wallet

```
USAGE
  $ cennz-cli wallet:create

OPTIONS
  -f, --path=path   [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
```

_See code: [src/commands/wallet/create.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/wallet/create.ts)_

## `cennz-cli wallet:generate`

generate a new account and store it in wallet

```
USAGE
  $ cennz-cli wallet:generate

OPTIONS
  -f, --path=path   [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
```

_See code: [src/commands/wallet/generate.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/wallet/generate.ts)_

## `cennz-cli wallet:list`

list all accounts' address

```
USAGE
  $ cennz-cli wallet:list

OPTIONS
  -f, --path=path   [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
```

_See code: [src/commands/wallet/list.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/wallet/list.ts)_

## `cennz-cli wallet:remove [ADDRESS]`

remove the specified address from wallet

```
USAGE
  $ cennz-cli wallet:remove [ADDRESS]

OPTIONS
  -f, --path=path   [default: /Users/moge/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
```

_See code: [src/commands/wallet/remove.ts](https://github.com/cennznet/cli/blob/v0.6.2/src/commands/wallet/remove.ts)_
<!-- commandsstop -->



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

# API Cookbook

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

Check [@cennznet/api](https://github.com/cennznet/api.js/tree/master/packages/api) for more info.





# Write your own script
## Argv

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

## Globals
### `api`
see above

### `util`
see [@cennznet/util](https://cennznetdocs.com/api/latest/api/modules/_cennznet_util.md).

### Build-in types.

```
(cennz-cli)> Hash
[Function: Hash]
(cennz-cli)> Gas
[Function: Gas]
```

### loadWallet()
get user's local wallet
```
const wallet = await loadWallet();
api.setSignet(wallet);
```

## Best Practice
* write script's own usage(). Check args required, print usage and `exit(1)` if any args is missing.  
