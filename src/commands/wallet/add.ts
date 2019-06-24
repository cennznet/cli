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

import {cryptoWaitReady, hexToU8a} from '@cennznet/util';
import {KeyringPair} from '@cennznet/util/types';
import {SimpleKeyring} from '@cennznet/wallet';
import {flags} from '@oclif/command';
import chalk from 'chalk';

import {BaseWalletCommand} from '../../BaseCommand';

export default class WalletAddCommand extends BaseWalletCommand {
  static strict = false;

  static description = `add new account by either seedHex or seedText
`;

  static flags = {
    ...BaseWalletCommand.flags,
    seedHex: flags.string({description: 'seed in hex form (start with 0x)'}),
    seedText: flags.string({description: 'seed as a simple text (Alice)'})
  };

  async run() {
    const {flags} = this.parse(WalletAddCommand);

    await cryptoWaitReady();
    const wallet = await this.loadWallet(flags);

    const {seedHex, seedText} = flags;
    if (!seedHex && !seedText) {
      console.error('missing arguments');
      this.exit(1);
    }
    if (seedHex && seedText) {
      console.error('ambiguous arguments');
      this.exit(1);
    }
    const keyring = new SimpleKeyring();
    let kp: KeyringPair;
    if (seedHex) {
      const seed = hexToU8a(seedHex);
      kp = keyring.addFromSeed(seed);
    } else {
      kp = keyring.addFromUri(`//${seedText}`);
    }
    await wallet.addKeyring(keyring);
    console.log(`account ${chalk.yellowBright(kp.address)} is added`);
  }

}
