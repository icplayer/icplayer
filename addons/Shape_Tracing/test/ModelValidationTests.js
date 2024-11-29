TestCase("[Shape_Tracing] Model validation", {
    setUp: function () {
        this.presenter = AddonShape_Tracing_create();

        this.presenter.data = {
            borderPositions: [],
            activePointsPositions: [],
            isPencilActive: true,
            isStarted: false,
            isReadyToSendEvent: false,
            currentPointNumber: 1,
            divID: "",
            numberOfLines: 0,
            numberOfDescentsFromShape: 0,
            width: 1000,
            height: 1000,
            zoom: 1
        };

        this.model = {
            "ID": "Shape_Tracing1",
            "Shape image": "/file/serve/5886269859037184",
            "Show Shape image": "True",
            "Show Shape image on check": "True",
            "Show Boundaries (editor)": "True",
            "Background image": "/file/serve/6449219812458496",
            "Correct Answer Image": "/file/serve/3449219812458491",
            "Correct number of lines": "2;3",
            "Points' coordinates": "1;1;1\n2;2;2\n3;3;3",
            "isPointsOrder": "False", // Mind points' order
            "Color": "",
            "Pen Thickness": "",
            "Eraser Thickness": "10",
            "Opacity": "",
            "Border": "1"
        };
    },

    'test proper model': function() {
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals("Shape_Tracing1", validatedModel.ID);
        assertTrue(validatedModel.isShowShapeImage);
        assertTrue(validatedModel.isShowShapeImageOnCheck);
        assertTrue(validatedModel.isShowFoundBoundaries);
        assertEquals([2,3], validatedModel.numberOfLines);
        assertEquals([[1,1,1], [2,2,2], [3,3,3]], validatedModel.points);
        assertEquals("#000000", validatedModel.color);
        assertEquals(10, validatedModel.penThickness);
    },

    'test empty Correct number of lines' : function() {
        this.model["Correct number of lines"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals([], validatedModel.numberOfLines);
    },

    'test to less number of coordinates' : function() {
        this.model["Points' coordinates"] = "1;1;1\n2;2;2\n3;3";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("P02", validatedModel.errorCode);
    },

    'test to many number of coordinates' : function() {
        this.model["Points' coordinates"] = "1;1;1\n2;2;2\n3;3;3;3";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("P02", validatedModel.errorCode);
    },

    'test points coordinates out of canvas boundaries' : function() {
        this.model["Points' coordinates"] = "1;1;1\n20;20;20\n3;3;3;3";
        this.presenter.data["width"] = 10;
        this.presenter.data["height"] = 10;
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("P03", validatedModel.errorCode);
    },

    'test empty points coordinates' : function() {
        this.model["Points' coordinates"] = "";
        var validatedModel = this.presenter.validateModel(this.model);

        assertTrue(validatedModel.isValid);
        assertEquals([], validatedModel.points);
    },

    'test wrong color format in hex' : function() {
        this.model["Color"] = "#1122333";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);
    },

    'test wrong color name' : function() {
        this.model["Color"] = "troll";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("C01", validatedModel.errorCode);
    },

    'test thickness value out of range - more then 40' : function() {
        this.model["Pen Thickness"] = "41";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("T02", validatedModel.errorCode);
    },

    'test thickness value out of range - less then 1' : function() {
        this.model["Pen Thickness"] = "0";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("T02", validatedModel.errorCode);
    },

    'test opacity value out of range - more then 1' : function() {
        this.model["Opacity"] = "1.11";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("O01", validatedModel.errorCode);
    },

    'test opacity value out of range - less then 0' : function() {
        this.model["Opacity"] = "-0.01";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("O01", validatedModel.errorCode);
    },

    'test border value out of range - more then 5' : function() {
        this.model["Border"] = "6";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("B01", validatedModel.errorCode);
    },

    'test border value out of range - less then 0' : function() {
        this.model["Border"] = "-1";
        var validatedModel = this.presenter.validateModel(this.model);

        assertFalse(validatedModel.isValid);
        assertEquals("B01", validatedModel.errorCode);
    },

    'test given shape image with /file pattern URL when validation is completed then URL will have additional no_gcs parameter': function (){
        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Shape image"] + "?no_gcs=True", configuration.shapeImage);
    },

    'test given shape image with shameless pattern URL when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Shape image"] = "//mauthor.com/file/serve/4834816278659072";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Shape image"] + "?no_gcs=True", configuration.shapeImage);
    },

    'test given shape image with absolute URL when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Shape image"] = "https://mauthor.com/file/serve/4834816278659072";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Shape image"] + "?no_gcs=True", configuration.shapeImage);
    },

    'test given shape image with /file pattern URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Shape image"] = "//mauthor.com/file/serve/4834816278659072?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Shape image"] + "&no_gcs=True", configuration.shapeImage);
    },

    'test given shape image with shameless pattern URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Shape image"] = "//mauthor.com/file/serve/4834816278659072?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Shape image"] + "&no_gcs=True", configuration.shapeImage);
    },

    'test given shape image with absolute URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Shape image"] = "https://mauthor.com/file/serve/4834816278659072?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Shape image"] + "&no_gcs=True", configuration.shapeImage);
    },

    'test given Background image with /file pattern URL when validation is completed then URL will have additional no_gcs parameter': function (){
        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Background image"] + "?no_gcs=True", configuration.backgroundImage);
    },

    'test given Background image with shameless pattern URL when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Background image"] = "//mauthor.com/file/serve/6449219812458496";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Background image"] + "?no_gcs=True", configuration.backgroundImage);
    },

    'test given Background image with absolute URL when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Background image"] = "https://mauthor.com/file/serve/6449219812458496";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Background image"] + "?no_gcs=True", configuration.backgroundImage);
    },

    'test given Background image with /file pattern URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Background image"] = "//mauthor.com/file/serve/6449219812458496?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Background image"] + "&no_gcs=True", configuration.backgroundImage);
    },

    'test given Background image with shameless pattern URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Background image"] = "//mauthor.com/file/serve/6449219812458496?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Background image"] + "&no_gcs=True", configuration.backgroundImage);
    },

    'test given Background image with absolute URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Background image"] = "https://mauthor.com/file/serve/6449219812458496?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Background image"] + "&no_gcs=True", configuration.backgroundImage);
    },

    'test given Correct Answer Image with /file pattern URL when validation is completed then URL will have additional no_gcs parameter': function (){
        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Correct Answer Image"] + "?no_gcs=True", configuration.correctAnswerImage);
    },

    'test given Correct Answer Image with shameless pattern URL when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Correct Answer Image"] = "//mauthor.com/file/serve/3449219812458491";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Correct Answer Image"] + "?no_gcs=True", configuration.correctAnswerImage);
    },

    'test given Correct Answer Image with absolute URL when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Correct Answer Image"] = "https://mauthor.com/file/serve/3449219812458491";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Correct Answer Image"] + "?no_gcs=True", configuration.correctAnswerImage);
    },

    'test given Correct Answer Image with /file pattern URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Correct Answer Image"] = "//mauthor.com/file/serve/3449219812458491?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Correct Answer Image"] + "&no_gcs=True", configuration.correctAnswerImage);
    },

    'test given Correct Answer Image with shameless pattern URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Correct Answer Image"] = "//mauthor.com/file/serve/3449219812458491?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Correct Answer Image"] + "&no_gcs=True", configuration.correctAnswerImage);
    },

    'test given Correct Answer Image with absolute URL with parameter when validation is completed then URL will have additional no_gcs parameter': function (){
        this.model["Correct Answer Image"] = "https://mauthor.com/file/serve/3449219812458491?SignURL=123";

        const configuration = this.presenter.validateModel(this.model);

        assertEquals(this.model["Correct Answer Image"] + "&no_gcs=True", configuration.correctAnswerImage);
    }
});
