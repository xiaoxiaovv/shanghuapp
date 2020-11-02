"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var red_bean_1 = require("@red-bean/red-bean");
/**
 * AdapterInterval
 */
var AdapterInterval = /** @class */ (function (_super) {
    __extends(AdapterInterval, _super);
    /**
     * 构造方法
     * @param fn                      回调方法
     * @param params                  AdapterIntervalParams
     * @param options                 AdapterIntervalOptions
     */
    function AdapterInterval(fn, params, options) {
        var _this = this;
        var finalParams = AdapterInterval.resolveParamsAndOptions(params, options);
        _this = _super.call(this, fn, finalParams) || this;
        _this.autoFit();
        return _this;
    }
    /**
     * 公共代码
     */
    AdapterInterval.prototype.autoFit = function () {
        var setIntervalX = function (fn, delay) { return setInterval(fn, delay); };
        var clearIntervalX = function (id) { return clearInterval(id); };
        var setTimeoutX = function (fn, delay) { return setTimeout(fn, delay); };
        var clearTimeoutX = function (id) { return clearTimeout(id); };
        this.setContext({
            setInterval: setIntervalX,
            clearInterval: clearIntervalX,
            setTimeout: setTimeoutX,
            clearTimeout: clearTimeoutX
        });
    };
    /**
     * 设置上下文
     * @param interval                IntervalContext
     */
    AdapterInterval.prototype.setContext = function (interval) {
        this.interval = interval;
    };
    /**
     * 解析参数和配置
     * @private
     * @static
     * @memberof AdapterInterval
     */
    AdapterInterval.resolveParamsAndOptions = function (params, options) {
        var finalParams = {};
        if (params !== undefined) {
            finalParams = red_bean_1.CommonWorker.merge(finalParams, params);
        }
        if (options === undefined) {
            options = red_bean_1.IntervalOptionsPresetType.NORMAL;
        }
        var tmpParams = options;
        if (red_bean_1.isIntervalOptionsPresetType(options)) {
            tmpParams = red_bean_1.IntervalPresetOptionsFactory.get(options);
        }
        finalParams = red_bean_1.CommonWorker.merge(finalParams, tmpParams);
        return finalParams;
    };
    return AdapterInterval;
}(red_bean_1.Interval));
exports.AdapterInterval = AdapterInterval;
