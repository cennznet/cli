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

import {stringToU8a, u8aToHex} from '@cennznet/util';
import {SimpleKeyring} from '@cennznet/wallet';

const toyKeyringNames = ['Alice',
  'Bob',
  'Charlie',
  'Dave',
  'Eve',
  'Ferdie',
  'Andrea',
  'Brooke',
  'Courtney',
  'Drew',
  'Emily',
  'Frank'
];

export function toyKeyringFromNames() {
  const keyring = new SimpleKeyring();
  const toyKeyring = toyKeyringNames.reduce(function (accountsMap: any, name) {
    accountsMap[name] = keyring.addFromUri(`//${name}`);
    return accountsMap;
  }, {});
  return toyKeyring;
}

export function seedToAccount(seedHex: string): {address: string, seed: string} {
  const keyring = new SimpleKeyring();
  const seed = stringToU8a(seedHex.padEnd(32, ' '));
  const kp = keyring.addFromSeed(seed);
  return {address: kp.address, seed: u8aToHex(seed)};
}

export function seedToPair(seedHex: string) {
  const keyring = new SimpleKeyring();
  const seed = stringToU8a(seedHex.padEnd(32, ' '));
  return keyring.addFromSeed(seed);
}
