import { CommonFuncType } from '@red-bean/red-bean'
import { AdapterInterval, AdapterIntervalParams, AdapterIntervalOptions } from './AdapterInterval'
import { AdapterIntervalFactory } from './AdapterIntervalFactory'

/**
 * 创建定时器方法 简写
 * @param fn                        回调函数
 * @param params                    AdapterIntervalParams
 * @param options                   AdapterIntervalOptions
 */
export const setInterval = (fn: CommonFuncType, params?: AdapterIntervalParams, options?: AdapterIntervalOptions): AdapterInterval | null => {
  return AdapterIntervalFactory.createInterval(fn, params, options)
}

/**
 * 销毁指定定时器方法 简写
 * @param key                       定时器名称
 */
export const removeInterval = (key: string) => {
  return AdapterIntervalFactory.destroyInterval(key)
}

/**
 * 批量删除定时器方法 简写
 * @param keys                      定时器名称数组，不传会自动销毁全部定时器  
 */
export const clearInterval = (keys?: string[]) => {
  return AdapterIntervalFactory.destroyIntervals(keys)
}

/**
 * 设置延时器
 * @param fn                        回调函数
 * @param delay                     间隔时长，单位ms
 */
export const setTimeout = (fn: CommonFuncType, delay: number = 100) => {
  let interval = new AdapterInterval(fn, { delay })
  interval.startTimeout()
}