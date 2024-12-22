import { useEffect, useState, lazy, Suspense } from "react";
// 动态加载组件
// import Main from "./components/Main";
const Main = lazy(() => import("./components/Main"));

import { compareVersions } from "compare-versions";
import { Space, Spin, List, ConfigProvider } from "antd";
import locale from "antd/locale/zh_CN";

const Modal = lazy(() =>
    import("antd").then((module) => ({
        default: module.Modal, // 指定要加载的命名导出
    }))
);
import VersionJson from "./assets/version.json";

const VERSION_DATA: VersionData = VersionJson as VersionData;
const OLD_VERSION = localStorage.getItem("version");

const getVersionDesc = () => {
    const result: { version: VersionNumber; desc: string[] }[] = [];
    if (!OLD_VERSION) {
        for (let key in VERSION_DATA) {
            const data = VERSION_DATA[key as VersionNumber];
            if (key != "last")
                result.push({ version: key as VersionNumber, desc: data.desc });
        }
        return result;
    }

    for (const key in VERSION_DATA) {
        if (key === "last") continue;
        const updateMask = compareVersions(key, OLD_VERSION);
        if (updateMask === 1) {
            // 更新日志显示:
            const data = VERSION_DATA[key as VersionNumber];
            result.push({ version: key as VersionNumber, desc: data.desc });
        }
    }
    return result;
};
function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        }
        localStorage.setItem("version", __APP_VERSION__);
    }, []);
    const handleOk = () => {
        setIsModalOpen(false);
    };
    return (
        <>
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
                <ConfigProvider locale={locale}>
                    <Main />
                </ConfigProvider>
                ;
            </Suspense>
            <Suspense>
                {" "}
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
                                header={`v${item.version}`}
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
        </>
    );
}

export default App;
