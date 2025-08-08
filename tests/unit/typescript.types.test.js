/** @jest-environment node */

// 使用 TypeScript 编译器 API 执行类型检查，等价于 `tsc --noEmit`
import * as path from 'path';
import ts from 'typescript';

function parseTsConfig(tsconfigPath) {
    const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    if (configFile.error) {
        const message = ts.formatDiagnosticsWithColorAndContext([configFile.error], formatHost());
        throw new Error(`读取 tsconfig 失败:\n${message}`);
    }
    return ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(tsconfigPath));
}

function formatHost() {
    return {
        getCanonicalFileName: f => f,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
    };
}

describe('TypeScript 类型定义校验', () => {
    test('example/typescript-test.ts 应通过类型检查（无诊断错误）', () => {
        const projectRoot = process.cwd();
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');

        const parsed = parseTsConfig(tsconfigPath);

        // 强制不输出文件（即使 tsconfig 设置了 declaration），仅进行类型检查
        const compilerOptions = { ...parsed.options, noEmit: true };

        const program = ts.createProgram({ rootNames: parsed.fileNames, options: compilerOptions });

        const diagnostics = [
            ...program.getConfigFileParsingDiagnostics(),
            ...program.getOptionsDiagnostics(),
            ...program.getSyntacticDiagnostics(),
            ...program.getSemanticDiagnostics(),
        ];

        if (diagnostics.length > 0) {
            const message = ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost());
            // 提供清晰的失败输出，便于定位问题
            // eslint-disable-next-line no-console
            console.error('\nTypeScript 诊断信息:\n');
            // eslint-disable-next-line no-console
            console.error(message);
        }

        expect(diagnostics.length).toBe(0);
    });
});
