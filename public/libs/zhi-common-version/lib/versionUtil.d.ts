/**
 * 版本比较相关
 */
declare class VersionUtil {
    /**
     * Compare [semver](https://semver.org/) version strings
     * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
     *
     * @param v1 - First version to compare
     * @param v2 - Second version to compare
     * @returns boolean true if v1 is higher than v2
     */
    static greater(v1: string, v2: string): boolean;
    /**
     * Compare [semver](https://semver.org/) version strings
     * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
     *
     * @param v1 - First version to compare
     * @param v2 - Second version to compare
     * @returns boolean true if v1 is equal to v2
     */
    static equal(v1: string, v2: string): boolean;
    /**
     * Compare [semver](https://semver.org/) version strings
     * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
     *
     * @param v1 - First version to compare
     * @param v2 - Second version to compare
     * @returns boolean true if v1 is lesser than v2
     */
    static lesser(v1: string, v2: string): boolean;
}
export default VersionUtil;
