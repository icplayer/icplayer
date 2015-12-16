TestCase("isShapeCoveredInCircle", {
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

    'test isShapeCoveredInCircle - true' : function() {
        this.presenter.data.borderPositions = [
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true]
        ];

        this.presenter.data.width = 10;
        this.presenter.data.height = 5;

        assertTrue(this.presenter.isShapeCoveredInCircle(7, 2, 2));
    },

    'test isShapeCoveredInCircle - false' : function() {
        this.presenter.data.borderPositions = [
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true],
            [false,false,true,true,true,true,true,true,true,true]
        ];

        this.presenter.data.width = 10;
        this.presenter.data.height = 5;

        assertFalse(this.presenter.isShapeCoveredInCircle(2, 2, 1));
    },

    'test isPositionInDefinedPoint' : function() {
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
        this.presenter.data.currentPointNumber = 1;

        this.model["Points' coordinates"] = "6;6;5";

        var validatedModel = this.presenter.validateModel(this.model);
        this.presenter.configuration = {
            points: validatedModel.points,
            isCheckPointsOrder: true
        };
        this.presenter.initActivePointsPositions();

        assertEquals(expectedResult, this.presenter.data.activePointsPositions);

        assertFalse(this.presenter.isPositionInDefinedPoint(17, 5, 2));
        assertTrue(this.presenter.isPositionInDefinedPoint(4, 3, 1));
    }
});