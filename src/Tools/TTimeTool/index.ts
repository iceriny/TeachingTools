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
        console.log(timing.t);
        const now = performance.now();
        timing.t += now - timing.prevT;
        timing.callback?.(timing.t);
        timing.prevT = now;
        return timing;
    }
    private updateTime(key: symbol) {
        const timing = this.sigleUpdateTime(key);
        if (timing === undefined) return;
        timing.interval = setTimeout(() => {
            this.updateTime(key);
        }, 100);
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
        console.log(this.timingTimes.size);
        clearInterval(timing.interval);
        timing.interval = null;
        this.sigleUpdateTime(key);
    }
    resumeTiming(key: symbol) {
        const timing = this.timingTimes.get(key);
        if (timing === undefined) return;
        if (timing.interval) {
            const _callback = timing.callback;
            this.stopTiming(key);
            this.startTiming(_callback, key);
            return;
        }
        timing.prevT = performance.now();
        this.updateTime(key);
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
