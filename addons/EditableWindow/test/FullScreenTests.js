TestCase("[EditableWindow] Full screen toggling tests", {
    createView: function() {
        this.view = document.createElement('div');
        this.container = document.createElement('div');
        this.button = document.createElement('button');
        this.button.className = this.presenter.cssClasses.fullScreenButton.getName();

        this.container.append(this.button);
        this.view.append(this.container);
    },

    setUp: function () {
        this.presenter = AddonEditableWindow_create();

        this.createView();

        this.presenter.configuration = {
            $container: $(this.container),
            view: this.view
        };

        this.presenter.temporaryState = {
            isFullScreen: true
        };

        this.mocks = {
            closeFullScreen: sinon.stub(this.presenter, "closeFullScreen"),
            openFullScreen: sinon.stub(this.presenter, "openFullScreen"),
            updateButtonMenuPosition: sinon.stub(this.presenter, "updateButtonMenuPosition")
        };
    },

    'test given full screen switched on when executing full screen callback then closeFullScreen and updateButtonMenuPosition called': function () {
        this.presenter.temporaryState.isFullScreen = true;

        this.presenter.fullScreenButtonClickedCallback();

        assertTrue(this.mocks.closeFullScreen.called);
        assertTrue(this.mocks.updateButtonMenuPosition.called);
        assertFalse(this.mocks.openFullScreen.called);
    },

    'test given full screen switched off when executing full screen callback then openFullScreen and updateButtonMenuPosition called': function () {
        this.presenter.temporaryState.isFullScreen = false;

        this.presenter.fullScreenButtonClickedCallback();

        assertTrue(this.mocks.openFullScreen.called);
        assertTrue(this.mocks.updateButtonMenuPosition.called);
        assertFalse(this.mocks.closeFullScreen.called);
    },
});

