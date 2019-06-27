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

import {stringToU8a} from '@cennznet/util';
import {SimpleKeyring, Wallet} from '@cennznet/wallet';
import {IKeyring, WalletOption} from '@cennznet/wallet/types';
import chalk from 'chalk';
import fs from 'fs';

export class AutoFlushWallet extends Wallet {
  static async createFromFile(path: string): Promise<AutoFlushWallet> {
    let vault: string = await fs.readFileSync(path, {encoding: 'utf8'});
    return new AutoFlushWallet({vault, keyringTypes: [SimpleKeyring], filePath: path});
  }

  private readonly filePath: string;

  constructor(option: WalletOption & {filePath: string}) {
    super(option);
    this.filePath = option.filePath;
  }

  flushToDisk(): void {
    return fs.writeFileSync(this.filePath, this.vault, {encoding: 'utf8'});
  }

  async createNewVault(passphrase: string): Promise<void> {
    await super.createNewVault(passphrase);
    await this.flushToDisk();
  }

  async createNewVaultAndRestore(passphrase: string, keyrings: IKeyring<any>[]): Promise<void> {
    await super.createNewVaultAndRestore(passphrase, keyrings);
    await this.flushToDisk();
  }

  async addAccount(): Promise<string> {
    const address = await super.addAccount();
    await this.flushToDisk();
    return address;
  }

  async removeAccount(address: string): Promise<void> {
    await super.removeAccount(address);
    await this.flushToDisk();
  }

  async addKeyring(keyring: IKeyring<any>): Promise<void> {
    await super.addKeyring(keyring);
    await this.flushToDisk();
  }

  async importByName(seedName: string): Promise<void> {
    const keyring = new SimpleKeyring();
    const seed = stringToU8a(seedName.padEnd(32, ' '));
    const kp = keyring.addFromSeed(seed);
    await this.addKeyring(keyring);
    console.log(`account ${chalk.yellowBright(kp.address)} is added`);
  }
}
