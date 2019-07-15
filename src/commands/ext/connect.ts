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
import {defaultAssets} from '../../util/asset';
import decompress from '../../util/decompress';
import P2PSession from '../../util/p2pSession';

export default class ExtConnectCommand extends BaseWalletCommand {
  static strict = false;

  static description = `connect to single source extension
`;

  static args = [
    {name: 'connectString', required: true}
  ];

  static flags = BaseWalletCommand.flags;

  async run() {
    const {flags, args: {connectString}} = this.parse(ExtConnectCommand);

    if (connectString === undefined) {
      console.error('miss connectString');
    } else {
      const connectRequest = decompress(connectString);

      const peerId = connectRequest.peerId;
      const secretKey = connectRequest.secretKey;
      const sessionId = connectRequest.sessionId;

      if (peerId && secretKey) {
        const p2p = await P2PSession.connect(peerId, secretKey);

        const wallet = await this.loadWallet(flags);
        const addresses = await wallet.getAddresses();

        const accounts = addresses.map((address, index) => ({
          address,
          assets: defaultAssets,
          name: `Account ${index + 1}`
        }));
        if (addresses.length === 0) {
          console.error('wallet is empty');
        }

        await p2p.send({
          sessionId,
          type: 'connectResponse',
          accounts
        });

        p2p.destroy();
      }

      return connectRequest;
    }
  }
}
