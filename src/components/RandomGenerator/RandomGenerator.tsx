import { DownOutlined, QuestionOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Divider,
    Dropdown,
    InputNumber,
    notification,
    Space,
    Statistic,
    Typography,
} from "antd";
import CountUp from "react-countup";

import type { MenuProps, StatisticProps } from "antd";
import { useState } from "react";

import { valueType } from "antd/es/statistic/utils";
import TRandomGenerator from "../../Tools/TRandomGenerator";

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
function MyStatistic(props: StatisticProps) {
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
}

function RandomGenerator() {
    const [randomData, setRandomData] = useState<RandomInputData>({
        type: "int",
        min: 0,
        max: 100,
        length: 10,
        precision: 2,
    });
    const [randomResults, setRandomResults] = useState<RandomResult[]>([]);
    const [notifyApi, contextHolder] = notification.useNotification();
    const openNotification = () => {
        notifyApi.open({
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
                    <Typography.Paragraph>
                        生成器是生成随机数的简单工具
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        最常用的方法就是在最小值和最大值之间生成一个随机数.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        默认生成整数, 请在下拉列表中选择需要生成的类型.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        浮点数就是带小数的数字, 选择浮点数时会有额外的
                        <Typography.Text type="success">精度</Typography.Text>
                        设置框
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        数组生成模式, 会有一个额外的
                        <Typography.Text type="success">数量</Typography.Text>
                        设置框, 表示要生成随机数的数量, 即可以{" "}
                        <Typography.Text type="success">
                            批量生成
                        </Typography.Text>
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        按组生成模式下, 程序会先将你设置的范围,
                        按你所设置的数量平均分组, 然后每组随机抽取一个值.
                    </Typography.Paragraph>
                    <Typography>
                        按组生成的模式, 它的结果更加均匀,
                        不会出现普通模式中比较极端的情况, 例如1~10中抽取3个,
                        结果是 1, 2, 4 集中在前部.
                    </Typography>
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
            {contextHolder}
            <Typography.Title level={5}>通用随机生成器</Typography.Title>
            <Space size={40}>
                <InputNumber
                    changeOnWheel
                    addonBefore="最小值: "
                    defaultValue={randomData.min}
                    onChange={(event) =>
                        setRandomData({
                            ...randomData,
                            min: event || 0,
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
                            max: event || 100,
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
                                length: event || 10,
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
                        defaultValue={randomData.precision || 2}
                        onChange={(event) =>
                            setRandomData({
                                ...randomData,
                                precision: event || 2,
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
                <Button
                    type="link"
                    onClick={openNotification}
                    icon={<QuestionOutlined />}
                />
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
            </Space>
        </Space>
    );
}

export default RandomGenerator;
