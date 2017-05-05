/**
 * @module commons
 */
(function (window) {
    /**
    Custom controls bar for video/audio
    @class DOM Operations Utils
    */
    // Expose utils to the global object
    window.CustomControlsBar = CustomControlsBar;

    function CustomControlsBar(parentElement, userConfiguration) {
        this.buildConfiguration(userConfiguration);

        this.elements = buildHTMLTree();
        this.volumeBarIsVisible = false;

        this.addPlayCallback(this.play.bind(this));
        this.addPauseCallback(this.pause.bind(this));
        this.addStopCallback(this.pause.bind(this));
        this.addVolumeClickCallback(this.openVolume.bind(this));
        this.addFullscreenCallback(this.fullscreen.bind(this));
        this.addCloseFullscreenCallback(this.closeFullscreen.bind(this));
        this.addVolumeClickCallback(this.openVolume.bind(this));

        this.hideControls = this.hideControls.bind(this);
        this.showControls = this.showControls.bind(this);
        this.onWrapperMouseEnter = this.onWrapperMouseEnter.bind(this);
        this.onWrapperMouseMove = this.onWrapperMouseMove.bind(this);
        this.mouseDontMoveIntervalFunction = this.mouseDontMoveIntervalFunction.bind(this);

        this.actualizeTimer();

        if (parentElement) {
            this.parentElement = parentElement;
            this.buildShowAndHideControlsEvents();
            this.addPlayCallbackForParent(this.play.bind(this));
        }
    }

    CustomControlsBar.prototype.buildConfiguration = function (userConfiguration) {
        this.configuration = getBasicConfiguration();
        if (userConfiguration !== undefined && userConfiguration !== null) {
            for (var key in this.configuration) {
                if (this.configuration.hasOwnProperty(key)) {
                    if (userConfiguration[key] !== undefined) {
                        this.configuration[key] = userConfiguration[key];
                    }
                }
            }
        }
    };

    CustomControlsBar.prototype.actualizeTimer = function () {
        this.elements.timer.element.innerHTML = buildTime(this.configuration.actualMediaTime) + "/" + buildTime(this.configuration.maxMediaTime);
        if (this.configuration.maxMediaTime !== 0 && this.configuration.maxMediaTime !== undefined && this.configuration.maxMediaTime !== null) {
            var actualProcent = parseInt((this.configuration.actualMediaTime / this.configuration.maxMediaTime) * 100, 10);
            this.elements.redProgressBar.element.style.width = actualProcent + "%";
        }
    };

    function buildTime(timeInSeconds) {
        if (timeInSeconds === null || timeInSeconds === undefined) {
            return "--:--";
        }
        var minutes = parseInt(timeInSeconds / 60, 10);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var seconds = parseInt(timeInSeconds % 60, 10);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    CustomControlsBar.prototype.buildShowAndHideControlsEvents = function () {
        this.actualTime = 0;
        addEventListener("mouseleave", this.parentElement, this.hideControls);
        addEventListener("mouseenter", this.parentElement, this.onWrapperMouseEnter);
        addEventListener("mousemove", this.parentElement, this.onWrapperMouseMove);

        this.mouseDontMoveIntervalCounter = setInterval(this.mouseDontMoveIntervalFunction, this.configuration.mouseDontMoveRefreshTime);
    };

    CustomControlsBar.prototype.mouseDontMoveIntervalFunction = function () {
        if (!this.mainDivIsHidden) {
            if (this.actualTime > this.configuration.mouseDontMoveClocks) {
                this.hideControls();
            }
            this.actualTime++;
        }
    };

    CustomControlsBar.prototype.onWrapperMouseMove = function () {
        this.actualTime = 0;
        this.showControls();
    };

    CustomControlsBar.prototype.hideControls = function () {
        this.elements.mainDiv.element.style.display = 'none';
        this.mainDivIsHidden = true;

    };

    CustomControlsBar.prototype.onWrapperMouseEnter = function () {
        this.showControls();
        this.actualTime = 0;
    };

    CustomControlsBar.prototype.showControls = function () {
        if (this.mainDivIsHidden) {
            this.elements.mainDiv.element.style.display = 'block';
            this.mainDivIsHidden = false;
        }
    };

    CustomControlsBar.prototype.play = function () {
        this.elements.playButton.element.style.display = 'none';
        this.elements.pauseButton.element.style.display = 'block';
    };

    CustomControlsBar.prototype.fullscreen = function () {
        this.elements.fullscreen.element.style.display = 'none';
        this.elements.closeFullscreen.element.style.display = 'block';
    };

        CustomControlsBar.prototype.closeFullscreen = function () {
        this.elements.closeFullscreen.element.style.display = 'none';
        this.elements.fullscreen.element.style.display = 'block';
    };

    CustomControlsBar.prototype.openVolume = function () {
        console.log("Volume click");
        if (!this.volumeBarIsVisible) {
            this.volumeBarIsVisible = true;
            this.elements.volumeBackground.element.style.display = 'block';
        } else {
            this.volumeBarIsVisible = false;
            this.elements.volumeBackground.element.style.display = 'none';
        }
    };

    CustomControlsBar.prototype.pause = function () {
        this.elements.playButton.element.style.display = 'block';
        this.elements.pauseButton.element.style.display = 'none';
    };

    CustomControlsBar.prototype.getMainElement = function () {
        return this.elements.mainDiv.element;
    };

    CustomControlsBar.prototype.addPlayCallback = function (callback) {
        addNewCallback.call(this, this.elements.playButton, callback, 'click');
        setOnClick(this.elements.playButton.element, callback);
    };

    CustomControlsBar.prototype.addPlayCallbackForParent = function (callback) {
        var ELEMENT_PREFIX = "PARENT_CHILD_";
        var childNodes = this.parentElement.childNodes;
        for (var i = 0 ; i < childNodes.length; i++) {
            if (childNodes[i] !== this.elements.mainDiv.element) {
                this.elements[ELEMENT_PREFIX + i] = buildTreeNode(childNodes[i]);
                setOnClick(childNodes[i], callback);
                addNewCallback.call(this, this.elements[ELEMENT_PREFIX + i], callback, 'click');
            }
        }
    };

    CustomControlsBar.prototype.addPauseCallback = function (callback) {
        addNewCallback.call(this, this.elements.pauseButton, callback, 'click');
        setOnClick(this.elements.pauseButton.element, callback);
    };

    CustomControlsBar.prototype.addStopCallback = function (callback) {
        addNewCallback.call(this, this.elements.stopButton, callback, 'click');
        setOnClick(this.elements.stopButton.element, callback);
    };

    CustomControlsBar.prototype.addFullscreenCallback = function (callback) {
        addNewCallback.call(this, this.elements.fullscreen, callback, 'click');
        setOnClick(this.elements.fullscreen.element, callback);
    };

    CustomControlsBar.prototype.addCloseFullscreenCallback = function (callback) {
        addNewCallback.call(this, this.elements.closeFullscreen, callback, 'click');
        setOnClick(this.elements.closeFullscreen.element, callback);
    };

    CustomControlsBar.prototype.addVolumeClickCallback = function (callback) {
        addNewCallback.call(this, this.elements.volume, callback, 'click');
        setOnClick(this.elements.volume.element, callback);
    };


    function addNewCallback (treeElement, callback, callbackType) {
        if (treeElement.events[callbackType] === undefined) {
            treeElement.events[callbackType] = [];
        }

        treeElement.events[callbackType].push({
            callback: callback
        })
    }



    CustomControlsBar.prototype.destroy = function () {
        //Show hide controls bar events
        clearInterval(this.mouseDontMoveIntervalCounter);
        removeEventListener("mouseleave", this.parentElement, this.hideControls);
        removeEventListener("mouseenter", this.parentElement, this.onWrapperMouseEnter);
        removeEventListener("mousemove", this.parentElement, this.onWrapperMouseMove);


        for (var treeElementName in this.elements) {
            if (this.elements.hasOwnProperty(treeElementName)) {
                destroyTreeElement.call(this, this.elements[treeElementName]);
                this.elements[treeElementName].element.parentNode.removeChild(this.elements[treeElementName].element);
                this.elements[treeElementName] = null;
            }
        }
    };

    function destroyTreeElement (treeElement) {
        for (var eventName in treeElement.events) {
            if (treeElement.events.hasOwnProperty(eventName)) {
                for (var i = 0; i < treeElement.events[eventName].length; i++) {
                    removeEventListener(eventName, treeElement.element, treeElement.events[eventName][i].callback);
                }
            }
        }
    }

    CustomControlsBar.prototype.setMaxDurationTime = function (maxDurationTime) {
        this.configuration.maxMediaTime = maxDurationTime;
        this.actualizeTimer();
    };

    CustomControlsBar.prototype.setCurrentTime = function (currentTime) {
        this.configuration.actualMediaTime = currentTime;
        this.actualizeTimer();
    };

    function buildHTMLTree () {
        var mainDiv = document.createElement('div');
        mainDiv.className = 'CustomControlsBar-wrapper';

        var controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'CustomControlsBar-wrapper-controls-controlsWrapper';
        mainDiv.appendChild(controlsWrapper);

        var progressBarWrapper = document.createElement('div');
        progressBarWrapper.className = 'CustomControlsBar-wrapper-controls-progressBarWrapper';
        mainDiv.appendChild(progressBarWrapper);

        var grayProgressBar = document.createElement('div');
        grayProgressBar.className = 'CustomControlsBar-wrapper-controls-progressBarWrapper-grayProgressBar';
        progressBarWrapper.appendChild(grayProgressBar);

        var redProgressBar = document.createElement('div');
        redProgressBar.className = 'CustomControlsBar-wrapper-controls-progressBarWrapper-redProgressBar';
        progressBarWrapper.appendChild(redProgressBar);

        var playButton = document.createElement('div');
        playButton.className = 'CustomControlsBar-wrapper-controls-play';
        controlsWrapper.appendChild(playButton);

        var pauseButton = document.createElement('div');
        pauseButton.className = 'CustomControlsBar-wrapper-controls-pause';
        pauseButton.style.display = 'none';
        controlsWrapper.appendChild(pauseButton);

        var stopButton = document.createElement('div');
        stopButton.className = 'CustomControlsBar-wrapper-controls-stop';
        controlsWrapper.appendChild(stopButton);

        var volume = document.createElement('div');
        volume.className = 'CustomControlsBar-wrapper-controls-volume';
        controlsWrapper.appendChild(volume);

        var volumeBarWrapper = document.createElement('div');
        volumeBarWrapper.className = 'CustomControlsBar-wrapper-controls-volumeBarWrapper';
        controlsWrapper.appendChild(volumeBarWrapper);

        var volumeBackground = document.createElement('div');
        volumeBackground.className = 'CustomControlsBar-wrapper-controls-volumeBarWrapper-volumeBackground';
        volumeBackground.style.display = 'none';
        volumeBarWrapper.appendChild(volumeBackground);

        var fullscreen = document.createElement('div');
        fullscreen.className = 'CustomControlsBar-wrapper-controls-fullscreen';
        controlsWrapper.appendChild(fullscreen);

        var closeFullscreen = document.createElement('div');
        closeFullscreen.className = 'CustomControlsBar-wrapper-controls-closeFullscreen';
        closeFullscreen.style.display = 'none';
        controlsWrapper.appendChild(closeFullscreen);

        var timer = document.createElement('div');
        timer.className = 'CustomControlsBar-wrapper-controls-timer';
        controlsWrapper.appendChild(timer);

        return {
            mainDiv: buildTreeNode(mainDiv),
            playButton: buildTreeNode(playButton),
            pauseButton: buildTreeNode(pauseButton),
            stopButton: buildTreeNode(stopButton),
            progressBarWrapper: buildTreeNode(progressBarWrapper),
            volume: buildTreeNode(volume),
            volumeBarWrapper: buildTreeNode(volumeBarWrapper),
            timer: buildTreeNode(timer),
            controlsWrapper: buildTreeNode(controlsWrapper),
            volumeBackground: buildTreeNode(volumeBackground),
            fullscreen: buildTreeNode(fullscreen),
            redProgressBar: buildTreeNode(redProgressBar),
            grayProgressBar: buildTreeNode(grayProgressBar),
            closeFullscreen: buildTreeNode(closeFullscreen)

        }
    }

    function buildTreeNode (element) {
        return {
            element: element,
            events: {}
        };
    }

    function setOnClick (element, callback) {
        addEventListener("click", element, callback)
    }

    function addEventListener(eventName, element, callback) {
        if (element.addEventListener) {  // all browsers except IE before version 9
            element.addEventListener(eventName, callback, false);
        } else {
            if (element.attachEvent) {   // IE before version 9
                element.attachEvent("on" + eventName, callback);
            }
        }
    }

    function removeEventListener (eventName, element, callback) {
        if (element.removeEventListener) {
            element.removeEventListener(eventName, callback);
        } else if (element.detachEvent) {
            element.detachEvent(eventName, callback);
        }
    }

    function getBasicConfiguration () {
        return {
            mouseDontMoveClocks: 3,
            mouseDontMoveRefreshTime: 1000,
            maxMediaTime: 0,
            actualMediaTime: 0
        }
    }


})(window);