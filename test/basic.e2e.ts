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

describe('cennz-cli help', () => {
  test
    .stdout()
    .command(['help'])
    .timeout(30000)
    .it('should display correct information', ctx => {
      expect(ctx.stdout).contains('api');
      expect(ctx.stdout).contains('ext');
      expect(ctx.stdout).contains('help');
      expect(ctx.stdout).contains('repl');
      expect(ctx.stdout).contains('script');
      expect(ctx.stdout).contains('wallet');
    });
});

// TODO: test cases for api
describe('api', () => {});
