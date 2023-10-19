/**
 * 封装一个用于执行 NPM 命令的工具类
 */
declare class NpmPackageManager {
    private logger;
    private zhiCoreNpmPath;
    private customCmd;
    /**
     * 构造函数，用于创建 NpmPackageManager 的实例。
     * @param zhiCoreNpmPath - Siyuan App 的 NPM 路径。
     */
    constructor(zhiCoreNpmPath: string);
    /**
     * 执行 NPM 命令
     *
     * @param subCommand - 要执行的 NPM 命令
     * @returns 执行结果的 Promise
     */
    npmCmd(subCommand: string): Promise<any>;
    /**
     * 获取 NPM 的版本号。
     * @returns NPM 版本号的 Promise。
     */
    npmVersion(): Promise<string>;
    /**
     * 安装 NPM 依赖
     *
     * @param moduleName - 可选的模块名，不传默认安装全量
     */
    npmInstall(moduleName?: string): Promise<void>;
    /**
     * 安装依赖并马上导入
     *
     * @param moduleName - 依赖名称
     * @returns 导入的模块
     */
    requireInstall(moduleName: string): Promise<any>;
    /**
     * 检测并初始化 Node
     */
    checkAndInitNode(): Promise<boolean>;
}
export { NpmPackageManager };
//# sourceMappingURL=npmHelper.d.ts.map