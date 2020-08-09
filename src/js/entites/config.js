import { timestamp } from '../utils'

/**
 * 配置类
 */
class Config {
  constructor (model = {}) {
    this.key = model.key
    this.val = model.val
    this.created = model.created || timestamp()
    this.updated = model.updated || timestamp()
  }
}

export default Config
