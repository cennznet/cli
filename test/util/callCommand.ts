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
// See the License for the specific la

import {loadConfig} from '@oclif/test/lib/load-config';

export default async function callCommand(cmdId: string, args: string[]) {
  const config = await loadConfig({}).run({} as any);
  const cmd = config.findCommand(cmdId);
  if (cmd) {
    const command = cmd.load();
    await command.run(args, config);
  }
}
