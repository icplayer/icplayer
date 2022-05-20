TestCase("[Editable Window] Keyboard Navigation test", {
    setUp: function () {
        this.presenter = getConfiguredPresenter();
    },

    "test given editable window when setUp then wrapper has outline and box-shadow equals to none important": function () {
        const element = $($(this.presenter.configuration.view).find(".addon_EditableWindow").context);
        const styles = element.attr("style").split("; ");
        const outline = styles[0].split(": ")[1];
        const boxShadow = styles[1].split(": ")[1];
        const expectedValue = "none !important";

        assertEquals(outline, expectedValue);
        assertEquals(boxShadow, expectedValue);
    },

    "test given not selected module when trigger keydown event then no class added to wrapper": function () {
      const event = new Event('keydown');
      document.dispatchEvent(event);

      const realElement = $(presenter.configuration.view).find(".addon-editable-window-wrapper");

      assertFalse($(realElement[0]).hasClass("selected_module_fake"));
      assertFalse($(realElement[0]).hasClass("active_module_fake"));
    },

    "test given selected module when trigger keydown event then class selected_module_fake added to wrapper": function () {
        const element = $(presenter.configuration.view).find(".addon_EditableWindow");
        const $element = $(element.context);
        $element.addClass("ic_selected_module");

        const event = new Event('keydown');
        document.dispatchEvent(event);

        const realElement = $(presenter.configuration.view).find(".addon-editable-window-wrapper");
        assertTrue($(realElement[0]).hasClass("selected_module_fake"));
        assertFalse($(realElement[0]).hasClass("active_module_fake"));
    },

    "test given deselected module and wrapper with fake class when trigger keydown event then class selected_module_fake removed from wrapper": function () {
        const realElement = $(presenter.configuration.view).find(".addon-editable-window-wrapper");
        $(realElement[0]).addClass("selected_module_fake")

        const event = new Event('keydown');
        document.dispatchEvent(event);

        assertFalse($(realElement[0]).hasClass("selected_module_fake"));
        assertFalse($(realElement[0]).hasClass("active_module_fake"));
    },

    "test given active module when trigger keydown event then class active_module_fake added to wrapper": function () {
        const element = $(presenter.configuration.view).find(".addon_EditableWindow");
        const $element = $(element.context);
        $element.addClass("ic_active_module");

        const event = new Event('keydown');
        document.dispatchEvent(event);

        const realElement = $(presenter.configuration.view).find(".addon-editable-window-wrapper");
        assertFalse($(realElement[0]).hasClass("selected_module_fake"));
        assertTrue($(realElement[0]).hasClass("active_module_fake"));
    },

    "test given deactivated module and wrapper with fake class when trigger keydown event then class active_module_fake removed from wrapper": function () {
        const realElement = $(presenter.configuration.view).find(".addon-editable-window-wrapper");
        $(realElement[0]).addClass("active_module_fake")

        const event = new Event('keydown');
        document.dispatchEvent(event);

        assertFalse($(realElement[0]).hasClass("selected_module_fake"));
        assertFalse($(realElement[0]).hasClass("active_module_fake"));
    },

    "test given basic view with tinymce when getElementsForKeyboardNavigation then return X elements": function () {
        const elements = this.presenter.getElementsForKeyboardNavigation();

        assertEquals(elements.length, 5);
    },

    "test given element at 0 index when enter called then getElementsForKeyboardNavigation called": function () {
        const spyGetElements = sinon.spy(this.presenter, "getElementsForKeyboardNavigation");
        const spyReadElement = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;

        this.presenter.keyboardControllerObject.enter(fakeEvent);

        assert(spyGetElements.called);
        assert(spyReadElement.called);
    },

    "test given element at not 0 index when enter called then getElementsForKeyboardNavigation not called": function () {
        const spyGetElements = sinon.spy(this.presenter, "getElementsForKeyboardNavigation");
        const readElementStub = sinon.stub();
        this.presenter.keyboardControllerObject.readCurrentElement = readElementStub;
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 2;
        this.presenter.keyboardControllerObject.keyboardNavigationActive = true;

        this.presenter.keyboardControllerObject.enter(fakeEvent);

        sinon.assert.callCount(spyGetElements, 0);
        sinon.assert.callCount(readElementStub, 1);
    },

    "test given mce-btn element and editing enabled when select then mce-btn clicked and new elements set": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-btn");
        this.presenter.configuration.model.editingEnabled = true;
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const getMceBtnElementsSpy = sinon.spy(this.presenter, "getMceBtnElements");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(getMceBtnElementsSpy, 1);
        sinon.assert.calledWith(speakStub, "Text highlighting tool");
        assertTrue(this.presenter.isKeyboardNavDeactivationBlocked);
    },

    "test given mce-btn element and editing disabled when select then default element click happens": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-btn");
        const elementClickSpy = sinon.spy($(this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement)[0], "click");
        this.presenter.configuration.model.editingEnabled = false;
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const getMceBtnElementsSpy = sinon.spy(this.presenter, "getMceBtnElements");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(readElementSpy, 0);
        sinon.assert.callCount(getMceBtnElementsSpy, 0);
        sinon.assert.callCount(speakStub, 0);
        sinon.assert.callCount(elementClickSpy, 1);
    },

    "test given color highlighting element when select then element clicked": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-highlight");
        const elementClickSpy = sinon.spy($(this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement)[0], "click");
        sinon.stub(this.presenter, "isColorHighlightElement").callsFake(function () {return true;});
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(readElementSpy, 0);
        sinon.assert.callCount(speakStub, 0);
        sinon.assert.callCount(elementClickSpy, 1);
    },

    "test given color pick element when select then element clicked and new elements set": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-open");
        const elementClickSpy = sinon.spy($(this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement)[0], "click");
        sinon.stub(this.presenter, "isColorPickElement").callsFake(function () {return true;});
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const spyGetColorPaletteElements = sinon.spy(this.presenter, "getColorPaletteElements");
        const spyCloseAllColorPickPanels = sinon.spy(this.presenter, "closeAllColorPickPanels");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.callCount(elementClickSpy, 1);
        sinon.assert.callCount(spyGetColorPaletteElements, 1);
        sinon.assert.callCount(spyCloseAllColorPickPanels, 1);
        sinon.assert.calledWith(speakStub, "Pick a color for highlighting");
    },

    "test given inside color pick when select then element clicked and MceBtnElements set": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = [{childNodes: []}];
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement[0].childNodes[0] = $(presenter.configuration.view).find(".helper-class");
        const elementClickSpy = sinon.spy($($(presenter.configuration.view).find(".helper-class"))[0], "click");
        sinon.stub(this.presenter, "isInsideColorPick").callsFake(function () {return true;});
        sinon.stub(this.presenter, "getTTSKeyBasedOnColor").callsFake(function () {return "yellow"});
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const getMceBtnElementsSpy = sinon.spy(this.presenter, "getMceBtnElements");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.callCount(elementClickSpy, 1);
        sinon.assert.callCount(getMceBtnElementsSpy, 1);
        sinon.assert.calledWith(speakStub, "Yellow");
    },

    "test given marked edit area when select then execCommand with param mceCodeEditor": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-edit-area");
        this.presenter.configuration.model.editingEnabled = true;
        this.presenter.configuration.editor = {execCommand: function () {return;}};
        const execCommandSpy = sinon.spy(this.presenter.configuration.editor, "execCommand");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(execCommandSpy, 1);
        sinon.assert.calledWith(execCommandSpy, "mceCodeEditor");
    },

    "test given marked close button when select then clicked": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".addon-editable-close-button");
        const elementClickSpy = sinon.spy($(this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement)[0], "click");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(elementClickSpy, 1);
    },

    "test given marked audio element when select then pauseOrPlayAudio triggered": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = document.createElement("audio");
        const puaseOrPlayAudioStub = sinon.stub(this.presenter, "pauseOrPlayAudio");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(puaseOrPlayAudioStub, 1);
    },

    "test given marked video element when select then pauseOrPlayVideo triggered": function () {
        const videoElement = document.createElement("video");
        videoElement.className = "video-wrapper";
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = videoElement;
        const pauseOrPlayVideoStub = sinon.stub(this.presenter, "pauseOrPlayVideo");

        this.presenter.keyboardControllerObject.select(fakeEvent);

        sinon.assert.callCount(pauseOrPlayVideoStub, 1);
    },

    "test given any nested selection when escape then escape": function () {
        const isInsideColorPickStub = sinon.stub(this.presenter, "isInsideColorPick");
        isInsideColorPickStub.callsFake(function () {return false;});
        const isInsideMceBtnStub = sinon.stub(this.presenter, "isInsideMceBtn");
        isInsideMceBtnStub.callsFake(function () {return false;});
        this.presenter.isKeyboardNavDeactivationBlocked = true;

        this.presenter.keyboardControllerObject.escape(fakeEvent);

        sinon.assert.callCount(isInsideColorPickStub, 1);
        sinon.assert.callCount(isInsideMceBtnStub, 1);
        assertFalse(this.presenter.isKeyboardNavDeactivationBlocked);
    },

    "test given nested selection inside mce buttons when escape then reset elements to default": function () {
        const isInsideColorPickStub = sinon.stub(this.presenter, "isInsideColorPick");
        isInsideColorPickStub.callsFake(function () {return false;});
        const isInsideMceBtnStub = sinon.stub(this.presenter, "isInsideMceBtn");
        isInsideMceBtnStub.callsFake(function () {return true;});
        this.presenter.isKeyboardNavDeactivationBlocked = true;
        const getElementsSpy = sinon.spy(this.presenter, "getElementsForKeyboardNavigation");
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.escape(fakeEvent);

        sinon.assert.callCount(isInsideColorPickStub, 1);
        sinon.assert.callCount(isInsideMceBtnStub, 1);
        sinon.assert.callCount(getElementsSpy, 1);
        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Text highlighting tool");
        assertTrue(this.presenter.isKeyboardNavDeactivationBlocked);
    },

    "test given nested selection inside color pick when escape then reset elements to mce buttons": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-highlight");
        const elementClickSpy = sinon.spy($(this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement)[0], "click");
        const isInsideColorPickStub = sinon.stub(this.presenter, "isInsideColorPick");
        isInsideColorPickStub.callsFake(function () {return true;});
        const isInsideMceBtnStub = sinon.stub(this.presenter, "isInsideMceBtn");
        isInsideMceBtnStub.callsFake(function () {return false;});
        const isColorPickElementStub = sinon.stub(this.presenter, "isColorPickElement");
        isColorPickElementStub.callsFake(function () {return true;});
        this.presenter.isKeyboardNavDeactivationBlocked = true;
        const getElementsSpy = sinon.spy(this.presenter, "getMceBtnElements");
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.escape(fakeEvent);

        sinon.assert.callCount(isInsideColorPickStub, 1);
        sinon.assert.callCount(isInsideMceBtnStub, 1);
        sinon.assert.callCount(getElementsSpy, 1);
        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Pick a color for highlighting");
        sinon.assert.callCount(elementClickSpy, 1);
        sinon.assert.callCount(isColorPickElementStub, 1);
        assertTrue(this.presenter.isKeyboardNavDeactivationBlocked);
    },

    "test given content with image when getContentToRead then image replaced with alt text": function () {
        const fakeEditor = {
            content: "",
            getContent: function (param) {return this.content;},
            setContent: function (newContent) {this.content = newContent;}
        };
        this.presenter.configuration.editor = fakeEditor;
        this.presenter.speechTexts.image = "Image"
        const rawContent = `Hello some text with <img src="sample.jpg" alt="Sample image"/> just text`;
        this.presenter.configuration.editor.setContent(rawContent);
        const expected = `Hello some text with <p>Image Sample image</p> just text`;

        const result = this.presenter.getContentToRead();

        assertEquals(expected, result);
    },

    "test given open full screen element when readCurrentElement then read 'Open fullscreen'": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".addon-editable-open-full-screen-button");
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Open fullscreen");
    },

    "test given close full screen element when readCurrentElement then read 'Close fullscreen'": function () {
        const closeElement = document.createElement("div");
        closeElement.className = 'addon-editable-close-full-screen-button';
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = closeElement;
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Close fullscreen");
    },

    "test given mce-btn element when readCurrentElement then read 'Text highlighting tool'": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-btn");
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Text highlighting tool");
    },

    "test given color highlight element when readCurrentElement then read 'Highlight selected text'": function () {
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const isColorHighlightElementStub = sinon.stub(this.presenter, "isColorHighlightElement");
        isColorHighlightElementStub.callsFake(function () {return true;});

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.callCount(isColorHighlightElementStub, 1);
        sinon.assert.calledWith(speakStub, "Highlight selected text");
    },

    "test given color picking element when readCurrentElement then read 'Pick a color for highlighting'": function () {
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const isColorPickElementStub = sinon.stub(this.presenter, "isColorPickElement");
        isColorPickElementStub.callsFake(function () {return true;});

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.callCount(isColorPickElementStub, 1);
        sinon.assert.calledWith(speakStub, "Pick a color for highlighting");
    },

    "test given color palette element when readCurrentElement then read e.g. 'Yellow'": function () {
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const isInsideColorPickStub = sinon.stub(this.presenter, "isInsideColorPick");
        isInsideColorPickStub.callsFake(function () {return true;});
        sinon.stub(this.presenter, "getTTSKeyBasedOnColor").callsFake(function () {return "yellow"});

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.callCount(isInsideColorPickStub, 1);
        sinon.assert.calledWith(speakStub, "Yellow");
    },

    "test given mce edit area element when readCurrentElement then read content": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".mce-edit-area");
        this.presenter.configuration.model.langAttribute = "en-EN";
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;
        const expectedText = "Hello world";
        const getContentToReadStub = sinon.stub(presenter, "getContentToRead");
        getContentToReadStub.callsFake(function () {return expectedText;});

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, [{ lang: "en-EN", text: expectedText }]);
    },

    "test given reset element when readCurrentElement then read 'reset'": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = $(presenter.configuration.view).find(".addon-editable-reset-button");
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Reset");
    },

    "test given audio element when readCurrentElement then read 'Audio'": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = document.createElement("audio");
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Audio");
    },

    "test given video element when readCurrentElement then read 'Video'": function () {
        const videoElement = document.createElement("video");
        videoElement.className = "video-wrapper";
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = videoElement;
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "Video");
    },

    "test given unknown element when readCurrentElement then read empty string '' ": function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = document.createElement("div");
        const readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const speakStub = sinon.stub();
        this.presenter.speak = speakStub;

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(speakStub, 1);
        sinon.assert.calledWith(speakStub, "");
    }
});

function getConfiguredPresenter() {
    this.presenter = AddonEditableWindow_create();

    const container = document.createElement("div");
    container.className = "container";
    container.innerHTML = `
        <div class="addon_EditableWindow"></div>
        
        <div class="addon-editable-window-wrapper">
            <button class="addon-editable-full-screen-button addon-editable-open-full-screen-button"></button>
            <button class="addon-editable-close-button">X</button>
            <div class="mce-btn">
                    <button class="mce-highlight">
                    </button>   
                    <button class="mce-open">
                        <div class="mce-grid-cell">
                            <div class="helper-class" title="Yellow"></div
                        </div>
                        <div class="mce-grid-cell">
                            <div title="Blue"></div>
                        </div>
                        <div class="mce-grid-cell">
                            <div title="Red"></div>
                        </div>
                        <div class="mce-grid-cell">
                            <div title="Green"></div>
                        </div>
                        <div class="mce-grid-cell">
                            <div title="White"></div>
                        </div>
                        <div class="mce-grid-cell mce-colorbtn-trans">
                            <div title="Aucune couleur">×</div>
                        </div>
                    </button>
            </div>
            <div class="mce-edit-area">                
            </div>
            <div class="addon-editable-reset-button">                
            </div>
        </div>            
    `;

    this.presenter.configuration.view = container;
    this.presenter.configuration.model = {editingEnabled: false};
    this.presenter.buildKeyboardController();
    this.presenter.setUpKeyboardNavigationStyling();
    this.presenter.setSpeechTexts({});

    return this.presenter;
}

var fakeEvent = {preventDefault: function () {return;}}
