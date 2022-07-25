TestCase("[Hierarchical Table Of Contents] Model validation", {
    setUp: function () {
        this.presenter = AddonHierarchical_Table_Of_Contents_create();

        this.model = {
            ID: "Hierarchical_Table_Of_Contents1",
            isValid: "True",
            IsVisible: "True",
            displayOnlyChapters: "false",
            expandDepth: "",
            height: "275",
            width: "300",
            titleLabel: "Table of Contents",
            langTag: "",
            showPages: "",
        };
    },

    'test given model with depth of expand empty when validating then sets depth of expand to 0': function () {
        this.model["expandDepth"] = "";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals('0', validationResult.expandDepth);
    },

    'test given model with depth of expand valid when validating then model has the correct value': function () {
        this.model["expandDepth"] = "1";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals('1', validationResult.expandDepth);
    },

    'test given model with depth of expand not numeric when validating then an error code is returned': function () {
        this.model["expandDepth"] = "a";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals('EXPAND_DEPTH_NOT_NUMERIC', validationResult.errorCode);
    }
});