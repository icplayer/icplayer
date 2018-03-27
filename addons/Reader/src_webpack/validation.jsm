/**
 *
 * @param model {{imagesList: string}}
 * @returns {{imagesList: string[] | Array | *, isValid: boolean}}
 */
export function validateModel (model) {
    let modelValidator = new ModelValidator();
    let validatedModel = modelValidator.validate(model, [
        ModelValidators.List("list", [
            ModelValidators.String("imageElement"),
        ]),
    ]);

    return validatedModel;
}