/**
 *
 * @param {string} imagesText
 */
function validateImagesList (imagesText) {
    let arrayOfLines = imagesText.match(/[^\r\n]+/g);

    return {
        isValid: true,
        lines: arrayOfLines || []
    };

}

/**
 *
 * @param model {{imagesList: string}}
 * @returns {{imagesList: string[] | Array | *, isValid: boolean}}
 */
export function validateModel (model) {
    return {
        imagesList: validateImagesList(model['imagesList']).lines,
        isValid: true
    }
}