import { JSONSchemaType } from "ajv";
/**
 * Json 验证相关
 */
declare class JsonValidateUtil {
    private static ajv;
    static validateJson<T>(schema: JSONSchemaType<T>, data: T): {
        valid: boolean;
        error?: string;
    };
    static validateObjectSchema(schemaObject: object, dataObject: object): {
        valid: boolean;
        error?: string;
    };
}
export default JsonValidateUtil;
