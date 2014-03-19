TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.model = {
            'Areas' : '55; 150; 255 200 255 255',
            'Tolerance' : '50',
            'DefaultFillingColor' : ''
        };
        this.presenter.configuration = {
            'tolerance' : 50
        };
    },

    'test compareColors true': function () {
        var compareResult = this.presenter.compareArrays([255, 255, 255, 255], [255, 255, 255, 255]);
        assertEquals(true, compareResult);
    },

    'test compareColors false': function () {
        var compareResult = this.presenter.compareArrays([255, 255, 255, 255], [250, 154, 200, 250]);
        assertEquals(false, compareResult);
    },

    'test validate areas wrong color format' : function() {
        this.model.Areas = '55; 150; 255 200 255';
        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isError);
        assertEquals('E01', validated.errorCode);
    },

    'test validate areas proper color format' : function() {
        var validated = this.presenter.validateModel(this.model);
        assertEquals(false, validated.isError);
        assertEquals([255, 200, 255, 255], validated.areas[0].colorToFill);
    },

    'test validate areas too few arguments' : function() {
        this.model.Areas = '55; 150';
        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isError);
        assertEquals('E03', validated.errorCode);
    },

    'test validate areas when last param (color to be filled) is blank will set it to default' : function() {
        this.model.Areas = '55; 150; 255 200 255 255';
        var validated = this.presenter.validateModel(this.model);
        assertEquals(false, validated.isError);
    },

    'test when DefaultFillingColor is empty, then its auto set to red' : function() {
        var expectedColor = [255, 100, 100, 255],
            validated = this.presenter.validateModel(this.model);

        assertEquals(expectedColor, validated.defaultFillingColor);
    }

});