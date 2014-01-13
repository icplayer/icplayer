TestCase("[Text Identification] click handler", {
    setUp: function () {
        this.presenter = Addontext_identification_create();

        this.presenter.configuration = {
            isSelected: false,
            isErrorCheckingMode: false
        };

        sinon.stub(this.presenter, 'executeUserEventCode');
        sinon.stub(this.presenter, 'triggerSelectionChangeEvent');
        sinon.stub(this.presenter, 'applySelectionStyle');
    },

    tearDown: function () {
        this.presenter.executeUserEventCode.restore();
        this.presenter.triggerSelectionChangeEvent();
        this.presenter.applySelectionStyle.restore();
    },

    'test addon in error checking mode': function () {
        this.presenter.configuration.isErrorCheckMode = true;

        this.presenter.clickHandler(jQuery.Event( "click" ));

        assertFalse(this.presenter.executeUserEventCode.called);
        assertFalse(this.presenter.triggerSelectionChangeEvent.called);
        assertFalse(this.presenter.applySelectionStyle.called);
    },

    'test addon in work mode': function () {
        this.presenter.clickHandler(jQuery.Event( "click" ));

        assertTrue(this.presenter.executeUserEventCode.calledOnce);
        assertTrue(this.presenter.triggerSelectionChangeEvent.calledOnce);
        assertTrue(this.presenter.applySelectionStyle.calledOnce);
    },

    'test click handler stopped event propagation' : function() {
        var e = jQuery.Event( "click" );
        this.presenter.clickHandler(e);

        assertTrue(e.isPropagationStopped());
    }
});