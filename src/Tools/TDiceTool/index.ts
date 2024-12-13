import Tool from "../BaseTool";

class TDiceTool extends Tool {
    constructor() {
        super("骰子工具", "DiceTool", "DiceIcon");
    }
}
const instance = TDiceTool.getInstance();
export default instance as TDiceTool;