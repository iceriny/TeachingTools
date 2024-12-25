import {
    SwapOutlined,
    TrademarkOutlined,
    QrcodeOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import type { Class } from "type-fest";

import DiceIcon from "./ToolIcon/DiceIcon";

type ToolsLabel =
    | "骰子工具"
    | "程序执行演示器"
    | "随机生成器"
    | "二维码生成器"
    | "时间工具";
type ToolName =
    | "DiceTool"
    | "ExecuteDemonstrator"
    | "RandomGenerator"
    | "QRGenerator"
    | "TimeTool";
type ToolIconName =
    | "SwapOutlined"
    | "DiceIcon"
    | "TrademarkOutlined"
    | "QrcodeOutlined"
    | "ClockCircleOutlined";

/**
 * 工具逻辑类的基类, 已实现单例模式, 用`getInstance`获取实例
 */
class Tool<C extends React.FC<P>, P = {}> {
    private static instances: Map<ToolName, Tool<any, any>> = new Map();

    /**
     * Tool类是单例模式, 只能通过`此函数`获取实例
     * @param this 要获取实例的类
     * @param args 对应类构造函数的参数
     * @returns 工具实例
     */
    public static getInstance<T extends Tool<any, any>>(
        this: Class<T>,
        ...args: ConstructorParameters<Class<T>>
    ): T {
        const className = this.name as ToolName;

        if (!Tool.instances.has(className)) {
            Tool.instances.set(className, new this(...args));
        }

        return Tool.instances.get(className) as T;
    }

    public static getInstanceByName(name: ToolName) {
        return Tool.instances.get(name)!;
    }
    /**
     * @returns 所有工具实例 迭代器
     */
    public static getAllTools() {
        return Tool.instances.values();
    }
    /**
     * @returns 所有工具实例的数组
     */
    public static getAllToolsList() {
        return Array.from(Tool.instances.values());
    }

    public getIcon() {
        switch (this._iconName) {
            case "SwapOutlined":
                return SwapOutlined;
            case "DiceIcon":
                return DiceIcon;
            case "TrademarkOutlined":
                return TrademarkOutlined;
            case "QrcodeOutlined":
                return QrcodeOutlined;
            case "ClockCircleOutlined":
                return ClockCircleOutlined;
            default:
                return SwapOutlined;
        }
    }

    public getComponent() {
        return this.component;
    }

    /** 工具的显示名 */
    public component: C;
    public label: ToolsLabel;
    public name: ToolName;
    public description: string = "DevInfo: 请填写描述!";
    protected _iconName: ToolIconName;
    protected enabled: boolean;
    protected constructor(
        component: C,
        label: ToolsLabel,
        name: ToolName,
        iconName: ToolIconName,
        enabled: boolean = true
    ) {
        this.label = label;
        this._iconName = iconName;
        this.enabled = enabled;
        this.name = name;
        this.component = component;
    }
}

export default Tool;
export type { ToolsLabel, ToolName, ToolIconName };
