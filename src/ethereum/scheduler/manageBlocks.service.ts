import { EthereumService } from './../service/ethereum.service';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

@Injectable()
export class EthereumIndexer {
  private _jobIsRunning = false;
  blocksQueue = [];
  lastBlockNumber = 0;

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly ethereumService: EthereumService,
  ) {}
  private readonly logger = new Logger(EthereumIndexer.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    this.logger.debug('CronJob for ETHEREUM_INDEXER');
    // const redisBlockNumber = await this.getBlockNumber();
    const block_number = await this.ethereumService.getBlockNumber();
    if (this.lastBlockNumber == 0) {
      console.log('Last Block Number was ZERO!');
      this.lastBlockNumber = block_number;
    } else if (this.lastBlockNumber < block_number) {
      this.saveBlockNumber(block_number);
    }

    // const blocks = await this.ethereumService.getBlock(block_number);

    this._jobIsRunning = false;
  }

  async saveBlockNumber(blockNumber: number) {
    try {
      console.log('Updating Block Number');
      this.lastBlockNumber = blockNumber;
      if (
        this.blocksQueue.length > 0 &&
        this.blocksQueue[this.blocksQueue.length - 1] < blockNumber
      ) {
        this.blocksQueue.length++;
        this.blocksQueue.push(blockNumber);
        await this.cacheService.set(
          'blockNumber',
          JSON.stringify(this.blocksQueue),
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getBlockNumber() {
    try {
      return JSON.parse(await this.cacheService.get('blockNumber'));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  delay(seconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  }
}
