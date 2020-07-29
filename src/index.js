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

  // Setup libs + api for the REPL session
  // vendor the @cennznet/api.js compatible versions
  global.hashing = require('../node_modules/@polkadot/util-crypto');
  global.keyring = require('../node_modules/@polkadot/keyring');
  global.utils = require('../node_modules/@polkadot/util');

  console.log(`connecting to: ${endpoint}...`);
  global.api = await Api.create({ provider: endpoint, types })
  console.log(`connected ✅`);
}


async function main() {
  if (args.run) {
    console.log(`Running user script: '${args.run}' with: api, hashing, keyring, utils`);
    let script = fs.readFileSync(args.run).toString();
    eval(script);
  } else {
    console.log("Launching session with: api, hashing, keyring, utils");
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
