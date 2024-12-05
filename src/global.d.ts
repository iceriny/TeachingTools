// global.d.ts

declare global {
    type EmptyObject = { [K in never]: never };
    type SubclassOf<T> = new (...args: unknown[]) => T;
}

// 必须导出一个空对象来使文件成为模块
export {};
