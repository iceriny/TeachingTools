import Tool from "../BaseTool";

class TDiceTool extends Tool {
    constructor() {
        super("骰子工具", "DiceTool", "DiceIcon");
        this.description = "投掷20面骰子.";
    }
}
const instance = TDiceTool.getInstance();
export default instance as TDiceTool;
