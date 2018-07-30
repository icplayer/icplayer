export function validateModel(model, DEFAULT_VALUES) {
    let modelValidator = new ModelValidator();

    let validatedModel = modelValidator.validate(model, [
        ModelValidators.DumbString("ID"),
        ModelValidators.Boolean("Is Visible"),
        ModelValidators.Integer("maxTime", {
            minValue: 0,
            default: DEFAULT_VALUES.MAX_TIME
        }),
        ModelValidators.Enum("type", {
            values: Object.values(DEFAULT_VALUES.SUPPORTED_TYPES),
            default: Object.values(DEFAULT_VALUES.SUPPORTED_TYPES)[0]
        }),
        ModelValidators.String("defaultRecording", {
            trim: true,
            default: ""
        }),
        ModelValidators.String("startRecordingSound", {
            trim: true,
            default: ""
        }),
        ModelValidators.String("stopRecordingSound", {
            trim: true,
            default: ""
        })
    ]);

    return validatedModel;
}