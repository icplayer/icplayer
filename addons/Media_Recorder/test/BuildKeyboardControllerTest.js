TestCase("[Media Recorder] buildKeyboardController", {

    setUp: function () {
        this.presenter = new AddonMedia_Recorder_create();
        this.mediaRecorder = this.presenter.mediaRecorder;

        this.elements = [sinon.spy(), sinon.spy(), sinon.spy()];
    },

    'test given model with default mode when build keyboard controller will create keyboard controller with proper method' : function () {
        this.mediaRecorder.model = {
          "extendedMode": false,
        };
        this.mediaRecorder._getElementsForDefaultKeyboardNavigation = sinon.stub();
        this.mediaRecorder._getElementsForDefaultKeyboardNavigation.returns(this.elements);

        this.mediaRecorder._buildKeyboardController();

        assertTrue(this.mediaRecorder.keyboardControllerObject !== null);
        assertTrue(this.mediaRecorder._getElementsForDefaultKeyboardNavigation.calledOnce);
        assertEquals(this.mediaRecorder.keyboardControllerObject.keyboardNavigationElements, this.elements);
    },

    'test given model with extended mode when build keyboard controller will create keyboard controller with proper method' : function () {
        this.mediaRecorder.model = {
          "extendedMode": true,
        };
        this.mediaRecorder._getElementsForExtendedKeyboardNavigation = sinon.stub();
        this.mediaRecorder._getElementsForExtendedKeyboardNavigation.returns(this.elements);

        this.mediaRecorder._buildKeyboardController();

        assertTrue(this.mediaRecorder.keyboardControllerObject !== null);
        assertTrue(this.mediaRecorder._getElementsForExtendedKeyboardNavigation.calledOnce);
        assertEquals(this.mediaRecorder.keyboardControllerObject.keyboardNavigationElements, this.elements);
    },
});
