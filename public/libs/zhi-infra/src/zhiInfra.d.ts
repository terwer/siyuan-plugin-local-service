import { NpmPackageManager } from "./lib/npmHelper";
/**
 * 基础设施
 */
declare class ZhiInfra {
    private readonly logger;
    private zhiAppNodeModulesPath;
    private zhiCoreNpmPath;
    private zhiNodeModulesPath;
    private npmManager;
    constructor(zhiCoreNpmPath?: string);
    /**
     * 修复 Mac 和 Linux 下面的 PATH 环境变量问题
     */
    fixPathEnv(): void;
    hackRequire(): Promise<void>;
    getNpmManager(): NpmPackageManager;
}
export default ZhiInfra;
//# sourceMappingURL=zhiInfra.d.ts.map