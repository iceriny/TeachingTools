import { Col, Divider, Row } from "antd";
// import TTimeTool from "../../../Tools/TTimeTool";

import Clock from "./Clock";
import TimeCountdown from "./Countdown";
import Timing from "./Timing";
import TimeCalculators from "./TimeCalculators";

function TimeTool() {
    return (
        <div>
            <Clock />
            <Divider />
            <Row gutter={[16, 32]}>
                <Col span={12}>
                    <Timing />
                </Col>
                <Col span={12}>
                    <TimeCountdown />
                </Col>
                <Col span={24}>
                    <TimeCalculators />
                </Col>
            </Row>
        </div>
    );
}

export default TimeTool;
