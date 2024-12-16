import { Card, Divider, Input, Space } from "antd";
import InputFile from "../../InputFile";
import { useRef } from "react";

interface Props {
    onChange?: (content: string) => void;
}
function QRParse({ onChange: handleCopyContent }: Props) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const handleTextAreaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        handleCopyContent?.(e.target.value);
    };
    return (
        <>
            <Space
                direction="vertical"
                align="center"
                style={{ display: "flex", width: "100%" }}
            >
                <InputFile
                    title="请选择二维码图片"
                    onChange={(fileContent) => {
                        inputRef.current &&
                            (inputRef.current.value = fileContent);
                    }}
                />
            </Space>
            <Divider />
            <Input.TextArea
                ref={inputRef}
                rows={4}
                onChange={handleTextAreaChange}
            />
        </>
    );
}

export default QRParse;
