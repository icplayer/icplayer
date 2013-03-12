TestCase('Show and hide tests', {
    setUp : function() {
        this.presenter = AddonDouble_State_Button_create();
        this.presenter.$view = $('<div></div>');
        this.presenter.configuration = {};

        sinon.spy(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'setElementSelection');
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
        this.presenter.setElementSelection.restore();
    },

    'test show command' : function() {
        this.presenter.show();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test hide command' : function() {
        this.presenter.hide();

        assertTrue(this.presenter.setVisibility.calledOnce);
        assertFalse(this.presenter.configuration.isVisible);
    }
});