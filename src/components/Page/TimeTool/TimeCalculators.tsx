import {
    CalculatorOutlined,
    MinusOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    QuestionOutlined,
} from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Flex,
    InputNumber,
    Popconfirm,
    Select,
    Tooltip,
    Typography,
    message,
} from "antd";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import ButtonGroup from "antd/es/button/button-group";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import type { CalSymbol, CalType, RangeType } from "../../../Tools/TTimeTool";
import TTimeTool, { RangeLabel, isPointTime } from "../../../Tools/TTimeTool";
import TimeDisplay from "./TimeDisplay";

type ItemType = "point" | `range-${RangeType}`;

interface TimeItemProps {
    value: number | Dayjs;
    symbol: CalSymbol;
    rangeType?: RangeType;
    isFirst: boolean;
    onlySubtraction: boolean;
    onChange?: (value: number | CalSymbol | Dayjs, index: number) => void;
    index: number;
}

const TimeItem: FC<TimeItemProps> = ({
    value,
    symbol,
    rangeType,
    isFirst = false,
    onlySubtraction = false,
    onChange,
    index,
}: TimeItemProps) => {
    return (
        <div style={isFirst ? undefined : { transform: "translateX(-3.2rem)" }}>
            {isFirst || (
                <Select
                    style={{ width: "3.2rem" }}
                    variant="borderless"
                    defaultValue={symbol}
                    popupMatchSelectWidth
                    disabled={onlySubtraction}
                    options={[
                        { value: "+", label: "+" },
                        { value: "-", label: "-" },
                    ]}
                    onChange={(value) => {
                        onChange?.(value, index);
                    }}
                />
            )}
            {isPointTime(value) ? (
                <DatePicker
                    onChange={(date) => {
                        onChange?.(date, index);
                    }}
                    showTime
                    defaultValue={value}
                />
            ) : (
                <>
                    <InputNumber
                        style={{ width: "3.2rem" }}
                        defaultValue={value}
                        onChange={(value) => {
                            if (value) {
                                onChange?.(value, index);
                            }
                        }}
                    />
                    <Typography.Text
                        style={{
                            alignContent: "center",
                        }}
                    >
                        {RangeLabel[rangeType!]}
                    </Typography.Text>
                </>
            )}
        </div>
    );
};
const TimeCalculators: FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [items, setItems] = useState<TimeItemProps[]>([]);
    const lastItems = useRef<TimeItemProps[]>(items);
    const addedItemType = useRef<ItemType>("point");
    const [result, setResult] = useState<Duration | Dayjs>(dayjs.duration(0));
    useEffect(() => {
        lastItems.current = items;
        const calResult: Duration | Dayjs = TTimeTool.calculate(
            items.map((item) => {
                return {
                    value: item.value,
                    symbol: item.symbol,
                    rangeType: item.rangeType,
                };
            })
        );
        setResult(calResult);
    }, [items]);
    const isSecondlyPoint = useCallback(
        (curType: CalType, items: TimeItemProps[]) => {
            if (curType === "range") return false;
            if (items.length <= 1) return false;
            return items.some((item, index) => {
                if (index === 0) return false;
                if (isPointTime(item.value)) {
                    return true;
                }
            });
        },
        []
    );
    const handleAddItem = useCallback(() => {
        let [type, rangeType] = addedItemType.current.split("-");
        const isFirst = items.length === 0;

        if (isSecondlyPoint(type as CalType, lastItems.current)) {
            messageApi.error(
                "最多只能添加两个时间点作为计算项, 且两个时间点进行计算时, 只能使用减法."
            );
            return;
        }
        const value = type === "point" ? TTimeTool.time : 1;
        const itemProps: TimeItemProps = {
            value,
            rangeType: rangeType as RangeType,
            isFirst,
            symbol: isPointTime(value) ? "-" : "+",
            onlySubtraction: isPointTime(value),
            index: items.length,
            onChange: handleValueChange,
        };
        setItems([...items, itemProps]);
    }, [items]);

    const handleRemoveItem = useCallback(() => {
        setItems(items.slice(0, -1));
    }, [items]);

    const handleValueChange = useCallback<
        Exclude<TimeItemProps["onChange"], undefined>
    >(
        (value, index) => {
            const newItems = [...lastItems.current];
            if (typeof value === "string") {
                newItems[index].symbol = value;
            } else {
                newItems[index].value = value;
            }
            setItems(newItems);
        },
        [items]
    );
    return (
        <Flex gap={10} vertical align="center" justify="center">
            {contextHolder}
            <Typography.Title level={4}>
                <CalculatorOutlined style={{ marginRight: "0.5rem" }} />
                时间计算器
                <Popconfirm
                    title="Help"
                    icon={<QuestionCircleOutlined />}
                    description={() => (
                        <>
                            <p>这个工具进行时间相关的计算</p>
                            <p>点击 ➖ 或 ➕ 增加一个计算项</p>
                            <p>
                                ➖➕ 按钮中间的下拉菜单控制添加什么类型的计算项.
                            </p>
                            <p>从第二个计算项开始, 计算项前可选 + -</p>
                            <p>
                                时间点只允许第一项添加,
                                且计算项中只允许最多有两个时间点项.
                            </p>
                            <p>时间点与时间点的计算, 只允许减法.</p>
                            <p>时间点与时间段进行计算结果代表某个时间点</p>
                            <p>
                                时间点与时间点进行计算 或 时间段与时间段,
                                结果代表一段时间
                            </p>
                        </>
                    )}
                    showCancel={false}
                >
                    <Button type="link" icon={<QuestionOutlined />} />
                </Popconfirm>
            </Typography.Title>
            <Flex gap={20} vertical align="start">
                {items.map((item, index) => {
                    return <TimeItem {...item} key={index} />;
                })}
                <Tooltip
                    title="删除一个计算项 / 增加一个计算项."
                    mouseEnterDelay={1.5}
                >
                    <div>
                        <ButtonGroup>
                            <Button
                                shape="circle"
                                onClick={handleRemoveItem}
                                icon={<MinusOutlined />}
                            />
                            <Select
                                style={{
                                    width: "6rem",
                                    margin: "0 2px",
                                }}
                                defaultValue="point"
                                popupMatchSelectWidth
                                options={[
                                    {
                                        value: "point",
                                        disabled:
                                            isSecondlyPoint("point", items) ||
                                            !isPointTime(items[0]?.value),
                                        label: "时间点",
                                    },
                                    { value: "range-year", label: "年" },
                                    { value: "range-quarter", label: "季度" },
                                    { value: "range-month", label: "月" },
                                    { value: "range-week", label: "周" },
                                    { value: "range-day", label: "天" },
                                    { value: "range-hour", label: "时" },
                                    { value: "range-minute", label: "分" },
                                    { value: "range-second", label: "秒" },
                                ]}
                                onChange={(e) => {
                                    addedItemType.current = e as ItemType;
                                }}
                            />
                            <Button
                                shape="circle"
                                onClick={handleAddItem}
                                icon={<PlusOutlined />}
                            />
                        </ButtonGroup>
                    </div>
                </Tooltip>
            </Flex>
            <Flex gap={10}>
                <Typography.Text
                    style={{
                        alignContent: "center",
                    }}
                >
                    =
                </Typography.Text>
                <TimeDisplay
                    {...TTimeTool.getTimeObj(result)}
                    size={2}
                    showUnit={[true, true, true]}
                />
            </Flex>
        </Flex>
    );
};

export default TimeCalculators;
