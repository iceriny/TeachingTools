import { useEffect, useRef } from "react";

function useLastStage<T>(value: T) {
    const ref = useRef<T>(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
// 类型定义
type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

// 将 16 位颜色字符串转换为 RGB
function hexToRgb(hex: string): RGB {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// 将 RGB 转换为 HSL
function rgbToHsl({ r, g, b }: RGB): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s: s * 100, l: l * 100 };
}

// 将 HSL 转换为 RGB
function hslToRgb({ h, s, l }: HSL): RGB {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
        g = 0,
        b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
    } else if (h >= 120 && h < 180) {
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}

// 将 RGB 转换回 16 位颜色字符串
function rgbToHex({ r, g, b }: RGB): string {
    const toHex = (value: number) => value.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 修改亮度和饱和度，保持色相不变
function adjustColor(
    hex: string,
    saturationDelta: number,
    lightnessDelta: number
): string {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);

    // 调整亮度和饱和度
    hsl.s = Math.min(100, Math.max(0, hsl.s + saturationDelta));
    hsl.l = Math.min(100, Math.max(0, hsl.l + lightnessDelta));

    const adjustedRgb = hslToRgb(hsl);
    return rgbToHex(adjustedRgb);
}
function getDarkBgColor(lightBgColor: string) {
    return adjustColor(lightBgColor, -10, -80);
}
const DEFAULT_PRIMARY_COLOR = "#a66595";
const DEFAULT_BG_COLOR = "#ffffff";
export {
    useLastStage,
    adjustColor,
    getDarkBgColor,
    DEFAULT_PRIMARY_COLOR,
    DEFAULT_BG_COLOR,
};
