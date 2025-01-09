import { Button, Flex } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import SingleNumberInput, { SingleNumberInputProps } from "./SingleNumberInput";
import { useCallback, useEffect, useState } from "react";

interface NumberListInputProps {
    length?: number;
    value?: number[];
    onChange?: (value: number[]) => void;
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

const Main: React.FC<NumberListInputProps> = ({ value, onChange }) => {
    const [values, setValues] = useState<number[]>(value || []);
    const [length, setLength] = useState<number>(2);

    const handlePressEnter = useCallback(
        (_: number, index: number) => {
            setLength(length + 1);
            document.getElementById("input-" + (index + 2))?.focus();
        },
        [length, onChange]
    );
    const handleChange = useCallback(
        (value: number, index: number) => {
            const newValues = [...values];
            newValues[index] = value;
            setValues(newValues);
            onChange?.(newValues);
        },
        [values, onChange]
    );

    return (
        <Flex gap={10} align="center" wrap>
            {getSingleNumberInputComponent(
                length,
                {
                    onPressEnter: handlePressEnter,
                    onChange: handleChange,
                },
                values
            )}
            {values.length > 0 && (
                <Button
                    type="default"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        setValues([]);
                        setLength(2);
                    }}
                />
            )}
        </Flex>
    );
};

export default Main;
