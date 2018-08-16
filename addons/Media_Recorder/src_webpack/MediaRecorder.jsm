import {validateModel} from "./validation/validateModel.jsm";
import {ActivationState} from "./ActivationState.jsm";
import {MediaState} from "./MediaState.jsm";
import {PlayerFactory} from "./player/PlayerFactory.jsm";
import {Errors} from "./validation/Errors.jsm";
import {PlayButton} from "./button/PlayButton.jsm";
import {RecorderFactory} from "./recorder/RecorderFactory.jsm";
import {RecordButton} from "./button/RecordButton.jsm";
import {ResourcesProviderFactory} from "./resources/ResourcesProviderFactory.jsm";
import {Timer} from "./Timer.jsm";
import {AddonState} from "./AddonState.jsm";
import {RecordingTimeLimiter} from "./RecordinTimerLimiter.jsm";
import {SoundIntensity} from "./SoundIntensity.jsm";
import {MediaAnalyser} from "./analyser/MediaAnalyser.jsm";
import {LoaderFactory} from "./loader/LoaderFactory.jsm";

export class MediaRecorder {

    run(view, model) {
        let validatedModel = validateModel(model);

        if (validatedModel.isValid)
            this._runAddon(view, validatedModel.value);
        else
            this._showError(view, validatedModel);
    }

    createPreview(view, model) {
        this.view = view;
        this.model = model;
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

    destroy() {
        // this.recorder.destroy();
        // this.player.destroy();
        // this.mediaResources.destroy();
        // this.recordingTimer.destroy();
        // this.soundIntensity.destroy();
        // this.timer.destroy();
        // this.playButton.destroy();
        // this.startRecordingSoundEffect.destroy();
        // this.stopRecordingSoundEffect.destroy();
        // this.recordButton.destroy();
        // this.loader.destroy();
        // this.addonWrapper.destroy();
        //
        // this.mediaState = null;
        // this.activationState = null;
        // this.viewHandlers = null;
        // this.recorder = null;
        // this.player = null;
        // this.mediaResources = null;
        // this.recordingTimer = null;
        // this.soundIntensity = null;
        // this.timer = null;
        // this.recordButton = null;
        // this.playButton = null;
        // this.stopRecordingSoundEffect = null;
        // this.startRecordingSoundEffect = null;
        // this.recordingState = null;
        // this.loader = null;
        // this.addonWrapper = null;
        //
        // this.playerController = null;
        // this.view = null;
        // this.model = null;
    }

    activate() {
        if (this.activationState.isInactive()) {
            this.activationState.setActive();
            this._activateButtons();
            // this.addonWrapper.activate();
        }
    }

    deactivate() {
        this._stopActions();
        this._deactivateButtons();
        this.activationState.setInactive();
        // this.addonWrapper.deactivate();
    }

    reset() {
        this.deactivate();
        this.activate();
        this.player.reset();
        this.mediaState.setNew();
        this.addonState.reset();
        this._loadRecording(this.model.defaultRecording);
    }

    _runAddon(view, model) {
        this._loadAddon(view, model);
        this._loadLogic();
        this._activateButtons();
    }

    _loadAddon(view, model) {
        this.view = view;
        this.model = model;
        this.viewHandlers = this._loadViewHandlers(this.view);

        this.mediaState = new MediaState();
        this.activationState = new ActivationState();
        this.addonState = new AddonState();

        this.timer = new Timer(this.viewHandlers.$timerView);
        this.soundIntensity = new SoundIntensity(this.viewHandlers.$soundIntensityView);
        this.mediaAnalyser = new MediaAnalyser();

        this.recordingTimerLimiter = new RecordingTimeLimiter(this.model.maxTime);

        this.recorder = RecorderFactory.create({
            type: this.model.type
        });

        this.player = PlayerFactory.create({
            $view: this.viewHandlers.$playerView,
            type: this.model.type
        });

        this.playButton = new PlayButton({
            $view: this.viewHandlers.$playButtonView,
            state: this.mediaState
        });

        this.recordButton = new RecordButton({
            $view: this.viewHandlers.$recordButtonView,
            state: this.mediaState
        });

        this.resourcesProvider = ResourcesProviderFactory.create({
            $view: this.viewHandlers.$wrapperView,
            type: this.model.type
        });

        this.loader = LoaderFactory.create({
            $view: this.viewHandlers.$loaderView,
            type: this.model.type
        })

        this._loadRecording(this.model.defaultRecording);
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
                    this.recordingTimerLimiter.startCountdown();
                    this.mediaAnalyser.createAnalyserFromStream(stream)
                        .then(analyser => this.soundIntensity.startAnalyzing(analyser));
                })
        };

        this.recordButton.onStopRecording = () => {
            this.mediaState.setLoading();
            this.timer.stopCountdown();
            this.recordingTimerLimiter.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            this.mediaAnalyser.closeAnalyzing();
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
                .then(htmlMediaElement => this.mediaAnalyser.createAnalyserFromElement(htmlMediaElement)
                    .then(analyser => this.soundIntensity.startAnalyzing(analyser)));
        };

        this.playButton.onStopPlaying = () => {
            this.mediaState.setLoaded();
            this.player.stopPlaying();
            this.timer.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            this.mediaAnalyser.closeAnalyzing();
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
        this.recordingTimerLimiter.onTimeExpired = () => this.recordButton.forceClick();
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
            Timer: Timer,
            State: State,
            ActivationState: ActivationState,
            SoundIntensity: SoundIntensity,
            RecordingTimer: RecordingTimer,
            AudioLoader: AudioLoader,
            VideoLoader: VideoLoader,
            PlayButton: PlayButton,
            RecordButton: RecordButton,
            RecordingState: RecordingState,
        }
    }

    _showError(view, validatedModel) {
        DOMOperationsUtils.showErrorMessage(view, Errors, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
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
}