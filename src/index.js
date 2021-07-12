import minimist from 'minimist';
import { Api, WsProvider } from '@cennznet/api';
import repl from 'repl';
import fs from 'fs';
import * as keyring from '@polkadot/keyring';
import * as utilCrypto from '@polkadot/util-crypto';
import * as utils from '@polkadot/util';
import { createType } from '@polkadot/types';
const args = minimist(process.argv.slice(2));

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

    // A simple keyring with prepopulated test accounts
    const { cryptoWaitReady } = utilCrypto;
    await cryptoWaitReady();


    let assetMeta = {
      scan: {
        description: 'Asset Meta query',
        params: [],
        type: 'Vec<(AssetId, AssetInfo)>',
      }
    };

  // Setup API session
  console.log(`connecting to: ${endpoint}...`);
  const provider = new WsProvider(endpoint);
  global.api = await Api.create({
      provider,
      types,
      rpc: { "assetMeta": assetMeta },
  });
  console.log(`connected ✅`);

  // Setup injected helper libs / functions
  // Note: we vendor the @cennznet/api.js compatible versions
  // global.hasing = utilCrypto;
  // global.keyring = keyring;
  //  global.utils = utils;

  // Add type decoding/construction utility
  global.createType = (type, value) => {
    return createType(api.registry, type, value);
  }

  const toyKeyring = new keyring.Keyring({ type: 'sr25519' });
  toyKeyring.alice = toyKeyring.addFromUri('//Alice');
  toyKeyring.bob = toyKeyring.addFromUri('//Bob');
  toyKeyring.charlie = toyKeyring.addFromUri('//Charlie');
  global.toyKeyring = toyKeyring;
}


async function main() {
  if (args.run) {
    console.log(`Running user script: '${args.run}' with: api, hashing, createType, keyring, utils`);
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
