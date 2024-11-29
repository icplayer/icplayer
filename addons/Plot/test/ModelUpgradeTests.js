TestCase("[Plot] Model upgrade", {
    setUp: function () {
        this.presenter = AddonPlot_create();
        this.model = {
            "ID": "ID",
            "Expressions": [{"id": "0"}]
        };
    },

    'test given model without "Expressions" when upgrading model, will not cause error': function () {
        this.model["Expressions"] = [];

        this.presenter.upgradeModel(this.model);
    },

    'test given model without "mark at length" in "Expressions" when upgrading model, "mark at length" will be added with default value': function () {
        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("50", validatedModel["Expressions"][0]["mark at length"]);
    },

    'test given model with empty "mark at length" in "Expressions" when upgrading model, "mark at length" will be added with default value': function () {
        this.model["Expressions"][0]["mark at length"] = "";

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("50", validatedModel["Expressions"][0]["mark at length"]);
    },

    'test given model with "mark at length" in "Expressions" when upgrading model, "mark at length" will not be changed': function () {
        this.model["Expressions"][0]["mark at length"] = "60,43";

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("60,43", validatedModel["Expressions"][0]["mark at length"]);
    },

    'test given model without "Check marks" when upgrading model, "Check marks" will be added with first value': function () {
        const validatedModel = this.presenter.upgradeModel(this.model);
        
        assertEquals("No", validatedModel["Check marks"]);
    },

    'test given model with "Check marks" when upgrading model, "Check marks" will not be changed': function () {
        this.model["Check marks"] = "One mark";

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("One mark", upgradedModel["Check marks"]);
    },

    'test given model without "Correct marks HTML" when upgrading model, "Correct marks HTML" will be added with default value': function () {
        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("&#10004;", validatedModel["Correct marks HTML"]);
    },

    'test given model with empty "Correct marks HTML" when upgrading model, "Correct marks HTML" will be added with default value': function () {
        this.model["Correct marks HTML"] = "";

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("&#10004;", validatedModel["Correct marks HTML"]);
    },

    'test given model with "Correct marks HTML" when upgrading model, "Correct marks HTML" will not be changed': function () {
        this.model["Correct marks HTML"] = "AA";

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("AA", validatedModel["Correct marks HTML"]);
    },

    'test given model without "Error marks HTML" when upgrading model, "Error marks HTML" will be added with default value': function () {
        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("&#10006;", validatedModel["Error marks HTML"]);
    },

    'test given model with empty "Error marks HTML" when upgrading model, "Error marks HTML" will be added with default value': function () {
        this.model["Error marks HTML"] = "";

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("&#10006;", validatedModel["Error marks HTML"]);
    },

    'test given model with "Error marks HTML" when upgrading model, "Error marks HTML" will not be changed': function () {
        this.model["Error marks HTML"] = "AA";

        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("AA", validatedModel["Error marks HTML"]);
    },

    'test given model without "Y axis values position" when upgrading model, "Y axis values position" will be added without value': function () {
        const validatedModel = this.presenter.upgradeModel(this.model);

        assertEquals("", validatedModel["Y axis values position"]);
    },

    'test given model with "Y axis values position" when upgrading model, "Y axis values position" will not be changed': function () {
        this.model["Y axis values position"] = "-2";

        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("-2", upgradedModel["Y axis values position"]);
    },
});
