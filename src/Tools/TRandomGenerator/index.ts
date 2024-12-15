import Tool from "../BaseTool";

class TRandomGenerator extends Tool {
    constructor() {
        super("随机生成器", "RandomGenerator", "TrademarkOutlined");
    }

    get rand() {
        return Math.random();
    }
    public getRandomFloat(min: number, max: number) {
        return (Math.random() * (max - min) + min);
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
    public getRandomFloatArray(
        min: number,
        max: number,
        length: number,
    ) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(this.getRandomFloat(min, max));
        }
        return arr;
    }
    public getIntRandomFromGroup(min: number, max: number, group: number) {
        const numCount = max - min + 1;
        const numberOfEnhancedGroups = numCount % group;
        const groupSize = Math.ceil(numCount / group);
        const groups: number[][] = [];
        for (let i = 0; i < group; i++) {
            const group: number[] = [];
            for (
                let j = 0;
                j < (i < numberOfEnhancedGroups ? groupSize + 1 : groupSize);
                j++
            ) {
                group.push(min + j + i * groupSize);
            }
            groups.push(group);
        }

        return groups.map((group) => group[Math.floor(Math.random() * group.length)]);
    }
    public getFloatRandomFromGroup(
        min: number,
        max: number,
        group: number,
    ) {
        const numCount = max - min + 1;
        const edge = numCount / group;
        const result:number[] = [];
        for (let i = 0; i < group; i++) {
            result.push(this.getRandomFloat(min, edge * (i +1)));
        }

        return result;
    }
}
const instance = TRandomGenerator.getInstance();
export default instance as TRandomGenerator;
