import dayjs from "dayjs";
// import * as isLeapYear from "dayjs/plugin/isLeapYear"; // 导入插件
import "dayjs/locale/zh-cn"; // 导入本地化语言

import Tool from "../BaseTool";
import TimeTool from "../../components/Page/TimeTool";

// dayjs.extend(isLeapYear); // 使用插件
dayjs.locale("zh-cn"); // 使用本地化语言

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

    private sigleUpdateTime(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined) return;
        const now = performance.now();
        timing.t += now - timing.prevT;
        timing.callback(timing.t);
        timing.prevT = now;
        return timing;
    }
    private updateTime(key: symbol) {
        const timing = this.sigleUpdateTime(key);
        if (timing === undefined) return;
        console.log(timing.t);
        timing.interval = setTimeout(() => {
            this.updateTime(key);
        }, 10);
    }
    startTiming(callback: (t: number) => void, key?: symbol) {
        if (key === undefined) {
            key = Symbol();
        } else if (
            this.timingTimes.has(key) &&
            this.timingTimes.get(key)!.interval
        ) {
            const timing = this.timingTimes.get(key)!;
            clearInterval(timing.interval!);
        }
        const now = performance.now();
        const timing: Timing = { t: 0, prevT: now, interval: null, callback };
        timing.interval = setTimeout(() => {
            this.updateTime(key);
        }, 20);
        this.timingTimes.set(key, timing);
        return key;
    }
    pauseTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval === null) return;

        clearInterval(timing.interval);
        timing.interval = null;
        this.sigleUpdateTime(key);
    }
    resumeTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval !== null) return;

        timing.prevT = performance.now();
        timing.interval = setTimeout(() => {
            this.updateTime(key);
        }, 20);
    }
    stopTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined) return;

        if (timing.interval) {
            clearInterval(timing.interval);
            this.sigleUpdateTime(key);
        }

        const result = timing.t;
        this.timingTimes.delete(key);
        return result;
    }
}
const instance = TTimeTool.getInstance();
export default instance;
