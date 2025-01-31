TestCase("[Writing Calculations] Validate model rows' alt texts tests", {

    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    validateExpectedValidResult: function (result) {
        assertTrue("Expected valid result. Result error code: " + result.errorCode + ".", result.isValid);
    },

    validateExpectedInValidResult: function (expectedErrorCode, result) {
        assertFalse("Expected invalid result. Result value: " + result.value + ".", result.isValid);
        assertEquals("Expected error code in result", expectedErrorCode, result.errorCode);
    },

    "test given model with correct number of rows' alt texts when executed validation and all rows are navigable then return object with isValid flag set to true": function () {
        const modelRowsAltTexts = [{AltText: "First row"}, {AltText: "Second row"}, {AltText: "Third row"}];
        this.presenter.rowsStatusesOfNavigabilityInAltTTSNavigation = [{rowIndex: -1, isNavigable: true}, {rowIndex: 0, isNavigable: true}, {rowIndex: 1, isNavigable: true}, {rowIndex: 2, isNavigable: true}];

        const result = this.presenter.validateRowsAltTexts(modelRowsAltTexts);

        this.validateExpectedValidResult(result);
    },

    "test given model with too many of rows' alt texts when executed validation and all rows are navigable then return object with isValid flag set to false": function () {
        const modelRowsAltTexts = [{AltText: "First row"}, {AltText: "Second row"}, {AltText: "Third row"}, {AltText: "Fourth row"}];
        this.presenter.rowsStatusesOfNavigabilityInAltTTSNavigation = [{rowIndex: -1, isNavigable: true}, {rowIndex: 0, isNavigable: true}, {rowIndex: 1, isNavigable: true}, {rowIndex: 2, isNavigable: true}];

        const result = this.presenter.validateRowsAltTexts(modelRowsAltTexts);

        this.validateExpectedInValidResult("RAT01", result);
    },

    "test given model with not enough rows' alt texts when executed validation and all rows are navigable then return object with isValid flag set to false": function () {
        const modelRowsAltTexts = [{AltText: "First row"}, {AltText: "Second row"}];
        this.presenter.rowsStatusesOfNavigabilityInAltTTSNavigation = [{rowIndex: -1, isNavigable: true}, {rowIndex: 0, isNavigable: true}, {rowIndex: 1, isNavigable: true}, {rowIndex: 2, isNavigable: true}];

        const result = this.presenter.validateRowsAltTexts(modelRowsAltTexts);

        this.validateExpectedInValidResult("RAT01", result);
    },

    "test given model with correct number of rows' alt texts when executed validation and not all rows are navigable then return object with isValid flag set to true": function () {
        const modelRowsAltTexts = [{AltText: "First row"}, {AltText: "Second row"}];
        this.presenter.rowsStatusesOfNavigabilityInAltTTSNavigation = [{rowIndex: -1, isNavigable: true}, {rowIndex: 0, isNavigable: true}, {rowIndex: 1, isNavigable: false}, {rowIndex: 2, isNavigable: true}];

        const result = this.presenter.validateRowsAltTexts(modelRowsAltTexts);

        this.validateExpectedValidResult(result);
    },

    "test given model with too many of rows' alt texts when executed validation and not all rows are navigable then return object with isValid flag set to false": function () {
        const modelRowsAltTexts = [{AltText: "First row"}, {AltText: "Second row"}, {AltText: "Third row"}];
        this.presenter.rowsStatusesOfNavigabilityInAltTTSNavigation = [{rowIndex: -1, isNavigable: true}, {rowIndex: 0, isNavigable: true}, {rowIndex: 1, isNavigable: false}, {rowIndex: 2, isNavigable: true}];

        const result = this.presenter.validateRowsAltTexts(modelRowsAltTexts);

        this.validateExpectedInValidResult("RAT01", result);
    },

    "test given model with not enough rows' alt texts when executed validation and not all rows are navigable then return object with isValid flag set to false": function () {
        const modelRowsAltTexts = [{AltText: "First row"}];
        this.presenter.rowsStatusesOfNavigabilityInAltTTSNavigation = [{rowIndex: -1, isNavigable: true}, {rowIndex: 0, isNavigable: true}, {rowIndex: 1, isNavigable: false}, {rowIndex: 2, isNavigable: true}];

        const result = this.presenter.validateRowsAltTexts(modelRowsAltTexts);

        this.validateExpectedInValidResult("RAT01", result);
    }
});
