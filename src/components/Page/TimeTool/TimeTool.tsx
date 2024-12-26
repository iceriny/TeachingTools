import { Col, Divider, Row } from "antd";
// import TTimeTool from "../../../Tools/TTimeTool";

import Clock from "./Clock";
import TimeCountdown from "./Countdown";
import Timing from "./Timing";
import TimeCalculators from "./TimeCalculators";
import { breakpointComparative, useBreakpoint } from "../../Utilities";

function TimeTool() {
    const screens = useBreakpoint();
    const breakpoint = breakpointComparative(screens, "lg");
    const colSpan = breakpoint ? 8 : 24;

    return (
        <div>
            <Clock
                size={breakpoint ? 3 : 2}
                showType={breakpoint ? undefined : { s: "circle" }}
                showUnit={breakpoint ? [true, true, true] : [true, true, true]}
            />
            <Divider />
            <Row gutter={[16, 32]}>
                <Col span={colSpan}>
                    <Timing />
                </Col>
                <Col span={colSpan}>
                    <TimeCountdown />
                </Col>
                <Col span={colSpan}>
                    <TimeCalculators />
                </Col>
            </Row>
        </div>
    );
}

export default TimeTool;
