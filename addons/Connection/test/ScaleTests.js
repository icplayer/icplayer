TestCase("[Connection] Get element snappoint test", {

   setUp: function () {
       this.presenter = AddonConnection_create();

       this.stubs = {
           getScaleStub: sinon.stub(),
           outerWidthStub: sinon.stub(),
           outerHeightStub: sinon.stub(),
           parentsStub: sinon.stub(),
           offsetStub: sinon.stub()
       };

       this.stubs.getScaleStub.returns({X: 0.5, Y: 0.5});

       this.element = {
           outerWidth: this.stubs.outerWidthStub,
           parents:  this.stubs.parentsStub,
           outerHeight: this.stubs.outerHeightStub,
           offset: this.stubs.offsetStub
       };

       this.stubs.parentsStub.withArgs('.connectionLeftColumn').returns({length: 1});
       this.stubs.parentsStub.withArgs('.connectionRightColumn').returns({length: 0});
       this.stubs.offsetStub.returns({top: 10, left: 10});
       this.stubs.outerWidthStub.returns(10);
       this.stubs.outerHeightStub.returns(10);

       this.presenter.getScale = this.stubs.getScaleStub;
   },

    'test should return proper value of element offset': function () {
       var expected = [30, 25];

       var result = this.presenter.getElementSnapPoint(this.element);

       assertEquals(expected[0], result[0]);
       assertEquals(expected[1], result[1]);
    },

    'test should return proper value of offset without scale': function () {
       var expected = [20, 15];

       this.stubs.getScaleStub.returns({X: 1, Y: 1});
       this.presenter.getScale = this.stubs.getScaleStub;
       var result = this.presenter.getElementSnapPoint(this.element);

       assertEquals(expected[0], result[0]);
       assertEquals(expected[1], result[1]);
    },

    'test should return proper value of offset when in right column': function () {
       var expected = [20, 25];

       this.stubs.parentsStub.withArgs('.connectionLeftColumn').returns({length: 0});
       this.stubs.parentsStub.withArgs('.connectionRightColumn').returns({length: 1});

       var result = this.presenter.getElementSnapPoint(this.element);

       assertEquals(expected[0], result[0]);
       assertEquals(expected[1], result[1]);
    },

    'test should return proper value of offset when in right column and without scale': function () {
       var expected = [10, 15];

       this.stubs.getScaleStub.returns({X: 1, Y: 1});
       this.presenter.getScale = this.stubs.getScaleStub;
       this.stubs.parentsStub.withArgs('.connectionLeftColumn').returns({length: 0});
       this.stubs.parentsStub.withArgs('.connectionRightColumn').returns({length: 1});

       var result = this.presenter.getElementSnapPoint(this.element);

       assertEquals(expected[0], result[0]);
       assertEquals(expected[1], result[1]);
    }
});