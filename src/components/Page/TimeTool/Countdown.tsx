import { FC } from "react";

import { Input, Statistic } from "antd";

import TTimeTool from "../../../Tools/TTimeTool";

const { Countdown } = Statistic;

const TimeCountdown: FC = () => {
    return (
        <div>
            <Input />
            <Countdown value={TTimeTool.time.add(10000, "ms").valueOf()} />
        </div>
    );
};

export default TimeCountdown;
