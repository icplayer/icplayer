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

    function CustomControlsBar() {
        this.elements = buildHTMLTree();

        this.addPlayCallback(this.onPlayClick.bind(this));
        this.addPauseCallback(this.onPauseClick.bind(this));
        //this.addProgressBarEnterCallback(this.onProgressBarEnter.bind(this));
        //this.addProgressBarLeaveCallback(this.onProgressBarLeave.bind(this));
    }

    CustomControlsBar.prototype.onPlayClick = function () {
        this.elements.playButton.element.style.display = 'none';
        this.elements.pauseButton.element.style.display = 'block';
    };

    CustomControlsBar.prototype.onPauseClick = function () {
        this.elements.playButton.element.style.display = 'block';
        this.elements.pauseButton.element.style.display = 'none';
    };

    CustomControlsBar.prototype.onProgressBarEnter = function () {
        var height = this.elements.progressBarWrapper.element.offsetHeight;
        height += 4;
        this.elements.progressBarWrapper.element.style.height = height + "px";
    };

    CustomControlsBar.prototype.onProgressBarLeave = function () {
        var height = this.elements.progressBarWrapper.element.offsetHeight;
        height -= 4;
        this.elements.progressBarWrapper.element.style.height = height + "px";
    };

    CustomControlsBar.prototype.getMainElement = function () {
        return this.elements.mainDiv.element;
    };

    CustomControlsBar.prototype.addPlayCallback = function (callback) {
        this.addNewCallback(this.elements.playButton, callback, 'click');
        setOnClick(this.elements.playButton.element, callback);
    };

    CustomControlsBar.prototype.addPauseCallback = function (callback) {
        this.addNewCallback(this.elements.pauseButton, callback, 'click');
        setOnClick(this.elements.pauseButton.element, callback);
    };

    CustomControlsBar.prototype.addStopCallback = function (callback) {
        this.addNewCallback(this.elements.stopButton, callback, 'click');
        setOnClick(this.elements.stopButton.element, callback);
    };

    CustomControlsBar.prototype.addProgressBarEnterCallback = function (callback) {
        this.addNewCallback(this.elements.progressBarWrapper, callback, 'mouseenter');
        setOnMouseEnter(this.elements.progressBarWrapper.element, callback);
    };

    CustomControlsBar.prototype.addProgressBarLeaveCallback = function (callback) {
        this.addNewCallback(this.elements.progressBarWrapper, callback, 'mouseleave');
        setOnMouseLeave(this.elements.progressBarWrapper.element, callback);
    };

    /**
         Add callback to memory for destroy function
         @method addNewCallback
         @param {Object} treeElement saved in CustomControlsBar
         @param {Object} callback user callback
         @param {String} callbackType callback type e.g: click
     */
    CustomControlsBar.prototype.addNewCallback = function (treeElement, callback, callbackType) {
        if (treeElement.events[callbackType] === undefined) {
            treeElement.events[callbackType] = [];
        }

        treeElement.events[callbackType].push({
            callback: callback,
            type: callback
        })
    };

    CustomControlsBar.prototype.destroy = function () {

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
        volumeBarWrapper.style.display = 'none';
        controlsWrapper.appendChild(volumeBarWrapper);

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
            controlsWrapper: buildTreeNode(controlsWrapper)
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

    function setOnMouseEnter(element, callback) {
        addEventListener("mouseover", element, callback)
    }

    function setOnMouseLeave(element, callback) {
        addEventListener("mouseout", element, callback)
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

    function removeOnClick (element, callback) {
        if (element.removeEventListener) {
            element.removeEventListener("click", callback);
        } else if (element.detachEvent) {
            element.detachEvent("click", callback);
        }
    }


})(window);