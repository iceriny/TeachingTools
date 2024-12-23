import { FC, useEffect, useState } from "react";
import TTimeTool from "../../../Tools/TTimeTool";
import TimeDisplay, { type TimeDisplayProps } from "./TimeDisplay";

interface TimeObj extends TimeDisplayProps {}
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
const Clock: FC = () => {
    const [currentTime, setCurrentTime] = useState(getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <TimeDisplay {...currentTime} size={5} />;
};

export default Clock;
