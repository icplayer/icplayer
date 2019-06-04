TestCase("[Paragraph] getText and setText method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true
        };
        this.spies = {
            setContent: sinon.spy()
        };

        this.presenter.editor = {
            id: "mce_1",
            setContent: this.spies.setContent,
            getContent: function getContentMock(params) {return 'hello world';},
            initialized: true
        };

    },

    'test when setText is called directly it sets the correct value in editor': function () {
        this.presenter.setText("hello world");

        assertEquals("hello world", this.spies.setContent.getCall(0).args[0]);
    },

    'test when setText as a command it sets the correct value in editor': function () {
        this.presenter.executeCommand("settext",["hello world"]);

        assertEquals("hello world", this.spies.setContent.getCall(0).args[0]);
    },

    'test when getText is called directly it returns correct value': function () {
        var result = this.presenter.getText();

        assertEquals("hello world", result);
    },

    'test when getText is called as a command it returns correct value': function () {
        var result = this.presenter.executeCommand("gettext",[""]);

        assertEquals("hello world", result);
    }
});

TestCase("[Paragraph] lock and unlock method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true,
            ID: "Paragraph1"
        };
        this.presenter.$view = $('<div>');
        this.presenter.$view.append("<div class=\"addon_Paragraph\" id=\"Paragraph1\">" +
            "<div id=\"Paragraph1-wrapper\" class=\"paragraph-wrapper\"><form><textarea class=\"paragraph_field\"></textarea></form>" +
            "</div>");
    },

    'test when lock is called as a command it appends element with class paragraph-lock': function () {
        this.presenter.lock();
        assertTrue(this.presenter.$view.find('.paragraph-lock').length === 1);
    },

    'test when unlock is called after lock as a command there is no element with class paragraph-lock': function () {
        this.presenter.lock();
        this.presenter.unlock();
        assertTrue(this.presenter.$view.find('.paragraph-lock').length === 0);
    }

});

TestCase("[Paragraph] isAttempted method", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true,
            ID: "Paragraph1"
        };

        this.presenter.editor = {
            'getContent': sinon.stub()
        }
    },

    'test given editor was not loaded and state is not set when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = false;
        this.presenter.state = null;

        var result = this.presenter.isAttempted();

        assertFalse(this.presenter.editor.getContent.called);
        assertFalse(result);
    },

    'test given editor was not loaded and tinymceState has no text when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = false;
        this.presenter.state = '{"tinymceState":"<p></p>"}';

        var result = this.presenter.isAttempted();

        assertFalse(this.presenter.editor.getContent.called);
        assertFalse(result);
    },

    'test given editor was not loaded and tinymceState contains text when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = false;
        this.presenter.state = '{"tinymceState":"<p>hello world</p>"}';

        var result = this.presenter.isAttempted();

        assertFalse(this.presenter.editor.getContent.called);
        assertTrue(result);
    },

    'test given editor was loaded and editor contains text when calling isAttempted then return true': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.state = '{"tinymceState":"<p>hello world</p>"}';
        this.presenter.editor.getContent.returns('<p>hello world</p>');

        var result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.called);
        assertTrue(result);
    },

    'test given editor was loaded and editor contains no text when calling isAttempted then return false': function () {
        this.presenter.isEditorLoaded = true;
        this.presenter.state = '{"tinymceState":"<p>hello world</p>"}';
        this.presenter.editor.getContent.returns('<p></p>');

        var result = this.presenter.isAttempted();

        assertTrue(this.presenter.editor.getContent.called);
        assertFalse(result);
    }

});

