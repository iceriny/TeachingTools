import React, { useEffect, useState } from "react";

import TQRGenerator from "../../../Tools/TQRGenerator";

import type { RadioChangeEvent, SliderSingleProps } from "antd";
import {
    Button,
    ColorPicker,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    QRCode,
    Radio,
    Slider,
    Space,
    Tooltip,
    Typography,
} from "antd";
import { QuestionCircleOutlined, QuestionOutlined } from "@ant-design/icons";
import InputFile from "../../InputFile";
import QRParse from "./QRParse";
import {
    breakpointComparative,
    getValueFromBreakpoint,
    useBreakpoint,
} from "../../Utilities";

function doDownload(url: string, fileName: string) {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
const downloadCanvasQRCode = () => {
    const canvas = document
        .getElementById("qr-code-display")
        ?.querySelector<HTMLCanvasElement>("canvas");
    if (canvas) {
        const url = canvas.toDataURL();
        doDownload(url, "QRCode.png");
    }
};

const downloadSvgQRCode = () => {
    const svg = document
        .getElementById("qr-code-display")
        ?.querySelector<SVGElement>("svg");
    const svgData = new XMLSerializer().serializeToString(svg!);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    doDownload(url, "QRCode.svg");
};
const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
    value
) => {
    if (value === 0)
        return (
            <>
                <p>恢复能力：可以恢复 7% 的数据。</p>
                <p>
                    适用场景：适合二维码图像清晰且无损坏的环境，能最大化存储信息量。
                </p>
                <p>优点：占用空间少，数据容量最大。</p>
            </>
        );
    else if (value === 33)
        return (
            <>
                <p>恢复能力：可以恢复 15% 的数据。</p>
                <p>适用场景：适合常规场景，可能存在轻微污损或遮挡。</p>
                <p>优点：平衡了容量和容错能力。</p>
            </>
        );
    else if (value === 66)
        return (
            <>
                <p>恢复能力：可以恢复 25% 的数据。</p>
                <p>
                    适用场景：二维码可能受到一定程度的污损或遮挡，例如被轻微涂抹、划痕覆盖。
                </p>
                <p>优点：增强容错能力，适用于更复杂的使用环境。</p>
            </>
        );
    else
        return (
            <>
                <p>恢复能力：可以恢复 30% 的数据。</p>
                <p>
                    适用场景：适合恶劣环境下的二维码，例如二维码可能被大量遮挡或损坏。
                </p>
                <p>优点：容错能力最强，但数据容量最小。</p>
            </>
        );
};
export interface QRGeneratorProps {
    contentMinHeight: number;
    contentPadding: number;
}
type QRIcon = { src: string; name: string };
interface QRInfo {
    content?: string;
    type: "svg" | "canvas";
    color?: string;
    size: number;
    icon?: QRIcon;
    iconSize?: number;
    level: "L" | "M" | "Q" | "H";
}
const QRGenerator: React.FC<QRGeneratorProps> = ({
    contentMinHeight,
    contentPadding,
}) => {
    const Tool = TQRGenerator;
    const [messageApi, contextHolder] = message.useMessage();
    const otherQrContentRef = React.useRef<string>();
    const [qrInfo, setQRInfo] = useState<QRInfo>({
        type: "svg",
        level: "M",
        size: window.innerWidth / 5,
    });
    const [isParseQROpen, setIsParseQROpen] = useState(false);
    const screens = useBreakpoint();

    useEffect(() => {
        const handleResize = () => {
            setQRInfo({ ...qrInfo, size: window.innerWidth / 5 }); // 更新状态
        };

        window.addEventListener("resize", handleResize); // 添加监听器

        return () => {
            window.removeEventListener("resize", handleResize); // 清理监听器
        };
    }, []); // 空依赖数组，确保只运行一次
    const onTypeChange = ({ target: { value } }: RadioChangeEvent) => {
        setQRInfo({ ...qrInfo, type: value });
    };
    const onClickDownload = () => {
        if (qrInfo.type === "svg") {
            downloadSvgQRCode();
        } else {
            downloadCanvasQRCode();
        }
    };

    const handleUploadIcon = (fileName: string, result: string) => {
        setQRInfo({
            ...qrInfo,
            icon: {
                src: result,
                name: fileName || "未选择",
            },
        }); // 将图片的Base64 URL存储到状态
    };
    return (
        <div
            style={{
                height: contentMinHeight - 2 * contentPadding,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {contextHolder}
            <Space direction="vertical" size={30} align="center">
                <Typography.Title level={3}>
                    {Tool.label}{" "}
                    <Popconfirm
                        title="Help"
                        icon={<QuestionCircleOutlined />}
                        description={() => (
                            <>
                                <p>二维码生成器用于文本或链接生成二维码.</p>
                                <p>
                                    底部的 解析二维码
                                    按钮用于将第三方二维码或本工具生成的二维码解析为文本.
                                </p>
                                <p>
                                    矢量 / 点阵
                                    两个按钮用于切换二维码的生成模式.
                                </p>
                                <p>
                                    矢量模式使用 SVG, 可以无限放大的格式,
                                    点阵模式则是 PNG 格式, 不能无限放大但更通用.
                                </p>
                                <p>
                                    矢量 / 点阵 按钮后的色块,
                                    可以自定义二维码的颜色.
                                </p>
                                <p>下载按钮则将生成的二维码下载.</p>
                                <p>
                                    容错率代表二维码的纠错能力,
                                    越高则越能在损坏或覆污的环境下被识别.
                                </p>
                                <p>可以拖动手柄查看具体容错率介绍</p>
                                <p>自定义图标可以将图标插入到二维码的中间.</p>

                                <p>
                                    二维码中的内容则是需要写入到二维码当中的内容.
                                </p>
                                <p>
                                    二维码中的内容可以是文本, 也可以是链接, 链接
                                    则需要以 http:// 或 https:// 开头.
                                </p>
                                <p>
                                    程序仅在本地进行处理, 所有数据,
                                    包括自定义图标都不会上传到服务器.
                                </p>
                            </>
                        )}
                        showCancel={false}
                    >
                        <Button type="link" icon={<QuestionOutlined />} />
                    </Popconfirm>
                </Typography.Title>
                <div id="qr-code-display">
                    <QRCode
                        size={qrInfo.size}
                        value={qrInfo.content || "请输入内容"}
                        type={qrInfo.type}
                        color={qrInfo.color}
                        iconSize={qrInfo.iconSize}
                        icon={qrInfo.icon?.src}
                        errorLevel={qrInfo.level}
                    />
                </div>
                <Space>
                    <Radio.Group
                        options={[
                            { label: "矢量", value: "svg" },
                            { label: "点阵", value: "canvas" },
                        ]}
                        optionType="button"
                        onChange={onTypeChange}
                        value={qrInfo.type}
                    />
                    <ColorPicker
                        defaultValue="#1677ff"
                        onChange={(e) => {
                            setQRInfo({ ...qrInfo, color: e?.toHexString() });
                        }}
                    />
                    <Button onClick={onClickDownload}>下载</Button>
                </Space>
                <Space direction="vertical" align="center">
                    <Typography.Text>容错率</Typography.Text>
                    <Slider
                        style={{
                            width: getValueFromBreakpoint(
                                {
                                    xxl: "700px",
                                    xl: "600px",
                                    lg: "500px",
                                    md: "400px",
                                    sm: "300px",
                                    xs: "200px",
                                },
                                screens
                            ),
                        }}
                        marks={{ 0: "低", 33: "中", 66: "较高", 100: "高" }}
                        step={null}
                        tooltip={{ formatter }}
                        defaultValue={33}
                        onChange={(e) => {
                            const level =
                                e === 0
                                    ? "L"
                                    : e === 33
                                    ? "M"
                                    : e === 66
                                    ? "Q"
                                    : "H";
                            setQRInfo({ ...qrInfo, level });
                        }}
                    />
                </Space>
                <Space>
                    <InputFile
                        title={qrInfo.icon?.name || "自定义图标"}
                        onChange={handleUploadIcon}
                    />
                    {qrInfo.icon?.name && (
                        <InputNumber
                            style={{ width: "140px" }}
                            addonBefore="图标大小"
                            defaultValue={32}
                            onChange={(e) => {
                                setQRInfo({ ...qrInfo, iconSize: e || 32 });
                            }}
                        />
                    )}
                </Space>
                <Space
                    direction={
                        breakpointComparative(screens, "lg")
                            ? undefined
                            : "vertical"
                    }
                    align="center"
                    size={"large"}
                >
                    <Input
                        placeholder="请输入内容"
                        allowClear
                        size="large"
                        addonBefore="二维码中的内容: "
                        type="text"
                        onChange={(e) => {
                            setQRInfo({ ...qrInfo, content: e.target.value });
                        }}
                    />
                    <Tooltip title="点击后显示一个新的窗口, 用于解析第三方二维码的内容, 将解析出的文本显示.">
                        <Button
                            size="large"
                            onClick={() => setIsParseQROpen(true)}
                        >
                            解析二维码
                        </Button>
                    </Tooltip>
                    <Modal
                        title="解析二维码"
                        width={800}
                        open={isParseQROpen}
                        okText="复制"
                        onOk={() => {
                            if (otherQrContentRef.current) {
                                navigator.clipboard
                                    .writeText(otherQrContentRef.current)
                                    .then(() =>
                                        messageApi.info("已复制到剪切板")
                                    )
                                    .catch((err) => messageApi.error(err));
                            }
                        }}
                        cancelText="关闭"
                        onCancel={() => setIsParseQROpen(false)}
                        footer={(_, { OkBtn, CancelBtn }) => (
                            <>
                                <OkBtn />
                                <CancelBtn />
                            </>
                        )}
                    >
                        <QRParse
                            onChange={(content) =>
                                (otherQrContentRef.current = content)
                            }
                        />
                    </Modal>
                </Space>
            </Space>
        </div>
    );
};

export default QRGenerator;
