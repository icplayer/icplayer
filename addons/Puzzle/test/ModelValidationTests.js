TestCase("[Puzzle] Model validation", {
    setUp: function () {
        this.presenter = AddonPuzzle_create();

        this.model = {
            "Is Visible": "True",
            "ID": 'Puzzle1',
        };
    },

    'test proper model': function () {
        const validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);
        assertFalse(validationResult.isErrorMode);
        assertFalse(validationResult.shouldCalcScore);

        assertEquals(4, validationResult.columns);
        assertEquals(4, validationResult.rows);

        assertEquals('Puzzle1', validationResult.addonID);
    },

    'test given model without isNotActivity value when validating then set isNotActivity to false': function () {
        const validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertFalse(validatedModel.isNotActivity);
    },

    'test given model with isNotActivity set to True when validating then set isNotActivity to true': function () {
        this.model["isNotActivity"] = "True";

        const validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertTrue(validatedModel.isNotActivity);
    },

    'test given model with isNotActivity set to value other than True when validating then set isNotActivity to false': function () {
        this.model["isNotActivity"] = "AA";

        const validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertFalse(validatedModel.isNotActivity);
    },
});

TestCase("[Puzzle] Dimensions validation", {
    setUp: function () {
        this.presenter = AddonPuzzle_create();
    },

    'test valid puzzle dimension': function () {

        assertEquals(6, this.presenter.validatePuzzleDimension(6));
    },

    'test puzzle dimension is invalid': function () {
        assertEquals(4, this.presenter.validatePuzzleDimension("puzzle"));
    },

    'test undefined puzzle dimension': function () {
        assertEquals(4, this.presenter.validatePuzzleDimension(undefined));
    },

    'test puzzle dimension is lower than minimum': function () {
        assertEquals(4, this.presenter.validatePuzzleDimension(0));
    },

    'test puzzle dimension is higher than maximum': function () {
        assertEquals(4, this.presenter.validatePuzzleDimension(12));
    }
});