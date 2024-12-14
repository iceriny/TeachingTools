import Tool from "../BaseTool";

class TRandomGenerator extends Tool {
    constructor() {
        super("随机生成器", "RandomGenerator", "TrademarkOutlined");
    }

    get rand() {
        return Math.random();
    }
    public getRandomFloat(min: number, max: number, precision: number) {
        return (Math.random() * (max - min) + min).toFixed(precision);
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
        precision: number
    ) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(this.getRandomFloat(min, max, precision));
        }
        return arr;
    }
}
const instance = TRandomGenerator.getInstance();
export default instance as TRandomGenerator;
