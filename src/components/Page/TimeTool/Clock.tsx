import React, { useEffect, useState } from "react";
import TTimeTool from "../../../Tools/TTimeTool";
import { Typography, theme } from "antd";

const { useToken } = theme;

interface TimeObj {
    y: number;
    m: number;
    d: number;
    h: number;
    i: number;
    s: number;
}
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
const Clock: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(getTime());
    const { token } = useToken();
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                fontSize: "2rem",
                textAlign: "center",
            }}
        >
            <Typography.Title level={2} style={{ width: "100%" }}>
                {currentTime.y}
                <span
                    style={{
                        fontSize: "1rem",
                        color: token.colorTextDescription,
                    }}
                >
                    年
                </span>{" "}
                {currentTime.m}
                <span
                    style={{
                        fontSize: "1rem",
                        color: token.colorTextDescription,
                    }}
                >
                    月
                </span>{" "}
                {currentTime.d}
                <span
                    style={{
                        fontSize: "1rem",
                        color: token.colorTextDescription,
                    }}
                >
                    日
                </span>{" "}
                {`${currentTime.h}`.padStart(2, "0")}:
                {`${currentTime.i}`.padStart(2, "0")}:
                {`${currentTime.s}`.padStart(2, "0")}
            </Typography.Title>
        </div>
    );
};

export default Clock;
