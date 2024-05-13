TestCase("[Geometric Contruct] Model Validation tests", {
    setUp: function () {
        this.presenter = AddonGeometricConstruct_create();

        this.model = {
            "stroke color": "#000000",
            "fill color": "#00FF00"
        };
    },

    tearDown: function () {
    },

    'test given correct model when validateModel is called then return configuration with provided values': function () {
        let configuration = this.presenter.validateModel(this.model);

        assertEquals("#000000", configuration.strokeColor);
        assertEquals("#00FF00", configuration.fillColor);
    },

    'test given model with empty values when validateModel is called then return configuration with default values': function () {
        let model = {
            "stroke color": "",
            "fill color": ""
        }

        let configuration = this.presenter.validateModel(model);

        assertEquals("black", configuration.strokeColor);
        assertEquals("blue", configuration.fillColor);
    },


});
