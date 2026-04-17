TestCase("[EditableWindow] MathJax - shouldSupportMathJax", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.presenter.configuration.model = {
            editingEnabled: false,
            isTextEditorContent: true
        };
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            retryIntervalId: null,
            renderingInProgress: false,
            renderingTimeoutId: null,
            currentRequestId: null
        };
    },

    'test given non-editable text content and valid mathJaxModel when checking support then returns true': function () {
        const result = this.presenter.shouldSupportMathJax();

        assertTrue(result);
    },

    'test given editing enabled when checking support then returns false': function () {
        this.presenter.configuration.model.editingEnabled = true;

        const result = this.presenter.shouldSupportMathJax();

        assertFalse(result);
    },

    'test given isTextEditorContent false when checking support then returns false': function () {
        this.presenter.configuration.model.isTextEditorContent = false;

        const result = this.presenter.shouldSupportMathJax();

        assertFalse(result);
    },

    'test given invalid mathJaxModel when checking support then returns false': function () {
        this.presenter.configuration.mathJaxModel.isValid = false;

        const result = this.presenter.shouldSupportMathJax();

        assertFalse(result);
    },

    'test given editing enabled and invalid mathJaxModel when checking support then returns false': function () {
        this.presenter.configuration.model.editingEnabled = true;
        this.presenter.configuration.mathJaxModel.isValid = false;

        const result = this.presenter.shouldSupportMathJax();

        assertFalse(result);
    }
});

TestCase("[EditableWindow] MathJax - loadMathJaxIntoEditor", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            config: 'MathJax.Hub.Config({});',
            styles: '.MathJax {}',
            source: 'javascript/MathJax/MathJax.js',
            retryIntervalId: null,
            renderingInProgress: false,
            renderingTimeoutId: null,
            currentRequestId: null
        };

        const head = document.createElement('head');
        this.fakeDoc = {
            head: head,
            createElement: function (tag) { return document.createElement(tag); }
        };

        this.fakeWin = {};

        this.fakeEditor = {
            getDoc: function () { return null; },
            getWin: function () { return null; }
        };
    },

    'test given valid editor with doc and win when loading MathJax then config script appended to head': function () {
        const fakeDoc = this.fakeDoc;
        const fakeWin = this.fakeWin;
        this.fakeEditor.getDoc = function () { return fakeDoc; };
        this.fakeEditor.getWin = function () { return fakeWin; };

        this.presenter.loadMathJaxIntoEditor(this.fakeEditor);

        const scripts = this.fakeDoc.head.querySelectorAll('script[type="text/x-mathjax-config"]');
        assertEquals(1, scripts.length);
        assertEquals('MathJax.Hub.Config({});', scripts[0].textContent);
    },

    'test given valid editor with doc and win when loading MathJax then styles appended to head': function () {
        const fakeDoc = this.fakeDoc;
        const fakeWin = this.fakeWin;
        this.fakeEditor.getDoc = function () { return fakeDoc; };
        this.fakeEditor.getWin = function () { return fakeWin; };

        this.presenter.loadMathJaxIntoEditor(this.fakeEditor);

        const styles = this.fakeDoc.head.querySelectorAll('style[type="text/css"]');
        assertEquals(1, styles.length);
        assertEquals('.MathJax {}', styles[0].textContent);
    },

    'test given valid editor with doc and win when loading MathJax then source script appended with correct src': function () {
        const fakeDoc = this.fakeDoc;
        const fakeWin = this.fakeWin;
        this.fakeEditor.getDoc = function () { return fakeDoc; };
        this.fakeEditor.getWin = function () { return fakeWin; };

        this.presenter.loadMathJaxIntoEditor(this.fakeEditor);

        const scripts = this.fakeDoc.head.querySelectorAll('script[type="text/javascript"]');
        assertEquals(1, scripts.length);
    },

    'test given editor returning null win when loading MathJax then nothing is appended': function () {
        const fakeDoc = this.fakeDoc;
        this.fakeEditor.getDoc = function () { return fakeDoc; };
        this.fakeEditor.getWin = function () { return null; };

        this.presenter.loadMathJaxIntoEditor(this.fakeEditor);

        const children = this.fakeDoc.head.children;
        assertEquals(0, children.length);
    }
});

TestCase("[EditableWindow] MathJax - invalidatePreviousRenderingAttempt", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.clock = sinon.useFakeTimers();
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            retryIntervalId: null,
            renderingInProgress: false,
            renderingTimeoutId: null,
            currentRequestId: null
        };
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test given no active interval or timeout when invalidating then ids remain null': function () {
        this.presenter.invalidatePreviousRenderingAttempt();

        assertNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
        assertNull(this.presenter.configuration.mathJaxModel.renderingTimeoutId);
    },

    'test given active retryIntervalId when invalidating then interval is cleared and id set to null': function () {
        let callbackCalled = false;
        this.presenter.configuration.mathJaxModel.retryIntervalId = setInterval(
            function () { callbackCalled = true; }, 100
        );

        this.presenter.invalidatePreviousRenderingAttempt();

        assertNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
        this.clock.tick(200);
        assertFalse(callbackCalled);
    },

    'test given active renderingTimeoutId when invalidating then timeout is cleared and id set to null': function () {
        let callbackCalled = false;
        this.presenter.configuration.mathJaxModel.renderingTimeoutId = setTimeout(
            function () { callbackCalled = true; }, 100
        );

        this.presenter.invalidatePreviousRenderingAttempt();

        assertNull(this.presenter.configuration.mathJaxModel.renderingTimeoutId);
        this.clock.tick(200);
        assertFalse(callbackCalled);
    },

    'test given both active interval and timeout when invalidating then both are cleared': function () {
        let intervalCalled = false;
        let timeoutCalled = false;
        this.presenter.configuration.mathJaxModel.retryIntervalId = setInterval(
            function () { intervalCalled = true; }, 100
        );
        this.presenter.configuration.mathJaxModel.renderingTimeoutId = setTimeout(
            function () { timeoutCalled = true; }, 100
        );

        this.presenter.invalidatePreviousRenderingAttempt();

        this.clock.tick(200);
        assertNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
        assertNull(this.presenter.configuration.mathJaxModel.renderingTimeoutId);
        assertFalse(intervalCalled);
        assertFalse(timeoutCalled);
    }
});

TestCase("[EditableWindow] MathJax - getEditorContext", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.presenter.configuration.editor = null;
    },

    'test given no editor when getting context then returns null': function () {
        this.presenter.configuration.editor = null;

        const result = this.presenter.getEditorContext();

        assertNull(result);
    },

    'test given editor with no win when getting context then returns null': function () {
        this.presenter.configuration.editor = {
            getWin: function () { return null; },
            getBody: function () { return document.createElement('div'); }
        };

        const result = this.presenter.getEditorContext();

        assertNull(result);
    },

    'test given editor with no body when getting context then returns null': function () {
        this.presenter.configuration.editor = {
            getWin: function () { return window; },
            getBody: function () { return null; }
        };

        const result = this.presenter.getEditorContext();

        assertNull(result);
    },

    'test given editor with valid win and body when getting context then returns correct context': function () {
        const fakeWin = { MathJax: {} };
        const fakeBody = document.createElement('div');
        this.presenter.configuration.editor = {
            getWin: function () { return fakeWin; },
            getBody: function () { return fakeBody; }
        };

        const result = this.presenter.getEditorContext();

        assertNotNull(result);
        assertEquals(fakeWin, result.win);
        assertEquals(fakeBody, result.body);
    }
});

TestCase("[EditableWindow] MathJax - createMathJaxTypesetAttempt", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.fakeBody = document.createElement('div');
        this.fakeWin = {};
        this.editorContext = { win: this.fakeWin, body: this.fakeBody };
        this.requestId = 0.12345;
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            retryIntervalId: null,
            renderingInProgress: false,
            renderingTimeoutId: null,
            currentRequestId: this.requestId
        };
        this.clock = sinon.useFakeTimers();
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test given MathJax not present in win when attempting typeset then returns false': function () {
        this.fakeWin.MathJax = undefined;
        const attemptTypeset = this.presenter.createMathJaxTypesetAttempt(this.requestId, this.editorContext);

        const result = attemptTypeset();

        assertFalse(result);
    },

    'test given MathJax Hub not present in win when attempting typeset then returns false': function () {
        this.fakeWin.MathJax = {};
        const attemptTypeset = this.presenter.createMathJaxTypesetAttempt(this.requestId, this.editorContext);

        const result = attemptTypeset();

        assertFalse(result);
    },

    'test given outdated requestId when attempting typeset then returns false': function () {
        this.fakeWin.MathJax = { Hub: { Queue: function () {}, Typeset: function () {} } };
        this.presenter.configuration.mathJaxModel.currentRequestId = 0.99999;
        const attemptTypeset = this.presenter.createMathJaxTypesetAttempt(this.requestId, this.editorContext);

        const result = attemptTypeset();

        assertFalse(result);
    },

    'test given valid MathJax and matching requestId when attempting typeset then returns true': function () {
        this.fakeWin.MathJax = { Hub: { Queue: function () {}, Typeset: function () {} } };
        const attemptTypeset = this.presenter.createMathJaxTypesetAttempt(this.requestId, this.editorContext);

        const result = attemptTypeset();

        assertTrue(result);
    },

    'test given valid MathJax and matching requestId when attempting typeset then renderingInProgress is set to true': function () {
        this.fakeWin.MathJax = { Hub: { Queue: function () {}, Typeset: function () {} } };
        const attemptTypeset = this.presenter.createMathJaxTypesetAttempt(this.requestId, this.editorContext);

        attemptTypeset();

        assertTrue(this.presenter.configuration.mathJaxModel.renderingInProgress);
    },

    'test given valid MathJax and matching requestId when attempting typeset then Queue is called': function () {
        let queueCalled = false;
        this.fakeWin.MathJax = {
            Hub: { Queue: function () { queueCalled = true; }, Typeset: function () {} }
        };
        const attemptTypeset = this.presenter.createMathJaxTypesetAttempt(this.requestId, this.editorContext);

        attemptTypeset();

        assertTrue(queueCalled);
    }
});

TestCase("[EditableWindow] MathJax - executeTypesetIfRequestIsCurrent", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.requestId = 0.12345;
        this.fakeBody = document.createElement('div');
        this.typesetCalled = false;
        const self = this;
        this.fakeWin = {
            MathJax: {
                Hub: {
                    Typeset: function (body) { self.typesetCalled = true; }
                }
            }
        };
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            retryIntervalId: null,
            renderingInProgress: true,
            renderingTimeoutId: null,
            currentRequestId: this.requestId
        };
    },

    'test given matching requestId when executing typeset then Typeset is called': function () {
        this.presenter.executeTypesetIfRequestIsCurrent(this.requestId, this.fakeWin, this.fakeBody);

        assertTrue(this.typesetCalled);
    },

    'test given matching requestId when executing typeset then renderingInProgress is set to false': function () {
        this.presenter.executeTypesetIfRequestIsCurrent(this.requestId, this.fakeWin, this.fakeBody);

        assertFalse(this.presenter.configuration.mathJaxModel.renderingInProgress);
    },

    'test given outdated requestId when executing typeset then Typeset is not called': function () {
        const outdatedId = 0.99999;

        this.presenter.executeTypesetIfRequestIsCurrent(outdatedId, this.fakeWin, this.fakeBody);

        assertFalse(this.typesetCalled);
    },

    'test given outdated requestId when executing typeset then renderingInProgress remains unchanged': function () {
        const outdatedId = 0.99999;

        this.presenter.executeTypesetIfRequestIsCurrent(outdatedId, this.fakeWin, this.fakeBody);

        assertTrue(this.presenter.configuration.mathJaxModel.renderingInProgress);
    },

    'test given Typeset throwing an error when executing typeset then renderingInProgress is set to false': function () {
        this.fakeWin.MathJax.Hub.Typeset = function () { throw new Error("Typeset error"); };

        this.presenter.executeTypesetIfRequestIsCurrent(this.requestId, this.fakeWin, this.fakeBody);

        assertFalse(this.presenter.configuration.mathJaxModel.renderingInProgress);
    }
});

TestCase("[EditableWindow] MathJax - setRenderingTimeoutIfNeeded", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.clock = sinon.useFakeTimers();
        this.requestId = 0.12345;
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            retryIntervalId: null,
            renderingInProgress: true,
            renderingTimeoutId: null,
            currentRequestId: this.requestId
        };
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test given rendering in progress when setting timeout then renderingTimeoutId is set': function () {
        this.presenter.setRenderingTimeoutIfNeeded(this.requestId);

        assertNotNull(this.presenter.configuration.mathJaxModel.renderingTimeoutId);
    },

    'test given rendering in progress when timeout fires then renderingInProgress is set to false': function () {
        this.presenter.setRenderingTimeoutIfNeeded(this.requestId);

        this.clock.tick(2001);

        assertFalse(this.presenter.configuration.mathJaxModel.renderingInProgress);
    },

    'test given rendering in progress when timeout fires then renderingTimeoutId is cleared to null': function () {
        this.presenter.setRenderingTimeoutIfNeeded(this.requestId);

        this.clock.tick(2001);

        assertNull(this.presenter.configuration.mathJaxModel.renderingTimeoutId);
    },

    'test given outdated requestId when timeout fires then renderingInProgress remains true': function () {
        this.presenter.setRenderingTimeoutIfNeeded(this.requestId);
        this.presenter.configuration.mathJaxModel.currentRequestId = 0.99999;

        this.clock.tick(2001);

        assertTrue(this.presenter.configuration.mathJaxModel.renderingInProgress);
    },

    'test given renderingInProgress already false when timeout fires then renderingInProgress stays false': function () {
        this.presenter.configuration.mathJaxModel.renderingInProgress = false;
        this.presenter.setRenderingTimeoutIfNeeded(this.requestId);

        this.clock.tick(2001);

        assertFalse(this.presenter.configuration.mathJaxModel.renderingInProgress);
    }
});

TestCase("[EditableWindow] MathJax - createRenderingIntervalWithWaitLogic", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.clock = sinon.useFakeTimers();
        this.requestId = 0.12345;
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            retryIntervalId: null,
            renderingInProgress: false,
            renderingTimeoutId: null,
            currentRequestId: this.requestId
        };
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test given attemptTypeset returning false when creating interval then retryIntervalId is set': function () {
        const attemptTypeset = function alwaysFalse (){ return false; };

        this.presenter.createRenderingIntervalWithWaitLogic(attemptTypeset, this.requestId);

        assertNotNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
    },

    'test given attemptTypeset returning true on first call when interval fires then interval is cleared': function () {
        const attemptTypeset = function alwaysTrue (){ return true; };

        this.presenter.createRenderingIntervalWithWaitLogic(attemptTypeset, this.requestId);
        this.clock.tick(51);

        assertNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
    },

    'test given attemptTypeset always returning false when max wait time exceeded then interval is cleared': function () {
        const attemptTypeset = function alwaysFalse (){ return false; };

        this.presenter.createRenderingIntervalWithWaitLogic(attemptTypeset, this.requestId);
        this.clock.tick(10001);

        assertNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
    },

    'test given max wait time exceeded and request still current when interval clears then renderingInProgress is false': function () {
        const attemptTypeset = function alwaysFalse (){ return false; };
        this.presenter.configuration.mathJaxModel.renderingInProgress = true;

        this.presenter.createRenderingIntervalWithWaitLogic(attemptTypeset, this.requestId);
        this.clock.tick(10001);

        assertFalse(this.presenter.configuration.mathJaxModel.renderingInProgress);
    },

    'test given outdated requestId when interval fires then interval is immediately cleared': function () {
        const attemptTypeset = function alwaysFalse (){ return false; };
        this.presenter.configuration.mathJaxModel.currentRequestId = 0.99999;

        this.presenter.createRenderingIntervalWithWaitLogic(attemptTypeset, this.requestId);
        this.clock.tick(51);

        assertNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
    },

    'test given attemptTypeset returning false multiple times when interval fires then attemptTypeset called multiple times': function () {
        let callCount = 0;
        const attemptTypeset = function () { callCount++; return false; };

        this.presenter.createRenderingIntervalWithWaitLogic(attemptTypeset, this.requestId);
        this.clock.tick(201);

        assert(callCount > 1);
    }
});

TestCase("[EditableWindow] MathJax - renderMathJax", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.clock = sinon.useFakeTimers();
        this.fakeBody = document.createElement('div');
        this.fakeWin = {
            MathJax: {
                Hub: {
                    Queue: function () {},
                    Typeset: function () {}
                }
            }
        };
        this.fakeEditor = {
            getWin: function () { return null; },
            getBody: function () { return null; }
        };
        this.presenter.configuration.mathJaxModel = {
            isValid: true,
            retryIntervalId: null,
            renderingInProgress: false,
            renderingTimeoutId: null,
            currentRequestId: null
        };
        this.presenter.configuration.editor = null;
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test given no editor when rendering then currentRequestId is still set': function () {
        this.presenter.renderMathJax();

        assertNotNull(this.presenter.configuration.mathJaxModel.currentRequestId);
    },

    'test given no editor when rendering then no interval is created': function () {
        this.presenter.renderMathJax();

        assertNull(this.presenter.configuration.mathJaxModel.retryIntervalId);
    },

    'test given two consecutive render calls when rendering then currentRequestId is updated': function () {
        this.presenter.renderMathJax();
        const firstRequestId = this.presenter.configuration.mathJaxModel.currentRequestId;

        this.presenter.renderMathJax();
        const secondRequestId = this.presenter.configuration.mathJaxModel.currentRequestId;

        assertNotEquals(firstRequestId, secondRequestId);
    },

    'test given active retryIntervalId when rendering then previous interval is invalidated': function () {
        let callbackCalled = false;
        this.presenter.configuration.mathJaxModel.retryIntervalId = setInterval(function () {
            callbackCalled = true;
        }, 100);

        this.presenter.renderMathJax();
        this.clock.tick(200);

        assertFalse(callbackCalled);
    },

    'test given valid editor context when rendering then retryIntervalId is set': function () {
        const fakeWin = this.fakeWin;
        const fakeBody = this.fakeBody;
        this.presenter.configuration.editor = {
            getWin: function () { return fakeWin; },
            getBody: function () { return fakeBody; }
        };

        this.presenter.renderMathJax();

        assertNotNull(this.presenter.configuration.mathJaxModel.retryIntervalId);

        clearInterval(this.presenter.configuration.mathJaxModel.retryIntervalId);
        this.presenter.configuration.mathJaxModel.retryIntervalId = null;
    }
});

