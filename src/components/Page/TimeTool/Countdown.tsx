import { FC, useRef, useState } from "react";

import { Button, DatePicker, Flex, List, Statistic, theme } from "antd";
import type { DatePickerProps } from "antd";
import { CaretRightFilled, DeleteOutlined } from "@ant-design/icons";
import TTimeTool from "../../../Tools/TTimeTool";

const { Countdown } = Statistic;
type timesType = { value: number; finish: boolean };

const { useToken } = theme;
const TimeCountdown: FC = () => {
    const [times, setTime] = useState<timesType[]>([]); // TTimeTool.time.valueOf()
    const { token } = useToken();
    const dateRef = useRef<DatePickerProps["ref"]>();
    const handleChange: DatePickerProps["onOk"] = (date) => {
        const time = date.valueOf() - TTimeTool.today.valueOf();
        setTime([
            ...times,
            { value: TTimeTool.time.valueOf() + time, finish: false },
        ]);
    };
    return (
        <Flex gap={10} vertical align="center" justify="center">
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
                                const temp = [...times];
                                temp[index].finish = true;
                                setTime(temp);
                            }}
                            format="HH:mm:ss:SSS"
                        />
                    </List.Item>
                )}
            />
            <Flex gap={10}>
                <DatePicker
                    ref={dateRef}
                    color={token.colorPrimary}
                    picker="time"
                    onOk={handleChange}
                />
                <Button
                    style={{ color: token.colorTextDescription }}
                    onClick={() => setTime([])}
                    icon={<CaretRightFilled />}
                />
                <Button
                    style={{ color: token.colorTextDescription }}
                    onClick={() => setTime([])}
                    icon={<DeleteOutlined />}
                />
            </Flex>
        </Flex>
    );
};

export default TimeCountdown;
