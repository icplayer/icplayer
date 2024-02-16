TestCase("[Writing Calculations] Validate model value tests", {

    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
        this.enableMultiSigns(false);
    },

    "test given model value with only one digit allowed without empty boxes when executing validateModelValue then return valid elements data": function () {
        const modelValue = this.getModelValueWithoutEmptyGaps();
        const expected = this.getExpectedElementsDataForModelValueWithoutEmptyGaps();

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedValidResult(expected, result);
    },

    "test given model value with many digit allowed without empty boxes when executing validateModelValue then return valid elements data": function () {
        this.enableMultiSigns(true);
        const modelValue = this.getModelValueWithoutEmptyGaps();
        const expected = this.getExpectedElementsDataForModelValueWithoutEmptyGaps();

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedValidResult(expected, result);
    },

    "test given model value with only one digit allowed with one empty box when executing validateModelValue then return valid elements data": function () {
        const modelValue = this.getOneDigitModelValue();
        const expected = this.getExpectedElementsDataForOneDigitModel();

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedValidResult(expected, result);
    },

    "test given model value with many digits allowed with one empty box when executing validateModelValue then return valid elements data": function () {
        this.enableMultiSigns(true);
        const modelValue = this.getOneDigitModelValue();
        const expected = this.getExpectedElementsDataForOneDigitModel();

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedValidResult(expected, result);
    },

    "test given model value with one digit allowed with many empty boxes when executing validateModelValue then return error V04": function () {
        const modelValue = this.getManyDigitsModelValue();

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V04", result);
    },

    "test given model value with many digits allowed with many empty boxes when executing validateModelValue then return valid elements data": function () {
        this.enableMultiSigns(true);
        const modelValue = this.getManyDigitsModelValue();
        const expected = this.getExpectedElementsDataForManyDigitsModel();

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedValidResult(expected, result);
    },

    "test given model value with help box with letter when executing validateModelValue then return error V05": function () {
        const modelValue = this.createPreFilledInModelValue("_[a][6]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V05", result);
    },

    "test given model value without ending square bracket when executing validateModelValue then return error V01": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_[12[6]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V01", result);
    },

    "test given model value without ending square bracket at the end when executing validateModelValue then return error V01": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_[12][6");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V01", result);
    },

    "test given model value with empty box without value when executing validateModelValue then return error V03": function () {
        const modelValue = this.createPreFilledInModelValue("_[][6]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V03", result);
    },

    "test given model value without opening square bracket when executing validateModelValue then return error V01": function () {
        const modelValue = this.createPreFilledInModelValue("_2][6]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V02", result);
    },

    "test given model multi digits value without opening square bracket when executing validateModelValue then return error V01": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_12][6]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V02", result);
    },

    "test given model value with every valid help box template when executing validateModelValue then valid elements data": function () {
        const modelValue = this.getEveryValidHelpBoxModelValue();
        const expected = this.getExpectedElementsDataForEveryValidHelpBoxModel();

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedValidResult(expected, result);
    },

    "test given model value with help box with letter when executing validateModelValue then return error V08": function () {
        const modelValue = this.createPreFilledInModelValue("_{a}{6}");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V08", result);
    },

    "test given model value without ending curly bracket when executing validateModelValue then return error V06": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_{12{6}");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V06", result);
    },

    "test given model value without ending curly bracket at the end when executing validateModelValue then return error V06": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_{12}{6");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V06", result);
    },

    "test given model value without opening curly bracket when executing validateModelValue then return error V07": function () {
        const modelValue = this.createPreFilledInModelValue("_2}{6}");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V07", result);
    },

    "test given model multi digits value without opening curly bracket when executing validateModelValue then return error V07": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_12}{6}");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V07", result);
    },

    "test given model value with mixed curly bracket v01 with square brackets when executing validateModelValue then return error V08": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_{1[}6]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V08", result);
    },

    "test given model value with mixed curly bracket v02 with square brackets when executing validateModelValue then return error V02": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_{1[]}6]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V02", result);
    },

    "test given model value with mixed curly bracket v03 with square brackets when executing validateModelValue then return error V05": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_[1{]6}");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V05", result);
    },

    "test given model value with mixed curly bracket v04 with square brackets when executing validateModelValue then return error V07": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_[1{}]6}");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V07", result);
    },

    "test given model value with mixed curly bracket v05 with square brackets when executing validateModelValue then return error V08": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_{[1]}");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V08", result);
    },

    "test given model value with mixed curly bracket v06 with square brackets when executing validateModelValue then return error V05": function () {
        this.enableMultiSigns(true);
        const modelValue = this.createPreFilledInModelValue("_[{1}]");

        const result = this.presenter.validateModelValue(modelValue);

        this.validateExpectedInValidResult("V05", result);
    },

    validateExpectedValidResult: function (expectedValue, result) {
        assertTrue("Expected valid result. Result error code: " + result.errorCode + ".", result.isValid);
        assertEquals("Expected value in result", expectedValue, result.value);
    },

    validateExpectedInValidResult: function (expectedErrorCode, result) {
        assertFalse("Expected invalid result. Result value: " + result.value + ".", result.isValid);
        assertEquals("Expected error code in result", expectedErrorCode, result.errorCode);
    },

    enableMultiSigns: function (enable) {
        this.presenter.multisigns = enable;
    },

    getModelValueWithoutEmptyGaps: function () {
        return this.createPreFilledInModelValue("_76");
    },

    getExpectedElementsDataForModelValueWithoutEmptyGaps: function () {
        let lastLine = [
            this.createElementData(4, 0, "_", false),
            this.createElementData(4, 0, "7", false),
            this.createElementData(4, 0, "6", false)
        ];
        return this.createPreFilledInExpectedElementsData(lastLine);
    },

    getOneDigitModelValue: function () {
        return this.createPreFilledInModelValue("_[7][6]");
    },

    getExpectedElementsDataForOneDigitModel: function () {
        const lastLine = [
            this.createElementData(4, 0, "_", false),
            this.createElementData(4, 1, "[7]", true),
            this.createElementData(4, 2, "[6]", true)
        ];
        return this.createPreFilledInExpectedElementsData(lastLine);
    },

    getManyDigitsModelValue: function () {
        return this.createPreFilledInModelValue("_[12][622]");
    },

    getExpectedElementsDataForManyDigitsModel: function () {
        const lastLine = [
            this.createElementData(4, 0, "_", false),
            this.createElementData(4, 1, "[12]", true),
            this.createElementData(4, 2, "[622]", true)
        ];
        return this.createPreFilledInExpectedElementsData(lastLine);
    },

    getEveryValidHelpBoxModelValue: function () {
        return this.createPreFilledInModelValue("{}{1}{123}");
    },

    getExpectedElementsDataForEveryValidHelpBoxModel: function () {
        const lastLine = [
            this.createElementData(4, 1, "{}", true),
            this.createElementData(4, 2, "{1}", true),
            this.createElementData(4, 3, "{123}", true),
        ];
        return this.createPreFilledInExpectedElementsData(lastLine);
    },

    createPreFilledInModelValue: function (lastLine) {
        return (
            "_42\n" +
            "+34\n" +
            "===\n" +
            lastLine
        );
    },

    createPreFilledInExpectedElementsData: function (lastLine) {
        const values = [["_", "4", "2"], ["+", "3", "4"], ["=", "=", "="]];
        const result = [];
        for (let i = 0; i < values.length; i++) {
            let row = [];
            let rowValues = values[i];
            for (let j = 0; j < rowValues.length; j++) {
                row.push(this.createElementData(i + 1, 0, rowValues[j], false));
            }
            result.push(row);
        }
        result.push(lastLine);
        return result;
    },

    createElementData: function (rowIndex, cellIndex, elementValue, isVisiblePosition) {
        return this.presenter.createElementData(rowIndex, cellIndex, elementValue, isVisiblePosition);
    },
});
