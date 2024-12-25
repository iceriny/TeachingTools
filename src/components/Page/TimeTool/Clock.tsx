import { FC, useEffect, useState } from "react";
import TTimeTool from "../../../Tools/TTimeTool";
import type { TimeObj } from "../../../Tools/TTimeTool";
import TimeDisplay, { type TimeDisplayProps } from "./TimeDisplay";
import { breakpointComparative, useBreakpoint } from "../../Utilities";
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
    const screens = useBreakpoint();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <TimeDisplay
            {...currentTime}
            {...props}
            vertical={!breakpointComparative(screens, "lg")}
            showUnit={
                breakpointComparative(screens, "lg")
                    ? [true, true, true, true]
                    : [false, false, false, false]
            }
        />
    );
};

export default Clock;
