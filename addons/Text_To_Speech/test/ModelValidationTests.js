TestCase("[Text_To_Speech] Model validation tests", {
    setUp: function () {
        this.presenter = AddonText_To_Speech_create();

        this.model = {
            "ID": "Text_To_Speech1",
            "configuration": [{
                ID: "Text1",
                Area: "",
                Title: "Title text 1"
            }]
        }
    },

    'test proper model': function () {
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals("Text_To_Speech1", validatedModel.ID);
        assertEquals("Text1", validatedModel.addOnsConfiguration[0].id);
        assertEquals("main", validatedModel.addOnsConfiguration[0].area);
        assertEquals("Title text 1", validatedModel.addOnsConfiguration[0].title);
    },

    'test empty configuration' : function () {
        this.model["configuration"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);
    }
});
