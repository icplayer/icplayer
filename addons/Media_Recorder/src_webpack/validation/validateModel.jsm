import {DefaultValues} from "./DefaultValues.jsm";
import {SupportedTypes} from "../SupportedTypes.jsm";

export function validateModel(model) {
    let modelValidator = new ModelValidator();

    let validatedModel = modelValidator.validate(model, [
        ModelValidators.DumbString("ID"),
        ModelValidators.Boolean("Is Visible"),
        ModelValidators.Integer("maxTime", {
            minValue: 0,
            default: DefaultValues.MAX_TIME
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

    return validatedModel;
}