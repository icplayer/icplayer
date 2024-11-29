TestCase("[Shape_Tracing] Active Points Positions", {
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
            width: 10,
            height: 10,
            zoom: 1
        };

        this.model = {
            "ID": "Shape_Tracing1",
            "Shape image": "/file/serve/5886269859037184",
            "Show Shape image": "True",
            "Show Shape image on check": "True",
            "Show Boundaries (editor)": "True",
            "Background image": "/file/serve/6449219812458496",
            "Correct number of lines": "2;3",
            "Points' coordinates": "1;1;1\n2;2;2\n3;3;3",
            "isPointsOrder": "False", // Mind points' order
            "Color": "green",
            "Pen Thickness": "10",
            "Eraser Thickness": "10",
            "Opacity": "",
            "Border": "1"
        }
    },

    'test [1] translate points coordinates and ray on 2D array' : function() {
        var expectedResult = [
            [0,0,0,1,0,0,0],
            [0,1,1,1,1,1,0],
            [0,1,1,1,1,1,0],
            [1,1,1,1,1,1,1],
            [0,1,1,1,1,1,0],
            [0,1,1,1,1,1,0],
            [0,0,0,1,0,0,0]
        ];

        this.presenter.data.width = 7;
        this.presenter.data.height = 7;
        this.model["Points' coordinates"] = "3;3;3";

        var validatedModel = this.presenter.validateModel(this.model);
        this.presenter.configuration = {
            points: validatedModel.points
        };
        this.presenter.initActivePointsPositions();

        assertEquals(expectedResult, this.presenter.data.activePointsPositions);
    },

    'test [2] translate points coordinates and ray on 2D array' : function() {
        var expectedResult = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
            [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0]
        ];

        this.presenter.data.width = 20;
        this.presenter.data.height = 20;
        this.model["Points' coordinates"] = "6;6;5\n16;16;4";

        var validatedModel = this.presenter.validateModel(this.model);
        this.presenter.configuration = {
            points: validatedModel.points
        };
        this.presenter.initActivePointsPositions();

        assertEquals(expectedResult, this.presenter.data.activePointsPositions);
    },

    'test [3] translate points coordinates and ray on 2D array' : function() {
        var expectedResult = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0]
        ];

        this.presenter.data.width = 20;
        this.presenter.data.height = 8;
        this.model["Points' coordinates"] = "6;6;5";

        var validatedModel = this.presenter.validateModel(this.model);
        this.presenter.configuration = {
            points: validatedModel.points
        };
        this.presenter.initActivePointsPositions();

        assertEquals(expectedResult, this.presenter.data.activePointsPositions);
    }
});
