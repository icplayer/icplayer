TestCase("[Multiple Gap] Commands", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'updateLaTeX');
        sinon.stub(this.presenter, 'getContainerElement');
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
        this.presenter.updateLaTeX.restore();
        this.presenter.getContainerElement.restore();
    },

    'test show command when addon is hidden' : function() {
        this.presenter.configuration.isVisible = false;

        this.presenter.show();

        assertTrue(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.updateLaTeX.calledOnce);
        assertTrue(this.presenter.getContainerElement.calledOnce);
    },

    'test show command when addon is visible' : function() {
        this.presenter.configuration.isVisible = true;

        this.presenter.show();

        assertTrue(this.presenter.configuration.isVisible);

        assertFalse(this.presenter.setVisibility.called);
        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.getContainerElement.called);
    },

    'test hide command when addon is visible' : function() {
        this.presenter.configuration.isVisible = true;

        this.presenter.hide();

        assertFalse(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.getContainerElement.called);
    },

    'test hide command when addon is hidden' : function() {
        this.presenter.configuration.isVisible = false;

        this.presenter.hide();

        assertFalse(this.presenter.configuration.isVisible);

        assertFalse(this.presenter.setVisibility.called);
        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.getContainerElement.called);
    }
});