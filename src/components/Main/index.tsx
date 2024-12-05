import React from "react";
import { Layout, Menu, theme } from "antd";
import ExecuteDemonstrator from "../../Tools/ExecuteDemonstrator";
import Tool from "../../Tools/BaseTool";

import SyntaxHighlighter from "react-syntax-highlighter";

const { Header, Content, Footer, Sider } = Layout;

ExecuteDemonstrator.getInstance(ExecuteDemonstrator);

const items = Tool.getAllToolsList().map((tool, index) => ({
    key: `nav_${index + 1}`,
    icon: React.createElement(tool.getIcon()),
    label: tool.label,
}));
const content = `#include<iostream>
using namespace std;
int main() {
    cout << "hellom world!" << endl;
    return 0;
}`;
function Main() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLineClick = (lineNumber: number) => {
        console.log(lineNumber);
    };
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["nav_1"]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: "24px 16px 0" }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 800,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        content
                        <SyntaxHighlighter
                            language="cpp"
                            showLineNumbers={true}
                            wrapLines={true} // 必须启用以支持逐行包装
                            lineProps={(lineNumber) => ({
                                onClick: () => handleLineClick(lineNumber),
                                style: { cursor: "pointer" }, // 可选：样式设置
                            })}
                        >
                            {content}
                        </SyntaxHighlighter>
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    TeachingTool ©{new Date().getFullYear()} Created by Iceriny
                </Footer>
            </Layout>
        </Layout>
    );
}

export default Main;
