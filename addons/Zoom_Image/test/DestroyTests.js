TestCase("[Zoom Image] Destroy tests", {

    setUp: function () {
        this.presenter = AddonZoom_Image_create();

        this.view = document.createElement('div');
        this.presenter.view = this.view;
        this.destroyEvent = {
            target: this.view
        };

        this.presenter.$image = {
            dialog: function (command) {}
        };

        this.stubs = {
            removeOpenedDialogStub: sinon.stub(this.presenter, 'removeOpenedDialog'),
            unbindEventsStub: sinon.stub(this.presenter, 'unbindEvents'),
        };
    },

    'test event for another view when execute destroy method then executing rest of destroy methods should be stopped': function() {
        this.presenter.destroy({target: document.createElement('a')});

        assertFalse(this.stubs.removeOpenedDialogStub.called);
        assertFalse(this.stubs.unbindEventsStub.called);
    },

    'test given addon when execute destroy method then method to unbind events should be called': function() {
        this.presenter.destroy(this.destroyEvent);

        assertTrue(this.stubs.unbindEventsStub.calledOnce);
    },

    'test given opened modal when execute destroy method then method to remove dialog should be called': function() {
        this.presenter.isOpened = true;

        this.presenter.destroy(this.destroyEvent);

        assertTrue(this.stubs.removeOpenedDialogStub.calledOnce);
    },

    'test given closed modal when execute destroy method then method to remove dialog should not be called': function() {
        this.presenter.isOpened = false;

        this.presenter.destroy(this.destroyEvent);

        assertFalse(this.stubs.removeOpenedDialogStub.calledOnce);
    },
});
