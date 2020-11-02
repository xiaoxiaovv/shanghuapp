"use strict";
exports.__esModule = true;
var red_bean_1 = require("@red-bean/red-bean");
var AdapterInterval_1 = require("./AdapterInterval");
/**
 * AdapterIntervalFactory
 */
var AdapterIntervalFactory = /** @class */ (function () {
    function AdapterIntervalFactory() {
        /**
         * 定时器池
         * @private
         * @type {CommonMapPool<string, AdapterInterval>}
         * @memberof AdapterIntervalFactory
         */
        this.pool = new red_bean_1.CommonMapPool();
    }
    /**
     * 获取工厂单例
     */
    AdapterIntervalFactory.store = function () {
        if (AdapterIntervalFactory.self === null) {
            AdapterIntervalFactory.self = new AdapterIntervalFactory();
        }
        return AdapterIntervalFactory.self;
    };
    /**
     * 创建定时器
     * @param fn                      回调函数
     * @param params                  AdapterIntervalParams
     * @param options                 AdapterIntervalOptions
     */
    AdapterIntervalFactory.createInterval = function (fn, params, options) {
        if (params !== undefined && params.name !== undefined && AdapterIntervalFactory.self !== null && !AdapterIntervalFactory.self.pool.has(params.name)) {
            var interval = new AdapterInterval_1.AdapterInterval(fn, params, options);
            AdapterIntervalFactory.self.pool.set(params.name, interval);
            return interval;
        }
        return null;
    };
    /**
     * 销毁定时器
     * @param key                    定时器名称
     */
    AdapterIntervalFactory.destroyInterval = function (key) {
        if (AdapterIntervalFactory.self !== null && AdapterIntervalFactory.self.pool.has(key)) {
            var interval = AdapterIntervalFactory.self.pool.get(key);
            interval.closeInterval();
            AdapterIntervalFactory.self.pool["delete"](key);
        }
    };
    /**
     * 批量销毁定时器
     * @param keys                  定时器名称数组，不传会自动销毁全部定时器
     */
    AdapterIntervalFactory.destroyIntervals = function (keys) {
        if (keys !== undefined) {
            keys.map(function (key) {
                AdapterIntervalFactory.destroyInterval(key);
            });
        }
        else {
            var pool = AdapterIntervalFactory.self.pool.getPool();
            for (var _i = 0, _a = pool.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                AdapterIntervalFactory.destroyInterval(key);
            }
        }
    };
    /**
     * 工厂实例
     * @private
     * @static
     * @type {*}
     * @memberof AdapterIntervalFactory
     */
    AdapterIntervalFactory.self = null;
    return AdapterIntervalFactory;
}());
exports.AdapterIntervalFactory = AdapterIntervalFactory;
// 全局单例化
AdapterIntervalFactory.store();
