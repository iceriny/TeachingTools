import { FC, useEffect, useState } from "react";
import TTimeTool from "../../../Tools/TTimeTool";
import type { TimeObj } from "../../../Tools/TTimeTool";
import TimeDisplay, { type TimeDisplayProps } from "./TimeDisplay";

const getTime: () => TimeObj = () => {
    const time = TTimeTool.time;
    return {
        y: time.year(),
        m: time.month() + 1,
        d: time.date(),
        h: time.hour(),
        i: time.minute(),
        s: time.second(),
    };
};
interface ClockProps {
    size?: TimeDisplayProps["size"];
    show?: TimeDisplayProps["show"];
}
const Clock: FC<ClockProps> = (props: ClockProps) => {
    const [currentTime, setCurrentTime] = useState(getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <TimeDisplay {...currentTime} {...props} />;
};

export default Clock;
