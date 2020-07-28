const { Api } = require('@cennznet/api');
// vendor the @cennznet/api.js compatible versions
global.hashing = require('../node_modules/@polkadot/util-crypto');
global.keyring = require('../node_modules/@polkadot/keyring');
global.util = require('../node_modules/@polkadot/util');
const repl = require('repl');

async function setup() {
  var args = process.argv.slice(2);
  let endpoint = args.length > 0 ? args[0] : 'wss://nikau.centrality.me/public/ws';
  console.log(`connecting to: ${endpoint}...`);
  global.api = await Api.create({provider: endpoint});
  console.log(`connected ✅`);
}


async function main() {
    console.log("launching session with: api, hashing, keyring, util");
    repl.start('> '); 
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
