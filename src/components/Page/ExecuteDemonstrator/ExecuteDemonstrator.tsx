// import SyntaxHighlighter from "react-syntax-highlighter";
import { blue } from "@ant-design/colors";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import type { FormProps, MenuProps } from "antd";
import {
    Button,
    Card,
    Divider,
    Dropdown,
    Flex,
    Form,
    Input,
    InputNumber,
    Skeleton,
    Space,
    Splitter,
    theme,
    Typography,
} from "antd";
import React, {
    Suspense,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState,
} from "react";
// 动态加载组件
const SyntaxHighlighter = React.lazy(() => import("react-syntax-highlighter"));

import TExecuteDemonstrator from "../../../Tools/TExecuteDemonstrator";
import type { CodeBlocksParams } from "../../../Tools/TExecuteDemonstrator";
import NumberListInput from "../../NumberListInput";
import { breakpointComparative, useBreakpoint } from "../../Utilities";

const { useToken } = theme;

interface CodeBlockParamType {
    varName: string;
    valueType: string;
    desc: string;
    varList: { list: { var: string; varStepNumber: number }[] };
}
type CodeBlockParamsType = CodeBlockParamType[];
interface Props {
    text?: string | number;
}
const Desc: React.FC<Props> = (props: Props) => {
    return (
        <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Typography.Title
                type="secondary"
                level={5}
                style={{ whiteSpace: "nowrap" }}
            >
                {props.text}
            </Typography.Title>
        </Flex>
    );
};

const langTypeLabel = {
    cpp: "c++",
    java: "java",
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    go: "go",
    rust: "rust",
    c: "c",
    csharp: "c#",
    php: "php",
    ruby: "ruby",
    swift: "swift",
    kotlin: "kotlin",
    scala: "scala",
    groovy: "groovy",
    perl: "perl",
    lua: "lua",
};

const langTypeItems: MenuProps["items"] = Object.keys(langTypeLabel).map(
    (key) => ({
        key,
        label: langTypeLabel[key as keyof typeof langTypeLabel],
    })
);

interface ExportData {
    code: string;
    langType: keyof typeof langTypeLabel;
    codeBlockParams: CodeBlocksParams[];
    steps: number[];
}

const ExecuteDemonstrator: React.FC = () => {
    // TODO: 标记行所在步骤的序号
    const [form] = Form.useForm();

    const demonstrator = TExecuteDemonstrator;

    const { token } = useToken();
    const [code, setCode] = useState<string>(demonstrator._code);
    const [codeSteps, setCodeSteps] = useState<number[]>([]);
    const [stepsDate, setStepsDate] = useState<{
        currentLine: number;
        cyrrentStepNumber: number;
    }>({ currentLine: 0, cyrrentStepNumber: 0 });
    const [langType, setLangType] = useState<keyof typeof langTypeLabel>("cpp");
    const screens = useBreakpoint();

    const handleCodeChange: (event: SyntheticEvent) => void = (event) => {
        if (!event) return;
        const target = event.target as HTMLInputElement;
        demonstrator.code = target.value;
        setCode(target.value);
    };
    const handleNextLine: () => void = () => {
        const [nextLineNumber, nextStep] = demonstrator.nextStep();
        setStepsDate({
            currentLine: nextLineNumber,
            cyrrentStepNumber: nextStep,
        });
    };
    const handlePrevLine: () => void = () => {
        const [prevLineNumber, prevStep] = demonstrator.prevStep();
        setStepsDate({
            currentLine: prevLineNumber,
            cyrrentStepNumber: prevStep,
        });
    };
    const handleFormSubmit: FormProps["onFinish"] = (value) => {
        const codeBlockParams: CodeBlockParamsType = value[
            "code-input"
        ].params?.filter((item: { varName: string }) => item.varName);

        demonstrator.params = codeBlockParams?.map((item) => {
            const varList = item.varList.list.reduce((acc, cur) => {
                acc[cur.varStepNumber] = cur.var;
                return acc;
            }, {} as Record<number, string>);

            const varListTemp: Record<number, string> = {};

            for (const item of Object.entries(varList)) {
                const step = parseInt(item[0]);
                const thisValue = item[1];
                for (let i = 0; i < demonstrator.steps.length; i++) {
                    if (i >= step) {
                        if (thisValue.toLowerCase() === "$end") {
                            delete varListTemp[i];
                            continue;
                        }

                        varListTemp[i] = thisValue;
                    }
                }
            }
            return {
                paramName: item.varName,
                value: varListTemp,
                type: item.valueType,
                description: item.desc,
            };
        });
    };

    const handleExportData: () => void = () => {
        const data: ExportData = {
            code,
            langType,
            codeBlockParams: demonstrator.params,
            steps: demonstrator.steps,
        };
        navigator.clipboard.writeText(JSON.stringify(data));
    };
    const handleImportData = useCallback(() => {
        navigator.clipboard.readText().then((text) => {
            const data: ExportData = JSON.parse(text);

            demonstrator.code = data.code;
            setCode(data.code);
            form.setFieldValue(["code-input", "code"], data.code);

            demonstrator.params = data.codeBlockParams;
            form.setFieldValue(
                ["code-input", "params"],
                data.codeBlockParams.map((item) => {
                    let preVar: string | null = null;
                    const varList = Object.entries(item.value).map((item) => {
                        const varListItem = {
                            var: item[1],
                            varStepNumber: parseInt(item[0]),
                        };
                        if (preVar === varListItem.var) {
                            return;
                        } else {
                            preVar = varListItem.var;
                        }
                        return varListItem;
                    });

                    return {
                        varName: item.paramName,
                        valueType: item.type,
                        desc: item.description,
                        varList: {
                            list: varList.filter((item) => item !== undefined),
                        },
                    };
                })
            );

            demonstrator.steps = data.steps;
            setCodeSteps(data.steps);

            setLangType(data.langType);
        });
    }, []);

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                handleNextLine();
            } else if (e.key === "ArrowLeft") {
                handlePrevLine();
            }
        });

        return () => {
            window.removeEventListener("keydown", (e) => {
                if (e.key === "ArrowRight") {
                    handleNextLine();
                } else if (e.key === "ArrowLeft") {
                    handlePrevLine();
                }
            });
        };
    }, []);
    return (
        <div>
            <Form
                form={form}
                layout="vertical"
                name="code-input"
                onFinish={handleFormSubmit}
            >
                <Flex vertical gap={30} style={{ display: "flex" }}>
                    <Flex gap={15}>
                        <div
                            style={{
                                color: token.colorText,
                                fontSize: token.fontSize,
                            }}
                        >
                            代码:
                        </div>
                        <Dropdown.Button
                            icon={React.createElement(DownOutlined)}
                            menu={{
                                items: langTypeItems,
                                onClick: (e) => {
                                    setLangType(
                                        e.key as keyof typeof langTypeLabel
                                    );
                                },
                            }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Flex>{langTypeLabel[langType]}</Flex>
                            </a>
                        </Dropdown.Button>
                    </Flex>
                    <Form.Item
                        name={["code-input", "code"]}
                        rules={[
                            {
                                required: true,
                                message: "代码部分必须有内容.",
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Input Code ...  / ..."
                            autoSize={{ minRows: 6, maxRows: 15 }}
                            onChange={handleCodeChange}
                        />
                    </Form.Item>
                    <Divider style={{ margin: "0" }} />
                    <Flex vertical gap={15}>
                        <div
                            style={{
                                color: token.colorText,
                                fontSize: token.fontSize,
                            }}
                        >
                            步骤:
                        </div>
                        <NumberListInput
                            value={codeSteps}
                            onChange={(e) => {
                                demonstrator.steps = e;
                                setCodeSteps(e);
                            }}
                            onClear={() => {
                                demonstrator.steps = [];
                                setCodeSteps([]);
                            }}
                        />
                    </Flex>
                </Flex>
                <Divider />
                <Flex vertical gap={15}>
                    <div
                        style={{
                            color: token.colorText,
                            fontSize: token.fontSize,
                        }}
                    >
                        参数:
                    </div>
                    <Form.List name={["code-input", "params"]}>
                        {(fields, opt) => (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: 16,
                                }}
                            >
                                {fields.map((field) => (
                                    <Card key={`${field.key}_item`}>
                                        <Space key={field.key}>
                                            <Form.Item
                                                noStyle
                                                name={[field.name, "varName"]}
                                            >
                                                <Input placeholder="变量名" />
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                name={[field.name, "valueType"]}
                                            >
                                                <Input placeholder="变量值类型" />
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                name={[field.name, "desc"]}
                                            >
                                                <Input placeholder="说明" />
                                            </Form.Item>
                                            <Flex key={`${field.key}_var`}>
                                                <Divider type="vertical" />
                                                <Form.List
                                                    name={[
                                                        field.name,
                                                        "varList",
                                                        "list",
                                                    ]}
                                                >
                                                    {(varField, varOtp) => (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                                rowGap: 16,
                                                            }}
                                                        >
                                                            {varField.map(
                                                                (varField) => (
                                                                    <Flex
                                                                        gap={15}
                                                                        key={
                                                                            varField.key
                                                                        }
                                                                    >
                                                                        <Form.Item
                                                                            noStyle
                                                                            name={[
                                                                                varField.name,
                                                                                "varStepNumber",
                                                                            ]}
                                                                        >
                                                                            <InputNumber placeholder="值所在步骤" />
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            noStyle
                                                                            name={[
                                                                                varField.name,
                                                                                "var",
                                                                            ]}
                                                                        >
                                                                            <Input placeholder="值" />
                                                                        </Form.Item>
                                                                        <CloseOutlined
                                                                            onClick={() => {
                                                                                varOtp.remove(
                                                                                    varField.name
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Flex>
                                                                )
                                                            )}
                                                            <Button
                                                                type="dashed"
                                                                onClick={() =>
                                                                    varOtp.add()
                                                                }
                                                                block
                                                            >
                                                                + 添加变量数据
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Form.List>
                                            </Flex>

                                            <CloseOutlined
                                                onClick={() => {
                                                    opt.remove(field.name);
                                                }}
                                            />
                                        </Space>
                                    </Card>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => opt.add()}
                                    block
                                >
                                    + 添加变量
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </Flex>
                <Divider />
                <Flex gap={15}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    <Button type="primary" onClick={handleImportData}>
                        导入数据
                    </Button>
                    <Button type="primary" onClick={handleExportData}>
                        保存数据
                    </Button>
                </Flex>
                <Divider />
            </Form>

            <Flex vertical gap="middle">
                <Splitter
                    layout={
                        breakpointComparative(screens, "md")
                            ? "horizontal"
                            : "vertical"
                    }
                    style={{
                        minHeight: "150px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Splitter.Panel defaultSize="60%" min="20%" max="70%">
                        <div style={{ marginLeft: 15, marginRight: 15 }}>
                            {code == "" || code == undefined ? (
                                <Desc text="Code Display" />
                            ) : (
                                <Suspense fallback={<Skeleton />}>
                                    <SyntaxHighlighter
                                        language={langType}
                                        showLineNumbers={true}
                                        wrapLines={true} // 必须启用以支持逐行包装
                                        lineProps={(lineNumber: number) => ({
                                            // onClick: () => handleLineClick(lineNumber),
                                            style: {
                                                backgroundColor:
                                                    lineNumber ==
                                                    stepsDate.currentLine
                                                        ? blue[2]
                                                        : "transparent",
                                                padding: "3px 10px 3px 3px",
                                                margin:
                                                    lineNumber ==
                                                    stepsDate.currentLine
                                                        ? "50px 0 100px 0"
                                                        : 0,
                                                borderRadius: "5px",
                                            },
                                        })}
                                    >
                                        {code}
                                    </SyntaxHighlighter>
                                </Suspense>
                            )}
                        </div>
                    </Splitter.Panel>
                    <Splitter.Panel>
                        {demonstrator.params
                            ?.filter(
                                (param) =>
                                    stepsDate.cyrrentStepNumber in param.value
                            )
                            .map((param, index) => (
                                <Card
                                    key={`param_${index}`}
                                    title={param.paramName}
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    {param.value[stepsDate.cyrrentStepNumber]}
                                </Card>
                            ))}
                    </Splitter.Panel>
                </Splitter>
                <Flex gap={15}>
                    <Button onClick={handlePrevLine}>上一步</Button>
                    <Button onClick={handleNextLine}>下一步</Button>
                </Flex>
            </Flex>
        </div>
    );
};

export default ExecuteDemonstrator;
