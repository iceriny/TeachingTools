import { Button, Flex, List, Typography, theme } from "antd";
import {
    CaretRightOutlined,
    DeleteOutlined,
    FieldTimeOutlined,
    PauseOutlined,
    RedoOutlined,
    UnorderedListOutlined,
    XFilled,
} from "@ant-design/icons";
import { FC, useEffect, useRef, useState } from "react";

import TTimeTool from "../../../Tools/TTimeTool";
import ButtonGroup from "antd/es/button/button-group";
import equal from "fast-deep-equal";

const { useToken } = theme;

interface TimeType {
    h: string;
    m: string;
    s: string;
    ms: string;
    t: number;
}
/**
 * 格式化毫秒
 * @param time 毫秒
 * @returns 格式化后的时间
 */
const format: (time: number) => TimeType = (time) => {
    const ms = Math.floor(time % 1000);
    const t = time;
    time = time / 1000;
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return {
        h: `${h}`.padStart(2, "0"),
        m: `${m}`.padStart(2, "0"),
        s: `${s}`.padStart(2, "0"),
        ms: `${ms}`.padStart(3, "0"),
        t,
    };
};

interface TimeDisplayProps extends TimeType {
    size: number;
    color?: string | string[];
    simplified?: boolean;
}
const TimeDisplay: FC<TimeDisplayProps> = ({
    h,
    m,
    s,
    ms,
    size,
    color,
    simplified,
}) => {
    const isSingleColor = !Array.isArray(color);
    return (
        <Typography.Text>
            {(!simplified || h !== "00") && (
                <>
                    <span
                        style={{
                            fontSize: `${size}rem`,
                            color: isSingleColor ? color : color[0],
                        }}
                    >
                        {h}
                    </span>
                    {": "}
                </>
            )}
            {(!simplified || m !== "00") && (
                <>
                    <span
                        style={{
                            fontSize: `${size}rem`,
                            color: isSingleColor ? color : color[0],
                        }}
                    >
                        {m}
                    </span>
                    {": "}
                </>
            )}
            <span
                style={{
                    fontSize: `${size}rem`,
                    color: isSingleColor ? color : color[2],
                }}
            >
                {s}
            </span>
            {": "}
            <span
                style={{
                    fontSize: `${size}rem`,
                    color: isSingleColor ? color : color[3],
                }}
            >
                {ms}
            </span>
        </Typography.Text>
    );
};
interface DiffProps {
    diff: number;
    size: number;
}
const Diff: FC<DiffProps> = ({ diff, size }) => {
    const diffTime = format(diff);
    const { token } = useToken();
    return (
        <div
            style={{
                transform: `translateY(-${size * 2}rem)`,
            }}
        >
            <span
                style={{
                    fontSize: `${size}rem`,
                    color: token.colorTextDescription,
                }}
            >
                +
            </span>
            <TimeDisplay
                {...diffTime}
                size={size}
                color={token.colorTextDescription}
                simplified
            />
        </div>
    );
};
interface TimingProps {
    size?: number;
}
const Timing: FC<TimingProps> = ({ size = 1 }) => {
    const { token } = useToken();
    const [timePoint, setTimeString] = useState<TimeType>({
        h: "00",
        m: "00",
        s: "00",
        ms: "000",
        t: 0,
    });
    const [points, setPoints] = useState<TimeType[]>([]);
    const interval = useRef<symbol | null>(null);
    const [state, setState] = useState<[boolean, boolean]>([false, false]);

    const handleStart = () => {
        if (interval.current === null) interval.current = Symbol();
        TTimeTool.startTiming((time) => {
            setTimeString(format(time));
        }, interval.current);
        setState([true, false]);
    };
    const handleStop = () => {
        TTimeTool.stopTiming(interval.current!);
        setState([false, false]);
    };
    const handlePause = () => {
        TTimeTool.pauseTiming(interval.current!);
        setState([true, true]);
    };
    const handleResume = () => {
        TTimeTool.resumeTiming(interval.current!);
        setState([true, false]);
    };
    useEffect(() => {
        return () => {
            () => TTimeTool.stopTiming(interval.current!);
        };
    }, []);

    const mainSize = size * 1.5;

    return (
        <div style={{ width: "400px" }}>
            <Flex vertical align="center" gap={10}>
                <Typography.Title level={4}>
                    <FieldTimeOutlined style={{ marginRight: "0.5rem" }} />
                    计时器
                </Typography.Title>
                <TimeDisplay
                    {...timePoint}
                    size={mainSize}
                    color={[
                        token.colorText,
                        token.colorText,
                        token.colorText,
                        token.colorTextDescription,
                    ]}
                />
                <Flex gap={10}>
                    <ButtonGroup>
                        {state[0] ? (
                            <Button
                                danger
                                onClick={handleStop}
                                icon={<XFilled />}
                            >
                                停止
                            </Button>
                        ) : (
                            <Button
                                onClick={handleStart}
                                icon={<CaretRightOutlined />}
                                type="primary"
                            >
                                开始
                            </Button>
                        )}
                        {state[1] ? (
                            <Button
                                onClick={handleResume}
                                disabled={!state[0]}
                                icon={<RedoOutlined />}
                            >
                                继续
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePause}
                                disabled={!state[0]}
                                icon={<PauseOutlined />}
                            >
                                暂停
                            </Button>
                        )}

                        <Button
                            onClick={() => {
                                for (const p of points) {
                                    if (equal(p, timePoint)) return;
                                }
                                setPoints([...points, timePoint]);
                            }}
                            icon={<UnorderedListOutlined />}
                        >
                            记录
                        </Button>
                    </ButtonGroup>
                    <Button
                        onClick={() => setPoints([])}
                        icon={<DeleteOutlined />}
                    />
                </Flex>
                {points.length > 0 && (
                    <List
                        style={{ width: "100%" }}
                        bordered
                        size="small"
                        dataSource={points}
                        renderItem={(item, index) => (
                            <List.Item key={item.h + item.m + item.s}>
                                <TimeDisplay
                                    {...item}
                                    size={size}
                                    color={token.colorTextDescription}
                                />
                                {index !== 0 && (
                                    <Diff
                                        diff={item.t - points[index - 1].t}
                                        size={size}
                                    />
                                )}
                            </List.Item>
                        )}
                    />
                )}
            </Flex>
        </div>
    );
};

export default Timing;
