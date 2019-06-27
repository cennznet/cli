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

import {expect, test} from '@oclif/test';

import callCommand from './util/callCommand';

const stdin = require('mock-stdin').stdin();

const TEST_ACCOUNT = {
  seed: 'cennznetjstest',
  address: '5EJ1rhzWZTwriwiftPnv4BL9HKsBANH5r5c184oqXUJdhqb4'
};

let generatedAccountAddress = '';

describe('wallet', () => {
  // TODO: adding --yes flag
  test
    .do(async () => {
      await Promise.all([
        callCommand('wallet:create', []),
        new Promise(async (resolve) => {
          setTimeout(() => {
            stdin.send('y');
            stdin.send('y');
            resolve();
          }, 5000);
        })
      ]);
    })
    .stdout()
    .command('wallet:list')
    .it(':create creates a wallet', ctx => {
      expect(ctx.stdout).eq('');
    });

  test
    .stdout()
    .command(['wallet:add', '--seedText', TEST_ACCOUNT.seed])
    .it(':add adds an account to wallet', ctx => {
      expect(ctx.stdout).contains(`account ${TEST_ACCOUNT.address} is added`);
    });

  test
    .stdout()
    .command(['wallet:list'])
    .it(':list should lists all accounts includes the test account', ctx => {
      expect(ctx.stdout).contains(TEST_ACCOUNT.address);
    })
    ;

  test
    .stdout()
    .command(['wallet:remove', TEST_ACCOUNT.address])
    .it(':remove should remove the test account successfully', ctx => {
      expect(ctx.stdout).contains(`account ${TEST_ACCOUNT.address} is removed`);
    });

  test
    .stdout()
    .command(['wallet:list'])
    .it(':list should lists all accounts, the test account should be removed', ctx => {
      expect(ctx.stdout).not.contains(TEST_ACCOUNT.address);
    });

  test
    .stdout()
    .command(['wallet:generate'])
    .do(async ctx => {
      generatedAccountAddress = getAccountAddressFromResponse(ctx.stdout);
      expect(generatedAccountAddress).not.eq('');

      // remove generated account
      await callCommand('wallet:remove', [generatedAccountAddress]);
    })
    .it('should generate an account');
});

function getAccountAddressFromResponse(string: string): string {
  // const string = 'Address:  5CtwKogp7ZnLFmTzvALze3p8XSTna1gjKvsnp8tPWRWaJ4od\nSeed:  0x73c7f1ac65d67383c2a48a575f3a83e0b776935e5c4f1ac1881ab506dd795287\n';

  // tslint:disable-next-line: no-regex-spaces
  const reg = /^Address: {2}(.+)\nSeed: {2}(.+)\n$/;

  const res = reg.exec(string);

  if (res === null) { return ''; }

  return res[1];
}
