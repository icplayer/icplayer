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

export class MediaRecorder {

    run(view, model) {
        let validatedModel = validateModel(model);

        if (window.DevicesUtils.isInternetExplorer()) {
            this._showBrowserError(view)
        } else if (validatedModel.isValid)
            this._runAddon(view, validatedModel.value);
        else
            this._showError(view, validatedModel);
    }

    createPreview(view, model) {
        let validatedModel = validateModel(model);

        if (!validatedModel.isValid)
            this._showError(view, validatedModel);
    }

    setPlayerController(playerController) {
        this.playerController = playerController;
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
        this.activationState.destroy();

        this.viewHandlers = null;
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
        if (this.model.isResetRemovesRecording) {
            this.player.reset();
            this.addonState.reset();
            this.timer.reset();
            this.mediaState.setNew();
            this._loadRecording(this.model.defaultRecording);
        }
    }

    _runAddon(view, model) {
        this._loadAddon(view, model);
        this._loadLogic();
        this._loadRecording(this.model.defaultRecording);
        this._activateButtons();
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
    }

    _loadViewHandlers(view) {
        return {
            $wrapperView: $(view).find(".media-recorder-wrapper"),
            $playerView: $(view).find(".media-recorder-player-wrapper"),
            $loaderView: $(view).find(".media-recorder-player-loader"),
            $recordButtonView: $(view).find(".media-recorder-recording-button"),
            $playButtonView: $(view).find(".media-recorder-play-button"),
            $timerView: $(view).find(".media-recorder-timer"),
            $soundIntensityView: $(view).find(".media-recorder-sound-intensity")
        };
    }


    _loadMediaElements() {
        this.recorder = new AudioRecorder();
        this.player = new AudioPlayer(this.viewHandlers.$playerView);
        this.resourcesProvider = new AudioResourcesProvider(this.viewHandlers.$wrapperView);
    }

    _loadViewElements() {
        this.addonViewService = new AddonViewService(this.viewHandlers.$wrapperView);
        this.recordButton = this._loadRecordButton();

        this.playButton = new PlayButton({
            $view: this.viewHandlers.$playButtonView,
            state: this.mediaState
        });

        this.loader = new AudioLoader(this.viewHandlers.$loaderView);

        this.timer = new Timer(this.viewHandlers.$timerView);
        this.soundIntensity = new SoundIntensity(this.viewHandlers.$soundIntensityView);
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
            this.resourcesProvider.getMediaResources()
                .then(stream => {
                    this.mediaState.setRecording();
                    this.player.startStreaming(stream);
                    this.recorder.startRecording(stream);
                    this.timer.reset();
                    this.timer.startCountdown();
                    this.recordingTimeLimiter.startCountdown();
                    this.mediaAnalyserService.createAnalyserFromStream(stream)
                        .then(analyser => this.soundIntensity.startAnalyzing(analyser));
                })
        };

        this.recordButton.onStopRecording = () => {
            this.mediaState.setLoading();
            this.timer.stopCountdown();
            this.recordingTimeLimiter.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            this.mediaAnalyserService.closeAnalyzing();
            this.player.stopStreaming();
            this.recorder.stopRecording()
                .then(blob => {
                    let recording = URL.createObjectURL(blob);
                    this.player.setRecording(recording);
                    this.addonState.setRecordingBlob(blob);
                });
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

        this.player.onStartLoading = () => {
            this.mediaState.setLoading();
            this.loader.show()
        };

        this.player.onEndLoading = () => {
            this.mediaState.setLoaded();
            this.loader.hide();
        };

        this.player.onDurationChange = duration => this.timer.setDuration(duration);
        this.player.onEndPlaying = () => this.playButton.forceClick();
        this.recordingTimeLimiter.onTimeExpired = () => this.recordButton.forceClick();
    }

    _loadRecording(recording) {
        if (_isValid(recording)) {
            this.mediaState.setLoading();
            this.player.setRecording(recording);
        }

        function _isValid(recording) {
            return recording != "" && recording != null && typeof recording != "undefined";
        }
    }

    _activateButtons() {
        this.recordButton.activate();
        this.playButton.activate();
    }

    _deactivateButtons() {
        this.recordButton.deactivate();
        this.playButton.deactivate();
    }

    _stopActions() {
        if (this.mediaState.isRecording())
            this.recordButton.forceClick();
        if (this.mediaState.isPlaying())
            this.playButton.forceClick();
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

    setVisibility(isVisible) {
        this.addonViewService.setVisibility(isVisible);
    }

    _showBrowserError(view) {
        DOMOperationsUtils.showErrorMessage(view, {unsupportedBrowser: "Your browser is not supported."}, "unsupportedBrowser");
    }
}