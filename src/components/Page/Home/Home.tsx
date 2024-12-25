import { Card, Col, Row, Space, theme } from "antd";
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
            <Row wrap gutter={[32, 32]} justify="center" align="middle">
                {items.map((item, index) => {
                    return (
                        <Col
                            key={index}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={8}
                            xl={6}
                            xxl={6}
                        >
                            <Card
                                title={
                                    <div style={{ color: token.colorPrimary }}>
                                        <Space
                                            direction="vertical"
                                            align="center"
                                            style={{ width: "100%" }}
                                        >
                                            {React.createElement(
                                                item.getIcon()
                                            )}
                                            {item.label}
                                        </Space>
                                    </div>
                                }
                                hoverable
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
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default Home;
