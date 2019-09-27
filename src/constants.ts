import {Api} from '@cennznet/api';

import {NetworkConfig, NetworkName} from './types';

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
    genesisBlockHash: '0xe3777fa922cafbff200cadeaea1a76bd7898ad5b89f7848999058b50e715f636',
    options: {},
    // FIXME: having tls error when connecting to the default node
    defaultEndpoint: 'wss://kusama-rpc.polkadot.io'
  },
  EDGEWARE: {
    // genesisBlockHash: false,
    options: {},
    defaultEndpoint: 'wss://mainnet1.edgewa.re/'
  },
  FLAMING_FIR: {
    genesisBlockHash: '0xb653e1771acc541584e57e5a624a40353ec33defcdf957a8e5e204424d1a1d25',
    options: {},
    defaultEndpoint: 'wss://substrate-rpc.parity.io'
  },
  ALEXANDER: {
    genesisBlockHash: '0xdcd1346701ca8396496e52aa2785b1748deb6db09551b72159dcb3e08991025b',
    options: {},
    defaultEndpoint: 'wss://poc3-rpc.polkadot.io'
  }
};
