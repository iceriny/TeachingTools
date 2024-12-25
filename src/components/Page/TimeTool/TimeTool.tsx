import { Col, Divider, Row } from "antd";
// import TTimeTool from "../../../Tools/TTimeTool";

import Clock from "./Clock";
import TimeCountdown from "./Countdown";
import Timing from "./Timing";
import TimeCalculators from "./TimeCalculators";
import { breakpointComparative, useBreakpoint } from "../../Utilities";

function TimeTool() {
    const screens = useBreakpoint();

    return (
        <div>
            <Clock />
            <Divider />
            <Row gutter={[16, 32]}>
                <Col span={breakpointComparative(screens, "md") ? 8 : 24}>
                    <Timing />
                </Col>
                <Col span={breakpointComparative(screens, "md") ? 8 : 24}>
                    <TimeCountdown />
                </Col>
                <Col span={breakpointComparative(screens, "md") ? 8 : 24}>
                    <TimeCalculators />
                </Col>
            </Row>
        </div>
    );
}

export default TimeTool;
