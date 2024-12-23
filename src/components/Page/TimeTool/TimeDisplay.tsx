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
}
const SizeMap = [5, 4, 3, 2, 1] as const;
const FontSizeMap = [0.5, 0.9, 1, 1.2, 1.6];
const TimeDisplay: FC<TimeDisplayProps> = ({ y, m, d, h, i, s, size = 3 }) => {
    const { token } = useToken();
    const fontSize = `${FontSizeMap[size - 1]}rem`;

    return (
        <div
            style={{
                textAlign: "center",
            }}
        >
            <Typography.Title
                level={SizeMap[size - 1]}
                style={{ width: "100%" }}
            >
                {y}
                <span
                    style={{
                        fontSize: fontSize,
                        color: token.colorTextDescription,
                    }}
                >
                    年
                </span>{" "}
                {m}
                <span
                    style={{
                        fontSize: fontSize,
                        color: token.colorTextDescription,
                    }}
                >
                    月
                </span>{" "}
                {d}
                <span
                    style={{
                        fontSize: fontSize,
                        color: token.colorTextDescription,
                    }}
                >
                    日
                </span>{" "}
                {`${h}`.padStart(2, "0")}:{`${i}`.padStart(2, "0")}:
                {`${s}`.padStart(2, "0")}
            </Typography.Title>
        </div>
    );
};

export default TimeDisplay;
