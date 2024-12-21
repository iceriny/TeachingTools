import { Divider, Flex } from "antd";
// import TTimeTool from "../../../Tools/TTimeTool";

import Clock from "./Clock";
import Timing from "./Timing";
import TimeCountdown from "./Countdown";

function TimeTool() {
    return (
        <div>
            <Clock />
            <Divider />
            <Flex gap={10} wrap>
                <Timing />
                <TimeCountdown />
            </Flex>
        </div>
    );
}

export default TimeTool;
