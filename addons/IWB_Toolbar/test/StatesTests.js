TestCase("[IWB Toolbar] State", {
    setUp: function () {
        this.presenter = AddonIWB_Toolbar_create();

        this.base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAQaCAYAAADQXlJ4AAAP/klEQâ€¦AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN8AHhoAAc55+7cAAAAASUVORK5CYII=";
    },

    'test upgrade state': function () {
        var stopwatchesAndClocksUpgradeStub = sinon.stub(this.presenter, 'upgradeStateForStopwatchesAndClocks');
        var visibilityUpgradeStub = sinon.stub(this.presenter, 'upgradeStateForVisibility');
        var keepStateAndPositionUpgradeStub = sinon.stub(this.presenter, 'upgradeStateForKeepStateAndPosition');

        this.presenter.upgradeState({});

        assertTrue(stopwatchesAndClocksUpgradeStub.called);
        assertTrue(visibilityUpgradeStub.called);
        assertTrue(keepStateAndPositionUpgradeStub.called);

        this.presenter.upgradeStateForStopwatchesAndClocks.restore();
        this.presenter.upgradeStateForVisibility.restore();
        this.presenter.upgradeStateForKeepStateAndPosition.restore();
    },

    'test upgrade state when there are no stopwatches and clocks related fields': function () {
        var state = {
            "areas": [],
            "notes": [],
            "drawings": {
                "pen": this.base64Image,
                "marker": this.base64Image
            }
        };

        var upgradedState = this.presenter.upgradeStateForStopwatchesAndClocks(state);

        assertEquals([], upgradedState.stopwatches);
        assertEquals([], upgradedState.clocks);

        // Sanity check for not upgraded properties
        assertEquals([], upgradedState.areas);
        assertEquals([], upgradedState.notes);
        assertEquals(this.base64Image, upgradedState.drawings.pen);
        assertEquals(this.base64Image, upgradedState.drawings.marker);
    },

    'test upgrade state when there are stopwatches and clocks related fields': function () {
        var state = {
            "areas": [],
            "notes": [],
            "drawings": {
                "pen": this.base64Image,
                "marker": this.base64Image
            },
            "stopwatches": [1, 2, 3],
            "clocks": [4, 5, 6]
        };

        var upgradedState = this.presenter.upgradeStateForStopwatchesAndClocks(state);

        assertEquals([1, 2, 3], upgradedState.stopwatches);
        assertEquals([4, 5, 6], upgradedState.clocks);

        // Sanity check for not upgraded properties
        assertEquals([], upgradedState.areas);
        assertEquals([], upgradedState.notes);
        assertEquals(this.base64Image, upgradedState.drawings.pen);
        assertEquals(this.base64Image, upgradedState.drawings.marker);
    },

    'test upgrade state when there is no visibility related field': function () {
        var state = {
            "areas": [],
            "notes": [],
            "drawings": {
                "pen": this.base64Image,
                "marker": this.base64Image
            },
            "stopwatches": [1, 2, 3],
            "clocks": [4, 5, 6]
        };

        var upgradedState = this.presenter.upgradeStateForVisibility(state);

        assertTrue(upgradedState.isVisible);

        // Sanity check for not upgraded properties
        assertEquals([], upgradedState.areas);
        assertEquals([], upgradedState.notes);
        assertEquals(this.base64Image, upgradedState.drawings.pen);
        assertEquals(this.base64Image, upgradedState.drawings.marker);
        assertEquals([1, 2, 3], upgradedState.stopwatches);
        assertEquals([4, 5, 6], upgradedState.clocks);
    },

    'test upgrade state when there is visibility related field': function () {
        var state = {
            "areas": [],
            "notes": [],
            "drawings": {
                "pen": this.base64Image,
                "marker": this.base64Image
            },
            "stopwatches": [1, 2, 3],
            "clocks": [4, 5, 6],
            "isVisible": false
        };

        var upgradedState = this.presenter.upgradeStateForVisibility(state);

        assertFalse(upgradedState.isVisible);

        // Sanity check for not upgraded properties
        assertEquals([], upgradedState.areas);
        assertEquals([], upgradedState.notes);
        assertEquals(this.base64Image, upgradedState.drawings.pen);
        assertEquals(this.base64Image, upgradedState.drawings.marker);
        assertEquals([1, 2, 3], upgradedState.stopwatches);
        assertEquals([4, 5, 6], upgradedState.clocks);
    },

    'test upgrade state when there is not Keep state and position related field': function () {
        var state = {
            "areas": [],
            "notes": [],
            "drawings": {
                "pen": this.base64Image,
                "marker": this.base64Image
            },
            "stopwatches": [1, 2, 3],
            "clocks": [4, 5, 6],
            "isVisible": true
        };

        var upgradedState = this.presenter.upgradeStateForKeepStateAndPosition(state);

        assertTrue(upgradedState.isKeepStateAndPosition);

        // Sanity check for not upgraded properties
        assertEquals([], upgradedState.areas);
        assertEquals([], upgradedState.notes);
        assertEquals(this.base64Image, upgradedState.drawings.pen);
        assertEquals(this.base64Image, upgradedState.drawings.marker);
        assertEquals([1, 2, 3], upgradedState.stopwatches);
        assertEquals([4, 5, 6], upgradedState.clocks);
    },

    'test upgrade state when there is Keep state and position related field': function () {
        var state = {
            "areas": [],
            "notes": [],
            "drawings": {
                "pen": this.base64Image,
                "marker": this.base64Image
            },
            "stopwatches": [1, 2, 3],
            "clocks": [4, 5, 6],
            "isVisible": false,
            "isKeepStateAndPosition": false
        };

        var upgradedState = this.presenter.upgradeStateForKeepStateAndPosition(state);

        assertFalse(upgradedState.isKeepStateAndPosition);

        // Sanity check for not upgraded properties
        assertEquals([], upgradedState.areas);
        assertEquals([], upgradedState.notes);
        assertEquals(this.base64Image, upgradedState.drawings.pen);
        assertEquals(this.base64Image, upgradedState.drawings.marker);
        assertEquals([1, 2, 3], upgradedState.stopwatches);
        assertEquals([4, 5, 6], upgradedState.clocks);
    }
});