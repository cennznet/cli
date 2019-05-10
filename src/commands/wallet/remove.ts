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

import {BaseWalletCommand} from '../../BaseCommand';

export default class WalletRemoveCommand extends BaseWalletCommand {
  static strict = false;

  static description = `remove the specified address from wallet
`;
  static args = [
    {name: 'address'}
  ];

  static flags = BaseWalletCommand.flags;

  async run() {
    const {flags, args: {address}} = this.parse(WalletRemoveCommand);
    const wallet = await this.loadWallet(flags);
    await wallet.removeAccount(address);
  }

}
