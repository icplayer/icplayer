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
        const modelValue = (
            "_72\n" +
            "+54\n" +
            "===\n" +
            "_[12[6]"
        );
        this.presenter.multisigns = true;

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V01", result.errorCode);
    },

    "test given model value without ending bracket at the end when executing validateModelValue then return error V01": function () {
        const modelValue = (
            "_72\n" +
            "+54\n" +
            "===\n" +
            "_[12][6"
        );
        this.presenter.multisigns = true;

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V01", result.errorCode);
    },

    "test given model value with empty gap when executing validateModelValue then return error V03": function () {
        const modelValue = (
            "_32\n" +
            "+44\n" +
            "===\n" +
            "_[][6]"
        );

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V03", result.errorCode);
    },

    "test given model value without opening bracket when executing validateModelValue then return error V01": function () {
        const modelValue = (
            "_72\n" +
            "+54\n" +
            "===\n" +
            "_2][6]"
        );

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V02", result.errorCode);
    },

    "test given model multi digits value without opening bracket when executing validateModelValue then return error V01": function () {
        const modelValue = (
            "_72\n" +
            "+54\n" +
            "===\n" +
            "_12][6]"
        );

        const result = this.presenter.validateModelValue(modelValue);

        assertFalse(result.isValid);
        assertEquals("V02", result.errorCode);
    },

    getNoDigitModelValue: function () {
        return (
            "_42\n" +
            "+34\n" +
            "===\n" +
            "_76"
        );
    },

    getExpectedElementsDataForNoDigitModel: function () {
        return [
            [this.createData("_"), this.createData("4"), this.createData("2")],
            [this.createData("+"), this.createData("3"), this.createData("4")],
            [this.createData("="), this.createData("="), this.createData("=")],
            [this.createData("_"), this.createData("7"), this.createData("6")],
        ]
    },

    getOneDigitModelValue: function () {
        return (
            "_42\n" +
            "+34\n" +
            "===\n" +
            "_[7][6]"
        );
    },

    getExpectedElementsDataForOneDigitModel: function () {
        return [
            [this.createData("_"), this.createData("4"), this.createData("2")],
            [this.createData("+"), this.createData("3"), this.createData("4")],
            [this.createData("="), this.createData("="), this.createData("=")],
            [this.createData("_"), this.createData("[7]", 3, 1, 7), this.createData("[6]", 3, 2, 6)],
        ]
    },

    getManyDigitsModelValue: function () {
        return (
            "_72\n" +
            "+54\n" +
            "===\n" +
            "_[12][622]"
        );
    },

    getExpectedElementsDataForManyDigitsModel: function () {
        return [
            [this.createData("_"), this.createData("7"), this.createData("2")],
            [this.createData("+"), this.createData("5"), this.createData("4")],
            [this.createData("="), this.createData("="), this.createData("=")],
            [this.createData("_"), this.createData("[12]", 3, 1, 12), this.createData("[622]", 3, 2, 622)],
        ]
    },

    createData: function (elementValue, rowIndex, cellIndex, value) {
        let result = {
            elementValue: elementValue,
        }
        if (rowIndex !== undefined || cellIndex !== undefined || value !== undefined) {
            result.rowIndex = rowIndex;
            result.cellIndex = cellIndex;
            result.value = value;
        }
        return result
    },
});
