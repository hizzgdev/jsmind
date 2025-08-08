/**
 * TypeScript definitions for jsMind screenshot plugin
 * @version 0.2.0
 * @author jsMind Community
 * @license BSD-3-Clause
 */

import jsMind from './jsmind';

// ============================================================================
// 插件配置选项接口
// ============================================================================

export interface WatermarkOptions {
    /** 左侧水印文本 */
    left?: string | Location;
    /** 右侧水印文本 */
    right?: string;
}

export interface ScreenshotOptions {
    /** 导出文件名（不包含扩展名） */
    filename?: string | null;
    /** 水印配置 */
    watermark?: WatermarkOptions;
    /** 背景颜色，'transparent' 表示透明背景 */
    background?: string;
}

// ============================================================================
// 插件类定义
// ============================================================================

export class JmScreenshot {
    version: string;
    jm: jsMind;
    options: Required<ScreenshotOptions>;
    dpr: number;

    constructor(jm: jsMind, options?: ScreenshotOptions);

    /** 
     * 截图并下载
     * 执行完整的截图流程：创建画布 -> 绘制背景 -> 绘制线条 -> 绘制节点 -> 添加水印 -> 下载 -> 清理
     */
    shoot(): void;

    /** 
     * 创建画布
     * @returns 返回创建的canvas元素
     */
    create_canvas(): HTMLCanvasElement;

    /** 
     * 清理画布
     * @param c 要清理的canvas元素
     */
    clear(c: HTMLCanvasElement): void;

    /** 
     * 绘制背景
     * @param ctx 画布上下文
     * @returns Promise，完成后返回画布上下文
     */
    draw_background(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;

    /** 
     * 绘制连接线
     * @param ctx 画布上下文
     * @returns Promise，完成后返回画布上下文
     */
    draw_lines(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;

    /** 
     * 绘制节点
     * @param ctx 画布上下文
     * @returns Promise，完成后返回画布上下文
     */
    draw_nodes(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;

    /** 
     * 绘制水印
     * @param c 画布元素
     * @param ctx 画布上下文
     * @returns 画布上下文
     */
    draw_watermark(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D): CanvasRenderingContext2D;

    /** 
     * 加载图片
     * @param url 图片URL
     * @returns Promise，完成后返回HTMLImageElement
     */
    load_image(url: string): Promise<HTMLImageElement>;

    /** 
     * 下载画布内容为PNG文件
     * @param c 画布元素
     */
    download(c: HTMLCanvasElement): void;
}

// ============================================================================
// 模块声明扩展
// ============================================================================

declare module './jsmind' {
    interface PluginOptions {
        screenshot?: ScreenshotOptions;
    }

    // 扩展jsMind类，添加screenshot插件方法
    export default interface jsMind {
        /** screenshot插件实例 */
        screenshot?: JmScreenshot;
        
        /** 
         * 截图方法（由screenshot插件添加）
         * 执行截图并下载为PNG文件
         */
        shoot?(): void;
    }
}

// ============================================================================
// 插件注册
// ============================================================================

/** screenshot插件实例 */
export const screenshot_plugin: any;

// 自动注册插件到jsMind
export default JmScreenshot;
