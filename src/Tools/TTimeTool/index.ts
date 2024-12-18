import dayjs from "dayjs";
// import * as isLeapYear from "dayjs/plugin/isLeapYear"; // 导入插件
import "dayjs/locale/zh-cn"; // 导入本地化语言

import Tool from "../BaseTool";
import TimeTool from "../../components/Page/TimeTool";

// dayjs.extend(isLeapYear); // 使用插件
dayjs.locale("zh-cn"); // 使用本地化语言

interface Timing {
    t: number;
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

    private updateTime() {
        const now = performance.now();
        this.timingTimes.forEach((timing, key) => {
            timing.t += now - timing.t;
            timing.callback(timing.t);
        });
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
        const timing: Timing = { t: 0, interval: null, callback };
        const interval = setTimeout(() => {
            timing.t++;
            callback(timing.t);
        }, 1);
        timing.interval = interval;
        this.timingTimes.set(key, timing);
        return key;
    }
    pauseTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval === null) return;
        clearInterval(timing.interval);
        timing.interval = null;
    }
    resumeTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval !== null) return;
        timing.interval = setInterval(() => {
            timing.t++;
            timing.callback(timing.t);
        }, 1);
    }
    stopTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined || timing.interval === null) return;
        clearInterval(timing.interval);
        const result = timing.t;
        this.timingTimes.delete(key);
        return result;
    }
}
const instance = TTimeTool.getInstance();
export default instance;
