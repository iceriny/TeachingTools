import React from "react";
import { Layout, Menu, theme } from "antd";
import Tool from "../../Tools/BaseTool";

import ExecuteDemonstrator from "../ExecuteDemonstrator";

const { /* Header, */ Content, Footer, Sider } = Layout;

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
                theme="light"
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                style={{ padding: "5px"}}
            >
                {/* <div className="demo-logo-vertical" /> */}
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["nav_1"]}
                    items={items}
                />
            </Sider>
            <Layout>
                {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
                <Content style={{ margin: "24px 16px 0" }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 700,
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
