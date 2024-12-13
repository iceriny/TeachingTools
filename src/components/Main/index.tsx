import React from "react";
import { Layout, Menu, MenuProps, theme } from "antd";
import Tool from "../../Tools/BaseTool";
import { ToolName } from "../../Tools/BaseTool";

import ExecuteDemonstrator from "../ExecuteDemonstrator";
import DiceTool from "../DiceTool";

const { /* Header, */ Content, Footer, Sider } = Layout;

const items = Tool.getAllToolsList().map((tool) => ({
    key: `nav_${tool.name}`,
    icon: React.createElement(tool.getIcon()),
    label: tool.label,
}));

type PageName = `nav_${ToolName}`

function Main() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [currentPage, setCurrentPage] = React.useState<PageName>("nav_ExecuteDemonstrator");
    const GetPage = (key: PageName) => {
        switch (key) {
            case "nav_ExecuteDemonstrator":
                return <ExecuteDemonstrator />;
            case "nav_DiceTool":
                return <DiceTool />;
            default:
                return <div>Not Found</div>;
        }
    };
    const HandleMenuClick: MenuProps["onClick"] = ({ key, /* keyPath, domEvent */ }) => {
        setCurrentPage(key as PageName);
    };
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
                    defaultSelectedKeys={["nav_ExecuteDemonstrator"]}
                    items={items}
                    onClick={HandleMenuClick}
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
                        {GetPage(currentPage)}
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
