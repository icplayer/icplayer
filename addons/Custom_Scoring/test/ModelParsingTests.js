TestCase("[Custom Scoring] Model parsing", {
    setUp: function () {
        this.presenter = AddonCustom_Scoring_create();
    },

    'test empty model': function () {
        var model = {
            ID: 'Custom_Scoring1'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertTrue(parsedModel.isValid);
        assertEquals(0, parsedModel.scoring.maxScore);
        assertEquals(0, parsedModel.scoring.score);
        assertEquals(0, parsedModel.scoring.errors);
        assertEquals(undefined, parsedModel.script);
        assertEquals('Custom_Scoring1', parsedModel.addonID);
    },

    'test invalid max score': function () {
        var model = {
            ID: 'Custom_Scoring1',
            'Script': 'presenter.setScore(0);',
            'Max Score': 'number'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertFalse(parsedModel.isValid);
        assertEquals('ERR_02', parsedModel.errorCode);
    },

    'test empty Max Score': function () {
        var model = {
            ID: 'Custom_Scoring1',
            'Script': 'presenter.setScore(0);'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertTrue(parsedModel.isValid);

        assertEquals('Custom_Scoring1', parsedModel.addonID);
        assertEquals('presenter.setScore(0);', parsedModel.script);
        assertEquals(0, parsedModel.scoring.maxScore);
        assertEquals(0, parsedModel.scoring.score);
        assertEquals(0, parsedModel.scoring.errors);
    },

    'test custom Max Score': function () {
        var model = {
            ID: 'Custom_Scoring1',
            'Script': 'presenter.setScore(0);',
            'Max Score': '5'
        };

        var parsedModel = this.presenter.parseModel(model);

        assertTrue(parsedModel.isValid);

        assertEquals('Custom_Scoring1', parsedModel.addonID);
        assertEquals('presenter.setScore(0);', parsedModel.script);
        assertEquals(5, parsedModel.scoring.maxScore);
        assertEquals(0, parsedModel.scoring.score);
        assertEquals(0, parsedModel.scoring.errors)
    }
});
