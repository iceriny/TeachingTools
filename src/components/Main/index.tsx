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
    Popconfirm,
    ColorPicker,
    theme,
} from "antd";
import type { InputRef, MenuProps } from "antd";
import {
    AppstoreOutlined,
    HomeOutlined,
    SearchOutlined,
    MoonOutlined,
    BgColorsOutlined,
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
import { DEFAULT_BG_COLOR, DEFAULT_PRIMARY_COLOR } from "../Utilities";

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
interface MainProps {
    themeChange: () => void;
    colorChange: (color: string, type: "primaryColor" | "bgColor") => void;
}
const YellowPageIcon = <AppstoreOutlined />;
const Main: React.FC<MainProps> = ({ themeChange, colorChange }) => {
    const {
        token: { colorBgContainer, borderRadiusLG, marginLG },
    } = theme.useToken();

    const [currentPage, setCurrentPage] = useState<PageName>("nav_Home");
    const [isOpenYellowPage, setIsOpenYellowPage] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const [searchPrepare, setSearchPrepare] = useState(false);
    const [searchKey, setSearchKey] = useState<string[]>([]);
    const searchRef = useRef<InputRef>(null);
    const color = [
        localStorage.getItem("primaryColor") ?? DEFAULT_PRIMARY_COLOR,
        localStorage.getItem("bgColor") ?? DEFAULT_BG_COLOR,
    ];

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
            <FloatButton.Group
                trigger="hover"
                type="primary"
                icon={YellowPageIcon}
                closeIcon={YellowPageIcon}
                tooltip={<div>工具黄页</div>}
                onClick={() => setIsOpenYellowPage(true)}
            >
                <Popconfirm
                    placement="right"
                    title="定制主题色"
                    description={
                        <Flex gap={10} vertical style={{ margin: "20px" }}>
                            <Flex gap={50} align="end">
                                主题色:
                                <ColorPicker
                                    disabledAlpha
                                    defaultValue={color[0]}
                                    presets={[
                                        {
                                            label: "默认",
                                            colors: [DEFAULT_PRIMARY_COLOR],
                                        },
                                    ]}
                                    onChange={(e) => {
                                        const color = e.toHexString();
                                        colorChange(color, "primaryColor");
                                        localStorage.setItem(
                                            "primaryColor",
                                            color
                                        );
                                    }}
                                />
                            </Flex>
                            <Flex gap={50} align="end">
                                背景色:
                                <ColorPicker
                                    disabledAlpha
                                    defaultValue={color[1]}
                                    presets={[
                                        {
                                            label: "默认",
                                            colors: [DEFAULT_BG_COLOR],
                                        },
                                    ]}
                                    onChange={(e) => {
                                        const color = e.toHexString();
                                        colorChange(color, "bgColor");
                                        localStorage.setItem("bgColor", color);
                                    }}
                                />
                            </Flex>
                        </Flex>
                    }
                    showCancel={false}
                >
                    <FloatButton
                        style={{ insetInlineEnd: marginLG * 3 }}
                        type="default"
                        icon={<BgColorsOutlined />}
                        tooltip={<div>定制颜色</div>}
                    />
                </Popconfirm>
                <FloatButton
                    style={{ insetInlineEnd: marginLG * 3 }}
                    type={isDark ? "primary" : "default"}
                    icon={<MoonOutlined />}
                    tooltip={<div>暗黑模式</div>}
                    onClick={() => {
                        themeChange();
                        setIsDark(!isDark);
                    }}
                />
            </FloatButton.Group>
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
