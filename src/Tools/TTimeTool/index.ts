import type { Dayjs } from "dayjs";
import dayjs, { isDayjs } from "dayjs";
// import * as isLeapYear from "dayjs/plugin/isLeapYear"; // 导入插件
import "dayjs/locale/zh-cn"; // 导入本地化语言

import TimeTool from "../../components/Page/TimeTool";
import Tool from "../BaseTool";

import type { Duration } from "dayjs/plugin/duration";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration); // 使用插件
dayjs.extend(quarterOfYear);
dayjs.locale("zh-cn"); // 使用本地化语言

type CalType = "point" | "range";
type CalSymbol = "+" | "-";
const RangeLabel = {
    year: "年",
    quarter: "季度",
    month: "月",
    week: "周",
    day: "天",
    hour: "时",
    minute: "分",
    second: "秒",
} as const;

type RangeLabelType = typeof RangeLabel;
type RangeType = keyof RangeLabelType;

export interface TimeObj {
    y: number;
    m: number;
    d: number;
    h: number;
    i: number;
    s: number;
}

interface Timing {
    t: number;
    prevT: number;
    interval: NodeJS.Timeout | null;
    callback: (t: number) => void;
}

class TTimeTool extends Tool<typeof TimeTool> {
    timingTimes: Map<symbol, Timing> = new Map();
    constructor() {
        super(TimeTool, "时间工具", "TimeTool", "ClockCircleOutlined");
        this.description = "用于计时, 倒计时, 时间计算等功能的工具.";
    }
    get time() {
        return dayjs();
    }
    get today() {
        return dayjs()
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .set("millisecond", 0);
    }
    /**
     * 更新指定计时器的时间
     * @param key 计时器的唯一键
     * @returns 返回更新后的计时信息，如果未找到计时器则返回undefined
     */
    private singleUpdateTime(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined) return;
        const now = performance.now();
        timing.t += now - timing.prevT;
        timing.callback?.(timing.t);
        timing.prevT = now;
        return timing;
    }

    /**
     * 启动或更新指定计时器的时间，并在50毫秒后再次调用自身
     * @param key 计时器的唯一键
     */
    private updateTime(key: symbol) {
        const timing = this.singleUpdateTime(key);
        if (timing === undefined) return;
        timing.interval = setTimeout(() => {
            this.updateTime(key);
        }, 50);
    }

    /**
     * 开始一个新的计时器或重置一个现有的计时器
     * @param callback 计时器每次更新时调用的回调函数，接收经过的时间作为参数
     * @param key 计时器的唯一键，如果未提供则自动生成
     * @returns 返回计时器的唯一键
     */
    startTiming(callback: (t: number) => void, key?: symbol) {
        if (key === undefined) {
            key = Symbol();
        }

        let timing: Timing | undefined = this.timingTimes.get(key);

        if (timing && timing.interval) {
            clearInterval(timing.interval);
        }

        const now = performance.now();

        timing = { t: 0, prevT: now, interval: null, callback };
        this.timingTimes.set(key, timing);
        this.updateTime(key);
        return key;
    }

    /**
     * 暂停指定计时器，并更新其累计时间
     * @param key 计时器的唯一键
     * @returns 返回暂停时累计的时间，如果未找到计时器则返回undefined
     */
    pauseTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval === null) return;
        clearInterval(timing.interval);
        timing.interval = null;
        this.singleUpdateTime(key);
        return timing.t;
    }

    /**
     * 恢复指定计时器
     * @param key 计时器的唯一键
     */
    resumeTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval) return;
        timing.prevT = performance.now();
        this.updateTime(key);
    }

    /**
     * 停止并移除指定计时器
     * @param key 计时器的唯一键
     * @returns 返回停止时累计的时间，如果未找到计时器则返回undefined
     */
    stopTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined) return;

        if (timing.interval) {
            clearInterval(timing.interval);
            this.singleUpdateTime(key);
        }

        const result = timing.t;
        this.timingTimes.delete(key);
        return result;
    }

    static readonly TIME_UNITS_IN_MS: Record<
        Exclude<RangeType, "quarter">,
        number
    > = {
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2592000000, // Approximation: 30 days
        year: 220752000000, // Approximation: 365 days
    };

    /**
     * 时间单位转换函数
     * @param value - 待转换的数值
     * @param type - 当前数值的单位
     * @param targetType - 目标单位
     * @returns 转换后的数值
     */
    conversion(value: number, type: RangeType, targetType: RangeType): number {
        if (value === 0) return 0;
        if (type === targetType) return value;
        if (type === "quarter") {
            value = value * 3;
            type = "month";
        }
        if (targetType === "quarter") {
            value = this.conversion(value, type, "month");
            return value * 3;
        }
        const sourceFactor = TTimeTool.TIME_UNITS_IN_MS[type];
        const targetFactor = TTimeTool.TIME_UNITS_IN_MS[targetType];

        if (!sourceFactor || !targetFactor) {
            throw new Error(`未知的时间单位: ${type} 或 ${targetType}`);
        }

        // 通过毫秒为基准进行单位换算
        return (value * sourceFactor) / targetFactor;
    }
    /**
     * 计算时间或持续时间的加减操作
     *
     * 此函数接受一个参数数组，每个参数包含一个值、一个符号和一个可选的范围类型
     * 它根据这些参数来计算时间或持续时间的加减结果
     *
     * @param args 参数数组，包含计算所需的时间或持续时间值、计算符号和范围类型
     * @returns 返回计算结果，可能是一个 Dayjs 实例或一个 Duration 实例
     */
    calculate(
        args: {
            value: number | Dayjs;
            symbol: CalSymbol;
            rangeType:
                | "second"
                | "minute"
                | "hour"
                | "day"
                | "month"
                | "year"
                | "quarter"
                | "week"
                | undefined;
        }[]
    ) {
        // 如果参数数组为空，则返回一个表示 0 的持续时间
        if (args.length === 0) return dayjs.duration(0);

        let firstValue = args[0].value;
        let firstValueType = args[0].rangeType;

        // 如果第一个参数的值是一个时间点，则进行时间点的计算
        if (isPointTime(firstValue)) {
            return args.reduce<dayjs.Dayjs | Duration>((prev, cur, index) => {
                // 对于第一个参数之后的每个参数，根据其值和符号进行计算
                if (index === 0) return prev;

                let curValue = cur.value;
                let curValueType = cur.rangeType;

                // 如果当前参数的值是一个时间点，则计算前一个值与当前值的时间差
                if (isPointTime(curValue)) {
                    prev = prev as dayjs.Dayjs;
                    return dayjs.duration(prev.diff(curValue));
                } else {
                    // 如果当前参数的范围类型是季度，则将其转换为月
                    if (curValueType === "quarter") {
                        curValue = this.conversion(
                            curValue,
                            curValueType,
                            "month"
                        );
                        curValueType = "month";
                    }
                    // 根据前一个值的类型和当前参数的符号进行加减操作
                    if (isDayjs(prev)) {
                        // 如果前一个值是一个时间点，则进行加减操作
                        switch (cur.symbol) {
                            case "+":
                                return prev.add(curValue, curValueType);
                            case "-":
                                return prev.subtract(curValue, curValueType);
                        }
                    } else {
                        // 如果前一个值是一个持续时间，则进行加减操作
                        const theDuration = dayjs.duration(
                            curValue,
                            curValueType
                        );
                        switch (cur.symbol) {
                            case "+":
                                return prev.add(theDuration);
                            case "-":
                                return prev.subtract(theDuration);
                        }
                    }
                }
            }, firstValue);
        } else {
            // 如果第一个参数的范围类型是季度，则将其转换为月
            if (firstValueType === "quarter") {
                firstValue = firstValue * 3;
                firstValueType = "month";
            }
            // 对于非时间点的参数，进行持续时间的计算
            return args.reduce((prev, cur, index) => {
                if (index === 0) return prev;

                let curValue = cur.value as number;
                let curValueType = cur.rangeType;

                // 如果当前参数的范围类型是季度，则将其转换为月
                if (curValueType === "quarter") {
                    curValue *= 3;
                    curValueType = "month";
                }

                const theDuration = dayjs.duration(curValue, curValueType);
                // 根据当前参数的符号进行加减操作
                switch (cur.symbol) {
                    case "+":
                        return prev.add(theDuration);
                    case "-":
                        return prev.subtract(theDuration);
                }
            }, dayjs.duration(firstValue, firstValueType as Exclude<RangeType, "quarter">));
        }
    }
    /**
     * 将给定的时间对象转换为一个包含时间单位的对象
     * 此函数支持两种类型的时间输入：Dayjs 或 Duration
     * 对于 Dayjs 类型，返回的是年、月、日、小时、分钟和秒
     * 对于 Duration 类型，同样返回年、月、日、小时、分钟和秒
     * 这样做的目的是为了提供一个统一的接口来处理不同类型的时间数据
     * @param time {Dayjs | Duration} - 输入的时间对象，可以是 Dayjs 类型或 Duration 类型
     * @returns 返回一个对象，包含年(y)、月(m)、日(d)、小时(h)、分钟(i)和秒(s)
     */
    getTimeObj(time: Dayjs | Duration) {
        if (isDayjs(time)) {
            return {
                y: time.year(),
                m: time.month() + 1,
                d: time.date(),
                h: time.hour(),
                i: time.minute(),
                s: time.second(),
            };
        } else {
            return {
                y: time.years(),
                m: time.months(),
                d: time.days(),
                h: time.hours(),
                i: time.minutes(),
                s: time.seconds(),
            };
        }
    }
}

function isPointTime(value: number | Dayjs): value is Dayjs {
    return typeof value !== "number";
}
// function isDayjs(value: Dayjs | Duration): value is Dayjs {
//     return !dayjs.isDuration(value);
// }
const instance = TTimeTool.getInstance();
export default instance;
export { isPointTime, RangeLabel };
export type { CalSymbol, CalType, RangeLabelType, RangeType };
