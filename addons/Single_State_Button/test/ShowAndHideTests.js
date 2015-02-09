TestCase('[Single State Button] Show and hide commands', {
    setUp : function() {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.$view = $('<div></div>');
        this.presenter.configuration = {};

        sinon.spy(this.presenter, 'setVisibility');
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
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