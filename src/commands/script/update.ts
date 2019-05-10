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

import {Command} from '@oclif/command';
import fs = require('fs');
import SimpleGit from 'simple-git/promise';

import {DEFAULT_HOME} from '../../BaseCommand';

import ScriptListCommand from './list';

const DEFAULT_REPO_DIR = `${DEFAULT_HOME}/scripts/default`;
const DEFAULT_REPO_URL = 'git@bitbucket.org:centralitydev/cennz-cli-scripts-repo.git';

export default class ScriptUpdateCommand extends Command {
  static strict = false;

  static description = `Pull changes of scripts from remote
`;

  static flags = {};

  async run() {
    this.initDefaultFolder();
    const git = SimpleGit(DEFAULT_REPO_DIR);
    if (fs.existsSync(`${DEFAULT_REPO_DIR}/.git`)) {
      await git.reset('hard');
      const res = await git.pull();
      this.printResult(res);
    } else {
      await git.clone(DEFAULT_REPO_URL, DEFAULT_REPO_DIR);
      const list = new ScriptListCommand([], this.config);
      await list.run();
    }
  }

  private initDefaultFolder() {
    if (!fs.existsSync(DEFAULT_REPO_DIR)) {
      fs.mkdirSync(DEFAULT_REPO_DIR, {recursive: true});
    }
  }

  private printResult(res: any): void {
    for (const key of Object.keys(res)) {
      console.log(key, res[key]);
    }
  }
}
