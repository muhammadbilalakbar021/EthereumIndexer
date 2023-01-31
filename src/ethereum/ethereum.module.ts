import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');
import { EthereumService } from './service/ethereum.service';
import { EthereumController } from './controller/ethereum.controller';
import { ResponseService } from 'src/utils/response/response.service';

@Module({
  providers: [
    EthereumService,
    ConfigService,
    ResponseService,
    {
      provide: 'EthWeb3',
      useFactory: (config: ConfigService) => {
        return new Web3(new Web3.providers.HttpProvider(config.ETH_RPC_URL));
      },
      inject: [ConfigService],
    },
  ],
  controllers: [EthereumController],
})
export class EthereumModule {}
