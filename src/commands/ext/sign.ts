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
import {SignPayload} from '../../types';
import decompress from '../../util/decompress';
import P2PSession from '../../util/p2pSession';

import {Api} from '@cennznet/api';
import { U8a, Index, RuntimeVersion, Extrinsic } from '@cennznet/types/polkadot';
import {stringToU8a} from '@cennznet/util';
import {Wallet} from '@cennznet/wallet';
import {flags} from '@oclif/command';
import Table from 'cli-table';
import prompts from 'prompts';

export default class ExtSignCommand extends BaseWalletCommand {
  static strict = false;

  static description = `sign an extrinsic from single source extension
`;

  static args = [
    {name: 'extrinsicString', required: true}
  ];

  static flags = {
    ...BaseWalletCommand.flags,
    endpoint: flags.string({
      char: 'e',
      description: 'cennznet node endpoint',
      default: 'wss://rimu.unfrastructure.io/public/ws'
    })
  };

  async run() {
    const {flags, args: {extrinsicString}} = this.parse(ExtSignCommand);
    const {endpoint} = flags;

    if (extrinsicString === undefined) {
      console.error('miss extrinsicString');
    } else {
      const extrinsicRequest = decompress(extrinsicString);

      const peerId = extrinsicRequest.peerId;
      const secretKey = extrinsicRequest.secretKey;
      const sessionId = extrinsicRequest.sessionId;

      if (peerId && secretKey) {
        const p2p = await P2PSession.connect(peerId, secretKey);

        const signPayload: SignPayload = await new Promise(resolve => {
          p2p.data$.subscribe((data) => {
            if (this.isSignPayload(data)) {
              resolve(data as SignPayload);
            } else {
              console.error('data is not an available SignPayload')
            }
          });
        })

        // create extrinsic
        const api = await Api.create({
          provider: endpoint
        });
        const { extrinsic } = signPayload;
        const ext= new Extrinsic(extrinsic);

        this.displayExtrinsic(signPayload, ext);

        // ask to confirm
        const response = await prompts({
          type: 'confirm',
          name: 'isConfirm',
          message: 'Do you want to sign this extrinsic?'
        });

        if (response.isConfirm) {
          const wallet = await this.loadWallet(flags);
          api.setSigner(wallet);

          const hexSignature = await this.sign(signPayload, wallet, ext);

          const peer = P2PSession.getPeer(peerId);
          await peer.send({
            sessionId,
            type: 'signResponse',
            hexSignature
          });

          console.log('Signed successfully')

          api.disconnect();
        } else {
          // TODO: send reject to extension
          console.log('Rejected')
        }

        p2p.destroy();
      }
    }
  }

  async sign(signPayload: SignPayload, wallet: Wallet, ext: Extrinsic) {
    const { extrinsic, address, blockHash, nonce, era, version } = signPayload;
    
    if (era === undefined || era === null) {
      throw new Error('Missing era in SignPayload');
    }

    if (ext.toHex() !== extrinsic) {
      throw new Error('Sign tx failed');
    }

    const options = {
      blockHash: new U8a(blockHash),
      era: stringToU8a(era),
      nonce: new Index(nonce),
      version: version ? new RuntimeVersion(JSON.parse(version)) : undefined
    };
    
    await wallet.sign(ext, address, options);

    return ext.signature.signature.toHex();
  }

  displayExtrinsic(signPayload: SignPayload, ext: Extrinsic) {
    // table style
    const chars = { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' };

    const infoTable = new Table({chars});
    const argTable = new Table({chars});
 
    infoTable.push(
      { 'Section Name': ext.method.sectionName},
      { 'Method Name': ext.method.methodName },
    );
    console.log('Extrinsic:');
    console.log('Basic info')
    console.log(infoTable.toString());
    
    const args: {[x: string]: string;}[] = Object.keys(ext.method.argsDef).map(
      (key, index) => ({[key]: ext.method.args[index].toString()})
    );
    argTable.push(
      ...args
    );
    console.log('Arguments');
    console.log(argTable.toString());
  }

  isSignPayload( input: any) {
    return input.hasOwnProperty('extrinsic')
      && input.hasOwnProperty('method')
      && input.hasOwnProperty('meta')
      && input.hasOwnProperty('address')
      && input.hasOwnProperty('blockHash')
      && input.hasOwnProperty('nonce');
  }
}
