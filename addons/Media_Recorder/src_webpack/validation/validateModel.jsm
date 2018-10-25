import {DefaultValues} from "./DefaultValues.jsm";

export function validateModel(model) {
    let modelValidator = new ModelValidator();

    return modelValidator.validate(model, [
        ModelValidators.DumbString("ID"),
        ModelValidators.Boolean("Is Visible"),
        ModelValidators.Integer("maxTime", {
            minValue: 0,
            maxValue: DefaultValues.MAX_TIME,
            default: DefaultValues.DEFAULT_MAX_TIME
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
        }),
        ModelValidators.Boolean("isResetRemovesRecording"),
        ModelValidators.Boolean("isShowedTimer"),
        ModelValidators.Boolean("isShowedDefaultRecordingButton")
    ]);
}