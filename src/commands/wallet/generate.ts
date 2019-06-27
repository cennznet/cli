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

import {cryptoWaitReady, mnemonicGenerate, mnemonicToSeed, u8aToHex} from '@cennznet/util';
import {SimpleKeyring, Wallet} from '@cennznet/wallet';
import chalk from 'chalk';

import {BaseWalletCommand} from '../../BaseCommand';

export default class WalletGenerateCommand extends BaseWalletCommand {
  static strict = false;

  static description = `generate a new account and store it in wallet
`;

  static flags = BaseWalletCommand.flags;

  async run() {
    let {flags} = this.parse(WalletGenerateCommand);
    const wallet = await this.loadWallet(flags);
    const account = await this.generateAccount(wallet);
    console.log(chalk.yellowBright('Address: '), account.address);
    console.log(chalk.yellowBright('Seed: '), account.seed);
  }

  private async generateAccount(wallet: Wallet): Promise<{address: string, seed: string}> {
    const keyring = new SimpleKeyring();
    await cryptoWaitReady();
    const mnemonic = mnemonicGenerate();
    const accountSeed = mnemonicToSeed(mnemonic);
    const keypair = await keyring.addFromSeed(accountSeed);
    await wallet.addKeyring(keyring);
    return {address: keypair.address, seed: u8aToHex(accountSeed)};
  }
}
