TestCase("[Magic Boxes] Model validation test", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test proper config': function () {
        var grid = "sofiaw\n"
                 + "karuti\n"
                 + "osloem\n"
                 + "pwilno\n"
                 + "jkrzym\n"
                 + "ezudav";
        var model = {
            Grid: grid,
            Answers: "Sofia, Skopje, Oslo\n"
                   + "Ateny, Rzym, Wilno\n"
                   + "Vaduz"
        };
        var gridElements = [
            ['s', 'o', 'f', 'i', 'a', 'w'],
            ['k', 'a', 'r', 'u', 't', 'i'],
            ['o', 's', 'l', 'o', 'e', 'm'],
            ['p', 'w', 'i', 'l', 'n', 'o'],
            ['j', 'k', 'r', 'z', 'y', 'm'],
            ['e', 'z', 'u', 'd', 'a', 'v'],
        ];

        var validationResult = this.presenter.validateModel(model);

        assertFalse(validationResult.isError);

        assertArray(validationResult.gridElements);
        assertEquals(gridElements, validationResult.gridElements);
        assertEquals(6, validationResult.rows);
        assertEquals(6, validationResult.columns);

        assertArray(validationResult.answers);
        assertEquals(['Sofia', 'Skopje', 'Oslo', 'Ateny', 'Rzym', 'Wilno', 'Vaduz'], validationResult.answers);
        assertEquals(7, validationResult.answers.length);
    },

    'test grid error': function () {
        var grid = "sofiaw\n"
                 + "karuti\n"
                 + "osloem\n"
                 + "pwiln\n"
                 + "jkrzym\n"
                 + "ezudav";

        var model = {
            Grid: grid,
            Answers: "Sofia, Skopje, Oslo\n"
                   + "Ateny, Rzym, Wilno\n"
                   + "Vaduz"
        };

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.COLUMNS, validationResult.errorMessage);
    },

    'test answers error': function () {
        var grid = "sofiaw\n"
                 + "karuti\n"
                 + "osloem\n"
                 + "pwilno\n"
                 + "jkrzym\n"
                 + "ezudav";

        var model = {
            Grid: grid,
            Answers: ""
        };

        var validationResult = this.presenter.validateModel(model);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ANSWERS_NOT_PROVIDED, validationResult.errorMessage);
    },

    'test given model with langTag when validateModel is called then set lang tag value correctly': function () {
        var grid = "sofiaw\n"
                 + "karuti\n"
                 + "osloem\n"
                 + "pwilno\n"
                 + "jkrzym\n"
                 + "ezudav";

        var model = {
            Grid: grid,
            Answers: "Sofia, Skopje, Oslo\n"
                   + "Ateny, Rzym, Wilno\n"
                   + "Vaduz",
            langAttribute: "en"
        };

        var actualValue = this.presenter.validateModel(model).langTag;

        assertEquals("en", actualValue);
    },
});
