var setUpUtils = function () {};

setUpUtils.getWordToken = function (value) {
    return {
        "value": value,
        "type": "word"
    };
};

setUpUtils.getNewLineToken = function () {
    return {
        "type": "new_line"
    };
};

setUpUtils.getSelectableToken = function (value, colorID) {
    return {
        "type": "selectable",
        "value": value,
        "color": colorID
    };
};

setUpUtils.getSpaceToken = function () {
    return {
        type: "space"
    };
};

setUpUtils.getIntruderToken = function (value) {
    return {
        "type": "intruder",
        "value": value
    };
};
