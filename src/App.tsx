import { useEffect, useState, lazy, Suspense } from "react";
// 动态加载组件
// import Main from "./components/Main";
const Main = lazy(() => import("./components/Main"));

import { compareVersions } from "compare-versions";
import { Space, Spin, List, ConfigProvider, theme, notification } from "antd";
import type { SeedToken } from "antd/es/theme/internal";
import locale from "antd/locale/zh_CN";

const Modal = lazy(() =>
    import("antd/es/modal").then((module) => ({
        default: module.default,
    }))
);
import VersionJson from "./assets/version.json";
import {
    DEFAULT_BG_COLOR,
    DEFAULT_PRIMARY_COLOR,
    getDarkBgColor,
} from "./components/Utilities";

const VERSION_DATA: VersionMap = VersionJson as VersionMap;
const OLD_VERSION = localStorage.getItem("version");

const { darkAlgorithm } = theme;
function myDarkAlgorithm(token: SeedToken) {
    token.colorBgBase = getDarkBgColor(token.colorBgBase);
    const map = darkAlgorithm(token);
    return map;
}
const getVersionDesc = () => {
    const result: { version: VersionNumber; desc: string[] }[] = [];
    if (!OLD_VERSION) {
        for (let key in VERSION_DATA) {
            const data = VERSION_DATA[key as VersionNumber];
            result.push({ version: key as VersionNumber, desc: data.desc });
        }
        return result;
    }

    for (const key in VERSION_DATA) {
        const updateMask = compareVersions(key, OLD_VERSION);
        if (updateMask === 1) {
            // 更新日志显示:
            const data = VERSION_DATA[key as VersionNumber];
            result.push({ version: key as VersionNumber, desc: data.desc });
        }
    }
    return result;
};

// 获取本地存储的色值
let localStorageColor = [
    localStorage.getItem("primaryColor") ?? DEFAULT_PRIMARY_COLOR,
    localStorage.getItem("bgColor") ?? DEFAULT_BG_COLOR,
];

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [color, setColor] = useState<[string, string]>([
        localStorageColor[0],
        localStorageColor[1],
    ]);

    useEffect(() => {
        // 获取用户的旧版本号
        if (OLD_VERSION) {
            if (compareVersions(__APP_VERSION__, OLD_VERSION) === 1) {
                // 更新日志显示:
                setIsModalOpen(true);
            }
        } else {
            // 第一次使用
            console.log("First use");
            window.isFirst = true;
        }
        localStorage.setItem("version", __APP_VERSION__);
    }, []);
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleThemeChange = () => {
        setIsDark(!isDark);
    };
    const handleChangePrimaryColor = (
        colorString: string,
        type: "primaryColor" | "bgColor"
    ) => {
        if (type === "primaryColor") setColor([colorString, color[1]]);
        else setColor([color[0], colorString]);
    };
    const myTheme = {
        algorithm: isDark ? myDarkAlgorithm : undefined,
        token: {
            borderRadius: 8,
            wireframe: false,
            colorPrimary: color[0],
            colorInfo: color[0],
            colorSuccess: "#1ac48e",
            colorBgBase: color[1],
        },
        components: isDark
            ? undefined
            : {
                  Tooltip: {
                      colorBgSpotlight: color[0],
                  },
              },
    };

    const [notifyApi, contextHolder] = notification.useNotification();
    return (
        <ConfigProvider locale={locale} theme={myTheme}>
            {contextHolder}
            <Suspense
                fallback={
                    <div
                        style={{
                            height: "100vh",
                            width: "100vw",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spin size="large" />
                    </div>
                }
            >
                <Main
                    notifyApi={notifyApi}
                    themeChange={handleThemeChange}
                    colorChange={handleChangePrimaryColor}
                />
            </Suspense>
            <Suspense>
                <Modal
                    title={`版本更新`}
                    open={isModalOpen}
                    onOk={handleOk}
                    destroyOnClose
                    footer={(_, { OkBtn }) => (
                        <>
                            <OkBtn />
                        </>
                    )}
                >
                    <Space
                        direction="vertical"
                        size={10}
                        style={{ width: "100%" }}
                    >
                        {getVersionDesc().map((item, index) => (
                            <List
                                key={index}
                                header={
                                    <span
                                        style={{ fontWeight: 500 }}
                                    >{`v${item.version}`}</span>
                                }
                                bordered
                                size="small"
                                dataSource={item.desc}
                                // dataSource={VERSION_DATA[VERSION_DATA.last].desc}
                                renderItem={(item) => (
                                    <List.Item>· {item}</List.Item>
                                )}
                            />
                        ))}
                    </Space>
                </Modal>
            </Suspense>
        </ConfigProvider>
    );
}

export default App;
