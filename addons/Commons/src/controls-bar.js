/**
 * @module commons
 */
(function (window) {
    /**
     * @typedef {{element: HTMLDivElement, events:{}}} TreeNode
     */

    /**
    Custom controls bar for video/audio
    @class DOM Operations Utils
    */
    // Expose utils to the global object
    window.CustomControlsBar = CustomControlsBar;


    /**
    Custom controls bar for video/audio data.
    @memberOf CustomControlsBar
    @constructor
    @param {Object} userConfiguration object with user configuration
    @return {null}
    */
    function CustomControlsBar(userConfiguration) {
        this.buildConfiguration(userConfiguration);

        this.elements = buildHTMLTree();
        this.progressBarChangedCallbacks = [];
        this.volumeChangedCallbacks = [];
        this.ownTimerCallbacks = [];
        this.playbackRate = 1.0;
        this.isSelectorOpen = false;

        this.addPlayCallback(this.showPauseButton.bind(this));
        this.addPauseCallback(this.showPlayButton.bind(this));
        this.addStopCallback(this.showPlayButton.bind(this));
        this.addVolumeClickCallback(this.showHideVolumeBar.bind(this));
        this.addFullscreenCallback(this.showCloseFullscreenButton.bind(this));
        this.addCloseFullscreenCallback(this.showFullscreenButton.bind(this));
        this.addProgressBarClickCallback(this.progressBarClicked.bind(this));
        this.addVolumeBarClickCallback(this.volumeBarClicked.bind(this));

        this.hideControls = this.hideControls.bind(this);
        this.showControls = this.showControls.bind(this);
        this.onWrapperMouseEnter = this.onWrapperMouseEnter.bind(this);
        this.onWrapperMouseMove = this.onWrapperMouseMove.bind(this);
        this.refreshDataIntervalFunction = this.refreshDataIntervalFunction.bind(this);

        this.actualizeTimer();

        if (this.configuration.parentElement) {
            this.buildShowAndHideControlsEvents();
            this.addCallbackForParentChildren(this.playPauseClick.bind(this));
        }
        this.refreshDataIntervalFunction = setInterval(this.refreshDataIntervalFunction, this.configuration.mouseDontMoveRefreshTime);

        if (!this.configuration.isVolumeEnabled) {
            this.elements.volume.element.style.display = 'none';
        }

    }

    /**
    Add new callback when progress was changed.
    @memberOf CustomControlsBar
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
    @memberOf CustomControlsBar
    @method progressBarClicked

    @param {eventData} e Event data to calculate percent
    @return {null}
    */
    CustomControlsBar.prototype.progressBarClicked = function (e) {
        var actualPosition = e.offsetX;
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
        var actualPosition = e.offsetX;
        var percent = (actualPosition * 100) / this.elements.volumeBackground.element.offsetWidth;
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
        if (userConfiguration) {
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
        var actualPercent;
        this.elements.timer.element.innerHTML = buildTime(this.configuration.actualMediaTime) + "/" + buildTime(this.configuration.maxMediaTime);
        if (this.configuration.maxMediaTime) {
            actualPercent = parseInt((this.configuration.actualMediaTime / this.configuration.maxMediaTime) * 100, 10);
            this.elements.redProgressBar.element.style.width = actualPercent + "%";
        }
    };

    function buildTime(timeInSeconds) {
        var minutes, seconds;

        if (timeInSeconds === null || timeInSeconds === undefined) {
            return "--:--";
        }

        minutes = parseInt(timeInSeconds / 60, 10);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        seconds = parseInt(timeInSeconds % 60, 10);

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
        this.configuration.parentElement.addEventListener("mouseleave", this.hideControls, false);
        this.configuration.parentElement.addEventListener("mouseenter", this.onWrapperMouseEnter, false);
        this.configuration.parentElement.addEventListener("mousemove", this.onWrapperMouseMove, false);
    };

    /**
    Function which will be called in interval
    @method refreshDataIntervalFunction

    @return {null}
    */
    CustomControlsBar.prototype.refreshDataIntervalFunction = function () {
        if (this.configuration.parentElement) {
            if (!this.mainDivIsHidden) {
                if (this.actualTime > this.configuration.mouseDontMoveClocks) {
                    this.hideControls();
                }
                if (this.actualTime > this.configuration.mouseDontMoveOnPlaybackRate) {
                    this.isSelectorOpen = false;
                }
                this.actualTime++;
            }
        }

        var videoObject = this.configuration.videoObject;
        if (videoObject !== null) {
            this.setCurrentTime(videoObject.currentTime);
            if (videoObject.readyState >= 3) {
                if (videoObject.paused === false) {
                    this.showPauseButton();
                } else {
                    this.showPlayButton();
                }
            }
        }

        for (var i = 0; i < this.ownTimerCallbacks.length; i++) {
            this.ownTimerCallbacks[i].call(this);
        }
    };

    /**Check if burger menu have good position.
     * @method checkBurgerMenuSize
     * @param {TreeNode} element
     */
    CustomControlsBar.prototype.checkBurgerMenuSize = function (element) {
        var height = element.element.offsetHeight,
            width = element.element.offsetWidth,
            xPosition = element.element.getBoundingClientRect().left - this.configuration.parentElement.getBoundingClientRect().left,
            windowWidth = this.configuration.parentElement.offsetWidth,
            marginLeft = element.element.style.marginLeft;


        if (marginLeft === '') {
            marginLeft = '0';
        }

        marginLeft = parseInt(marginLeft.replace('px', ''), 10);

        element.element.style.marginTop = '-' + (height - 2) + 'px';
        if (width + xPosition - marginLeft > windowWidth) {
            element.element.style.marginLeft = '-' + (width + xPosition - windowWidth - marginLeft) + 'px';
        } else {
            element.element.style.marginLeft = "0px";
        }
    };

    /**
    Register function to calling while executing own interval
    @method addCallbackToBuildInTimer

    @return {null}
    */
    CustomControlsBar.prototype.addCallbackToBuildInTimer = function (callback) {
        this.ownTimerCallbacks.push(callback);
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
        if (!this.isSelectorOpen) {
            this.elements.mainDiv.element.style.display = 'none';
            this.mainDivIsHidden = true;
        }
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
     * @typedef {{title: String, callback: Function}} addBurgerMenuElement
     */
    /**
     * Add new burger menu and add elements to this menu.
     * @param {String} name of burger menu
     * @param {addBurgerMenuElement[]} elements to append
     */
    CustomControlsBar.prototype.addBurgerMenu = function (name, elements) {
        function showContainer (container) {
            container.element.style.display = 'block';
            this.checkBurgerMenuSize(container);
        }

        function hideContainer (container) {
            if (!this.isSelectorOpen) {
                container.element.style.display = 'none';
            }
        }

        var burgerMenuElement = document.createElement('div');
        burgerMenuElement.classList.add('CustomControlsBar-wrapper-controls-burgersContainer-' + name);
        this.elements.burgersContainer.element.appendChild(burgerMenuElement);
        this.elements[name] = buildTreeNode(burgerMenuElement);

        var burgerElementWrapper = document.createElement('div');
        burgerElementWrapper.classList.add('CustomControlsBar-wrapper-controls-burgersContainer-container-' + name);
        var container = buildTreeNode(burgerElementWrapper);

        this.elements['BURGER_MENU_' + name + '_container'] = container;
        burgerMenuElement.appendChild(burgerElementWrapper);

        elements.forEach(function (value, index) {
            var element = document.createElement('div');
            element.classList.add('CustomControlsBar-wrapper-controls-burgersContainer-' + name + '-' + 'element');
            element.classList.add('number-' + index);
            element.innerText = value.title;

            var treeElement = buildTreeNode(element);
            this.elements['BURGER_MENU_' + name + '_' + index] = treeElement;

            addNewCallback.call(this, treeElement, this.wrapBurgerElementClick(hideContainer.bind(this, container), value.callback), 'click');

            burgerElementWrapper.appendChild(element);
        }, this);

        addNewCallback(this.elements[name], showContainer.bind(this, container), 'mouseenter');
        addNewCallback(this.elements[name], hideContainer.bind(this, container), 'mouseleave');
    };

    CustomControlsBar.prototype.addVideoSpeedController = function (callback) {
        var playbackRateControls = document.createElement('div');
        playbackRateControls.classList.add('video-playback-rate');

        playbackRateControls.appendChild(createPlaybackOptions(this, callback));

        this.elements.videoSpeedController.element.appendChild(playbackRateControls);
        this.elements['VideoSpeedController'] = buildTreeNode(playbackRateControls);
    }

    /**
     * Reset playback speed of video to 1
     * @method resetPlaybackSpeed
     */
    CustomControlsBar.prototype.resetPlaybackRateSelectValue = function () {
        $(this.elements.videoSpeedController.element)
            .find('select')
            .val(1.0);
    }

    function createPlaybackOptions(self, callback) {
        var select = document.createElement('select');

        var playingSpeedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2];

        playingSpeedOptions.forEach(function (playingOption) {
            var option = document.createElement('option')
            option.text = playingOption.toString();
            option.value = playingOption.toString();
            if (playingOption === 1.0) {
                option.selected = true;
            }
            select.appendChild(option);
        }, this);

        $(select).on('change', function() {
            callback($(select).val());
            self.hideControls();
        });

        $(select).on('mousedown', function() {
            self.isSelectorOpen = !self.isSelectorOpen;
        });

        return select;
    }

    /**
     * Call one function before second.
     * @param beforeCall function to call before
     * @param originalFunction function to call after
     * @returns {Function}
     */
    CustomControlsBar.prototype.wrapBurgerElementClick = function (beforeCall, originalFunction) {
        return function () {
            beforeCall.apply(this, arguments);
            originalFunction.apply(this, arguments)
        };
    };

    /**
     * Remove burger menu from dom, remove event listeners.
     * @method removeBurgerMenu
     * @param {String} name
     */
    CustomControlsBar.prototype.removeBurgerMenu = function (name) {
        if (this.elements[name]) {
            destroyTreeElement.call(this, this.elements[name]);
            this.elements[name].element.parentNode.removeChild(this.elements[name].element);
            delete this.elements[name];
        }

        for (var elementName in this.elements) {
            if (this.elements.hasOwnProperty(elementName)) {
                if (elementName.startsWith("BURGER_MENU_" + name + "_")) {
                    destroyTreeElement.call(this, this.elements[elementName]);
                    this.elements[elementName].element.parentNode.removeChild(this.elements[elementName].element);
                    delete this.elements[elementName];
                }
            }
        }
    };

    /**
    Function to show play button
    @method showPlayButton

    @return {null}
    */
    CustomControlsBar.prototype.showPauseButton = function (e) {
        this.elements.playButton.element.style.display = 'none';
        this.elements.pauseButton.element.style.display = 'block';
        if (e !== undefined) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
    Function to show fullscreen button
    @method showCloseFullscreenButton

    @return {null}
    */
    CustomControlsBar.prototype.showCloseFullscreenButton = function (e) {
        this.elements.fullscreen.element.style.display = 'none';
        this.elements.closeFullscreen.element.style.display = 'block';
        if (e !== undefined && e !== null) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    /**
    Function to show fullscreen play button
    @method showFullscreenButton

    @return {null}
    */
    CustomControlsBar.prototype.showFullscreenButton = function (e) {
        this.elements.closeFullscreen.element.style.display = 'none';
        this.elements.fullscreen.element.style.display = 'block';
        if (e !== undefined && e !== null) {
            e.preventDefault();
            e.stopPropagation();
        }
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
    CustomControlsBar.prototype.showPlayButton = function (e) {
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
    };

    /**
    Function to click on play button
    @method addPlayCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addPlayCallback = function (callback) {
        addNewCallback.call(this, this.elements.playButton, callback, 'click');
    };

    /**
    Function to click on progress bar
    @method addProgressBarClickCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addProgressBarClickCallback = function (callback) {
        addNewCallback.call(this, this.elements.progressBarWrapper, callback, 'click');
    };

    /**
    This function will add click events for all elements in parent element without custom controls bar
    @method addCallbackForParentChildren

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addCallbackForParentChildren = function (callback) {
        var ELEMENT_PREFIX = "PARENT_CHILD_";
        var childNodes = this.configuration.parentElement.childNodes;
        for (var i = 0 ; i < childNodes.length; i++) {
            if (childNodes[i] !== this.elements.mainDiv.element) {
                this.elements[ELEMENT_PREFIX + i] = buildTreeNode(childNodes[i]);
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
    };

    /**
    Function to click on stop button
    @method addStopCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addStopCallback = function (callback) {
        addNewCallback.call(this, this.elements.stopButton, callback, 'click');
    };

    /**
    Function to click on full screen button
    @method addFullscreenCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addFullscreenCallback = function (callback) {
        addNewCallback.call(this, this.elements.fullscreen, callback, 'click');
    };

    /**
    Function to click on close full screen button
    @method addCloseFullscreenCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addCloseFullscreenCallback = function (callback) {
        addNewCallback.call(this, this.elements.closeFullscreen, callback, 'click');
    };

    /**
    Function to click on volume button
    @method addVolumeClickCallback

    @param {function} callback to call
    @return {null}
    */
    CustomControlsBar.prototype.addVolumeClickCallback = function (callback) {
        if (this.configuration.isVolumeEnabled) {
            addNewCallback.call(this, this.elements.volume, callback, 'click');
        }
    };

    /**
    Function which return main div element which should be added to addon
    @method getMainElement

    @return {DOM} Main div element
    */
    CustomControlsBar.prototype.getMainElement = function () {
        return this.elements.mainDiv.element;
    };

    /**
    Function which should destroy custom controls bar elements and remove all listeners
    @method destroy

    @return {null}
    */
    CustomControlsBar.prototype.destroy = function () {
        //Show hide controls bar events
        clearInterval(this.refreshDataIntervalFunction);
        this.configuration.parentElement.removeEventListener("mouseleave", this.hideControls);
        this.configuration.parentElement.removeEventListener("mouseenter", this.onWrapperMouseEnter);
        this.configuration.parentElement.removeEventListener("mousemove", this.onWrapperMouseMove);

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
        var mainDiv,
            controlsWrapper,
            progressBarWrapper,
            grayProgressBar,
            redProgressBar,
            playButton,
            pauseButton,
            stopButton,
            volume,
            volumeBarWrapper,
            volumeBackground,
            volumeBackgroundSelected,
            fullscreen,
            closeFullscreen,
            timer,
            videoSpeedController,
            burgersContainer;

        mainDiv = document.createElement('div');
        mainDiv.className = 'CustomControlsBar-wrapper';

        controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'CustomControlsBar-wrapper-controls-controlsWrapper';
        mainDiv.appendChild(controlsWrapper);

        progressBarWrapper = document.createElement('div');
        progressBarWrapper.className = 'CustomControlsBar-wrapper-controls-progressBarWrapper';
        mainDiv.appendChild(progressBarWrapper);

        grayProgressBar = document.createElement('div');
        grayProgressBar.className = 'CustomControlsBar-wrapper-controls-progressBarWrapper-grayProgressBar';
        progressBarWrapper.appendChild(grayProgressBar);

        redProgressBar = document.createElement('div');
        redProgressBar.className = 'CustomControlsBar-wrapper-controls-progressBarWrapper-redProgressBar';
        progressBarWrapper.appendChild(redProgressBar);

        playButton = document.createElement('div');
        playButton.className = 'CustomControlsBar-wrapper-controls-play';
        controlsWrapper.appendChild(playButton);

        pauseButton = document.createElement('div');
        pauseButton.className = 'CustomControlsBar-wrapper-controls-pause';
        pauseButton.style.display = 'none';
        controlsWrapper.appendChild(pauseButton);

        stopButton = document.createElement('div');
        stopButton.className = 'CustomControlsBar-wrapper-controls-stop';
        controlsWrapper.appendChild(stopButton);

        volume = document.createElement('div');
        volume.className = 'CustomControlsBar-wrapper-controls-volume';
        controlsWrapper.appendChild(volume);

        volumeBarWrapper = document.createElement('div');
        volumeBarWrapper.className = 'CustomControlsBar-wrapper-controls-volumeBarWrapper';
        controlsWrapper.appendChild(volumeBarWrapper);

        volumeBackground = document.createElement('div');
        volumeBackground.className = 'CustomControlsBar-wrapper-controls-volumeBarWrapper-volumeBackground';
        volumeBackground.style.display = 'none';
        volumeBarWrapper.appendChild(volumeBackground);

        volumeBackgroundSelected = document.createElement('div');
        volumeBackgroundSelected.className = 'CustomControlsBar-wrapper-controls-volumeBarWrapper-volumeBackgroundSelected';
        volumeBackgroundSelected.style.display = 'none';
        volumeBarWrapper.appendChild(volumeBackgroundSelected);

        fullscreen = document.createElement('div');
        fullscreen.className = 'CustomControlsBar-wrapper-controls-fullscreen';
        controlsWrapper.appendChild(fullscreen);

        closeFullscreen = document.createElement('div');
        closeFullscreen.className = 'CustomControlsBar-wrapper-controls-closeFullscreen';
        closeFullscreen.style.display = 'none';
        controlsWrapper.appendChild(closeFullscreen);

        burgersContainer = document.createElement('div');
        burgersContainer.className = 'CustomControlsBar-wrapper-controls-burgersContainer';
        controlsWrapper.appendChild(burgersContainer);

        timer = document.createElement('div');
        timer.className = 'CustomControlsBar-wrapper-controls-timer';
        controlsWrapper.appendChild(timer);

        videoSpeedController = document.createElement('div');
        videoSpeedController.className = 'CustomControlsBar-wrapper-controls-videoSpeedController';
        controlsWrapper.appendChild(videoSpeedController);

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
            volumeBackgroundSelected: buildTreeNode(volumeBackgroundSelected),
            burgersContainer: buildTreeNode(burgersContainer),
            videoSpeedController: buildTreeNode(videoSpeedController)
        }
    }

    //http://stackoverflow.com/questions/1480133/how-can-i-get-an-objects-absolute-position-on-the-page-in-javascript
    function cumulativeOffset(element) {
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
    }

    function buildTreeNode (element) {
        return {
            element: element,
            events: {}
        };
    }

    function addNewCallback (treeElement, callback, callbackType) {
        if (!treeElement.events[callbackType]) {
            treeElement.events[callbackType] = [];
        }

        treeElement.events[callbackType].push({
            callback: callback
        });

        treeElement.element.addEventListener(callbackType, callback, false);
    }

    function destroyTreeElement (treeElement) {
        for (var eventName in treeElement.events) {
            if (treeElement.events.hasOwnProperty(eventName)) {
                for (var i = 0; i < treeElement.events[eventName].length; i++) {
                    treeElement.element.removeEventListener(eventName, treeElement.events[eventName][i].callback);
                }
            }
        }
    }

    function getBasicConfiguration () {
        return {
            mouseDontMoveOnPlaybackRate: 10,
            mouseDontMoveClocks: 30,
            mouseDontMoveRefreshTime: 100,
            maxMediaTime: 0,
            actualMediaTime: 0,
            videoObject: null,
            parentElement: null,
            isVolumeEnabled: true
        }
    }
})(window);
