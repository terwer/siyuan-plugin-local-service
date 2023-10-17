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
     * 自定义执行系统命令
     *
     * 示例：
     * ```
     * await customCmd.executeCommand("./node_modules/.bin/nuxt", ["preview"], { shell: true, cwd: '/Users/terwer/Downloads/nu' })
     * await customCmd.executeCommand("node", ["./server/index.mjs"], { cwd: '/Users/terwer/Downloads/nu' })
     * ```
     *
     * @param command - 命令
     * @param args - 参数
     * @param options - 选项
     */
    executeCommand(command: string, args: string[], options?: {}): Promise<unknown>;
    /**
     * 获取系统的 Node 版本
     */
    getSystemNodeVersion(): Promise<unknown>;
    /**
     * 获取 Electron 的 Node 版本
     */
    getElectronNodeVersion(): Promise<any>;
}
export { CustomCmd };
//# sourceMappingURL=customCmd.d.ts.map