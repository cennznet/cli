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

import {Command, flags} from '@oclif/command';
import chalk from 'chalk';
import * as fs from 'fs';
import * as os from 'os';
import prompts from 'prompts';

import {AutoFlushWallet} from './wallet/AutoFlushWallet';

export const DEFAULT_HOME = `${os.homedir()}/.cennz_cli`;
export const DEFAULT_WALLET_POSITION = `${DEFAULT_HOME}/wallet.json`;

export abstract class BaseWalletCommand extends Command {
  static flags = {
    help: flags.help(),
    path: flags.string({char: 'f', description: 'path to wallet.json', default: DEFAULT_WALLET_POSITION}),
    passphrase: flags.boolean({char: 'p', description: 'if a passphrase is needed', default: false})
  };

  protected directoryToSaveWalletExist(path: string): string | undefined {
    return fs.existsSync(path) ? path : undefined;
  }

  protected async getPassphrase(flags: any): Promise<string> {
    let {passphrase} = flags;
    let passphraseStr: string;
    if (passphrase) {
      const response = await prompts({
        type: 'password',
        name: 'passphrase',
        message: 'passphrase for the wallet'
      });
      passphraseStr = response.passphrase;
    } else {
      passphraseStr = '';
    }
    return passphraseStr;
  }

  protected async loadWallet(flags: any) {
    const {path} = flags;
    if (!this.directoryToSaveWalletExist(path as string)) {
      console.log('No wallet found. Pls run wallet:create to create wallet first.');
      this.exit(1);
    }
    const passphrase = await this.getPassphrase(flags);
    const wallet = await AutoFlushWallet.createFromFile(path as string);
    try {
      await wallet.unlock(passphrase);
    } catch (e) {
      if (e.message === 'wrong passphrase') {
        console.log(chalk.redBright('wrong password'));
      } else {
        console.log(chalk.redBright('wallet format not recognized, revert to old version or create a new wallet to override'));
      }
      throw e;
    }

    return wallet;
  }

  protected consoleErrorAndExit(msg: string) {
    console.error(msg);
    this.exit(1);
  }
}
