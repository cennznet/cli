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
import * as util from '@cennznet/util';
import chalk from 'chalk';
import EventEmitter = require('events');
import fs = require('fs');
import Repl = require('repl');

import * as moreUtil from '../util';
import {createUtilApi} from '../util-api';
import {toyKeyringFromNames} from '../util/toyKeyring';
import {AutoFlushWallet} from '../wallet/AutoFlushWallet';

// import {evalFrom} from './eval';

class ReplManager extends EventEmitter {
  // @ts-ignore
  _repl: Repl.REPLServer;
  silent = false;

  async start(apiP: Promise<Api> | null, wallet: AutoFlushWallet | undefined, context: any, options: object) {
    const repl = Repl.start({
      breakEvalOnSigint: true,
      ...options
    });

    this._repl = repl;
    // custom eval
    // (repl as any).eval = evalFrom(repl.eval);

    // bubble 'exit' event
    repl.on('exit', () => this.emit('exit'));

    // setup repl server context
    const moreContext: any = {
      wallet,
      util: {...util, ...moreUtil},
      console,
      Keyring: util.Keyring,
      ...require('@cennznet/types'), ...require('@cennznet/types/polkadot'), ...require('@cennznet/wallet')
    };
    if (wallet) {
      this.print(`${chalk.yellowBright('wallet')} is available in repl's context`);
    }
    try {
      if (apiP) {
        const api = await apiP;
        this.print('api is loaded now');
        this.print(`${chalk.yellowBright('api utilApi genericAsset spotX')} is available in repl's context`);
        api.setSigner(wallet as AutoFlushWallet);
        moreContext.api = api;
        moreContext.utilApi = createUtilApi(api);
        // runtime commands
        // const spotX = await SpotX.create(api);
        // const genericAsset = spotX.ga;
        moreContext.genericAsset = api.genericAsset;
        moreContext.spotX = api.cennzxSpot;
      }
      moreContext.toyKeyring = toyKeyringFromNames();
    // tslint:disable-next-line: no-unused
    } catch (e) {
    }

    Object.assign(repl.context, moreContext, context);
  }

  evalCmd(cmd: string) {
    return new Promise(resolve => {
      this._repl.eval(
        cmd,
        this._repl.context,
        'repl',
        async (err: Error | null, result: any) => {
          result = await result;
          if (err) {
            console.error(err);
            resolve(false);
          } else {
            if (result !== undefined) {
              console.log(result);
            }
            resolve(true);
          }
        }
      );
    });
  }

  evalScript(scriptPath: string) {
    const script = fs.readFileSync(scriptPath).toString('utf-8');
    const p = this.evalCmd(script);
    (this._repl as any).eval = () => {};
    return p;
  }

  protected print(text: string): void {
    if (!this.silent) {
      console.log(text);
    }
  }
}

export {ReplManager};
