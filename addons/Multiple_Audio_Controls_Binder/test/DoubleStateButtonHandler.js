TestCase("Handling Double State Button selection", {
   setUp: function () {
       this.presenter = AddonMultiple_Audio_Controls_Binder_create();

       this.audioModule = {
           play: sinon.stub()
       };

       this.connection = {
           Item: {
               ID: undefined
           },
           Audio: {
               state: "",
               getModule: sinon.stub().returns(this.audioModule)
           },
           DoubleStateButton: {
               state: ""
           }
       };

       this.presenter.configuration = {
           connections: {
               getConnectionWithDSB: sinon.stub().returns(this.connection),
               getConnectionsOtherThan: sinon.stub().returns([])
           }
       }
   },

    'test should call play when audioModule exists': function () {
       this.presenter.doubleStateButtonSelectionHandler();

       assertTrue(this.audioModule.play.called)
    },

    'test should call jumpToID before playing when audioModule has item': function () {
       this.connection.Item.ID = "item1";
       this.audioModule.jumpToID = sinon.stub();

       this.presenter.doubleStateButtonSelectionHandler();

       assertTrue(this.audioModule.jumpToID.called);
       assertTrue(this.audioModule.play.called);
       assertTrue(this.audioModule.jumpToID.calledBefore(this.audioModule.play));
    },

    'test should not call jumpToID when item.id is undefined but jumpToID function exists': function () {
       this.audioModule.jumpToID = sinon.stub();

       this.presenter.doubleStateButtonSelectionHandler();

       assertFalse(this.audioModule.jumpToID.called);
       assertTrue(this.audioModule.play.called);
       assertFalse(this.audioModule.jumpToID.calledBefore(this.audioModule.play));
    }
});