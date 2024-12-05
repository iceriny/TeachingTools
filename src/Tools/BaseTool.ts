import { SwapOutlined } from "@ant-design/icons";
import type { Class } from "type-fest";

type ToolsLabel = "程序执行演示器";
type ToolIconName = "SwapOutlined";

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
            default:
                return SwapOutlined;
        }
    }

    // public static registerTool(...tools: ConstructorObjectList) {
    //     if (!Tool.registeredTools) {
    //         Tool.registeredTools = tools;
    //     }
    //     Tool.registeredTools.concat(tools);
    // }

    // public static instantiation() {
    //     for (const tool of Tool.registeredTools) {
    //         console.log(typeof tool.constructor);
    //         tool.constructor.getInstance(...(tool.args ?? [])); // ts-ignore
    //     }
    // }

    /** 工具的显示名 */
    public label: string;
    protected _iconName: ToolIconName;
    protected enabled: boolean;
    protected constructor(
        label: ToolsLabel,
        iconName: ToolIconName,
        enabled: boolean = true
    ) {
        this.label = label;
        this._iconName = iconName;
        this.enabled = enabled;
    }
}

export default Tool;
