import {Api} from '@cennznet/api';
import {ApiOptions as CennznetApiOptions} from '@cennznet/api/types';
import {ApiPromise} from '@plugnet/api';
import {ApiOptions as PlugApiOptions} from '@plugnet/api/types';
import {Constructor} from '@plugnet/types/types';

export type SupportedApi = Api | ApiPromise;

export type SupportedApiClass = Constructor<SupportedApi>;

export type ApiOptions = PlugApiOptions | CennznetApiOptions;

export type NetworkConfig = {
  apiClass?: SupportedApiClass,
  genesisBlockHash?: string,
  options: ApiOptions,
  defaultEndpoint: string
};

export type NetworkName = 'CUSTOM' | 'RIMU' | 'KUSAMA' | 'EDGEWARE' | 'FLAMING_FIR' | 'ALEXANDER';
