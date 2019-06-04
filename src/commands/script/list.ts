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
import * as path from 'path';

import {DEFAULT_HOME} from '../../BaseCommand';

const DEFAULT_REPO_DIR = `${DEFAULT_HOME}/scripts/default`;

export default class ScriptListCommand extends Command {
  static strict = false;

  static description = `List all available scripts
`;

  static flags = {};

  async run() {
    this.checkExistence();
    const content = fs.readdirSync(DEFAULT_REPO_DIR);
    for (const file of content) {
      if (!file.startsWith('.') && file.endsWith('.js')) {
        const filePath = path.parse(file);
        console.log(filePath.name);
      }
    }
  }

  protected checkExistence() {
    if (!fs.existsSync(DEFAULT_REPO_DIR)) {
      this.error('not initialized. Run script:update first.');
    }
  }
}
