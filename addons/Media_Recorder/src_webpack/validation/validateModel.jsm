import {DefaultValues} from "./DefaultValues.jsm";
import {SupportedTypes} from "../configuration/SupportedTypes.jsm";

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
        ModelValidators.Enum("type", {
            values: Object.values(SupportedTypes),
            default: Object.values(SupportedTypes)[0]
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
}