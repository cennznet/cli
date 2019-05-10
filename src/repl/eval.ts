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

// inspired(mostly copied) by(from):
// https://gist.github.com/princejwesley/a66d514d86ea174270210561c44b71ba

const preprocess = (input: string) => {
  const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
  const asyncWrapper = (code: string, binder: string) => {
    let assign = binder ? `global.${binder} = ` : '';
    return `(function(){ async function _wrap() { return ${assign}${code} } return _wrap();})()`;
  };
  // match & transform
  const match = input.match(awaitMatcher);
  if (match) {
    input = `${asyncWrapper(match[2], match[1])}`;
  }
  return input;
};

const evalFrom = (replEval: (...args: any[]) => any) => (
  cmd: string,
  context: string,
  filename: string,
  callback: (...args: any[]) => any
) => {
  try {
    replEval(preprocess(cmd), context, filename, callback);
  } catch (err) {
    callback(err);
  }
};

export {evalFrom};
