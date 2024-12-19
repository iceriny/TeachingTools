import { Button, Flex, List, Space, Typography, theme } from "antd";
import { FC, useEffect, useRef, useState } from "react";

import TTimeTool from "../../../Tools/TTimeTool";
import ButtonGroup from "antd/es/button/button-group";

const { useToken } = theme;

interface TimeType {
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
const format: (time: number) => TimeType = (time) => {
    const ms = Math.floor(time % 1000);

    time = time / 1000;
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return {
        h: `${h}`.padStart(2, "0"),
        m: `${m}`.padStart(2, "0"),
        s: `${s}`.padStart(2, "0"),
        ms: `${ms}`.padStart(3, "0"),
    };
};
interface TimingProps {
    size?: number;
}
const Timing: FC<TimingProps> = ({ size = 1 }) => {
    const { token } = useToken();
    const [timeString, setTimeString] = useState<TimeType>({
        h: "00",
        m: "00",
        s: "00",
        ms: "000",
    });
    const [points, setPoints] = useState<TimeType[]>([]);
    const interval = useRef<symbol | null>(null);
    const [disable, setDisable] = useState<
        [boolean, boolean, boolean, boolean]
    >([false, true, true, true]);

    const handleStart = () => {
        if (interval.current === null) interval.current = Symbol();
        TTimeTool.startTiming((time) => {
            setTimeString(format(time));
        }, interval.current);
        setDisable([true, false, false, false]);
    };
    const handleStop = () => {
        TTimeTool.stopTiming(interval.current!);
        setDisable([false, true, true, true]);
    };
    const handlePause = () => {
        TTimeTool.pauseTiming(interval.current!);
        setDisable([false, false, true, false]);
    };
    const handleResume = () => {
        TTimeTool.resumeTiming(interval.current!);
        setDisable([true, false, false, false]);
    };
    useEffect(() => {
        return () => {
            () => TTimeTool.stopTiming(interval.current!);
        };
    }, []);

    const mainSize = size * 1.5;

    return (
        <div style={{ width: "300px" }}>
            <Flex vertical align="center" gap={10}>
                <Typography.Text>
                    <span
                        style={{
                            fontSize: `${mainSize}rem`,
                            color: token.colorTextDescription,
                        }}
                    >
                        {timeString.h}
                    </span>
                    {": "}
                    <span
                        style={{
                            fontSize: `${mainSize}rem`,
                            color: token.colorTextDescription,
                        }}
                    >
                        {timeString.m}
                    </span>
                    {": "}
                    <span
                        style={{
                            fontSize: `${mainSize}rem`,
                            color: token.colorTextDescription,
                        }}
                    >
                        {timeString.s}
                    </span>
                    {": "}
                    <span
                        style={{
                            fontSize: `${mainSize}rem`,
                            color: token.colorTextDescription,
                        }}
                    >
                        {timeString.ms}
                    </span>
                </Typography.Text>
                <ButtonGroup>
                    <Button onClick={handleStart} disabled={disable[0]}>
                        开始
                    </Button>
                    <Button onClick={handleStop} disabled={disable[1]}>
                        停止
                    </Button>
                    <Button onClick={handlePause} disabled={disable[2]}>
                        暂停
                    </Button>
                    <Button onClick={handleResume} disabled={disable[3]}>
                        恢复
                    </Button>
                    <Button
                        onClick={() => {
                            setPoints([...points, timeString]);
                        }}
                    >
                        记录
                    </Button>
                </ButtonGroup>
                {points.length > 0 && (
                    <List
                        style={{ width: "100%" }}
                        bordered
                        size="small"
                        dataSource={points}
                        renderItem={(item) => (
                            <List.Item>
                                <Typography.Text>
                                    <span
                                        style={{
                                            fontSize: `${size}rem`,
                                            color: token.colorTextDescription,
                                        }}
                                    >
                                        {item.h}
                                    </span>
                                    {": "}
                                    <span
                                        style={{
                                            fontSize: `${size}rem`,
                                            color: token.colorTextDescription,
                                        }}
                                    >
                                        {item.m}
                                    </span>
                                    {": "}
                                    <span
                                        style={{
                                            fontSize: `${size}rem`,
                                            color: token.colorTextDescription,
                                        }}
                                    >
                                        {item.s}
                                    </span>
                                    {": "}
                                    <span
                                        style={{
                                            fontSize: `${size}rem`,
                                            color: token.colorTextDescription,
                                        }}
                                    >
                                        {item.ms}
                                    </span>
                                </Typography.Text>
                            </List.Item>
                        )}
                    />
                )}
            </Flex>
        </div>
    );
};

export default Timing;
