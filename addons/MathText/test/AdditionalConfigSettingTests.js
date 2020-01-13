TestCase("[MathText] setAdditionalConfigBasedOnType tests", {
    setUp: function () {
        this.presenter = AddonMathText_create();
    },

    'when type is text, isActivity and showEditor should be false': function(){
        this.presenter.setAdditionalConfigBasedOnType(this.presenter.TYPES_DEFINITIONS.TEXT);

        assertFalse(this.presenter.configuration.isActivity);
        assertFalse(this.presenter.configuration.showEditor);
    },

    'when type is editor, isActivity should be false and showEditor should be true': function(){
        this.presenter.setAdditionalConfigBasedOnType(this.presenter.TYPES_DEFINITIONS.EDITOR);

        assertFalse(this.presenter.configuration.isActivity);
        assertTrue(this.presenter.configuration.showEditor);
    },

    'when type is activity, isActivity and showEditor should be true': function(){
        this.presenter.setAdditionalConfigBasedOnType(this.presenter.TYPES_DEFINITIONS.ACTIVITY);

        assertTrue(this.presenter.configuration.isActivity);
        assertTrue(this.presenter.configuration.showEditor);
    }
});