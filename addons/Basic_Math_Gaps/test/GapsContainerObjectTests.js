var setUpUtils = function () {
    this.presenter = AddonBasic_Math_Gaps_create();
    this.presenter.configuration = {
        isEquation: false
    };

    this.presenter.configuration.isDraggable = true;

    var gap1 = {
        setState: function () {}
    };

    var gap2 = {
        setState: function () {}
    };

    var gap3 = {
        setState: function () {}
    };
    this.stubs = {
        gap1SetState: sinon.stub(gap1, 'setState'),
        gap2SetState: sinon.stub(gap2, 'setState'),
        gap3SetState: sinon.stub(gap3, 'setState'),
        getNonEmptyGapsNumber: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getNonEmptyGapsNumber')
    };

    this.gapsContainer = new this.presenter.GapsContainerObject();
    this.gapsContainer._gaps.gap1 = gap1;
    this.gapsContainer._gaps.gap2 = gap2;
    this.gapsContainer._gaps.gap3 = gap3;

    this.gapsContainer._gapsOrderArray = ["gap1", "gap2", "gap3"];

    this.valuesArray = ["1", "2", "3"];
    this.sourcesArray = ["source1", "source2", "source3"];
    this.droppedElementsArray = ["dropped1", "dropped2", "dropped3"];

    sinon.stub(this.gapsContainer, 'addGapFilled');
};

var tearDownUtils = function () {
    this.presenter.GapsContainerObject.prototype.getNonEmptyGapsNumber.restore();
    this.gapsContainer.addGapFilled.restore();
};

TestCase("[Basic Math Gaps] [Gaps Container] Set state", {
    setUp: setUpUtils,
    tearDown: tearDownUtils,

    'test state should be set to all gaps': function () {
        this.gapsContainer.setState(this.valuesArray, this.sourcesArray, this.droppedElementsArray);

        assertTrue(this.stubs.gap1SetState.calledOnce);
        assertTrue(this.stubs.gap2SetState.calledOnce);
        assertTrue(this.stubs.gap3SetState.calledOnce);
    },

    'test state should be set with provided data': function () {
        this.gapsContainer.setState(this.valuesArray, this.sourcesArray, this.droppedElementsArray);

        assertTrue(this.stubs.gap1SetState.calledWith(this.valuesArray[0], this.sourcesArray[0], this.droppedElementsArray[0]));
        assertTrue(this.stubs.gap2SetState.calledWith(this.valuesArray[1], this.sourcesArray[1], this.droppedElementsArray[1]));
        assertTrue(this.stubs.gap3SetState.calledWith(this.valuesArray[2], this.sourcesArray[2], this.droppedElementsArray[2]));
    }
});

TestCase("[Basic Math Gaps] [Gaps Container] Can send event", {
    setUp: setUpUtils,
    tearDown: tearDownUtils,

    'test when addon is not equation it should send event': function () {
        assertTrue(this.gapsContainer.canSendEvent())
    },

    'test when addon is equation it shouldnt send event when some gaps are empty': function () {
        this.presenter.configuration.isEquation = true;

        this.stubs.getNonEmptyGapsNumber.returns(2);

        assertFalse(this.gapsContainer.canSendEvent());
    },

    'test when addon is equation it should send event when all gaps are non empty': function () {
        this.presenter.configuration.isEquation = true;

        this.stubs.getNonEmptyGapsNumber.returns(3);

        assertTrue(this.gapsContainer.canSendEvent());
    }
});

var setUpUtilsNotDraggable = function () {
    this.presenter = AddonBasic_Math_Gaps_create();
    this.presenter.configuration = {
        isEquation: false
    };

    this.presenter.isDraggable = false;

    this.gap1 = {
        $view: {val: sinon.stub()}
    };

    this.gap2 = {
        $view: {val: sinon.stub()}
    };

    this.gap3 = {
        $view: {val: sinon.stub()}
    };
    this.stubs = {
        getNonEmptyGapsNumber: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getNonEmptyGapsNumber')
    };

    this.gapsContainer = new this.presenter.GapsContainerObject();
    this.gapsContainer._gaps.gap1 = this.gap1;
    this.gapsContainer._gaps.gap2 = this.gap2;
    this.gapsContainer._gaps.gap3 = this.gap3;

    this.gapsContainer._gapsOrderArray = ["gap1", "gap2", "gap3"];

    this.valuesArray = ["1", "2", "3"];
    this.sourcesArray = ["source1", "source2", "source3"];

    sinon.stub(this.gapsContainer, 'addGapFilled');
};

TestCase("[Basic Math Gaps] [Gaps Container] Set state when not draggable", {
    setUp: setUpUtilsNotDraggable,
    tearDown: tearDownUtils,

    'test state should be set to all gaps': function () {

        this.gapsContainer.setState(this.valuesArray, this.sourcesArray, this.droppedElementsArray);

        assertTrue(this.gap1.$view.val.calledOnce);
        assertTrue(this.gap1.$view.val.calledOnce);
        assertTrue(this.gap1.$view.val.calledOnce);
    }
});