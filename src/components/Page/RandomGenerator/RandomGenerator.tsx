import {
    DeleteOutlined,
    DownOutlined,
    QuestionOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Divider,
    Dropdown,
    InputNumber,
    Space,
    Statistic,
    Typography,
} from "antd";
import CountUp from "react-countup";

import type { MenuProps, StatisticProps } from "antd";
import { useState } from "react";

import { valueType } from "antd/es/statistic/utils";
import TRandomGenerator from "../../../Tools/TRandomGenerator";
import { NotificationInstance } from "antd/es/notification/interface";
import Paragraphs from "../../Paragraphs";

type randomType =
    | "int"
    | "float"
    | "intArray"
    | "floatArray"
    | "intGroupRandom"
    | "floatGroupRandom";
interface RandomResult {
    type: randomType;
    value: number | number[] | string | string[];
    precision?: number;
}

interface RandomInputData {
    type: randomType;
    min: number;
    max: number;
    length?: number;
    precision?: number;
}
interface RandomTypeMenuItem {
    key: randomType;
    label: string;
    type: "item";
}

const RandomTypeMenuItems: RandomTypeMenuItem[] = [
    { key: "int", label: "整数", type: "item" },
    { key: "float", label: "浮点数", type: "item" },
    { key: "intArray", label: "整数数组", type: "item" },
    { key: "floatArray", label: "浮点数数组", type: "item" },
    { key: "intGroupRandom", label: "按组随机抽取(整数)", type: "item" },
    { key: "floatGroupRandom", label: "按组随机抽取(浮点数)", type: "item" },
];

const getRandomTypeLabel = (type: randomType) => {
    return RandomTypeMenuItems.find((item) => item?.key === type)?.label;
};

const getRandomResult: (data: RandomInputData) => RandomResult = ({
    type,
    min,
    max,
    length,
    precision,
}: RandomInputData) => {
    switch (type) {
        case "int":
            return {
                type: "int",
                value: TRandomGenerator.getRandomInt(min, max),
            };
        case "float":
            return {
                type: "float",
                value: TRandomGenerator.getRandomFloat(min, max),
                precision,
            };
        case "intArray":
            return {
                type: "intArray",
                value: TRandomGenerator.getRandomIntArray(
                    min,
                    max,
                    length || 10
                ),
            };
        case "floatArray":
            return {
                type: "floatArray",
                value: TRandomGenerator.getRandomFloatArray(
                    min,
                    max,
                    length || 10
                ),
                precision,
            };
        case "intGroupRandom":
            return {
                type: "intGroupRandom",
                value: TRandomGenerator.getIntRandomFromGroup(
                    min,
                    max,
                    length || 10
                ),
            };
        case "floatGroupRandom":
            return {
                type: "floatGroupRandom",
                value: TRandomGenerator.getFloatRandomFromGroup(
                    min,
                    max,
                    length || 10
                ),
                precision,
            };
    }
};

const RandomNumberFormatter: (
    value: valueType,
    decimals: number | undefined
) => JSX.Element = (value, decimals) => {
    return <CountUp end={value as number} separator="," decimals={decimals} />;
};
const MyStatistic: React.FC<StatisticProps> = (props: StatisticProps) => {
    const formatter: StatisticProps["formatter"] = (value) => {
        return RandomNumberFormatter(value, props.precision);
    };
    return (
        <Statistic
            {...props}
            value={props.value}
            formatter={props.formatter || formatter}
        />
    );
};
export interface RandomGeneratorProps {
    notifyApi: NotificationInstance;
}
const RandomGenerator: React.FC<RandomGeneratorProps> = ({ notifyApi }) => {
    const [randomData, setRandomData] = useState<RandomInputData>({
        type: "int",
        min: 0,
        max: 100,
        length: 10,
        precision: 2,
    });
    const [randomResults, setRandomResults] = useState<RandomResult[]>([]);
    const openNotification = () => {
        notifyApi.open({
            key: NOTIFICATION_KEY,
            message: (
                <>
                    <Typography.Title level={5}>
                        随机生成器使用方法
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        鼠标悬浮此处保持打开
                    </Typography.Text>
                </>
            ),
            description: (
                <>
                    <Divider />
                    <Paragraphs
                        strings={[
                            "生成器是生成随机数的简单工具",
                            "最常用的方法就是在最小值和最大值之间生成一个随机数.",
                            "默认生成整数, 请在下拉列表中选择需要生成的类型.",
                            <>
                                浮点数就是带小数的数字, 选择浮点数时会有额外的
                                <Typography.Text type="success">
                                    精度
                                </Typography.Text>
                                设置框
                            </>,
                            <>
                                数组生成模式, 会有一个额外的
                                <Typography.Text type="success">
                                    数量
                                </Typography.Text>
                                设置框, 表示要生成随机数的数量, 即可以{" "}
                                <Typography.Text type="success">
                                    批量生成
                                </Typography.Text>
                            </>,
                            "按组生成模式下, 程序会先将你设置的范围,按你所设置的数量平均分组, 然后每组随机抽取一个值.",
                            "按组生成的模式, 它的结果更加均匀,不会出现普通模式中比较极端的情况, 例如1~10中抽取3个,结果是 1, 2, 4 集中在前部.",
                        ]}
                    />
                </>
            ),
            showProgress: true,
            pauseOnHover: true,
        });
    };
    const handleTypeChange: MenuProps["onClick"] = (e) => {
        setRandomData({ ...randomData, type: e.key as randomType });
    };
    const handleGenerate = () => {
        setRandomResults([...randomResults, getRandomResult(randomData)]);
    };
    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <Typography.Title level={3}>
                通用随机生成器
                <Button
                    type="link"
                    onClick={openNotification}
                    icon={<QuestionOutlined />}
                />
            </Typography.Title>
            <Space size={40} wrap>
                <InputNumber
                    changeOnWheel
                    addonBefore="最小值: "
                    defaultValue={randomData.min}
                    onChange={(event) =>
                        setRandomData({
                            ...randomData,
                            min: event === null ? 100 : event,
                        })
                    }
                />
                <InputNumber
                    changeOnWheel
                    addonBefore="最大值: "
                    defaultValue={randomData.max}
                    onChange={(event) =>
                        setRandomData({
                            ...randomData,
                            max: event === null ? 100 : event,
                        })
                    }
                />
                {(randomData.type === "floatArray" ||
                    randomData.type === "intArray" ||
                    randomData.type === "floatGroupRandom" ||
                    randomData.type === "intGroupRandom") && (
                    <InputNumber
                        changeOnWheel
                        addonBefore="数量: "
                        defaultValue={randomData.length || 10}
                        onChange={(event) =>
                            setRandomData({
                                ...randomData,
                                length: event === null ? 10 : event,
                            })
                        }
                    />
                )}
                {(randomData.type === "float" ||
                    randomData.type === "floatArray" ||
                    randomData.type === "floatGroupRandom") && (
                    <InputNumber
                        changeOnWheel
                        addonBefore="精度: "
                        defaultValue={
                            randomData.precision === undefined
                                ? 2
                                : randomData.precision
                        }
                        onChange={(event) =>
                            setRandomData({
                                ...randomData,
                                precision: event === null ? 2 : event,
                            })
                        }
                    />
                )}
                <Dropdown.Button
                    menu={{
                        items: RandomTypeMenuItems,
                        onClick: handleTypeChange,
                    }}
                    icon={<DownOutlined />}
                >
                    <Typography.Text style={{ width: "9rem" }}>
                        {getRandomTypeLabel(randomData.type)}
                    </Typography.Text>
                </Dropdown.Button>
                <Dropdown.Button
                    onClick={handleGenerate}
                    menu={{
                        items: [{ key: "Clear", label: "Clear" }],
                        onClick: () => {
                            setRandomResults([]);
                        },
                    }}
                >
                    生成
                </Dropdown.Button>
            </Space>
            <Divider />
            <Space wrap>
                {randomResults.map((result, index) =>
                    Array.isArray(result.value) ? (
                        <Card key={`${index}_${result.value[0] || "item"}`}>
                            <Space>
                                {result.value.map((v, index) => (
                                    <MyStatistic
                                        key={`result_${index}`}
                                        value={v}
                                        precision={result.precision}
                                    />
                                ))}
                            </Space>
                        </Card>
                    ) : (
                        <Card key={`${index}_${result.value}`}>
                            <Space>
                                <Typography.Text>
                                    {
                                        <MyStatistic
                                            value={result.value}
                                            precision={result.precision}
                                        />
                                    }
                                </Typography.Text>
                            </Space>
                        </Card>
                    )
                )}
                {randomResults.length > 0 && (
                    <Button
                        style={{ marginLeft: "2rem" }}
                        onClick={() => {
                            setRandomResults([]);
                        }}
                        danger
                        icon={<DeleteOutlined />}
                    />
                )}
            </Space>
        </Space>
    );
};

export default RandomGenerator;
