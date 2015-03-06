TestCase('[Double State Button] Reset command', {
    setUp : function() {
        this.presenter = AddonDouble_State_Button_create();
        this.presenter.configuration = { isErrorMode: true };
        this.presenter.$view = $('<div></div>');

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hide');
        sinon.stub(this.presenter, 'setElementSelection');
        sinon.stub(this.presenter, 'updateLaTeX');
    },

    tearDown : function() {
        this.presenter.show.restore();
        this.presenter.hide.restore();
        this.presenter.setElementSelection.restore();
        this.presenter.updateLaTeX.restore();
    },

    'test invisible to invisible' : function() {
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test invisible to visible' : function() {
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = false;

        this.presenter.reset();

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test visible to invisible' : function() {
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test visible to visible' : function() {
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertTrue(this.presenter.show.calledOnce);
        assertFalse(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test disabled to disabled' : function() {
        this.presenter.configuration.isDisabledByDefault = true;
        this.presenter.configuration.isDisabled = true;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isDisabled);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test enabled to disabled' : function() {
        this.presenter.configuration.isDisabledByDefault = false;
        this.presenter.configuration.isDisabled = true;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isDisabled);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test enabled to enabled' : function() {
        this.presenter.configuration.isDisabledByDefault = true;
        this.presenter.configuration.isDisabled = true;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isDisabled);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test disabled to enabled' : function() {
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertFalse(this.presenter.show.calledOnce);
        assertTrue(this.presenter.hide.calledOnce);
        assertFalse(this.presenter.configuration.isErrorMode);
    },

    'test selected to selected' : function() {
        this.presenter.configuration.isSelectedByDefault = true;
        this.presenter.configuration.isSelected = true;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isSelected);
    },

    'test deselected to deselected' : function() {
        this.presenter.configuration.isSelectedByDefault = false;
        this.presenter.configuration.isSelected = false;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isSelected);
    },

    'test selected to deselected' : function() {
        this.presenter.configuration.isSelectedByDefault = false;
        this.presenter.configuration.isSelected = true;

        this.presenter.reset();

        assertFalse(this.presenter.configuration.isSelected);
    },

    'test deselected to selected' : function() {
        this.presenter.configuration.isSelectedByDefault = true;
        this.presenter.configuration.isSelected = false;

        this.presenter.reset();

        assertTrue(this.presenter.configuration.isSelected);
    }
});