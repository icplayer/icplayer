TestCase("[ConnectingDots] Model upgrade", {
    setUp: function () {
        this.presenter = AddonConnectingDots_create();
        this.model = {
            "ID": "ConnectingDots1",
            "Is Visible": "True",
            "Is Tabindex Enabled": "False",
            "Dots": "[25,50]\n[150,25]\n[200,100]\n[100,125]",
            "Indexes": "",
            "Is activity": "True",
            "Time": "",
            "Image A": "",
            "Image B": "",
            "Is disabled": ""
        };
    },

    'test given model without "Show all answers in gradual show answers mode" when upgrading model, "Show all answers in gradual show answers mode" will be added with default value': function () {
        let validatedModel = this.presenter.upgradeModel(this.model);
        
        assertFalse(validatedModel["Show all answers in gradual show answers mode"]);
    },

    'test given model with "Show all answers in gradual show answers mode" when upgrading model, "Show all answers in gradual show answers mode" will be not be changed': function () {
        this.model["Show all answers in gradual show answers mode"] = true;

        let validatedModel = this.presenter.upgradeModel(this.model);

        assertTrue(validatedModel["Show all answers in gradual show answers mode"]);
    },
});
