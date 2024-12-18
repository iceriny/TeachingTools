import Tool from "../BaseTool";
import QRGenerator from "../../components/Page/QRGenerator";
import type { QRGeneratorProps } from "../../components/Page/QRGenerator";

class TQRGenerator extends Tool<typeof QRGenerator, QRGeneratorProps> {
    constructor() {
        super(QRGenerator, "二维码生成器", "QRGenerator", "QrcodeOutlined");
        this.description = "根据输入的内容生成二维码, 支持文本, 链接等.";
    }
}
const instance = TQRGenerator.getInstance();
export default instance;
