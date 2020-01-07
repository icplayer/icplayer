function checkIsInList(list, callback) {
    for (var i = 0; i < list.length; i++) {
        var have = list[i].callback == callback || list[i] == callback;
        if (have) {
            return true;
        }
    }
    return false;
}

function checkElementCallback(element, callback) {
    for (var event in element.events) {
        if (element.events.hasOwnProperty(event)) {
            var callbackList = element.events[event];
            if (checkIsInList(callbackList, callback)) {
                return true;
            }
        }
    }
    return false;
}

TestCase("[Commons - Controls-bar] Adding and calling callbacks for elements", {
    setUp: function () {
        this.callback = sinon.spy();
        this.clock = sinon.useFakeTimers();
        this.presenter = { };
        this.parentElement = document.createElement('div');
        this.parentChild = document.createElement('div');
        this.secondParentChild = document.createElement('span');
        this.parentElement.appendChild(this.parentChild);
        this.parentElement.appendChild(this.secondParentChild);
        this.controlBar = new CustomControlsBar({
            parentElement: this.parentElement
        });
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test add callback for play button' : function () {
        this.controlBar.addPlayCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.playButton, this.callback));
        this.controlBar.elements.playButton.element.click();
        assertTrue(this.callback.calledOnce);

    },

    'test add callback for pause button' : function () {
        this.controlBar.addPauseCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.pauseButton, this.callback));
        this.controlBar.elements.pauseButton.element.click();
        assertTrue(this.callback.calledOnce);
    },

    'test add callback for stop button' : function () {
        this.controlBar.addStopCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.stopButton, this.callback));
        this.controlBar.elements.stopButton.element.click();
        assertTrue(this.callback.calledOnce);
    },

    'test add callback for volume button' : function () {
        this.controlBar.addVolumeClickCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.volume, this.callback));
        this.controlBar.elements.volume.element.click();
        assertTrue(this.callback.calledOnce);
    },

    'test given disabled volume bar when callback is added then it\'s not working': function () {
        this.controlBar = new CustomControlsBar({
            parentElement: this.parentElement,
            isVolumeEnabled: false
        });

        this.controlBar.addVolumeClickCallback(this.callback);
        assertFalse(checkElementCallback(this.controlBar.elements.volume, this.callback));
        this.controlBar.elements.volume.element.click();
        assertFalse(this.callback.calledOnce);
    },

    'test add callback for fullscreen button' : function () {
        this.controlBar.addFullscreenCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.fullscreen, this.callback));
        this.controlBar.elements.fullscreen.element.click();
        assertTrue(this.callback.calledOnce);
    },

    'test add callback for closefullscreen button' : function () {
        this.controlBar.addCloseFullscreenCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.closeFullscreen, this.callback));
        this.controlBar.elements.closeFullscreen.element.click();
        assertTrue(this.callback.calledOnce);
    },

    'test add callback for progressbar button' : function () {
        this.controlBar.addProgressBarClickCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.progressBarWrapper, this.callback));
        this.controlBar.elements.progressBarWrapper.element.click();
        assertTrue(this.callback.calledOnce);
    },

     'test add callback for volumebar button' : function () {
        this.controlBar.addVolumeBarClickCallback(this.callback);
        assertTrue(checkElementCallback(this.controlBar.elements.volumeBarWrapper, this.callback));
         this.controlBar.elements.volumeBarWrapper.element.click();
        assertTrue(this.callback.calledOnce);
    },

    'test add progress changed callback' : function () {
        this.controlBar.addProgressChangedCallback(this.callback);
        assertTrue(checkIsInList(this.controlBar.progressBarChangedCallbacks));
        this.controlBar.elements.progressBarWrapper.element.click();
        assertTrue(this.callback.calledOnce);
    },

    'test add callback for build in timer' : function () {
        this.controlBar.addCallbackToBuildInTimer(this.callback);
        assertTrue(checkIsInList(this.controlBar.ownTimerCallbacks, this.callback));
        this.clock.tick(99);
        assertTrue(this.callback.callCount === 0);
        this.clock.tick(2);
        assertTrue(this.callback.calledOnce);
        this.clock.tick(99);
        assertTrue(this.callback.callCount === 2);
    },

    'test add callback for parent children elements' : function () {
        this.controlBar.addCallbackForParentChildren(this.callback);
        this.parentChild.click();
        assertTrue(this.callback.calledOnce);
        this.secondParentChild.click();
        assertTrue(this.callback.calledTwice);
    }


});
