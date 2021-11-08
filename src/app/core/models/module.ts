export class Module {
    moduleId: number;

    /**
     * fromJson
     */
    public static fromJson(object: any) {
        var module = new Module();
        module.moduleId = object['module_id'] ?? 0;

        return module;
    }

    /**
     * toJson
     */
    public toJson() {
        return {
            module_id: this.moduleId
        };
    }
}
