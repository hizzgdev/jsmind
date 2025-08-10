/**
 * Screenshot plugin for jsMind.
 */
export class JmScreenshot {
    /**
     * Create screenshot plugin instance.
     * @param {import('../jsmind.js').default} jm - jsMind instance
     * @param {Partial<ScreenshotOptions>} options - Plugin options
     */
    constructor(jm: import("../jsmind.js").default, options: Partial<ScreenshotOptions>);
    version: string;
    /** @type {import('../jsmind.js').default} */
    jm: import("../jsmind.js").default;
    /** @type {ScreenshotOptions} */
    options: ScreenshotOptions;
    /** @type {number} */
    dpr: number;
    /** Take a screenshot of the mind map. */
    shoot(): void;
    /**
     * Create canvas for screenshot.
     * @returns {HTMLCanvasElement} Canvas element
     */
    create_canvas(): HTMLCanvasElement;
    /**
     * Clean up canvas element.
     * @param {HTMLCanvasElement} c - Canvas to remove
     */
    clear(c: HTMLCanvasElement): void;
    /**
     * Draw background on canvas.
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @returns {Promise<CanvasRenderingContext2D>} Promise resolving to context
     */
    draw_background(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;
    /**
     * Draw connection lines on canvas by copying from view graph.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {Promise<CanvasRenderingContext2D>}
     */
    draw_lines(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;
    /**
     * Draw node DOM into canvas via SVG snapshot.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {Promise<CanvasRenderingContext2D>}
     */
    draw_nodes(ctx: CanvasRenderingContext2D): Promise<CanvasRenderingContext2D>;
    /**
     * Draw watermark text on canvas.
     * @param {HTMLCanvasElement} c
     * @param {CanvasRenderingContext2D} ctx
     * @returns {CanvasRenderingContext2D}
     */
    draw_watermark(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Load image from URL and resolve img element.
     * @param {string} url
     * @returns {Promise<HTMLImageElement>}
     */
    load_image(url: string): Promise<HTMLImageElement>;
    /**
     * Trigger download of canvas content as PNG.
     * @param {HTMLCanvasElement} c
     */
    download(c: HTMLCanvasElement): void;
}
/**
 * Screenshot plugin registration.
 * @type {import('../jsmind.plugin.js').Plugin<Partial<ScreenshotOptions>>}
 */
export const screenshot_plugin: import("../jsmind.plugin.js").Plugin<Partial<ScreenshotOptions>>;
export default JmScreenshot;
/**
 * Default options for screenshot plugin.
 */
export type ScreenshotOptions = {
    filename?: string | null;
    watermark?: {
        left?: string | Location;
        right?: string;
    };
    background?: string;
};
