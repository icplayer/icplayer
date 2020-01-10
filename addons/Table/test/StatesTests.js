TestCase("[Table] Get State", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.presenter.configuration = {
            gapType: "editable",
            isVisible: true
        };

        this.presenter.isShowAnswersActive = false;

        this.stubs = {
            hideAnswers: sinon.stub(this.presenter, 'hideAnswers'),
            getState: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getState'),
            getGapsState: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getGapsState')
        };

        this.expectedGapsState = {
            gaps: "sflknhdjfas.ljdkfsafdas",
            yupikayey: "1337",
            isAttempted: true
        };

        this.expectedSpansState = {
            spans: "alwerhlayudcvz.v,nxcz.vxzc",
            test: "my little test"
        };

        this.stubs.getGapsState.returns(this.expectedGapsState);
        this.stubs.getState.returns(this.expectedSpansState);
    },

    tearDown: function () {
        this.presenter.hideAnswers.restore();
        this.presenter.GapsContainerObject.prototype.getState.restore();
        this.presenter.GapsContainerObject.prototype.getGapsState.restore();
    },

    'test should not hide answers if show answers is active': function () {
        this.presenter.isShowAnswersActive = true;

        this.presenter.getState();

        assertFalse(this.stubs.hideAnswers.calledOnce);
    },

    'test should return isVisible attribute in state equals to what is in configuration': function () {
        var testedState = JSON.parse(this.presenter.getState());

        assertTrue(testedState.isVisible);

        this.presenter.configuration.isVisible = false;

        testedState = JSON.parse(this.presenter.getState());

        assertFalse(testedState.isVisible);
    },

    'test shouldnt hide answers if show answers is not active': function () {
        this.presenter.getState();

        assertFalse(this.stubs.hideAnswers.called);
    },

    'test should return in state gaps attribute equals to data returned by getGapsState from gaps container': function () {
        var testedState = JSON.parse(this.presenter.getState());

        assertEquals(this.expectedGapsState, testedState.gaps);
    },

    'test should set spans attribute in state to null if gap type is not draggable': function () {
        var testedState = JSON.parse(this.presenter.getState());

        assertNull(testedState.spans);
    },

    'test should set spans attribute in state to data returned by getState from gaps container when gap type is draggable': function () {
        this.presenter.configuration.gapType = "draggable";

        var testedState = JSON.parse(this.presenter.getState());

        assertNotNull(testedState.spans);
        assertEquals(this.expectedSpansState, testedState.spans);
    }

});

TestCase("[Table] Set State", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            setVisibility: sinon.stub(this.presenter, 'setVisibility'),
            parseState: sinon.stub(JSON, 'parse'),
            setGapsState: sinon.stub(this.presenter.gapsContainer, 'setGapsState'),
            setSpansState: sinon.stub(this.presenter.gapsContainer, 'setSpansState')
        };

        this.expectedParsedGapsState = {
            test: "gaps gaps gaps oh my gaps",
            leet: "1337"
        };

        this.expectedParsedSpansState = {
            test: "spam spam spam",
            price: "3.4$"
        };

        this.stubs.parseState.returns({
            isVisible: false,
            gaps: this.expectedGapsState,
            spans: this.expectedSpansState
        });
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
        this.presenter.gapsContainer.setGapsState.restore();
        this.presenter.gapsContainer.setSpansState.restore();
        JSON.parse.restore();
    },

    'test should set visibility with value from parsed state': function () {
        this.stubs.parseState.returns({
            isVisible: false
        });

        this.presenter.setState({});

        assertTrue(this.stubs.setVisibility.calledOnce);
        assertTrue(this.stubs.setVisibility.calledWith(false));
    },

    'test should set isVisible in configuration with value from parsed state': function () {
        this.presenter.setState({});

        assertFalse(this.presenter.configuration.isVisible);
    },

    'test should set gaps state with gaps attribute from state': function () {
        this.presenter.setState({});

        assertTrue(this.stubs.setGapsState.calledOnce);
        assertTrue(this.stubs.setGapsState.calledWith(this.expectedGapsState));
    },

    'test should set spans state with spans attribute from state': function () {
        this.presenter.setState({});

        assertTrue(this.stubs.setSpansState.calledOnce);
        assertTrue(this.stubs.setSpansState.calledWith(this.expectedSpansState));
    }
});
