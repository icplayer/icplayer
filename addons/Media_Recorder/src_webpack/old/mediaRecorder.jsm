import {PlayButton} from "./playButton.jsm";
import {RecordButton} from "./recordButton.jsm";
import {Timer} from "./timer.jsm";
import {RecorderFactory} from "./recorder/recorderFactory.jsm";
import {PlayerFactory} from "./player/playerFactory.jsm";
import {RecordTimeLimiter} from "./recordTimeLimiter.jsm";
import {validateModel} from "./validator.jsm";
import {DefaultRecordingLoader} from "./defaultRecordingLoader.jsm";
import {SoundIntensity} from "./soundIntensity.jsm";
import {SoundEffect} from "./soundEffect.jsm";
import {RecordButtonSoundEffect} from "./recordButtonSoundEffect.jsm";
import {AssetService} from "./assetService.jsm";
import {RecordingState} from "./recordingState.jsm";
import {State} from "./state.jsm";

export class MediaRecorder {
    constructor() {
    }

    DEFAULT_VALUES = {
        MAX_TIME: 60,
        SUPPORTED_TYPES: ['audio', 'video']
    };

    ERROR_CODES = {
        "maxTime_INT02": "Time value contains non numerical characters",
        "maxTime_INT04": "Time in seconds cannot be negative value",
        "type_EV01": "Selected type is not supported"
    };

    run(view, model) {
        this.initialize(view, model);
        this.activeButtons();
    }

    createPreview(view, model) {
        this.initialize(view, model);
    }

    setPlayerController(playerController) {
        this.playerController = playerController;
    }

    getState() {
        return this.state.serialize();
    }

    setState(state) {
        this.state.deserialize(state);
        if (this.state.mediaSource) {
            this.recordingState.setLoaded();
            this.player.recording = this.state.mediaSource;
        }
    }

    initialize(view, model) {
        let validatedModel = validateModel(model, this.DEFAULT_VALUES);

        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, this.ERROR_CODES, validateModel.fieldName.join("|") + "_" + validateModel.errorCode);
            return;
        }

        this.loadLayout(view, validatedModel);
    }

    loadLayout(view, model) {
        let configuration = model.value;

        let $playerView = $(view).find(".media-recorder-player-wrapper");
        let $timerView = $(view).find(".media-recorder-timer");
        let $soundIntensityView = $(view).find(".media-recorder-sound-intensity");
        let $recordButtonView = $(view).find(".media-recorder-recording-button");
        let $playButtonView = $(view).find(".media-recorder-play-button");
        let $loaderView = $(view).find(".media-recorder-player-loader");

        this.state = new State();
        this.recordingState = new RecordingState();

        this.timer = new Timer($timerView);
        this.soundIntensity = new SoundIntensity($soundIntensityView);

        this.playerFactory = new PlayerFactory($playerView, this.timer, this.soundIntensity, this.ERROR_CODES.type_EV01);
        this.player = this.playerFactory.createPlayer(configuration.type);

        this.recorderFactory = new RecorderFactory(this.ERROR_CODES.type_EV01);
        this.recorder = this.recorderFactory.createRecorder(configuration.type);

        this.assetService = new AssetService(this.playerController, this.state);
        this.recordTimeLimiter = new RecordTimeLimiter(configuration.maxTime);

        this.playButton = new PlayButton($playButtonView, this.recordingState, this.timer, this.player, this.soundIntensity);
        this.recordButton = new RecordButton($recordButtonView, this.recordingState, this.timer, this.recorder, this.recordTimeLimiter);

        this.startRecordingSoundEffect = new SoundEffect(configuration.startRecordingSound, $playerView);
        this.stopRecordingSoundEffect = new SoundEffect(configuration.stopRecordingSound, $playerView);
        this.recordButton = new RecordButtonSoundEffect(this.recordButton, this.startRecordingSoundEffect, this.stopRecordingSoundEffect);

        this.loadRecorderTimeLimiterLogic();
        this.loadRecorderLogic();
        this.loadPlayerLogic();

        this.defaultRecordingLoader = new DefaultRecordingLoader($loaderView, this.player, this.timer, this.recordingState);
        this.defaultRecordingLoader.loadDefaultRecording(configuration.defaultRecording);
    }

    loadRecorderTimeLimiterLogic() {
        this.recordTimeLimiter.onTimeExpired = () => this.recordButton.forceClick();
    }

    loadPlayerLogic() {
        this.player.onEndedPlaying = () => this.playButton.forceClick();

        this.player.onStartPlaying = mediaNode => {
            let stream = mediaNode.captureStream();
            this.soundIntensity.openStream(stream);
        };

        this.player.onStopPlaying = () => {
            this.soundIntensity.closeStream();
        };

        this.player.onDurationChanged = duration => {
            this.timer.duration = duration;
        };
    }

    loadRecorderLogic() {
        this.recorder.onAvailableResources = stream => {
            this.player.setStream(stream);
            this.soundIntensity.openStream(stream);
        };

        this.recorder.onAvailableRecording = blob => {
            let recording = URL.createObjectURL(blob);
            this.player.stop();
            this.player.recording = recording;
            this.assetService.storeAsset(blob);
        };
    }

    activeButtons() {
        this.playButton.activate();
        this.recordButton.activate();
    }
}