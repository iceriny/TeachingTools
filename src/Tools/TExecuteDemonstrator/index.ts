import Tool from "../BaseTool";

type CodeBlocksParams = {
    paramName: string;
    value: string;
    type?: string;
    description?: string;
};
interface CodeBlocksData {
    code: string[];
    steps: number[];
    params: CodeBlocksParams[];
}
class TExecuteDemonstrator extends Tool {
    codeBlocksData: CodeBlocksData;
    currentStep = 0;
    constructor() {
        super("程序执行演示器", "SwapOutlined");
        this.codeBlocksData = { code: [], steps: [], params: [] };
    }

    nextStep() {
        this.currentStep++;
    }

    getCodeDisplay() {

    }
}

export default TExecuteDemonstrator;
