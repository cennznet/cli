import {Api} from '@cennznet/api';

import {ApiOptions, NetworkConfig, NetworkName} from './types';

export const Networks: { [key in NetworkName]: NetworkConfig } = {
  CUSTOM: {
    options: {},
    defaultEndpoint: 'ws://localhost:9944'
  },
  RIMU: {
    apiClass: Api,
    genesisBlockHash: '0x4120b292ad0f8b909d7eb7177dd254da4b562eb5c03eba6a7b7322848da2f751',
    options: {},
    defaultEndpoint: 'wss://rimu.unfrastructure.io/public/ws'
  },
  KUSAMA: {
    // genesisBlockHash: false,
    options: {},
    defaultEndpoint: 'wss://kusama-rpc.polkadot.io'
  },
  EDGEWARE: {
    // genesisBlockHash: false,
    options: {},
    defaultEndpoint: 'wss://mainnet1.edgewa.re'
  },
  FLAMING_FIR: {
    // genesisBlockHash: false,
    options: {},
    defaultEndpoint: 'wss://substrate-rpc.parity.io'
  },
  ALEXANDER: {
    // genesisBlockHash: false,
    options: {},
    defaultEndpoint: 'wss://poc3-rpc.polkadot.io'
  }
};

export const CHAIN_TYPES: ApiOptions['typesChain'] = {
  'Rimu CENNZnet 0.9.20': {

  }
};
