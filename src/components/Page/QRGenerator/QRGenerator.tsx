import React, { useState } from "react";

import TQRGenerator from "../../../Tools/TQRGenerator";

import {
    Button,
    ColorPicker,
    Input,
    QRCode,
    Radio,
    Slider,
    Space,
    Typography,
    Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { ButtonProps, RadioChangeEvent, SliderSingleProps } from "antd";

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
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [qrContent, setQRContent] = useState<string>();
    const [qrType, setQRType] = useState<"svg" | "canvas">("svg");
    const [qrColor, setQRColor] = useState<string>();
    const [qrIcon, setQRIcon] = useState<{ src: string; name: string }>();
    const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
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

    const onUploadIconClick: ButtonProps["onClick"] = () => {
        fileInputRef.current?.click();
    };
    const handleUploadIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setQRIcon({
                    src: reader.result as string,
                    name: file?.name || "未选择",
                }); // 将图片的Base64 URL存储到状态
            };
            reader.readAsDataURL(file);
        }
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
            <Space direction="vertical" size={30} align="center">
                <Typography.Title level={3}>{Tool.label}</Typography.Title>
                <div id="qr-code-display">
                    <QRCode
                        size={300}
                        value={qrContent || "请输入内容"}
                        type={qrType}
                        color={qrColor}
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
                <Button icon={<UploadOutlined />} onClick={onUploadIconClick}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleUploadIcon}
                    />
                    {qrIcon?.name || "自定义图标"}
                </Button>
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
            </Space>
        </div>
    );
}

export default QRGenerator;
