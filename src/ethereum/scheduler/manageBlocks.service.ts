import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';

@Injectable()
export class PendingAnchor {
  private _jobIsRunning = false;

  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}
  private readonly logger = new Logger(PendingAnchor.name);

  @Cron('1 * * * * *')
  async handleCron() {
    this.logger.debug('CronJob for PendingAnchor');

    this._jobIsRunning = false;
  }

  async saveBlockNumber(blockNumber: number) {
    try {
      await this.cacheService.set('blockNumber', blockNumber);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getBlockNumber() {
    try {
      return await this.cacheService.get('blockNumber');
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
