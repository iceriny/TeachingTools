import { Divider, Input, Space } from "antd";
import InputFile from "../../InputFile";
import { useRef, useState } from "react";
import jsQR from "jsqr";

interface Props {
    onChange?: (content: string) => void;
}
const QRParse: React.FC<Props> = ({ onChange }: Props) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [qrContent, setQRContent] = useState<string>();
    return (
        <>
            <Space
                direction="vertical"
                align="center"
                style={{ display: "flex", width: "100%" }}
            >
                <InputFile
                    title="请选择二维码图片"
                    onChange={(_, fileContent) => {
                        const img = new Image();
                        img.src = fileContent;
                        img.onload = () => {
                            const canvas = canvasRef.current;
                            if (!canvas) return;
                            const ctx = canvas.getContext("2d")!;
                            canvas.width = img.width;
                            canvas.height = img.height;
                            // 先在 Canvas 上绘制一个背景色
                            ctx.fillStyle = "#ffcc00";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            // 将图片绘制到 Canvas 上
                            ctx.drawImage(img, 0, 0, img.width, img.height);

                            // 获取 ImageData
                            let imageData = ctx.getImageData(
                                0,
                                0,
                                img.width,
                                img.height
                            );
                            // 使用jsQR解码
                            let qrData = jsQR(
                                imageData.data,
                                imageData.width,
                                imageData.height,
                                { inversionAttempts: "attemptBoth" }
                            );

                            // 如果为解析成功, 计算平均亮度, 先进行搞对比填充背景色, 然后再次解码
                            if (!qrData) {
                                // 清空整个画布
                                ctx.clearRect(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height
                                );
                                ctx.drawImage(img, 0, 0, img.width, img.height);
                                // 获取像素数据
                                imageData = ctx.getImageData(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height
                                );
                                const data = imageData.data;

                                let totalBrightness = 0;
                                let pixelCount = 0;

                                // 遍历像素数据
                                for (let i = 0; i < data.length; i += 4) {
                                    const r = data[i]; // 红色通道
                                    const g = data[i + 1]; // 绿色通道
                                    const b = data[i + 2]; // 蓝色通道
                                    const a = data[i + 3]; // 透明度通道

                                    if (a > 0) {
                                        // 忽略完全透明像素
                                        const brightness =
                                            0.299 * r + 0.587 * g + 0.114 * b;
                                        totalBrightness += brightness;
                                        pixelCount++;
                                    }
                                }

                                // 计算平均亮度
                                const averageBrightness =
                                    pixelCount > 0
                                        ? totalBrightness / pixelCount
                                        : 0;
                                if (averageBrightness < 0.5) {
                                    ctx.fillStyle = "#ff00dc";
                                } else {
                                    ctx.fillStyle = "#000000";
                                }
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                // 再次解码
                                // 将图片绘制到 Canvas 上
                                ctx.drawImage(img, 0, 0, img.width, img.height);

                                // 获取 ImageData
                                imageData = ctx.getImageData(
                                    0,
                                    0,
                                    img.width,
                                    img.height
                                );
                                // 使用jsQR解码
                                qrData = jsQR(
                                    imageData.data,
                                    imageData.width,
                                    imageData.height,
                                    { inversionAttempts: "attemptBoth" }
                                );
                            }
                            const result =
                                qrData?.data || "[二维码解析内容为空]";
                            inputRef.current &&
                                (inputRef.current.value = result);

                            setQRContent(result);
                            onChange?.(result);
                        };
                    }}
                />
            </Space>
            <Divider />
            <Input.TextArea
                ref={inputRef}
                rows={4}
                placeholder="解析结果"
                readOnly
                value={qrContent}
                // onChange={handleTextAreaChange}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
    );
}

export default QRParse;
