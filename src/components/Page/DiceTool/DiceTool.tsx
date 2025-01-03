import React, { useEffect, useState } from "react";

import {
    Card,
    Dropdown,
    Flex,
    Space,
    Popconfirm,
    message,
    Button,
    Typography,
} from "antd";
import { QuestionOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

import Dice from "./Dice/Dice";

import TDiceTool from "../../../Tools/TDiceTool";

interface DiceSum {
    dices: Array<number>;
    sum: number;
}
type ActionName = "Clear" | "SumClear";

const DiceTool: React.FC = () => {
    const tool = TDiceTool;
    const [dices, setDices] = useState<Array<number>>([]);
    const [dicesStage, setDicesStage] = useState<Array<boolean>>([]);
    const [sums, setSums] = useState<DiceSum[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const HandleRollClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setDices([...dices, Math.floor(Math.random() * 20) + 1]);
        setDicesStage([...dicesStage, false]);
    };
    const _HandleClearClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setDices([]);
        setDicesStage([]);
    };
    const HandleDiceClick = (index: number) => {
        const newDicesStage = [...dicesStage];
        newDicesStage[index] = !newDicesStage[index];
        setDicesStage(newDicesStage);
    };
    const HandleCancelSelect = (_: React.MouseEvent) => {
        setDicesStage(dicesStage.map(() => false));
    };
    const HandleSumClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (dices.length === 0) {
            messageApi.warning("请先投掷骰子");
            return;
        }
        const SelectDiceCount = dicesStage.filter((dice) => dice).length;
        if (SelectDiceCount < 2) {
            if (SelectDiceCount === 0) messageApi.warning("请先选择骰子");
            else messageApi.warning("请至少选择两个骰子");
            return;
        }
        let sum = 0;
        const selectDice: number[] = [];
        for (let i = 0; i < dices.length; i++) {
            if (dicesStage[i]) {
                sum += dices[i];
                selectDice.push(dices[i]);
            }
        }
        setSums([...sums, { dices: selectDice, sum: sum }]);
    };
    const _HandleSumClear = (event: React.MouseEvent) => {
        event.stopPropagation();
        setSums([]);
    };

    useEffect(() => {
        const helpButton = document.getElementById("help");
        helpButton?.classList.add("emphasize");
        setTimeout(() => {
            helpButton?.classList.remove("emphasize");
        }, 1300);
    }, []);

    const HandleMainButtonClick: Exclude<MenuProps["onClick"], undefined> = (
        event: Parameters<Exclude<MenuProps["onClick"], undefined>>[0]
    ) => {
        if (!event) return;
        switch (event.key as ActionName) {
            case "Clear":
                _HandleClearClick(event.domEvent as React.MouseEvent);
                break;
            case "SumClear":
                _HandleSumClear(event.domEvent as React.MouseEvent);
                break;
            default:
                break;
        }
    };
    return (
        <Flex
            vertical
            gap={10}
            onDoubleClick={HandleCancelSelect}
            align="center"
            justify="center"
        >
            <Typography.Title level={3}>
                {tool.label}{" "}
                <Popconfirm
                    title="Help"
                    icon={<QuestionCircleOutlined />}
                    description={() => (
                        <>
                            <p>点击骰子可以选中, 双击空白位置可以取消选中.</p>
                            <p>
                                鼠标悬浮左侧按钮的图标部分, 点击 Sum
                                可以计算选中骰子的和.
                            </p>
                            <p>
                                鼠标悬浮左侧按钮的图标部分, 点击 Clear Sum
                                按钮可以清空所有计算结果.
                            </p>
                            <p>
                                鼠标悬浮左侧按钮的图标部分, 点击 Clear
                                按钮可以清空所有骰子.
                            </p>
                            <p>点击 Roll 按钮可以投掷一个骰子.</p>
                        </>
                    )}
                    showCancel={false}
                >
                    <Button type="link" icon={<QuestionOutlined />} />
                </Popconfirm>
            </Typography.Title>
            {contextHolder}
            <Flex
                style={{ width: "100%", marginRight: "20px" }}
                vertical
                gap="10px"
                justify="center"
                align="center"
            >
                <Flex
                    style={{
                        width: "60%",
                        minHeight: 200,
                    }}
                    wrap
                    align="center"
                    justify="center"
                >
                    {dices.length != 0
                        ? dices.map((dice, index) => {
                              return (
                                  <Dice
                                      size={100}
                                      key={index}
                                      index={index}
                                      active={dicesStage[index]}
                                      n={dice}
                                      onClick={HandleDiceClick}
                                  />
                              );
                          })
                        : "请点击 Roll 按钮, 投掷一个骰子."}
                </Flex>
                <Space wrap>
                    <Dropdown.Button
                        size="large"
                        style={{ width: 100 }}
                        onClick={HandleRollClick}
                        menu={{
                            items: [
                                { key: "Clear", label: "Clear", danger: true },
                            ],
                            onClick:
                                HandleMainButtonClick as MenuProps["onClick"],
                        }}
                        type="primary"
                        icon={React.createElement(tool.getIcon())}
                    >
                        Roll
                    </Dropdown.Button>
                    <Dropdown.Button
                        size="large"
                        style={{ width: 100 }}
                        onClick={HandleSumClick}
                        menu={{
                            items: [
                                {
                                    key: "SumClear",
                                    label: "Clear",
                                    danger: true,
                                },
                            ],
                            onClick:
                                HandleMainButtonClick as MenuProps["onClick"],
                        }}
                        type="default"
                        icon={React.createElement(tool.getIcon())}
                    >
                        Sum
                    </Dropdown.Button>
                </Space>
            </Flex>
            <Flex gap="10px" wrap>
                {sums.map((sum, index) => {
                    return (
                        <Card
                            style={{ maxHeight: "200px" }}
                            key={index}
                            title={`骰子: ${sum.dices.join("+")}`}
                        >
                            <div>{sum.sum}</div>
                        </Card>
                    );
                })}
            </Flex>
        </Flex>
    );
};

export default DiceTool;
