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

import {SimpleKeyring} from '@cennznet/wallet';
import fs = require('fs');
import os = require('os');
import prompts from 'prompts';

import {BaseWalletCommand} from '../../BaseCommand';
import {AutoFlushWallet} from '../../wallet/AutoFlushWallet';

export default class WalletInitCommand extends BaseWalletCommand {
  static strict = false;

  static description = `Create a new wallet
`;

  static flags = BaseWalletCommand.flags;

  async run() {
    let {flags} = this.parse(WalletInitCommand);
    let {path, passphrase} = flags;
    this.initDefaultFolder();
    if (this.directoryToSaveWalletExist(path as string)) {
      const response = await prompts({
        type: 'confirm',
        name: 'answer',
        message: `Wallet detected[${path}]. Do you want to overwrite?`
      });
      if (!response.answer) {
        console.log('skipped');
        this.exit(0);
      }
    }

    let passphraseStr: string;
    if (passphrase) {
      const response = await prompts({
        type: 'password',
        name: 'passphrase',
        message: 'passphrase for the new wallet'
      });
      passphraseStr = response.passphrase;
    } else {
      const {answer} = await prompts({
        type: 'confirm',
        name: 'answer',
        message: 'Are you sure to continue with empty password?'
      });
      if (!answer) {
        console.log('skipped');
        this.exit(0);
      }
      passphraseStr = '';
    }
    // if (mnemonic) {
    //   const {mnemonicString} = await prompts({
    //     type: 'text',
    //     name: 'mnemonicString',
    //     message: 'passphrase for the new wallet'
    //   });
    //   await this.recoverWalletFromMnemonic(passphrase, mnemonicString, path as string);
    // } else {
    await this.createWallet(passphraseStr, path as string);
    // }
  }

  private initDefaultFolder() {
    const DEFAULT_FOLDER = `${os.homedir()}/.cennz_cli`;
    if (!fs.existsSync(DEFAULT_FOLDER)) {
      fs.mkdirSync(DEFAULT_FOLDER);
    }
  }

  // private async recoverWalletFromMnemonic(passphrash: string, mnemonic: string, path: string): Promise<Wallet> {
  //   const fileHandle = await fs.promises.open(path, 'w+');
  //   const wallet = new AutoFlushWallet({fileHandle});
  //   const hdKeyring = new HDKeyring({mnemonic});
  //   await wallet.createNewVaultAndRestore(passphrash, [hdKeyring]);
  //   return wallet;
  // }

  private async createWallet(passphrase: string, filePath: string) {
    const wallet = new AutoFlushWallet({keyringTypes: [SimpleKeyring], filePath});
    await wallet.createNewVault(passphrase);
    console.log('Wallet created successfully');
    return wallet;
  }
}
