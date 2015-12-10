TestCase("Axuiliary Functions", {
    setUp: function () {
        this.presenter = AddonShape_Tracing_create();

        this.presenter.pointsArray = [1, 2];
        this.presenter.pointsHistory = [1, 2, 3, 4, 5];

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
            width: 20,
            height: 20,
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
            "Points' coordinates": "6;6;5\n16;16;4",
            "isPointsOrder": "False", // Mind points' order
            "Color": "green",
            "Pen Thickness": "10",
            "Eraser Thickness": "10",
            "Opacity": "",
            "Border": "1"
        };

        this.presenter.data.activePointsPositions = [
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
    },

    'test isPositionInDefinedPoint' : function() {
        assertTrue(this.presenter.isThisActivePointAndCheck(18, 18));
        assertEquals([1], this.presenter.pointsArray);

        assertTrue(this.presenter.isThisActivePointAndCheck(1, 6));
        assertEquals([], this.presenter.pointsArray);
    },

    'test isOrderCorrectCommand()' : function() {
        assertTrue(this.presenter.isOrderCorrectCommand([]));
    },

    'test isOrderCorrect()' : function() {
        assertTrue(this.presenter.isOrderCorrect());
    },

    'test isOrderCorrect(true)' : function() {
        assertTrue(this.presenter.isOrderCorrect(true));
    },

    'test isOrderCorrect(true) with missing points in the middle' : function() {
        this.presenter.pointsHistory = [1, 2, 3, 6];
        assertTrue(this.presenter.isOrderCorrect(true));
    },

    'test isOrderCorrect(false) with correct points' : function() {
        assertTrue(this.presenter.isOrderCorrect(false));
    },

    'test isOrderCorrect(false) with wrong points' : function() {
        this.presenter.pointsHistory = [1, 2, 3, 6, 5];
        assertFalse(this.presenter.isOrderCorrect());
    }
});