import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
// import * as isLeapYear from "dayjs/plugin/isLeapYear"; // 导入插件
import "dayjs/locale/zh-cn"; // 导入本地化语言

import TimeTool from "../../components/Page/TimeTool";
import Tool from "../BaseTool";

import type { Duration } from "dayjs/plugin/duration";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration); // 使用插件
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

    private singleUpdateTime(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined) return;
        const now = performance.now();
        timing.t += now - timing.prevT;
        timing.callback?.(timing.t);
        timing.prevT = now;
        return timing;
    }
    private updateTime(key: symbol) {
        const timing = this.singleUpdateTime(key);
        if (timing === undefined) return;
        timing.interval = setTimeout(() => {
            this.updateTime(key);
        }, 50);
    }
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
    pauseTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval === null) return;
        clearInterval(timing.interval);
        timing.interval = null;
        this.singleUpdateTime(key);
        return timing.t;
    }
    resumeTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval) return;
        timing.prevT = performance.now();
        this.updateTime(key);
    }
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
    static readonly TIME_UNITS_IN_MS: Record<RangeType, number> = {
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2592000000, // Approximation: 30 days
        quarter: 7776000000, // Approximation: 3 months
        year: 31536000000, // Approximation: 365 days
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

        const sourceFactor = TTimeTool.TIME_UNITS_IN_MS[type];
        const targetFactor = TTimeTool.TIME_UNITS_IN_MS[targetType];

        if (!sourceFactor || !targetFactor) {
            throw new Error(`未知的时间单位: ${type} 或 ${targetType}`);
        }

        // 通过毫秒为基准进行单位换算
        return (value * sourceFactor) / targetFactor;
    }
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
        if (args.length === 0) return dayjs.duration(0);
        if (isPointTime(args[0].value)) {
            return args.reduce<dayjs.Dayjs | Duration>((prev, cur, index) => {
                if (index === 0) return prev;

                if (isPointTime(cur.value)) {
                    prev = prev as dayjs.Dayjs;
                    return dayjs.duration(
                        prev.valueOf() - cur.value.valueOf(),
                        "ms"
                    );
                } else {
                    let curValue = cur.value;
                    if (cur.rangeType === "quarter")
                        curValue = this.conversion(
                            curValue,
                            cur.rangeType,
                            "day"
                        );
                    const theDuration = dayjs.duration(
                        cur.value,
                        cur.rangeType === "quarter" ? "day" : cur.rangeType
                    );
                    switch (cur.symbol) {
                        case "+":
                            return prev.add(theDuration);
                        case "-":
                            return prev.subtract(theDuration);
                    }
                }
            }, args[0].value);
        }

        let firstValue = args[0].value;
        if (args[0].rangeType === "quarter")
            firstValue = this.conversion(firstValue, args[0].rangeType, "day");

        return args.reduce((prev, cur, index) => {
            if (index === 0) return prev;

            let curValue = cur.value;
            if (cur.rangeType === "quarter")
                curValue = this.conversion(
                    curValue as number,
                    cur.rangeType,
                    "day"
                );

            const theDuration = dayjs.duration(
                cur.value as number,
                cur.rangeType === "quarter" ? "day" : cur.rangeType
            );
            switch (cur.symbol) {
                case "+":
                    return prev.add(theDuration);
                case "-":
                    return prev.subtract(theDuration);
            }
        }, dayjs.duration(firstValue));
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
