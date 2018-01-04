TestCase('[eKeyboard] Clicking outside of keyboard tests', {
   setUp: function () {
       this.presenter = new AddoneKeyboard_create();

       this.stubs = {
           hideKeyboardStub: sinon.stub()
       };

        this.presenter.hideKeyboard = this.stubs.hideKeyboardStub;
       this.presenter.keyboardWrapper = document.createElement("div");
   },

    'test should not detect click outside of ekeyboard when target is the wrapper': function () {
        var event = {
            target: this.presenter.keyboardWrapper
        };

        this.presenter.clickedOutsideCallback(event);

        assertFalse(this.stubs.hideKeyboardStub.called);
    },

    'test should not detect click outside when target is descendant of wrapper': function () {
        var element = document.createElement("div");
        $(this.presenter.keyboardWrapper).append(element);
        var event = {
            target: element
        };

        this.presenter.clickedOutsideCallback(event);

        assertFalse(this.stubs.hideKeyboardStub.called);
    },

    'test should detect click outside when target is not the wrapper': function () {
        var element = document.createElement("div");
        var event = {
            target: element
        };

        this.presenter.clickedOutsideCallback(event);
        
        assertTrue(this.stubs.hideKeyboardStub.called);
    },
});