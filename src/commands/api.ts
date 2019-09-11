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
import {cryptoWaitReady} from '@cennznet/util';
import {SimpleKeyring, Wallet} from '@cennznet/wallet';
import {flags} from '@oclif/command';
import _get from 'lodash.get';

import {BaseWalletCommand} from '../BaseCommand';

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
  $ bin/cennz-cli api -t tx -s genericAsset -m transfer --seed="//Andrea" 16000 "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
  or sign with account in the wallet
  $ bin/cennz-cli api -t tx -s genericAsset -m transfer --sender='5G8fco8mAT3hkprXGRGDYxACZrDsy63y96PATPo4dKcvGmFF' 16000 "5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE" 1234
`;

  static flags = {
    ...BaseWalletCommand.flags,
    endpoint: flags.string({
      char: 'c',
      description: 'cennznet node endpoint',
      default: 'wss://rimu.unfrastructure.io/public/ws'
    }),
    help: flags.help(),
    seed: flags.string({description: 'seed of sender key'}),
    sender: flags.string({description: 'address of sender'}),
    category: flags.string({char: 't', description: 'category of api call'}),
    section: flags.string({char: 's', description: 'section of transaction'}),
    method: flags.string({char: 'm', description: 'calling method'})
  };

  async run() {
    let {flags, argv} = this.parse(ApiCommand);
    let {seed, sender, endpoint, category, section, method} = flags;
    // Use wallet over Keyring
    let wallet: Wallet;
    let _sender: string;
    if (seed) {
      [wallet, _sender] = await this.createWallet(seed);
    } else {
      if (!sender) {
        console.error('either sender or seed is required');
        this.exit(1);
      }
      _sender = sender as string;
      try {
        wallet = await this.loadWallet(flags);
        // tslint:disable-next-line: no-unused
      } catch (e) {
        console.warn('failed to load wallet');
        this.exit(1);
      }
    }
    const api = await Api.create({provider: endpoint});
    const apiCall = _get(api, [
      category as string,
      section as string,
      method as string
    ]);
    if (category === 'tx') {
      // @ts-ignore
      api.setSigner(wallet);
      const args = argv.map(checkJson);
      const tx = apiCall.apply(this, args);
      const hash = await tx.signAndSend(_sender);

      this.log(`submitted with hash ${hash}`);
    } else {
      const result = await apiCall.apply(this, argv);
      this.log(result);
    }
    this.exit(1);
  }

  private async createWallet(seed: string): Promise<[Wallet, string]> {
    await cryptoWaitReady();
    const wallet = new Wallet();
    const kr = new SimpleKeyring();
    const {address} = kr.addFromUri(seed);
    await wallet.createNewVault('');
    await wallet.addKeyring(kr);
    return [wallet, address];
  }

}
