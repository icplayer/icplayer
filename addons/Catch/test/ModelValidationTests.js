TestCase("[Catch] Model validation", {
    setUp: function () {
        this.presenter = AddonCatch_create();
        this.model = {
            'Test' : 'hello'
        };
    },

    'test validate correct test model' : function() {
        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isValid);
        assertEquals('hello', validated.test);
    }

});
