TestCase("[Hierarchical Lesson Report] Model validation", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();

        this.model = {
            "ID" : "Hierarchical_Lesson_Report1",
            "Is Visible": "True",
            checks: "True",
            checksLabel: "",
            errors: "True",
            errorsLabel: "",
            expandDepth: "",
            mistakes: "True",
            mistakesLabel: "",
            results: "True",
            resultsLabel: "",
            titleLabel: "",
            total: "True",
            totalLabel: "",
            classes: "",
            showpagescore: "True",
            showmaxscorefield: "True",
            scoredisabled: "1;2"
        };
    },

    'test depth of expand empty': function () {
        this.model["expandDepth"] = "";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals('0', validationResult.expandDepth);
    },

    'test depth of expand correct': function () {
        this.model["expandDepth"] = "1";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals('1', validationResult.expandDepth);
    },

    'test depth of expand not numeric': function () {
        this.model["expandDepth"] = "a";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals('EXPAND_DEPTH_NOT_NUMERIC', validationResult.errorCode);
    },

    'test class name started with number': function() {
        this.model["classes"] = "0_wrong_class_name";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("C01", validationResult.errorCode);
    },

    'test class name with illegal character': function() {
        this.model["classes"] = "class_$_name";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("C01", validationResult.errorCode);
    },

    'test classes in one line': function() {
        this.model["classes"] = "class another_class new_class dump";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("C02", validationResult.errorCode);
    },

    'test classes with empty row': function() {
        this.model["classes"] = "class\nanother_class\n\nnew_class dump";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("C01", validationResult.errorCode);
    },

    'test classes with empty last row': function() {
        this.model["classes"] = "class\nanother_class\nnew_class dump\n";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("C02", validationResult.errorCode);
    },

    'test disable score field with NaN value': function() {
        this.model["scoredisabled"] = "1;a;4";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("D01", validationResult.errorCode);
    },

    'test disable score field with empty value': function() {
        this.model["scoredisabled"] = "1;;";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("D01", validationResult.errorCode);
    },

    'test disable score field with empty last value': function() {
        this.model["scoredisabled"] = "1;4;";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("D01", validationResult.errorCode);
    },

    'test disable score field with semicolon': function() {
        this.model["scoredisabled"] = ";";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("D01", validationResult.errorCode);
    },

    'test disable score field lower then 1': function() {
        this.model["scoredisabled"] = "0;1;2";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("D02", validationResult.errorCode);
    },

    'test disable score field unique values': function() {
        this.model["scoredisabled"] = "1;1";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
        assertEquals("D03", validationResult.errorCode);
    }

});