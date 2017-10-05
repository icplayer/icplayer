TestCase("[Hierarchical Lesson Report] Model upgrading", {
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

    'test if model will be upgraded with alternative pages': function () {
        this.model = this.presenter.upgradeModel(this.model);

        var result = this.model['alternativePageTitles'];

        assertEquals(1, result.length);
        assertEquals("", result[0].alternativePageNumber);
        assertEquals("", result[0].alternativePageName);
        assertEquals("false", result[0].alternativePageIsChapter);
    },

    'test model should not be upgraded if alternative pages property already exists': function () {
        var expectedValue = [{
            alternativePageNumber: "1",
            alternativePageName: "Name",
            alternativePageIsChapter: false
        }];

        this.model['alternativePageTitles'] = expectedValue;

        this.model = this.presenter.upgradeModel(this.model);

        assertEquals(expectedValue, this.model['alternativePageTitles']);
    }
});