import { CommonFuncType, CommonMapPool } from '@red-bean/red-bean'
import { AdapterInterval, AdapterIntervalParams, AdapterIntervalOptions } from './AdapterInterval'

/**
 * AdapterIntervalFactory
 */
export class AdapterIntervalFactory {

  /**
   * 定时器池
   * @private
   * @type {CommonMapPool<string, AdapterInterval>}
   * @memberof AdapterIntervalFactory
   */
  private pool: CommonMapPool<string, AdapterInterval> = new CommonMapPool<string, AdapterInterval>()

  /**
   * 工厂实例
   * @private
   * @static
   * @type {*}
   * @memberof AdapterIntervalFactory
   */
  private static self: any = null

  /**
   * 获取工厂单例
   */
  public static store(): AdapterIntervalFactory {
    if (AdapterIntervalFactory.self === null) {
      AdapterIntervalFactory.self = new AdapterIntervalFactory()
    }
    return AdapterIntervalFactory.self
  }

  /**
   * 创建定时器
   * @param fn                      回调函数
   * @param params                  AdapterIntervalParams
   * @param options                 AdapterIntervalOptions
   */
  public static createInterval(fn: CommonFuncType, params?: AdapterIntervalParams, options?: AdapterIntervalOptions): AdapterInterval | null {
    if (params !== undefined && params.name !== undefined && AdapterIntervalFactory.self !== null && !AdapterIntervalFactory.self.pool.has(params.name)) {
      let interval = new AdapterInterval(fn, params, options)
      AdapterIntervalFactory.self.pool.set(params.name, interval)
      return interval
    }
    return null
  }

  /**
   * 销毁定时器
   * @param key                    定时器名称 
   */
  public static destroyInterval(key: string) {
    if (AdapterIntervalFactory.self !== null && AdapterIntervalFactory.self.pool.has(key)) {
      let interval = AdapterIntervalFactory.self.pool.get(key)
      interval.closeInterval()
      AdapterIntervalFactory.self.pool.delete(key)
    }
  }

  /**
   * 批量销毁定时器
   * @param keys                  定时器名称数组，不传会自动销毁全部定时器
   */
  public static destroyIntervals(keys?: string[]) {
    if (keys !== undefined) {
      keys.map((key: string) => {
        AdapterIntervalFactory.destroyInterval(key)
      })
    } else {
      let pool = AdapterIntervalFactory.self.pool.getPool()
      for (let key of pool.keys()) {
        AdapterIntervalFactory.destroyInterval(key)
      }
    }
  }
}

// 全局单例化
AdapterIntervalFactory.store()