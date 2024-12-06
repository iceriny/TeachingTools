import React from "react";
import { Layout, Menu, theme } from "antd";
import TExecuteDemonstrator from "../../Tools/TExecuteDemonstrator";
import Tool from "../../Tools/BaseTool";

import ExecuteDemonstrator from "../ExecuteDemonstrator";

const { Header, Content, Footer, Sider } = Layout;

TExecuteDemonstrator.getInstance(TExecuteDemonstrator);

const items = Tool.getAllToolsList().map((tool, index) => ({
    key: `nav_${index + 1}`,
    icon: React.createElement(tool.getIcon()),
    label: tool.label,
}));

function Main() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
                        <ExecuteDemonstrator />

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
