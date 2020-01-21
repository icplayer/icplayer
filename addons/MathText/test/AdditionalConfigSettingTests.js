TestCase("[MathText] setAdditionalConfigBasedOnType tests", {
    setUp: function () {
        this.presenter = AddonMathText_create();
    },

    'test when type is text, isActivity and showEditor should be false': function(){
        var configuration = {};
        this.presenter.setAdditionalConfigBasedOnType(configuration, this.presenter.TYPES_DEFINITIONS.TEXT);

        assertFalse(configuration.isActivity);
        assertFalse(configuration.showEditor);
    },

    'test when type is editor, isActivity should be false and showEditor should be true': function(){
        var configuration = {};
        this.presenter.setAdditionalConfigBasedOnType(configuration, this.presenter.TYPES_DEFINITIONS.EDITOR);

        assertFalse(configuration.isActivity);
        assertTrue(configuration.showEditor);
    },

    'test when type is activity, isActivity and showEditor should be true': function(){
        var configuration = {};
        this.presenter.setAdditionalConfigBasedOnType(configuration, this.presenter.TYPES_DEFINITIONS.ACTIVITY);

        assertTrue(configuration.isActivity);
        assertTrue(configuration.showEditor);
    }
});