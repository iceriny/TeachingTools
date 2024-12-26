import { FC } from "react";
import { Flex, Progress, Typography, theme } from "antd";
import type { TimeObj } from "../../../Tools/TTimeTool";
import { breakpointComparative, useBreakpoint } from "../../Utilities";

const { useToken } = theme;

type ShowType = "number" | "bar" | "circle" /* | "text" */;
type showTypeObj = {
    [key in keyof TimeObj]?: ShowType;
};
export interface TimeDisplayProps extends TimeObj {
    size?: 1 | 2 | 3 | 4 | 5;
    vertical?: boolean;
    /** 显示单位 [年, 月, 日, 时间冒号]  */
    showUnit?: [boolean, boolean, boolean];
    show?: (keyof TimeObj)[];
    showType?: showTypeObj;
}
const SizeMap = [1, 1.5, 1.8, 2.2, 3] as const;
const FontSizeMap = [0.5, 0.9, 1, 1.2, 1.6];
const shapeSize = [25, 33, 44, 55, 67];

interface DateDisplayItemProps {
    value: number;
    unit: string;
    fontSize: string;
    color: string;
    showUnit?: boolean;
}
const DateDisplayItem: FC<DateDisplayItemProps> = ({
    value,
    unit,
    fontSize,
    color,
    showUnit,
}) => {
    return (
        <div style={{ display: "inline" }}>
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
        </div>
    );
};
interface TimeDisplayItemProps {
    value: number;
    size: number;
    type: "h" | "i" | "s";
    show: boolean | undefined;
    showType: ShowType | undefined;
    showColons?: boolean;
}
const TimeDisplayItem: FC<TimeDisplayItemProps> = ({
    value,
    showType,
    show,
    size,
    showColons = false,
    type,
}) => {
    const progress =
        showType === "bar" || showType === "circle"
            ? getTimeProgress(value, type)
            : 0;
    return (
        <>
            {!showType || showType === "number" ? (
                <span>
                    {show && `${value}`.padStart(2, "0")}
                    {showColons && ":"}
                </span>
            ) : showType === "circle" ? (
                <Progress
                    format={() => "⌛️"}
                    percent={progress}
                    size={shapeSize[size - 1]}
                    type="circle"
                />
            ) : (
                <Progress percent={progress} size={shapeSize[size - 1]} />
            )}
        </>
    );
};
function getTimeProgress(value: number, type: "h" | "i" | "s") {
    const delta = type === "h" ? 24 : 60;
    return Math.floor((value / delta) * 100);
}

const TimeDisplay: FC<TimeDisplayProps> = ({
    y,
    m,
    d,
    h,
    i,
    s,
    showType,
    vertical,
    showUnit,
    size = 3,
    show = ["y", "m", "d", "h", "i", "s"],
}) => {
    const { token } = useToken();
    const fontSize = `${FontSizeMap[size - 1]}rem`;
    const numberSize = `${SizeMap[size - 1]}rem`;
    const screens = useBreakpoint();

    const showColons = !vertical;
    const timeItems: [
        TimeDisplayItemProps,
        TimeDisplayItemProps,
        TimeDisplayItemProps
    ] = [
        {
            value: h,
            size,
            type: "h",
            show: show.includes("h"),
            showType: showType?.h,
            showColons,
        },
        {
            value: i,
            size,
            type: "i",
            show: show.includes("i"),
            showType: showType?.i,
            showColons,
        },
        {
            value: s,
            size,
            type: "s",
            show: show.includes("s"),
            showType: showType?.s,
            showColons: false,
        },
    ];

    if (showType && showType?.s !== "number" && vertical) {
        const temp = timeItems[1];
        timeItems[1] = timeItems[2];
        timeItems[2] = temp;
    }

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
                <DateDisplayItem
                    value={y}
                    unit="年"
                    fontSize={fontSize}
                    color={token.colorTextDescription}
                    showUnit={showUnit?.[0]}
                />
            )}
            <div>
                {show.includes("m") && (
                    <DateDisplayItem
                        value={m}
                        unit="月"
                        fontSize={fontSize}
                        color={token.colorTextDescription}
                        showUnit={showUnit?.[1]}
                    />
                )}
                {show.includes("d") && (
                    <DateDisplayItem
                        value={d}
                        unit="日"
                        fontSize={fontSize}
                        color={token.colorTextDescription}
                        showUnit={showUnit?.[2]}
                    />
                )}
            </div>
            {timeItems.map((item, index) => (
                <TimeDisplayItem key={index} {...item} />
            ))}
        </Flex>
    );
};

export default TimeDisplay;
