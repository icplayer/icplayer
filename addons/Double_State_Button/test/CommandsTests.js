TestCase('[Double State Button] Show and hide commands', {
    setUp : function() {
        this.presenter = AddonDouble_State_Button_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'setElementSelection');
        sinon.stub(this.presenter, 'updateLaTeX');
    },

    tearDown : function() {
        this.presenter.setVisibility.restore();
        this.presenter.setElementSelection.restore();
        this.presenter.updateLaTeX.restore();
    },

    'test show command when addon is hidden' : function() {
        this.presenter.configuration.isVisible = false;

        this.presenter.show();

        assertTrue(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.updateLaTeX.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);
    },

    'test show command when addon is visible' : function() {
        this.presenter.configuration.isVisible = true;

        this.presenter.show();

        assertTrue(this.presenter.configuration.isVisible);

        assertFalse(this.presenter.setVisibility.called);
        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.setElementSelection.called);
    },

    'test hide command when addon is visible' : function() {
        this.presenter.configuration.isVisible = true;

        this.presenter.hide();

        assertFalse(this.presenter.configuration.isVisible);

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.updateLaTeX.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);
    },

    'test hide command when addon is hidden' : function() {
        this.presenter.configuration.isVisible = false;

        this.presenter.hide();

        assertFalse(this.presenter.configuration.isVisible);

        assertFalse(this.presenter.setVisibility.called);
        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.setElementSelection.called);
    }
});

TestCase('[Double State Button] Enable and disable commands', {
    setUp : function() {
        this.presenter = AddonDouble_State_Button_create();

        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'toggleDisable');
        sinon.stub(this.presenter, 'setElementSelection');
        sinon.stub(this.presenter, 'updateLaTeX');
    },

    tearDown : function() {
        this.presenter.toggleDisable.restore();
        this.presenter.setElementSelection.restore();
        this.presenter.updateLaTeX.restore();
    },

    'test enable command when addon is enabled' : function() {
        this.presenter.configuration.isDisabled = false;

        this.presenter.enable();

        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.toggleDisable.called);
        assertFalse(this.presenter.setElementSelection.called);
    },

    'test enable command when addon is disabled' : function() {
        this.presenter.configuration.isDisabled = true;

        this.presenter.enable();

        assertTrue(this.presenter.updateLaTeX.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledWith(false));
        assertTrue(this.presenter.setElementSelection.calledOnce);
    },

    'test disable command when addon is disabled' : function() {
        this.presenter.configuration.isDisabled = true;

        this.presenter.disable();

        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.toggleDisable.called);
        assertFalse(this.presenter.setElementSelection.called);
    },

    'test disable command when addon is enabled' : function() {
        this.presenter.configuration.isDisabled = false;

        this.presenter.disable();

        assertTrue(this.presenter.updateLaTeX.calledOnce);
        assertTrue(this.presenter.toggleDisable.calledWith(true));
        assertTrue(this.presenter.setElementSelection.calledOnce);
    }
});

TestCase('[Double State Button] Select and deselect commands', {
    setUp : function() {
        this.presenter = AddonDouble_State_Button_create();
        this.presenter.configuration = {};

        sinon.stub(this.presenter, 'setElementSelection');
        sinon.stub(this.presenter, 'updateLaTeX');
    },

    tearDown : function() {
        this.presenter.setElementSelection.restore();
        this.presenter.updateLaTeX.restore();
    },

    'test select command when addon is deselected' : function() {
        this.presenter.configuration.isSelected = false;

        this.presenter.select();

        assertTrue(this.presenter.configuration.isSelected);

        assertTrue(this.presenter.updateLaTeX.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);
    },

    'test select command when addon is selected' : function() {
        this.presenter.configuration.isSelected = true;

        this.presenter.select();

        assertTrue(this.presenter.configuration.isSelected);

        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.setElementSelection.called);
    },

    'test deselect command when addon is selected' : function() {
        this.presenter.configuration.isSelected = true;

        this.presenter.deselect();

        assertFalse(this.presenter.configuration.isSelected);

        assertTrue(this.presenter.updateLaTeX.calledOnce);
        assertTrue(this.presenter.setElementSelection.calledOnce);
    },

    'test deselect command when addon is deselected' : function() {
        this.presenter.configuration.isSelected = false;

        this.presenter.deselect();

        assertFalse(this.presenter.configuration.isSelected);

        assertFalse(this.presenter.updateLaTeX.called);
        assertFalse(this.presenter.setElementSelection.called);
    }
});