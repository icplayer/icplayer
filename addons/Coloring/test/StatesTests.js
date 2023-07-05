TestCase("[Coloring] States Tests", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.model = {
            'Areas' : '55; 150; 255 200 255 255',
            'Tolerance' : '50',
            'DefaultFillingColor' : [255, 50, 50, 255]
        };

        this.presenter.configuration = {
            'tolerance' : 50,
            'lastUsedColor' : [255, 255, 0, 255],
            'areas' : [
                'fake Area'
            ],
            'defaultFillingColor' : [255, 50, 50, 255],
            'colorsThatCanBeFilled' : [[255, 255, 255, 255]],
            'isDisabled' : false,
            'currentFillingColor' : [255, 50, 255, 255],
            'isErase' : true,
            'isVisible' : false
        };

        this.presenter.getScore = function() {
            return 10;
        };

        this.presenter.getErrorCount = function() {
            return 5;
        };

        sinon.stub(this.presenter, 'shouldBeTakenIntoConsideration');
        this.presenter.image = [];
        this.presenter.tmpFilledAreas = [];
        this.presenter.ctx = {
            clearRect: function() { },
            drawImage: function () { },
            getImageData: function () { return {
                data: []
            }; },
            putImageData: function () { }
        };
        this.stubs = {
            clearRect: sinon.stub(this.presenter.ctx.clearRect, 'clearRect'),
        };

        this.presenter.$view = $('' +
            '<div>' +
                '<div class="coloring-wrapper">' +
                    '<div class="coloring-container">' +
                    '</div>' +
                '</div>' +
            '</div>');

        this.presenter.canvas = $('<canvas></canvas>');

        this.presenter.runEndedDeferred = new $.Deferred();
        this.presenter.runEnded = this.presenter.runEndedDeferred.promise();
    },

    tearDown : function() {
        this.presenter.shouldBeTakenIntoConsideration.restore();
    },

    'test get state returns correct data' : function() {
        this.presenter.shouldBeTakenIntoConsideration.returns(false);

        var state = this.presenter.getState();

        assertEquals('{\"filledAreas\":[],\"currentFillingColor\":[255,50,255,255],\"isErase\":true,' +
        '\"colorsThatCanBeFilled\":[[255,255,255,255]],\"isVisible\":false,\"isDisabled\":false,\"score\":10,' +
        '\"errorCount\":5,\"userAreas\":[]}', state);
    },

    'test set state sets fields properly' : function() {
        this.presenter.setState('{\"filledAreas\":[],\"currentFillingColor\":[255,255,50,255],\"isErase\":false,\"colorsThatCanBeFilled\":[[255,50,255,255]],\"isVisible\":true}');

        assertEquals([255,255,50,255], this.presenter.configuration.currentFillingColor);
        assertFalse(this.presenter.configuration.isErase);
        assertTrue(this.presenter.configuration.isVisible);

        this.presenter.runEndedDeferred.resolve();

        assertEquals([[255,50,255,255]], this.presenter.configuration.colorsThatCanBeFilled);

    },

    'test given show answer when getState was called should show them again': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.isCanvasInitiated = true;
        this.presenter.configuration.isActivity = true;
        this.presenter.configuration.areas = [
            {
                x: 0,
                y: 0,
                colorToFill: [128, 128, 128]
            }
        ];

        this.presenter.getState();

        assertTrue(this.presenter.isShowAnswersActive);
    }
});

TestCase("[Coloring] User areas get state", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.model = {
            'Areas': '55; 150; 255 200 255 255',
            'Tolerance': '50',
            'DefaultFillingColor': [255, 50, 50, 255]
        };

        this.presenter.configuration = {
            'tolerance': 50,
            'lastUsedColor': [255, 255, 0, 255],
            'areas': [
                'fake Area'
            ],
            'defaultFillingColor': [255, 50, 50, 255],
            'colorsThatCanBeFilled': [[255, 255, 255, 255]],
            'isDisabled': false,
            'currentFillingColor': [255, 50, 255, 255],
            'isErase': true,
            'isVisible': false
        };

        this.stubs = {
            shouldBeTakenIntoConsideration: sinon.stub(this.presenter, 'shouldBeTakenIntoConsideration'),
            getScore: sinon.stub(this.presenter, 'getScore'),
            getErrorCount: sinon.stub(this.presenter, 'getErrorCount')
        };

        this.stubs.getScore.returns(10);
        this.stubs.getErrorCount.returns(5);
        this.presenter.shouldBeTakenIntoConsideration.returns(false);

        this.presenter.configuration.userAreas = [
            {
                colorToFill: [1, 1, 1, 1],
                x: 1,
                y: 1,
                type: 1,
                pixelPosition: 1,
                getColor: function () {return [1, 1, 1, 1];}
            },
            {
                colorToFill: [2, 2, 2, 2],
                x: 2,
                y: 2,
                type: 2,
                pixelPosition: 2,
                getColor: function () {return [2, 2, 2, 2];}
            },            {
                colorToFill: [255, 255, 255, 255],
                x: 3,
                y: 3,
                type: 3,
                pixelPosition: 3,
                getColor: function () {return [3, 3, 3, 3];}
            },            {
                colorToFill: [4, 4, 4, 4],
                x: 4,
                y: 4,
                type: 4,
                pixelPosition: 4,
                getColor: function () {return [4, 4, 4, 4];}
            },
            {
                colorToFill: [5, 5, 5, 5],
                x: 5,
                y: 5,
                type: 5,
                pixelPosition: 5,
                getColor: function () {return [5, 5, 5, 5];}
            }
        ];
    },

    tearDown : function() {
        this.presenter.shouldBeTakenIntoConsideration.restore();
        this.presenter.getScore();
        this.presenter.getErrorCount();
    },

    'test proper passing one user area': function () {


        this.presenter.configuration.userAreas = this.presenter.configuration.userAreas.slice(0, 1);

        var expectedState = '{\"filledAreas\":[],\"currentFillingColor\":[255,50,255,255],\"isErase\":true,' +
        '\"colorsThatCanBeFilled\":[[255,255,255,255]],\"isVisible\":false,\"isDisabled\":false,\"score\":10,' +
        '\"errorCount\":5,\"userAreas\":[{\"area\":{\"x\":1,\"y\":1,\"type\":1,\"pixelPosition\":1,\"colorToFill\":[1,1,1,1]},\"color\":[1,1,1,1]}]}';
        var state = this.presenter.getState();

        assertEquals(expectedState, state);
    },

    'test proper passing multiply user areas': function () {
        var state = this.presenter.getState();

        var parsedState = JSON.parse(state);
        var userAreas = parsedState.userAreas;

        assertEquals(5, userAreas.length);

        assertEquals(1, userAreas[0].area.x);
        assertEquals(1, userAreas[0].area.y);
        assertEquals(1, userAreas[0].area.type);
        assertEquals(1, userAreas[0].area.pixelPosition);
        assertEquals([1, 1, 1, 1], userAreas[0].color);

        assertEquals(2, userAreas[1].area.x);
        assertEquals(2, userAreas[1].area.y);
        assertEquals(2, userAreas[1].area.type);
        assertEquals(2, userAreas[1].area.pixelPosition);
        assertEquals([2, 2, 2, 2], userAreas[1].color);

        assertEquals(3, userAreas[2].area.x);
        assertEquals(3, userAreas[2].area.y);
        assertEquals(3, userAreas[2].area.type);
        assertEquals(3, userAreas[2].area.pixelPosition);
        assertEquals([3, 3, 3, 3], userAreas[2].color);

        assertEquals(4, userAreas[3].area.x);
        assertEquals(4, userAreas[3].area.y);
        assertEquals(4, userAreas[3].area.type);
        assertEquals(4, userAreas[3].area.pixelPosition);
        assertEquals([4, 4, 4, 4], userAreas[3].color);

        assertEquals(5, userAreas[4].area.x);
        assertEquals(5, userAreas[4].area.y);
        assertEquals(5, userAreas[4].area.type);
        assertEquals(5, userAreas[4].area.pixelPosition);
        assertEquals([5, 5, 5, 5], userAreas[4].color);

    }
});

TestCase("[Coloring] Set state validation", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.presenter.configuration = {};

        this.stubs = {
            upgradeState: sinon.stub(this.presenter, 'upgradeState'),
            setVisibility: sinon.stub(this.presenter, "setVisibility"),
            setCurrentFillingColorInSetState: sinon.stub(this.presenter, "setCurrentFillingColorInSetState"),
            getAreasToFillFromSetState: sinon.stub(this.presenter, "getAreasToFillFromSetState"),
            restoreColoringAtState: sinon.stub(this.presenter, "restoreColoringAtState"),
            restoreUserAreasFromState: sinon.stub(this.presenter, "restoreUserAreasFromState")
        };
    },

    tearDown: function () {
        this.presenter.upgradeState.restore();
        this.presenter.setVisibility.restore();
        this.presenter.getAreasToFillFromSetState.restore();
        this.presenter.setCurrentFillingColorInSetState.restore();
        this.presenter.restoreColoringAtState.restore();
        this.presenter.restoreUserAreasFromState.restore();
    },

    'test checking proper amount of calling fill area': function () {
        this.stubs.getAreasToFillFromSetState.returns({});
        this.stubs.upgradeState.returns({isErase: false, isVisible: true, isDisabled: true, isColored: true, savedScore: true, savedErrorCount: true, colorsThatCanBeFilled: [[255,255,255,255]]});

        this.presenter.runEndedDeferred = new $.Deferred();
        this.presenter.runEnded = this.presenter.runEndedDeferred.promise();

        this.presenter.setState("{\"filledAreas\":[]}");

        assertTrue(this.stubs.restoreColoringAtState.called);
    }
});