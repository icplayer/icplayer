TestCase("[Multiple Gap] calculateHowManyElementsInContainer", {
    
    setUp: function () {
        this.presenter = new Addonmultiplegap_create();
    },
    
    'test should always place atleast 1 element in container': function () {
        assertEquals(1, this.presenter.calculateHowManyElementsInContainer(300, 320, 10));
        assertEquals(1, this.presenter.calculateHowManyElementsInContainer(300, 290, 10));
        assertEquals(1, this.presenter.calculateHowManyElementsInContainer(300, 200, 10));
        assertEquals(1, this.presenter.calculateHowManyElementsInContainer(300, 150, 10));
    },
    
    'test should use all available space until elements first in container': function () {
        assertEquals(2, this.presenter.calculateHowManyElementsInContainer(300, 100, 10));
        assertEquals(3, this.presenter.calculateHowManyElementsInContainer(320, 100, 10));
        assertEquals(2, this.presenter.calculateHowManyElementsInContainer(310, 100, 10));
    }
});

TestCase("[Multiple Gap] calculateSpaceUsedByElements", {
    
    setUp: function () {
        this.presenter = new Addonmultiplegap_create();
        this.presenter.configuration = {
            items: {
                spacing: 10
            }
        };
        
        this.stubs = {
            countItems: sinon.stub(this.presenter, 'countItems')
        };
    },
    
    tearDown: function () {
        this.presenter.countItems.restore();
    },
    
    'test should use passed items count instead getting it from countItems': function () {
        this.stubs.countItems.returns(0);
        assertEquals(0, this.presenter.calculateSpaceUsedByElements(150, 0));
        
        this.stubs.countItems.returns(3);
        assertEquals(480, this.presenter.calculateSpaceUsedByElements(150, 3))
    },
    
    'test should use value calculated by countItems if itemsToCount is not provided to function': function () {
        this.stubs.countItems.returns(2);
        assertEquals(320, this.presenter.calculateSpaceUsedByElements(150));
        
        this.stubs.countItems.returns(10);
        assertEquals(1600, this.presenter.calculateSpaceUsedByElements(150));
    }
});

TestCase("[Multiple Gap] elementCounter tests", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.configuration = {
            isActivity: true,
            blockWrongAnswers: false,
            sourceType: 1,
            itemsAnswersID: ["Source_list1-1", "Source_list1-3", "Source_list1-5"],
            ID: "multiplegap1",
        };

        this.presenter.isShowAnswersActive = false;
        this.presenter.$view = $('<div></div>');
        this.presenter.itemCounterMode = false;
        this.presenter.keyboardControllerObject = {
            setElements: function (elements) {},
        }

        this.performAcceptDraggableStub = sinon.stub(this.presenter, 'performAcceptDraggable');
        this.performAcceptDraggableStub.callsFake(() => (this.presenter.elementCounter++));
        this.setWorkModeStub = sinon.stub(this.presenter, 'setWorkMode');
        this.getTemporaryDataStub = sinon.stub(this.presenter, 'getTemporaryData');
        this.getActivitiesCountStub = sinon.stub(this.presenter, 'getActivitiesCount');
        this.getElementsForKeyboardNavigationStub = sinon.stub(this.presenter, 'getElementsForKeyboardNavigation');
        this.getElementsForKeyboardNavigationStub.returns($('<div></div>'));
        this.getElementTextStub = sinon.stub(this.presenter, 'getElementText');
        this.getElementTextStub.returns("Text");
        this.resetStub = sinon.stub(this.presenter, 'reset');
        this.resetStub.callsFake(() => (this.presenter.elementCounter = 0));
        this.clearSelectedStub = sinon.stub(this.presenter, 'clearSelected');
        this.showStub = sinon.stub(this.presenter, 'show');
        this.hideStub = sinon.stub(this.presenter, 'hide');
    },

    tearDown: function () {
        this.presenter.performAcceptDraggable.restore();
        this.presenter.setWorkMode.restore();
        this.presenter.getTemporaryData.restore();
        this.presenter.getActivitiesCount.restore();
        this.presenter.getElementsForKeyboardNavigation.restore();
        this.presenter.getElementText.restore();
        if (typeof this.presenter.reset.restore === "function") {
            this.presenter.reset.restore();
        }
        this.presenter.clearSelected.restore();
        this.presenter.show.restore();
        this.presenter.hide.restore();
    },

    'test given elementCounter when init addon then value should equals to 0': function () {
        assertEquals(0, this.presenter.elementCounter);
    },

    'test given elementCounter when showed answers then value should equals to activities number': function () {
        const activitiesNumber = 3;
        this.getActivitiesCountStub.returns(activitiesNumber);

        this.presenter.showAnswers();

        assertEquals(activitiesNumber, this.presenter.elementCounter);
    },

    'test given elementCounter when executed gradual show answer then value should raise by 1': function () {
        const expectedValue = this.presenter.elementCounter + 1;

        this.presenter.onEventReceived("GradualShowAnswers", {value: '0', item: 0, moduleID: "multiplegap1"});

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    'test given elementCounter when executed reset then value should equals to 0': function () {
        this.presenter.reset.restore();

        const expectedValue = 0;

        this.presenter.reset();

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    'test given elementCounter when executed hide answers then value should equals to number of elements in temporary state': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.tmpState = [
            {item: 'Source_list1-1', value: 'Item 1', type: 'string'},
            {item: 'Source_list1-2', value: 'Item 2', type: 'string'}
        ]

        this.presenter.hideAnswers();

        assertEquals(this.presenter.tmpState.length, this.presenter.elementCounter);
    },

    'test given elementCounter when executed setState then value should equals to number of placeholders in state': function () {
        this.presenter.placeholders2drag = [$("<div></div>")];
        this.presenter.pageLoaded = {then: function () {}};
        const state = '{"placeholders":[{"item":"Source_list1-1","value":"Item 1","type":"string"},{"item":"Source_list1-2","value":"Item 2","type":"string"}],"isVisible":true}';

        this.presenter.setState(state);

        assertEquals(2, this.presenter.elementCounter);
    },
});

TestCase("[Multiple Gap] performAcceptDraggable interaction with elementCounter tests", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();

        this.presenter.itemCounterMode = false;
        this.presenter.configuration = {
            isActivity: true,
            blockWrongAnswers: false,
            sourceType: 1,
        };

        this.presenter.elementCounter = 1;
        this.item = {type: 'string', value: 'Item 4', item: 'Source_list1-4'};

        this.isShowingAnswersStub = sinon.stub(this.presenter, 'isShowingAnswers');
        this.isShowingAnswersStub.returns(false);
        this.maximumItemCountReachedStub = sinon.stub(this.presenter, 'maximumItemCountReached');
        this.maximumItemCountReachedStub.returns(false);
        this.isElementCorrectStub = sinon.stub(this.presenter, 'isElementCorrect');
        this.isElementCorrectStub.returns(true);
        this.createDraggablePlaceholderBaseStub = sinon.stub(this.presenter, 'createDraggablePlaceholderBase');
        this.createDraggablePlaceholderBaseStub.returns($("<div></div>"));
        this.createDraggableItemStub = sinon.stub(this.presenter, 'createDraggableItem');
        this.createDraggableItemStub.returns($("<div></div>"));
        this.updateLaTeXStub = sinon.stub(this.presenter, 'updateLaTeX');
        this.positionDraggableItemStub = sinon.stub(this.presenter, 'positionDraggableItem');
        this.getAltTextStub = sinon.stub(this.presenter, 'getAltText');
        this.getAltTextStub.returns("Kot");
        this.clearSelectedStub = sinon.stub(this.presenter, 'clearSelected');
        this.makePlaceholderDraggableStub = sinon.stub(this.presenter, 'makePlaceholderDraggable');

        this.presenter.$view = $("<div><div class='multiplegap_placeholders'></div></div>");
    },

    tearDown: function () {
        this.presenter.isShowingAnswers.restore();
        this.presenter.maximumItemCountReached.restore();
        this.presenter.isElementCorrect.restore();
        this.presenter.createDraggablePlaceholderBase.restore();
        this.presenter.createDraggableItem.restore();
        this.presenter.updateLaTeX.restore();
        this.presenter.positionDraggableItem.restore();
        this.presenter.getAltText.restore();
        this.presenter.clearSelected.restore();
        this.presenter.makePlaceholderDraggable.restore();
    },

    'test given elementCounter when consumed element then value should increase by 1': function () {
        this.presenter.selectedItem = {type: 'string', value: 'Item 4', item: 'Source_list1-4'};

        const expectedValue = this.presenter.elementCounter + 1;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, false, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    setUpToConsumeWrongElementInBlockWrongAnswersMode: function () {
        this.presenter.selectedItem = {type: 'string', value: 'Item 4', item: 'Source_list1-4'};
        this.presenter.configuration.blockWrongAnswers = true;
        this.isElementCorrectStub.returns(false);
    },

    'test given elementCounter when performed try to consume wrong element and blocked wrong answers then should not change value': function () {
        this.setUpToConsumeWrongElementInBlockWrongAnswersMode();

        const expectedValue = this.presenter.elementCounter;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, false, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    'test given elementCounter when performed try to consume wrong element, blocked wrong answers and showing answers then increase value by 1': function () {
        this.setUpToConsumeWrongElementInBlockWrongAnswersMode();
        this.isShowingAnswersStub.returns(true);

        const expectedValue = this.presenter.elementCounter + 1;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, false, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    setUpToConsumeNullElement: function () {
        this.presenter.selectedItem = null;
    },

    'test given elementCounter when performed try to consume null element without force then should not change value': function () {
        this.setUpToConsumeNullElement();

        const expectedValue = this.presenter.elementCounter;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, false, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    'test given elementCounter when performed try to consume null element without force and showing answers then increase value by 1': function () {
        this.setUpToConsumeNullElement();
        this.isShowingAnswersStub.returns(true);

        const expectedValue = this.presenter.elementCounter + 1;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, false, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    'test given elementCounter when performed try to consume null element with force then increase value by 1': function () {
        this.setUpToConsumeNullElement();

        const expectedValue = this.presenter.elementCounter + 1;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, true, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    'test given elementCounter when performed try to consume null element with force and showing answers then increase value by 1': function () {
        this.setUpToConsumeNullElement();
        this.isShowingAnswersStub.returns(true);

        const expectedValue = this.presenter.elementCounter + 1;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, true, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    setUpToConsumeElementWhenMaximumItemCountReached: function () {
        this.presenter.selectedItem = {type: 'string', value: 'Item 4', item: 'Source_list1-4'};
        this.maximumItemCountReachedStub.returns(true);
    },

    'test given elementCounter when performed try to consume element and maximum item count reached then not change value': function () {
        this.setUpToConsumeElementWhenMaximumItemCountReached();

        const expectedValue = this.presenter.elementCounter;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, false, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },

    'test given elementCounter when performed try to consume element, maximum item count reached and showing answers then increase value by 1': function () {
        this.setUpToConsumeElementWhenMaximumItemCountReached();
        this.isShowingAnswersStub.returns(true);

        const expectedValue = this.presenter.elementCounter + 1;

        this.presenter.performAcceptDraggable('<div></div>', this.item, false, false, false);

        assertEquals(expectedValue, this.presenter.elementCounter);
    },
});
