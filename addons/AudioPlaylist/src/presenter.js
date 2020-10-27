function AddonAudioPlaylist_create() {
    var presenter = function () {
    };

    var eventBus;

    presenter.ERROR_CODES = {
        'ID_STR01': "Value provided to text property is empty.",
        'ID_STR02': "Value provided to text property is not a valid string.",
        'Is Visible_UMF01': "Is Visible cannot be found.",
        'Stop playing_UMF01': "Stop playing could not be found",
        'items|name_STR01': "Value provided to name property of the item is empty."
    };

    var classList = {
        addonWrapper: 'wrapper-addon-audio-playlist',
        controls: 'addon-audio-playlist-controls',
        prev: 'audio-playlist-prev-btn',
        next: 'audio-playlist-next-btn',
        playPauseButton: 'audio-playlist-play-pause-btn',
        playButton: 'audio-playlist-play-btn',
        pauseButton: 'audio-playlist-pause-btn',
        timer: 'audio-playlist-timer',
        bar: 'audio-playlist-bar',
        barFilling: 'audio-playlist-bar--fill',
        barBall: 'addon-audio-playlist-bar--ball',
        duration: 'audio-playlist-max-time',
        volume: 'audio-playlist-volume-btn',
        items: 'addon-audio-playlist-items',
        item: 'addon-audio-playlist-item',
        itemName: 'addon-audio-playlist-item--name',
        itemSelected: 'addon-audio-playlist-item-selected',
        itemButton: 'addon-audio-playlist-item--button',
        itemPlay: 'addon-audio-playlist-item--button-playing',
        volumeWrapper: 'addon-audio-playlist-volume-wrapper',
        volumeWrapperExpanded: 'addon-audio-playlist-volume-wrapper--expanded',
        volumeBar: 'addon-audio-playlist-volume-bar',
        volumeBarHidden: 'addon-audio-playlist-volume-bar--hidden',
        volumeBarFill: 'addon-audio-playlist-volume-bar-fill'
    };

    var eventNames = {
        playing: "playing",
        pause: "pause",
        end: "end",
        next: "next"
    };

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.wrapper = null;
    presenter.viewItems = {
        prevButton: null,
        nextButton: null,
        playPauseButton: null,
        currentTime: null,
        timerBar: null,
        timerSlider: null,
        timerSliderBall: null,
        maxTime: null,
        volumeButton: null,
        items: null,
        volumeWrapper: null,
        volumeBar: null,
        volumeBarFill: null
    };

    presenter.dragData = {
        wasPlaying: false,
        started: false,
        position: 0
    };

    presenter.items = []; // items in the playlist

    presenter.state = {
        isVisible: false,
        isPlaying: false,
        currentItemIndex: 0,
        sentTime: "00:00",
        showingVolume: false
    };

    presenter.setPlayerController = function AddonAudioPlaylist_setPlayerController(controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
    };

    presenter.run = function AddonAudioPlaylist_run(view, model) {
        presenter.initialize(view, model, false);
        eventBus = presenter.playerController.getEventBus();
        eventBus.addEventListener('ValueChanged', this);
    };

    presenter.createPreview = function AddonAudioPlaylist_createPreview(view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function AddonAudioPlaylist_initialize(view, model, isPreview) {
        presenter.view = view;
        var validatedModel = presenter.validateModel(model);
        this.assignViewItems(view);

        if (!validatedModel.isValid) {
            presenter.showValidationError(validatedModel);
            return;
        }

        presenter.configuration = validatedModel.value;
        presenter.state.isVisible = presenter.configuration.isVisible;

        presenter.createItems();
        if (!isPreview) {
            presenter.audio = presenter.view.getElementsByTagName("audio")[0];
            presenter.addHandlers();
        }

        updateBallPosition();
        presenter.selectItem(this.state.currentItemIndex);
    };

    presenter.getViewItemsWithClickAndTouchHandlers = function AddonAudioPlaylist_getViewItemsWithClickAndTouchHandlers() {
        return [
            { item: presenter.viewItems.playPauseButton, handler: AddonAudioPlaylist__playPauseButtonHandler },
            { item: presenter.viewItems.nextButton, handler: AddonAudioPlaylist__nextButtonHandler },
            { item: presenter.viewItems.prevButton, handler: AddonAudioPlaylist__prevButtonHandler },
            { item: presenter.viewItems.volumeButton, handler: AddonAudioPlaylist__volumeButtonHandler },
            { item: presenter.viewItems.volumeBar, handler: AddonAudioPlaylist__volumeBarHandler }
        ];
    };

    presenter.getAudioHandlers = function AddonAudioPlaylist_getAudioHandlers() {
        return [
            { event: 'loadeddata', handler: AddonAudioPlaylist__onLoadedMetadataCallback },
            { event: 'durationchange', handler: AddonAudioPlaylist__onTimeDurationLoadedCallback },
            { event: 'timeupdate', handler: AddonAudioPlaylist__onTimeUpdateCallback },
            { event: 'ended', handler: AddonAudioPlaylist___onAudioEnded },
            { event: 'playing', handler: AddonAudioPlaylist___onAudioPlaying },
            { event: 'pause', handler: AddonAudioPlaylist___onAudioPause }
        ]
    };

    presenter.destroy = function AddonAudioPlaylist_destroy() {
        presenter.playerController = null;
        var i;

        var elements = presenter.getViewItemsWithClickAndTouchHandlers();

        for (i = 0; i < elements.length; i++) {
            elements[i].item.removeEventListener('click', elements[i].handler);
            elements[i].item.removeEventListener('touch', elements[i].handler);
        }

        elements = presenter.getAudioHandlers();

        for (i = 0; i < elements.length; i++) {
            presenter.audio.removeEventListener(elements[i].event, elements[i].handler);
        }

        presenter.pause();
        presenter.audio = null;

        for (i = 0; i < presenter.items.length; i++) {
            presenter.items[i].button.removeEventListener('durationchange', AddonAudioPlaylistItemWrapper__buttonHandler);

            if (presenter.items[i].audio) {
                presenter.items[i].audio.removeEventListener('durationchange', AddonAudioPlaylistItemWrapper__audioDurationChange);
                presenter.items[i].audio = null;
            }
        }

        deferredSyncQueue = null;
    };

    presenter.onEventReceived = function AddonAudioPlaylist_onEventReceived(eventName, eventData) {    };


    presenter.show = function AddonAudioPlaylist_show() {
        this.setVisibility(true);
        this.state.isVisible = true;
    };

    presenter.hide = function AddonAudioPlaylist_hide() {
        this.stop();
        this.setVisibility(false);
        this.state.isVisible = false;
    };

    presenter.reset = function AddonAudioPlaylist_reset() {
        if (!presenter.audio) return;

        presenter.pause();

        presenter.state.isVisible = presenter.configuration.isVisible;
        if (presenter.state.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    /**
     * @return {string}
     */
    presenter.getState = function AddonAudioPlaylist_getState() {
        return JSON.stringify({
            isVisible: presenter.state.isVisible,
            currentItemIndex: presenter.state.currentItemIndex
        });
    };

    presenter.setState = function AddonAudioPlaylist_setState(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) {
            return;
        }

        presenter.stop();

        var state = JSON.parse(stateString);

        if (state.isVisible) {
            this.show();
        } else {
            this.hideAddon();
        }

        presenter.changeItem(state.currentItemIndex)
    };

    presenter.validateModel = function AddonAudioPlaylist_validateModel(model) {
        var modelValidator = new ModelValidator();

        return modelValidator.validate(model, [
            ModelValidators.String("ID"),
            ModelValidators.utils.FieldRename(
                "Is Visible", "isVisible", ModelValidators.Boolean("isVisible")
            ),
            ModelValidators.utils.FieldRename(
                "Items",
                "items",
                ModelValidators.List("items", [
                    ModelValidators.utils.FieldRename("Name", "name", ModelValidators.String("name")),
                    ModelValidators.utils.FieldRename("Mp3", "mp3", ModelValidators.String("mp3", {default: ""})),
                    ModelValidators.utils.FieldRename("Ogg", "ogg", ModelValidators.String("ogg", {default: ""}))
                ])
            ),
            ModelValidators.utils.FieldRename("Stop playing", "stopPlaying", ModelValidators.Boolean("stopPlaying"))
        ]);
    };

    presenter.executeCommand = function AddonAudioPlaylist_executeCommand(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'play': presenter.play,
            'pause': presenter.pause,
            'stop': presenter.stop,
            'jumpTo': presenter.changeItem,
            'previous': presenter.prev,
            'next': presenter.next
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function AddonAudioPlaylist_setVisibility(isVisible) {
        presenter.view.style.visibility = isVisible ? "visible" : "hidden";
    };

    presenter.play = function () {
        if (!presenter.audio) return;
        if (presenter.audio.src && presenter.audio.paused) {
            presenter.audio.play();
            presenter.viewItems.playPauseButton.classList.remove(classList.playButton);
            presenter.viewItems.playPauseButton.classList.add(classList.pauseButton);
            presenter.items[presenter.state.currentItemIndex].button.classList.add(classList.itemPlay);
            presenter.state.isPlaying = true;
        }
    };

    presenter.pause = function AddonAudioPlaylist_pause() {
        if (!presenter.audio) return;
        if (presenter.audio.readyState > 0) {
            if (!presenter.audio.paused) {
                presenter.audio.pause();
            }

            presenter.viewItems.playPauseButton.classList.add(classList.playButton);
            presenter.viewItems.playPauseButton.classList.remove(classList.pauseButton);
            presenter.items[presenter.state.currentItemIndex].button.classList.remove(classList.itemPlay);

            presenter.state.isPlaying = false;
        }
    };

    presenter.stop = function AddonAudioPlaylist_stop() {
        if (!presenter.audio) return;
        if (presenter.audio.readyState > 0) {
            presenter.pause();
            presenter.audio.currentTime = 0;
        }
    };

    presenter.assignViewItems = function (view) {
        presenter.wrapper = view.getElementsByClassName(classList.addonWrapper)[0];
        presenter.viewItems = {
            mainController: view.getElementsByClassName(classList.controls)[0],
            prevButton: view.getElementsByClassName(classList.prev)[0],
            nextButton: view.getElementsByClassName(classList.next)[0],
            playPauseButton: view.getElementsByClassName(classList.playPauseButton)[0],
            currentTime: view.getElementsByClassName(classList.timer)[0],
            timerBar: view.getElementsByClassName(classList.bar)[0],
            timerSlider: view.getElementsByClassName(classList.barFilling)[0],
            timerSliderBall: view.getElementsByClassName(classList.barBall)[0],
            maxTime: view.getElementsByClassName(classList.duration)[0],
            volumeButton: view.getElementsByClassName(classList.volume)[0],
            items: view.getElementsByClassName(classList.items)[0],
            volumeWrapper: view.getElementsByClassName(classList.volumeWrapper)[0],
            volumeBar: view.getElementsByClassName(classList.volumeBar)[0],
            volumeBarFill: view.getElementsByClassName(classList.volumeBarFill)[0]
        };
    };

    presenter.showValidationError = function AddonAudioPlaylist_showValidationError(errorModel) {
        presenter.viewItems.mainController.style.visibility = "hidden";
        presenter.viewItems.items.style.visibility = "visible";
        DOMOperationsUtils.showErrorMessage(presenter.viewItems.items, presenter.ERROR_CODES, errorModel.fieldName.join("|") + "_" + errorModel.errorCode);
    };

    presenter.createItems = function AddonAudioPlaylist_createItems() {
        presenter.items = presenter.configuration.items.map(function (item, index) {
            return new AddonAudioPlaylistItemWrapper(item, index);
        });

        presenter.items.forEach(function (item) {
            presenter.viewItems.items.appendChild(item.row);
        });
    };

    presenter.selectItem = function AddonAudioPlaylist_selectItem(index) {
        if (index < 0 || index > this.items.length - 1) {
            return false;
        }

        presenter.pause();
        presenter.items[presenter.state.currentItemIndex].row.classList.remove(classList.itemSelected);
        presenter.items[presenter.state.currentItemIndex].button.classList.remove(classList.itemPlay);

        presenter.state.currentItemIndex = index;
        if (presenter.audio) {
            presenter.audio.src = this.items[presenter.state.currentItemIndex].src;
        }
        presenter.items[presenter.state.currentItemIndex].row.classList.add(classList.itemSelected);
        presenter.sendEvent(
        "ValueChanged",
        {
            value: eventNames.next,
            item: presenter.state.currentItemIndex,
            source: presenter.configuration.ID,
            score: ""
        });

        return true;
    }

    presenter.changeItem = function AddonAudioPlaylist_changeItem(index) {
        var wasSelected = presenter.selectItem(index);

        if (wasSelected && !presenter.configuration.stopPlaying) {
            presenter.play();
        }
    };

    presenter.addHandlers = function AddonAudioPlaylist_addHandlers() {
        var elements = presenter.getViewItemsWithClickAndTouchHandlers();

        for (var i = 0; i < elements.length; i++) {
            elements[i].item.addEventListener('click', elements[i].handler);
            elements[i].item.addEventListener('touch', elements[i].handler);
        }

        elements = presenter.getAudioHandlers();

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.viewItems.timerSliderBall.addEventListener('touchstart', AddonAudioPlaylist__sliderTouchDragStartHandler);
            presenter.viewItems.timerBar.addEventListener('touchmove', AddonAudioPlaylist__sliderTouchDragMoveHandler);
            presenter.viewItems.timerBar.addEventListener('touchend', AddonAudioPlaylist__sliderDragStopHandler);
        } else {
            presenter.viewItems.timerSliderBall.addEventListener('mousedown', AddonAudioPlaylist__sliderMouseDragStartHandler);
            presenter.viewItems.timerBar.addEventListener('mousemove', AddonAudioPlaylist__sliderMouseDragMoveHandler);
            presenter.viewItems.timerBar.addEventListener('mouseup', AddonAudioPlaylist__sliderDragStopHandler);
        }

        for (i = 0; i < elements.length; i++) {
            presenter.audio.addEventListener(elements[i].event, elements[i].handler);
        }

        // adds the audio duration
        presenter.items.forEach(function (item) {
            item.audio = document.createElement("audio");
            item.audio.addEventListener("durationchange", AddonAudioPlaylistItemWrapper__audioDurationChange.bind(item));
            item.audio.src = item.src;
        });
    };

    presenter.updateMainTrackDuration = function AddonAudioPlaylist_updateMainTrackDuration(duration) {
        duration = isNaN(duration) ? 0 : duration;
        presenter.viewItems.maxTime.innerText = StringUtils.timeFormat(duration);
    };

    presenter.next = function () {
        presenter.changeItem(presenter.state.currentItemIndex + 1);
    };

    presenter.prev = function () {
        presenter.changeItem(presenter.state.currentItemIndex - 1);
    };

    presenter.sendEvent = function (name, data) {
        if (presenter.eventBus) {
            presenter.eventBus.sendEvent(name, data);
        }
    };

    function AddonAudioPlaylist__nextButtonHandler(ev) {
        ev.preventDefault();
        presenter.next();
    }

    function AddonAudioPlaylist__prevButtonHandler(ev) {
        ev.preventDefault();
        if (presenter.audio.readyState > 0 && presenter.audio.currentTime > 0) {
            presenter.pause();
            presenter.audio.currentTime = 0;
        } else {
            presenter.prev();
        }
    }

    function AddonAudioPlaylist__playPauseButtonHandler(ev) {
        ev.preventDefault();
        if (presenter.state.isPlaying) {
            presenter.pause();
        } else {
            presenter.play();
        }
    }

    function AddonAudioPlaylist__onTimeDurationLoadedCallback() {
        presenter.updateMainTrackDuration(presenter.audio.duration);
    }

    function AddonAudioPlaylist__onLoadedMetadataCallback() {
        AddonAudioPlaylist__onTimeUpdateCallback();
        presenter.updateMainTrackDuration(presenter.audio.duration);
    }

    function AddonAudioPlaylist__onTimeUpdateCallback() {
        var currentTime = presenter.audio.currentTime;
        var duration = isNaN(presenter.audio.duration) ? 1 : presenter.audio.duration;
        var fillPercent = Math.round(currentTime / duration * 100);

        var time = StringUtils.timeFormat(currentTime);
        presenter.viewItems.currentTime.innerText = time;

        presenter.viewItems.timerSlider.style.width = fillPercent + "%";
        updateBallPosition();

        if (time !== presenter.state.sentTime) {
            presenter.sendEvent("ValueChanged", {
                value: time,
                item: presenter.state.currentItemIndex,
                source: presenter.configuration.ID,
                score: ""
            });

            presenter.state.sentTime = time;
        }
    }

    function updateBallPosition() {
        var halvedBallWidth = presenter.viewItems.timerSliderBall.offsetWidth / 2;
        var timerFillWidth = presenter.viewItems.timerSlider.offsetWidth;
        var ballPosition =  timerFillWidth- halvedBallWidth;

        if (timerFillWidth < halvedBallWidth) {
            ballPosition = 0;
        }

        presenter.viewItems.timerSliderBall.style.left = ballPosition + "px";
    }

    function AddonAudioPlaylist___onAudioEnded() {
        presenter.pause();

        presenter.sendEvent("ValueChanged", {
            value: eventNames.end,
            item: presenter.state.currentItemIndex,
            source: presenter.configuration.ID,
            score: ""
        });
        presenter.next();

        if (!presenter.configuration.stopPlaying) {
            presenter.play();
        }
    }

    function AddonAudioPlaylist___onAudioPlaying() {
        presenter.sendEvent("ValueChanged", {
            value: eventNames.playing,
            item: presenter.state.currentItemIndex,
            source: presenter.configuration.ID,
            score: ""
        });
    }

    function AddonAudioPlaylist___onAudioPause() {
        presenter.sendEvent("ValueChanged", {
            value: eventNames.pause,
            item: presenter.state.currentItemIndex,
            source: presenter.configuration.ID,
            score: ""
        });
    }

    function AddonAudioPlaylist__volumeButtonHandler(ev) {
        if (presenter.state.showingVolume) {
            presenter.viewItems.volumeWrapper.classList.remove(classList.volumeWrapperExpanded);
            presenter.viewItems.volumeBar.classList.add(classList.volumeBarHidden);
        } else {
            presenter.viewItems.volumeWrapper.classList.add(classList.volumeWrapperExpanded);
            presenter.viewItems.volumeBar.classList.remove(classList.volumeBarHidden);
        }

        presenter.state.showingVolume = !presenter.state.showingVolume;
        updateBallPosition();
    }

    function AddonAudioPlaylist__volumeBarHandler(ev) {
        var width = presenter.viewItems.volumeBar.offsetWidth;
        var clickedWidth = ev.offsetX;

        var value = clickedWidth / width;
        var percent = Math.round(value  * 100);

        if (presenter.audio) {
            presenter.audio.volume = value;
        }

        presenter.viewItems.volumeBarFill.style.width = percent + "%";
    }

    function AddonAudioPlaylist__sliderMouseDragStartHandler(ev) {
        AddonAudioPlaylist__sliderDragStartHandler(ev.pageX);
    }

    function AddonAudioPlaylist__sliderMouseDragMoveHandler(ev) {
        AddonAudioPlaylist__sliderDragMoveHandler(ev.pageX);
    }

    function AddonAudioPlaylist__sliderTouchDragStartHandler(ev) {
        var pageX = ev.changedTouches ? ev.changedTouches[0].pageX : ev.pageX;
        AddonAudioPlaylist__sliderDragStartHandler(pageX || 0);
    }

    function AddonAudioPlaylist__sliderTouchDragMoveHandler(ev) {
        var pageX = ev.changedTouches ? ev.changedTouches[0].pageX : ev.pageX;
        AddonAudioPlaylist__sliderDragMoveHandler(pageX || 0);
    }

    function AddonAudioPlaylist__sliderDragStartHandler(pageX) {
        presenter.dragData.wasPlaying = presenter.state.isPlaying;
        presenter.dragData.started = true;
        presenter.dragData.position = pageX;

        presenter.pause();
    }

    function AddonAudioPlaylist__sliderDragMoveHandler(pageX) {
        if (!presenter.dragData.started) return;

        var barWidth = presenter.viewItems.timerBar.offsetWidth;

        var currentFillWidth = presenter.viewItems.timerSlider.offsetWidth;
        var change = pageX - presenter.dragData.position;
        if (currentFillWidth + change >= 0 && currentFillWidth + change <= barWidth) {
            var percent = (currentFillWidth + change) / barWidth * 100;
            var value = currentFillWidth / barWidth;
            presenter.viewItems.timerSlider.style.width = percent + "%";
            updateBallPosition();

            var estimatedTime = Math.round(presenter.audio.duration * value);
            presenter.viewItems.currentTime.innerText = StringUtils.timeFormat(estimatedTime);
        }

        presenter.dragData.position = pageX;
    }

    function AddonAudioPlaylist__sliderDragStopHandler(ev) {
        if (!presenter.dragData.started) return;

        if (presenter.audio.readyState > 0) {
            var barWidth = presenter.viewItems.timerBar.offsetWidth;
            var currentFillWidth = presenter.viewItems.timerSlider.offsetWidth;
            var percent = currentFillWidth / barWidth;

            presenter.audio.currentTime = Math.round(presenter.audio.duration * percent);
        }
        presenter.dragData.started = false;
        if (presenter.dragData.wasPlaying) {
            presenter.play();
            presenter.dragData.wasPlaying = false;
        }
    }

    /*
    Wrapper for audio item
    * */
    function AddonAudioPlaylistItemWrapper(item, index) {
        var row = document.createElement("div");
        var playButton = document.createElement("button");
        var name = document.createElement("span");
        var time = document.createElement("span");

        row.classList.add(classList.item);
        name.classList.add(classList.itemName);
        playButton.classList.add(classList.itemButton);
        playButton.classList.add(classList.playButton);

        row.appendChild(playButton);
        row.appendChild(name);
        row.appendChild(time);

        name.innerText = item.name;
        time.innerText = "00:00";

        playButton.addEventListener("click", AddonAudioPlaylistItemWrapper__buttonHandler.bind(this));
        playButton.addEventListener("touch", AddonAudioPlaylistItemWrapper__buttonHandler.bind(this));

        this.name = item.name;
        this.src = item.mp3 || item.ogg;
        this.button = playButton;
        this.row = row;
        this.time = time;
        this.index = index;
        this.audio = null;
    }

     function AddonAudioPlaylistItemWrapper__audioDurationChange(ev) {
        console.log(this.name + " track duration loaded");
        this.time.innerText = StringUtils.timeFormat(isNaN(this.audio.duration) ? 0 : this.audio.duration);
        this.audio.removeEventListener("durationchange", AddonAudioPlaylistItemWrapper__audioDurationChange);
        this.audio = null;
    }

    function AddonAudioPlaylistItemWrapper__buttonHandler(ev) {
        ev.preventDefault();
        if (presenter.state.currentItemIndex !== this.index) {
            presenter.changeItem(this.index);
        }
        if (presenter.state.isPlaying) {
            presenter.pause();
        } else {
            presenter.play();
        }
    }

    return presenter;
}

AddonAudioPlaylist_create.__supported_player_options__ = {
    interfaceVersion: 2
};