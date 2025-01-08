import { InputNumber } from "antd";
import type { InputNumberProps } from "antd";
import { useState } from "react";

export interface SingleNumberInputProps {
    defaultValue?: number;
    value?: number;
    id: string;
    index: number;
    onChange?: (value: number, index: number) => void;
    onPressEnter?: (value: number, index: number) => void;
}
const SingleNumberInput: React.FC<SingleNumberInputProps> = ({
    defaultValue,
    value,
    id,
    index,
    onChange,
    onPressEnter,
}) => {
    const [inputValue, setInputValue] = useState<number | string>(
        value || defaultValue || ""
    );
    const handleChange: InputNumberProps["onChange"] = (value) => {
        const newValue = parseInt(value as string);
        if (!isNaN(newValue)) {
            onChange?.(newValue, index);
            setInputValue(newValue);
        }
    };
    const handleonPressEnter: React.KeyboardEventHandler<HTMLInputElement> = (
        event
    ) => {
        const element = event.target as HTMLInputElement;
        const newValue = parseInt(element.value);
        if (!isNaN(newValue)) {
            onPressEnter?.(newValue, index);
        }
    };
    return (
        <InputNumber
            id={id}
            defaultValue={defaultValue}
            value={inputValue}
            addonBefore={index}
            type="number"
            size="small"
            placeholder="行号"
            style={{
                width: `${
                    5 +
                    (typeof inputValue === "string"
                        ? 1
                        : Math.abs(inputValue).toString().length - 1)
                }em`,
            }}
            onChange={handleChange}
            onPressEnter={handleonPressEnter}
        />
    );
};

export default SingleNumberInput;
