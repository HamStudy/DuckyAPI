import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import IORedis from 'ioredis'
import { ConfigService } from 'src/config/config.service'

@Injectable()
export class DeleteForDomainConfigService implements BullOptionsFactory {
  private redisUrl: string | IORedis.RedisOptions

  constructor(config: ConfigService) {
    this.redisUrl = config.REDIS
  }

  createBullOptions(): BullModuleOptions {
    return {
      name: 'deleteForDomain',
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          delay: 6000,
          type: 'exponential',
        },
        removeOnComplete: 1000,
      },
      redis: this.redisUrl,
    }
  }
}
