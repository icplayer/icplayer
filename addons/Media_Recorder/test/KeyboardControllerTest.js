TestCase("[Media Recorder] Keyboard controller test - default mode", {

    CSS_CLASSES: getCSSClasses(),

    setUp: function () {
        this.presenter = new AddonMedia_Recorder_create();
        this.mediaRecorder = this.presenter.mediaRecorder;

        this.model = {
          ID: "Media_Recorder1",
          "Is Visible": true,
          isShowedDefaultRecordingButton: true,
          isDisabled: false,
          extendedMode: false,
          disableRecording: false,
        };
        this.mediaRecorder.model = this.model;

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            isPlayingDefaultRecording: sinon.stub(),
            isRecording: sinon.stub(),
            isPlaying: sinon.stub(),
            isInactive: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.stubs.isPlayingDefaultRecording.returns(false);
        this.stubs.isRecording.returns(false);
        this.stubs.isPlaying.returns(false);
        this.stubs.isInactive.returns(false);

        this.activationState = {
            isInactive: this.stubs.isInactive,
        }

        this.mediaState = {
            isPlayingDefaultRecording: this.stubs.isPlayingDefaultRecording,
            isRecording: this.stubs.isRecording,
            isPlaying: this.stubs.isPlaying,
        }

        this.mediaRecorder.activationState = this.activationState;
        this.mediaRecorder.mediaState = this.mediaState;
        this.createViewAndKeyboardController();
    },

    createViewAndKeyboardController: function () {
        this.createView();
        this.createKeyboardController();
    },

    createView: function () {
        this.mediaRecorder.view = $('<div></div>');
        this.presenter.$view = this.mediaRecorder.view;

        let $mainView = $(`<div></div>`);
        $mainView.addClass("addon_Media_Recorder");

        let $wrapper = $(`<div></div>`);
        $wrapper.addClass(this.CSS_CLASSES.WRAPPER);
        if (this.model.isDisabled) {
            $wrapper.addClass(this.CSS_CLASSES.DISABLED);
        }
        $wrapper.appendTo($mainView);

        let $playerWrapper = $(`<div></div>`);
        $playerWrapper.addClass(this.CSS_CLASSES.PLAYER_WRAPPER);
        $playerWrapper.appendTo($wrapper);

        let $interfaceWrapper = this.generateInterfaceWrapper();
        $interfaceWrapper.appendTo($wrapper);

        let $resetDialog = this.generateResetDialog();
        $resetDialog.appendTo($wrapper);

        $mainView.appendTo(this.mediaRecorder.view);
    },

    createKeyboardController: function () {
        this.mediaRecorder._buildKeyboardController();
        this.keyboardControllerObject = this.mediaRecorder.keyboardControllerObject;
        setSpeechTexts(this.keyboardControllerObject);
        this.keyboardControllerObject.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
    },

    generateInterfaceWrapper: function () {
        let $interfaceWrapper = $(`<div></div>`);
        $interfaceWrapper.addClass("media-recorder-interface-wrapper");

        this.$defaultRecordingPlayButton = generateDefaultRecordingPlayButton(
            this.CSS_CLASSES,
            this.model.isShowedDefaultRecordingButton
        );
        $interfaceWrapper.append(this.$defaultRecordingPlayButton);

        this.$recordingButton = generateRecordingButton(
            this.CSS_CLASSES,
            true
        );
        $interfaceWrapper.append(this.$recordingButton);

        this.$playButton = generatePlayButton(
            this.CSS_CLASSES,
            !this.model.disableRecording
        );
        $interfaceWrapper.append(this.$playButton);

        let $timer = generateTimer(this.CSS_CLASSES);
        $interfaceWrapper.append($timer);

        let $soundIntensity = generateSoundIntensity(this.CSS_CLASSES);
        $interfaceWrapper.append($soundIntensity);

        let $dottedSoundIntensity = generateDottedSoundIntensity(this.CSS_CLASSES);
        $interfaceWrapper.append($dottedSoundIntensity);

        let $progressBar = generateProgressBar(this.CSS_CLASSES);
        $interfaceWrapper.append($progressBar);

        this.$resetButton = generateResetButton(
            this.CSS_CLASSES,
            false
        );
        $interfaceWrapper.append(this.$resetButton);

        this.$downloadButton = generateDownloadButton(
            this.CSS_CLASSES,
            false
        );
        $interfaceWrapper.append(this.$downloadButton);

        return $interfaceWrapper;
    },

    generateResetDialog: function (){
        let $mainDiv = $(`<div></div>`);

        let $resetDialog = $(`<div></div>`);
        $resetDialog.addClass(this.CSS_CLASSES.RESET_DIALOG);
        $resetDialog.appendTo($mainDiv);

        this.$dialogText = generateDialogText(this.CSS_CLASSES);
        this.$dialogText.appendTo($resetDialog);

        let $dialogButtons = $(`<div></div>`);
        $dialogButtons.addClass("dialog-buttons");
        $dialogButtons.appendTo($resetDialog);

        this.$confirmButton = generateConfirmButton(this.CSS_CLASSES);
        this.$confirmButton.appendTo($dialogButtons);

        this.$denyButton = generateDenyButton(this.CSS_CLASSES);
        this.$denyButton.appendTo($dialogButtons);

        return $mainDiv;
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForDisabledDefaultRecordingPlayButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDefaultRecordingPlayButton(this.keyboardControllerObject, this.getFirstReadText(), true);
    },

    validateTTSForDefaultRecordingPlayButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDefaultRecordingPlayButton(this.keyboardControllerObject, this.getFirstReadText(), false);
    },

    validateTTSForDisabledRecordingButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForRecordingButton(this.keyboardControllerObject, this.getFirstReadText(), true);
    },

    validateTTSForRecordingButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForRecordingButton(this.keyboardControllerObject, this.getFirstReadText(), false);
    },

    validateTTSForDisabledPlayButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForPlayButton(this.keyboardControllerObject, this.getFirstReadText(), true);
    },

    validateTTSForPlayButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForPlayButton(this.keyboardControllerObject, this.getFirstReadText(), false);
    },

    validateSpaceTTSOfDisabledElement: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateSpaceTTSOfDisabledElement(this.keyboardControllerObject, this.getFirstReadText());
    },

    validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass: function () {
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$defaultRecordingPlayButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$recordingButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$playButton));
    },

    validateOnlyRecordingButtonHasKeyboardNavigationActiveClass: function () {
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$defaultRecordingPlayButton));
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$recordingButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$playButton));
    },

    validateOnlyPlayButtonHasKeyboardNavigationActiveClass: function () {
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$defaultRecordingPlayButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$recordingButton));
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$playButton));
    },

    // Keyboard controller tests

    "test given keyboard controller when given default model should have only 3 buttons": function () {
        let expectedElements = [
            this.$defaultRecordingPlayButton,
            this.$recordingButton,
            this.$playButton,
        ];

        assertEquals(expectedElements.length, this.keyboardControllerObject.keyboardNavigationElements.length);
        for (let i = 0; i < expectedElements.length; i++) {
            assertEquals(expectedElements[i][0], this.keyboardControllerObject.keyboardNavigationElements[i]);
        }
    },

    // Full navigation path tests when active TTS or keyboard navigation

    'test given view when all elements are active then full path of keyboard navigation should mark elements one by one': function () {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when all elements are active then full path of navigation with TTS should mark elements one by one': function () {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when recording button and play button are active then full path of keyboard navigation should mark elements one by one': function () {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when recording button and play button are active then full path of navigation with TTS should mark elements one by one': function () {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when only recording button is active then keyboard navigation navigate only on him': function () {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.model["disableRecording"] = true;
        this.createViewAndKeyboardController();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when only recording button is active then navigation with TTS navigate only on him': function () {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.model["disableRecording"] = true;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    // First enter tests when active default recording play button

    'test given view when entering for the first time by keyboard navigation and active default recording play button should mark defaultRecordingPlayButton' : function() {
        activateEnterEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by TTS and active default recording play button should mark defaultRecordingPlayButton' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by keyboard navigation and active default recording play button should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering for the first time by TTS and active default recording play button should call tts.read with proper text' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForDefaultRecordingPlayButton();
    },

    'test given view when entering for the first time by keyboard navigation, active default recording play button and addon is disabled should mark defaultRecordingPlayButton' : function() {
        this.stubs.isInactive.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by TTS, active default recording play button and addon is disabled should mark defaultRecordingPlayButton' : function() {
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering by TTS, active default recording play button and addon is disabled should call tts.read with proper text' : function() {
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledDefaultRecordingPlayButton();
    },

    // First enter tests when not active default recording play button

    'test given view when entering for the first time by keyboard navigation should mark recordingButton' : function() {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by TTS should mark recordingButton' : function() {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by keyboard navigation should not call tts.read' : function() {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering for the first time by TTS should call tts.read with proper text' : function() {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForRecordingButton();
    },

    'test given view when entering for the first time by keyboard navigation and addon is disabled should mark recordingButton' : function() {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        this.stubs.isInactive.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by TTS and addon is disabled should mark recordingButton' : function() {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering by TTS and addon is disabled should call tts.read with proper text of recordingButton' : function() {
        this.model["isShowedDefaultRecordingButton"] = false;
        this.createViewAndKeyboardController();
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledRecordingButton();
    },

    // Blocked navigation when first enter tests

    'test given view when is playing default recording, keyboard navigation active and entering for the first time should mark defaultRecordingPlayButton' : function() {
        this.stubs.isPlayingDefaultRecording.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is playing default recording, TTS active and entering for the first time should mark defaultRecordingPlayButton' : function() {
        this.stubs.isPlayingDefaultRecording.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is playing default recording, TTS active and entering for the first time should not call tts.speak' : function() {
        this.stubs.isPlayingDefaultRecording.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when is recording, keyboard navigation active and entering for the first time should mark recordingButton' : function() {
        this.stubs.isRecording.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is recording, TTS active and entering for the first time should mark recordingButton' : function() {
        this.stubs.isRecording.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is recording, TTS active and entering for the first time should not call tts.speak' : function() {
        this.stubs.isRecording.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when is playing, keyboard navigation active and entering for the first time should mark playButton' : function() {
        this.stubs.isPlaying.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is playing, TTS active and entering for the first time should mark playButton' : function() {
        this.stubs.isPlaying.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is playing, TTS active and entering for the first time should not call tts.speak' : function() {
        this.stubs.isPlaying.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    // Default recording play button tests

    'test given view when entering on defaultRecordingPlayButton by keyboard navigation should mark defaultRecordingPlayButton' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on defaultRecordingPlayButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on defaultRecordingPlayButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on defaultRecordingPlayButton by TTS should mark defaultRecordingPlayButton' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on defaultRecordingPlayButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDefaultRecordingPlayButton();
    },

    'test given view when activate enter on defaultRecordingPlayButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDefaultRecordingPlayButton();
    },

    'test given view when entering on defaultRecordingPlayButton and addon is disabled by TTS should mark defaultRecordingPlayButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDefaultRecordingPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on defaultRecordingPlayButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledDefaultRecordingPlayButton();
    },

    'test given view when activate enter on defaultRecordingPlayButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledDefaultRecordingPlayButton();
    },

    'test given view when activate space on defaultRecordingPlayButton and addon is disabled by TTS should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },

    // Recording button tests

    'test given view when entering on recordingButton by keyboard navigation should mark recordingButton' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on recordingButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on recordingButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on recordingButton by TTS should mark recordingButton' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on recordingButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateTabEvent(this.presenter);

        this.validateTTSForRecordingButton();
    },

    'test given view when activate enter on recordingButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForRecordingButton();
    },

    'test given view when entering on recordingButton and addon is disabled by TTS should mark recordingButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on recordingButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDefaultRecordingPlayButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledRecordingButton();
    },

    'test given view when activate enter on recordingButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledRecordingButton();
    },

    'test given view when activate space on recordingButton and addon is disabled by TTS should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },

    // Play button tests

    'test given view when entering on playButton by keyboard navigation should mark playButton' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on playButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on playButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markPlayButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on playButton by TTS should mark playButton' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on playButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateTTSForPlayButton();
    },

    'test given view when activate enter on playButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markPlayButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForPlayButton();
    },

    'test given view when entering on playButton and addon is disabled by TTS should mark playButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on playButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledPlayButton();
    },

    'test given view when activate enter on playButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledPlayButton();
    },

    'test given view when activate space on playButton and addon is disabled by TTS should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },
});

TestCase("[Media Recorder] Keyboard controller test - extended mode", {

    CSS_CLASSES: getCSSClasses(),

    setUp: function () {
        this.presenter = new AddonMedia_Recorder_create();
        this.mediaRecorder = this.presenter.mediaRecorder;

        this.model = {
            ID: "Media_Recorder1",
            "Is Visible": true,
            isShowedDefaultRecordingButton: true,
            isDisabled: false,
            extendedMode: true,
            disableRecording: false,
            langAttribute: "",
        };
        this.mediaRecorder.model = this.model;
        this.isAfterRecording = true;

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            isPlayingDefaultRecording: sinon.stub(),
            isRecording: sinon.stub(),
            isPlaying: sinon.stub(),
            isInactive: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.stubs.isPlayingDefaultRecording.returns(false);
        this.stubs.isRecording.returns(false);
        this.stubs.isPlaying.returns(false);
        this.stubs.isInactive.returns(false);

        this.activationState = {
            isInactive: this.stubs.isInactive,
        }

        this.mediaState = {
            isPlayingDefaultRecording: this.stubs.isPlayingDefaultRecording,
            isRecording: this.stubs.isRecording,
            isPlaying: this.stubs.isPlaying,
        }

        this.mediaRecorder.activationState = this.activationState;
        this.mediaRecorder.mediaState = this.mediaState;
        this.createViewAndKeyboardController();
    },

    createViewAndKeyboardController: function () {
        this.createView();
        this.createKeyboardController();
    },

    createView: function () {
        this.mediaRecorder.view = $('<div></div>');
        this.presenter.$view = this.mediaRecorder.view;

        let $mainView = $(`<div></div>`);
        $mainView.addClass("addon_Media_Recorder");

        let $wrapper = $(`<div></div>`);
        $wrapper.addClass(this.CSS_CLASSES.WRAPPER);
        if (this.model.isDisabled) {
            $wrapper.addClass(this.CSS_CLASSES.DISABLED);
        }
        $wrapper.appendTo($mainView);

        let $playerWrapper = $(`<div></div>`);
        $playerWrapper.addClass(this.CSS_CLASSES.PLAYER_WRAPPER);
        $playerWrapper.appendTo($wrapper);

        let $interfaceWrapper = this.generateInterfaceWrapper();
        $interfaceWrapper.appendTo($wrapper);

        let $resetDialog = this.generateResetDialog();
        $resetDialog.appendTo($wrapper);

        $mainView.appendTo(this.mediaRecorder.view);
    },

    createKeyboardController: function () {
        this.mediaRecorder._buildKeyboardController();
        this.keyboardControllerObject = this.mediaRecorder.keyboardControllerObject;
        setSpeechTexts(this.keyboardControllerObject);
        this.keyboardControllerObject.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
    },

    generateInterfaceWrapper: function () {
        let $interfaceWrapper = $(`<div></div>`);
        $interfaceWrapper.addClass("media-recorder-interface-wrapper");

        this.$defaultRecordingPlayButton = generateDefaultRecordingPlayButton(
            this.CSS_CLASSES,
            false
        );
        $interfaceWrapper.append(this.$defaultRecordingPlayButton);

        this.$recordingButton = generateRecordingButton(
            this.CSS_CLASSES,
            !this.isAfterRecording
        );
        $interfaceWrapper.append(this.$recordingButton);

        this.$playButton = generatePlayButton(
            this.CSS_CLASSES,
            this.isAfterRecording
        );
        $interfaceWrapper.append(this.$playButton);

        let $timer = generateTimer(this.CSS_CLASSES);
        $interfaceWrapper.append($timer);

        let $soundIntensity = generateSoundIntensity(this.CSS_CLASSES, false);
        $interfaceWrapper.append($soundIntensity);

        let $dottedSoundIntensity = generateDottedSoundIntensity(this.CSS_CLASSES, true);
        $interfaceWrapper.append($dottedSoundIntensity);

        let $progressBar = generateProgressBar(this.CSS_CLASSES);
        $interfaceWrapper.append($progressBar);

        this.$resetButton = generateResetButton(
            this.CSS_CLASSES,
            this.isAfterRecording
        );
        $interfaceWrapper.append(this.$resetButton);

        this.$downloadButton = generateDownloadButton(
            this.CSS_CLASSES,
            this.isAfterRecording
        );
        $interfaceWrapper.append(this.$downloadButton);

        return $interfaceWrapper;
    },

    generateResetDialog: function (){
        let $mainDiv = $(`<div></div>`);

        let $resetDialog = $(`<div></div>`);
        $resetDialog.addClass(this.CSS_CLASSES.RESET_DIALOG);
        $resetDialog.appendTo($mainDiv);

        this.$dialogText = generateDialogText(this.CSS_CLASSES);
        this.$dialogText.appendTo($resetDialog);

        let $dialogButtons = $(`<div></div>`);
        $dialogButtons.addClass("dialog-buttons");
        $dialogButtons.appendTo($resetDialog);

        this.$confirmButton = generateConfirmButton(this.CSS_CLASSES);
        this.$confirmButton.appendTo($dialogButtons);

        this.$denyButton = generateDenyButton(this.CSS_CLASSES);
        this.$denyButton.appendTo($dialogButtons);

        return $mainDiv;
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForDisabledRecordingButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForRecordingButton(this.keyboardControllerObject, this.getFirstReadText(), true);
    },

    validateTTSForRecordingButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForRecordingButton(this.keyboardControllerObject, this.getFirstReadText(), false);
    },

    validateTTSForDisabledPlayButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForPlayButton(this.keyboardControllerObject, this.getFirstReadText(), true);
    },

    validateTTSForPlayButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForPlayButton(this.keyboardControllerObject, this.getFirstReadText(), false);
    },

    validateTTSForDisabledResetButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForResetButton(this.keyboardControllerObject, this.getFirstReadText(), true);
    },

    validateTTSForResetButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForResetButton(this.keyboardControllerObject, this.getFirstReadText(), false);
    },

    validateTTSForDisabledDownloadButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDownloadButton(this.keyboardControllerObject, this.getFirstReadText(), true);
    },

    validateTTSForDownloadButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDownloadButton(this.keyboardControllerObject, this.getFirstReadText(), false);
    },

    validateSpaceTTSOfDisabledElement: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateSpaceTTSOfDisabledElement(this.keyboardControllerObject, this.getFirstReadText());
    },

    validateOnlyRecordingButtonHasKeyboardNavigationActiveClass: function () {
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$recordingButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$playButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$resetButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$downloadButton));
    },

    validateOnlyPlayButtonHasKeyboardNavigationActiveClass: function () {
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$recordingButton));
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$playButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$resetButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$downloadButton));
    },

    validateOnlyResetButtonHasKeyboardNavigationActiveClass: function () {
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$recordingButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$playButton));
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$resetButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$downloadButton));
    },

    validateOnlyDownloadButtonHasKeyboardNavigationActiveClass: function () {
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$recordingButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$playButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$resetButton));
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$downloadButton));
    },

    // Keyboard controller tests

    "test given keyboard controller when given default model should have only 4 buttons": function () {
        let expectedElements = [
            this.$recordingButton,
            this.$playButton,
            this.$resetButton,
            this.$downloadButton,
        ];

        assertEquals(expectedElements.length, this.keyboardControllerObject.keyboardNavigationElements.length);
        for (let i = 0; i < expectedElements.length; i++) {
            assertEquals(expectedElements[i][0], this.keyboardControllerObject.keyboardNavigationElements[i]);
        }
    },

    // Full navigation path tests when active TTS or keyboard navigation

    'test given view before recording then keyboard navigation should navigate only on recording button': function () {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view before recording then navigation with TTS should navigate only on recording button': function () {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view after recording then keyboard navigation should navigate only on play, reset and download buttons': function () {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyResetButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDownloadButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view after recording then navigation with TTS should navigate only on play, reset and download buttons': function () {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyResetButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDownloadButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    // First enter before recording tests

    'test given view before recording when entering for the first time by keyboard navigation should mark recordingButton' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view before recording when entering for the first time by navigation with TTS should mark recordingButton' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given before recording view when entering for the first time by keyboard navigation should not call tts.read' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given before recording view when entering for the first time by navigation with TTS should call tts.read with proper text' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForRecordingButton();
    },

    'test given before recording view when entering for the first time by keyboard navigation and addon is disabled should mark recordingButton' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.stubs.isInactive.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given before recording view when entering for the first time by TTS and addon is disabled should mark recordingButton' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view before recording when entering by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledRecordingButton();
    },

    // First enter after recording tests

    'test given view after recording when entering for the first time by keyboard navigation should mark playButton' : function() {
        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view after recording when entering for the first time by navigation with TTS should mark playButton' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given after recording view when entering for the first time by keyboard navigation should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given after recording view when entering for the first time by navigation with TTS should call tts.read with proper text' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForPlayButton();
    },

    'test given after recording view when entering for the first time by keyboard navigation and addon is disabled should mark playButton' : function() {
        this.stubs.isInactive.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given after recording view when entering for the first time by TTS and addon is disabled should mark playButton' : function() {
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view after recording when entering by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledPlayButton();
    },

    // Blocked navigation when first enter tests

    'test given view when is recording, keyboard navigation active and entering for the first time should mark recordingButton' : function() {
        this.stubs.isRecording.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is recording, TTS active and entering for the first time should mark recordingButton' : function() {
        this.stubs.isRecording.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is recording, TTS active and entering for the first time should not call tts.speak' : function() {
        this.stubs.isRecording.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when is playing, keyboard navigation active and entering for the first time should mark playButton' : function() {
        this.stubs.isPlaying.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is playing, TTS active and entering for the first time should mark playButton' : function() {
        this.stubs.isPlaying.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when is playing, TTS active and entering for the first time should not call tts.speak' : function() {
        this.stubs.isPlaying.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    // Recording button tests

    'test given view when entering on recordingButton by keyboard navigation should mark recordingButton' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on recordingButton by keyboard navigation should not call tts.read' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on recordingButton by keyboard navigation should not call tts.read' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markRecordingButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on recordingButton by TTS should mark recordingButton' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on recordingButton by TTS should call tts.read with proper text' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateTTSForRecordingButton();
    },

    'test given view when activate enter on recordingButton by TTS should call tts.read with proper text' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markRecordingButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForRecordingButton();
    },

    'test given view when entering on recordingButton and addon is disabled by TTS should mark recordingButton' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateOnlyRecordingButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on recordingButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledRecordingButton();
    },

    'test given view when activate enter on recordingButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledRecordingButton();
    },

    'test given view when activate space on recordingButton and addon is disabled by TTS should call tts.read selected' : function() {
        this.isAfterRecording = false;
        this.createViewAndKeyboardController();
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markRecordingButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },

    // Play button tests

    'test given view when entering on playButton by keyboard navigation should mark playButton' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markDownloadButton();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on playButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markDownloadButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on playButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markPlayButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on playButton by TTS should mark playButton' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markDownloadButton();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on playButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markDownloadButton();

        activateTabEvent(this.presenter);

        this.validateTTSForPlayButton();
    },

    'test given view when activate enter on playButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markPlayButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForPlayButton();
    },

    'test given view when entering on playButton and addon is disabled by TTS should mark playButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDownloadButton();

        activateTabEvent(this.presenter);

        this.validateOnlyPlayButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on playButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDownloadButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledPlayButton();
    },

    'test given view when activate enter on playButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledPlayButton();
    },

    'test given view when activate space on playButton and addon is disabled by TTS should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },

    // Reset button tests

    'test given view when entering on resetButton by keyboard navigation should mark resetButton' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyResetButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on resetButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on resetButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markResetButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on resetButton by TTS should mark resetButton' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyResetButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on resetButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateTTSForResetButton();
    },

    'test given view when activate enter on resetButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markResetButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForResetButton();
    },

    'test given view when entering on resetButton and addon is disabled by TTS should mark resetButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateOnlyResetButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on resetButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markPlayButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledResetButton();
    },

    'test given view when activate enter on resetButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markResetButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledResetButton();
    },

    'test given view when activate space on resetButton and addon is disabled by TTS should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markResetButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },

    // Download button tests

    'test given view when entering on downloadButton by keyboard navigation should mark downloadButton' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markResetButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDownloadButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on downloadButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markResetButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on downloadButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.keyboardControllerObject.markDownloadButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on downloadButton by TTS should mark downloadButton' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markResetButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDownloadButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on downloadButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markResetButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDownloadButton();
    },

    'test given view when activate enter on downloadButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.keyboardControllerObject.markDownloadButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDownloadButton();
    },

    'test given view when entering on downloadButton and addon is disabled by TTS should mark downloadButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markResetButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDownloadButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on downloadButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markResetButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledDownloadButton();
    },

    'test given view when activate enter on downloadButton and addon is disabled by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDownloadButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledDownloadButton();
    },

    'test given view when activate space on downloadButton and addon is disabled by TTS should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.keyboardControllerObject.markDownloadButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },
});

TestCase("[Media Recorder] Keyboard controller test - reset dialog of extended mode", {

    CSS_CLASSES: getCSSClasses(),

    setUp: function () {
        this.presenter = new AddonMedia_Recorder_create();
        this.mediaRecorder = this.presenter.mediaRecorder;

        this.model = {
            ID: "Media_Recorder1",
            "Is Visible": true,
            maxTime: 5,
            isShowedDefaultRecordingButton: true,
            isDisabled: false,
            extendedMode: true,
            disableRecording: false,
            resetDialogLabels:  {
                resetDialogText: {
                    resetDialogLabel: "Are you sure?"
                },
                resetDialogConfirm: {
                    resetDialogLabel: "Yes, of course"
                },
                resetDialogDeny: {
                    resetDialogLabel: "No, never"
                },
            }
        };
        this.mediaRecorder.model = this.model;

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            getTextToSpeechOrNullStub: sinon.stub(),
            isPlayingDefaultRecording: sinon.stub(),
            isRecording: sinon.stub(),
            isPlaying: sinon.stub(),
            isInactive: sinon.stub(),
        };
        this.stubs.getTextToSpeechOrNullStub.returns(this.tts);
        this.stubs.isPlayingDefaultRecording.returns(false);
        this.stubs.isRecording.returns(false);
        this.stubs.isPlaying.returns(false);
        this.stubs.isInactive.returns(false);

        this.activationState = {
            isInactive: this.stubs.isInactive,
        }

        this.mediaState = {
            isPlayingDefaultRecording: this.stubs.isPlayingDefaultRecording,
            isRecording: this.stubs.isRecording,
            isPlaying: this.stubs.isPlaying,
        }

        this.mediaRecorder.activationState = this.activationState;
        this.mediaRecorder.mediaState = this.mediaState;
        this.createViewAndKeyboardController();
    },

    createViewAndKeyboardController: function () {
        this.createView();
        this.createKeyboardController();
    },

    createView: function () {
        this.mediaRecorder.view = $('<div></div>');
        this.presenter.$view = this.mediaRecorder.view;

        let $mainView = $(`<div></div>`);
        $mainView.addClass("addon_Media_Recorder");

        let $wrapper = $(`<div></div>`);
        $wrapper.addClass(this.CSS_CLASSES.WRAPPER);
        if (this.model.isDisabled) {
            $wrapper.addClass(this.CSS_CLASSES.DISABLED);
        }
        $wrapper.appendTo($mainView);

        let $playerWrapper = $(`<div></div>`);
        $playerWrapper.addClass(this.CSS_CLASSES.PLAYER_WRAPPER);
        $playerWrapper.appendTo($wrapper);

        let $interfaceWrapper = this.generateInterfaceWrapper();
        $interfaceWrapper.appendTo($wrapper);

        let $resetDialog = this.generateResetDialog();
        $resetDialog.appendTo($wrapper);

        $mainView.appendTo(this.mediaRecorder.view);
    },

    createKeyboardController: function () {
        this.mediaRecorder._buildKeyboardController();
        this.keyboardControllerObject = this.mediaRecorder.keyboardControllerObject;
        this.keyboardControllerObject.setElements(
            this.mediaRecorder._getElementsForResetDialogKeyboardNavigation()
        );
        setSpeechTexts(this.keyboardControllerObject);
        this.keyboardControllerObject.getTextToSpeechOrNull = this.stubs.getTextToSpeechOrNullStub;
    },

    generateInterfaceWrapper: function () {
        let $interfaceWrapper = $(`<div></div>`);
        $interfaceWrapper.addClass("media-recorder-interface-wrapper");

        this.$defaultRecordingPlayButton = generateDefaultRecordingPlayButton(
            this.CSS_CLASSES,
            false
        );
        $interfaceWrapper.append(this.$defaultRecordingPlayButton);

        this.$recordingButton = generateRecordingButton(
            this.CSS_CLASSES,
            false
        );
        $interfaceWrapper.append(this.$recordingButton);

        this.$playButton = generatePlayButton(
            this.CSS_CLASSES,
            true
        );
        $interfaceWrapper.append(this.$playButton);

        let $timer = generateTimer(this.CSS_CLASSES);
        $interfaceWrapper.append($timer);

        let $soundIntensity = generateSoundIntensity(this.CSS_CLASSES, false);
        $interfaceWrapper.append($soundIntensity);

        let $dottedSoundIntensity = generateDottedSoundIntensity(this.CSS_CLASSES, true);
        $interfaceWrapper.append($dottedSoundIntensity);

        let $progressBar = generateProgressBar(this.CSS_CLASSES);
        $interfaceWrapper.append($progressBar);

        this.$resetButton = generateResetButton(
            this.CSS_CLASSES,
            true
        );
        $interfaceWrapper.append(this.$resetButton);

        this.$downloadButton = generateDownloadButton(
            this.CSS_CLASSES,
            true
        );
        $interfaceWrapper.append(this.$downloadButton);

        return $interfaceWrapper;
    },

    generateResetDialog: function (){
        let $mainDiv = $(`<div></div>`);

        let $resetDialog = $(`<div></div>`);
        $resetDialog.addClass(this.CSS_CLASSES.RESET_DIALOG);
        $resetDialog.appendTo($mainDiv);

        this.$dialogText = generateDialogText(this.CSS_CLASSES);
        this.$dialogText.appendTo($resetDialog);

        let $dialogButtons = $(`<div></div>`);
        $dialogButtons.addClass("dialog-buttons");
        $dialogButtons.appendTo($resetDialog);

        this.$confirmButton = generateConfirmButton(this.CSS_CLASSES);
        this.$confirmButton.appendTo($dialogButtons);

        this.$denyButton = generateDenyButton(this.CSS_CLASSES);
        this.$denyButton.appendTo($dialogButtons);

        return $mainDiv;
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    activateTTSWithoutReading: function() {
        this.presenter.setWCAGStatus(true);
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    getFirstReadText: function() {
        // gets first call
        return this.tts.speak.args[0][0];
    },

    validateTTSForDisabledResetDialog: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForResetDialog(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogText.resetDialogLabel,
            this.model.resetDialogLabels.resetDialogConfirm.resetDialogLabel,
            this.model.resetDialogLabels.resetDialogDeny.resetDialogLabel,
            this.getFirstReadText(),
            true
        );
    },

    validateTTSForResetDialog: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForResetDialog(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogText.resetDialogLabel,
            this.model.resetDialogLabels.resetDialogConfirm.resetDialogLabel,
            this.model.resetDialogLabels.resetDialogDeny.resetDialogLabel,
            this.getFirstReadText()
        );
    },

    validateTTSForDisabledDialogText: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDialogText(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogText.resetDialogLabel,
            this.getFirstReadText(),
            true
        );
    },

    validateTTSForDialogText: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDialogText(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogText.resetDialogLabel,
            this.getFirstReadText()
        );
    },

    validateTTSForDisabledConfirmButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForConfirmButton(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogConfirm.resetDialogLabel,
            this.getFirstReadText(),
            true
        );
    },

    validateTTSForConfirmButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForConfirmButton(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogConfirm.resetDialogLabel,
            this.getFirstReadText()
        );
    },

    validateTTSForDisabledDenyButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDenyButton(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogDeny.resetDialogLabel,
            this.getFirstReadText(),
            true
        );
    },

    validateTTSForDenyButton: function() {
        assertTrue(this.tts.speak.calledOnce);
        validateTTSForDenyButton(
            this.keyboardControllerObject,
            this.model.resetDialogLabels.resetDialogDeny.resetDialogLabel,
            this.getFirstReadText()
        );
    },

    validateSpaceTTSOfDisabledElement: function () {
        assertTrue(this.tts.speak.calledOnce);
        validateSpaceTTSOfDisabledElement(this.keyboardControllerObject, this.getFirstReadText());
    },

    markDialogText: function() {
        this.keyboardControllerObject.markCurrentElement(0);
    },

    markConfirmButton: function() {
        this.keyboardControllerObject.markCurrentElement(1);
    },

    markDenyButton: function() {
        this.keyboardControllerObject.markCurrentElement(2);
    },

    validateOnlyDialogTextHasKeyboardNavigationActiveClass: function () {
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$dialogText));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$confirmButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$denyButton));
    },

    validateOnlyConfirmButtonHasKeyboardNavigationActiveClass: function () {
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$dialogText));
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$confirmButton));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$denyButton));
    },

    validateOnlyDenyButtonHasKeyboardNavigationActiveClass: function () {
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$dialogText));
        assertFalse(hasKeyboardNavigationActiveElementClass(this.$confirmButton));
        assertTrue(hasKeyboardNavigationActiveElementClass(this.$denyButton));
    },

    // Keyboard controller tests

    "test given keyboard controller when given default model should have only 3 elements": function () {
        let expectedElements = [
            this.$dialogText,
            this.$confirmButton,
            this.$denyButton,
        ];

        assertEquals(expectedElements.length, this.keyboardControllerObject.keyboardNavigationElements.length);
        for (let i = 0; i < expectedElements.length; i++) {
            assertEquals(expectedElements[i][0], this.keyboardControllerObject.keyboardNavigationElements[i]);
        }
    },

    // Full navigation path tests when active TTS or keyboard navigation

    'test given view then keyboard navigation should navigate only on dialogText, confirm and deny buttons': function () {
        this.activateKeyboardNavigation();
        this.markDenyButton();

        this.validateOnlyDenyButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyConfirmButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDenyButtonHasKeyboardNavigationActiveClass();
    },

    'test given view then navigation with TTS should navigate only on dialogText, confirm and deny buttons': function () {
        this.activateTTSWithoutReading();
        this.markDenyButton();

        this.validateOnlyDenyButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyConfirmButtonHasKeyboardNavigationActiveClass();

        activateTabEvent(this.presenter);

        this.validateOnlyDenyButtonHasKeyboardNavigationActiveClass();
    },

    // First enter tests

    'test given view when entering for the first time by keyboard navigation should mark dialogText' : function() {
        activateEnterEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by navigation with TTS should mark dialogText' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by keyboard navigation should not call tts.read' : function() {
        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering for the first time by navigation with TTS should call tts.read with proper text' : function() {
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForResetDialog();
    },

    'test given view when entering for the first time by keyboard navigation and addon is disabled should mark dialogText' : function() {
        this.stubs.isInactive.returns(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();
    },

    'test given view when entering for the first time by navigation with TTS and addon is disabled should mark dialogText' : function() {
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();
    },

    'test given view when entering by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.stubs.isInactive.returns(true);
        this.presenter.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledResetDialog();
    },

    // Dialog text tests

    'test given view when entering on dialogText by keyboard navigation should mark dialogText' : function() {
        this.activateKeyboardNavigation();
        this.markDenyButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on dialogText by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.markDenyButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on dialogText by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.markDialogText();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on dialogText by TTS should mark dialogText' : function() {
        this.activateTTSWithoutReading();
        this.markDenyButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on dialogText by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.markDenyButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDialogText();
    },

    'test given view when activate enter on dialogText by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.markDialogText();

        activateEnterEvent(this.presenter);

        this.validateTTSForDialogText();
    },

    'test given view when entering on dialogText by navigation with TTS and addon is disabled should mark dialogText' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDenyButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDialogTextHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on dialogText by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDenyButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledDialogText();
    },

    'test given view when activate enter on dialogText by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDialogText();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledDialogText();
    },

    'test given view when activate space on dialogText by navigation with TTS and addon is disabled should not call tts.read' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDialogText();

        activateSpaceEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    // Confirm button tests

    'test given view when entering on confirmButton by keyboard navigation should mark confirmButton' : function() {
        this.activateKeyboardNavigation();
        this.markDialogText();

        activateTabEvent(this.presenter);

        this.validateOnlyConfirmButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on confirmButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.markDialogText();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on confirmButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.markConfirmButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on confirmButton by TTS should mark confirmButton' : function() {
        this.activateTTSWithoutReading();
        this.markDialogText();

        activateTabEvent(this.presenter);

        this.validateOnlyConfirmButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on confirmButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.markDialogText();

        activateTabEvent(this.presenter);

        this.validateTTSForConfirmButton();
    },

    'test given view when activate enter on confirmButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.markConfirmButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForConfirmButton();
    },

    'test given view when entering on confirmButton by navigation with TTS and addon is disabled should mark confirmButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDialogText();

        activateTabEvent(this.presenter);

        this.validateOnlyConfirmButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on confirmButton by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDialogText();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledConfirmButton();
    },

    'test given view when activate enter on confirmButton by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markConfirmButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledConfirmButton();
    },

    'test given view when activate space on confirmButton by navigation with TTS and addon is disabled should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markConfirmButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },

    // Deny button tests

    'test given view when entering on denyButton by keyboard navigation should mark denyButton' : function() {
        this.activateKeyboardNavigation();
        this.markConfirmButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDenyButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on denyButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.markConfirmButton();

        activateTabEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when activate enter on denyButton by keyboard navigation should not call tts.read' : function() {
        this.activateKeyboardNavigation();
        this.markDenyButton();

        activateEnterEvent(this.presenter);

        assertFalse(this.tts.speak.called);
    },

    'test given view when entering on denyButton by TTS should mark denyButton' : function() {
        this.activateTTSWithoutReading();
        this.markConfirmButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDenyButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on denyButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.markConfirmButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDenyButton();
    },

    'test given view when activate enter on denyButton by TTS should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.markDenyButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDenyButton();
    },

    'test given view when entering on denyButton by navigation with TTS and addon is disabled should mark denyButton' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markConfirmButton();

        activateTabEvent(this.presenter);

        this.validateOnlyDenyButtonHasKeyboardNavigationActiveClass();
    },

    'test given view when entering on denyButton by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markConfirmButton();

        activateTabEvent(this.presenter);

        this.validateTTSForDisabledDenyButton();
    },

    'test given view when activate enter on denyButton by navigation with TTS and addon is disabled should call tts.read with proper text' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDenyButton();

        activateEnterEvent(this.presenter);

        this.validateTTSForDisabledDenyButton();
    },

    'test given view when activate space on denyButton by navigation with TTS and addon is disabled should call tts.read selected' : function() {
        this.activateTTSWithoutReading();
        this.stubs.isInactive.returns(true);
        this.markDenyButton();

        activateSpaceEvent(this.presenter);

        this.validateSpaceTTSOfDisabledElement();
    },
});

function getCSSClasses() {
    return {
        PLAYER_WRAPPER: "media-recorder-player-wrapper",
        PLAYER_LOADER: "media-recorder-player-loader",
        AUDIO_LOADER: "audio-loader",
        WRAPPER: "media-recorder-wrapper",
        WRAPPER_BROWSER_NOT_SUPPORTED: "media-recorder-wrapper-browser-not-supported",
        DEFAULT_RECORDING_PLAY_BUTTON: "media-recorder-default-recording-play-button",
        RECORDING_BUTTON: "media-recorder-recording-button",
        PLAY_BUTTON: "media-recorder-play-button",
        RESET_BUTTON: "media-recorder-reset-button",
        DOWNLOAD_BUTTON: "media-recorder-download-button",
        PROGRESS_BAR: "media-recorder-progress-bar",
        PROGRESS_BAR_SLIDER: "media-recorder-progress-bar-slider",
        TIMER: "media-recorder-timer",
        SOUND_INTENSITY: "media-recorder-sound-intensity",
        DOTTED_SOUND_INTENSITY: "media-recorder-dotted-sound-intensity",
        TALL_DOT: "tall-dot",
        SHORT_DOT: "short-dot",
        SOUND_INTENSITY_DOT: "sound-intensity-dot",
        RESET_DIALOG: "media-recorder-reset-dialog",
        DIALOG_TEXT: "dialog-text",
        CONFIRM_BUTTON: "confirm-button",
        DENY_BUTTON: "deny-button",
        EXTENDED_MODE: "extended-mode",
        SELECTED: "selected",
        DISABLED: "disabled",
    }
}

function setSpeechTexts(keyboardControllerObject) {
    keyboardControllerObject.setSpeechTexts({
        DefaultRecordingPlayButton: {DefaultRecordingPlayButton: ""},
        RecordingButton: {RecordingButton: ""},
        PlayButton: {PlayButton: ""},
        ResetButton: {ResetButton: ""},
        DownloadButton: {DownloadButton: ""},
        ResetDialog: {ResetDialog: ""},
        StartRecording: {StartRecording: ""},
        StopRecording: {StopRecording: ""},
        Disabled: {Disabled: ""},
    });
}

function generateDefaultRecordingPlayButton(CSS_CLASSES, isVisible = true) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON);

    if (!isVisible) {
        $button.css('display', 'none');
    }

    return $button;
}

function generateRecordingButton(CSS_CLASSES, isVisible = true) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.RECORDING_BUTTON);

    if (!isVisible) {
        $button.css('display', 'none');
    }

    return $button;
}

function generatePlayButton(CSS_CLASSES, isVisible = true) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.PLAY_BUTTON);

    if (!isVisible) {
        $button.css('display', 'none');
    }

    return $button;
}

function generateTimer(CSS_CLASSES, isVisible = true) {
    let $timer = $(`<div></div>`);
    $timer.addClass(CSS_CLASSES.TIMER);
    $timer.text("00:00 / 00:05");

    if (!isVisible) {
        $timer.css('display', 'none');
    }

    return $timer;
}

function generateSoundIntensity(CSS_CLASSES, isVisible = true) {
    let $soundIntensity = $(`<div></div>`);
    $soundIntensity.addClass(CSS_CLASSES.SOUND_INTENSITY);

    const elementsCSSClasses = [
        "sound-intensity-large", "sound-intensity-medium", "sound-intensity-low"
    ];

    let soundIntensityValue = 6;
    for (let i = 0; i < 3; i++) {
        let cssClass = elementsCSSClasses[i];
        for (let j = 0; j < 2; j++) {
            let $element = $(`<div></div>`);
            $element.addClass(cssClass);
            $element.attr("id", `sound-intensity-${soundIntensityValue}`);
            $element.appendTo($soundIntensity);
            soundIntensityValue--;
        }
    }

    if (!isVisible) {
        $soundIntensity.css('display', 'none');
    }

    return $soundIntensity;
}

function generateDottedSoundIntensity(CSS_CLASSES, isVisible = false) {
    let $soundIntensity = $(`<div></div>`);
    $soundIntensity.addClass(CSS_CLASSES.DOTTED_SOUND_INTENSITY);

    const elementsCSSClasses = [
        CSS_CLASSES.SHORT_DOT,
        CSS_CLASSES.TALL_DOT,
        CSS_CLASSES.SHORT_DOT
    ];

    for (let i = 0; i < 3; i++) {
        let cssClass = elementsCSSClasses[i];

        let $element1 = $(`<div></div>`);
        $element1.addClass(`media-recorder-dot-container`);
        $element1.appendTo($soundIntensity);

        let $element2 = $(`<div></div>`);
        $element2.addClass(`sound-intensity-dot`);
        $element2.addClass(cssClass);
        $element2.appendTo($element1);
    }

    if (!isVisible) {
        $soundIntensity.css('display', 'none');
    }

    return $soundIntensity;
}

function generateProgressBar(CSS_CLASSES, isVisible = false) {
    let $progressBar = $(`<div></div>`);
    $progressBar.addClass(CSS_CLASSES.PROGRESS_BAR);

    if (isVisible) {
        $progressBar.css('display', 'block');
    }

    return $progressBar;
}

function generateResetButton(CSS_CLASSES, isVisible = false) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.RESET_BUTTON);

    if (isVisible) {
        $button.css('display', 'block');
    } else {
        $button.css('display', 'none');
    }

    return $button;
}

function generateDownloadButton(CSS_CLASSES, isVisible = false) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.DOWNLOAD_BUTTON);

    if (isVisible) {
        $button.css('display', 'block');
    } else {
        $button.css('display', 'none');
    }

    return $button;
}

function generateDialogText(CSS_CLASSES, withText = false) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.DIALOG_TEXT);

    if (withText) {
        $button.text("Are you sure you want to reset the recording?");
    }

    return $button;
}

function generateConfirmButton(CSS_CLASSES, withText = false) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.CONFIRM_BUTTON);

    if (withText) {
        $button.text("Yes");
    }

    return $button;
}

function generateDenyButton(CSS_CLASSES, withText = false) {
    let $button = $(`<div></div>`);
    $button.addClass(CSS_CLASSES.DENY_BUTTON);

    if (withText) {
        $button.text("No");
    }

    return $button;
}

function activateEnterEvent(presenter, stub) {
    const keycode = 13;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateTabEvent(presenter, stub) {
    const keycode = 9;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateSpaceEvent(presenter, stub) {
    const keycode = 32;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function hasKeyboardNavigationActiveElementClass($element) {
    return $element.hasClass("keyboard_navigation_active_element");
}

function validateTTSForDefaultRecordingPlayButton(keyboardControllerObject, result, isDisabled = false) {
    const expectedText = keyboardControllerObject.speechTexts.DefaultRecordingPlayButton;
    validateDefaultElementTTS(keyboardControllerObject, result, expectedText, isDisabled);
}

function validateTTSForRecordingButton(keyboardControllerObject, result, isDisabled = false) {
    const expectedText = keyboardControllerObject.speechTexts.RecordingButton;
    validateDefaultElementTTS(keyboardControllerObject, result, expectedText, isDisabled);
}

function validateTTSForPlayButton(keyboardControllerObject, result, isDisabled = false) {
    const expectedText = keyboardControllerObject.speechTexts.PlayButton;
    validateDefaultElementTTS(keyboardControllerObject, result, expectedText, isDisabled);
}

function validateTTSForResetButton(keyboardControllerObject, result, isDisabled = false) {
    const expectedText = keyboardControllerObject.speechTexts.ResetButton;
    validateDefaultElementTTS(keyboardControllerObject, result, expectedText, isDisabled);
}

function validateTTSForDownloadButton(keyboardControllerObject, result, isDisabled = false) {
    const expectedText = keyboardControllerObject.speechTexts.DownloadButton;
    validateDefaultElementTTS(keyboardControllerObject, result, expectedText, isDisabled);
}

function validateDefaultElementTTS(keyboardControllerObject, result, speechText, isDisabled = false) {
    assertEquals(speechText, result[0]["text"]);

    if (isDisabled) {
        const expectedDisabledText = keyboardControllerObject.speechTexts.Disabled;
        assertEquals(expectedDisabledText, result[1]["text"]);
    }
}

function validateTTSForResetDialog(
        keyboardControllerObject,
        expectedDialogTextTTS,
        expectedDialogConfirmTTS,
        expectedDialogDenyTTS,
        result,
        isDisabled = false) {
    assertEquals(expectedDialogTextTTS, result[0]["text"]);
    assertEquals(expectedDialogConfirmTTS, result[1]["text"]);
    assertEquals(expectedDialogDenyTTS, result[2]["text"]);

    if (isDisabled) {
        const expectedDisabledText = keyboardControllerObject.speechTexts.Disabled;
        assertEquals(expectedDisabledText, result[3]["text"]);
    }
}

function validateTTSForDialogText(keyboardControllerObject, expectedDialog, result, isDisabled = false) {
    const expectedPrefix = keyboardControllerObject.speechTexts.ResetDialog;
    assertEquals(expectedPrefix, result[0]["text"]);
    assertEquals(expectedDialog, result[1]["text"]);

    if (isDisabled) {
        const expectedDisabledText = keyboardControllerObject.speechTexts.Disabled;
        assertEquals(expectedDisabledText, result[2]["text"]);
    }
}

function validateTTSForConfirmButton(keyboardControllerObject, expectedButtonText, result, isDisabled = false) {
    assertEquals(expectedButtonText, result[0]["text"]);
    if (isDisabled) {
        const expectedDisabledText = keyboardControllerObject.speechTexts.Disabled;
        assertEquals(expectedDisabledText, result[1]["text"]);
    }
}

function validateTTSForDenyButton(keyboardControllerObject, expectedButtonText, result, isDisabled = false) {
    assertEquals(expectedButtonText, result[0]["text"]);
    if (isDisabled) {
        const expectedDisabledText = keyboardControllerObject.speechTexts.Disabled;
        assertEquals(expectedDisabledText, result[1]["text"]);
    }
}

function validateSpaceTTSOfDisabledElement(keyboardControllerObject, result) {
    const expectedDisabledText = keyboardControllerObject.speechTexts.Disabled;
    assertEquals(expectedDisabledText, result[0]["text"]);
}
