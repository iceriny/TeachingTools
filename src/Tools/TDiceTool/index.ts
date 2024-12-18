import Tool from "../BaseTool";
import DiceTool from "../../components/Page/DiceTool";

class TDiceTool extends Tool<typeof DiceTool> {
    constructor() {
        super(DiceTool, "骰子工具", "DiceTool", "DiceIcon");
        this.description = "投掷20面骰子.";
    }
}
const instance = TDiceTool.getInstance();
export default instance;
