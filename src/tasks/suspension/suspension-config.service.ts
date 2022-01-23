import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import IORedis from 'ioredis'
import { ConfigService } from 'src/config/config.service'

@Injectable()
export class SuspensionConfigService implements BullOptionsFactory {
  private redis: string | IORedis.RedisOptions

  constructor(config: ConfigService) {
    this.redis = config.REDIS
  }

  createBullOptions(): BullModuleOptions {
    return {
      name: 'suspension',
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          delay: 6000,
          type: 'exponential',
        },
        removeOnComplete: 1000,
      },
      redis: this.redis,
    }
  }
}
