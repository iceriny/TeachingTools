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
    Typography,
} from "antd";
import type { InputRef, MenuProps } from "antd";
import {
    AppstoreOutlined,
    HomeOutlined,
    SearchOutlined,
    MoonOutlined,
    BgColorsOutlined,
    InfoOutlined,
    QuestionOutlined,
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
import type { NotificationInstance } from "antd/es/notification/interface";
import Paragraphs from "../Paragraphs";
import { ArgsProps } from "antd/es/notification";

const { Content, Footer, Sider } = Layout;

export type PageName = `nav_${ToolName}` | "nav_Home";

const items = Tool.getAllToolsList().map((tool) => ({
    key: `nav_${tool.name}`,
    icon: createElement(tool.getIcon()),
    label: tool.label,
}));

const aboutText = `TeachingTool ©${new Date().getFullYear()} Created by Iceriny`;

const contentSizeData = {
    padding: 24,
    minHeight: 900,
};
interface MainProps {
    notifyApi: NotificationInstance;
    themeChange: () => void;
    colorChange: (color: string, type: "primaryColor" | "bgColor") => void;
}
const YellowPageIcon = <AppstoreOutlined />;
const HelpText = [
    "本工具是一个多功能工具箱, 包含多种可用的使用工具, 可以在主页中简单预览工具的介绍.",
    "菜单栏的搜索按钮可以搜索工具内容,不过目前工具并不多, 所以可能并不需要.",
    "在右下角, 有一个悬浮按钮, 直接点击它,打开一个黄页面板, 里面有一些我整理的实用的网站.",
    "你可能注意到了, 鼠标悬浮在刚刚说的悬浮按钮, 会弹出三个额外的按钮.",
    "分别是 `关于` `自定义主题色` 和 `暗色模式` .",
    "主题色的定制只用设置亮色模式下的颜色即可, 暗色模式的背景色根据算法自动生成.",
];
if (window.isFirst) {
    HelpText.push("那么, 祝您生活愉快!");
}
const HelpContent: ArgsProps = {
    key: NOTIFICATION_KEY,
    message: (
        <>
            <Typography.Title level={5}>欢迎使用</Typography.Title>
            {window.isFirst && (
                <>
                    <Typography.Paragraph type="secondary">
                        似乎您第一次使用本工具, 可以查看下面的简单介绍.
                    </Typography.Paragraph>
                    <Typography.Paragraph type="secondary">
                        可以在右下角悬浮按钮中的帮助按钮再次打开此面板
                    </Typography.Paragraph>
                </>
            )}
            <Typography.Paragraph type="secondary">
                鼠标悬浮此处保持打开
            </Typography.Paragraph>
        </>
    ),
    description: (
        <>
            <Divider />
            <Paragraphs strings={HelpText} />
        </>
    ),
    showProgress: true,
    pauseOnHover: true,
};
const Main: React.FC<MainProps> = ({ notifyApi, themeChange, colorChange }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
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

    if (window.isFirst) {
        useEffect(() => {
            notifyApi.open(HelpContent);
        }, []);
    }

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
                return <TRandomGenerator.component notifyApi={notifyApi} />;
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
    const handleOpenAbout = () => {
        notifyApi.open({
            key: NOTIFICATION_KEY,
            message: "关于",
            description: (
                <Flex gap={10} vertical align="center">
                    Version: {__APP_VERSION__}
                    <div>{aboutText}</div>
                    <Typography.Link href={__REPOSITORY__}>
                        {" "}
                        REPOSITORY{" "}
                    </Typography.Link>
                </Flex>
            ),
            showProgress: true,
            pauseOnHover: true,
        });
    };
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                theme="light"
                breakpoint="lg"
                // onBreakpoint={(broken) => {
                //     console.log(broken);
                // }}
                // onCollapse={(collapsed, type) => {
                //     console.log(collapsed, type);
                // }}
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
                <Footer style={{ textAlign: "center" }}>{aboutText}</Footer>
            </Layout>
            <FloatButton.Group
                trigger="hover"
                type="primary"
                icon={YellowPageIcon}
                closeIcon={YellowPageIcon}
                tooltip="工具黄页"
                onClick={() => setIsOpenYellowPage(true)}
            >
                <FloatButton
                    icon={<InfoOutlined />}
                    tooltip="关于"
                    onClick={() => {
                        handleOpenAbout();
                    }}
                />
                <FloatButton
                    icon={<QuestionOutlined />}
                    tooltip="帮助"
                    onClick={() => {
                        notifyApi.open(HelpContent);
                    }}
                />
                <Popconfirm
                    placement="right"
                    title="定制主题色"
                    icon={<BgColorsOutlined />}
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
                                            colors: [
                                                DEFAULT_PRIMARY_COLOR,
                                                "#1677ff",
                                                "#e49a33",
                                            ],
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
                        type="default"
                        icon={<BgColorsOutlined />}
                        tooltip="定制颜色"
                    />
                </Popconfirm>
                <FloatButton
                    type={isDark ? "primary" : "default"}
                    icon={<MoonOutlined />}
                    tooltip="暗黑模式"
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
