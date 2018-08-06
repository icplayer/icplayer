import {validateModel} from "./modelValidator.jsm";
import {createMediaResources} from "./resources/mediaResourcesFactory.jsm";
import {State} from "./state.jsm";
import {Timer} from "./timer.jsm";
import {SoundIntensity} from "./soundIntensity.jsm";
import {RecordButton} from "./recordButton.jsm";
import {PlayButton} from "./playButton.jsm";
import {RecordingTimer} from "./recordingTimer.jsm";
import {RecordButtonSoundEffect} from "./recordButtonSoundEffect.jsm";
import {LoadRecordingService} from "./loadRecordingService.jsm";
import {RecordingState} from "./recordingState.jsm";
import {AssetService} from "./assetService.jsm";
import {createRecorder} from "./recorder/recorderFactory.jsm";
import {createPlayer} from "./player/playerFactory.jsm";
import {RecorderEventHandlingImplementation} from "./recorder/recorderEventHandlingImplementation.jsm";
import {PlayerEventHandlingImplementation} from "./player/playerEventHandlingImplementation.jsm";
import {SoundEffect} from "./soundEffect.jsm";
import {createLoader} from "./loader/loaderFactory.jsm";
import {AddonWrapper} from "./addonWrapper.jsm";
import {ActivationState} from "./activationState.jsm";
import {AudioLoader} from "./loader/audioLoader";
import {VideoLoader} from "./loader/videoLoader";

export class MediaRecorder {

    DEFAULT_VALUES = {
        MAX_TIME: 60,
        SUPPORTED_TYPES: {
            AUDIO: "audio",
            VIDEO: "video",
        }
    };

    ERROR_CODES = {
        "maxTime_INT02": "Time value contains non numerical characters",
        "maxTime_INT04": "Time in seconds cannot be negative value",
        "type_EV01": "Selected type is not supported"
    };

    run(view, model) {
        this._initialize(view, model);
        this._activateButtons();

    }

    createPreview(view, model) {
        this.viewHandlers = this._loadViewHandlers(view);
        this.player = createPlayer(model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01, this.viewHandlers.$playerView);
    }

    getState() {
        return this.recordingState.serialize();
    }

    setState(state) {
        this.recordingState.deserialize(state);
        if (this.recordingState.mediaSource)
            this.loadRecordingService.loadRecording(this.recordingState.mediaSource);
    }

    setPlayerController(playerController) {
        this.playerController = playerController;
    }

    activate() {
        if (this.activationState.isInactive()) {
            this.activationState.setActive();
            this._activateButtons();
            this.addonWrapper.activate();
        }
    }

    deactivate() {
        this._stopActions();
        this._deactivateButtons();
        this.activationState.setInactive();
        this.addonWrapper.deactivate();
    }

    reset() {
        this.deactivate();
        this.activate();
        this.loadRecordingService.loadRecording(this.model.defaultRecording);
        this.recordingState.reset();
    }

    destroy() {
        this.recorder.destroy();
        this.player.destroy();
        this.mediaResources.destroy();
        this.recordingTimer.destroy();
        this.soundIntensity.destroy();
        this.timer.destroy();
        this.playButton.destroy();
        this.startRecordingSoundEffect.destroy();
        this.stopRecordingSoundEffect.destroy();
        this.recordButton.destroy();
        this.loader.destroy();
        this.addonWrapper.destroy();

        this.state = null;
        this.activationState = null;
        this.viewHandlers = null;
        this.recorder = null;
        this.player = null;
        this.mediaResources = null;
        this.recordingTimer = null;
        this.soundIntensity = null;
        this.timer = null;
        this.recordButton = null;
        this.playButton = null;
        this.stopRecordingSoundEffect = null;
        this.startRecordingSoundEffect = null;
        this.assetService = null;
        this.recordingState = null;
        this.recorderEventHandlingImplementation = null;
        this.playerEventHandlingImplementation = null;
        this.loadRecordingService = null;
        this.loader = null;
        this.addonWrapper = null;

        this.playerController = null;
        this.view = null;
        this.model = null;
    }

    _initialize(view, model) {
        let validatedModel = validateModel(model, this.DEFAULT_VALUES);

        if (validatedModel.isValid)
            this._loadAddon(view, validatedModel.value);
        else
            this._showError(view, validatedModel);
    }

    _loadAddon(view, model) {
        this.view = view;
        this.model = model;

        this.viewHandlers = this._loadViewHandlers(this.view);

        this.addonWrapper = new AddonWrapper(this.viewHandlers.$wrapperView);

        this.state = new State();
        this.activationState = new ActivationState();
        this.timer = new Timer(this.viewHandlers.$timerView);
        this.soundIntensity = new SoundIntensity(this.viewHandlers.$soundIntensityView);

        this.recordingTimer = new RecordingTimer(this.model.maxTime);
        this.mediaResources = createMediaResources(this.model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01);
        this.recorder = createRecorder(this.model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01);
        this.player = createPlayer(this.model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01, this.viewHandlers.$playerView);

        this.startRecordingSoundEffect = new SoundEffect(this.model.startRecordingSound, this.viewHandlers.$playerView);
        this.stopRecordingSoundEffect = new SoundEffect(this.model.stopRecordingSound, this.viewHandlers.$playerView);
        this.recordButton = new RecordButton(this.viewHandlers.$recordButtonView, this.state, this.mediaResources, this.recorder, this.player, this.timer, this.soundIntensity, this.recordingTimer);
        this.recordButton = new RecordButtonSoundEffect(this.recordButton, this.startRecordingSoundEffect, this.stopRecordingSoundEffect);

        this.playButton = new PlayButton(this.viewHandlers.$playButtonView, this.state, this.player, this.timer);

        this.recordingState = new RecordingState();
        this.assetService = new AssetService(this.playerController, this.recordingState);

        this.loader = createLoader(this.model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01, this.viewHandlers.$loaderView);

        this.recorderEventHandlingImplementation = new RecorderEventHandlingImplementation(this.recorder, this.player, this.assetService);
        this.recorderEventHandlingImplementation.handleEvents();

        this.playerEventHandlingImplementation = new PlayerEventHandlingImplementation(this.player, this.soundIntensity, this.timer, this.playButton, this.state, this.loader);
        this.playerEventHandlingImplementation.handleEvents();

        this.loadRecordingService = new LoadRecordingService(this.player, this.state);
        this.loadRecordingService.loadRecording(this.model.defaultRecording);
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

    _showError(view, validatedModel) {
        DOMOperationsUtils.showErrorMessage(view, this.ERROR_CODES, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
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
        if (this.state.isRecording())
            this.recordButton.forceClick();
        if (this.state.isPlaying())
            this.playButton.forceClick();
    }

    _internalElements() {
        return {
            Timer: Timer,
            State: State,
            ActivationState: ActivationState,
            SoundIntensity: SoundIntensity,
            RecordingTimer: RecordingTimer,
            AudioLoader: AudioLoader,
            VideoLoader: VideoLoader,
            PlayButton: PlayButton
        }
    }
}