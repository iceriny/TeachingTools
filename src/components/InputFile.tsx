import { Button } from "antd";
import type { ButtonProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRef } from "react";

interface Props {
    title?: string;
    icon?: ButtonProps["icon"];
    /** 在点击按钮时触发的回调函数 */
    onClickCallback?: () => void;
    /** 文件上传后触发的回调函数 */
    onChange?: (fileName: string, fileContent: string) => void;
}
function InputFile({ title, icon, onClickCallback, onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onClick: ButtonProps["onClick"] = () => {
        fileInputRef.current?.click();
        onClickCallback?.();
    };
    const handleUploadIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onChange?.(file?.name, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <Button icon={icon || <UploadOutlined />} onClick={onClick}>
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleUploadIcon}
            />
            {title}
        </Button>
    );
}

export default InputFile;
