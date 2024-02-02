TestCase("[Slider] Model upgrade", {
    setUp: function () {
        this.presenter = AddonSlider_create();
        this.model = {
            "ID": "Slider1",
        };
    },

    'test given model without "langAttribute" when upgrading model, "langAttribute" will be added with default value': function () {
        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("", validatedModel["langAttribute"]);
    },

    'test given model with "langAttribute" when upgrading model, "langAttribute" will be not be changed': function () {
        this.model["langAttribute"] = "pl";

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("pl", validatedModel["langAttribute"]);
    },

    'test given model without "Alternative texts" when upgrading model, "Alternative texts" will be added with default value': function () {
        const defaultValue = [{
            "Alternative text": "",
            "Step number": ""
        }];

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals(defaultValue, validatedModel["Alternative texts"]);
    },

    'test given model with "Alternative texts" when upgrading model, "Alternative texts" will be not be changed': function () {
        const previousValue = [{
            "Alternative text": "Some text",
            "Step number": "4"
        }];
        this.model["Alternative texts"] = [...previousValue];

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals(previousValue, validatedModel["Alternative texts"]);
    },

    'test given model without "speechTexts" when upgrading model, "speechTexts" will be added with default value': function () {
        const defaultValue = {
            Step: {Step: "Step"}
        };

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals(defaultValue, validatedModel["speechTexts"]);
    },

    'test given model with "speechTexts" when upgrading model, "speechTexts" will be not be changed': function () {
        const previousValue = {
            Step: {Step: "Step by step"}
        };
        this.model["speechTexts"] = {...previousValue};

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals(previousValue, validatedModel["speechTexts"]);
    },

    'test given model without "StepwiseModeBarAlwaysVisible" when upgrading model, "StepwiseModeBarAlwaysVisible" will be added with default value': function () {
        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("False", validatedModel["StepwiseModeBarAlwaysVisible"]);
    },

    'test given model with "StepwiseModeBarAlwaysVisible" when upgrading model, "StepwiseModeBarAlwaysVisible" will be not be changed': function () {
        this.model["StepwiseModeBarAlwaysVisible"] = "True";

        let validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("True", validatedModel["StepwiseModeBarAlwaysVisible"]);
    }
});
