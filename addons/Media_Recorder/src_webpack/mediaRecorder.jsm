import {PlayButton} from "./playButton.jsm";
import {State} from "./state.jsm";
import {RecordButton} from "./recordButton.jsm";
import {Timer} from "./timer.jsm";
import {RecorderFactory} from "./recorderFactory.jsm";
import {PlayerFactory} from "./playerFactory.jsm";
import {RecordTimeLimiter} from "./recordTimeLimiter.jsm";
import {SoundEffect} from "./soundEffect.jsm";
import {RecordButtonStartSoundDecorator} from "./recordButtonDecorator/recordButtonStartSoundDecorator.jsm";
import {RecordButtonStopSoundDecorator} from "./recordButtonDecorator/recordButtonStopSoundDecorator.jsm";
import {validateModel} from "./validator.jsm";
import {RecordButtonDecoratorFactory} from "./recordButtonDecorator/recordButtonDecoratorFactory.jsm";
import {DefaultRecordingLoader} from "./defaultRecordingLoader.jsm";
import {SoundIntensity} from "./soundIntensity.jsm";

export class MediaRecorder {

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
        this.view = view;
        this.model = model;

        this.initialize();

        this.playButton.activate();
        this.recordButton.activate();
    }

    createPreview(view, model) {
        this.view = view;
        this.model = model;

        this.initialize();
    }

    initialize() {
        this.validateModel = validateModel;
        let validatedModel = this.validateModel(this.model, this.DEFAULT_VALUES);

        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(this.view, this.ERROR_CODES, this.validateModel.fieldName.join("|") + "_" + this.validateModel.errorCode);
            return;
        }

        this.configuration = validatedModel.value;
        this.state = new State();

        this.recorderFactory = new RecorderFactory(this.ERROR_CODES);
        this.recorder = this.recorderFactory.createRecorder(this.configuration.type);

        this.playerFactory = new PlayerFactory($(this.view).find(".media-recorder-player-wrapper"), this.ERROR_CODES);
        this.player = this.playerFactory.createPlayer(this.configuration.type);

        this.timer = new Timer($(this.view).find(".media-recorder-timer"));
        this.soundIntensity = new SoundIntensity($(this.view).find(".media-recorder-sound-intensity"));

        this.recordTimeLimiter = new RecordTimeLimiter(this.configuration.maxTime);
        this.playButton = new PlayButton($(this.view).find(".media-recorder-play-button"), this.state, this.timer, this.player);

        this.recordButton = new RecordButton($(this.view).find(".media-recorder-recording-button"), this.state, this.timer, this.recorder, this.recordTimeLimiter, this.soundIntensity);
        this.recordButtonDecoratorFactory = new RecordButtonDecoratorFactory(this.configuration.startRecordingSound, this.configuration.stopRecordingSound, $(this.view).find(".media-recorder-player-wrapper"));
        this.recordButton = this.recordButtonDecoratorFactory.decorateStartRecordingSoundEffect(this.recordButton);

        this.recordButton = this.recordButtonDecoratorFactory.decorateStopRecordingSoundEffect(this.recordButton);

        this.player.onEndedPlaying = () => this.playButton.forceClick();
        this.player.onDurationChanged = duration => this.timer.setDuration(duration);
        this.recorder.onAvailableResources = stream => this.soundIntensity.openStream(stream);
        this.recorder.onAvailableRecording = blob => this.player.setRecording(URL.createObjectURL(blob));
        this.recordTimeLimiter.onTimeExpired = () => this.recordButton.forceClick();

        this.defaultRecordingLoader = new DefaultRecordingLoader(this.player, this.timer, this.state);
        this.defaultRecordingLoader.loadDefaultRecording(this.configuration.defaultRecording);
    }
}