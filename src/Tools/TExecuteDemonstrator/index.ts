import Tool from "../BaseTool";
import ExecuteDemonstrator from "../../components/Page/ExecuteDemonstrator";

import type { ExecuteDemonstratorProps } from "../../components/Page/ExecuteDemonstrator";

type CodeBlocksParamsValue = {
    [key in number]: string;
};
export type CodeBlocksParams = {
    paramName: string;
    value: CodeBlocksParamsValue;
    type?: string;
    description?: string;
};
interface CodeBlocksDataExceptCode {
    steps: number[];
    params: CodeBlocksParams[];
}
interface CodeBlocksData extends CodeBlocksDataExceptCode {
    code: string[];
}
interface TExecuteDemonstratorProps extends CodeBlocksDataExceptCode {
    code: string;
}
class TExecuteDemonstrator extends Tool<
    typeof ExecuteDemonstrator,
    ExecuteDemonstratorProps
> {
    _code: string;
    _codeLine: CodeBlocksData["code"];
    steps: CodeBlocksData["steps"];
    params: CodeBlocksData["params"];
    _currentStep = -1;
    _currentLine = 0;
    constructor(data: TExecuteDemonstratorProps) {
        super(
            ExecuteDemonstrator,
            "程序执行演示器",
            "ExecuteDemonstrator",
            "SwapOutlined"
        );
        this.description =
            "输入程序代码, 并且录入各种数据, 可以展示程序执行过程.";
        this._code = data.code;
        this._codeLine = data.code.split("\n");
        this.steps = data.steps;
        this.params = data.params;
    }

    set code(value: string) {
        this._code = value;
        this._codeLine = value.split("\n");
    }
    get code() {
        return this._code;
    }
    set codeLine(value: string[]) {
        this._codeLine = value;
        this.code = value.join("\n");
    }
    get codeLine() {
        return this._codeLine;
    }

    set currentStep(value: number) {
        if (value < 0) {
            this._currentStep = this.steps.length - 1;
        } else if (value >= this.steps.length) {
            this._currentStep = 0;
        } else {
            this._currentStep = value;
        }
    }
    get currentStep() {
        return this._currentStep;
    }
    set currentLine(value: number) {
        if (value < 0) {
            this._currentLine = this.codeLine.length - 1;
        } else if (value > this.codeLine.length) {
            this._currentLine = 1;
        } else {
            this._currentLine = value;
        }
    }
    get currentLine() {
        return this._currentLine;
    }

    /**
     * @returns 下一步步骤的行号.
     */
    nextStep(): [number, number] {
        this.currentStep++;
        return [this.steps[this.currentStep], this.currentStep];
    }
    /**
     * 将当前步骤重置为0
     */
    initStep() {
        this._currentStep = 0;
        return [this.steps[this.currentStep], 0];
    }
    /**
     * @returns 上一步步骤的行号
     */
    prevStep(): [number, number] {
        this.currentStep--;
        return [this.steps[this.currentStep], this.currentStep];
    }
}
const instance = TExecuteDemonstrator.getInstance({
    code: "",
    steps: [],
    params: [],
});
export default instance;
