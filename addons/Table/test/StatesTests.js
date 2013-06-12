TestCase("State saving", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            isVisible: true,
            gaps: {
                descriptions: []
            }
        };
    },

    'test no gaps': function () {
        var expectedState = JSON.stringify({
            isVisible: true,
            gaps: []
        });

        var state = this.presenter.getState();

        assertEquals(expectedState, state);
    },

    'test all gaps have empty values': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "", isEnabled: true },
            { answers: ["ans1"], id: "Table1-2", value: "", isEnabled: true },
            { answers: [""], id: "Table1-3", value: "", isEnabled: true },
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "", isEnabled: true }
        ];

        var expectedState = JSON.stringify({
            isVisible: true,
            gaps: [
                { value: "", isEnabled: true },
                { value: "", isEnabled: true },
                { value: "", isEnabled: true },
                { value: "", isEnabled: true }
            ]
        });

        var state = this.presenter.getState();

        assertEquals(expectedState, state);
    },

    'test some gaps have values': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "some value", isEnabled: true },
            { answers: ["ans1"], id: "Table1-2", value: "", isEnabled: true },
            { answers: [""], id: "Table1-3", value: "another value", isEnabled: true },
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "", isEnabled: true }
        ];

        var expectedState = JSON.stringify({
            isVisible: true,
            gaps: [
                { value: "some value", isEnabled: true },
                { value: "", isEnabled: true },
                { value: "another value", isEnabled: true },
                { value: "", isEnabled: true }
            ]
        });

        var state = this.presenter.getState();

        assertEquals(expectedState, state);
    },

    'test some gaps were disabled': function () {
        this.presenter.configuration.gaps.descriptions = [
            { answers: [""], id: "Table1-1", value: "", isEnabled: true },
            { answers: ["ans1"], id: "Table1-2", value: "", isEnabled: false },
            { answers: [""], id: "Table1-3", value: "", isEnabled: false },
            { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "", isEnabled: true }
        ];

        var expectedState = JSON.stringify({
            isVisible: true,
            gaps: [
                { value: "", isEnabled: true },
                { value: "", isEnabled: false },
                { value: "", isEnabled: false },
                { value: "", isEnabled: true }
            ]
        });

        var state = this.presenter.getState();

        assertEquals(expectedState, state);
    }
});

TestCase("State restoring", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'restoreGapValues');
        sinon.stub(this.presenter, 'setGapDisableProperties');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.restoreGapValues.restore();
        this.presenter.setGapDisableProperties.restore();
    },

    'test restore visible table without gaps': function () {
        var state = JSON.stringify({
            isVisible: true,
            gaps: []
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.restoreGapValues.calledWith([]));
        assertFalse(this.presenter.setGapDisableProperties.called);
    },

    'test restore invisible table without gaps': function () {
        var state = JSON.stringify({
            isVisible: false,
            gaps: []
        });

        this.presenter.setState(state);

        assertFalse(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.restoreGapValues.calledWith([]));
        assertFalse(this.presenter.setGapDisableProperties.called);
    },

    'test restore gaps disable property': function () {
        var state = JSON.stringify({
            isVisible: false,
            gaps: [
                { value: "", isEnabled: false },
                { value: "", isEnabled: false },
                { value: "", isEnabled: false },
                { value: "", isEnabled: false }
            ]
        });

        this.presenter.setState(state);

        assertFalse(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.restoreGapValues.calledWith(["", "", "", ""]));

        assertEquals(4, this.presenter.setGapDisableProperties.callCount);
        assertFalse(this.presenter.setGapDisableProperties.getCall(0).args[1]); // isEnabled property
        assertFalse(this.presenter.setGapDisableProperties.getCall(1).args[1]); // isEnabled property
        assertFalse(this.presenter.setGapDisableProperties.getCall(2).args[1]); // isEnabled property
        assertFalse(this.presenter.setGapDisableProperties.getCall(3).args[1]); // isEnabled property
    },

    'test only part of gaps are disabled and have value': function () {
        var state = JSON.stringify({
            isVisible: false,
            gaps: [
                { value: "some value", isEnabled: false },
                { value: "", isEnabled: true },
                { value: "another value", isEnabled: false },
                { value: "", isEnabled: true }
            ]
        });

        this.presenter.setState(state);

        assertFalse(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.restoreGapValues.calledWith(["some value", "", "another value", ""]));

        assertEquals(4, this.presenter.setGapDisableProperties.callCount);
        assertFalse(this.presenter.setGapDisableProperties.getCall(0).args[1]); // isEnabled property
        assertTrue(this.presenter.setGapDisableProperties.getCall(1).args[1]); // isEnabled property
        assertFalse(this.presenter.setGapDisableProperties.getCall(2).args[1]); // isEnabled property
        assertTrue(this.presenter.setGapDisableProperties.getCall(3).args[1]); // isEnabled property
    }
});