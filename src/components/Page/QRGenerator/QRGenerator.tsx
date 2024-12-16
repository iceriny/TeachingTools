import React, { useState } from "react";

import TQRGenerator from "../../../Tools/TQRGenerator";

import type { RadioChangeEvent, SliderSingleProps } from "antd";
import {
    Button,
    ColorPicker,
    Input,
    InputNumber,
    message,
    Modal,
    QRCode,
    Radio,
    Slider,
    Space,
    Tooltip,
    Typography,
} from "antd";
import InputFile from "../../InputFile";
import QRParse from "./QRParse";

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
function QRGenerator({
    contentMinHeight,
    contentPadding,
}: {
    contentMinHeight: number;
    contentPadding: number;
}) {
    const Tool = TQRGenerator;
    const [messageApi, contextHolder] = message.useMessage();
    const otherQrContentRef = React.useRef<string>();
    const [qrContent, setQRContent] = useState<string>();
    const [qrType, setQRType] = useState<"svg" | "canvas">("svg");
    const [qrColor, setQRColor] = useState<string>();
    const [qrIcon, setQRIcon] = useState<{ src: string; name: string }>();
    const [qrIconSize, setQRIconSize] = useState<number>();
    const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
    const [isParseQROpen, setIsParseQROpen] = useState(false);
    const onTypeChange = ({ target: { value } }: RadioChangeEvent) => {
        setQRType(value);
    };
    const onClickDownload = () => {
        if (qrType === "svg") {
            downloadSvgQRCode();
        } else {
            downloadCanvasQRCode();
        }
    };

    const handleUploadIcon = (fileName: string, result: string) => {
        setQRIcon({
            src: result,
            name: fileName || "未选择",
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
                <Typography.Title level={3}>{Tool.label}</Typography.Title>
                <div id="qr-code-display">
                    <QRCode
                        size={300}
                        value={qrContent || "请输入内容"}
                        type={qrType}
                        color={qrColor}
                        iconSize={qrIconSize}
                        icon={qrIcon?.src}
                        errorLevel={level}
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
                        value={qrType}
                    />
                    <ColorPicker
                        defaultValue="#1677ff"
                        onChange={(e) => {
                            setQRColor(e?.toHexString());
                        }}
                    />
                    <Button onClick={onClickDownload}>下载</Button>
                </Space>
                <Space direction="vertical" align="center">
                    <Typography.Text>容错率</Typography.Text>
                    <Slider
                        style={{
                            width: "500px",
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
                            console.log(level);
                            setLevel(level);
                        }}
                    />
                </Space>
                <Space>
                    <InputFile
                        title={qrIcon?.name || "自定义图标"}
                        onChange={handleUploadIcon}
                    />
                    {qrIcon?.name && (
                        <InputNumber
                            style={{ width: "140px" }}
                            addonBefore="图标大小"
                            defaultValue={32}
                            onChange={(e) => {
                                setQRIconSize(e || 32);
                            }}
                        />
                    )}
                </Space>
                <Space>
                    <Input
                        placeholder="请输入内容"
                        allowClear
                        size="large"
                        addonBefore="二维码中的内容: "
                        type="text"
                        onChange={(e) => {
                            setQRContent(e.target.value);
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
}

export default QRGenerator;
