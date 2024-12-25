// global.d.ts

declare global {
    type EmptyObject = { [K in never]: never };
    type SubclassOf<T> = new (...args: unknown[]) => T;
    type VersionNumber = `${number}.${number}.${number}`;

    type VersionMap = {
        [key: VersionNumber]: { desc: string[] };
    };
    interface Window {
        isFirst: boolean;
    }
}

// 必须导出一个空对象来使文件成为模块
export {};
