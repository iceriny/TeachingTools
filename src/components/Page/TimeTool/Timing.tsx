import { FC, useEffect, useRef, useState } from "react";
import { Button, Typography, theme, Statistic } from "antd";

import TTimeTool from "../../../Tools/TTimeTool";

const { useToken } = theme;

interface time {
    h: string;
    m: string;
    s: string;
    ms: string;
}
/**
 * 格式化毫秒
 * @param time 毫秒
 * @returns 格式化后的时间
 */
const format: (time: number) => time = (time) => {
    const h = Math.floor(time / 3600000);
    const m = Math.floor((time % 3600000) / 60000);
    const s = Math.floor((time % 60000) / 1000);
    const ms = Math.floor(time % 1000);
    return {
        h: `${h}`.padStart(2, "0"),
        m: `${m}`.padStart(2, "0"),
        s: `${s}`.padStart(2, "0"),
        ms: `${ms}`.padStart(3, "0"),
    };
};
interface TimingProps {
    size: number;
}
const Timing: FC<TimingProps> = ({ size }) => {
    const [t, setTime] = useState(0);
    const interval = useRef<symbol | null>(null);
    const { token } = useToken();

    const handleStart = () => {
        if (interval.current === null) interval.current = Symbol();
        TTimeTool.startTiming((time) => {
            setTime(time);
        }, interval.current);
    };
    const handleStop = () => {
        TTimeTool.stopTiming(interval.current!);
    };
    const handlePause = () => {
        TTimeTool.pauseTiming(interval.current!);
    };
    const handleResume = () => {
        TTimeTool.resumeTiming(interval.current!);
    };
    useEffect(() => {
        return () => {
            () => TTimeTool.stopTiming(interval.current!);
        };
    }, []);

    return ((t: number) => {
        const { h, m, s, ms } = format(t);
        return (
            <Typography.Title level={5}>
                <span
                    style={{
                        fontSize: `${size}rem`,
                        color: token.colorTextDescription,
                    }}
                >
                    {h}
                </span>
                {": "}
                <span
                    style={{
                        fontSize: `${size}rem`,
                        color: token.colorTextDescription,
                    }}
                >
                    {m}
                </span>
                {": "}
                <span
                    style={{
                        fontSize: `${size}rem`,
                        color: token.colorTextDescription,
                    }}
                >
                    {s}
                </span>
                {": "}
                <span
                    style={{
                        fontSize: `${size}rem`,
                        color: token.colorTextDescription,
                    }}
                >
                    {ms}
                </span>
            </Typography.Title>
        );
    })(t);
};

export default Timing;
