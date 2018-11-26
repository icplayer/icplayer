import {validateModel} from "./validation/validateModel.jsm";
import {ActivationState} from "./state/ActivationState.jsm";
import {MediaState} from "./state/MediaState.jsm";
import {Errors} from "./validation/Errors.jsm";
import {PlayButton} from "./view/button/PlayButton.jsm";
import {RecordButton} from "./view/button/RecordButton.jsm";
import {Timer} from "./view/Timer.jsm";
import {AddonState} from "./state/AddonState.jsm";
import {RecordingTimeLimiter} from "./RecordingTimeLimiter.jsm";
import {SoundIntensity} from "./view/SoundIntensity.jsm";
import {MediaAnalyserService} from "./analyser/MediaAnalyserService.jsm";
import {AudioLoader} from "./view/loader/AudioLoader.jsm";
import {SoundEffect} from "./view/button/sound/SoundEffect.jsm";
import {RecordButtonSoundEffect} from "./view/button/sound/RecordButtonSoundEffect.jsm";
import {AddonViewService} from "./view/AddonViewService.jsm";
import {AudioResourcesProvider} from "./resources/AudioResourcesProvider.jsm";
import {AudioRecorder} from "./recorder/AudioRecorder.jsm";
import {AudioPlayer} from "./player/AudioPlayer.jsm";
import {DefaultRecordingPlayButton} from "./view/button/DefaultRecordingPlayButton.jsm";
import {SafariRecorderState} from "./state/SafariRecorderState.jsm";

export class MediaRecorder {

    run(view, model) {
        let validatedModel = validateModel(model);

        if (this._isBrowserNotSupported()) {
            this._showBrowserError(view)
        } else if (validatedModel.isValid)
            this._runAddon(view, validatedModel.value);
        else
            this._showError(view, validatedModel);

        this._notifyWebView();
    }

    createPreview(view, model) {
        let validatedModel = validateModel(model);

        if (!validatedModel.isValid)
            this._showError(view, validatedModel);
        else
            this._updatePreview(view, validatedModel);
    }

    setPlayerController(playerController) {
        this.playerController = playerController;
        if (this.player && this.recorder)
            this._loadEventBus()
    }

    getState() {
        return JSON.stringify(this.addonState);
    }

    setState(state) {
        Object.assign(this.addonState, JSON.parse(state));
        this.addonState.getRecordingBlob()
            .then(blob => {
                this.mediaState.setLoading();
                let recording = URL.createObjectURL(blob);
                this.player.setRecording(recording);
            });
        this.addonState.getVisibility()
            .then(isVisible => {
                this.setVisibility(isVisible);
            })
    }

    startRecording() {
        if (this.mediaState.isNew() || this.mediaState.isLoaded())
            this.recordButton.forceClick();
    };

    stopRecording() {
        if (this.mediaState.isRecording())
            this.recordButton.forceClick();
    };

    startPlaying() {
        if (this.mediaState.isLoaded())
            this.playButton.forceClick();
    };

    stopPlaying() {
        if (this.mediaState.isPlaying())
            this.playButton.forceClick();
    };

    destroy() {
        this.playButton.destroy();
        this.defaultRecordingPlayButton.destroy();
        this.recordButton.destroy();
        this.recorder.destroy();
        this.player.destroy();
        this.resourcesProvider.destroy();
        this.recordingTimeLimiter.destroy();
        this.soundIntensity.destroy();
        this.timer.destroy();
        this.startRecordingSoundEffect.destroy();
        this.stopRecordingSoundEffect.destroy();
        this.loader.destroy();
        this.addonViewService.destroy();
        this.mediaAnalyserService.destroy();
        this.addonState.destroy();
        this.mediaState.destroy();
        this.safariRecorderState.destroy();
        this.activationState.destroy();

        this.viewHandlers = null;
        this.defaultRecordingPlayButton = null;
        this.recorder = null;
        this.player = null;
        this.resourcesProvider = null;
        this.recordingTimeLimiter = null;
        this.soundIntensity = null;
        this.timer = null;
        this.recordButton = null;
        this.playButton = null;
        this.stopRecordingSoundEffect = null;
        this.startRecordingSoundEffect = null;
        this.loader = null;
        this.addonViewService = null;
        this.mediaAnalyserService = null;
        this.addonState = null;
        this.mediaState = null;
        this.activationState = null;

        this.playerController = null;
        this.view = null;
        this.model = null;
    }

    activate() {
        if (this.activationState.isInactive()) {
            this.activationState.setActive();
            this.addonViewService.activate();
            this._activateButtons();
        }
    }

    deactivate() {
        this._stopActions();
        this._deactivateButtons();
        this.activationState.setInactive();
        this.addonViewService.deactivate();
    }

    reset() {
        this.deactivate();
        this.activate();
        this.setVisibility(this.model["Is Visible"]);
        if (this.model.isResetRemovesRecording) {
            this.player.reset();
            this.addonState.reset();
            this.timer.reset();
            if (this.defaultRecordingPlayer.hasRecording) {
                this.mediaState.setLoadedDefaultRecording();
                this.timer.setDuration(this.defaultRecordingPlayer.duration);
            } else
                this.mediaState.setNew();
        }
    }

    show() {
        this.setVisibility(true);
        this.addonState.setVisibility(true);
    }

    hide() {
        this.setVisibility(false);
        this.addonState.setVisibility(false);
    }

    setVisibility(isVisible) {
        this.addonViewService.setVisibility(isVisible);
    }

    _runAddon(view, model) {
        this._loadAddon(view, model);
        this._loadLogic();
        this._loadDefaultRecording(this.model);
        this._activateButtons();
        this._loadWebViewMessageListener();
        this.setVisibility(model["Is Visible"]);
    }

    _loadAddon(view, model) {
        this._loadCoreElements(view, model);

        this.mediaAnalyserService = new MediaAnalyserService();
        this.recordingTimeLimiter = new RecordingTimeLimiter(this.model.maxTime);

        this._loadMediaElements();
        this._loadViewElements();
    }

    _loadCoreElements(view, model) {
        this.view = view;
        this.model = model;
        this.viewHandlers = this._loadViewHandlers(this.view);

        this.mediaState = new MediaState();
        this.activationState = new ActivationState();
        this.addonState = new AddonState();
        this.safariRecorderState = new SafariRecorderState();
    }

    _loadViewHandlers(view) {
        return {
            $wrapperView: $(view).find(".media-recorder-wrapper"),
            $playerView: $(view).find(".media-recorder-player-wrapper"),
            $loaderView: $(view).find(".media-recorder-player-loader"),
            $defaultRecordingPlayButtonView: $(view).find(".media-recorder-default-recording-play-button"),
            $recordButtonView: $(view).find(".media-recorder-recording-button"),
            $playButtonView: $(view).find(".media-recorder-play-button"),
            $timerView: $(view).find(".media-recorder-timer"),
            $soundIntensityView: $(view).find(".media-recorder-sound-intensity")
        };
    }

    _loadMediaElements() {
        this.recorder = new AudioRecorder();
        this.player = new AudioPlayer(this.viewHandlers.$playerView);
        this.defaultRecordingPlayer = new AudioPlayer(this.viewHandlers.$playerView);
        this.resourcesProvider = new AudioResourcesProvider(this.viewHandlers.$wrapperView);
        if (this.playerController)
            this._loadEventBus();
    }

    _loadEventBus() {
        let eventBus = this.playerController.getEventBus();
        this.player.setEventBus(eventBus, this.model.ID, "player");
        this.defaultRecordingPlayer.setEventBus(eventBus, this.model.ID, "default");
        this.recorder.setEventBus(eventBus, this.model.ID);
    }

    _loadViewElements() {
        this.addonViewService = new AddonViewService(this.viewHandlers.$wrapperView);
        this.recordButton = this._loadRecordButton();

        this.defaultRecordingPlayButton = new DefaultRecordingPlayButton({
            $view: this.viewHandlers.$defaultRecordingPlayButtonView,
            state: this.mediaState,
            defaultRecording: this.model.defaultRecording
        });

        this.playButton = new PlayButton({
            $view: this.viewHandlers.$playButtonView,
            state: this.mediaState
        });

        this.loader = new AudioLoader(this.viewHandlers.$loaderView);

        this.timer = new Timer(this.viewHandlers.$timerView);
        this.soundIntensity = new SoundIntensity(this.viewHandlers.$soundIntensityView);

        this._hideSelectedElements();
    }

    _loadRecordButton() {
        let recordButton = new RecordButton({
            $view: this.viewHandlers.$recordButtonView,
            state: this.mediaState
        });

        this.startRecordingSoundEffect = new SoundEffect(this.model.startRecordingSound, this.viewHandlers.$playerView);
        this.stopRecordingSoundEffect = new SoundEffect(this.model.stopRecordingSound, this.viewHandlers.$playerView);

        return new RecordButtonSoundEffect(recordButton, this.startRecordingSoundEffect, this.stopRecordingSoundEffect);
    }

    _loadLogic() {
        this.recordButton.onStartRecording = () => {
            this.mediaState.setBlocked();
            if (this.safariRecorderState.isAvaliableResources()) {
                const stream = this.resourcesProvider.getStream();
                this._handleRecording(stream);
            } else if (this.platform === 'mlibro') {
                this._handleMlibroStartRecording();
            } else {
                const stream = this.resourcesProvider.getMediaResources().then(stream => {
                    const isSafari = window.DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;
                    if (isSafari && this.safariRecorderState.isUnavaliableResources()) {
                        this._handleSafariRecordingInitialization();
                        return;
                    }
                    this._handleRecording(stream);
                });
            }
        };

        this.recordButton.onStopRecording = () => {
            if (this.platform === 'mlibro')
                this._handleMlibroStopRecording();
            else {
                this.mediaState.setLoading();
                this.timer.stopCountdown();
                this.recordingTimeLimiter.stopCountdown();
                this.soundIntensity.stopAnalyzing();
                this.mediaAnalyserService.closeAnalyzing();
                this.player.stopStreaming();
                this.recorder.stopRecording()
                    .then(blob => {
                        this.addonState.setRecordingBlob(blob);
                        let recording = URL.createObjectURL(blob);
                        this.player.reset();
                        this.player.setRecording(recording);
                    });
                this.resourcesProvider.destroy();
                this.safariRecorderState.setUnavaliableResources();
            }
        };

        this.recordButton.onReset = () => {
            this.mediaState.setLoading();
            this.timer.stopCountdown();
            this.recordingTimeLimiter.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            this.mediaAnalyserService.closeAnalyzing();
            this.player.stopStreaming();
            this.recorder.stopRecording();
            this.resourcesProvider.destroy();
        };

        this.playButton.onStartPlaying = () => {
            this.mediaState.setPlaying();
            this.timer.startCountdown();
            this.player.startPlaying()
                .then(htmlMediaElement => this.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement)
                    .then(analyser => this.soundIntensity.startAnalyzing(analyser)));
        };

        this.playButton.onStopPlaying = () => {
            this.mediaState.setLoaded();
            this.player.stopPlaying();
            this.timer.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            this.mediaAnalyserService.closeAnalyzing();
        };

        this.defaultRecordingPlayButton.onStartPlaying = () => {
            this.mediaState.setPlayingDefaultRecording();
            this.timer.setDuration(this.defaultRecordingPlayer.duration);
            this.timer.startCountdown();
            this.defaultRecordingPlayer.startPlaying()
                .then(htmlMediaElement => this.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement)
                    .then(analyser => this.soundIntensity.startAnalyzing(analyser)));
        };

        this.defaultRecordingPlayButton.onStopPlaying = () => {
            if (this.player.hasRecording) {
                this.timer.setDuration(this.player.duration);
                this.mediaState.setLoaded();
            } else
                this.mediaState.setLoadedDefaultRecording();

            this.defaultRecordingPlayer.stopPlaying();
            this.timer.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            this.mediaAnalyserService.closeAnalyzing();
        };

        this.player.onStartLoading = () => {
            this.mediaState.setLoading();
            this.loader.show();
        };

        this.player.onEndLoading = () => {
            this.mediaState.setLoaded();
            this.loader.hide();
        };

        this.player.onDurationChange = duration => this.timer.setDuration(duration);
        this.player.onEndPlaying = () => this.playButton.forceClick();

        this.defaultRecordingPlayer.onStartLoading = () => {
            this.mediaState.setLoading();
            this.loader.show();
        };

        this.defaultRecordingPlayer.onEndLoading = () => {
            if (this.player.hasRecording)
                this.mediaState.setLoaded();
            else
                this.mediaState.setLoadedDefaultRecording();
            this.loader.hide();
        };

        this.defaultRecordingPlayer.onDurationChange = duration => this.timer.setDuration(duration);
        this.defaultRecordingPlayer.onEndPlaying = () => this.defaultRecordingPlayButton.forceClick();

        this.recordingTimeLimiter.onTimeExpired = () => this.recordButton.forceClick();
    }

    _handleRecording(stream) {
        this.mediaState.setRecording();
        this.player.startStreaming(stream);
        this.recorder.startRecording(stream);
        this.timer.reset();
        this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
        this.recordingTimeLimiter.startCountdown();
        this.mediaAnalyserService.createAnalyserFromStream(stream)
            .then(analyser => this.soundIntensity.startAnalyzing(analyser));
    };

    _loadDefaultRecording(model) {
        if (_isValid(model.defaultRecording) && model.isShowedDefaultRecordingButton) {
            this.mediaState.setLoading();
            this.defaultRecordingPlayer.setRecording(model.defaultRecording);
        }

        function _isValid(recording) {
            return recording != "" && recording != null && typeof recording != "undefined";
        }
    }

    _activateButtons() {
        this.recordButton.activate();
        this.playButton.activate();
        this.defaultRecordingPlayButton.activate();
    }

    _deactivateButtons() {
        this.recordButton.deactivate();
        this.playButton.deactivate();
        this.defaultRecordingPlayButton.deactivate();
    }

    _stopActions() {
        if (this.mediaState.isRecording())
            if (this.model.isResetRemovesRecording)
                this.recordButton.reset();
            else
                this.recordButton.forceClick();
        if (this.mediaState.isPlaying())
            this.playButton.forceClick();
        if (this.mediaState.isPlayingDefaultRecording())
            this.defaultRecordingPlayButton.forceClick();
    }

    _internalElements() {
        return {
            validateModel: validateModel,
            ActivationState: ActivationState,
            AudioLoader: AudioLoader,
            PlayButton: PlayButton,
            RecordButton: RecordButton,
            RecordingTimeLimiter: RecordingTimeLimiter,
            MediaState: MediaState,
            Timer: Timer,
            AudioPlayer: AudioPlayer
        }
    }

    _showError(view, validatedModel) {
        DOMOperationsUtils.showErrorMessage(view, Errors, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
    }

    _showBrowserError(view) {
        let $wrapper = $(view).find(".media-recorder-wrapper");
        $wrapper.addClass("media-recorder-wrapper-browser-not-supported");
        $wrapper.text(Errors["not_supported_browser"] + window.DevicesUtils.getBrowserVersion());
    }

    _updatePreview(view, validatedModel) {
        let valid_model = validatedModel.value;
        let timerViewHandler = $(view).find(".media-recorder-timer");
        let defaultButtonViewHandler = $(view).find(".media-recorder-default-recording-play-button");

        if (valid_model.isShowedTimer == false)
            timerViewHandler.hide();
        else
            timerViewHandler.show();

        if (valid_model.isShowedDefaultRecordingButton == false)
            defaultButtonViewHandler.hide();
        else
            defaultButtonViewHandler.show();
    }

    _hideSelectedElements() {
        if (this.model.isShowedTimer == false)
            this.viewHandlers.$timerView.hide();
        if (this.model.isShowedDefaultRecordingButton == false)
            this.viewHandlers.$defaultRecordingPlayButtonView.hide();
    }

    _isBrowserNotSupported() {
        const browser = window.DevicesUtils.getBrowserVersion().split(" ")[0].toLowerCase();
        const browserVersion = window.DevicesUtils.getBrowserVersion().split(" ")[1];

        if (browser.indexOf("safari") > -1 && browserVersion < 11)
            return true;

        if (browser.indexOf("chrome") > -1 && browserVersion < 53)
            return true;

        if (window.DevicesUtils.isInternetExplorer())
            return true;

        return false;
    }

    _handleSafariRecordingInitialization() {
        this.mediaState.setBlockedSafari();
        this.safariRecorderState.setAvaliableResources();
        this.recordButton.setUnclickView();
        alert(Errors["safari_select_recording_button_again"]);
    }

    _notifyWebView() {
        window.external.notify(JSON.stringify({type: "platform", target: this.model.ID}));
    }

    _loadWebViewMessageListener() {
        const self = this;
        window.addEventListener('message', event => {
            const eventData = JSON.parse(event.data);
            let isTypePlatform = eventData.type ? eventData.type.toLowerCase() === 'platform' : false;
            let isValueMlibro = eventData.value ? eventData.value.toLowerCase() === 'mlibro' : false;
            if (isTypePlatform && isValueMlibro)
                self._handleWebViewBehaviour();
        }, false);
    }

    _handleWebViewBehaviour() {
        const self = this;
        if (self.platform === undefined || self.platform === null) {
            self.platform = 'mlibro';
            window.addEventListener('message', event => {
                const eventData = JSON.parse(event.data);
                let isTypeRecording = eventData.type ? eventData.type.toLowerCase() === 'recording' : false;
                let isTargetMe = eventData.target ? eventData.target === this.model.ID : false;
                let isStateLoading = self.mediaState.isLoading();
                if (isTypeRecording && isTargetMe && isStateLoading) {
                    this.addonState.setRecordingBase64(eventData.value);
                    this.player.reset();
                    this.player.setRecording(eventData.value);
                } else {
                    console.log("the recording has not been received");
                }
            }, false);
        }
    }

    _handleMlibroStartRecording() {
        this.mediaState.setRecording();
        this.timer.reset();
        this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
        this.recordingTimeLimiter.startCountdown();
        window.external.notify(JSON.stringify({type: "mediaRecord", target: this.model.ID}));
    }

    _handleMlibroStopRecording() {
        this.mediaState.setLoading();
        this.timer.stopCountdown();
        this.recordingTimeLimiter.stopCountdown();
        window.external.notify(JSON.stringify({type: "mediaStop", target: this.model.ID}));
    }
}