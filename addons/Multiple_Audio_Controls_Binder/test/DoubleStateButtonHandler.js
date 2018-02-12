TestCase("[Multiple_Audio_Controler_Binder] Handling Double State Button selection", {
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

    'test should call play with ID Item1': function () {
       this.connection.Item.Digit = 'Item1';

       this.presenter.doubleStateButtonSelectionHandler();

       assertTrue(this.audioModule.play.calledWith('Item1'))
    }
});