import { FC } from "react";
import { Flex, Typography, theme } from "antd";
import type { TimeObj } from "../../../Tools/TTimeTool";
import { breakpointComparative, useBreakpoint } from "../../Utilities";

const { useToken } = theme;

export interface TimeDisplayProps extends TimeObj {
    size?: 1 | 2 | 3 | 4 | 5;
    vertical?: boolean;
    /** 显示单位 [年, 月, 日, 时间冒号]  */
    showUnit?: [boolean, boolean, boolean, boolean];
    show?: (keyof TimeObj)[];
}
const SizeMap = [1, 1.5, 1.8, 2.2, 3] as const;
const FontSizeMap = [0.5, 0.9, 1, 1.2, 1.6];

interface TimeDisplayItemProps {
    value: number;
    unit: string;
    fontSize: string;
    color: string;
    showUnit?: boolean;
}
const TimeDisplayItem: FC<TimeDisplayItemProps> = ({
    value,
    unit,
    fontSize,
    color,
    showUnit,
}) => {
    return (
        <>
            {value}
            {showUnit && (
                <span
                    style={{
                        fontSize: fontSize,
                        color: color,
                    }}
                >
                    <Typography.Text style={{ fontWeight: 100 }}>
                        {unit}
                    </Typography.Text>
                </span>
            )}{" "}
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
    vertical,
    showUnit,
    size = 3,
    show = ["y", "m", "d", "h", "i", "s"],
}) => {
    const { token } = useToken();
    const fontSize = `${FontSizeMap[size - 1]}rem`;
    const numberSize = `${SizeMap[size - 1]}rem`;
    const screens = useBreakpoint();

    return (
        <Flex
            gap={breakpointComparative(screens, "lg") ? 10 : 3}
            vertical={vertical}
            justify="center"
            align={vertical ? "center" : "end"}
            style={{
                width: "100%",
                fontWeight: token.fontWeightStrong,
                fontSize: numberSize,
            }}
        >
            {show.includes("y") && (
                <div
                    style={{
                        display: breakpointComparative(screens, "lg")
                            ? "block"
                            : "inline",
                    }}
                >
                    <TimeDisplayItem
                        value={y}
                        unit="年"
                        fontSize={fontSize}
                        color={token.colorTextDescription}
                        showUnit={showUnit?.[0]}
                    />
                </div>
            )}
            {show.includes("m") && (
                <TimeDisplayItem
                    value={m}
                    unit="月"
                    fontSize={fontSize}
                    color={token.colorTextDescription}
                    showUnit={showUnit?.[1]}
                />
            )}
            {show.includes("d") && (
                <TimeDisplayItem
                    value={d}
                    unit="日"
                    fontSize={fontSize}
                    color={token.colorTextDescription}
                    showUnit={showUnit?.[2]}
                />
            )}
            <span>
                {show.includes("h") && `${h}`.padStart(2, "0")}
                {showUnit?.[3] && ":"}
            </span>
            <span>
                {show.includes("i") && `${i}`.padStart(2, "0")}
                {showUnit?.[3] && ":"}
            </span>
            <span>{show.includes("s") && `${s}`.padStart(2, "0")}</span>
        </Flex>
    );
};

export default TimeDisplay;
