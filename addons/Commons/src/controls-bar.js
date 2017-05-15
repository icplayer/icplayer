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


    /**
    Custom controls bar for video/audio data.

    @param {Object} parentElement element which should be custom bar parent element and
    @param {Object} userConfiguration object with user configuration
    @return {null}
    */
    function CustomControlsBar(parentElement, userConfiguration) {
        this.buildConfiguration(userConfiguration);

        this.elements = buildHTMLTree();
        this.progressBarChangedCallbacks = [];
        this.volumeChangedCallbacks = [];

        this.addPlayCallback(this.showPlayButton.bind(this));
        this.addPauseCallback(this.showPauseButton.bind(this));
        this.addStopCallback(this.showPauseButton.bind(this));
        this.addVolumeClickCallback(this.showHideVolumeBar.bind(this));
        this.addFullscreenCallback(this.showFullscreenButton.bind(this));
        this.addCloseFullscreenCallback(this.showCloseFullscreenButton.bind(this));
        this.addProgressBarClickCallback(this.progressBarClicked.bind(this));
        this.addVolumeBarClickCallback(this.volumeBarClicked.bind(this));

        this.hideControls = this.hideControls.bind(this);
        this.showControls = this.showControls.bind(this);
        this.onWrapperMouseEnter = this.onWrapperMouseEnter.bind(this);
        this.onWrapperMouseMove = this.onWrapperMouseMove.bind(this);
        this.refreshDataIntervalFunction = this.refreshDataIntervalFunction.bind(this);

        this.actualizeTimer();

        if (parentElement) {
            this.parentElement = parentElement;
            this.buildShowAndHideControlsEvents();
            this.addPlayCallbackForParent(this.playPauseClick.bind(this));
        }
    }


    /**
    Add new callback when progress was changed.
    @method addProgressChangedCallback. At first parameter will be calculated percent.

    @param {function} callback to execute
    @return {null}
    */
    CustomControlsBar.prototype.addProgressChangedCallback = function (callback) {
        this.progressBarChangedCallbacks.push(callback);
    };

    /**
    Add new callback when volume was changed
    @method addVolumeChangedCallback. At first parameter will be calculated percent.

    @param {function} callback to execute
    @return {null}
    */
    CustomControlsBar.prototype.addVolumeChangedCallback = function (callback) {
        this.volumeChangedCallbacks.push(callback);
    };


    /**
    Default callback for click on progress bar. This function will call all functions added in addProgressChangedCallback
    @method progressBarClicked

    @param {eventData} e Event data to calculate percent
    @return {null}
    */
    CustomControlsBar.prototype.progressBarClicked = function (e) {
        var actualPosition = (e.clientX - cumulativeOffset(this.elements.grayProgressBar.element).left);
        var percent = (actualPosition * 100) / this.elements.grayProgressBar.element.offsetWidth;
        for (var i = 0; i < this.progressBarChangedCallbacks.length; i++) {
            this.progressBarChangedCallbacks[i](percent);
        }

        e.preventDefault();
        e.stopPropagation();
    };

    /**
    Default callback for click on volume bar. This function will call all functions added in addVolumeChangedCallback
    @method volumeBarClicked

    @param {eventData} e event data to calculate percent
    @return {null}
    */
    CustomControlsBar.prototype.volumeBarClicked = function (e) {
        var actualPosition = (e.clientX - cumulativeOffset(this.elements.volumeBarWrapper.element).left);
        var percent = (actualPosition * 100) / this.elements.volumeBarWrapper.element.offsetWidth;
        for (var i = 0; i < this.volumeChangedCallbacks.length; i++) {
            this.volumeChangedCallbacks[i](percent);
        }
        this.elements.volumeBackgroundSelected.element.style.width = parseInt((percent / 100) * this.elements.volumeBackground.element.offsetWidth, 10) + "px";

        e.preventDefault();
        e.stopPropagation();
    };


    /**
    Function do decide which, play or pause should be clicked to trigger click/pause.
    @method triggerPlayClick

    @return {null}
    */
    CustomControlsBar.prototype.playPauseClick = function () {
        if (this.elements.playButton.element.style.display === 'block') {
            this.elements.playButton.element.click();
        } else {
            this.elements.pauseButton.element.click();
        }

    };

    /**
    Build and set configuration based on user configuration
    @method buildConfiguration

    @param {Object} userConfiguration which should have object with user configuration
    @return {null}
    */
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

    /**
    Build and set timer to html element
    @method actualizeTimer

    @return {null}
    */
    CustomControlsBar.prototype.actualizeTimer = function () {
        this.elements.timer.element.innerHTML = buildTime(this.configuration.actualMediaTime) + "/" + buildTime(this.configuration.maxMediaTime);
        if (this.configuration.maxMediaTime !== 0 && this.configuration.maxMediaTime !== undefined && this.configuration.maxMediaTime !== null) {
            var actualPercent = parseInt((this.configuration.actualMediaTime / this.configuration.maxMediaTime) * 100, 10);
            this.elements.redProgressBar.element.style.width = actualPercent + "%";
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

    /**
    Build and set events to hidding and showing custom bar.
    @method buildShowAndHideControlsEvents

    @return {null}
    */
    CustomControlsBar.prototype.buildShowAndHideControlsEvents = function () {
        this.actualTime = 0;
        addEventListener("mouseleave", this.parentElement, this.hideControls);
        addEventListener("mouseenter", this.parentElement, this.onWrapperMouseEnter);
        addEventListener("mousemove", this.parentElement, this.onWrapperMouseMove);

        this.refreshDataIntervalFunction = setInterval(this.refreshDataIntervalFunction, this.configuration.mouseDontMoveRefreshTime);
    };

    /**
    Function which will be called in interval
    @method refreshDataIntervalFunction

    @return {null}
    */
    CustomControlsBar.prototype.refreshDataIntervalFunction = function () {
        if (!this.mainDivIsHidden) {
            if (this.actualTime > this.configuration.mouseDontMoveClocks) {
                this.hideControls();
            }
            this.actualTime++;
        }
        var videoObject = this.configuration.videoObject;
        if (videoObject !== null) {
            this.setCurrentTime(videoObject.currentTime);
            if (videoObject.paused === false) {
                this.showPlayButton();
            } else {
                this.showPauseButton();
            }
        }
    };

    /**
    Function which will be called after moving mouse on parent element to show custom control bar
    @method onWrapperMouseMove

    @return {null}
    */
    CustomControlsBar.prototype.onWrapperMouseMove = function () {
        this.actualTime = 0;
        this.showControls();
    };

    /**
    Function which will be called to hide custom control bar
    @method hideControls

    @return {null}
    */
    CustomControlsBar.prototype.hideControls = function () {
        this.elements.mainDiv.element.style.display = 'none';
        this.mainDivIsHidden = true;
    };

    /**
    Function which will be called when mouse will enter on parent element to show controls
    @method onWrapperMouseEnter

    @return {null}
    */
    CustomControlsBar.prototype.onWrapperMouseEnter = function () {
        this.showControls();
        this.actualTime = 0;
    };

    /**
    Function to show controls
    @method showControls

    @return {null}
    */
    CustomControlsBar.prototype.showControls = function () {
        if (this.mainDivIsHidden) {
            this.elements.mainDiv.element.style.display = 'block';
            this.mainDivIsHidden = false;
        }
    };


    /**
    Function to show play button
    @method showPlayButton

    @return {null}
    */
    CustomControlsBar.prototype.showPlayButton = function (e) {
        this.elements.playButton.element.style.display = 'none';
        this.elements.pauseButton.element.style.display = 'block';
        if (e !== undefined) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
    Function to show fullscreen button
    @method showFullscreenButton

    @return {null}
    */
    CustomControlsBar.prototype.showFullscreenButton = function (e) {
        this.elements.fullscreen.element.style.display = 'none';
        this.elements.closeFullscreen.element.style.display = 'block';

        e.preventDefault();
        e.stopPropagation();
    };

    /**
    Function to show fullscreen play button
    @method showCloseFullscreenButton

    @return {null}
    */
    CustomControlsBar.prototype.showCloseFullscreenButton = function (e) {
        this.elements.closeFullscreen.element.style.display = 'none';
        this.elements.fullscreen.element.style.display = 'block';

        e.preventDefault();
        e.stopPropagation();
    };

    /**
    Function to show or hide volume bar
    @method showHideVolumeBar

    @return {null}
    */
    CustomControlsBar.prototype.showHideVolumeBar = function (e) {
        if (this.elements.volumeBackground.element.style.display === 'none') {
            this.elements.volumeBackground.element.style.display = 'block';
            this.elements.volumeBackgroundSelected.element.style.display = 'block';
        } else {
            this.elements.volumeBackground.element.style.display = 'none';
            this.elements.volumeBackgroundSelected.element.style.display = 'none';
        }

        e.preventDefault();
        e.stopPropagation();
    };

    /**
    Function to show pause button
    @method showPauseButton

    @return {null}
    */
    CustomControlsBar.prototype.showPauseButton = function (e) {
        this.elements.playButton.element.style.display = 'block';
        this.elements.pauseButton.element.style.display = 'none';


        if (e !== undefined) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
    Add callback to click on volume bar
    @method addVolumeBarClickCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addVolumeBarClickCallback = function (callback) {
        addNewCallback.call(this, this.elements.volumeBarWrapper, callback, 'click');
        setOnClick(this.elements.volumeBarWrapper.element, callback);
    };

    /**
    Function to click on play button
    @method addPlayCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addPlayCallback = function (callback) {
        addNewCallback.call(this, this.elements.playButton, callback, 'click');
        setOnClick(this.elements.playButton.element, callback);
    };

    /**
    Function to click on progress bar
    @method addProgressBarClickCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addProgressBarClickCallback = function (callback) {
        addNewCallback.call(this, this.elements.progressBarWrapper, callback, 'click');
        setOnClick(this.elements.progressBarWrapper.element, callback);
    };

    /**
    This function will add click events for all elements in parent element without custom controls bar
    @method addPlayCallbackForParent

    @param {function} callback to call
    @return {null}
    */
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

    /**
    Function to click on pause button
    @method addPauseCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addPauseCallback = function (callback) {
        addNewCallback.call(this, this.elements.pauseButton, callback, 'click');
        setOnClick(this.elements.pauseButton.element, callback);
    };

    /**
    Function to click on stop button
    @method addStopCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addStopCallback = function (callback) {
        addNewCallback.call(this, this.elements.stopButton, callback, 'click');
        setOnClick(this.elements.stopButton.element, callback);
    };

    /**
    Function to click on full screen button
    @method addFullscreenCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addFullscreenCallback = function (callback) {
        addNewCallback.call(this, this.elements.fullscreen, callback, 'click');
        setOnClick(this.elements.fullscreen.element, callback);
    };

    /**
    Function to click on close full screen button
    @method addCloseFullscreenCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addCloseFullscreenCallback = function (callback) {
        addNewCallback.call(this, this.elements.closeFullscreen, callback, 'click');
        setOnClick(this.elements.closeFullscreen.element, callback);
    };

    /**
    Function to click on volume button
    @method addVolumeClickCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addVolumeClickCallback = function (callback) {
        addNewCallback.call(this, this.elements.volume, callback, 'click');
        setOnClick(this.elements.volume.element, callback);
    };

    /**
    Function which should destroy custom controls bar elements and remove all listeners
    @method setMaxDurationTime

    @return {null}
    */
    CustomControlsBar.prototype.getMainElement = function () {
        return this.elements.mainDiv.element;
    };

    /**
    Function which should destroy custom controls bar elements and remove all listeners
    @method setMaxDurationTime

    @return {null}
    */
    CustomControlsBar.prototype.destroy = function () {
        //Show hide controls bar events
        clearInterval(this.refreshDataIntervalFunction);
        removeEventListener("mouseleave", this.parentElement, this.hideControls);
        removeEventListener("mouseenter", this.parentElement, this.onWrapperMouseEnter);
        removeEventListener("mousemove", this.parentElement, this.onWrapperMouseMove);


        for (var treeElementName in this.elements) {
            if (this.elements.hasOwnProperty(treeElementName)) {
                destroyTreeElement.call(this, this.elements[treeElementName]);
                if (!treeElementName.startsWith("PARENT_CHILD_")) {
                    this.elements[treeElementName].element.parentNode.removeChild(this.elements[treeElementName].element);
                    this.elements[treeElementName] = null;
                }
            }
        }
    };

    /**
    Set max media duration time
    @method setMaxDurationTime

    @param {Object} maxDurationTime in seconds passed to set.
    @return {null}
    */
    CustomControlsBar.prototype.setMaxDurationTime = function (maxDurationTime) {
        this.configuration.maxMediaTime = maxDurationTime;
        this.actualizeTimer();
    };


    /**
    Set current time for custom bar
    @method setCurrentTime

    @param {Object} currentTime in seconds passed to set.
    @return {null}
    */
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

        var volumeBackgroundSelected = document.createElement('div');
        volumeBackgroundSelected.className = 'CustomControlsBar-wrapper-controls-volumeBarWrapper-volumeBackgroundSelected';
        volumeBackgroundSelected.style.display = 'none';
        volumeBarWrapper.appendChild(volumeBackgroundSelected);

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
            closeFullscreen: buildTreeNode(closeFullscreen),
            volumeBackgroundSelected: buildTreeNode(volumeBackgroundSelected)

        }
    }

    //http://stackoverflow.com/questions/1480133/how-can-i-get-an-objects-absolute-position-on-the-page-in-javascript
    var cumulativeOffset = function(element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);

        return {
            top: top,
            left: left
        };
    };

    function buildTreeNode (element) {
        return {
            element: element,
            events: {}
        };
    }

    function addNewCallback (treeElement, callback, callbackType) {
        if (treeElement.events[callbackType] === undefined) {
            treeElement.events[callbackType] = [];
        }

        treeElement.events[callbackType].push({
            callback: callback
        })
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

    function destroyTreeElement (treeElement) {
        for (var eventName in treeElement.events) {
            if (treeElement.events.hasOwnProperty(eventName)) {
                for (var i = 0; i < treeElement.events[eventName].length; i++) {
                    removeEventListener(eventName, treeElement.element, treeElement.events[eventName][i].callback);
                }
            }
        }
    }

    function getBasicConfiguration () {
        return {
            mouseDontMoveClocks: 30,
            mouseDontMoveRefreshTime: 100,
            maxMediaTime: 0,
            actualMediaTime: 0,
            videoObject: null
        }
    }


})(window);