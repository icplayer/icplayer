TestCase("[ModelViewer3D] Method to request fullscreen tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.model = {
            "ID": "ID",
        };
        this.presenter.playerController = {
            setAbleChangeLayout: sinon.mock()
        };
        this.presenter.wrapper = document.createElement("div");

        this.presenter.configuration = {
            enableFullscreen: true
        };
        this.presenter.fullscreen = {
            isOn: false,
            hasSupport: true,
            requestMethod: sinon.mock(),
            exitMethod: sinon.mock(),
        };
    },

    'test given device with fullscreen support and off fullscreen when requestFullscreen called then enter in fullscreen mode': function () {
        this.presenter.requestFullscreen();

        assertTrue(this.presenter.fullscreen.isOn);
        assertTrue(this.presenter.fullscreen.requestMethod.calledOnce);
    },

    'test given device with fullscreen support and off fullscreen when requestFullscreen called then block change of layout': function () {
        this.presenter.requestFullscreen();

        assertTrue(this.presenter.playerController.setAbleChangeLayout.calledWith(false));
    },

    'test given device with fullscreen support and off fullscreen when requestFullscreen called then add "modelViewerFullscreen" CSS class to wrapper': function () {
        this.presenter.requestFullscreen();

        assertTrue(this.presenter.wrapper.classList.contains("modelViewerFullscreen"));
    },

    'test given device with fullscreen support and on fullscreen when requestFullscreen called then do not call requestMethod': function () {
        this.presenter.fullscreen.isOn = true;
        this.presenter.wrapper.classList.add("modelViewerFullscreen");

        this.presenter.requestFullscreen();

        assertFalse(this.presenter.fullscreen.requestMethod.called);
    },

    'test given device with fullscreen support and on fullscreen when requestFullscreen called then do not call layout method': function () {
        this.presenter.fullscreen.isOn = true;
        this.presenter.wrapper.classList.add("modelViewerFullscreen");

        this.presenter.requestFullscreen();

        assertFalse(this.presenter.playerController.setAbleChangeLayout.called);
    },

    'test given device with fullscreen support and on fullscreen when requestFullscreen called then do not remove "modelViewerFullscreen" CSS class from wrapper': function () {
        this.presenter.fullscreen.isOn = true;
        this.presenter.wrapper.classList.add("modelViewerFullscreen");

        this.presenter.requestFullscreen();

        assertTrue(this.presenter.wrapper.classList.contains("modelViewerFullscreen"));
    },

    'test given device without fullscreen support when requestFullscreen called then do not call requestMethod': function () {
        this.presenter.fullscreen.hasSupport = false;

        this.presenter.requestFullscreen();

        assertFalse(this.presenter.fullscreen.requestMethod.called);
    },

    'test given device without fullscreen support when requestFullscreen called then do not call layout method': function () {
        this.presenter.fullscreen.hasSupport = false;

        this.presenter.requestFullscreen();

        assertFalse(this.presenter.playerController.setAbleChangeLayout.called);
    },

    'test given device without fullscreen support when requestFullscreen called then do not add "modelViewerFullscreen" CSS class to wrapper': function () {
        this.presenter.fullscreen.hasSupport = false;

        this.presenter.requestFullscreen();

        assertFalse(this.presenter.wrapper.classList.contains("modelViewerFullscreen"));
    }
});

TestCase("[ModelViewer3D] Method to exit fullscreen tests", {
    setUp: function () {
        this.presenter = AddonModelViewer3D_create();
        this.model = {
            "ID": "ID",
        };
        this.presenter.playerController = {
            setAbleChangeLayout: sinon.mock()
        };

        this.presenter.wrapper = document.createElement("div");
        this.presenter.wrapper.classList.add("modelViewerFullscreen");

        this.presenter.configuration = {
            enableFullscreen: true
        };
        this.presenter.fullscreen = {
            isOn: true,
            hasSupport: true,
            requestMethod: sinon.mock(),
            exitMethod: sinon.mock(),
        };
    },

    'test given device with fullscreen support and on fullscreen when exitFullscreen called then exit from fullscreen mode': function () {
        this.presenter.exitFullscreen();

        assertFalse(this.presenter.fullscreen.isOn);
        assertTrue(this.presenter.fullscreen.exitMethod.calledOnce);
    },

    'test given device with fullscreen support and on fullscreen when exitFullscreen called then support change of layout': function () {
        this.presenter.exitFullscreen();

        assertTrue(this.presenter.playerController.setAbleChangeLayout.calledWith(true));
    },

    'test given device with fullscreen support and on fullscreen when exitFullscreen called then remove "modelViewerFullscreen" CSS class to wrapper': function () {
        this.presenter.exitFullscreen();

        assertFalse(this.presenter.wrapper.classList.contains("modelViewerFullscreen"));
    },

    'test given device with fullscreen support and off fullscreen when exitFullscreen called then do not call exitMethod': function () {
        this.presenter.fullscreen.isOn = false;
        this.presenter.wrapper.classList.remove("modelViewerFullscreen");

        this.presenter.exitFullscreen();

        assertFalse(this.presenter.fullscreen.exitMethod.called);
    },

    'test given device with fullscreen support and off fullscreen when exitFullscreen called then do not call layout method': function () {
        this.presenter.fullscreen.isOn = false;
        this.presenter.wrapper.classList.remove("modelViewerFullscreen");

        this.presenter.exitFullscreen();

        assertFalse(this.presenter.playerController.setAbleChangeLayout.called);
    },

    'test given device with fullscreen support and off fullscreen when exitFullscreen called then do not add "modelViewerFullscreen" CSS class to wrapper': function () {
        this.presenter.fullscreen.isOn = false;
        this.presenter.wrapper.classList.remove("modelViewerFullscreen");

        this.presenter.exitFullscreen();

        assertFalse(this.presenter.wrapper.classList.contains("modelViewerFullscreen"));
    },

    'test given device without fullscreen support when exitFullscreen called then do not call exitMethod': function () {
        this.presenter.fullscreen.hasSupport = false;

        this.presenter.exitFullscreen();

        assertFalse(this.presenter.fullscreen.exitMethod.called);
    },

    'test given device without fullscreen support when exitFullscreen called then do not call layout method': function () {
        this.presenter.fullscreen.hasSupport = false;

        this.presenter.exitFullscreen();

        assertFalse(this.presenter.playerController.setAbleChangeLayout.called);
    },

    'test given device without fullscreen support when exitFullscreen called then do not add "modelViewerFullscreen" CSS class to wrapper': function () {
        this.presenter.fullscreen.hasSupport = false;
        this.presenter.wrapper.classList.remove("modelViewerFullscreen");

        this.presenter.exitFullscreen();

        assertFalse(this.presenter.wrapper.classList.contains("modelViewerFullscreen"));
    }
});
