import { Injectable, Logger } from '@nestjs/common'
import { classToClass, plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'
import fs from 'fs'
import json5 from 'json5'

import { DuckyApiConfig } from './ducky-api-config.class'

export type EnvConfig = Record<string, any>

@Injectable()
export class ConfigService extends DuckyApiConfig {
  constructor(filePath: string) {
    super()
    const config = json5.parse(fs.readFileSync(filePath).toString('utf8'))
    this.validateConfig(config)
  }

  private readonly logger = new Logger(ConfigService.name, true)

  /**
   * Ensures all needed variables are set, and assigns them to this class
   */
  private async validateConfig(envConfig: EnvConfig): Promise<void> {
    // Run the transformer twice, as the transform decorator seems to run after the type decorator
    let duckyApiConfig = plainToClass(DuckyApiConfig, envConfig)
    duckyApiConfig = classToClass(duckyApiConfig)

    try {
      await validateOrReject(duckyApiConfig, { validationError: { target: false, value: false } })
    } catch (errors) {
      this.logger.error('Configuration validation failed')
      this.logger.error(errors)
      process.exit(1)
    }
    Object.assign(this, duckyApiConfig)
  }
}
