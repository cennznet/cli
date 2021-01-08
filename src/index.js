const minimist = require('minimist');
const { Api } = require('@cennznet/api');
const repl = require('repl');
const fs = require('fs');

const args = require('minimist')(process.argv.slice(2));

async function setup() {
  let endpoint = 'wss://nikau.centrality.me/public/ws';
  if (args.endpoint) {
    endpoint = args.endpoint;
    console.log(`using custom endpoint: ${endpoint}`);
  }

  let types = {};
  if (args.types) {
    console.log(`loading custom types from: '${args.types}'...`);
    try {
      types = JSON.parse(fs.readFileSync(args.types));
    } catch (err) {
      throw `Failed loading custom types from: '${args.types}' with: ${err}`;
    }
    console.log(`using custom types: ${JSON.stringify(types)} ✅`);
  }

  let syloDirectoryRpc = {
        scan: {
          description: 'Sylo directory scan',
          params: [
            {
              name: 'Point',
              type: 'Balance',
            },
          ],
          type: 'AccountId',
        }
  };

  // Setup API session
  global.hashing = require('../node_modules/@polkadot/util-crypto');
  console.log(`connecting to: ${endpoint}...`);
  global.api = await Api.create({ 
    provider: endpoint,
    types,
    rpc: { "syloDirectory": syloDirectoryRpc },
  });

  console.log(`connected ✅`);

  // Setup injected helper libs / functions
  // Note: we vendor the @cennznet/api.js compatible versions
  global.hashing = require('../node_modules/@polkadot/util-crypto');
  global.keyring = require('../node_modules/@polkadot/keyring');
  global.utils = require('../node_modules/@polkadot/util');

  // A simple keyring with prepopulated test accounts
  const { cryptoWaitReady } = require('../node_modules/@polkadot/util-crypto');
  await cryptoWaitReady();
  const toyKeyring = new keyring.Keyring({ type: 'sr25519' });
  toyKeyring.alice = toyKeyring.addFromUri('//Alice');
  toyKeyring.bob = toyKeyring.addFromUri('//Bob');
  toyKeyring.charlie = toyKeyring.addFromUri('//Charlie');
  global.toyKeyring = toyKeyring;
}


async function main() {
  if (args.run) {
    console.log(`Running user script: '${args.run}' with: api, hashing, keyring, utils`);
    let script = fs.readFileSync(args.run).toString();
    eval(`(async () => {${script}})()`);
  } else {
    console.log("Launching session with: api, hashing, keyring, utils");
    console.log("test accounts are available via: toyKeyring");
    repl.start('> ');
  }
}

setup()
  .then(() => {
    main()
      .catch(err => {
        console.log(`error during execution: ${err}`)
        process.exit(1);
      });
  })
  .catch(err => {
    console.log(`error during setup: ${err}`)
    process.exit(1);
  });
