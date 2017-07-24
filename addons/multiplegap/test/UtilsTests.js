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