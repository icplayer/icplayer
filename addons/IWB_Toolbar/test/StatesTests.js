TestCase("[IWB Toolbar] State", {
    setUp: function () {
        this.presenter = AddonIWB_Toolbar_create();

        this.base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAQaCAYAAADQXlJ4AAAP/klEQâ€¦AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN8AHhoAAc55+7cAAAAASUVORK5CYII=";
    },

    'test upgrade state': function () {
        var stopwatchesAndClocksUpgradeStub = sinon.stub(this.presenter, 'upgradeStateForStopwatchesAndClocks');
        var visibilityUpgradeStub = sinon.stub(this.presenter, 'upgradeStateForVisibility');
        var savingToolsUpgradeStub = sinon.stub(this.presenter, 'upgradeStateForSavingTools');
        var upgradeStateForSelectingMaskVisibilityStub = sinon.stub(this.presenter, 'upgradeStateForSelectingMaskVisibility');

        this.presenter.upgradeState({});

        assertTrue(stopwatchesAndClocksUpgradeStub.called);
        assertTrue(visibilityUpgradeStub.called);
        assertTrue(savingToolsUpgradeStub.called);
        assertTrue(upgradeStateForSelectingMaskVisibilityStub.called);

        this.presenter.upgradeStateForStopwatchesAndClocks.restore();
        this.presenter.upgradeStateForVisibility.restore();
        this.presenter.upgradeStateForSavingTools.restore();
        this.presenter.upgradeStateForSelectingMaskVisibility.restore();
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

    'test individual state should not be restored for compatibility reasons': function () {
        // If neither 'keepStateAndPosition' model property nor state 'position' property is present, addon should
        // work as before introducing 'Keep state and position' option.
        var model = {
            keepStateAndPosition: undefined
        }, state = {
            position: undefined
        };

        assertFalse(this.presenter.shouldRestoreStateAndPosition(model, state));
    },

    'test individual state should be restored because of Keep state and position property': function () {
        var model = {
            keepStateAndPosition: 'True'
        }, state = {
            position: {
                top: 0,
                left: 0
            }
        };

        assertTrue(this.presenter.shouldRestoreStateAndPosition(model, state));
    },

    'test individual state should not be restored': function () {
        var model = {
            keepStateAndPosition: 'False'
        }, state = {
            position: {
                top: 0,
                left: 0
            }
        };

        assertFalse(this.presenter.shouldRestoreStateAndPosition(model, state));
    },

    'test state saving tool': function () {
        var state = {
            'activeFunction': 'pen',
            'stateColor': undefined,
            'stateThickness': 1,
            'isCloseColor': true,
            'buttonColor': undefined,
            'buttonThickness': undefined,
            'shouldSaveColor': 'pen'
        };

        var upgradedState = this.presenter.upgradeStateForSavingTools(state);

        assertEquals('pen', upgradedState.activeFunction);
        assertEquals('#000', upgradedState.stateColor);
        assertEquals(1, upgradedState.stateThickness);
        assertEquals(true, upgradedState.isCloseColor);
        assertEquals('', upgradedState.buttonColor);
        assertEquals('', upgradedState.buttonThickness);
        assertEquals('pen', upgradedState.shouldSaveColor);
    }
});