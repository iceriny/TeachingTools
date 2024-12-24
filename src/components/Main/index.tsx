import { useState, createElement, useRef, useEffect } from "react";
// import { BankOutlined } from "@ant-design/icons";
import {
    Button,
    Divider,
    Drawer,
    Flex,
    FloatButton,
    Input,
    Layout,
    Menu,
    theme,
} from "antd";
import type { InputRef, MenuProps } from "antd";
import {
    AppstoreOutlined,
    HomeOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import Tool, { ToolName } from "../../Tools/BaseTool";

// 菜单显示顺序依赖于 Tool.getAllTools()
// 导入顺序即为菜单显示顺序
// import DiceTool from "../Page/DiceTool";
// import ExecuteDemonstrator from "../Page/ExecuteDemonstrator";
// import RandomGenerator from "../Page/RandomGenerator";
// import QRGenerator from "../Page/QRGenerator";
import TDiceTool from "../../Tools/TDiceTool";
import TExecuteDemonstrator from "../../Tools/TExecuteDemonstrator";
import TRandomGenerator from "../../Tools/TRandomGenerator";
import TQRGenerator from "../../Tools/TQRGenerator";
import TTimeTool from "../../Tools/TTimeTool";

// Home中卡片的显示也依赖于上面的导入顺序, 因此需要保证以上顺序
// Home 的导入必须在 Tool 类之后导入
import Home from "../Page/Home";
import YellowPage from "./YellowPage";
import Clock from "../Page/TimeTool/Clock";

const { Content, Footer, Sider } = Layout;

export type PageName = `nav_${ToolName}` | "nav_Home";

const items = Tool.getAllToolsList().map((tool) => ({
    key: `nav_${tool.name}`,
    icon: createElement(tool.getIcon()),
    label: tool.label,
}));

const contentSizeData = {
    padding: 24,
    minHeight: 900,
};
const Main: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [currentPage, setCurrentPage] = useState<PageName>("nav_Home");
    const [isOpenYellowPage, setIsOpenYellowPage] = useState(false);

    const [searchPrepare, setSearchPrepare] = useState(false);
    const [searchKey, setSearchKey] = useState<string[]>([]);
    const searchRef = useRef<InputRef>(null);

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus({ cursor: "all" });
        }
    }, [searchPrepare]);

    const handleCloseYellowPage = () => {};
    const GetPage = (key: PageName) => {
        switch (key) {
            case "nav_ExecuteDemonstrator":
                return <TExecuteDemonstrator.component />;
            case "nav_DiceTool":
                return <TDiceTool.component />;
            case "nav_RandomGenerator":
                return <TRandomGenerator.component />;
            case "nav_QRGenerator":
                return (
                    <TQRGenerator.component
                        contentMinHeight={contentSizeData.minHeight}
                        contentPadding={contentSizeData.padding}
                    />
                );
            case "nav_TimeTool":
                return <TTimeTool.component />;
            default:
                return (
                    <Home
                        contentMinHeight={contentSizeData.minHeight}
                        contentPadding={contentSizeData.padding}
                        cardClickCallback={setCurrentPage}
                    />
                );
        }
    };
    const HandleMenuClick: MenuProps["onClick"] = ({
        key /* keyPath, domEvent */,
    }) => {
        setCurrentPage(key as PageName);
    };
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                theme="light"
                breakpoint="lg"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                style={{ padding: "5px" }}
            >
                {currentPage !== "nav_TimeTool" && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Clock size={1} show={["h", "i", "s"]} />
                        <Divider style={{ margin: "8px 0 8px 0" }} />
                    </div>
                )}
                <Flex gap={10}>
                    <Input
                        ref={searchRef}
                        placeholder="搜索"
                        addonBefore={<SearchOutlined />}
                        style={{
                            width: "100%",
                            display: searchPrepare ? "block" : "none",
                        }}
                        onBlur={(event) => {
                            setSearchKey(event.target.value.split(/\s+/g));
                            setSearchPrepare(false);
                        }}
                        onChange={(event) => {
                            setSearchKey(
                                (event.target as HTMLInputElement).value.split(
                                    /\s+/g
                                )
                            );
                        }}
                        onPressEnter={(event) => {
                            setSearchKey(
                                (event.target as HTMLInputElement).value.split(
                                    /\s+/g
                                )
                            );
                            setSearchPrepare(false);
                        }}
                    />
                    <Button
                        style={{
                            display: searchPrepare ? "none" : undefined,
                            width: currentPage === "nav_Home" ? "100%" : "25%",
                        }}
                        type={currentPage === "nav_Home" ? "text" : undefined}
                        icon={<SearchOutlined />}
                        onClick={() => {
                            setSearchPrepare(true);
                        }}
                    />
                    <Button
                        style={{
                            width: "100%",
                            display:
                                searchPrepare || currentPage === "nav_Home"
                                    ? "none"
                                    : undefined,
                        }}
                        icon={<HomeOutlined />}
                        onClick={() => {
                            setCurrentPage("nav_Home");
                        }}
                    />
                </Flex>
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={[currentPage]}
                    items={items.filter((item) => {
                        return searchKey.every((key) => {
                            return item.label
                                .toLowerCase()
                                .includes(key.toLowerCase());
                        });
                    })}
                    selectedKeys={[currentPage]}
                    onClick={HandleMenuClick}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: "24px 16px 0" }}>
                    <div
                        style={{
                            ...contentSizeData,
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
            <FloatButton
                type="primary"
                icon={<AppstoreOutlined />}
                tooltip={<div>工具黄页</div>}
                onClick={() => setIsOpenYellowPage(true)}
            />
            <Drawer
                open={isOpenYellowPage}
                onClose={() => {
                    setIsOpenYellowPage(false);
                    handleCloseYellowPage();
                }}
                title="工具黄页"
                placement="right"
                width={"30%"}
            >
                <YellowPage />
            </Drawer>
        </Layout>
    );
};

export default Main;
