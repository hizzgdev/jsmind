/**
 * TypeScript definitions for jsMind screenshot plugin
 * @version 0.2.0
 */

import jsMind from './jsmind';

export interface WatermarkOptions {
    left?: string | Location;
    right?: string;
}

export interface ScreenshotOptions {
    filename?: string | null;
    watermark?: WatermarkOptions;
    background?: string;
}

export class JmScreenshot {
    version: string;
    jm: jsMind;
    options: Required<ScreenshotOptions>;
    dpr: number;

    constructor(jm: jsMind, options?: ScreenshotOptions);
    shoot(): void;
    create_canvas(): HTMLCanvasElement;
    clear(c: HTMLCanvasElement): void;
    draw_background(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;
    draw_lines(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;
    draw_nodes(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;
    draw_watermark(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D): CanvasRenderingContext2D;
    load_image(url: string): Promise<HTMLImageElement>;
    download(c: HTMLCanvasElement): void;
}

declare module './jsmind' {
    interface PluginOptions {
        screenshot?: ScreenshotOptions;
    }

    interface jsMind {
        screenshot?: JmScreenshot;
        shoot?(): void;
    }
}

export const screenshot_plugin: any;
export default JmScreenshot;
