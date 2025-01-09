import { Button, Flex } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import SingleNumberInput, { SingleNumberInputProps } from "./SingleNumberInput";
import { useCallback, useEffect, useState } from "react";

interface NumberListInputProps {
    length?: number;
    value?: number[];
    onChange?: (value: number[]) => void;
    onClear?: () => void;
}

function getSingleNumberInputComponent(
    length: number,
    props: Omit<Omit<Omit<SingleNumberInputProps, "index">, "id">, "value">,
    values?: number[]
) {
    const components = [];
    for (let i = 0; i < length; i++) {
        components.push(
            <SingleNumberInput
                value={values?.[i]}
                key={i}
                id={"input-" + (i + 1)}
                index={i}
                {...props}
            />
        );
    }
    return components;
}

const Main: React.FC<NumberListInputProps> = ({
    value: values,
    onChange,
    onClear,
}) => {
    // const [values, setValues] = useState<number[]>(value || []);
    values = values || [];

    const [length, setLength] = useState<number>(2);

    const handlePressEnter = (_: number, index: number) => {
        document.getElementById("input-" + (index + 2))?.focus();
    };
    const handleChange = useCallback(
        (value: number, index: number) => {
            const newValues = [...values];
            newValues[index] = value;
            // setValues(newValues);
            onChange?.(newValues);
        },
        [values, onChange]
    );

    const onBackspace = (index: number) => {
        if (values.length > 0) {
            const newValues = [...values];
            newValues.splice(index, 1);
            // setValues(newValues);
            onChange?.(newValues);
            document.getElementById("input-" + index)?.focus();
        }
    };
    useEffect(() => {
        const newLength = values.length + 2;
        if (length !== newLength) setLength(newLength);
    }, [values, length]);

    return (
        <Flex gap={10} align="center" wrap>
            {getSingleNumberInputComponent(
                length,
                {
                    onPressEnter: handlePressEnter,
                    onChange: handleChange,
                    onBackspace,
                },
                values
            )}
            {values.length > 0 && (
                <Button
                    type="default"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        // setValues([]);
                        setLength(2);
                        onClear?.();
                    }}
                />
            )}
        </Flex>
    );
};

export default Main;
