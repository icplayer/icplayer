TestCase("[Zoom Image] Destroy tests", {

    setUp: function () {
        this.presenter = AddonZoom_Image_create();

        this.stubs = {
            removeOpenedDialogStub: sinon.stub(this.presenter, 'removeOpenedDialog'),
            unbindEventsStub: sinon.stub(this.presenter, 'unbindEvents'),
        };
    },

    'test given addon when execute destroy method then method to unbind events should be called': function() {
        this.presenter.destroy();

        assertTrue(this.stubs.unbindEventsStub.calledOnce);
    },

    'test given opened modal when execute destroy method then method to remove dialog should be called': function() {
        this.presenter.isOpened = true;

        this.presenter.destroy();

        assertTrue(this.stubs.removeOpenedDialogStub.calledOnce);
    },

    'test given closed modal when execute destroy method then method to remove dialog should not be called': function() {
        this.presenter.isOpened = false;

        this.presenter.destroy();

        assertFalse(this.stubs.removeOpenedDialogStub.calledOnce);
    },
});
