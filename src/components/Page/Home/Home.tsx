import { Card, Space, theme } from "antd";
import Tool from "../../../Tools/BaseTool";
import React from "react";
import type { PageName } from "../../Main";

const items = Tool.getAllToolsList();
const { useToken } = theme;
interface Props {
    contentMinHeight: number;
    contentPadding: number;
    cardClickCallback: (pageKey: PageName) => void;
}
const Home: React.FC<Props> = ({
    contentMinHeight,
    contentPadding,
    cardClickCallback,
}: Props) => {
    const { token } = useToken();
    const handleCardClick = (event: React.MouseEvent) => {
        cardClickCallback(
            (event.currentTarget as HTMLElement).dataset.key as PageName
        );
    };
    return (
        <div
            style={{
                height: contentMinHeight - 2 * contentPadding,
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Space wrap>
                {items.map((item, index) => {
                    return (
                        <Card
                            key={index}
                            title={
                                <div style={{ color: token.colorPrimary }}>
                                    <Space
                                        direction="vertical"
                                        align="center"
                                        style={{ width: "100%" }}
                                    >
                                        {React.createElement(item.getIcon())}
                                        {item.label}
                                    </Space>
                                </div>
                            }
                            hoverable
                            style={{ width: 300 }}
                            onClick={handleCardClick}
                            data-key={`nav_${item.name}`}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {item.description}
                            </div>
                        </Card>
                    );
                })}
            </Space>
        </div>
    );
};

export default Home;
