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

import {expect} from '@oclif/test';

import {Networks} from '../src/constants';

const {spawn} = require('child_process');

describe('cennz-cli repl', () => {
  it('should run script successfully', done => {
    const bat = spawn('./bin/cennz-cli', ['repl', '--endpoint', 'wss://rimu.unfrastructure.io/public/ws', './test/scripts/query.js']);

    bat.stdout.on('data', (data: any) => {
      console.log(data);
      expect(data).match(/nextAssetId:\s+\d+/);
      done();
    });
  });
});

describe('cennz-cli repl (by network)', () => {
  for (const network of Object.keys(Networks)) {
    if (network !== 'CUSTOM' && network !== 'EDGEWARE') {
      it(`should run script in specified network ${network}`, done => {
        const bat = spawn('./bin/cennz-cli', ['repl', '--network', network, './test/scripts/chain.js']);

        bat.stdout.on('data', (data: any) => {
          expect(data).match(/chain info:\s+\w+/);
          done();
        });
      });
    }
  }
});
