TestCase("[Geometric Contruct] Model Validation tests", {
    setUp: function () {
        this.presenter = AddonGeometricConstruct_create();

        this.model = {
            "stroke color": "#000000",
            "fill color": "#00FF00",
            "Width": "100",
            "Height": "150"
        };
    },

    tearDown: function () {
    },

    'test given correct model when validateModel is called then return configuration with provided values': function () {
        let configuration = this.presenter.validateModel(this.model);

        assertEquals("#000000", configuration.strokeColor);
        assertEquals("#00FF00", configuration.fillColor);
        assertEquals(100, configuration.width);
        assertEquals(150, configuration.height);
    },

    'test given model with empty values when validateModel is called then return configuration with default values': function () {
        let model = {
            "stroke color": "",
            "fill color": "",
            "Width": "200",
            "Height": "300"
        }

        let configuration = this.presenter.validateModel(model);

        assertEquals("black", configuration.strokeColor);
        assertEquals("blue", configuration.fillColor);
        assertEquals(200, configuration.width);
        assertEquals(300, configuration.height);
    },


});
