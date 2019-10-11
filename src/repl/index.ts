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

import * as util from '@cennznet/util';
import {SimpleKeyring} from '@cennznet/wallet';
import {cryptoWaitReady} from '@plugnet/util-crypto';
import chalk from 'chalk';
import EventEmitter from 'events';
import fs from 'fs';
import Repl from 'repl';

import {SupportedApi} from '../types';
import * as moreUtil from '../util';
import {toyKeyringFromNames} from '../util/toyKeyring';
import {AutoFlushWallet} from '../wallet/AutoFlushWallet';

class ReplManager extends EventEmitter {
  // @ts-ignore
  _repl: Repl.REPLServer;
  silent = false;

  async start(apiP: Promise<SupportedApi> | null, wallet: AutoFlushWallet | undefined, context: any, options: object) {
    const repl = Repl.start({
      breakEvalOnSigint: true,
      ...options
    });

    this._repl = repl;

    // bubble 'exit' event
    repl.on('exit', () => this.emit('exit'));
    await cryptoWaitReady();
    // setup repl server context
    Object.assign(repl.context, {
      wallet,
      util: {...util, ...moreUtil},
      console,
      Keyring: SimpleKeyring,
      toyKeyring: toyKeyringFromNames(),
      ...require('@cennznet/types'), ...require('@cennznet/wallet')
    }, context);
    if (wallet) {
      this.print(`${chalk.yellowBright('wallet')} is available in repl's context`);
    }
    try {
      if (apiP) {
        const api = await apiP;
        this.print('api is loaded now');
        this.print(`${chalk.yellowBright('api')} is available in repl's context`);
        api.setSigner(wallet as AutoFlushWallet);
        repl.context.api = api;
      }
    // tslint:disable-next-line: no-unused
    } catch (e) {
    }
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
