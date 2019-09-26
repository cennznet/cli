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

import {IExtrinsic} from '@cennznet/api/types';
import {SignerPayloadJSON} from '@cennznet/types/extrinsic/SignerPayload';
// tslint:disable-next-line
import {createTypeUnsafe} from '@cennznet/types';
import Table from 'cli-table';
import prompts from 'prompts';
import {first} from 'rxjs/operators';
import {BaseApiCommand} from '../../ApiCommand';

import decompress from '../../util/decompress';
import P2PSession from '../../util/p2pSession';

export default class ExtSignCommand extends BaseApiCommand {
  static strict = false;

  static description = `Sign an extrinsic from single source extension.
Please click the QR code on single source extension for four times to get the extrinsicString
`;

  static args = [{
    name: 'extrinsicString',
    description: 'The string that contains the encoded information of peer server and the information of the extrinsic',
    required: true
  }];

  static flags = {
    ...BaseApiCommand.flags
  };

  async run() {
    const {flags, args: {extrinsicString}} = this.parse(ExtSignCommand);

    const extrinsicRequest = decompress(extrinsicString);

    const {peerId, secretKey, sessionId} = extrinsicRequest;
    if (!peerId || !secretKey) { this.consoleErrorAndExit('invalid extrinsicRequest'); }

    const p2p = await P2PSession.connect(peerId, secretKey);

    const data = await p2p.data$.pipe(first()).toPromise();
    if (!this.isSignPayload(data)) {
      p2p.destroy();
      this.consoleErrorAndExit('invalid SignPayload');
    }

    const signPayload = data as SignerPayloadJSON;

    // create extrinsic
    const api = await this.instantiateApi(flags);

    const {doughnut, feeExchange, method} = signPayload;
    const ext = createTypeUnsafe<IExtrinsic>('Extrinsic', [{method}]);
    if (doughnut) {
      ext.addDoughnut(doughnut);
    }
    if (feeExchange) {
      ext.addFeeExchangeOpt(feeExchange);
    }

    this.displayExtrinsic(ext);

    // ask to confirm
    const response = await prompts({
      type: 'confirm',
      name: 'isConfirm',
      message: 'Do you want to sign this extrinsic?'
    });

    if (!response.isConfirm) {
      // TODO: send reject to extension
      console.log('Rejected');
      p2p.destroy();
      this.exit(1);
    }

    const wallet = await this.loadWallet(flags);
    api.setSigner(wallet);

    const {signature} = await wallet.signPayload(signPayload);

    await p2p.send({
      sessionId,
      type: 'signResponse',
      hexSignature: signature
    });

    console.log('Signed successfully');

    api.disconnect();
    p2p.destroy();
  }

  displayExtrinsic(ext: IExtrinsic) {
    // TODO: Support display of doughnut and feeExchangeOpt
    // table style
    const chars = { top: '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
    , bottom: '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
    , left: '║' , 'left-mid': '╟' , mid: '─' , 'mid-mid': '┼'
    , right: '║' , 'right-mid': '╢' , middle: '│' };

    const argTable = new Table({chars});

    const args: {[x: string]: string; }[] = Object.keys(ext.method.argsDef).map(
      (key, index) => ({[key]: ext.method.args[index].toString()})
    );
    argTable.push(
      ...args
    );

    console.log('Extrinsic:');
    console.log(`${ext.method.sectionName}.${ext.method.methodName}`);
    console.log(argTable.toString());
  }

  isSignPayload(input: any): input is SignerPayloadJSON {
    return input.hasOwnProperty('address')
      && input.hasOwnProperty('blockHash')
      && input.hasOwnProperty('blockNumber')
      && input.hasOwnProperty('era')
      && input.hasOwnProperty('genesisHash')
      && input.hasOwnProperty('method')
      && input.hasOwnProperty('nonce')
      && input.hasOwnProperty('specVersion')
      && input.hasOwnProperty('tip')
      && input.hasOwnProperty('version');
  }
}
