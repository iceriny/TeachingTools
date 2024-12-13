// import SyntaxHighlighter from "react-syntax-highlighter";
import {
    Form,
    Input,
    Space,
    Button,
    theme,
    Card,
    InputNumber,
    Splitter,
    Flex,
    Typography,
    Divider,
} from "antd";
import { blue } from "@ant-design/colors";
import { CloseOutlined } from "@ant-design/icons";
import { SyntheticEvent, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import TExecuteDemonstrator from "../../Tools/TExecuteDemonstrator";
type CodeType = {
    code: string;
};

const { useToken } = theme;
function Desc(props: { text?: string | number }) {
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
}

function ExecuteDemonstrator() {
    // const [form] = Form.useForm();

    const { token } = useToken();
    const [code, setCode] = useState<string>("");
    const [currentLine, setCurrentLine] = useState<number>(0);
    const demonstrator = TExecuteDemonstrator;

    const handleCodeChange: (event: SyntheticEvent) => void = (event) => {
        if (!event) return;
        const target = event.target as HTMLInputElement;
        setCode(target.value);
    };
    const handleNextLine: (envet: SyntheticEvent) => void = (event) => {
        // TODO: 处理点击按钮进入下一行的代码.
        console.log(event);
    }
    return (
        <div>
            <Form layout="vertical" name="code-input">
                <Form.Item<CodeType>
                    label="代码:"
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
                <div
                    style={{
                        color: token.colorText,
                        fontSize: token.fontSize,
                    }}
                >
                    参数:
                </div>
                <Form.Item>
                    <Form.List name="item">
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
                                            <Space key={`${field.key}_var`}>
                                                <Divider type="vertical" />
                                                <Form.Item
                                                    noStyle
                                                    name={[
                                                        field.name,
                                                        "varList",
                                                    ]}
                                                >
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
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                    rowGap: 16,
                                                                }}
                                                            >
                                                                {varField.map(
                                                                    (
                                                                        varField
                                                                    ) => (
                                                                        <Space
                                                                            key={
                                                                                varField.key
                                                                            }
                                                                        >
                                                                            <Form.Item
                                                                                noStyle
                                                                                name={[
                                                                                    varField.name,
                                                                                    "varLineNumber",
                                                                                ]}
                                                                            >
                                                                                <InputNumber placeholder="行数" />
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
                                                                        </Space>
                                                                    )
                                                                )}
                                                                <Button
                                                                    type="dashed"
                                                                    onClick={() =>
                                                                        varOtp.add()
                                                                    }
                                                                    block
                                                                >
                                                                    +
                                                                    添加变量数据
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Form.List>
                                                </Form.Item>
                                            </Space>

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
                </Form.Item>
                <Form.Item>
                    <Button type="primary">提交</Button>
                </Form.Item>
            </Form>

            <Splitter
                style={{
                    minHeight: "150px",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Splitter.Panel defaultSize="40%" min="20%" max="70%">
                    {code == "" || code == undefined ? (
                        <Desc text="Code Display" />
                    ) : (
                        <SyntaxHighlighter
                            language="cpp"
                            showLineNumbers={true}
                            wrapLines={true} // 必须启用以支持逐行包装
                            lineProps={(lineNumber) => ({
                                // onClick: () => handleLineClick(lineNumber),
                                style: {
                                    backgroundColor:
                                        lineNumber == 1
                                            ? blue[2]
                                            : "transparent",
                                    padding: "3px 10px 3px 3px",
                                    margin:
                                        lineNumber == 1 ? "50px 0 100px 0" : 0,
                                    borderRadius: "5px",
                                },
                            })}
                        >
                            {code}
                        </SyntaxHighlighter>
                    )}
                </Splitter.Panel>
                <Splitter.Panel></Splitter.Panel>
            </Splitter>
        </div>
    );
}

export default ExecuteDemonstrator;
