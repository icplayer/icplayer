function AddonAudioPlaylist_create() {
    var presenter = function () {
    };

    var eventBus;
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    var audioIsLoaded = false;

    function deferredQueueDecoratorChecker() {
        if (!presenter.configuration.forceLoadAudio) {
            return true;
        }

        return audioIsLoaded;
    }

    presenter.playerController = null;
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
        items: null
    };

    presenter.items = [];

    presenter.state = {
        isVisible: false,
        isPlaying: false,
        currentItemIndex: 0
    };

    presenter.setPlayerController = function AddonAudioPlaylist_setPlayerController(controller) {
        presenter.playerController = controller;
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
            ModelValidators.Boolean("forceLoadAudio"),
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
            'play': presenter.play,
            'show': presenter.show,
            'hide': presenter.hide,
            'pause': presenter.pause,
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
            presenter.viewItems.playPauseButton.classList.remove('audio-playlist-play-btn');
            presenter.viewItems.playPauseButton.classList.add('audio-playlist-pause-btn');
            presenter.items[presenter.state.currentItemIndex].button.classList.add("addon-audio-playlist-item--button-playing");
            presenter.state.isPlaying = true;
        }
    });

    presenter.pause = deferredSyncQueue.decorate(function AddonAudioPlaylist_pause() {
        if (!presenter.audio) return;
        if (presenter.audio.readyState > 0) {
            if (!presenter.audio.paused) {
                presenter.audio.pause();
            }
            presenter.viewItems.playPauseButton.classList.add('audio-playlist-play-btn');
            presenter.viewItems.playPauseButton.classList.remove('audio-playlist-pause-btn');
            presenter.items[presenter.state.currentItemIndex].button.classList.remove("addon-audio-playlist-item--button-playing");

            presenter.state.isPlaying = false;
        }
    });

    presenter.assignViewItems = function (view) {
        presenter.wrapper = view.getElementsByClassName('wrapper-addon-audio-playlist')[0];
        presenter.viewItems = {
            mainController: view.getElementsByClassName('addon-audio-playlist-controls')[0],
            prevButton: view.getElementsByClassName('audio-playlist-prev-btn')[0],
            nextButton: view.getElementsByClassName('audio-playlist-next-btn')[0],
            playPauseButton: view.getElementsByClassName('audio-playlist-play-pause-btn')[0],
            currentTime: view.getElementsByClassName('audio-playlist-timer')[0],
            timerBar: view.getElementsByClassName('audio-playlist-bar')[0],
            timerSlider: view.getElementsByClassName('audio-playlist-bar--fill')[0],
            maxTime: view.getElementsByClassName('audio-playlist-max-time')[0],
            volumeButton: view.getElementsByClassName('audio-playlist-volume-btn')[0],
            items: view.getElementsByClassName('addon-audio-playlist-items')[0],
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
        presenter.items[presenter.state.currentItemIndex].row.classList.remove("addon-audio-playlist-item-selected");
        presenter.items[presenter.state.currentItemIndex].button.classList.remove("addon-audio-playlist-item--button-playing");

        presenter.state.currentItemIndex = index;
        if (presenter.audio) {
            presenter.audio.src = this.items[presenter.state.currentItemIndex].src;
        }
        presenter.items[presenter.state.currentItemIndex].row.classList.add("addon-audio-playlist-item-selected");

    };

    presenter.addHandlers = function AddonAudioPlaylist_addHandlers() {
        presenter.viewItems.playPauseButton.addEventListener('click', AddonAudioPlaylist__playPauseButtonHandler);
        presenter.viewItems.playPauseButton.addEventListener('touch', AddonAudioPlaylist__playPauseButtonHandler);

        presenter.viewItems.nextButton.addEventListener('click', AddonAudioPlaylist__nextButtonHandler);
        presenter.viewItems.nextButton.addEventListener('touch', AddonAudioPlaylist__nextButtonHandler);

        presenter.viewItems.prevButton.addEventListener('click', AddonAudioPlaylist__prevButtonHandler);
        presenter.viewItems.prevButton.addEventListener('touch', AddonAudioPlaylist__prevButtonHandler);

        presenter.audio.addEventListener('loadeddata', AddonAudioPlaylist__onLoadedMetadataCallback);
        presenter.audio.addEventListener('timeupdate', AddonAudioPlaylist__onTimeUpdateCallback);
        presenter.audio.addEventListener('volumechange', AddonAudioPlaylist___onVolumeChanged);
        presenter.audio.addEventListener('ended', AddonAudioPlaylist___onAudioEnded);
        presenter.audio.addEventListener('playing', AddonAudioPlaylist___onAudioPlaying);
        presenter.audio.addEventListener('pause', AddonAudioPlaylist___onAudioPause);
    };

    presenter.updateMainTrackDuration = function AddonAudioPlaylist_updateMainTrackDuration(duration) {
        duration = isNaN(duration) ? 0 : duration;
        presenter.viewItems.maxTime.innerText = StringUtils.timeFormat(duration);
    };

    function AddonAudioPlaylist__nextButtonHandler(ev) {
        ev.preventDefault();
        presenter.changeItem(presenter.state.currentItemIndex + 1);
    }

    function AddonAudioPlaylist__prevButtonHandler(ev) {
        ev.preventDefault();
        presenter.changeItem(presenter.state.currentItemIndex - 1);
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
        presenter.changeItem(index);
        presenter.play();
    }

    function AddonAudioPlaylist__onLoadedMetadataCallback() {
        AddonAudioPlaylist__onTimeUpdateCallback();
        presenter.updateMainTrackDuration(presenter.audio.duration)
    }

    function AddonAudioPlaylist__onTimeUpdateCallback() {
        var currentTime = presenter.audio.currentTime;
        var duration = isNaN(presenter.audio.duration) ? 1 : presenter.audio.duration;
        var currentTimeString = StringUtils.timeFormat(currentTime);
        presenter.viewItems.currentTime.innerText = currentTimeString;

        var fillPercent = Math.round(currentTime / duration * 100);
        presenter.viewItems.timerSlider.style.width = fillPercent + "%";
    }

    function AddonAudioPlaylist___onVolumeChanged() {
        //TODO: update volume level
    }

    function AddonAudioPlaylist___onAudioEnded() {
        presenter.pause();
        //TODO: send event
    }

    function AddonAudioPlaylist___onAudioPlaying() {
        //TODO: send event
    }

    function AddonAudioPlaylist___onAudioPause() {
        //TODO: send event
    }


    function AddonAudioPlaylistItemWrapper(item, index) {
        var row = document.createElement("div");
        var playButton = document.createElement("button");
        var name = document.createElement("span");
        var time = document.createElement("span");

        row.classList.add("addon-audio-playlist-item");
        name.classList.add("addon-audio-playlist-item--name");
        playButton.classList.add("addon-audio-playlist-item--button");
        playButton.classList.add("audio-playlist-play-btn");

        row.appendChild(playButton);
        row.appendChild(name);
        row.appendChild(time);

        name.innerText = item.name;
        time.innerText = "00:00";

        // TODO: memory cleaning
        playButton.addEventListener("click", AddonAudioPlaylistItemWrapper__buttonHandler);
        playButton.addEventListener("touch", AddonAudioPlaylistItemWrapper__buttonHandler);

        this.name = item.name;
        this.src = item.mp3 || item.ogg;
        this.button = playButton;
        this.row = row;
    }

    return presenter;
}

AddonAudioPlaylist_create.__supported_player_options__ = {
    interfaceVersion: 2
};