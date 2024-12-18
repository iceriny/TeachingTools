import { FC, useEffect, useRef, useState } from "react";
import { Button, Typography, theme, Statistic } from "antd";

import TTimeTool from "../../../Tools/TTimeTool";

const { useToken } = theme;

/**
 * 格式化毫秒
 * @param time 毫秒
 * @returns 格式化后的时间
 */
const format = (time: number) => {
    console.log(time);
    const h = Math.floor(time / 3600000);
    const m = Math.floor((time % 3600000) / 60000);
    const s = Math.floor((time % 60000) / 1000);
    const ms = Math.floor(time % 1000);
    return (
        `${h}`.padStart(2, "0") +
        ":" +
        `${m}`.padStart(2, "0") +
        ":" +
        `${s}`.padStart(2, "0") +
        "." +
        `${ms}`.padStart(3, "0")
    );
};

const Timing: FC = () => {
    const [t, setTime] = useState(0);
    const [start, setStart] = useState(false);
    const interval = useRef<symbol | null>(null);

    const handleStart = () => {
        setStart(true);
        if (interval.current === null) interval.current = Symbol();
        TTimeTool.startTiming((time) => {
            setTime(time);
        }, interval.current);
    };
    const handleStop = () => {
        setStart(false);
        TTimeTool.stopTiming(interval.current!);
    };
    useEffect(() => {
        return () => {
            () => TTimeTool.stopTiming(interval.current!);
        };
    }, []);

    return (
        <>
            {format(t)}
            <Statistic.Countdown></Statistic.Countdown>
            <Button onClick={handleStart} />
            <Button
                onClick={() => {
                    TTimeTool.pauseTiming(interval.current!);
                }}
            />
            <Button
                onClick={() => {
                    TTimeTool.resumeTiming(interval.current!);
                }}
            />
            <Button onClick={handleStop} />
        </>
    );
};

export default Timing;
