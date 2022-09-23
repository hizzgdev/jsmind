/*
 * @Author: lyttonlee lzr3278@163.com
 * @Date: 2022-09-22 15:17:38
 * @LastEditors: lyttonlee lzr3278@163.com
 * @LastEditTime: 2022-09-23 10:02:44
 * @FilePath: \jsmind\src\types\type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface Options {
    container: string;
    theme?: string;
    plugins?: string[];
    [propName: string]: any;
}

export default class JsMind {
    constructor(options: Options) {}

    show(mind: any): void {}

    setTheme(theme: string): void {}
}
