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
import * as fs from 'fs';

import {BaseWalletCommand, DEFAULT_HOME} from '../../BaseCommand';
import {ReplManager} from '../../repl';

const DEFAULT_REPO_DIR = `${DEFAULT_HOME}/scripts/default`;

export default class ScriptRunCommand extends BaseWalletCommand {
  static strict = false;

  static description = `Run a script
`;

  static args = [
    {name: 'script', required: true}
  ];

  static flags = {
    ...BaseWalletCommand.flags,
    endpoint: flags.string({
      char: 'c',
      description: 'cennznet node endpoint',
      default: 'wss://rimu.unfrastructure.io/public/ws'
    }),
    noApi: flags.boolean({default: false,
      description: 'pass true if the script doesn\'t need to connect to the network'})
  };

  async run() {
    this.checkExistence();
    const {flags, args: {script}, argv} = this.parse(ScriptRunCommand);
    const {endpoint, noApi} = flags;
    const context: any = {};

    const replManager = new ReplManager();
    replManager.silent = true;
    const scriptPath = `${DEFAULT_REPO_DIR}/${script}.js`;
    const apiP = noApi ? null : Api.create({
      provider: endpoint
    });
    context.argv = argv;
    context.loadWallet = () => this.loadWallet(flags);
    await replManager.start(apiP, undefined, context, {prompt: ''});
    await apiP;
    const success = await replManager.evalScript(scriptPath);

    this.exit(success ? 0 : 1);
  }

  protected checkExistence() {
    if (!fs.existsSync(DEFAULT_REPO_DIR)) {
      this.error('not initialized. Run script:update first.');
    }
  }
}
