function AddonAudioPlaylist_create() {
    var presenter = function () {
    };

    var eventBus;
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    var audioIsLoaded = false;

    function deferredQueueDecoratorChecker() {
        return true; // TODO: for now
    }

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
        maxTime: null,
        volumeButton: null,
        items: null,
        volumeWrapper: null,
        volumeBar: null,
        volumeBarFill: null
    };

    presenter.items = [];

    presenter.state = {
        isVisible: false,
        isPlaying: false,
        currentItemIndex: 0,
        sentTime: "00:00",
        showingVolume: false,
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
            presenter.showValidationError(validatedModel.errorCode);
            return;
        }

        presenter.configuration = validatedModel.value;
        presenter.state.isVisible = presenter.configuration.isVisible;

        presenter.createItems();
        if (!isPreview) {
            presenter.audio = presenter.view.getElementsByTagName("audio")[0];
            presenter.addHandlers();
        }

        presenter.changeItem(this.state.currentItemIndex);
    };

    presenter.destroy = function AddonAudioPlaylist_destroy() {
        presenter.playerController = null;

        presenter.viewItems.playPauseButton.removeEventListener('click', AddonAudioPlaylist__playPauseButtonHandler);
        presenter.viewItems.playPauseButton.removeEventListener('touch', AddonAudioPlaylist__playPauseButtonHandler);

        presenter.viewItems.nextButton.removeEventListener('click', AddonAudioPlaylist__nextButtonHandler);
        presenter.viewItems.nextButton.removeEventListener('touch', AddonAudioPlaylist__nextButtonHandler);

        presenter.viewItems.prevButton.removeEventListener('click', AddonAudioPlaylist__prevButtonHandler);
        presenter.viewItems.prevButton.removeEventListener('touch', AddonAudioPlaylist__prevButtonHandler);

        presenter.viewItems.volumeButton.removeEventListener('click', AddonAudioPlaylist__volumeButtonHandler);
        presenter.viewItems.volumeButton.removeEventListener('touch', AddonAudioPlaylist__volumeButtonHandler);

        presenter.viewItems.volumeBar.removeEventListener('click', AddonAudioPlaylist__volumeBarHandler);
        presenter.viewItems.volumeBar.removeEventListener('touch', AddonAudioPlaylist__volumeBarHandler);

        presenter.viewItems.timerBar.removeEventListener('click', AddonAudioPlaylist__progresBarHandler);
        presenter.viewItems.timerBar.removeEventListener('touch', AddonAudioPlaylist__progresBarHandler);

        presenter.audio.removeEventListener('loadeddata', AddonAudioPlaylist__onLoadedMetadataCallback);
        presenter.audio.removeEventListener('timeupdate', AddonAudioPlaylist__onTimeUpdateCallback);
        presenter.audio.removeEventListener('volumechange', AddonAudioPlaylist___onVolumeChanged);
        presenter.audio.removeEventListener('ended', AddonAudioPlaylist___onAudioEnded);
        presenter.audio.removeEventListener('playing', AddonAudioPlaylist___onAudioPlaying);
        presenter.audio.removeEventListener('pause', AddonAudioPlaylist___onAudioPause);
        presenter.pause();
        presenter.audio = null;

        deferredSyncQueue = null;
    };

    presenter.onEventReceived = function AddonAudioPlaylist_onEventReceived(eventName, eventData) {

    };


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

        /*
        * The If statement resolves an issue on Mobile Safari, where presenter.stop call from setState would be resolved
        * right after the first presenter.play call. The problem occurs because the deferred queue is resolved
        * on loadedmetadata event and Mobile Safari only downloads the audio/video src file on the first interaction
        * with the tag, rather than when the page itself is loaded.
        * */
        if (audioIsLoaded) {
            presenter.stop();
        }

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
            )
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

    presenter.play = deferredSyncQueue.decorate(function () {
        if (!presenter.audio) return;
        if (presenter.audio.src && presenter.audio.paused) {
            presenter.audio.play();
            presenter.viewItems.playPauseButton.classList.remove(classList.playButton);
            presenter.viewItems.playPauseButton.classList.add(classList.pauseButton);
            presenter.items[presenter.state.currentItemIndex].button.classList.add(classList.itemPlay);
            presenter.state.isPlaying = true;
        }
    });

    presenter.pause = deferredSyncQueue.decorate(function AddonAudioPlaylist_pause() {
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
    });

    presenter.stop = deferredSyncQueue.decorate(function AddonAudioPlaylist_stop() {
        if (!presenter.audio) return;
        if (presenter.audio.readyState > 0) {
            presenter.pause();
            presenter.audio.currentTime = 0;
        }
    });

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
            maxTime: view.getElementsByClassName(classList.duration)[0],
            volumeButton: view.getElementsByClassName(classList.volume)[0],
            items: view.getElementsByClassName(classList.items)[0],
            volumeWrapper: view.getElementsByClassName(classList.volumeWrapper)[0],
            volumeBar: view.getElementsByClassName(classList.volumeBar)[0],
            volumeBarFill: view.getElementsByClassName(classList.volumeBarFill)[0]
        };
    };

    presenter.showValidationError = function (error) {
        presenter.viewItems.mainController.style.visibility = "hidden";
        presenter.viewItems.items.style.visibility = "visible";
        presenter.viewItems.items.innerText = error;
    };

    presenter.createItems = function () {
        presenter.items = presenter.configuration.items.map(function (item, index) {
            return new AddonAudioPlaylistItemWrapper(item, index);
        });

        presenter.items.forEach(function (item) {
            presenter.viewItems.items.appendChild(item.row);
        });
    };

    presenter.changeItem = function AddonAudioPlaylist_changeItem(index) {
        if (index < 0 || index > this.items.length - 1) {
            return;
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
    };

    presenter.addHandlers = function AddonAudioPlaylist_addHandlers() {
        presenter.viewItems.playPauseButton.addEventListener('click', AddonAudioPlaylist__playPauseButtonHandler);
        presenter.viewItems.playPauseButton.addEventListener('touch', AddonAudioPlaylist__playPauseButtonHandler);

        presenter.viewItems.nextButton.addEventListener('click', AddonAudioPlaylist__nextButtonHandler);
        presenter.viewItems.nextButton.addEventListener('touch', AddonAudioPlaylist__nextButtonHandler);

        presenter.viewItems.prevButton.addEventListener('click', AddonAudioPlaylist__prevButtonHandler);
        presenter.viewItems.prevButton.addEventListener('touch', AddonAudioPlaylist__prevButtonHandler);

        presenter.viewItems.volumeButton.addEventListener('click', AddonAudioPlaylist__volumeButtonHandler);
        presenter.viewItems.volumeButton.addEventListener('touch', AddonAudioPlaylist__volumeButtonHandler);

        presenter.viewItems.volumeBar.addEventListener('click', AddonAudioPlaylist__volumeBarHandler);
        presenter.viewItems.volumeBar.addEventListener('touch', AddonAudioPlaylist__volumeBarHandler);
        presenter.viewItems.timerBar.addEventListener('click', AddonAudioPlaylist__progresBarHandler);
        presenter.viewItems.timerBar.addEventListener('touch', AddonAudioPlaylist__progresBarHandler);

        presenter.audio.addEventListener('loadeddata', AddonAudioPlaylist__onLoadedMetadataCallback);
        presenter.audio.addEventListener('timeupdate', AddonAudioPlaylist__onTimeUpdateCallback);
        presenter.audio.addEventListener('volumechange', AddonAudioPlaylist___onVolumeChanged);
        presenter.audio.addEventListener('ended', AddonAudioPlaylist___onAudioEnded);
        presenter.audio.addEventListener('playing', AddonAudioPlaylist___onAudioPlaying);
        presenter.audio.addEventListener('pause', AddonAudioPlaylist___onAudioPause);

        // TODO: memory cleaning
        presenter.items.forEach(function (item) {
            var audio = document.createElement("audio");
            audio.addEventListener("durationchange", function AudioLoader(ev) {
                item.time.innerText = StringUtils.timeFormat(isNaN(audio.duration) ? 0 : audio.duration);
                audio.removeEventListener("durationchange", AudioLoader);
                audio = null;
            });
            audio.src = item.src;
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

    function AddonAudioPlaylist__onLoadedMetadataCallback() {
        AddonAudioPlaylist__onTimeUpdateCallback();
        presenter.updateMainTrackDuration(presenter.audio.duration);
        audioIsLoaded = true;
    }

    function AddonAudioPlaylist__onTimeUpdateCallback() {
        var currentTime = presenter.audio.currentTime;
        var duration = isNaN(presenter.audio.duration) ? 1 : presenter.audio.duration;
        var time = StringUtils.timeFormat(currentTime);
        presenter.viewItems.currentTime.innerText = time;

        var fillPercent = Math.round(currentTime / duration * 100);
        presenter.viewItems.timerSlider.style.width = fillPercent + "%";

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

    function AddonAudioPlaylist___onVolumeChanged() {
        //TODO: update volume level
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

        // TODO: memory cleaning
        playButton.addEventListener("click", AddonAudioPlaylistItemWrapper__buttonHandler.bind(this));
        playButton.addEventListener("touch", AddonAudioPlaylistItemWrapper__buttonHandler.bind(this));

        this.name = item.name;
        this.src = item.mp3 || item.ogg;
        this.button = playButton;
        this.row = row;
        this.time = time;
        this.index = index;
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

    function AddonAudioPlaylist__progresBarHandler(ev) {
        var width = presenter.viewItems.timerBar.offsetWidth;
        var clickedWidth = ev.offsetX;

        var percent = clickedWidth / width;

        if (presenter.audio) {
            presenter.audio.currentTime = Math.round(presenter.audio.duration * percent);
        }

        // presenter.viewItems.volumeBarFill.style.width = percent + "%";
    }


    return presenter;
}

AddonAudioPlaylist_create.__supported_player_options__ = {
    interfaceVersion: 2
};