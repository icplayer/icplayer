TestCase("[Paragraph] WCAG - Keyboard Navigation Test", {
     setUp: function () {
         this.presenter = getConfiguredPresenter();
    },

    'test given presenter setup when build keyboard controller then keyboard controller is build': function () {
         var spy = sinon.spy(this.presenter, "buildKeyboardController");

         this.presenter.buildKeyboardController();

         assert(spy.called);
         assertNotEquals(this.presenter.keyboardControllerObject, undefined);
         assertNotEquals(this.presenter.keyboardControllerObject, null);
    },

    'test given 4 matching elements when getElementsForKeyboardNavigation then return 4 proper elements': function () {
        var spy = sinon.spy(this.presenter, "getElementsForKeyboardNavigation");

        var elements = this.presenter.getElementsForKeyboardNavigation();

        assert(spy.called);
        assertEquals(elements.length, 4);
    },

    'test given bold element when selectAction then element clicked': function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = this.presenter.$view.find(".bold");
        var elementClickedSpy = sinon.spy($(this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement)[0], "click");
        var markStub = sinon.stub();
        this.presenter.keyboardControllerObject.mark = markStub;
        var execCommandStub = sinon.stub();
        this.presenter.editor.execCommand = execCommandStub;
        var speakSelectedOnActionStub = sinon.stub();
        this.presenter.speakSelectedOnAction = speakSelectedOnActionStub;

        this.presenter.keyboardControllerObject.selectAction();

        sinon.assert.callCount(elementClickedSpy, 1);
        sinon.assert.callCount(markStub, 1);
        sinon.assert.callCount(execCommandStub, 0);
        sinon.assert.callCount(speakSelectedOnActionStub, 1);
    },

    'test given mce-edit-area element when selectAction then command fired': function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = this.presenter.$view.find(".mce-edit-area");
        var elementClickedSpy = sinon.spy($(this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement)[0], "click");
        var markStub = sinon.stub();
        this.presenter.keyboardControllerObject.mark = markStub;
        var execCommandStub = sinon.stub();
        this.presenter.editor.execCommand = execCommandStub;

        this.presenter.keyboardControllerObject.selectAction();

        sinon.assert.callCount(elementClickedSpy, 0);
        sinon.assert.callCount(markStub, 1);
        sinon.assert.callCount(execCommandStub, 1);
        sinon.assert.calledWith(execCommandStub, "mceCodeEditor");
    },

    'test given mce-btn element when mark then keyboard_navigation_active_element_important is added': function () {
         var element = this.presenter.$view.find(".bold");
         var markSpy = sinon.spy(this.presenter.keyboardControllerObject, "mark");

         this.presenter.keyboardControllerObject.mark(element);

         sinon.assert.callCount(markSpy, 1);
         assertTrue(element.hasClass('keyboard_navigation_active_element_important'));
         assertFalse(element.hasClass('keyboard-navigation-margin'));
    },

    'test given mce-edit-area element when mark then keyboard_navigation_active_element_important and keyboard-navigation-margin is added': function () {
         var element = this.presenter.$view.find(".mce-edit-area");
         var markSpy = sinon.spy(this.presenter.keyboardControllerObject, "mark");

         this.presenter.keyboardControllerObject.mark(element);

         sinon.assert.callCount(markSpy, 1);
         assertTrue(element.hasClass('keyboard_navigation_active_element_important'));
         assertTrue(element.hasClass('keyboard-navigation-margin'));
    },

    'test given mce-btn element when unmark then keyboard_navigation_active_element_important is removed': function () {
         var element = this.presenter.$view.find(".bold");
         element.addClass("keyboard_navigation_active_element_important");
         var unmarkSpy = sinon.spy(this.presenter.keyboardControllerObject, "unmark");

         this.presenter.keyboardControllerObject.unmark(element);

         sinon.assert.callCount(unmarkSpy, 1);
         assertFalse(element.hasClass('keyboard_navigation_active_element_important'));
         assertFalse(element.hasClass('keyboard-navigation-margin'));
    },

    'test given mce-edit-area element when unmark then keyboard_navigation_active_element_important and keyboard-navigation-margin is removed': function () {
         var element = this.presenter.$view.find(".mce-edit-area");
         element.addClass("keyboard_navigation_active_element_important");
         element.addClass("keyboard-navigation-margin");
         var unmarkSpy = sinon.spy(this.presenter.keyboardControllerObject, "unmark");

         this.presenter.keyboardControllerObject.unmark(element);

         sinon.assert.callCount(unmarkSpy, 1);
         assertFalse(element.hasClass('keyboard_navigation_active_element_important'));
         assertFalse(element.hasClass('keyboard-navigation-margin'));
    }
});

TestCase("[Paragraph] WCAG - TTS Test", {
    setUp: function () {
        this.presenter = getConfiguredPresenter();
        this.speakStub = sinon.stub();
        this.presenter.speak = this.speakStub;
        this.presenter.speechTexts = {
            bold: "Custom bold text"
        };
    },

    'test given mce-btn with aria-label and defined speechText when readCurrentElement then speak is invoked with speech text': function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = this.presenter.$view.find(".bold");
        var readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(this.speakStub, 1);
        sinon.assert.calledWith(this.speakStub, this.presenter.speechTexts.bold);
    },

    'test given mce-btn with aria-label but undefined speechText when readCurrentElement then speak is invoked with aria-label': function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = this.presenter.$view.find(".new-doc");
        var readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(this.speakStub, 1);
        sinon.assert.calledWith(this.speakStub, "New Document");
    },

    'test given mce-edit-area when readCurrentElement then speak is invoked with content': function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = this.presenter.$view.find(".mce-edit-area");
        let readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");
        const content = "Just some text content.";
        const contentAsHTML = "<div>" + content + "</div>";
        sinon.stub(this.presenter.editor, "getContent").callsFake(function () { return contentAsHTML;});

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(this.speakStub, 1);
        sinon.assert.calledWith(this.speakStub, [{lang: "", text: content}]);
    },

    'test given mce-btn without aria-label and undefined speechText when readCurrentElement then speak is invoked with text content': function () {
        this.presenter.keyboardControllerObject.keyboardNavigationCurrentElement = this.presenter.$view.find(".para");
        var readElementSpy = sinon.spy(this.presenter.keyboardControllerObject, "readCurrentElement");

        this.presenter.keyboardControllerObject.readCurrentElement();

        sinon.assert.callCount(readElementSpy, 1);
        sinon.assert.callCount(this.speakStub, 1);
        sinon.assert.calledWith(this.speakStub, "Paragraph");
    }
});


function getConfiguredPresenter () {
    this.presenter = AddonParagraph_create();
    this.presenter.editor = {
        getContent: function () {return;}
    };

    var container = document.createElement('div');
    container.className = "container";
    container.innerHTML = `
        <div class="mce-btn bold" aria-label="Bold"></div>
        <div class="mce-btn new-doc" aria-label="New Document"></div>
        <div class="mce-btn para"><p>Paragraph</p></div>
        <div class="mce-edit-area"></div>
        <div class="fake-class"></div>
    `;
    this.view = container;

    sinon.stub(this.presenter, "makePluginName").callsFake(function () {return "Paragraph1";});
    window.tinymce = {
        init: function () {
            return {
                then: sinon.stub()
            }
        }
    };

    this.presenter.run(this.view, {});
    this.presenter.buildKeyboardController();

    return this.presenter;
}