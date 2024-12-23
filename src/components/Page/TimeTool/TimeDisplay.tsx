import { FC } from "react";
import { Typography, theme } from "antd";

const { useToken } = theme;

export interface TimeDisplayProps {
    y: number;
    m: number;
    d: number;
    h: number;
    i: number;
    s: number;
    size?: 1 | 2 | 3 | 4 | 5;
    show?: ("y" | "m" | "d" | "h" | "i" | "s")[];
}
const SizeMap = [1, 1.5, 1.8, 2.2, 3] as const;
const FontSizeMap = [0.5, 0.9, 1, 1.2, 1.6];

interface TimeDisplayItemProps {
    value: number;
    unit: string;
    fontSize: string;
    color: string;
}
const TimeDisplayItem: FC<TimeDisplayItemProps> = ({
    value,
    unit,
    fontSize,
    color,
}) => {
    return (
        <>
            {value}
            <span
                style={{
                    fontSize: fontSize,
                    color: color,
                }}
            >
                <Typography.Text style={{ fontWeight: 100 }}>
                    {unit}
                </Typography.Text>
            </span>{" "}
        </>
    );
};
const TimeDisplay: FC<TimeDisplayProps> = ({
    y,
    m,
    d,
    h,
    i,
    s,
    size = 3,
    show = ["y", "m", "d", "h", "i", "s"],
}) => {
    const { token } = useToken();
    const fontSize = `${FontSizeMap[size - 1]}rem`;
    const numberSize = `${SizeMap[size - 1]}rem`;

    return (
        <div
            style={{
                textAlign: "center",
            }}
        >
            <Typography.Text
                style={{
                    width: "100%",
                    fontWeight: token.fontWeightStrong,
                    fontSize: numberSize,
                }}
            >
                {show.includes("y") && (
                    <TimeDisplayItem
                        value={y}
                        unit="年"
                        fontSize={fontSize}
                        color={token.colorTextDescription}
                    />
                )}
                {show.includes("m") && (
                    <TimeDisplayItem
                        value={m}
                        unit="月"
                        fontSize={fontSize}
                        color={token.colorTextDescription}
                    />
                )}
                {show.includes("d") && (
                    <TimeDisplayItem
                        value={d}
                        unit="日"
                        fontSize={fontSize}
                        color={token.colorTextDescription}
                    />
                )}
                {show.includes("h") && `${h}:`.padStart(3, "0")}
                {show.includes("i") && `${i}:`.padStart(3, "0")}
                {show.includes("s") && `${s}`.padStart(2, "0")}
            </Typography.Text>
        </div>
    );
};

export default TimeDisplay;
