cennz-cli
========

commandline tool to interact with cennznet


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [API Cookbook](#api-cookbook)
* [Write your own script](#write-your-own-script)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @cennznet/cli
$ cennz-cli COMMAND
running command...
$ cennz-cli (-v|--version|version)
@cennznet/cli/0.10.0 darwin-x64 node-v10.16.0
$ cennz-cli --help [COMMAND]
USAGE
  $ cennz-cli COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`cennz-cli api`](#cennz-cli-api)
* [`cennz-cli ext:connect CONNECTSTRING`](#cennz-cli-extconnect-connectstring)
* [`cennz-cli ext:sign EXTRINSICSTRING`](#cennz-cli-extsign-extrinsicstring)
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
  -c, --endpoint=endpoint  [default: wss://rimu.unfrastructure.io/public/ws] cennznet node endpoint
  -f, --path=path          [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -m, --method=method      calling method
  -n, --network=network    network to connect to
  -p, --passphrase         if a passphrase is needed
  -s, --section=section    section of transaction
  -t, --category=category  category of api call
  -t, --typeDef=typeDef    path to json which contains additional type definitions
  --help                   show CLI help
  --seed=seed              seed of sender key
  --sender=sender          address of sender

DESCRIPTION
  This command sends transactions from one user to another based on flags given to the command. eg:
     $ bin/cennz-cli api -t tx -s genericAsset -m transfer --seed="//Andrea" 16000 
  "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
     or sign with account in the wallet
     $ bin/cennz-cli api -t tx -s genericAsset -m transfer --sender='5G8fco8mAT3hkprXGRGDYxACZrDsy63y96PATPo4dKcvGmFF' 
  16000 "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
```

_See code: [src/commands/api.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/api.ts)_

## `cennz-cli ext:connect CONNECTSTRING`

connect to single source extension

```
USAGE
  $ cennz-cli ext:connect CONNECTSTRING

ARGUMENTS
  CONNECTSTRING  The string that contains the encoded information of peer server

OPTIONS
  -f, --path=path   [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
  --help            show CLI help

DESCRIPTION
  Please click the QR code on single source extension for four times to get the connectString
```

_See code: [src/commands/ext/connect.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/ext/connect.ts)_

## `cennz-cli ext:sign EXTRINSICSTRING`

Sign an extrinsic from single source extension.

```
USAGE
  $ cennz-cli ext:sign EXTRINSICSTRING

ARGUMENTS
  EXTRINSICSTRING  The string that contains the encoded information of peer server and the information of the extrinsic

OPTIONS
  -c, --endpoint=endpoint  [default: wss://rimu.unfrastructure.io/public/ws] cennznet node endpoint
  -f, --path=path          [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -n, --network=network    network to connect to
  -p, --passphrase         if a passphrase is needed
  -t, --typeDef=typeDef    path to json which contains additional type definitions
  --help                   show CLI help

DESCRIPTION
  Please click the QR code on single source extension for four times to get the extrinsicString
```

_See code: [src/commands/ext/sign.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/ext/sign.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `cennz-cli repl [SCRIPT]`

Start a repl to interact with a node

```
USAGE
  $ cennz-cli repl [SCRIPT]

ARGUMENTS
  SCRIPT  the path of JS file which will be evaluated into context

OPTIONS
  -c, --endpoint=endpoint  [default: wss://rimu.unfrastructure.io/public/ws] cennznet node endpoint
  -e, --evaluate=evaluate  evaluate script and print result
  -f, --path=path          [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -n, --network=network    network to connect to
  -p, --passphrase         if a passphrase is needed
  -t, --typeDef=typeDef    path to json which contains additional type definitions
  --help                   show CLI help

DESCRIPTION
  -------------
     1. Connect to a node by websocket:
     $ cennz-cli repl --endpoint="ws://localhost:9944 --passphrase='passphrase' --path='path for wallet vault'

     If no 'endpoint' flag, 'ws://localhost:9944' will be used as default.

     2. Optionally, like "node" cli, a expression or JS script could be provided:

     $ cennz-cli repl -p="toyKeyring.alice.address()"
     $ cennz-cli repl myScript.js

     The expression or script would be evaluated in the repl context, and the
     result would be printed. Note the interactive REPL would not be opened in this case.

     3. async/await is supported in repl enviroment, you can do:

     $ cennz-cli repl -p="const name = await api.rpc.system.chain()"
     [String: 'CENNZnet DEV']

     4. To load a file while in the repl enviroment, use `.load` command:
```

_See code: [src/commands/repl.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/repl.ts)_

## `cennz-cli script:list`

List all available scripts

```
USAGE
  $ cennz-cli script:list
```

_See code: [src/commands/script/list.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/script/list.ts)_

## `cennz-cli script:run SCRIPT`

Run a script

```
USAGE
  $ cennz-cli script:run SCRIPT

OPTIONS
  -c, --endpoint=endpoint  [default: wss://rimu.unfrastructure.io/public/ws] cennznet node endpoint
  -f, --path=path          [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -n, --network=network    network to connect to
  -p, --passphrase         if a passphrase is needed
  -t, --typeDef=typeDef    path to json which contains additional type definitions
  --help                   show CLI help
  --noApi                  pass true if the script doesn't need to connect to the network
```

_See code: [src/commands/script/run.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/script/run.ts)_

## `cennz-cli script:update`

Pull changes of scripts from remote

```
USAGE
  $ cennz-cli script:update

OPTIONS
  --force  force checkout script repo
```

_See code: [src/commands/script/update.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/script/update.ts)_

## `cennz-cli wallet:add`

add new account by either seedHex or seedText

```
USAGE
  $ cennz-cli wallet:add

OPTIONS
  -f, --path=path      [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase     if a passphrase is needed
  --help               show CLI help
  --seedHex=seedHex    seed in hex form (start with 0x)
  --seedText=seedText  seed as a simple text (Alice)
```

_See code: [src/commands/wallet/add.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/wallet/add.ts)_

## `cennz-cli wallet:create`

Create a new wallet

```
USAGE
  $ cennz-cli wallet:create

OPTIONS
  -f, --path=path   [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
  --help            show CLI help
```

_See code: [src/commands/wallet/create.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/wallet/create.ts)_

## `cennz-cli wallet:generate`

generate a new account and store it in wallet

```
USAGE
  $ cennz-cli wallet:generate

OPTIONS
  -f, --path=path   [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
  --help            show CLI help
```

_See code: [src/commands/wallet/generate.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/wallet/generate.ts)_

## `cennz-cli wallet:list`

list all accounts' address

```
USAGE
  $ cennz-cli wallet:list

OPTIONS
  -f, --path=path   [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
  --help            show CLI help
```

_See code: [src/commands/wallet/list.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/wallet/list.ts)_

## `cennz-cli wallet:remove [ADDRESS]`

remove the specified address from wallet

```
USAGE
  $ cennz-cli wallet:remove [ADDRESS]

OPTIONS
  -f, --path=path   [default: ~/.cennz_cli/wallet.json] path to wallet.json
  -p, --passphrase  if a passphrase is needed
  --help            show CLI help
```

_See code: [src/commands/wallet/remove.ts](https://github.com/cennznet/cli/blob/v0.10.0/src/commands/wallet/remove.ts)_
<!-- commandsstop -->


## Beyond NodeJS REPL

`async/await` is supported in repl environment by default,
after cli connect to the node, it will print `api is loaded now` in the console, then

```
$ (cennz-cli)> const name = await api.rpc.system.chain()
$ (cennz-cli)> name
[String: 'CENNZnet DEV']
```

The REPL context provided some global variables ready for use.

## Wallet

`wallet` is a `Wallet` instance for key pairs management. Accounts imported via wallet sub-command can be visited in repl.

```
(cennz-cli)> const accounts = await wallet.getAddresses();
```
or add new accounts
```
(cennz-cli)> const keyring = new Keyring();
(cennz-cli)> const aliceKey = keyring.addFromUri('//Alice');
(cennz-cli)> wallet.addKeyring(keyring);
(cennz-cli)> aliceKey.toJson()
{ address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  encoded:
   '0x3053020101300506032b65700422042098319d4ff8a9508c4bb0cf0b5a78d760a0b2082c02775e6e82370816fedfff48925a225d97aa00682d6a59b95b18780c10d7032336e88f3442b42361f4a66011a123032100d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   { content: [ 'pkcs8', 'sr25519' ], type: 'none', version: '2' },
  meta: {} }
```

Note: All changes to wallet will persist on local disk.

Use `toyKeyring` to access common testing key pairs, incuding our "cryptography
friends" Alice, Bob, Charlie, Dave, Eve, Ferdie, and also Andrea, Brooke,
Courtney, Drew, Emily, Frank.

```
(cennz-cli)> toyKeyring.Alice.address
'5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
(cennz-cli)> toyKeyring.Andrea.toJson()
{ address: '5DqMKyro24J7AWzZRjcb1ovKWynwFDKQAFAorTMY82epJyDT',
  encoded:
   '0x3053020101300506032b65700422042040ff49c8a064ab0fe6654688221ebf282f4dabb6cefed5e8d83eed13e0e9c07d2957ccc8b465cbdf79f8298c13ca921867a8dcf1e3e6ba1e37116f29087fe895a1230321004e492b6791493bb9390d21a0d580f24bf04d1eb9fb30c032613dfe554344785b',
  { content: [ 'pkcs8', 'sr25519' ], type: 'none', version: '2' },
  meta: {} }
```

For more usage of `Wallet`, check `@cennznet/wallet`.

# API Cookbook

On the REPL start, an websocket connection would be established to the endpoint
provided by `-c, --endpoint` flag.

Use `api` in the REPL to interact with the node:

```
// check chain name
(cennz-cli)> api.rpc.system.chain().then(console.log)
(cennz-cli)> [String: 'CENNZnet DEV']
// get Alice's nonce
(cennz-cli)> api.query.system.accountNonce(toyKeyring.Alice.address).then(nonce => console.log(nonce.toJSON()))
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
