TestCase("[Line number] Commands logic", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.presenter.configuration = {
            drawnRangesData : {
                ranges : []
            },
            shouldDrawRanges : [],
            mouseData: {
                clicks : [1, 2, 3]
            },
            isCurrentlyVisible : false,
            isVisibleByDefault : true,
            isShowErrorsMode : true,
            isDisabled : true,
            isDisabledByDefault : false,
            ranges : '<-2; 1); 1'
        };
        this.presenter.$view = $('<div></div>');

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'redrawRanges');
        sinon.stub(this.presenter, 'drawRanges');
        sinon.stub(this.presenter, 'removeRange');
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.redrawRanges.restore();
    },

    'test setState with empty state': function () {
        this.presenter.setState(undefined);

        assertFalse(this.presenter.redrawRanges.called);
        assertFalse(this.presenter.setVisibility.called);
    },

    'test restore visible module': function () {
        var state = JSON.stringify({
            isVisible: true,
            isDisabled: false,
            drawnRangesData: { ranges: {} }
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.redrawRanges.calledOnce);
        assertTrue(this.presenter.configuration.isCurrentlyVisible);
        assertTrue(this.presenter.setVisibility.calledWith(true));

        assertFalse(this.presenter.configuration.isDisabled);
    },

    'test restore invisible module': function () {
        var state = JSON.stringify({
            isVisible: false,
            isDisabled: false,
            drawnRangesData: { ranges: {} }
        });

        this.presenter.setState(state);

        assertTrue(this.presenter.redrawRanges.calledOnce);
        assertFalse(this.presenter.configuration.isCurrentlyVisible);
        assertTrue(this.presenter.setVisibility.calledWith(false));

        assertFalse(this.presenter.configuration.isDisabled);
    },

    'test reset will clean clicks array': function () {

        this.presenter.reset();

        assertEquals([], this.presenter.configuration.mouseData.clicks);
    },

    'test reset will set visibility to default value': function () {

        this.presenter.reset();

        var conf = this.presenter.configuration;
        assertEquals(conf.isVisibleByDefault, conf.isCurrentlyVisible);
    },

    'test reset will set disable to default value': function () {

        this.presenter.reset();

        var conf = this.presenter.configuration;
        assertEquals(conf.isDisabledByDefault, conf.isDisabled);
    },

    'test reset will set showErrorsMode to false': function () {

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isShowErrorsMode);
    }
});