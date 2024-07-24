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
            scoredisabled: "1;2",
            alternativePageTitles: [{
                alternativePageNumber: "",
                alternativePageName: "",
                alternativePageIsChapter: ""}]
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
    },

    'test alternativePageTitles with empty strings': function () {
        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
    },

    'test alternativePageTitles with proper value of strings': function () {
        this.model['alternativePageTitles'] = [{
                alternativePageNumber: "1",
                alternativePageName: "Test",
                alternativePageIsChapter: "True"
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        var list = validationResult['alternativePageTitles'];
        assertEquals(1, list[0].alternativePageNumber);
        assertEquals("Test", list[0].alternativePageName);
        assertEquals(true, list[0].alternativePageIsChapter);
    },

    'test alternativePageTitles with pageNumber as string not parsable to number': function () {
        this.model['alternativePageTitles'] = [{
                alternativePageNumber: "Invalid string",
                alternativePageName: "Test",
                alternativePageIsChapter: "True"
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isValid);
    },

    'test alternativePageTitles with only one with empty page number': function () {
        this.model['alternativePageTitles'] = [{
                alternativePageNumber: "",
                alternativePageName: "Test",
                alternativePageIsChapter: "True"
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
    },

    'test alternativePageTitles with more than one item with empty pageNumber': function () {
        this.model['alternativePageTitles'] = [{
                alternativePageNumber: "",
                alternativePageName: "Test",
                alternativePageIsChapter: false
        },{
                alternativePageNumber: "",
                alternativePageName: "Test 2",
                alternativePageIsChapter: true
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
    },

    'test alternativePageTitles with more than one item with proper pageNumber': function () {
        this.model['alternativePageTitles'] = [{
                alternativePageNumber: "1",
                alternativePageName: "Test",
                alternativePageIsChapter: false
        },{
                alternativePageNumber: "2",
                alternativePageName: "Test",
                alternativePageIsChapter: true
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
    },

    'test is weighted arithmetic mean empty': function () {
        this.model["isWeightedArithmeticMean"] = "";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals(false, validationResult.isWeightedArithmeticMean);
    },

    'test is weighted arithmetic mean checked': function () {
        this.model["isWeightedArithmeticMean"] = "True";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals(true, validationResult.isWeightedArithmeticMean);
    },

    'test is weighted arithmetic mean not checked': function () {
        this.model["isWeightedArithmeticMean"] = "False";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals(false, validationResult.isWeightedArithmeticMean);
    },

    'test is excludeUnvisitedPages not checked': function () {
        this.model["excludeUnvisitedPages"] = "False";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals(false, validationResult.isWeightedArithmeticMean);
    },

    'test is excludeUnvisitedPages checked': function () {
        this.model["excludeUnvisitedPages"] = "True";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isValid);
        assertEquals(false, validationResult.isWeightedArithmeticMean);
    },
});
