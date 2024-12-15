import Tool from "../BaseTool";

class TRandomGenerator extends Tool {
    constructor() {
        super("随机生成器", "RandomGenerator", "TrademarkOutlined");
        this.description = "用于生成随机数的工具.";
    }

    get rand() {
        return Math.random();
    }
    public getRandomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
    public getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    public getRandomIntArray(min: number, max: number, length: number) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(this.getRandomInt(min, max));
        }
        return arr;
    }
    public getRandomFloatArray(min: number, max: number, length: number) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(this.getRandomFloat(min, max));
        }
        return arr;
    }
    public getIntRandomFromGroup(min: number, max: number, group: number) {
        const range = max - min;
        const numberOfEnhancedGroups = range % group;
        const edge = Math.ceil(range / group);
        const result: number[] = [];
        for (let i = 1; i <= group; i++) {
            if (i <= numberOfEnhancedGroups) {
                result.push(this.getRandomInt(min, edge * i + 1));
                min = edge * i + 1;
            } else {
                result.push(this.getRandomInt(min, edge * i));
                min = edge * i;
            }
        }
        return result;
    }
    public getFloatRandomFromGroup(min: number, max: number, group: number) {
        const range = max - min;
        const GroupRange = range / group;
        const result: number[] = [];
        for (let i = 1; i <= group; i++) {
            const nextEdge = GroupRange * i;
            result.push(this.getRandomFloat(min, nextEdge));
            min = nextEdge;
        }

        return result;
    }
}
const instance = TRandomGenerator.getInstance();
export default instance as TRandomGenerator;
