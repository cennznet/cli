// Copyright 2019 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Api} from '@cennznet/api';
import {stringToU8a} from '@cennznet/util';
import {SimpleKeyring, Wallet} from '@cennznet/wallet';
import {flags} from '@oclif/command';
import _get = require('lodash.get');

import {BaseWalletCommand} from '../BaseCommand';
import {seedToAccount} from '../util/toyKeyring';

function checkJson(input: string) {
  let args = input;
  try {
    args = JSON.parse(input);
  } catch {
  }
  return args;
}

export default class ApiCommand extends BaseWalletCommand {
  static strict = false;

  static description = `Send transactions

  This command sends transactions from one user to another based on flags given to the command. eg:
  $ bin/cennz-cli api -c tx -s balances -m transfer --seed="Andrea" --ws="wss://cennznet-node-0.centrality.me:9944" "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
  or sign with account in the wallet
  $ bin/cennz-cli api -c tx -s balances -m transfer --sender='5G8fco8mAT3hkprXGRGDYxACZrDsy63y96PATPo4dKcvGmFF' --ws="ws://cennznet-node-0.centrality.me:9944" "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
`;

  static flags = {
    ...BaseWalletCommand.flags,
    help: flags.help(),
    seed: flags.string({description: 'seed of sender key'}),
    sender: flags.string({description: 'address of sender'}),
    ws: flags.string({description: 'websocket end point url'}),
    category: flags.string({char: 'c', description: 'category of api call'}),
    section: flags.string({char: 's', description: 'section of transaction'}),
    method: flags.string({char: 'm', description: 'calling method'})
  };

  async run() {
    let {flags, argv} = this.parse(ApiCommand);
    let {seed, sender, ws, category, section, method} = flags;
    // Use wallet over Keyring
    let wallet;
    let _sender;
    if (seed) {
      wallet = await this.createWallet(seed);
      _sender = seedToAccount(seed).address;
    } else {
      if (!sender) {
        console.error('either sender or seed is required');
        this.exit(1);
      }
      _sender = sender;
      try {
        wallet = await this.loadWallet(flags);
      } catch (e) {
        console.warn('failed to load wallet');
      }
    }
    const api = await Api.create({
      provider: ws
    });
    const apiCall = _get(api, [
      category as string,
      section as string,
      method as string
    ]);
    if (category === 'tx') {
      api.setSigner(wallet as Wallet);
      const args = argv.map(checkJson);
      const tx = apiCall.apply(this, args);
      const hash = await tx.signAndsend(_sender);

      this.log(`submitted with hash ${hash}`);
    } else {
      const result = await apiCall.apply(this, argv);
      this.log(result);
    }
    this.exit(1);
  }

  private async createWallet(seed: string): Promise<Wallet> {
    const wallet = new Wallet();
    const kr = new SimpleKeyring();
    kr.addFromSeed(stringToU8a(seed.padEnd(32, ' ')));
    await wallet.createNewVault('');
    await wallet.addKeyring(kr);
    return wallet;
  }

}
