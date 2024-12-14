import { DownOutlined } from "@ant-design/icons";
import { Card, Divider, Dropdown, InputNumber, Space, Typography } from "antd";

import type { MenuProps } from "antd";
import { useState } from "react";
import TRandomGenerator from "../../Tools/TRandomGenerator";

type randomType = "int" | "float" | "intArray" | "floatArray";
interface RandomResult {
    type: randomType;
    value: number | number[] | string | string[];
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
                value: TRandomGenerator.getRandomFloat(
                    min,
                    max,
                    precision || 2
                ),
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
                    precision || 2,
                    length || 10
                ),
            };
    }
};
function RandomGenerator() {
    const [randomData, setRandomData] = useState<RandomInputData>({
        type: "int",
        min: 0,
        max: 100,
    });
    const [randomResults, setRandomResults] = useState<RandomResult[]>([]);
    const handleTypeChange: MenuProps["onClick"] = (e) => {
        setRandomData({ ...randomData, type: e.key as randomType });
    };
    const handleGenerate = () => {
        setRandomResults([...randomResults, getRandomResult(randomData)]);
    };
    return (
        <Space
            style={{
                display: "flex",
                width: "100%",
                height: "100%",
            }}
        >
            <Space direction="vertical">
                <div>
                    <Typography.Title level={5}>
                        通用随机生成器
                    </Typography.Title>
                    <Divider />
                </div>
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
                        randomData.type === "intArray") && (
                        <InputNumber
                            changeOnWheel
                            addonBefore="数组长度: "
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
                        randomData.type === "floatArray") && (
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
                        <Typography.Text style={{ width: "6rem" }}>
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
                                    {result.value.map((v) => (
                                        <Typography.Text>{v}</Typography.Text>
                                    ))}
                                </Space>
                            </Card>
                        ) : (
                            <Card key={`${index}_${result.value}`}>
                                <Space>
                                    <Typography.Text>
                                        {result.value}
                                    </Typography.Text>
                                </Space>
                            </Card>
                        )
                    )}
                </Space>
            </Space>
        </Space>
    );
}

export default RandomGenerator;
