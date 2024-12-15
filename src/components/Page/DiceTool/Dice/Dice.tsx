import { Space } from "antd";

interface props {
    n: number;
    index: number;
    acitive?: boolean;
    size?: number;
    color?: string; // 骰子的填充颜色，默认
    activeColor?: string;
    onClick?: (index: number) => void;
}
function Dice({ n, index, acitive = false, size = 200, color = "#644147", activeColor = "#459468", onClick }: props) {
    const getColor = () => {
        return acitive ? activeColor : color;
    }
    const HandleClick = () => {
        onClick?.(index);
    }
    return (
        <Space onClick={HandleClick}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                x="0px"
                y="0px"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", margin: "auto" }}
            >
                <polygon
                    fill={getColor()}
                    points="12.27 72.79 46.1 91.93 22.59 66.81 12.27 72.79"
                />
                <polygon
                    fill={getColor()}
                    points="11.51 31.44 11.51 71.49 21.84 65.51 11.51 31.44"
                />
                <polygon
                    fill={getColor()}
                    points="48.51 17.88 11.71 26.92 22.94 63.95 48.51 17.88"
                />
                <polygon
                    fill={getColor()}
                    points="49.24 6.26 16.19 24.28 49.24 16.16 49.24 6.26"
                />
                <polygon
                    fill={getColor()}
                    points="75.98 65.11 73.19 60.08 49.99 18.29 24.01 65.11 75.98 65.11"
                />
                <polygon
                    fill={getColor()}
                    points="75.53 66.61 24.46 66.61 49.99 93.9 57.95 85.39 75.53 66.61"
                />
                <polygon
                    fill={getColor()}
                    points="77.4 66.81 53.89 91.93 87.73 72.79 80.82 68.79 77.4 66.81"
                />
                <polygon
                    fill={getColor()}
                    points="88.49 71.49 88.49 31.44 78.15 65.51 88.49 71.49"
                />
                <polygon
                    fill={getColor()}
                    points="51.48 17.88 77.05 63.95 88.3 26.92 58.56 19.62 51.48 17.88"
                />
                <polygon
                    fill={getColor()}
                    points="50.74 6.26 50.74 16.16 83.81 24.28 50.74 6.26"
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="20"
                    fontWeight="bold"
                    fill="white"
                >
                    {n}
                </text>
            </svg>
        </Space>
    );
}

export default Dice;
