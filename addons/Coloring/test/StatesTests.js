TestCase("States Tests", {
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

        sinon.stub(this.presenter, 'shouldBeTakenIntoConsideration');

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

        assertEquals('{\"filledAreas\":[],\"currentFillingColor\":[255,50,255,255],\"isErase\":true,\"colorsThatCanBeFilled\":[[255,255,255,255]],\"isVisible\":false,\"isDisabled\":false}', state);
    },

    'test set state sets fields properly' : function() {
        this.presenter.setState('{\"filledAreas\":[],\"currentFillingColor\":[255,255,50,255],\"isErase\":false,\"colorsThatCanBeFilled\":[[255,50,255,255]],\"isVisible\":true}');

        assertEquals([255,255,50,255], this.presenter.configuration.currentFillingColor);
        assertFalse(this.presenter.configuration.isErase);
        assertTrue(this.presenter.configuration.isVisible);

        this.presenter.runEndedDeferred.resolve();

        assertEquals([[255,50,255,255]], this.presenter.configuration.colorsThatCanBeFilled);

    }



});