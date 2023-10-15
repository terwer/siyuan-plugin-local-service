/**
 * 执行命令
 */
declare class CustomCmd {
    /**
     * 使用 Electron 自带的 node 运行命令
     *
     * https://github.com/UniBO-PRISMLab/wam/issues/26#issuecomment-1456204046
     * https://github.com/nodejs/help/issues/3885
     * https://github.com/npm/pacote
     *
     * 示例：
     * ```
     * await customCmd.executeCommandWithBundledNode("./node_modules/.bin/next", ["-v"], "/Users/terwer/Downloads/n")
     * ```
     *
     * @param command - 命令
     * @param args - 参数
     * @param cwd - 运行目录，默认 process.cwd
     */
    executeCommandWithBundledNodeAsync(command: string, args?: string[], cwd?: string): Promise<{
        status: boolean;
        code: number;
        msg: string;
    }>;
    /**
     * 获取 Electron 的 Node 版本
     */
    getElectronNodeVersion(): Promise<any>;
}
export { CustomCmd };
//# sourceMappingURL=customCmd.d.ts.map