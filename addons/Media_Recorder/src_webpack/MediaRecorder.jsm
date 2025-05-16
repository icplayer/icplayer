import {validateModel} from "./validation/validateModel.jsm";
import {ActivationState} from "./state/ActivationState.jsm";
import {MediaState} from "./state/MediaState.jsm";
import {Errors} from "./validation/Errors.jsm";
import {PlayButton} from "./view/button/PlayButton.jsm";
import {RecordButton} from "./view/button/RecordButton.jsm";
import {ResetButton} from "./view/button/ResetButton.jsm";
import {ResetDialog} from "./view/ResetDialog.jsm";
import {DownloadButton} from "./view/button/DownloadButton.jsm";
import {Timer} from "./view/Timer.jsm";
import {ProgressBar} from "./view/ProgressBar.jsm";
import {AddonState} from "./state/AddonState.jsm";
import {RecordingTimeLimiter} from "./RecordingTimeLimiter.jsm";
import {SoundIntensity} from "./view/SoundIntensity.jsm";
import {DottedSoundIntensity} from "./view/DottedSoundIntensity.jsm";
import {MediaAnalyserService} from "./analyser/MediaAnalyserService.jsm";
import {AudioLoader} from "./view/loader/AudioLoader.jsm";
import {SoundEffect} from "./view/button/sound/SoundEffect.jsm";
import {RecordButtonSoundEffect} from "./view/button/sound/RecordButtonSoundEffect.jsm";
import {AddonViewService} from "./view/AddonViewService.jsm";
import {AudioResourcesProvider} from "./resources/AudioResourcesProvider.jsm";
import {AudioRecorder} from "./recorder/AudioRecorder.jsm";
import {AudioPlayer} from "./player/AudioPlayer.jsm";
import {DefaultRecordingPlayButton} from "./view/button/DefaultRecordingPlayButton.jsm";
import {DefaultKeyboardController} from "./keyboard_navigation/DefaultKeyboardController.jsm";
import {ExtendedKeyboardController} from "./keyboard_navigation/ExtendedKeyboardController.jsm";
import {CSS_CLASSES} from "./view/CssClasses.jsm";
import {MP3ConvertHandler} from "./worker/MP3ConvertHandler.jsm";

export class MediaRecorder {

    enableAnalyser = true;
    isMlibro = false;
    isWCAGOn = false;
    keyboardControllerObject = null;
    mp3ConvertHandler = null;

    run(view, model) {
        let upgradedModel = this._upgradeModel(model);
        let validatedModel = validateModel(upgradedModel);

        const isSafari = DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;
        if (isSafari) {
            this.enableAnalyser = false;
        }

        if (this._isBrowserNotSupported()) {
            this._showBrowserError(view)
        } else if (validatedModel.isValid) {
            this.mp3ConvertHandler = new MP3ConvertHandler(this.playerController);
            this._runAddon(view, validatedModel.value);
        } else {
            this._showError(view, validatedModel);
        }

        this._executeNotification(JSON.stringify({type: "platform", target: this.model.ID}));
        this._buildKeyboardController();
        this.keyboardControllerObject.setSpeechTexts(upgradedModel['speechTexts']);
        this.recordButton.setKeyboardController(this.keyboardControllerObject);
    }

    createPreview(view, model) {
        let upgradedModel = this._upgradeModel(model);
        let validatedModel = validateModel(upgradedModel);

        if (!validatedModel.isValid)
            this._showError(view, validatedModel);
        else
            this._updatePreview(view, validatedModel);
    }

    setPlayerController(playerController) {
        this.playerController = playerController;
        if (this.player && this.recorder)
            this._loadEventBus()

        var context = playerController.getContextMetadata();
        this.isMlibro = false;
        if (context != null && "ismLibro" in context) {
            this.isMlibro = context["ismLibro"];
        }
    }

    isEmpty() {
        return this.addonState.isEmpty();
    }

    getMP3File() {
        return this.addonState.getMP3File();
    }

    getState() {
        return this.addonState.getState();
    }

    setState(state) {
        Object.assign(this.addonState, JSON.parse(state));
        this.addonState.getRecordingBlob()
            .then(blob => {
                this.mediaState.setLoading();
                let recording;
                if (this.addonState.isMP3Format(blob)) {
                    try {
                        if (this.player._isMobileSafari() || this.player._isIosMlibro() || this.player._isIOSWebViewUsingAppleWebKit()) {
                            let tmpBlob = new Blob([blob], {type: "audio/mpeg"});
                            recording = URL.createObjectURL(tmpBlob);
                        } else {
                            let tmpFile = new File([blob], "recording.mp3", {type: "audio/mp3"});
                            recording = URL.createObjectURL(tmpFile);
                        }
                    } catch (error) {
                        recording = URL.createObjectURL(blob);
                    }
                } else {
                    recording = URL.createObjectURL(blob);
                }
                this.player.setRecording(recording);
                if (this.model.extendedMode) {
                    this.setEMRecordedStateView();
                }
            });
        this.addonState.getVisibility()
            .then(isVisible => {
                this.setVisibility(isVisible);
            });
        this.addonState.getEnabled()
            .then(isEnable => {
                this._setEnableState(isEnable);
            });
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
        this.activationState.destroy();
        this.mp3ConvertHandler.destroy();

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
        this.downloadButton = null;
        this.resetButton = null;
        this.progressBar = null;
        this.stopRecordingSoundEffect = null;
        this.startRecordingSoundEffect = null;
        this.loader = null;
        this.addonViewService = null;
        this.mediaAnalyserService = null;
        this.addonState = null;
        this.mediaState = null;
        this.activationState = null;
        this.extendedModeButtonList = null;

        this.playerController = null;
        this.keyboardControllerObject = null;
        this.mp3ConvertHandler = null;
        this.view = null;
        this.model = null;
    }

    enable() {
        this._setEnableState(true);
    }

    disable() {
        this._setEnableState(false);
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
        if (this.model.isResetRemovesRecording) {
            this.resetRecording();
        }
        this.activate();
        this.setVisibility(this.model["Is Visible"]);
        this._setEnableState(!this.model.isDisabled);
    }

    resetRecording() {
        this.recordButton.reset();
        this.player.reset();
        this.addonState.reset();
        this.timer.reset();
        if (this.defaultRecordingPlayer.hasRecording) {
            this.mediaState.setLoadedDefaultRecording();
            this.timer.setDuration(this.defaultRecordingPlayer.duration);
        } else
            this.mediaState.setNew();
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
        this._setEnableState(!model.isDisabled);
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
        if (this.model.extendedMode) {
            this._prepareExtendedModeView();
            this.setEMDefaultStateView();
        }
        if (this.model.disableRecording) {
            this._hidePlayAndTimerWidgets();
        }
        this.mediaState = new MediaState();
        this.activationState = new ActivationState();
        this.addonState = new AddonState();
        this.addonState.setMP3ConvertHandler(this.mp3ConvertHandler);
    }

    _loadViewHandlers(view) {
        return {
            $wrapperView: $(view).find("." + CSS_CLASSES.WRAPPER),
            $playerView: $(view).find("." + CSS_CLASSES.PLAYER_WRAPPER),
            $loaderView: $(view).find("." + CSS_CLASSES.PLAYER_LOADER),
            $defaultRecordingPlayButtonView: $(view).find("." + CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON),
            $recordButtonView: $(view).find("." + CSS_CLASSES.RECORDING_BUTTON),
            $playButtonView: $(view).find("." + CSS_CLASSES.PLAY_BUTTON),
            $timerView: $(view).find("." + CSS_CLASSES.TIMER),
            $soundIntensityView: $(view).find("." + CSS_CLASSES.SOUND_INTENSITY),
            $dottedSoundIntensityView: $(view).find("." + CSS_CLASSES.DOTTED_SOUND_INTENSITY),
            $progressBarWrapperView: $(view).find("." + CSS_CLASSES.PROGRESS_BAR),
            $progressBarSliderView: $(view).find("." + CSS_CLASSES.PROGRESS_BAR_SLIDER),
            $resetButtonView: $(view).find("." + CSS_CLASSES.RESET_BUTTON),
            $downloadButtonView: $(view).find("." + CSS_CLASSES.DOWNLOAD_BUTTON),
            $resetDialogView: $(view).find("." + CSS_CLASSES.RESET_DIALOG)
        };
    }

    _prepareExtendedModeView() {
        this.viewHandlers.$wrapperView.addClass(CSS_CLASSES.EXTENDED_MODE);
        this.viewHandlers.$timerView.insertBefore(this.viewHandlers.$playButtonView);
    }

    _hidePlayAndTimerWidgets() {
        this.viewHandlers.$playButtonView.hide();
        this.viewHandlers.$defaultRecordingPlayButtonView.hide();
        this.viewHandlers.$timerView.hide();
    }

    _loadMediaElements() {
        this.recorder = new AudioRecorder();
        this.player = new AudioPlayer(this.viewHandlers.$playerView, this.isMlibro);
        this.player.setIsMlibro(this.isMlibro);
        this.defaultRecordingPlayer = new AudioPlayer(this.viewHandlers.$playerView, this.isMlibro);
        this.resourcesProvider = new AudioResourcesProvider(this.viewHandlers.$wrapperView);
        if (this.playerController)
            this._loadEventBus();
    }

    _loadEventBus() {
        let eventBus = this.playerController.getEventBus();
        this.player.setEventBus(eventBus, this.model.ID, "player");
        this.defaultRecordingPlayer.setEventBus(eventBus, this.model.ID, "default");
        this.recorder.setEventBus(eventBus, this.model.ID);
        this.eventBus = eventBus;
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

        this.extendedModeButtonList = [];
        if (this.model.extendedMode) {
            this.downloadButton = new DownloadButton({
                $view: this.viewHandlers.$downloadButtonView,
                addonState: this.addonState
            });
            this.resetButton = new ResetButton(this.viewHandlers.$resetButtonView);
            this.resetDialog = new ResetDialog(this.viewHandlers.$resetDialogView, this.model.resetDialogLabels);
            this.progressBar = new ProgressBar(this.viewHandlers.$progressBarWrapperView);
            this.extendedModeButtonList.push(this.downloadButton);
            this.extendedModeButtonList.push(this.resetButton);
        }

        this.loader = new AudioLoader(this.viewHandlers.$loaderView);

        this.timer = new Timer(this.viewHandlers.$timerView);
        if (this.model.extendedMode) {
            this.soundIntensity = new DottedSoundIntensity(this.viewHandlers.$dottedSoundIntensityView);
            this.viewHandlers.$soundIntensityView.css('display', 'none');
        } else {
             this.soundIntensity = new SoundIntensity(this.viewHandlers.$soundIntensityView);
             this.viewHandlers.$dottedSoundIntensityView.css('display', 'none');
        }
        if (this.eventBus && this.model.enableIntensityChangeEvents) {
            this.soundIntensity.setEventBus(this.eventBus, this.model.ID);
        }
        this.soundIntensity.setEnableAnalyser(this.enableAnalyser);

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

    setEMDefaultStateView() {
        this.viewHandlers.$defaultRecordingPlayButtonView.css('display', 'none');
        this.viewHandlers.$recordButtonView.css('display', '');
        if (this.model.disableRecording) {
            this.viewHandlers.$timerView.css('display', 'none');
        } else {
            this.viewHandlers.$timerView.css('display','');
        }
        if (this.soundIntensity) {
            this.soundIntensity.show();
        }
        this.viewHandlers.$playButtonView.css('display', 'none');
        this.viewHandlers.$progressBarWrapperView.css('display', 'none');
        this.viewHandlers.$progressBarWrapperView.css('visibility', 'hidden');
        this.viewHandlers.$resetButtonView.css('display', 'none');
        this.viewHandlers.$downloadButtonView.css('display', 'none');
    }

    setEMRecordedStateView() {
        this.viewHandlers.$defaultRecordingPlayButtonView.css('display', 'none');
        this.viewHandlers.$recordButtonView.css('display', 'none');
        this.viewHandlers.$timerView.css('display','');
        if (this.soundIntensity) {
                this.soundIntensity.hide();
            }
        this.viewHandlers.$playButtonView.css('display', '');
        this.viewHandlers.$progressBarWrapperView.css('display', 'block');
        this.viewHandlers.$progressBarWrapperView.css('visibility', 'visible');
        this.viewHandlers.$resetButtonView.css('display', 'block');
        this.viewHandlers.$downloadButtonView.css('display', 'block');
    }

    setEMPlayingStateView() {
        this.viewHandlers.$defaultRecordingPlayButtonView.css('display', 'none');
        this.viewHandlers.$recordButtonView.css('display', 'none');
        this.viewHandlers.$timerView.css('display','');
        if (this.soundIntensity) {
            this.soundIntensity.hide();
        }
        this.viewHandlers.$playButtonView.css('display', '');
        this.viewHandlers.$progressBarWrapperView.css('display', 'block');
        this.viewHandlers.$progressBarWrapperView.css('visibility', 'visible');
        this.viewHandlers.$resetButtonView.css('display', 'block');
        this.viewHandlers.$downloadButtonView.css('display', 'block');
    }

    _loadLogic() {
        this.recordButton.onStartRecording = () => {
            this.mediaState.setBlocked();
            if (this.platform === 'mlibro') {
                this._handleMlibroStartRecording();
            } else {
                this.resourcesProvider.getMediaResources().then(stream => {
                    const isSafari = window.DevicesUtils.getBrowserVersion().toLowerCase().indexOf("safari") > -1;
                    if (isSafari) {
                        this.mediaState.setBlockedSafari();
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
                if (this.enableAnalyser) {
                    this.mediaAnalyserService.closeAnalyzing();
                }
                if (!this.model.disableRecording) {
                    this.recorder.stopRecording()
                        .then(blob => {
                            this.addonState.setRecordingBlob(blob);
                            let recording = URL.createObjectURL(blob);
                            this.player.reset();
                            this.player.setRecording(recording);

                            return blob;
                        })
                        .then(wavBlob => {
                            return this.addonState.convertWavBlobToMP3BlobByWorker(wavBlob);
                        })
                        .then(mp3Blob => {
                            this.addonState.setRecordingBlob(mp3Blob);
                        }, () => {});
                }
                this.resourcesProvider.destroy();
            }
            if (this.model.extendedMode) {
                if (this.model.disableRecording) {
                    this.setEMDefaultStateView();
                } else {
                    this.setEMRecordedStateView();
                }
            }
            if (this.model.disableRecording) {
                this.mediaState.setLoaded();
            }
        };


        this.recordButton.onReset = () => {
            this.mediaState.setLoading();
            this.timer.stopCountdown();
            this.recordingTimeLimiter.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            if (this.enableAnalyser) {
                this.mediaAnalyserService.closeAnalyzing();
            }
            this.recorder.stopRecording();
            this.resourcesProvider.destroy();
        };

        if (this.model.extendedMode) {
            this.resetButton.onReset = () => {
                this.resetDialog.open();
                this.keyboardControllerObject.setElements(this._getElementsForResetDialogKeyboardNavigation());
                if (this.keyboardControllerObject.keyboardNavigationActive) {
                    this.keyboardControllerObject.markDialogTextAndReadResetDialogTTS();
                }
            }
            this.resetDialog.onConfirm = () => {
                this.resetRecording();
                if (this.model.extendedMode) {
                    this.setEMDefaultStateView();
                }
                this.progressBar.setProgress(0.0);
                this.keyboardControllerObject.setElements(this._getElementsForExtendedKeyboardNavigation());
                if (this.keyboardControllerObject.keyboardNavigationActive) {
                    this.keyboardControllerObject.markRecordingButton();
                    this.keyboardControllerObject.readCurrentElement();
                }
            }
            this.resetDialog.onDeny = () => {
                this.keyboardControllerObject.setElements(this._getElementsForExtendedKeyboardNavigation());
                if (this.keyboardControllerObject.keyboardNavigationActive) {
                    this.keyboardControllerObject.markResetButton();
                    this.keyboardControllerObject.readCurrentElement();
                }
            }

            this.progressBar.onStartDragging = () => {
                if (this.mediaState.isPlaying()) {
                    this.player.pausePlaying();
                    this.playButton.forceClick();
                }
            }

            this.progressBar.onStopDragging = progress => {
                this.player.setProgress(progress);
            }
        }

        this.playButton.onStartPlaying = () => {
            this.mediaState.setPlaying();
            if (this.enableAnalyser) {
                this.player.startPlaying()
                    .then(htmlMediaElement => this.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement)
                        .then(analyser => this.soundIntensity.startAnalyzing(analyser)));
            } else {
                this.player.startPlaying();
            }
        };

        this.playButton.onStopPlaying = () => {
            this.mediaState.setLoaded();
            if (this.model.extendedMode) {
                this.player.pausePlaying();
            } else {
                this.player.stopPlaying();
            }
            this.soundIntensity.stopAnalyzing();
            if (this.enableAnalyser) {
                this.mediaAnalyserService.closeAnalyzing();
            }
        };

        this.defaultRecordingPlayButton.onStartPlaying = () => {
            this.mediaState.setPlayingDefaultRecording();
            this.timer.setDuration(this.defaultRecordingPlayer.duration);
            this.timer.startCountdown();
            if (this.enableAnalyser) {
                this.defaultRecordingPlayer.startPlaying()
                    .then(htmlMediaElement => this.mediaAnalyserService.createAnalyserFromElement(htmlMediaElement)
                        .then(analyser => this.soundIntensity.startAnalyzing(analyser)));
            } else {
                this.defaultRecordingPlayer.startPlaying();
            }
        };

        this.defaultRecordingPlayButton.onStopPlaying = () => {
            if (this.player.hasRecording) {
                this.mediaState.setLoaded();
                this.timer.setDuration(this.player.duration);
            } else {
                this.mediaState.setLoadedDefaultRecording();
            }

            this.defaultRecordingPlayer.stopPlaying();
            this.timer.stopCountdown();
            this.soundIntensity.stopAnalyzing();
            if (this.enableAnalyser) {
                this.mediaAnalyserService.closeAnalyzing();
            }
        };

        this.player.onStartLoading = () => {
            this.mediaState.setLoading();
            this.loader.show();
        };

        this.player.onEndLoading = () => {
            if (this.mediaState.isLoading()){
                this.mediaState.setLoaded();
                this.loader.hide();
            }
        };

        var player = this.player;
        var timer = this.timer;
        var progressBar = this.progressBar;
        function timeUpdateCallback(event){
            var currentTime = player.getCurrentTime();
            timer.setTime(currentTime);
            if (progressBar) {
                player._getDuration().then(duration => {
                    progressBar.setProgress(currentTime/duration);
                });
            }
        }

        this.player.onDurationChange = duration => this.timer.setDuration(duration);
        this.player.onTimeUpdate = event => timeUpdateCallback(event);
        this.player.onEndPlaying = () => this.playButton.forceClick();

        this.defaultRecordingPlayer.onStartLoading = () => {
            this.mediaState.setLoading();
            this.loader.show();
        };

        this.defaultRecordingPlayer.onEndLoading = () => {
            if (this.player.hasRecording) {
                this.mediaState.setLoaded();
            } else {
                this.mediaState.setLoadedDefaultRecording();
            }
            this.loader.hide();
        };

        this.defaultRecordingPlayer.onDurationChange = duration => this.timer.setDuration(duration);
        this.defaultRecordingPlayer.onEndPlaying = () => this.defaultRecordingPlayButton.forceClick();

        this.recordingTimeLimiter.onTimeExpired = () => this.recordButton.forceClick();
    }

    _handleRecording(stream) {
        this.mediaState.setRecording();
        if (!this.model.disableRecording) {
            this.recorder.startRecording(stream);
            this.timer.reset();
            this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
            this.recordingTimeLimiter.startCountdown();
        }
        if (this.enableAnalyser) {
            this.mediaAnalyserService.createAnalyserFromStream(stream)
                .then(analyser => this.soundIntensity.startAnalyzing(analyser));
        }
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
        if (!this.model.disableRecording) {
            this.playButton.activate();
        }
        this.defaultRecordingPlayButton.activate();
        if (this.model.extendedMode) {
            for (var i=0; i < this.extendedModeButtonList.length; i++) {
                this.extendedModeButtonList[i].activate();
            }
        }
    }

    _deactivateButtons() {
        this.recordButton.deactivate();
        this.playButton.deactivate();
        this.defaultRecordingPlayButton.deactivate();
        if (this.model.extendedMode) {
            for (var i=0; i < this.extendedModeButtonList.length; i++) {
                this.extendedModeButtonList[i].deactivate();
            }
        }
    }


    _stopActions() {
        if (this.mediaState.isRecording()) {
            this.recordButton.forceClick();
        }
        if (this.mediaState.isPlaying()) {
            this.playButton.forceClick();
        }
        if (this.mediaState.isPlayingDefaultRecording()) {
            this.defaultRecordingPlayButton.forceClick();
        }
        if (this.mediaState.isLoaded()) {
            this.timer.setTime(0);
        }
    }

    _internalElements() {
        return {
            validateModel: validateModel,
            ActivationState: ActivationState,
            AddonState: AddonState,
            AudioLoader: AudioLoader,
            PlayButton: PlayButton,
            RecordButton: RecordButton,
            RecordingTimeLimiter: RecordingTimeLimiter,
            MediaState: MediaState,
            Timer: Timer,
            AudioPlayer: AudioPlayer,
            DownloadButton: DownloadButton,
            SoundIntensity: SoundIntensity,
            MP3ConvertHandler: MP3ConvertHandler,
        }
    }

    _showError(view, validatedModel) {
        DOMOperationsUtils.showErrorMessage(view, Errors, validatedModel.fieldName.join("|") + "_" + validatedModel.errorCode);
    }

    _showBrowserError(view) {
        let $wrapper = $(view).find("." + CSS_CLASSES.WRAPPER);
        $wrapper.addClass(CSS_CLASSES.WRAPPER_BROWSER_NOT_SUPPORTED);
        $wrapper.text(Errors["not_supported_browser"] + window.DevicesUtils.getBrowserVersion());
    }

    _updatePreview(view, validatedModel) {
        let valid_model = validatedModel.value;
        let timerViewHandler = $(view).find("." + CSS_CLASSES.TIMER);
        let defaultButtonViewHandler = $(view).find("." + CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON);
        let $wrapperViewHandler = $(view).find("." + CSS_CLASSES.WRAPPER);
        let intensityView = $(view).find("." + CSS_CLASSES.SOUND_INTENSITY);
        let dottedSoundIntensityView = $(view).find("." + CSS_CLASSES.DOTTED_SOUND_INTENSITY);
        let playButton = $(view).find("." + CSS_CLASSES.PLAY_BUTTON);

        if (valid_model.extendedMode) {
            intensityView.css('display', 'none');
            playButton.css('display', 'none');
            dottedSoundIntensityView.css('display','');
            defaultButtonViewHandler.hide();
            timerViewHandler.text('00:00');
            $wrapperViewHandler.addClass(CSS_CLASSES.EXTENDED_MODE);
        } else {
            intensityView.css('display', '');
            dottedSoundIntensityView.css('display','none');

            if (valid_model.isShowedTimer == false)
                timerViewHandler.hide();
            else
                timerViewHandler.show();

            if (!valid_model.isShowedDefaultRecordingButton)
                defaultButtonViewHandler.hide();
            else
                defaultButtonViewHandler.show();

            if (valid_model.isDisabled) {
                this.addonViewService = new AddonViewService($wrapperViewHandler);
                this.addonViewService.deactivate();
            }
        }
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


    _loadWebViewMessageListener() {
        window.addEventListener('message', event => {
            try {
                const eventData = JSON.parse(event.data);
                let isTypePlatform = eventData.type ? eventData.type.toLowerCase() === 'platform' : false;
                let isValueMlibro = eventData.value ? eventData.value.toLowerCase().includes('mlibro') : false;
                if (isTypePlatform && isValueMlibro)
                    this._handleWebViewBehaviour();
            } catch(e) {
                if (e instanceof SyntaxError) {
                    return;
                }
            }
        }, false);
    }

    _handleWebViewBehaviour() {
        if (this.platform === undefined || this.platform === null) {
            this.platform = 'mlibro';
            window.addEventListener('message', event => {
                const eventData = JSON.parse(event.data);
                let isTypeRecording = eventData.type ? eventData.type.toLowerCase() === 'recording' : false;
                let isTargetMe = eventData.target ? eventData.target === this.model.ID : false;
                let isStateLoading = this.mediaState.isLoading();
                if (isTypeRecording && isTargetMe && isStateLoading) {
                    this.addonState.setRecordingBase64(eventData.value);
                    this.player.reset();
                    this.player.setRecording(eventData.value);
                } else {
                    console.log("The recording has not been received");
                }
            }, false);
        }
    }

    _executeNotification(notifyInput) {
        try {
            if (mLibroChromium != undefined) {
                mLibroChromium.notify(notifyInput);
            } else {
                window.external.notify(notifyInput);
            }
        } catch (e) {
            // silent message
            // can't use a conditional expression
            // https://social.msdn.microsoft.com/Forums/en-US/1a8b3295-cd4d-4916-9cf6-666de1d3e26c/windowexternalnotify-always-undefined?forum=winappswithcsharp
        }
    }

    _handleMlibroStartRecording() {
        this.mediaState.setRecording();
        this.timer.reset();
        this.timer.startDecrementalCountdown(this.recordingTimeLimiter.maxTime);
        this.recordingTimeLimiter.startCountdown();
        this._executeNotification(JSON.stringify({type: "mediaRecord", target: this.model.ID}));
    }

    _handleMlibroStopRecording() {
        this.mediaState.setLoading();
        this.timer.stopCountdown();
        this.recordingTimeLimiter.stopCountdown();
        this._executeNotification(JSON.stringify({type: "mediaStop", target: this.model.ID}));
    }

    _setEnableState(isEnable) {
        if (isEnable) {
            this.addonState.setEnabled(true);
            this.activate();
        } else {
            this.addonState.setEnabled(false);
            this.deactivate();
        }
    }

    _upgradeModel(model) {
        let upgradedModel = this._upgradeIsDisabled(model);
        upgradedModel = this._upgradeEnableInErrorCheckigMode(upgradedModel);
        upgradedModel = this._upgradeExtendedMode(upgradedModel);
        upgradedModel = this._upgradeResetDialog(upgradedModel);
        upgradedModel = this._upgradeDisableRecording(upgradedModel);
        upgradedModel = this._upgradeEnableIntensityChangeEvents(upgradedModel);
        upgradedModel = this._upgradeLangTag(upgradedModel);
        upgradedModel = this._upgradeSpeechTexts(upgradedModel);
        return upgradedModel;
    };

    _upgradeIsDisabled(model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["isDisabled"]) {
            upgradedModel["isDisabled"] = "False";
        }

        return upgradedModel;
    };

    _upgradeEnableInErrorCheckigMode(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["enableInErrorCheckingMode"]) {
            upgradedModel["enableInErrorCheckingMode"] = "False";
        }

        return upgradedModel;
    };

    _upgradeExtendedMode(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["extendedMode"]) {
            upgradedModel["extendedMode"] = "False";
        }

        return upgradedModel;
    };

    _upgradeResetDialog(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["resetDialogLabels"]) {
            upgradedModel["resetDialogLabels"] = {
                "resetDialogText": {"resetDialogLabel": ""},
                "resetDialogConfirm": {"resetDialogLabel": ""},
                "resetDialogDeny": {"resetDialogLabel": ""},
            }
        }

        return upgradedModel;
    }

    _upgradeDisableRecording(model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["disableRecording"]) {
            upgradedModel["disableRecording"] = "False";
        }

        return upgradedModel;
    };

    _upgradeEnableIntensityChangeEvents(model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["enableIntensityChangeEvents"]) {
            upgradedModel["enableIntensityChangeEvents"] = "False";
        }

        return upgradedModel;
    };

    _upgradeLangTag(model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = "";
        }

        return upgradedModel;
    };

    _upgradeSpeechTexts(model) {
        let upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["DefaultRecordingPlayButton"]) {
            upgradedModel["speechTexts"]["DefaultRecordingPlayButton"]
              = {DefaultRecordingPlayButton: ""};
        }
        if (!upgradedModel["speechTexts"]["RecordingButton"]) {
            upgradedModel["speechTexts"]["RecordingButton"]
              = {RecordingButton: ""};
        }
        if (!upgradedModel["speechTexts"]["PlayButton"]) {
            upgradedModel["speechTexts"]["PlayButton"]
              = {PlayButton: ""};
        }
        if (!upgradedModel["speechTexts"]["ResetButton"]) {
            upgradedModel["speechTexts"]["ResetButton"]
              = {ResetButton: ""};
        }
        if (!upgradedModel["speechTexts"]["DownloadButton"]) {
            upgradedModel["speechTexts"]["DownloadButton"]
              = {DownloadButton: ""};
        }
        if (!upgradedModel["speechTexts"]["ResetDialog"]) {
            upgradedModel["speechTexts"]["ResetDialog"]
              = {ResetDialog: ""};
        }
        if (!upgradedModel["speechTexts"]["StartRecording"]) {
            upgradedModel["speechTexts"]["StartRecording"]
              = {StartRecording: ""};
        }
        if (!upgradedModel["speechTexts"]["StopRecording"]) {
            upgradedModel["speechTexts"]["StopRecording"]
              = {StopRecording: ""};
        }
        if (!upgradedModel["speechTexts"]["Disabled"]) {
            upgradedModel["speechTexts"]["Disabled"]
              = {Disabled: ""};
        }

        return upgradedModel;
    };

    setWCAGStatus(isWCAGOn) {
        this.isWCAGOn = isWCAGOn;
    };

    _buildKeyboardController() {
        const columnsCount = 1;
        const model = this.model;
        const mediaState = this.mediaState;
        const activationState = this.activationState;
        const speak = this._speak.bind(this);
        const speakAndExecuteCallback = this._speakAndExecuteCallback.bind(this);

        if (this.model.extendedMode) {
            this.keyboardControllerObject = new ExtendedKeyboardController(
                this._getElementsForExtendedKeyboardNavigation(),
                columnsCount, model, mediaState, activationState,
                speak, speakAndExecuteCallback,
            );
        } else {
            this.keyboardControllerObject = new DefaultKeyboardController(
                this._getElementsForDefaultKeyboardNavigation(),
                columnsCount, model, mediaState, activationState,
                speak, speakAndExecuteCallback,
            );
        }
    };

    getKeyboardController() {
        return this.keyboardControllerObject;
    };

    _getElementsForDefaultKeyboardNavigation() {
        return $(this.view).find(`
            .${CSS_CLASSES.DEFAULT_RECORDING_PLAY_BUTTON},
            .${CSS_CLASSES.RECORDING_BUTTON},
            .${CSS_CLASSES.PLAY_BUTTON}
        `);
    };

    _getElementsForExtendedKeyboardNavigation() {
        return $(this.view).find(`
            .${CSS_CLASSES.RECORDING_BUTTON},
            .${CSS_CLASSES.PLAY_BUTTON},
            .${CSS_CLASSES.RESET_BUTTON},
            .${CSS_CLASSES.DOWNLOAD_BUTTON}
        `);
    };

    _getElementsForResetDialogKeyboardNavigation() {
        return $(this.view).find(`
            .${CSS_CLASSES.DIALOG_TEXT},
            .${CSS_CLASSES.CONFIRM_BUTTON},
            .${CSS_CLASSES.DENY_BUTTON}
        `);
    };

    _speak(data) {
        let tts = this.keyboardControllerObject.getTextToSpeechOrNull(this.playerController);
        if (tts && this.isWCAGOn) {
            tts.speak(data);
        }
    };

    _speakAndExecuteCallback(data, callbackFunction) {
        var tts = this.keyboardControllerObject.getTextToSpeechOrNull(this.playerController);
        if (tts && this.isWCAGOn) {
            tts.speakWithCallback(data, callbackFunction);
        } else {
            callbackFunction();
        }
    };
}
