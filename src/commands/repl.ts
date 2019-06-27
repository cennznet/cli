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
import {flags} from '@oclif/command';
import semver from 'semver';

import {BaseWalletCommand} from '../BaseCommand';
import {ReplManager} from '../repl';

const ARGS_NAMES = {
  script: 'script'
};

export default class ReplCommand extends BaseWalletCommand {
  static description = `Start a repl to interact with a node
  -------------
  1. Connect to a node by websocket:
  $ cennz-cli repl --endpoint="ws://localhost:9944 --passphrase='passphrase' --path='path for wallet vault'

  If no 'endpoint' flag, 'ws://localhost:9944' will be used as default.

  2. Optionally, like "node" cli, a expression or JS script could be provided:

  $ cennz-cli repl -p="toyKeyring.alice.address()"
  $ cennz-cli repl myScript.js

  The expression or script would be evaluated in the repl context, and the
  result would be printed. Note the interactive REPL would not be opened in this case.

  3. async/await is supported in repl enviroment, you can do:

  $ cennz-cli repl -p="const name = await api.rpc.system.chain()"
  [String: 'CENNZnet DEV']

  4. To load a file while in the repl enviroment, use \`.load\` command:
  `;

  static flags = {
    ...BaseWalletCommand.flags,
    endpoint: flags.string({
      char: 'c',
      description: 'cennznet node endpoint',
      default: 'ws://localhost:9944'
    }),
    evaluate: flags.string({
      char: 'e',
      description: 'evaluate script and print result'
    })
  };

  static args = [
    {
      name: ARGS_NAMES.script,
      required: false,
      description: 'the path of JS file which will be evaluated into context'
    }
  ];

  static strict = false;

  async run() {
    this.guardNodeVersion();

    const {flags, args} = this.parse(ReplCommand);

    // start the repl server
    const replManager = new ReplManager();
    replManager.on('exit', () => {
      this.log('bye...');
      // `this.exit` will cause an error, use `process.exit` instead
      process.exit();
    });

    const {evaluate, endpoint} = flags;
    const scriptPath = args[ARGS_NAMES.script];

    const interactive = !evaluate && !scriptPath;

    const options = {prompt: interactive ? '\u001B[34;1m(cennz-cli)> \u001B[0m' : ''};
    const context: any = {};
    const argv = [];
    if (scriptPath) {
      const scriptIdx = this.argv.findIndex(arg => arg === scriptPath);
      argv.push(...this.argv.slice(scriptIdx));
    }

    let wallet;
    if (interactive) {
      try {
        wallet = await this.loadWallet(flags);
      // tslint:disable-next-line: no-unused
      } catch (e) {
        console.warn('failed to load wallet');
      }
      context.loadWallet = () => this.loadWallet({...flags, passphrase: true});
    } else {
      context.loadWallet = () => this.loadWallet({...flags, passphrase: true});
    }
    const apiP = Api.create({
      provider: endpoint
    });
    if (evaluate || scriptPath) {
      replManager.silent = true;
    }
    context.argv = argv;
    await replManager.start(apiP, wallet, context, options);

    let success = true;

    // eval cmd
    if (evaluate) {
      await apiP;
      (success as any) = await replManager.evalCmd(evaluate);
    }

    // eval script
    if (scriptPath) {
      await apiP;
      success = (await replManager.evalScript(scriptPath)) && success;
    }

    if (!interactive) {
      process.exit(success ? 0 : 1);
    }
  }

  guardNodeVersion() {
    const nodeVersionRequirement = require('../../package.json').engines.node;
    const localNodeVersion = process.versions.node;
    if (!semver.satisfies(localNodeVersion, nodeVersionRequirement)) {
      console.error(`\u001b[31merror\u001B[0m Local NodeJS version is incompatible. Expected version "${nodeVersionRequirement}". Got "${localNodeVersion}".`);
      process.exit(1);
    }
  }
}
