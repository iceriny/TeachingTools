import { FC, useRef, useState } from "react";

import {
    CaretRightFilled,
    DeleteOutlined,
    HourglassOutlined,
} from "@ant-design/icons";
import type { DatePickerProps } from "antd";
import {
    Button,
    DatePicker,
    Flex,
    List,
    Statistic,
    theme,
    Typography,
} from "antd";
import TTimeTool from "../../../Tools/TTimeTool";

const { Countdown } = Statistic;
type timesType = { value: number; finish: boolean };

const { useToken } = theme;
const TimeCountdown: FC = () => {
    const [times, setTime] = useState<timesType[]>([]); // TTimeTool.time.valueOf()
    const { token } = useToken();
    const pickTimeRef = useRef<number>(-1);
    const handleChange: DatePickerProps["onOk"] = (date) => {
        if (date === null) {
            pickTimeRef.current = -1;
            return;
        }
        const time = date.valueOf() - TTimeTool.today.valueOf();
        pickTimeRef.current = time;
        // setTime([
        //     ...times,
        //     { value: time, finish: false },
        // ]);
    };
    return (
        <Flex gap={10} vertical align="center" justify="center">
            <Typography.Title level={4}>
                <HourglassOutlined style={{ marginRight: "0.5rem" }} />
                倒计时
            </Typography.Title>
            {times.length > 0 && (
                <List
                    size="small"
                    dataSource={times}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <Countdown
                                valueStyle={{
                                    color: item.finish
                                        ? token.colorError
                                        : token.colorSuccess,
                                }}
                                key={index}
                                value={item.value}
                                onFinish={() => {
                                    setTime((t) => {
                                        const updatedTimes = [...t];
                                        updatedTimes[index].finish = true;
                                        return updatedTimes;
                                    });
                                }}
                                format="HH:mm:ss:SSS"
                            />
                        </List.Item>
                    )}
                />
            )}
            <Flex gap={10}>
                <DatePicker
                    color={token.colorPrimary}
                    picker="time"
                    onChange={handleChange}
                    needConfirm={false}
                />
                <Button
                    style={{ color: token.colorTextDescription }}
                    onClick={() => {
                        if (pickTimeRef.current === -1) return;
                        const newTimes = [
                            ...times,
                            {
                                value:
                                    pickTimeRef.current +
                                    TTimeTool.time.valueOf(),
                                finish: false,
                            },
                        ];
                        setTime(newTimes);
                    }}
                    icon={<CaretRightFilled />}
                />
                <Button
                    style={{ color: token.colorTextDescription }}
                    onClick={() => {
                        setTime([]);
                        // setPickTime(-1);
                    }}
                    disabled={times.length === 0}
                    icon={<DeleteOutlined />}
                />
            </Flex>
        </Flex>
    );
};

export default TimeCountdown;
