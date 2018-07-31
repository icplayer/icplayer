import {validateModel} from "./modelValidator.jsm";
import {createMediaResources} from "./resources/mediaResourcesFactory.jsm";
import {State} from "./state.jsm";
import {Timer} from "./timer.jsm";
import {SoundIntensity} from "./soundIntensity.jsm";
import {RecordButton} from "./recordButton.jsm";
import {PlayButton} from "./playButton.jsm";
import {RecordingTimer} from "./recordingTimer.jsm";
import {SoundEffect} from "./old/soundEffect.jsm";
import {RecordButtonSoundEffect} from "./recordButtonSoundEffect.jsm";
import {LoadRecordingService} from "./loadRecordingService.jsm";
import {RecordingState} from "./recordingState.jsm";
import {AssetService} from "./assetService.jsm";
import {createRecorder} from "./recorder/recorderFactory.jsm";
import {createPlayer} from "./player/playerFactory.jsm";
import {RecorderEventHandlingImplementation} from "./recorder/recorderEventHandlingImplementation.jsm";
import {PlayerEventHandlingImplementation} from "./player/playerEventHandlingImplementation.jsm";

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

    constructor() {
        this.playerController = null;
        this.recordButton = null;
        this.playButton = null;
        this.recordingState = null;
    }

    run(view, model) {
        this._initialize(view, model);
        this._activeButtons();

    }

    createPreview(view, model) {

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

    _initialize(view, model) {
        let validatedModel = validateModel(model, this.DEFAULT_VALUES);

        if (validatedModel.isValid)
            this._loadAddon(view, validatedModel.value);
        else
            this._showError(view, validatedModel);
    }

    _loadAddon(view, model) {
        this.viewHandlers = this._loadViewHandlers(view);

        this.state = new State();
        this.timer = new Timer(this.viewHandlers.$timerView);
        this.soundIntensity = new SoundIntensity(this.viewHandlers.$soundIntensityView);

        this.recordingTimer = new RecordingTimer(model.maxTime);
        this.mediaResources = createMediaResources(model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01);
        this.recorder = createRecorder(model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01);
        this.player = createPlayer(model.type, this.DEFAULT_VALUES.SUPPORTED_TYPES, this.ERROR_CODES.type_EV01, this.viewHandlers.$playerView);

        this.startRecordingSoundEffect = new SoundEffect(model.startRecordingSound, this.viewHandlers.$playerView);
        this.stopRecordingSoundEffect = new SoundEffect(model.stopRecordingSound, this.viewHandlers.$playerView);
        this.recordButton = new RecordButton(this.viewHandlers.$recordButtonView, this.state, this.mediaResources, this.recorder, this.player, this.timer, this.soundIntensity, this.recordingTimer);
        this.recordButton = new RecordButtonSoundEffect(this.recordButton, this.startRecordingSoundEffect, this.stopRecordingSoundEffect);

        this.playButton = new PlayButton(this.viewHandlers.$playButtonView, this.state, this.player, this.timer);

        this.recordingState = new RecordingState();
        this.assetService = new AssetService(this.playerController, this.recordingState);

        this.recorderEventHandlingImplementation = new RecorderEventHandlingImplementation(this.recorder, this.player, this.assetService);
        this.recorderEventHandlingImplementation.handleEvents();

        this.playerEventHandlingImplementation = new PlayerEventHandlingImplementation(this.player, this.soundIntensity, this.timer, this.playButton, this.state, this.viewHandlers.$loaderView);
        this.playerEventHandlingImplementation.handleEvents();

        this.loadRecordingService = new LoadRecordingService(this.player, this.state);
        this.loadRecordingService.loadRecording(model.defaultRecording);
    }

    _loadViewHandlers(view) {
        return {
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

    _activeButtons() {
        this.recordButton.activate();
        this.playButton.activate();
    }
}