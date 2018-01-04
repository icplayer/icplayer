TestCase("[eKeyboard] Close Button Tests", {
    setUp: function() {
        this.presenter = new AddoneKeyboard_create();

        this.stubs = {
            disableStub: sinon.stub()
        };

        this.presenter.disable = this.stubs.disableStub;

        this.presenter.keyboardWrapper = document.createElement("div");
        this.presenter.keyboardWrapper.className = "ui-ekeyboard-wrapper";
    },

    'test should create close button': function () {
        this.presenter.initializeCloseButton();

        var closeButton = $(this.presenter.keyboardWrapper).find('button');

        assertEquals(1, closeButton.length);
        assertEquals('eKeyboard-close-button', closeButton.attr('class'));
        assertEquals('eKeyboard-close-button', closeButton.attr('class'));
    },

    'test should execute close button callback': function () {
        this.presenter.initializeCloseButton();
        var closeButton = $(this.presenter.keyboardWrapper).find('button');
        closeButton.trigger('click');

        assertTrue(this.stubs.disableStub.called);
        assertFalse(closeButton.is(":visible"));
    },
});