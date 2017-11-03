TestCase("[Connection] Add tabindex for connection elements", {

   setUp: function () {
       this.presenter = AddonConnection_create();

       this.stubs = {
           isIDUniqueStub: sinon.stub().returns(true),
           addTabindexToElementStub: sinon.stub()
       };

       this.columnStub = {
           append: sinon.stub()
       };

       this.presenter.isIDUnique = this.stubs.isIDUniqueStub;
       this.presenter.addTabindexToElement = this.stubs.addTabindexToElementStub;

       this.presenter.isTabindexEnabled = true;
       this.presenter.model = {
           'Left column': [{
               'additional class':"",
               'connects to': "c",
               'content': " Sky is ",
               'id': "1"
           }, {
               'additional class':"",
               'connects to': "c",
               'content': " Grass is ",
               'id': "2"
           }]
       }
   },

    'test should set tabindex for innerWrapper when tabindex is true': function () {
        this.presenter.appendElements(0, this.presenter.model, 'Left column', this.columnStub, false);

        assertTrue(this.stubs.addTabindexToElementStub.called);
    },

    'test should not set tabindex for innerWrapper when tabindex is false': function () {
        this.presenter.isTabindexEnabled = false;
        this.presenter.appendElements(0, this.presenter.model, 'Left column', this.columnStub, false);

        assertFalse(this.stubs.addTabindexToElementStub.called);
    },

    'test should set tabindex for more than one element when tabindex is true': function () {
        for (var i = 0; i < this.presenter.model['Left column'].length; i++) {
            this.presenter.appendElements(i,this.presenter.model, 'Left column', this.columnStub, false);
        }

        var expectedValue = this.presenter.model['Left column'].length;

        assertEquals(expectedValue, this.stubs.addTabindexToElementStub.callCount);
    }
});