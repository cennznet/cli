import {flags} from '@oclif/command';
import * as fs from 'fs';

import {BaseWalletCommand} from './BaseCommand';
import {SupportedApi} from './types';
import {createApi} from './util/api';

export abstract class BaseApiCommand extends BaseWalletCommand {
  static flags = {
    ...BaseWalletCommand.flags,
    endpoint: flags.string({
      char: 'c',
      description: 'cennznet node endpoint',
      default: 'wss://rimu.unfrastructure.io/public/ws'
    }),
    typeDef: flags.string({
      char: 't',
      description: 'path to json which contains additional type definitions'
    }),
    network: flags.string({
      char: 'n',
      description: 'network to connect to'
    })
  };

  protected async instantiateApi(flags: any): Promise<SupportedApi> {
    const {endpoint, typeDef, network} = flags;
    const types = this.readTypeDef(typeDef);
    return createApi(endpoint, network.toUpperCase(), types);
  }

  protected readTypeDef(typeDef: string) {
    if (typeDef) {
      return JSON.parse(fs.readFileSync(typeDef, {encoding: 'utf-8'}));
    }
  }
}
