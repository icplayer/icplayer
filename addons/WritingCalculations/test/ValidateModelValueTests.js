TestCase("[Writing Calculations] Validate model value tests", {

    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    "test given model value with only one digit allowed without gaps when executing validateModelValue then return valid elements data": function () {
        const modelValue = this.getNoDigitModelValue();
        this.presenter.multisigns = false;
        const expected = this.getExpectedElementsDataForNoDigitModel();

        const result = this.presenter.validateModelValue(modelValue);

        assertTrue(result.isValid);
        assertEquals(expected, result.value);
    },

    "test given model value with many digit allowed without gaps when executing validateModelValue then return valid elements data": function () {
        const modelValue = this.getNoDigitModelValue();
        this.presenter.multisigns = true;
        const expected = this.getExpectedElementsDataForNoDigitModel();

        const result = this.presenter.validateModelValue(modelValue);

        assertTrue(result.isValid);
        assertEquals(expected, result.value);
    },

    "test given model value with only one digit allowed with one digit gaps when executing validateModelValue then return valid elements data": function () {
        const modelValue = this.getOneDigitModelValue();
        this.presenter.multisigns = false;
        const expected = this.getExpectedElementsDataForOneDigitModel();

        const result = this.presenter.validateModelValue(modelValue);

        assertTrue(result.isValid);
        assertEquals(expected, result.value);
    },

    "test given model value with many digits allowed with one digit gaps when executing validateModelValue then return valid elements data": function () {
        const modelValue = this.getOneDigitModelValue();
        this.presenter.multisigns = true;
        const expected = this.getExpectedElementsDataForOneDigitModel();

        const result = this.presenter.validateModelValue(modelValue);

        assertTrue(result.isValid);
        assertEquals(expected, result.value);
    },

    "test given model value with one digit allowed with many digits gaps when executing validateModelValue then return error V04": function () {
        const modelValue = this.getManyDigitsModelValue();
        this.presenter.multisigns = false;

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V04", result.errorCode);
    },

    "test given model value with many digits allowed with many digits gaps when executing validateModelValue then return valid elements data": function () {
        const modelValue = this.getManyDigitsModelValue();
        this.presenter.multisigns = true;
        const expected = this.getExpectedElementsDataForManyDigitsModel();

        const result = this.presenter.validateModelValue(modelValue);

        assertTrue(result.isValid);
        assertEquals(expected, result.value);
    },

    "test given model value without ending bracket when executing validateModelValue then return error V01": function () {
        const modelValue = this.createPreFilledInModelValue("_[12[6]");
        this.presenter.multisigns = true;

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V01", result.errorCode);
    },

    "test given model value without ending bracket at the end when executing validateModelValue then return error V01": function () {
        const modelValue = this.createPreFilledInModelValue("_[12][6");
        this.presenter.multisigns = true;

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V01", result.errorCode);
    },

    "test given model value with empty gap when executing validateModelValue then return error V03": function () {
        const modelValue = this.createPreFilledInModelValue("_[][6]");

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V03", result.errorCode);
    },

    "test given model value without opening bracket when executing validateModelValue then return error V01": function () {
        const modelValue = this.createPreFilledInModelValue("_2][6]");

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V02", result.errorCode);
    },

    "test given model multi digits value without opening bracket when executing validateModelValue then return error V01": function () {
        const modelValue = this.createPreFilledInModelValue("_12][6]");

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V02", result.errorCode);
    },

    getNoDigitModelValue: function () {
        return this.createPreFilledInModelValue("_76");
    },

    getExpectedElementsDataForNoDigitModel: function () {
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
        let lastLine = [
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
        let lastLine = [
            this.createElementData(4, 0, "_", false),
            this.createElementData(4, 1, "[12]", true),
            this.createElementData(4, 2, "[622]", true)
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
        let result = [];
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
