/** @jest-environment node */

// Run type-check using TypeScript Compiler API, equivalent to `tsc --noEmit`
import * as path from 'path';
import ts from 'typescript';

function parseTsConfig(tsconfigPath) {
    const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    if (configFile.error) {
        const message = ts.formatDiagnosticsWithColorAndContext([configFile.error], formatHost());
        throw new Error(`Failed to read tsconfig:\n${message}`);
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

describe('TypeScript typings validation', () => {
    test('tests/fixtures/typescript-test.ts should pass type-check (no diagnostics)', () => {
        const projectRoot = process.cwd();
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');

        const parsed = parseTsConfig(tsconfigPath);

        // Force no output (even if `declaration` is on); only type-check
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
            // Provide detailed diagnostics for debugging
            // eslint-disable-next-line no-console
            console.error('\nTypeScript diagnostics:\n');
            // eslint-disable-next-line no-console
            console.error(message);
        }

        expect(diagnostics.length).toBe(0);
    });
});
