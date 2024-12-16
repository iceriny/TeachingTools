import Tool from "../BaseTool";

class TQRGenerator extends Tool {
    constructor() {
        super("二维码生成器", "QRGenerator", "QrcodeOutlined");
        this.description = "根据输入的内容生成二维码, 支持文本, 链接等.";
    }
}
const instance = TQRGenerator.getInstance();
export default instance as TQRGenerator;
