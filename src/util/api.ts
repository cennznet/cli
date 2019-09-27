import {Api} from '@cennznet/api';
import {getProvider} from '@cennznet/api/util/getProvider';
import {ApiPromise} from '@plugnet/api';

import {Networks} from '../constants';
import JsonRpcClient from '../jsonrpc/client';
import {ApiOptions, NetworkConfig, NetworkName, SupportedApi, SupportedApiClass} from '../types';

export async function createApi<T extends SupportedApi>(
  url?: string, network?: NetworkName, types?: ApiOptions['types']): Promise<T> {
  const [ApiClass, options] = await detect(url, network);
  options.types = {...options.types, ...(types || {})};
  const api = new ApiClass(options) as T;
  return api.isReady as Promise<T>;
}

export async function detect(_url?: string, _network?: NetworkName): Promise<[SupportedApiClass, ApiOptions]> {
  let config: NetworkConfig;
  let url: string;
  let apiClass: SupportedApiClass;
  const network = _network && _network.toUpperCase() as NetworkName;
  if (network && Networks[network]) {
    config = {...Networks[network]};
    url = config.defaultEndpoint;
  } else if (_url) {
    url = _url;
    config = await networkConfigDetect(url as string);
  } else {
    throw new Error('no enough information to detect network');
  }

  if (config.apiClass) {
    apiClass = config.apiClass;
  } else {
    apiClass = await apiClassDetect(url);
  }

  config.options.provider = getProvider(url);
  return [apiClass, config.options];
}

async function networkConfigDetect(url: string): Promise<NetworkConfig> {
  return JsonRpcClient.with(url, undefined, async jsonrpc => {
    const blockHash = await jsonrpc.send('chain_getBlockHash', [0]);

    const config = Object.values(Networks).find(({genesisBlockHash}) => genesisBlockHash === blockHash)
      || Networks.CUSTOM;
    return {...config};
  });
}

async function apiClassDetect(url: string): Promise<SupportedApiClass> {
  return JsonRpcClient.with(url, undefined, async jsonrpc => {
    const {specName} = await jsonrpc.send('chain_getRuntimeVersion', []);
    if (specName === 'cennznet') {
      return Api;
    } else {
      return ApiPromise;
    }
  });
}
