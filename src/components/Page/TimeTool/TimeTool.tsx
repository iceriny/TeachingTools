import { Divider } from "antd";
import TTimeTool from "../../../Tools/TTimeTool";

import Clock from "./Clock";
import Timing from "./Timing";

function TimeTool() {
    return (
        <div>
            <Clock />
            <Divider />
            <Timing />
        </div>
    );
}

export default TimeTool;
