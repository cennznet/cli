import minimist from 'minimist';
import {ApiPromise, WsProvider } from '@polkadot/api';
import repl from 'repl';
import CENNZnetRuntimeTypes from '@cennznet/api-types/dist/src/interfaces/definitions.js';
import fs from 'fs';
import keyring from '../node_modules/@polkadot/keyring/index.js';
import * as utilCrypto from '../node_modules/@polkadot/util-crypto/index.js';
import * as utils from '../node_modules/@polkadot/util/index.js';

const args = minimist(process.argv.slice(2));

async function setup() {
  let endpoint = 'ws://localhost:9944';
  if (args.endpoint) {
    if(args.endpoint === 'mainnet') {
      args.endpoint = 'wss://cennznet.unfrastructure.io/public/ws';
    } else if(args.endpoint === 'nikau') {
      args.endpoint = 'wss://nikau.centrality.me/public/ws';
    } else if(args.endpoint === 'rata') {
      args.endpoint = 'wss://kong2.centrality.me/public/rata/ws';
    }
    endpoint = args.endpoint;
  }
  console.log(CENNZnetRuntimeTypes);
  let types = CENNZnetRuntimeTypes;
  if (args.types) {
    console.log(`loading custom types from: '${args.types}'...`);
    try {
      types = JSON.parse(fs.readFileSync(args.types));
    } catch (err) {
      throw `Failed loading custom types from: '${args.types}' with: ${err}`;
    }
    console.log(`using custom types: ${JSON.stringify(types)} ✅`);
  }

  // Setup API session
  let provider = new WsProvider(endpoint, 10);
  console.log(`connecting to: ${endpoint}...`);
  global.api = await ApiPromise.create({ provider, typesBundle: types })
  console.log(`connected ✅`);

  // Setup injected helper libs / functions
  // Note: we vendor the @cennznet/api.js compatible versions
  global.utilCrypto = utilCrypto;
  global.utils = utils;
  global.keyring = keyring;

  // A simple keyring with pre-populated test accounts
  let toyKeyring = new keyring({ type: 'sr25519' });
  toyKeyring.alice = toyKeyring.addFromUri("//Alice");
  toyKeyring.bob = toyKeyring.addFromUri("//Bob");
  toyKeyring.charlie = toyKeyring.addFromUri("//Charlie");
  toyKeyring.dave = toyKeyring.addFromUri("//Dave");
  toyKeyring.eve = toyKeyring.addFromUri("//Eve");
  global.toyKeyring = toyKeyring;
}

async function main() {
  if (args.run) {
    console.log(`Running user script: '${args.run}' with: api, utilCrypto, keyring, utils`);
    let script = fs.readFileSync(args.run).toString();
    eval(`(async () => {${script}})()`);
  } else {
    console.log("Launching session with: api, keyring, utilCrypto, utils");
    console.log("Test accounts are available via: toyKeyring");
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
