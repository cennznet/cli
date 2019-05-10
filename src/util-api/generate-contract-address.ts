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

import {blake2AsHex, blake2AsU8a} from '@cennznet/util';

export default (
  contract_wasm: string,
  owner: Uint8Array,
  data_hash: Uint8Array = blake2AsU8a(new Uint8Array())
) => {
  const code_hash = blake2AsU8a(contract_wasm);
  const buf = Buffer.concat([code_hash, data_hash, owner]);
  const contract_addr = blake2AsHex(buf);
  return contract_addr;
};
