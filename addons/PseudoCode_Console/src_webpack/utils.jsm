function inRange(value, min, max) {
    return (value <= max) & (value >= min);
}

/**
 * Check if string contains only letters
 * @param {String} c
 * @returns {boolean}
 */
export function isLetter (c) {
    for (let i = 0; i < c.length; i++) {
        if (!_isLetter(c.charCodeAt(i))) {
            return false;
        }
    }

    return true;
}

/**
 * Check if string contains only digits
 * @param {String} c
 * @returns {boolean}
 */
export function isDigit (c) {
    for (let i = 0; i < c.length; i++) {
        if (!_isDigit(c.charCodeAt(i))) {
            return false;
        }
    }

    return true;
}

function _isLetter (character) {
    return inRange(character, 65, 90) || inRange(character, 97, 122) || inRange(character, 192, 687) || inRange(character, 900, 1159) || // latin letters
           inRange(character, 1162, 1315) || inRange(character, 1329, 1366) || inRange(character, 1377, 1415) || // cyrillic letters
           inRange(character, 1425, 1536) || inRange(character, 1569, 1610) || // arabic letters
           inRange(character, 0x3400, 0x9FFF) || inRange(character, 0x0620, 0x063F) || inRange(character, 0x0641, 0x064A); //chinese and japanese letters
}

function _isDigit (d) {
    return inRange(d, 0x0030, 0x0039) //standard european digits
        || inRange(d, 0x0660, 0x0669) || inRange(d, 0x06F0, 0x06F9) // arabic digits
        || inRange(d, 0x1040, 0x108F) || inRange(d, 0x5344, 0x5345) // chinese and japanese digits
        || d === 0x3007 || d === 0x5341 || d === 0x4E00 || d === 0x4E8C || d === 0x4E09 || d === 0x56DB
        || d === 0x4E94 || d === 0x0516D || d === 0x4E03 || d === 0x516B || d === 0x4E5D || d === 0x5341
        || d === 0x767E || d === 0x5343 || d === 0x4E07 || d === 0x842C || d === 0x5104 || d === 0x4EBF || d === 0x5146;
}