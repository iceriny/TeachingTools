// import SyntaxHighlighter from "react-syntax-highlighter";
import { blue } from "@ant-design/colors";
import {
    CloseOutlined,
    DownOutlined,
    QuestionOutlined,
} from "@ant-design/icons";
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
import Paragraphs from "../../Paragraphs";
import type { NotificationInstance } from "antd/es/notification/interface";

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
export interface ExecuteDemonstratorProps {
    notifyApi: NotificationInstance;
}
const ExecuteDemonstrator: React.FC<ExecuteDemonstratorProps> = ({
    notifyApi,
}) => {
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

    const openNotification = () => {
        notifyApi.open({
            key: NOTIFICATION_KEY,
            duration: 10,
            message: (
                <>
                    <Typography.Title level={5}>
                        程序执行演示器说明
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        鼠标悬浮此处保持打开
                    </Typography.Text>
                </>
            ),
            style: { width: "500px" },
            description: (
                <>
                    <Divider />
                    <Paragraphs
                        strings={[
                            "该工具用于模拟程序执行过程, 帮助理解程序逻辑.",
                            "要使用本工具, 首先在源代码输入框输入要演示的程序源代码.",
                            <>
                                然后在
                                <Typography.Text type="success">
                                    步骤
                                </Typography.Text>
                                列表中输入程序的运行顺序
                            </>,
                            "例如 1, 2, 3, 2, 3, 2, 3, 4, 5, 6 ... ",
                            <>
                                指的是, 程序执行 第1行 第2行 第3行, 然后回到
                                第2行, 第3行, 再继续是(数字代表行号): 2 =&gt; 3
                                =&gt; 2 =&gt; 3 =&gt; 4 =&gt; 5 =&gt; 6 ...
                            </>,
                            <>
                                再继续填入
                                <Typography.Text type="success">
                                    参数
                                </Typography.Text>
                                部分, 即程序运行时的变量值.
                            </>,
                            <>
                                参数有:{" "}
                                <Typography.Text type="success">
                                    参数名
                                </Typography.Text>
                                ,{" "}
                                <Typography.Text type="success">
                                    变量类型
                                </Typography.Text>
                                ,{" "}
                                <Typography.Text type="success">
                                    说明
                                </Typography.Text>{" "}
                                以上三个通用属性
                            </>,
                            <>
                                变量何时可见, 以及其值的变化是靠后面的{" "}
                                <Typography.Text type="success">
                                    变量数据
                                </Typography.Text>{" "}
                                决定的
                            </>,
                            <>
                                变量数据有两个属性{" "}
                                <Typography.Text type="success">
                                    值所在步骤
                                </Typography.Text>{" "}
                                和变量具体的{" "}
                                <Typography.Text type="success">
                                    值
                                </Typography.Text>{" "}
                                本身.
                            </>,

                            <>
                                顾名思义, 就是该变量, 在{" "}
                                <Typography.Text type="success">
                                    值所在步骤
                                </Typography.Text>{" "}
                                时{" "}
                                <Typography.Text type="success">
                                    值
                                </Typography.Text>{" "}
                                是多少.
                            </>,
                            <>
                                <Typography.Text type="success">
                                    值所在步骤
                                </Typography.Text>{" "}
                                对应了上面在步骤列表定义步骤时所显示的序号(从0开始).
                            </>,
                            '例如, 变量名写为 a , 变量类型写为 int , 说明写为"这是一个整型变量",',
                            "然后变量属性中, 值所在步骤写为 1, 值写为 10, 这代表, 在步骤1时, 变量a的值为10, 在步骤1之后, a变量值不会发生改变, 直到再次定义其值.",
                            <>
                                如果变量的值被定义为{" "}
                                <Typography.Text type="success">
                                    $end
                                </Typography.Text>{" "}
                                , 则该变量被删除(模拟离开作用于, 或使用delate)
                            </>,
                        ]}
                    />
                </>
            ),
            showProgress: true,
            pauseOnHover: true,
        });
    };
    return (
        <div>
            <Typography.Title level={3}>
                程序执行演示器
                <Button
                    type="link"
                    onClick={openNotification}
                    icon={<QuestionOutlined />}
                />
            </Typography.Title>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                name="code-input"
                onFinish={handleFormSubmit}
            >
                <Flex vertical gap={30} style={{ display: "flex" }}>
                    <Flex gap={15} justify="space-between" align="center">
                        <div
                            style={{
                                color: token.colorText,
                                fontSize: token.fontSize,
                                width: "2rem",
                            }}
                        >
                            代码:
                        </div>
                        <Dropdown.Button
                            size="small"
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
                                        <Flex
                                            key={field.key}
                                            justify="space-between"
                                        >
                                            <Space>
                                                <Form.Item
                                                    noStyle
                                                    name={[
                                                        field.name,
                                                        "varName",
                                                    ]}
                                                >
                                                    <Input placeholder="变量名" />
                                                </Form.Item>
                                                <Form.Item
                                                    noStyle
                                                    name={[
                                                        field.name,
                                                        "valueType",
                                                    ]}
                                                >
                                                    <Input placeholder="变量值类型" />
                                                </Form.Item>
                                                <Form.Item
                                                    noStyle
                                                    name={[field.name, "desc"]}
                                                >
                                                    <Input placeholder="说明" />
                                                </Form.Item>
                                            </Space>
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
                                                                    justify="space-between"
                                                                    style={{
                                                                        minWidth:
                                                                            "40rem",
                                                                    }}
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
                                                                        <InputNumber
                                                                            style={{
                                                                                width: "10rem",
                                                                            }}
                                                                            placeholder="值所在步骤"
                                                                        />
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
                                                            style={{
                                                                width: "25rem",
                                                            }}
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

                                            <CloseOutlined
                                                onClick={() => {
                                                    opt.remove(field.name);
                                                }}
                                            />
                                        </Flex>
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
