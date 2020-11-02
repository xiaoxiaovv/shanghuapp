import {
  CommonFuncType,
  CommonWorker,
  Interval,
  IntervalContext,
  IntervalParams,
  IntervalOptionsPresetType,
  IntervalPresetOptionsFactory,
  isIntervalOptionsPresetType
} from '@red-bean/red-bean'

/**
 * AdapterIntervalParams
 */
export type AdapterIntervalParams = IntervalParams

/**
 * AdapterIntervalOptions
 */
export type AdapterIntervalOptions = IntervalOptionsPresetType | IntervalParams

/**
 * AdapterInterval
 */
export class AdapterInterval extends Interval {

  /**
   * 解析参数和配置
   * @private
   * @static
   * @memberof AdapterInterval
   */
  private static resolveParamsAndOptions = (params?: AdapterIntervalParams, options?: AdapterIntervalOptions): IntervalParams => {
    let finalParams: IntervalParams = {}
    if (params !== undefined) {
      finalParams = CommonWorker.merge(finalParams, params)
    }
    if (options === undefined) {
      options = IntervalOptionsPresetType.NORMAL
    }
    let tmpParams: any = options
    if (isIntervalOptionsPresetType(options)) {
      tmpParams = IntervalPresetOptionsFactory.get(options as IntervalOptionsPresetType)
    }
    finalParams = CommonWorker.merge(finalParams, tmpParams)
    return finalParams
  }

  /**
   * 构造方法
   * @param fn                      回调方法
   * @param params                  AdapterIntervalParams
   * @param options                 AdapterIntervalOptions
   */
  public constructor(fn: CommonFuncType, params?: AdapterIntervalParams, options?: AdapterIntervalOptions) {
    let finalParams: IntervalParams = AdapterInterval.resolveParamsAndOptions(params, options)
    super(fn, finalParams)
    this.autoFit()
  }
  
  /**
   * 公共代码
   */
  protected autoFit() {
    const setIntervalX = (fn, delay) => setInterval(fn, delay)
    const clearIntervalX = (id) => clearInterval(id)
    const setTimeoutX = (fn, delay) => setTimeout(fn, delay)
    const clearTimeoutX = (id) => clearTimeout(id)
    this.setContext({
      setInterval: setIntervalX,
      clearInterval: clearIntervalX,
      setTimeout: setTimeoutX,
      clearTimeout: clearTimeoutX
    }) 
  }

  /**
   * 设置上下文
   * @param interval                IntervalContext
   */
  protected setContext(interval: IntervalContext) {
    this.interval = interval
  }
}