import { InputNumber } from "antd";
import type { InputNumberProps } from "antd";

export interface SingleNumberInputProps {
    defaultValue?: number;
    value?: number;
    id: string;
    index: number;
    onChange?: (value: number, index: number) => void;
    onPressEnter?: (value: number, index: number) => void;
    onBackspace?: (index: number) => void;
}
const SingleNumberInput: React.FC<SingleNumberInputProps> = ({
    defaultValue,
    value,
    id,
    index,
    onChange,
    onPressEnter,
    onBackspace,
}) => {
    const handleChange: InputNumberProps["onChange"] = (value) => {
        const newValue = parseInt(value as string);
        if (!isNaN(newValue)) {
            onChange?.(newValue, index);
        }
    };
    const handlePressEnter: React.KeyboardEventHandler<HTMLInputElement> = (
        event
    ) => {
        const element = event.target as HTMLInputElement;
        const newValue = parseInt(element.value);
        if (!isNaN(newValue)) {
            onPressEnter?.(newValue, index);
        }
    };
    const handleBackspace: React.KeyboardEventHandler<HTMLInputElement> = (
        event
    ) => {
        if (
            event.key === "Backspace" &&
            (event.target as HTMLInputElement).value === ""
        ) {
            onBackspace?.(index);
        }
    };
    return (
        <InputNumber
            id={id}
            defaultValue={defaultValue}
            value={value}
            addonBefore={`${index}`}
            type="number"
            size="small"
            placeholder="行号"
            style={{
                width: `${
                    5 +
                    (value === undefined
                        ? 1
                        : Math.abs(value).toString().length - 1)
                }em`,
            }}
            onChange={handleChange}
            onPressEnter={handlePressEnter}
            onKeyDown={handleBackspace}
        />
    );
};

export default SingleNumberInput;
