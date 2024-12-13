import { SwapOutlined } from "@ant-design/icons";
import type { Class } from "type-fest";

import DiceIcon from "./ToolIcon/DiceIcon";

type ToolsLabel = "程序执行演示器" | "骰子工具";
type ToolName = "DiceTool" | "ExecuteDemonstrator";
type ToolIconName = "SwapOutlined" | "DiceIcon";

/**
 * 工具逻辑类的基类, 已实现单例模式, 用`getInstance`获取实例
 */
class Tool {
    private static instances: Map<string, Tool> = new Map();

    /**
     * Tool类是单例模式, 只能通过`此函数`获取实例
     * @param this 要获取实例的类
     * @param args 对应类构造函数的参数
     * @returns 工具实例
     */
    public static getInstance<T extends Tool>(
        this: Class<T>,
        ...args: ConstructorParameters<Class<T>>
    ): T {
        const className = this.name;

        if (!Tool.instances.has(className)) {
            Tool.instances.set(className, new this(...args));
        }

        return Tool.instances.get(className) as T;
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
            default:
                return SwapOutlined;
        }
    }

    /** 工具的显示名 */
    public label: ToolsLabel;
    public name: ToolName;
    protected _iconName: ToolIconName;
    protected enabled: boolean;
    protected constructor(
        label: ToolsLabel,
        name: ToolName,
        iconName: ToolIconName,
        enabled: boolean = true
    ) {
        this.label = label;
        this._iconName = iconName;
        this.enabled = enabled;
        this.name = name;
    }
}

export default Tool;
export type { ToolsLabel, ToolName, ToolIconName };
