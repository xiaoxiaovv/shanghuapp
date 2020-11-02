"use strict";
exports.__esModule = true;
var AdapterInterval_1 = require("./AdapterInterval");
var AdapterIntervalFactory_1 = require("./AdapterIntervalFactory");
/**
 * 创建定时器方法 简写
 * @param fn                        回调函数
 * @param params                    AdapterIntervalParams
 * @param options                   AdapterIntervalOptions
 */
exports.setInterval = function (fn, params, options) {
    return AdapterIntervalFactory_1.AdapterIntervalFactory.createInterval(fn, params, options);
};
/**
 * 销毁指定定时器方法 简写
 * @param key                       定时器名称
 */
exports.removeInterval = function (key) {
    return AdapterIntervalFactory_1.AdapterIntervalFactory.destroyInterval(key);
};
/**
 * 批量删除定时器方法 简写
 * @param keys                      定时器名称数组，不传会自动销毁全部定时器
 */
exports.clearInterval = function (keys) {
    return AdapterIntervalFactory_1.AdapterIntervalFactory.destroyIntervals(keys);
};
/**
 * 设置延时器
 * @param fn                        回调函数
 * @param delay                     间隔时长，单位ms
 */
exports.setTimeout = function (fn, delay) {
    if (delay === void 0) { delay = 100; }
    var interval = new AdapterInterval_1.AdapterInterval(fn, { delay: delay });
    interval.startTimeout();
};
