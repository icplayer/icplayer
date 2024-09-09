function AddonTextAudio_create() {
    var presenter = function() {};

    presenter.markerWCAG = {};

    presenter.originalFile = {};
    presenter.vocabularyFile = {};
    presenter.eventBus = null;
    presenter.currentTimeAlreadySent = null;
    presenter.hasBeenStarted = false;
    presenter.isPlaying = false;
    presenter.globalIntervalNumber = 0;
    presenter.isVocabularyAudioLoaded = false;
    presenter.isVocabularyPlaying = false;
    presenter.buzzAudio = [];
    presenter.disabledTime = 0;
    presenter.audio = {};
    presenter.current_slide_data = {
        slide_id: -1,
        selection_id: -1
    };
    presenter.playerController = null;
    presenter.selectionId = undefined;
    presenter.playedByClick = false;
    presenter.addonID = null;
    presenter.fps = 10;
    presenter.previousSelectionId = -1;
    presenter.mouseData = {};
    presenter.slidesMade = false;
    presenter.keyboardControllerObject = null;
    presenter.isWCAGOn = false;
    presenter.speechTexts = null;

    presenter.PLAYBACK_RATE_LIST = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
    presenter.playbackRate = 1.0;
    presenter.isPreview = false;

    var controls = {
        CUSTOM: "Custom",
        BROWSER: "Browser",
        NONE: "None"
    };

    /**
     * play_interval_or_vocabulary - this option if for compatibility sake. If user had both
     * 'Individual fragment playback' and 'Vocabulary audio files playback' options selected the result was
     * different than can be now obtained by selecting one of the 'On Text Click Behavior' property option.
     */
    presenter.ALLOWED_CLICK_BEHAVIOUR = {
        play_from_the_moment: 'Play from the moment',
        play_interval: 'Play the interval',
        play_vocabulary_file: 'Play vocabulary audio file',
        play_vocabulary_interval: 'Play the interval from vocabulary file',
        play_interval_or_vocabulary: 'Play interval from base file or vocabulary audio file'
    };

    presenter.ERROR_CODES = {
        'M01': 'This addon needs at least 1 audio file.',
        'M02': 'Number of texts in the slide should be the same as number of time entities',
        'M03': 'Incorrectly defined period of time',
        'M04': 'Entry ends before start',
        'M05': 'Duplicated text for second',
        'M06': 'Error while downloading SRT file',
        'M07': 'Invalid crop time value',
        'SAF01': 'Property Vocabulary audio files cannot be empty',
        'SAF02': 'Number of Vocabulary audio files and time items must be the same',
        'SAF03': 'All values in property Vocabulary audio files has to be filled',
        'VI01': 'At least one vocabulary audio file have to be set.',
        'VI02': 'Number of parts in Vocabulary intervals have to be equal to sum of times periods defined in Slides property',
        'VI03': 'Vocabulary time intervals are not set'
    };

    presenter.DEFAULT_TTS_PHRASES = {
        PLAY_BUTTON: "Play button",
        PAUSE_BUTTON: "Pause button",
        STOP_BUTTON: "Stop button",
        AUDIO_SPEED_CONTROLLER: "Audio speed controller",
    };

    presenter.CSS_CLASSES = {
        PLAY_BUTTON: "textaudio-play-btn",
        PAUSE_BUTTON: "textaudio-pause-btn",
        PLAY_PAUSE_BUTTON: "textaudio-play-pause-btn",
        STOP_BUTTON: "textaudio-stop-btn",
        AUDIO_SPEED_CONTROLLER: "textaudio-playback-rate",
    };

    presenter.OPERATION_TYPE = {
        INCREASE: 'increase',
        DECREASE: 'decrease'
    };

    function isModuleEnabledDecorator (expectedValue) {
        return function (fn) {
            return function () {
                if (expectedValue === presenter.configuration.isEnabled) {
                    return fn.apply(this, arguments);
                }
            }
        }
    }

    presenter.getErrorObject = function AddonTextAudio_getErrorObject (ec) {
        return {
            isValid: false,
            errorCode: ec
        };
    };

    presenter.getCorrectObject = function AddonTextAudio_getCorrectObject (val) {
        return {
            isValid: true,
            value: val
        };
    };

    presenter.onEventReceived = function AddonTextAudio_onEventReceived (eventName, eventData) {
        if(eventData.value == 'dropdownClicked' && !presenter.audio.playing && !isTemporarilyPaused()) {
            presenter.audio.load();
        }
    };

    function isTemporarilyPaused() {
        return (presenter.audio.paused
            && presenter.audio.readyState > 2
            && presenter.audio.currentTime > 0
            && !presenter.audio.ended
        );
    }

    presenter.showLoadingArea = function AddonTextAudio_showLoadingArea (clickAction) {
        if (clickAction === 'play_vocabulary_interval' && presenter.buzzAudio.length === 0 && !MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.$view.find('div.text-audio-loading-area').css('display','block');
        }
    };

    presenter.hideLoadingArea = function AddonTextAudio_hideLoadingArea () {
        var $loadingArea = presenter.$view.find('div.text-audio-loading-area');
        $loadingArea.css('display','none');
        $loadingArea.remove();
    };

    presenter.transposeDict = function AddonTextAudio_transposeDict (dict) {
        var transp = {};
        for (var key in dict) {
            if (dict.hasOwnProperty(key))
                transp[dict[key]] = key;
        }
        return transp;
    };

    presenter.startTimeMeasurement = function AddonTextAudio_startTimeMeasurement () {
        presenter.isPlaying = true;
        if (!presenter.audioClock) {
            presenter.audioClock = setInterval(function AddonTextAudio_audioClockInterval () { presenter.onTimeUpdateCallback(); }, 1000 / presenter.fps);
        }
    };

    presenter.stopTimeMeasurement = function AddonTextAudio_stopTimeMeasurement () {
        presenter.isPlaying = false;
        clearInterval(presenter.audioClock);
        presenter.audioClock = null;
    };

    presenter.startVocabularyTimeMeasurement = function AddonTextAudio_startVocabularyTimeMeasurement () {
        presenter.isVocabularyPlaying = true;
        if (!presenter.audioVocClock) {
            presenter.audioVocClock = setInterval(function AddonTextAudio_audioVOcClockInterval () { presenter.onTimeUpdateCallback(); }, 1000 / presenter.fps);
        }
    };

    presenter.stopVocabularyTimeMeasurement = function AddonTextAudio_stopVocabularyTimeMeasurement () {
        presenter.isVocabularyPlaying = false;
        clearInterval(presenter.audioVocClock);
        presenter.audioVocClock = null;
        presenter.clearSelection();
    };

    presenter.setPlayerController = function AddonTextAudio_setPlayerController (controller) {
        presenter.playerController = controller;
    };

    presenter.stopSingleAudioPlayer = function AddonTextAudio_stopSingleAudioPlayer () {
        presenter.removeMarkFromItems();

        for (var i=0; i<presenter.buzzAudio.length; i++) {
            presenter.buzzAudio[i].stop();
        }
    };

    presenter.playSingleAudioPlayer = function AddonTextAudio_playSingleAudioPlayer (slideId, elementID) {
        presenter.stopSingleAudioPlayer();

        for (var i=0; i<slideId; i++) {
            elementID += presenter.slidesLengths[i];
        }

        presenter.buzzAudio[elementID].play();
    };

    presenter.markItem = function AddonTextAudio_markItem (selectionId) {
        var selector = 'span[data-selectionid="[NUMBER]"]'.replace('[NUMBER]', selectionId);
        presenter.$view.find('.textaudio-text').find(selector).addClass('active');
    };

    presenter.removeMarkFromItems = function AddonTextAudio_removeMarkFromItems () {
        presenter.$view.find('span.active').removeClass('active');
    };

    presenter.upgradeIsDisabled = function (model) {
        var upgradedModel = {};

        $.extend(true, upgradedModel, model); // Deep copy of model object

        presenter.originalIsDisabledModel = upgradedModel['isDisabled'];
        if (upgradedModel['isDisabled'] === undefined) {
            upgradedModel['isDisabled'] = 'False';
        }

        return upgradedModel;
    };

    presenter.upgradeModel = function AddonTextAudio_upgradeModel (model) {
    	var upgradedModel = presenter.upgradeControls(model);
    	upgradedModel = presenter.upgradeIsDisabled(upgradedModel);
        upgradedModel = presenter.upgradeClickAction(upgradedModel);
        upgradedModel = presenter.upgradeEnablePlaybackSpeedControls(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        return presenter.upgradeSpeechTexts(upgradedModel);
    };

    presenter.upgradeClickAction = function AddonTextAudio_upgradeClickAction (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (model.playPart != undefined || model.playSeparateFiles != undefined || model.separateFiles != undefined) {
            var playPart = ModelValidationUtils.validateBoolean(model.playPart),
                playSeparateFiles = ModelValidationUtils.validateBoolean(model.playSeparateFiles),
                clickAction = presenter.ALLOWED_CLICK_BEHAVIOUR.play_from_the_moment;

            if (playPart && !playSeparateFiles) {
                clickAction = presenter.ALLOWED_CLICK_BEHAVIOUR.play_interval;
            } else if (!playPart && playSeparateFiles) {
                clickAction = presenter.ALLOWED_CLICK_BEHAVIOUR.play_vocabulary_file;
            } else if (playPart && playSeparateFiles) {
                clickAction = presenter.ALLOWED_CLICK_BEHAVIOUR.play_interval_or_vocabulary;
            }

            upgradedModel["clickAction"] = clickAction;
        }

        return upgradedModel;
    };

    presenter.upgradeControls = function AddonTextAudio_upgradeControls (model) {
    	var upgradedModel = {};

        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (typeof upgradedModel['controls'] == "undefined") {
        	if (upgradedModel['defaultControls'] == "True") {
        		upgradedModel['controls'] = "Browser";
        	} else {
        		upgradedModel['controls'] = "None";
        	}
        }

        return upgradedModel;
    };

    presenter.upgradeEnablePlaybackSpeedControls = function AddonTextAudio_upgradeEnablePlaybackSpeedControls (model) {
        var upgradedModel = {};

        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel.hasOwnProperty('enablePlaybackSpeedControls')) {
            upgradedModel['enablePlaybackSpeedControls'] = 'False';
        }

        return upgradedModel;
    };

    presenter.upgradeLangTag = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel["langAttribute"] === undefined) {
            upgradedModel["langAttribute"] =  '';
        }

        return upgradedModel;
    }

    presenter.upgradeSpeechTexts = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["Play"]) {
            upgradedModel["speechTexts"]["Play"] = {Play: ""};
        }
        if (!upgradedModel["speechTexts"]["Pause"]) {
            upgradedModel["speechTexts"]["Pause"] = {Pause: ""};
        }
        if (!upgradedModel["speechTexts"]["Stop"]) {
            upgradedModel["speechTexts"]["Stop"] = {Stop: ""};
        }
        if (!upgradedModel["speechTexts"]["AudioSpeedController"]) {
            upgradedModel["speechTexts"]["AudioSpeedController"] = {AudioSpeedController: ""};
        }

        return upgradedModel;
    }

    presenter.setSpeechTexts = function (speechTexts) {
        presenter.speechTexts = {
            Play: presenter.DEFAULT_TTS_PHRASES.PLAY_BUTTON,
            Pause: presenter.DEFAULT_TTS_PHRASES.PAUSE_BUTTON,
            Stop: presenter.DEFAULT_TTS_PHRASES.STOP_BUTTON,
            AudioSpeedController: presenter.DEFAULT_TTS_PHRASES.AUDIO_SPEED_CONTROLLER,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            Play: TTSUtils.getSpeechTextProperty(
                speechTexts.Play.Play,
                presenter.speechTexts.Play),
            Pause: TTSUtils.getSpeechTextProperty(
                speechTexts.Pause.Pause,
                presenter.speechTexts.Pause),
            Stop: TTSUtils.getSpeechTextProperty(
                speechTexts.Stop.Stop,
                presenter.speechTexts.Stop),
            AudioSpeedController: TTSUtils.getSpeechTextProperty(
                speechTexts.AudioSpeedController.AudioSpeedController,
                presenter.speechTexts.AudioSpeedController),
        };
    };

    presenter.getSlideNumber = function addonTextAudio_getSlideNumber () {
        return presenter.current_slide_data.slide_id + 1;
    };

    presenter.getEventObject = function AddonTextAudio_getEventObject (_item, _value, _score) {
        return {
            source : presenter.addonID,
            item: _item + "",
            value: _value + "",
            score: _score + ""
        };
    };

    presenter.createTimeUpdateEventData = function AddonTextAudio_createTimeUpdateEventData (data) {
        return presenter.getEventObject(presenter.getSlideNumber(), data.currentTime, "");
    };

    presenter.createOnEndEventData = function AddonTextAudio_createOnEndEventData () {
        return presenter.getEventObject("end", "", "");
    };

    presenter.createOnPlayEventData = function AddonTextAudio_createOnPlayEventData () {
        return presenter.getEventObject(presenter.getSlideNumber(), "playing", "");
    };

    presenter.createOnPauseEventData = function AddonTextAudio_createOnPauseEventData () {
        return presenter.getEventObject(presenter.getSlideNumber(), "stop", "");
    };

    presenter.getAudioCurrentTime = function AddonTextAudio_getAudioCurrentTime () {
        return presenter.audio.currentTime;
    };

    presenter.formatTime = function addonTextAudio_formatTime (seconds) {
        function addonTextAudio_addZero(v) { return (v < 10 ? '0' : '') + v }

        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = Math.floor(seconds % 60);

        return addonTextAudio_addZero(minutes) + ":" + addonTextAudio_addZero(remainingSeconds);
    };

    presenter.onLoadedMetadataCallback = function AddonTextAudio_onLoadedMetadataCallback () {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        presenter.displayTimer(0, duration);

        if (presenter.configuration.controls === controls.CUSTOM){
            presenter.$playerTime.html('0:00 / ' + presenter.formatTime(duration))
        }
    };

    presenter.sendEventAndSetCurrentTimeAlreadySent = function AddonTextAudio_sendEventAndSetCurrentTimeAlreadySent (eventData, currentTime) {
        presenter.eventBus.sendEvent('ValueChanged', eventData);
        presenter.currentTimeAlreadySent = currentTime;
    };

    presenter.sendOnEndEvent = function AddonTextAudio_sendOnEndEvent () {
        var eventData = presenter.createOnEndEventData();
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onTimeUpdateSendEventCallback = function AddonTextAudio_onTimeUpdateSendEventCallback () {
        var currentTime = presenter.formatTime(presenter.getAudioCurrentTime());
        if (currentTime !== presenter.currentTimeAlreadySent) { // to prevent duplicated value
            var eventData = presenter.createTimeUpdateEventData({'currentTime' : currentTime});
            presenter.sendEventAndSetCurrentTimeAlreadySent(eventData, currentTime);
        }
    };

    presenter.onTimeUpdateCallback = function AddonTextAudio_onTimeUpdateCallback () {
        var bar_width, currentTime, duration;

        if (presenter.isVocabularyPlaying) {
            if (presenter.vocabulary.getTime() >= presenter.vocabulary_end) {
                presenter.stopVocabularyAudioPlaying();
            }
            return;
        }
        currentTime = presenter.audio.currentTime;
        duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;

        if (presenter.configuration.displayTime) {
            presenter.displayTimer(currentTime, duration);
        }

        if (presenter.configuration.controls === controls.CUSTOM){
            presenter.$playerTime.html(presenter.formatTime(currentTime) + ' / ' + presenter.formatTime(duration));
            bar_width = presenter.$progressWrapper.width() * currentTime / duration;
            presenter.$progressBar.width(Math.round(bar_width));
            presenter.$progressSlider.css('left', Math.round(bar_width));
        }

        if(presenter.configuration.showSlides == "Show all slides"){
            presenter.changeSlideAll(currentTime);
        }else{
            presenter.changeSlide(currentTime);
        }

        if (presenter.stopClicked) {
            presenter.$view.find('span').removeClass('active');
            presenter.hasBeenStarted = false;
            presenter.stopClicked = false;
        }
    };

    presenter.changeVolumeClass = function addonTextAudio_changeVolumeClass (volume_btn, volume_class) {
        if (volume_btn.hasClass(volume_class)) {
            return;
        }
        for (var i=0; i<=3; i++) {
            if (volume_btn.hasClass('textaudio-volume'+i)) {
                volume_btn.removeClass('textaudio-volume'+i);
            }
        }
        volume_btn.addClass(volume_class);
    };

    presenter.onVolumeChanged = function AddonTextAudio_onVolumeChanged () {
        var volume, volume_class;
        if (presenter.configuration.controls === controls.CUSTOM){
            volume = presenter.audio.volume;
            volume_class = '';
            presenter.$volumeControl.css('left', volume * presenter.$volumeLayer.width());
            if (volume < 0.1) {
                volume_class = 'textaudio-volume0';
                if (volume > 0) {
                    presenter.audio.volume = 0;
                }
            } else if (volume < 0.4) {
                volume_class = 'textaudio-volume1';
            } else if (volume < 0.7) {
                volume_class = 'textaudio-volume2';
            } else {
                volume_class = 'textaudio-volume3';
            }
            presenter.changeVolumeClass(presenter.$volumeBtn, volume_class);
        }
    };

    presenter.playPauseCallback = isModuleEnabledDecorator(true)(function AddonTextAudio_playPauseCallback () {
        if (presenter.$playPauseBtn.hasClass(presenter.CSS_CLASSES.PAUSE_BUTTON)) {
            presenter.pause();
        }
        else {
            presenter.play();
        }
    });

    presenter.displayTimer = function AddonTextAudio_displayTimer (current, duration) {
        presenter.$view.find('#currentTime').html(presenter.formatTime(current) + ' / ');
        presenter.$view.find('#durationTime').html(presenter.formatTime(duration));
    };

    presenter.goTo =  function AddonTextAudio_goTo (slide_id, selectionId) {
        if (slide_id >= 0 || selectionId >= 0) {
            var frame2go = presenter.configuration.slides[slide_id].Times[selectionId].start + 0.1;
            presenter.audio.currentTime = frame2go / presenter.fps;
        }
        presenter.play();
    };

    presenter.setPositionAndDimentions = function AddonTextAudio_setPositionAndDimentions (element, slide_id) {
        element.css('position', 'absolute');
        element.css('left', presenter.configuration.slides[slide_id].positionAndDimentions[0]+ 'px');
        element.css('top', presenter.configuration.slides[slide_id].positionAndDimentions[1]+ 'px');
        element.css('width', presenter.configuration.slides[slide_id].positionAndDimentions[2]+ 'px');
        element.css('height', presenter.configuration.slides[slide_id].positionAndDimentions[3]+ 'px');
    };

    presenter.removePositionAndDimentions = function AddonTextAudio_removePositionAndDimentions (element) {
        element.css('position', '');
        element.css('left', '');
        element.css('top', '');
        element.css('width', '');
        element.css('height', '');
    };

    presenter.makeSlide =  function AddonTextAudio_makeSlide (textWrapper, slide_id) {
        slide_id = parseInt(slide_id, 10);
        if (slide_id < 0) {
            textWrapper.html('');
        } else {
            presenter.slidesSpanElements = [];

            if(presenter.configuration.showSlides == "Show all slides" && slide_id >=1){
                var textElement = $('<div class="textaudio-text"></div>');
                textElement.addClass('slide-id-'+slide_id);
                presenter.$view.find('.wrapper-addon-textaudio').append(textElement);
                textWrapper = presenter.$view.find('.slide-id-'+slide_id);
            }
            if(presenter.configuration.showSlides == "Show all slides"){
                textWrapper.append(presenter.configuration.slides[slide_id].html);
                if(presenter.configuration.slides[slide_id].positionAndDimentions != '' && presenter.configuration.slides[slide_id].positionAndDimentions != undefined){
                    presenter.setPositionAndDimentions(textWrapper, slide_id);
                }
            }else{
                textWrapper.html(presenter.configuration.slides[slide_id].html);
                if(presenter.configuration.slides[slide_id].positionAndDimentions != '' && presenter.configuration.slides[slide_id].positionAndDimentions != undefined){
                    presenter.setPositionAndDimentions(textWrapper, slide_id);
                }else{
                    presenter.removePositionAndDimentions(textWrapper);
                }
            }
            textWrapper.attr('data-slideId', slide_id);
            textWrapper.find("span[class^='textelement']").each(function AddonTextAudio_textWrapperTextElementEach () {
                var that = this;
                if(!presenter.configuration.isClickDisabled){
                    presenter.slidesSpanElements.push(that);
                    $(that).on('click', isModuleEnabledDecorator(true)(function addonTextAudio_textWrapperTextElementOnClick (e) {
                        e.stopPropagation();

                        var isVocabularyInterval = presenter.configuration.clickAction == 'play_vocabulary_interval';
                        var isLoaded = presenter.isVocabularyAudioLoaded || presenter.buzzAudio.length !== 0;
                        if (isVocabularyInterval && !MobileUtils.isMobileUserAgent(navigator.userAgent) && !isLoaded) {
                            return false;
                        }

                        presenter.playedByClick = true;
                        presenter.selectionId = parseInt($(this).attr('data-selectionId'), 10);

                        switch (presenter.configuration.clickAction) {
                            case 'play_vocabulary_interval':
                                if (presenter.isVocabularyPlaying || !presenter.isPlaying) {
                                    var intervalId = parseInt($(this).attr('data-intervalId'), 10);
                                    var frame = presenter.configuration.vocabularyIntervals[intervalId];

                                    if (presenter.isPlaying) {
                                        presenter.vocabulary.stop();
                                    }
                                    presenter.clearSelection();
                                    presenter.vocabulary.setTime(frame.start / presenter.fps);
                                    presenter.vocabulary_end = frame.end / presenter.fps;
                                    presenter.vocabulary.play();
                                    presenter.markItem(presenter.selectionId);
                                    break;
                                }
                            case 'play_interval_or_vocabulary':
                            case 'play_vocabulary_file':
                                if (!presenter.isPlaying) {
                                    presenter.pause();
                                    presenter.playSingleAudioPlayer(slide_id, presenter.selectionId);
                                    presenter.markItem(presenter.selectionId);
                                    break;
                                }
                            case 'play_interval':
                            case 'play_from_the_moment':
                                presenter.play();

                                if ($(this).hasClass("tmp-active")) {
                                    $(this).removeClass("tmp-active");
                                    $(this).addClass("active");
                                }

                                if (MobileUtils.isSafariMobile(navigator.userAgent)) {
                                    function AddonTextAudio_fun() {
                                        if (slide_id >= 0 || presenter.selectionId >= 0) {
                                            var frame2go = presenter.configuration.slides[slide_id].Times[presenter.selectionId].start;
                                            presenter.audio.currentTime = frame2go / presenter.fps;
                                        }
                                        presenter.audio.removeEventListener("playing", AddonTextAudio_fun, false);
                                    }
                                    if (presenter.hasBeenStarted) {
                                        presenter.pause();
                                        presenter.goTo(slide_id, presenter.selectionId);
                                    } else {
                                        presenter.audio.addEventListener("playing", AddonTextAudio_fun, false);
                                    }
                                } else {
                                    presenter.goTo(slide_id, presenter.selectionId);
                                }
                        }
                    }));
                }
            });

        }
    };

    presenter.highlightSelection = function AddonTextAudio_highlightSelection (textWrapper, selection_id) {
        textWrapper.find('span').each(function () {
            $(this).removeClass('active');
        });
        if (selection_id >= 0) {
            textWrapper.find('span.textelement' + selection_id).addClass('active');
        }
    };

    presenter.areSlidesEqual = function addonTextAudio_areSlidesEqual (slide1, slide2) {
        return slide1.slide_id == slide2.slide_id && slide1.selection_id == slide2.selection_id;
    };

    presenter.highlightSelectionAll = function AddonTextAudio_highlightSelectionAll (textWrapper, selection_id) {
        presenter.$view.find('.textaudio-text').find('span').each(function () {
            $(this).removeClass('active');
        });

        if(presenter.currentSlide >= 1){
            textWrapper = presenter.$view.find('.slide-id-'+presenter.currentSlide);
        }

        if (selection_id >= 0) {
            textWrapper.find('span.textelement' + selection_id).addClass('active');
        }
    };

    presenter.changeSlideAll = function AddonTextAudio_changeSlideAll (currentTime) {
        currentTime = Math.round(currentTime * presenter.fps);
        var frames_array = presenter.configuration.frames;
        var isCurrentTimeInRange = currentTime < frames_array.length;
        var slide_data = {
            slide_id: isCurrentTimeInRange ? frames_array[currentTime].slide_id : -1,
            selection_id: isCurrentTimeInRange ? frames_array[currentTime].selection_id : 0
        };
        presenter.currentSlide = slide_data.slide_id;
        if (!presenter.hasBeenStarted) {
            slide_data.selection_id = -1;
        }
        var difference = slide_data.selection_id - presenter.previousSelectionId;
        if (difference > 1 && !presenter.playedByClick && presenter.previousSelectionId != -1) {
            slide_data.selection_id -= difference - 1;
        }
        presenter.previousSelectionId = slide_data.selection_id;
        presenter.changeSlideFromDataAll(slide_data);
    };

    presenter.changeSlideFromDataAllPreview = function AddonTextAudio_changeSlideFromDataAllPreview (slide_data) {
        const textWrapper = presenter.$view.find(".slide-id-0");
        if (!presenter.areSlidesEqual(slide_data, presenter.current_slide_data)) {
            const currentSelId = presenter.current_slide_data.selection_id;
            if (presenter.configuration.playPart && currentSelId !== -1 && presenter.selectionId === currentSelId) {
                presenter.pause();
            }
            if (slide_data.slide_id !== presenter.current_slide_data.slide_id && !presenter.slidesMade) {
                presenter.makeSlide(textWrapper, slide_data.slide_id);
            }
            presenter.current_slide_data = slide_data;
            presenter.playedByClick = false;
        }
    };

    presenter.changeSlideFromDataAll = function AddonTextAudio_changeSlideFromDataAll (slide_data) {
        var textWrapper = presenter.$view.find(".slide-id-0");
        if (!presenter.areSlidesEqual(slide_data, presenter.current_slide_data)) {
            var blockHighlight = false;
            var currentSelId = presenter.current_slide_data.selection_id;
            if (presenter.configuration.playPart && currentSelId !== -1 && presenter.selectionId === currentSelId) {
                presenter.pause();
                blockHighlight = true;
            }
            if (slide_data.slide_id != presenter.current_slide_data.slide_id && !presenter.slidesMade) {
                presenter.makeSlide(textWrapper, slide_data.slide_id);
            }
            presenter.highlightSelectionAll(textWrapper, slide_data.selection_id);

            if (blockHighlight) {
                textWrapper.find('span').each(function AddonTextAudio_textWrapperSpanEach2 () {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        $(this).addClass("tmp-active");
                    }
                });
            }
            presenter.current_slide_data = slide_data;
            presenter.playedByClick = false;
        } else {
            if (presenter.$view.find('.active').length === 0) {
                presenter.highlightSelectionAll(textWrapper, slide_data.selection_id);
            }
        }
        presenter.addHoverHandlers();
    };

    presenter.changeSlideFromData = function AddonTextAudio_changeSlideFromData (slide_data) {
        var textWrapper = presenter.$view.find(".wrapper-addon-textaudio .textaudio-text");

        if (!presenter.areSlidesEqual(slide_data, presenter.current_slide_data)) {
            var blockHighlight = false;

            var currentSelId = presenter.current_slide_data.selection_id;
            if (presenter.configuration.playPart && currentSelId !== -1 && presenter.selectionId === currentSelId) {
                presenter.pause();
                blockHighlight = true;
            }

            if (slide_data.slide_id != presenter.current_slide_data.slide_id && slide_data.slide_id !== -2) {
                presenter.makeSlide(textWrapper, slide_data.slide_id);
                presenter.actualizeKeyboardControllerElements();
            }
            presenter.highlightSelection(textWrapper, slide_data.selection_id);

            if (blockHighlight) {
                textWrapper.find('span').each(function AddonTextAudio_textWrapperSpanEach3 () {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        $(this).addClass("tmp-active");
                    }
                });
            }

            presenter.current_slide_data = slide_data;
            presenter.playedByClick = false;
        } else {
            if (presenter.$view.find('.active').length === 0) {
                presenter.highlightSelection(textWrapper, slide_data.selection_id);
            }
        }
        presenter.addHoverHandlers();
    };

    presenter.addHoverHandlers = function AddonTextAudio_addHoverHandlers () {
        var textElements = presenter.$view.find("span[class^='textelement']");
        textElements.on('mouseover', function(){
            var index = this.getAttribute('data-selectionid');
            presenter.$view.find("span.textelement" + index).addClass("hover");
        });
        textElements.on('mouseout', function(){
            var index = this.getAttribute('data-selectionid');
            presenter.$view.find("span.textelement" + index).removeClass("hover");
        });
    }

    presenter.changeSlide = function AddonTextAudio_changeSlide (currentTime) {
        currentTime = Math.round(currentTime * presenter.fps);

        var frames_array = presenter.configuration.frames;
        var isCurrentTimeInRange = currentTime < frames_array.length;

        var slide_data = {
            slide_id: isCurrentTimeInRange ? frames_array[currentTime].slide_id : -1,
            selection_id: isCurrentTimeInRange ? frames_array[currentTime].selection_id : 0
        };

        if (isCurrentTimeInRange) {
            slide_data.slide_id = frames_array[currentTime].slide_id === -1 ? -2 : slide_data.slide_id;
        }

        if (!presenter.hasBeenStarted) {
            slide_data.selection_id = -1;
        }

        var difference = slide_data.selection_id - presenter.previousSelectionId;
        if (difference > 1 && !presenter.playedByClick && presenter.previousSelectionId != -1) {
            slide_data.selection_id -= difference - 1;
        }

        presenter.previousSelectionId = slide_data.selection_id;
        presenter.changeSlideFromData(slide_data);
    };

    presenter.progressMouseDownCallback = isModuleEnabledDecorator(true)(function AddonTextAudio_progressMouseDownCallback (event) {
        if ($(event.target).hasClass('textaudio-slider-btn')) {
            presenter.mouseData.oldPosition = event.pageX;
            presenter.mouseData.isMouseDragged = true;
            presenter.mouseData.playedBeforeDragging = !presenter.audio.paused;
            if (!presenter.audio.paused) {
                presenter.pause();
            }
        }
    });

    presenter.progressMouseUpCallback = function AddonTextAudio_progressMouseUpCallback () {
        var duration;
        if (presenter.mouseData.isMouseDragged) {
            duration = presenter.audio.duration;
            duration = isNaN(duration) ? 0 : duration;
            presenter.audio.currentTime = duration * presenter.$progressBar.width() / presenter.$progressWrapper.width();
            presenter.mouseData.isMouseDragged = false;
            presenter.mouseData.oldPosition = 0;
            if (presenter.mouseData.playedBeforeDragging) {
                presenter.play();
            }
        }
    };

    presenter.progressMouseMoveCallback = isModuleEnabledDecorator(true)(function AddonTextAudio_progressMouseMoveCallback (event) {
        var relativeDistance, barWidth, oldWidth;
        if (presenter.mouseData.isMouseDragged){
            relativeDistance = event.pageX - presenter.mouseData.oldPosition;
            barWidth = 0;
            oldWidth = presenter.$progressBar.width();
            if (oldWidth + relativeDistance < presenter.$progressWrapper.width()) {
                barWidth = oldWidth + relativeDistance;
            }
            else {
                barWidth = presenter.$progressWrapper.width();
            }
            presenter.$progressBar.width(barWidth);
            presenter.$progressSlider.css('left',Math.round(barWidth));
            presenter.mouseData.oldPosition = event.pageX;
        }
    });

    presenter.isMoreThanOneFingerGesture = function addonTextAudio_isMoreThanOneFingerGesture (event) {
        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];
        if (event.hasOwnProperty('touches'))
            touchPoints = event.touches;
        return touchPoints.length> 1;
    };

    presenter.progressTouchStartCallback = isModuleEnabledDecorator(true)(function addonTextAudio_progressTouchStartCallback (event) {
        if (presenter.isMoreThanOneFingerGesture(event)) return;
        var touch, touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        if (event.hasOwnProperty('touches'))
            touch = event.touches[0];
        else
            touch = touchPoints[0];
        presenter.progressMouseDownCallback(touch);
    });

    presenter.progressTouchEndCallback =  function AddonTextAudio_progressTouchEndCallback () {
        presenter.progressMouseUpCallback();
    };

    presenter.progressTouchMoveCallback = isModuleEnabledDecorator(true)(function AddonTextAudio_progressTouchMoveCallback (event) {
        if (presenter.isMoreThanOneFingerGesture(event)) return;

        var touch;
        var touchPoints = (typeof event.changedTouches != 'undefined') ? event.changedTouches : [event];

        if (event.hasOwnProperty('touches'))
            touch = event.touches[0];
        else
            touch = touchPoints[0];
        presenter.progressMouseMoveCallback(touch);
    });

    presenter.attachProgressListeners = function AddonTextAudio_attachProgressListeners () {
        presenter.isMobileDevice = MobileUtils.isMobileUserAgent(navigator.userAgent) || MobileUtils.isEventSupported('touchend');
        if (MobileUtils.isWindowsMobile(window.navigator)) {
            presenter.$progressWrapper[0].addEventListener("MSPointerDown", presenter.progressTouchStartCallback , false);
            presenter.$progressWrapper[0].addEventListener("MSPointerUp", presenter.progressTouchEndCallback, false);
            presenter.$progressWrapper[0].addEventListener("MSPointerMove", presenter.progressTouchMoveCallback, false);
        }
        else if (presenter.isMobileDevice) {
            presenter.$progressWrapper[0].ontouchstart=presenter.progressTouchStartCallback ;
            presenter.$customPlayer[0].ontouchend=presenter.progressTouchEndCallback;
            presenter.$progressWrapper[0].ontouchmove=presenter.progressTouchMoveCallback;
        }
        else {
            presenter.$progressWrapper.on('mousedown', presenter.progressMouseDownCallback);
            presenter.$progressWrapper.on('mouseup', presenter.progressMouseUpCallback);
            presenter.$progressWrapper.on('mousemove', presenter.progressMouseMoveCallback);
        }
    };

    presenter.toogleVolumeLayer = isModuleEnabledDecorator(true)(function AddonTextAudio_toogleVolumeLayer (){
        presenter.onVolumeChanged();
        presenter.$volumeLayer.toggle();
        presenter.$playerTime.toggle();
    });

    presenter.createHtmlPlayer = function AddonTextAudio_createHtmlPlayer () {
        var $volumeControlBackground;

        presenter.$customPlayer = $('<div>').
            addClass('textaudioplayer');

        presenter.$playPauseBtn = $('<div>').
            addClass(presenter.CSS_CLASSES.PLAY_PAUSE_BUTTON).
            addClass(presenter.CSS_CLASSES.PLAY_BUTTON).
            on('click', presenter.playPauseCallback);

        presenter.$customPlayer.append(presenter.$playPauseBtn);

        presenter.$stopBtn = $('<div>').
            addClass(presenter.CSS_CLASSES.STOP_BUTTON).
            on('click', presenter.stop);

        presenter.$customPlayer.append(presenter.$stopBtn);

        presenter.$progressWrapper = $('<div>').
            addClass('textaudio-progress-bar');

        presenter.$progressBar = $('<div>').
            addClass('textaudio-bar');

        presenter.$progressSlider = $('<div>').
            addClass('textaudio-slider-btn');

        presenter.attachProgressListeners();

        presenter.$progressWrapper.
            append(presenter.$progressBar).
            append(presenter.$progressSlider);

        presenter.$customPlayer.append(presenter.$progressWrapper);

        if (!MobileUtils.isSafariMobile(navigator.userAgent)) {
            presenter.$volumeBtn = $('<div>').
                addClass('textaudio-volume-btn').
                on('click', presenter.toogleVolumeLayer);

            presenter.$volumeLayer = $('<div>').
                addClass('textaudio-volume-layer').
                on('click', presenter.volumeLayerOnClick).
                hide();

            $volumeControlBackground = $('<div>').
                addClass('textaudio-volume-control-background');

            presenter.$volumeControl = $('<div>').
                addClass('textaudio-volume-control');

            presenter.$volumeLayer.
                append($volumeControlBackground).
                append(presenter.$volumeControl);

            presenter.$customPlayer.
                append(presenter.$volumeBtn).
                append(presenter.$volumeLayer);
        }

        if (presenter.configuration.enablePlaybackSpeedControls) {
            presenter.$playbackRateControls = $('<div>').
                addClass(presenter.CSS_CLASSES.AUDIO_SPEED_CONTROLLER).
                append(createPlaybackOptions());
            displayPlaybackOptions();
            presenter.$customPlayer.append(presenter.$playbackRateControls);
        }

        presenter.$playerTime = $('<div>').
            addClass('textaudio-player-time').
            text('00:00 / --:--');

        presenter.$customPlayer.append(presenter.$playerTime);

        presenter.$audioWrapper.append(presenter.$customPlayer);
    };

    function createPlaybackOptions() {
        var $select = $('<select>');
        var playingSpeedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2];
        
        playingSpeedOptions.forEach(playingOption => {
            var $option = $('<option>');
            $option.text(playingOption);
            $option.attr('value', playingOption);
            if (playingOption === 1.0) {
                $option.attr('selected', 'selected');
            }
            $select.append($option);
        });

        $select.on('change', function () {
            presenter.setPlaybackRate($select.val());
        });
        
        return $select;
    }

    function displayPlaybackOptions() {
        var playingSpeedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2];
        if (presenter.$playbackRateControls) {
            var $selected = presenter.$playbackRateControls.find('select');
            if ($selected.val() === presenter.playbackRate) {
                if (playingSpeedOptions.indexOf(presenter.playbackRate) !== -1) {
                    $selected.find('.custom-option').remove();
                }
                return;
            }
            $selected.find('.custom-option').remove();
            if (playingSpeedOptions.indexOf(presenter.playbackRate) !== -1) {
                $selected.val(presenter.playbackRate);
            } else {
                var $customOption = $('<option>');
                $customOption.text(presenter.playbackRate);
                $customOption.attr('value', presenter.playbackRate);
                $customOption.addClass('custom-option');
                $selected.append($customOption);
                $selected.val(presenter.playbackRate);
            }
        }
    }

    presenter.volumeLayerOnClick = isModuleEnabledDecorator(true)(function AddonTextAudio_volumeLayerOnClick (e) {
        presenter.audio.volume = e.offsetX / $(this).width();
    });

    presenter.createView = function AddonTextAudio_createView (view, model, isPreview) {
        presenter.$view.bind('click', function (event) {
            event.stopPropagation();
        });
        presenter.originalFile.mp3 = model.mp3;
        presenter.originalFile.ogg = model.ogg;

        presenter.audio = document.createElement('audio');
        presenter.$audioWrapper = presenter.$view.find(".wrapper-addon-textaudio .textaudio-player");

        if (presenter.configuration.controls === controls.BROWSER) {
            presenter.audio.setAttribute("controls", "controls");
            presenter.audio.setAttribute("preload", "auto");
        } else if (presenter.configuration.controls === controls.CUSTOM) {
            presenter.createHtmlPlayer();
        }

        var currentTime = document.createElement("span");
        var durationTime = document.createElement("span");
        $(currentTime).attr("id", "currentTime").addClass('current-time');
        $(durationTime).attr("id", "durationTime").addClass('duration-time');

        presenter.$audioWrapper.append(presenter.audio);
        if (presenter.configuration.displayTime) {
            presenter.$audioWrapper.append(currentTime).append(durationTime);
            presenter.audio.addEventListener('loadeddata', presenter.onLoadedMetadataCallback, false);
        }

        if (isPreview) {
            presenter.handleChangingSlidesForPreview();
        } else {
            presenter.handleChangingSlides();
        }

        presenter.slidesMade = true;

        if (!isPreview) {
            presenter.audio.addEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
            presenter.audio.addEventListener('playing', presenter.onAudioPlaying, false);
            presenter.audio.addEventListener('play', presenter.onAudioPlay, false);
            presenter.audio.addEventListener('pause', presenter.onAudioPause, false);

            presenter.configuration.isEnabled = true;   // At start addon is always enabled, so we need to reset flag and set correct value.
            if (presenter.isEnabledByDefault) {
                presenter.enable();
            } else {
                presenter.disable();
            }
        }

        Object.defineProperty(presenter.audio, 'playing', {
            get: function () {
                return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            }
        });
    };

    presenter.handleChangingSlidesForPreview = function () {
        if (presenter.configuration.showSlides === "Show all slides") {
            const frames_array = filterFrames(presenter.configuration.frames).slice(0, 2);
            for (let i = 0; i < frames_array.length; i++) {
                if (frames_array[i].slide_id >= 0) {
                    const slide_data = {
                        slide_id: frames_array[i].slide_id,
                        selection_id: frames_array[i].selection_id
                    };
                    presenter.changeSlideFromDataAllPreview(slide_data);
                }
            }
            presenter.$view.find('.textaudio-text span').removeClass('active');
        } else {
            presenter.changeSlide(presenter.getFirstSlideStartTime());
        }
    }

    presenter.handleChangingSlides = function () {
        if (presenter.configuration.showSlides === "Show all slides") {
            const frames_array = filterFrames(presenter.configuration.frames);
            for (let i = 0; i < frames_array.length; i++) {
                if (frames_array[i].slide_id >= 0) {
                    const slide_data = {
                        slide_id: frames_array[i].slide_id,
                        selection_id: frames_array[i].selection_id
                    };
                    presenter.changeSlideFromDataAll(slide_data);
                }
            }
            presenter.$view.find('.textaudio-text span').removeClass('active');
        } else {
            presenter.changeSlide(presenter.getFirstSlideStartTime());
        }
    }

    presenter.getFirstSlideStartTime = function () {
        return presenter.configuration.slides[0].Times[0].start;
    }

    function filterFrames(frames) {
        const filteredFrames = [];
        let lastAddedElement = null;
        frames.forEach((frame) => {
            if (!filteredFrames.length) {
                filteredFrames.push({
                    slide_id: frame.slide_id,
                    selection_id: frame.selection_id
                })
                lastAddedElement = {
                    slide_id: frame.slide_id,
                    selection_id: frame.selection_id
                }
            }
            if (lastAddedElement.slide_id !== frame.slide_id && lastAddedElement.selection_id !== frame.selection_id) {
                filteredFrames.push({
                    slide_id: frame.slide_id,
                    selection_id: frame.selection_id
                })
                lastAddedElement = {
                    slide_id: frame.slide_id,
                    selection_id: frame.selection_id
                }
            }
        })

        return filteredFrames;
    }

    presenter.onAudioPlaying = function AddonTextAudio_onAudioPlaying () {
        presenter.hasBeenStarted = true;
    };

    presenter.onAudioPlay =  function AddonTextAudio_onAudioPlay () {
        if (presenter.isVocabularyPlaying) {
            presenter.vocabulary.pause();
        }
        if (!presenter.playedByClick) {
            presenter.selectionId = undefined;
        }
        presenter.eventBus.sendEvent('ValueChanged', presenter.createOnPlayEventData());
        presenter.startTimeMeasurement();
    };

    presenter.onAudioPause = function AddonTextAudio_onAudioPause () {
        presenter.stopTimeMeasurement();
        presenter.eventBus.sendEvent('ValueChanged', presenter.createOnPauseEventData())
    };

    presenter.attachEventListeners = function AddonTextAudio_attachEventListeners () {
        presenter.audio.addEventListener('loadeddata', presenter.onLoadedMetadataCallback, false);
        presenter.audio.addEventListener('timeupdate', presenter.onTimeUpdateCallback, false);
        presenter.audio.addEventListener('volumechange', presenter.onVolumeChanged, false);
        presenter.audio.addEventListener('ended', presenter.onEnded, false);
        presenter.audio.addEventListener('click', presenter.onAudioClick, false);
    };

    presenter.onEnded = function AddonTextAudio_onEnded () {
        if (presenter.configuration.enableLoop) {
            presenter.currentTime = 0;
            presenter.play();
        } else {
            presenter.executeOnEndEvent();
            presenter.sendOnEndEvent();
            presenter.stop();
            presenter.$view.find(".wrapper-addon-textaudio .textaudio-text :last-child").removeClass('active');
        }

        presenter.playedByClick = false;
    };

    presenter.onAudioClick = function AddonTextAudio_onAudioClick (event) {
        event.stopPropagation();
    };

    presenter.canPlayMp3 = function () {
        return presenter.audio.canPlayType && "" != presenter.audio.canPlayType('audio/mpeg');
    };

    presenter.canPlayOgg = function () {
        return presenter.audio.canPlayType && "" != presenter.audio.canPlayType('audio/ogg; codecs="vorbis"');
    };

    presenter.setAudioSrc = function () {
        var canPlayMp3 = presenter.canPlayMp3();
        var canPlayOgg = presenter.canPlayOgg();

        if (canPlayMp3) {
            presenter.audio.setAttribute("src", presenter.originalFile .mp3);
        } else if (canPlayOgg) {
            presenter.audio.setAttribute("src", presenter.originalFile .ogg);
        }
    };

    presenter.loadFiles = function AddonTextAudio_loadFiles () {
        if (presenter.audio.canPlayType) {
            presenter.setAudioSrc();
            if (presenter.configuration.clickAction == 'play_vocabulary_interval') {
                presenter.vocabulary = new buzz.sound([
                    presenter.configuration.vocabulary_mp3,
                    presenter.configuration.vocabulary_ogg
                ]);
                presenter.vocabulary.bind('canplaythrough', function AddonTextAudio_vocabularyCanPlayThrough () {
                    presenter.vocabulary.unbind('canplaythrough');
                    presenter.isVocabularyAudioLoaded = true;
                    presenter.hideLoadingArea();
                }, false);
                presenter.vocabulary.bind('ended', function AddonTextAudio_vocabularyEnded () {
                    presenter.clearSelection();
                });
                presenter.vocabulary.bind('play', function AddonTextAudio_vocabularyPlay () {
                    if (!presenter.playedByClick) {
                        presenter.selectionId = undefined;
                    }
                    presenter.startVocabularyTimeMeasurement();
                }, false);
                presenter.vocabulary.bind('pause', function AddonTextAudio_vocabularyPause () {
                    presenter.stopVocabularyTimeMeasurement();
                }, false);
            }
        } else {
            var infoSpan = document.createElement('span');
            infoSpan.innerHTML = "Your browser doesn't support audio.";
            presenter.audio.appendChild(infoSpan);
        }

        presenter.audio.load();
        presenter.attachEventListeners();
    };

    presenter.createSeparateAudioFiles = function AddonTextAudio_createSeparateAudioFiles (audioFiles) {
        for (var i=0; i<audioFiles.length; i++) {
            var localBuzz = new buzz.sound([
                audioFiles[i].mp3,
                audioFiles[i].ogg
            ]);

            localBuzz.bind('ended', function AddonTextAudio_localBuzzEnded () {
                presenter.clearSelection();
            });

            presenter.buzzAudio.push(localBuzz);
        }
    };

    presenter.run = function AddonTextAudio_run (view, model) {
        presenter.addonID = model.ID;
        presenter.initialize(view, model, false);

        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.isLoaded = false;
        if (presenter.configuration.isValid) {
            presenter.audio.addEventListener("loadeddata", presenter.onAudioLoadedData);
        }

        presenter.eventBus.addEventListener('ValueChanged', this);
    };

    presenter.onAudioLoadedData = function AddonTextAudio_onAudioLoadedData () {
        presenter.isLoaded = true;
    };

    presenter.destroy = function AddonTextAudio_destroy (event) {
        if (event.target !== presenter.view) {
            return;
        }

        if (presenter.$customPlayer) {
            presenter.$customPlayer[0].ontouchend = null;
            presenter.$customPlayer = null;
        }
        if (presenter.$playPauseBtn) {
            presenter.$playPauseBtn.off();
            presenter.$playPauseBtn = null;
        }
        if (presenter.$stopBtn) {
            presenter.$stopBtn.off();
            presenter.$stopBtn = null;
        }
        if (presenter.$progressWrapper) {
            presenter.$progressWrapper[0].removeEventListener("MSPointerDown", presenter.progressTouchStartCallback , false);
            presenter.$progressWrapper[0].removeEventListener("MSPointerUp", presenter.progressTouchEndCallback, false);
            presenter.$progressWrapper[0].removeEventListener("MSPointerMove", presenter.progressTouchMoveCallback, false);
            presenter.$progressWrapper[0].ontouchstart = null;
            presenter.$progressWrapper[0].ontouchmove = null;
            presenter.$progressWrapper.off();
            presenter.$progressWrapper = null;
        }
        if (presenter.$progressBar) {
            presenter.$progressBar = null;
        }
        if (presenter.$progressSlider) {
            presenter.$progressSlider = null;
        }
        if (presenter.$volumeBtn) {
            presenter.$volumeBtn.off();
            presenter.$volumeBtn = null;
        }
        if (presenter.$volumeLayer) {
            presenter.$volumeLayer.off();
            presenter.$volumeLayer = null;
        }
        if (presenter.$volumeControl) {
            presenter.$volumeControl = null;
        }
        if (presenter.$playerTime) {
            presenter.$playerTime = null;
        }

        if (presenter.audio) {
            presenter.audio.pause();
            presenter.audio.removeEventListener('loadeddata', presenter.onLoadedMetadataCallback, false);
            presenter.audio.removeEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
            presenter.audio.removeEventListener('playing', presenter.onAudioPlaying, false);
            presenter.audio.removeEventListener('play', presenter.onAudioPlay, false);
            presenter.audio.removeEventListener('pause', presenter.onAudioPause, false);
            presenter.audio.removeEventListener('timeupdate', presenter.onTimeUpdateCallback, false);
            presenter.audio.removeEventListener('volumechange', presenter.onVolumeChanged, false);
            presenter.audio.removeEventListener('ended', presenter.onEnded, false);
            presenter.audio.removeEventListener('click', presenter.onAudioClick, false);
            presenter.audio.removeEventListener("loadeddata", presenter.onAudioLoadedData);
            presenter.audio.removeEventListener("loadeddata", presenter.stopAudioLoadedData);
            presenter.audio.removeEventListener("loadeddata", presenter.playAudioLoadedData);
            presenter.audio.setAttribute('src', '');
            presenter.audio.removeAttribute('src');
            presenter.audio.load();
        }

        if (presenter.vocabulary) {
            presenter.vocabulary.unbind('ended play pause canplaythrough');
            presenter.stopVocabularyAudioPlaying();
            presenter.vocabulary = null;
        }

        presenter.buzzAudio.forEach(function (singleBuzzAudio, index) {
            singleBuzzAudio.unbind('ended play pause canplaythrough');
            presenter.buzzAudio[index] = null;
        });

        presenter.slidesSpanElements.forEach(function (spanElement, index) {
            $(spanElement).off();
            presenter.slidesSpanElements[index] = null;
        });

        try {
            clearInterval(presenter.audioClock);
        } catch (e) {}

        try {
            clearInterval(presenter.audioVocClock);
        } catch (e) {}

        presenter.$audioWrapper = null;
        presenter.originalFile = null;
        presenter.vocabularyFile = null;
        presenter.eventBus = null;
        presenter.currentTimeAlreadySent = null;
        presenter.buzzAudio = null;
        presenter.audio = null;
        presenter.current_slide_data = null;
        presenter.playerController = null;
        presenter.mouseData = null;
        presenter.audioClock = null;
        presenter.audioVocClock = null;
        presenter.configuration = null;
        presenter.slidesSpanElements = null;
        presenter.$view.unbind();
        presenter.view = null;
        presenter.$view = null;
    };

    presenter.stopVocabularyAudioPlaying = function AddonTextAudio_stopVocabularyAudioPlaying() {
        presenter.vocabulary.setTime(0);
        presenter.vocabulary.pause();
    };

    presenter.createPreview = function AddonTextAudio_createPreview (view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function AddonTextAudio_initialize (view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.isPreview = isPreview;

        buzz.defaults.preload = 'auto';
        buzz.defaults.autoplay = false;
        buzz.defaults.loop = false;

        presenter.slidesSpanElements = [];

        var upgradedModel = presenter.upgradeModel(model);
        presenter.setSpeechTexts(upgradedModel["speechTexts"]);
        presenter.configuration = presenter.validateModel(upgradedModel);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            delete presenter.play;
            delete presenter.stop;
            delete presenter.pause;
            delete presenter.show;
            delete presenter.hide;
            delete presenter.executeCommand;
            return;
        }

        presenter.isVisibleByDefault = presenter.configuration.isVisible;
        presenter.isEnabledByDefault = presenter.configuration.isEnabled;

        presenter.createView(view, upgradedModel, isPreview);

        if (!isPreview) {
            presenter.loadFiles();

            if (presenter.configuration.playSeparateFiles) {
                presenter.createSeparateAudioFiles(presenter.configuration.separateFiles);
            }

            presenter.showLoadingArea(presenter.configuration.clickAction);

            presenter.buildKeyboardController();
        }

        if (presenter.addonID != null) {
            MutationObserverService.createDestroyObserver(presenter.addonID, presenter.destroy, presenter.view);
            MutationObserverService.setObserver();
        }
    };

    presenter.roundTimeEntry = function addonTextAudio_roundTimeEntry (time_entry) {
        var time = time_entry.replace(',', '.').split(':'),
            minutes = time[0],
            seconds = parseFloat(time[1]).toFixed(1).split('.');

        if (seconds[0].length < 2) {
            seconds[0] = '0' + seconds[0];
        }

        return minutes + ':' + seconds[0] + '.' + seconds[1];
    };

    presenter.toFrames = function addonTextAudio_toFrames (time_entry) {
        time_entry =  presenter.roundTimeEntry(time_entry);

        var entry = time_entry.split(':');
        var minutes = parseInt(entry[0], 10);
        var seconds = 0;
        var decyseconds = 0;
        if (entry[1].indexOf('.') > -1) {
            var seconds_with_decyseconds = entry[1].split('.');
            seconds = parseInt(seconds_with_decyseconds[0], 10);
            decyseconds = parseInt(seconds_with_decyseconds[1], 10);
            if (decyseconds.toString().length > 1) {
                decyseconds = parseInt(decyseconds.toString().substr(0,1), 10);
            }
        } else {
            seconds = parseInt(entry[1], 10);
        }
        minutes = isNaN(minutes) ? 0 : minutes;
        seconds = isNaN(seconds) ? 0 : seconds;
        decyseconds = isNaN(decyseconds) ? 0 : decyseconds;

        return ((minutes * 60 + seconds) * presenter.fps) + decyseconds;
    };

    presenter.timeEntry = function AddonTextAudio_timeEntry (slide_time, fromSrtFile) {
        var entry = slide_time.split('-');
        if (entry.length != 2) {
            return {
                errorCode: 'M03',
                errorData: slide_time
            }
        }

        if (fromSrtFile) {
            return {
                start: Math.round(SrtParser.timeColonSeparatedToMs(entry[0]) / 100),
                end: Math.round(SrtParser.timeColonSeparatedToMs(entry[1]) / 100)
            };
        }

        return {
            start: presenter.toFrames(entry[0]),
            end: presenter.toFrames(entry[1])
        };
    };

    presenter.createNewSpan = function addonTextAudio_createNewSpan(n1, n2, text) {
        var $span = $('<span></span>').
            addClass('textelement' + n1).
            attr('data-selectionid', n1).
            attr('data-intervalid', n2).
            html(text);
        return $span.prop("outerHTML");
    };

    presenter.parseSlideText = function addonTextAudio_parseSlideText (text) {
        var elemNumber = 0;
        var resultHTML = "";

        HTMLParser(text, {
            start: function (tag, attrs, unary) {
                resultHTML += "<" + tag;
                for (var i=0; i<attrs.length; i++) {
                    resultHTML += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                }
                resultHTML += (unary ? "/" : "") + ">";
            },
            end: function (tag) {
                resultHTML += "</" + tag + ">";
            },
            chars: function (text) {
                var localParts = text.split('||');

                for (var i=0; i<localParts.length; i++) {
                    if (localParts[i] !== '') {
                        resultHTML += presenter.createNewSpan(elemNumber, presenter.globalIntervalNumber, localParts[i]);
                    }

                    if (i !== localParts.length-1) {
                        elemNumber++;
                        presenter.globalIntervalNumber++;
                    }
                }
            }
        });

        return resultHTML;
    };

    presenter.handleSlides = function AddonTextAudio_handleSlides (slides) {
        const newSlides = [];

        for (var i=0; i<slides.length; i++) {
            let slide = $.extend({}, slides[i]);
            if (!slide.fileSRT) {
                slide.fromFile = false;
                newSlides.push(slide);
                continue;
            }

            let response = presenter.downloadSRTSync(slide.fileSRT);
            if (response.error) {
                console.error("Error while downloading SRT file. Response code is: " + response.responseCode);
                return {
                    isValid: false,
                    errorCode: 'M06'
                };
            }

            let parsed = SrtParser.parse(response.text, true);
            let cropTime = SrtParser.timeColonSeparatedToMs(slide.cropTime);
            if (cropTime === 0 && slide.cropTime.trim()) {
                return {
                    isValid: false,
                    errorCode: 'M07'
                };
            }
            if (cropTime !== 0) {
                parsed = SrtParser.cropTimes(parsed, cropTime);
            }
            let formattedData = presenter.formatData(parsed);
            slide.Text = formattedData.text;
            slide.Times = formattedData.time;
            slide.fromFile = true;
            newSlides.push(slide);
        }

        return presenter.validateSlides(newSlides);
    };

    presenter.formatData = function AddonTextAudio_formatData (data) {
        let text = "";
        let time = "";

        data.forEach((d) => {
           text += d.text + "||<br>";
           time += `${SrtParser.msToTimeColonSeparated(d.startTime)}-${SrtParser.msToTimeColonSeparated(d.endTime)}\n`
        });

        text = text.replace(/\|\|<br>$/gm, "");
        time = time.replace(/\n$/gm, "");
        return {text, time};
    };

    presenter.validateSlides = function AddonTextAudio_validateSlides (slides) {
        var validationResult = {
            isValid: false,
            value: [{
                Text: [''],
                Times: [{start: 0, end: 0}],
                PosAndDim: ['']
            }],
            errorCode: false
        };
        var frames = [],
            interval = 0;
        for (var i=0; i<slides.length; i++) {
            var slide = slides[i];
            var slide_texts = slide.Text.split('||');
            var parsed_slide_texts = presenter.parseSlideText(slide.Text);
            var slide_times = slide.Times.split('\n');
            var slide_intervals = [];
            var posAndDims;

            if(slide.positionAndDimentions != '' && slide.positionAndDimentions != undefined){
                posAndDims = slide.positionAndDimentions.split(';');
            }else{
                posAndDims = '';
            }

            if (slide_texts.length != slide_times.length) {
                validationResult.errorCode = 'M02';
                return validationResult;
            }

            for (var j=0; j<slide_times.length; j++) {
                var entry = slide_times[j];
                slide_times[j] = presenter.timeEntry(entry, slide.fromFile);
                if (slide_times[j].errorCode) {
                    validationResult.errorCode = slide_times[j].errorCode;
                    validationResult.errorData = entry;
                    return validationResult;
                }

                var entry_start = slide_times[j].start,
                    entry_end = slide_times[j].end;

                if (entry_start > entry_end) {
                    validationResult.errorCode = 'M04';
                    return validationResult;
                }
                if (frames.length > Math.round(entry_start)) {
                    validationResult.errorData = entry_start;
                    validationResult.errorCode = 'M05';
                    return validationResult;
                }

                var frame;
                for (frame=frames.length; frame < entry_start; frame++) {
                    frames[frame] = {
                        slide_id: -1,
                        selection_id: -1
                    }
                }
                for (frame=entry_start; frame < entry_end; frame++) {
                    frames[frame] = {
                        slide_id: i,
                        selection_id: j
                    }
                }
                slide_intervals.push(interval);
                interval++;
            }

            slide.Text = slide_texts;
            slide.Times= slide_times;
            slide.intervals = slide_intervals;
            slide.html = parsed_slide_texts;
            slides[i] = slide;
            slide.positionAndDimentions = posAndDims;
        }
        validationResult.isValid = true;
        validationResult.value = slides;
        validationResult.frames = frames;

        presenter.slidesLengths = [];
        presenter.totalNumberOfParts = interval;

        return validationResult;
    };

    presenter.validateSeparateFiles = function addonTextAudio_validateSeparateFiles (audioFiles) {
        function addonTextAudio_hasEmptyField (audioFiles) {
            return audioFiles.filter(function AddonTextAudio_audioFilesFilter (v) {
                return ModelValidationUtils.isStringEmpty(v.mp3) || ModelValidationUtils.isStringEmpty(v.ogg);
            }).length > 0;
        }

        if (ModelValidationUtils.isArrayEmpty(audioFiles)) {
            return presenter.getErrorObject('SAF01');
        }

        if (presenter.totalNumberOfParts !== audioFiles.length) {
            return presenter.getErrorObject('SAF02');
        }

        if (addonTextAudio_hasEmptyField(audioFiles)) {
            return presenter.getErrorObject('SAF03');
        }

        return presenter.getCorrectObject(audioFiles);
    };

    presenter.validateVocabularyIntervals = function addonTextAudio_validateVocabularyIntervals (intervals) {
        var returnObj = {
            intervals: undefined,
            errorCode: false
        };

        if (intervals === undefined) {
            returnObj.errorCode = 'VI03';
            return returnObj;
        }

        var vocIntervals = intervals.split('\n');
            intervals = [];
        if (vocIntervals.length != presenter.totalNumberOfParts) {
            returnObj.errorCode = 'VI02';
            return returnObj;
        }

        for (var i=0; i<vocIntervals.length; i++) {
            intervals.push(presenter.timeEntry(vocIntervals[i]));
        }

        returnObj.intervals = intervals;
        return returnObj;
    };

    presenter.downloadSRTSync = function AddonTextAudio_downloadSRTSync (src) {
        const res = {
            error: false,
            responseCode: 200,
            text: ""
        };

        const req = new XMLHttpRequest();
        req.open("GET", src, false);
        req.send();

        if (req.status === 200) {
            res.text = req.responseText;
        } else {
            res.error = true;
            res.responseCode = req.status;
        }

        return res;
    };

    presenter.validateModel = function addonTextAudio_validateModel (model) {
        if (model.clickAction === '') {
            model.clickAction = presenter.ALLOWED_CLICK_BEHAVIOUR.play_from_the_moment;
        }
        var validatedAudioFiles = null,
            transposedBehaviors = presenter.transposeDict(presenter.ALLOWED_CLICK_BEHAVIOUR),
            clickAction = transposedBehaviors[model.clickAction];
        presenter.originalFile .mp3 = model.mp3;
        presenter.originalFile .ogg = model.ogg;

        if (!presenter.originalFile .ogg && !presenter.originalFile .mp3) {
            return presenter.getErrorObject('M01');
        }

        presenter.totalNumberOfParts = 0;
        var validatedSlides = presenter.handleSlides(model.Slides);
        var validatedVocabularyIntervals = presenter.validateVocabularyIntervals(model.vocabulary_intervals);
        if (validatedSlides.errorCode) {
            return presenter.getErrorObject(validatedSlides.errorCode);
        }

        if (clickAction == 'play_vocabulary_file' || clickAction == 'play_interval_or_vocabulary') {
            validatedAudioFiles = presenter.validateSeparateFiles(model.separateFiles);
            if (!validatedAudioFiles.isValid) return presenter.getErrorObject(validatedAudioFiles.errorCode);
        } else {
            validatedAudioFiles = presenter.getCorrectObject(false);
        }

        if (clickAction == 'play_vocabulary_interval') {
            presenter.vocabularyFile.mp3 = model.vocabulary_mp3;
            presenter.vocabularyFile.ogg = model.vocabulary_ogg;
            if (!presenter.vocabularyFile.mp3 && !presenter.vocabularyFile.ogg) {
                return presenter.getErrorObject('VI01');
            }
            if (validatedVocabularyIntervals.errorCode) {
                return presenter.getErrorObject(validatedVocabularyIntervals.errorCode);
            }
        }

        if(model.showSlides == undefined){
            model.showSlides = "Show current slide";
        }

        return {
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            onEndEventCode: model.onEnd,
            enableLoop: ModelValidationUtils.validateBoolean(model.enableLoop),
            displayTime: ModelValidationUtils.validateBoolean(model.displayTime),
            controls: model.controls,
            slides: validatedSlides.value,
            frames: validatedSlides.frames,
            clickAction: clickAction,
            playPart: (clickAction == 'play_interval' || clickAction == 'play_interval_or_vocabulary'),
            separateFiles: validatedAudioFiles.value,
            playSeparateFiles: (clickAction == 'play_vocabulary_file' || clickAction == 'play_interval_or_vocabulary'),
            vocabulary_mp3: model.vocabulary_mp3,
            vocabulary_ogg: model.vocabulary_ogg,
            vocabularyIntervals: validatedVocabularyIntervals.intervals,
            isClickDisabled: ModelValidationUtils.validateBoolean(model.isClickDisabled),
            showSlides: model.showSlides,
            isEnabled: !ModelValidationUtils.validateBoolean(model["isDisabled"]),
            langAttribute: model.langAttribute,
            enablePlaybackSpeedControls: ModelValidationUtils.validateBoolean(model.enablePlaybackSpeedControls)
        };
    };

    presenter.executeCommand = function addonTextAudio_executeCommand (name, params) {
        var commands = {
            'play': presenter.play,
            'stop': presenter.stop,
            'pause': presenter.pause,
            'show': presenter.show,
            'hide': presenter.hide,
            'enable': presenter.enable,
            'disable': presenter.disable,
            'setPlaybackRate': presenter.setPlaybackRate
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function AddonTextAudio_setVisibility (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.pauseZero = function addonTextAudio_pauseZero () {
        presenter.stopTimeMeasurement();

        if (!presenter.audio.paused && presenter.isLoaded) {
            presenter.stopClicked = true;
            presenter.audio.pause();
            presenter.audio.currentTime = 0;
        }
    };

    presenter.setPlaybackRate = function (value) {
        var parsedValue = parseFloat(value);
        presenter.playbackRate = parsedValue;
        presenter.audio.playbackRate = parsedValue;
        displayPlaybackOptions();
    };

    presenter.changePlaybackRate = function (type) {
        var index = presenter.PLAYBACK_RATE_LIST.indexOf(presenter.playbackRate);
        var $select = presenter.$playbackRateControls.find('select');

        switch (type) {
            case presenter.OPERATION_TYPE.INCREASE:
                if (index === (presenter.PLAYBACK_RATE_LIST.length - 1)) return;
                index++;
                break;
            case presenter.OPERATION_TYPE.DECREASE:
                if (index === 0) return;
                index--;
                break;
        }

        $select.val(presenter.PLAYBACK_RATE_LIST[index]);
        presenter.playbackRate = presenter.PLAYBACK_RATE_LIST[index];
        presenter.audio.playbackRate = presenter.playbackRate;
    };

    presenter.play = isModuleEnabledDecorator(true)(function addonTextAudio_play () {
        presenter.startTimeMeasurement();
        if (presenter.audio.paused) {
            presenter.stopClicked = false;
            presenter.pauseZero();
            presenter.audio.play();
            if (presenter.configuration.controls === controls.CUSTOM) {
                presenter.$playPauseBtn.
                    removeClass(presenter.CSS_CLASSES.PLAY_BUTTON).
                    addClass(presenter.CSS_CLASSES.PAUSE_BUTTON);
            }
        }
    });

    function forceStop () {
        if (presenter.configuration.controls === controls.CUSTOM && presenter.isLoaded) {
            presenter.stopClicked = true;
            presenter.$playPauseBtn.
                addClass(presenter.CSS_CLASSES.PLAY_BUTTON).
                removeClass(presenter.CSS_CLASSES.PAUSE_BUTTON);
            if (presenter.audio.paused) {
                presenter.stopClicked = true;
                presenter.audio.currentTime = 0;
            }
        }
        presenter.removeMarkFromItems();
        presenter.pauseZero();
        if (!presenter.isLoaded) {
            presenter.audio.addEventListener("loadeddata", presenter.stopAudioLoadedData);
        }
    }

    presenter.stop = isModuleEnabledDecorator(true)(function addonTextAudio_stop () {
        forceStop();
    });

    presenter.stopAudioLoadedData = function AddonTextAudio_StopAudioLoadedData () {
        presenter.isLoaded = true;
        forceStop();
    };

    presenter.playPartStop = function addonTextAudio_playPartStop () {
        presenter.pauseZero();
        if (!presenter.isLoaded) {
            presenter.audio.addEventListener("loadeddata", presenter.playAudioLoadedData);
        }
    };

    presenter.playAudioLoadedData = function AddonTextAudio_playAudioLoadedData () {
        presenter.isLoaded = true;
        presenter.stop();
    };

    presenter.pause = isModuleEnabledDecorator(true)(function addonTextAudio_pause () {
        presenter.stopTimeMeasurement();

        if (!presenter.audio.paused) {
            presenter.audio.pause();
            if (presenter.configuration.controls === controls.CUSTOM) {
                presenter.$playPauseBtn.
                    removeClass(presenter.CSS_CLASSES.PAUSE_BUTTON).
                    addClass(presenter.CSS_CLASSES.PLAY_BUTTON);
            }
        }
    });

    presenter.show = function addonTextAudio_show () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hideAddon = function addonTextAudio_hideAddon () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.hide = function addonTextAudio_hide () {
        presenter.stop();
        presenter.hideAddon();
    };

    presenter.isEnabledInGSAMode = function () {
        return true
    }

    presenter.reset = function addonTextAudio_reset () {
        presenter.disabledTime = 0;
        if (presenter.isEnabledByDefault) {
            presenter.enable();
        } else {
            presenter.disable();
        }

        forceStop();

        presenter.hasBeenStarted = false;
        presenter.isPlaying = false;
        presenter.playedByClick = false;

        presenter.configuration.isVisible = presenter.isVisibleByDefault;
        if (presenter.configuration.isVisible) {
            presenter.show();
        } else {
            presenter.hideAddon();
        }
    };

    presenter.enable = isModuleEnabledDecorator(false)(function () {
        presenter.configuration.isEnabled = true;
        presenter.$view.removeClass('disabled');

        if (presenter.configuration.controls === controls.BROWSER) {
            presenter.setAudioSrc();
            presenter.audio.currentTime = presenter.disabledTime;
        }
    });

    presenter.disable = isModuleEnabledDecorator(true)(function () {
        presenter.pause();
        presenter.configuration.isEnabled = false;
        presenter.$view.addClass('disabled');

        if (presenter.configuration.controls === controls.BROWSER) {
            presenter.disabledTime = presenter.audio.currentTime;
            presenter.audio.removeAttribute('src');
            presenter.audio.load();
        }
    });

    presenter.clearSelection = function addonTextAudio_clearSelection () {
        presenter.$view.find('.textaudio-text span.active').removeClass('active');
    };

    presenter.getState = function addonTextAudio_getState () {
        return JSON.stringify({
            isVisible : presenter.configuration.isVisible,
            isEnabled: presenter.configuration.isEnabled
        });
    };

    presenter.setState = function addonTextAudio_setState (stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return false;
        if (!presenter.configuration.isValid) return false;

        presenter.stop();

        var data = JSON.parse(stateString);

        if (data.isVisible) {
            presenter.show();
        } else {
            presenter.hideAddon();
        }

        // Fix due to a bug that put wrong state. If the value in model is undefined, than module is enabled
        if (presenter.originalIsDisabledModel === undefined) {
            presenter.enable();
        }else if (!data.isEnabled && data.isEnabled !== undefined) {
            presenter.disable();
        } else {
            presenter.enable();
        }

        return false;
    };

    presenter.executeOnEndEvent = function AddonTextAudio_executeOnEndEvent () {
        if (presenter.configuration.onEndEventCode) {
            presenter.playerController.getCommands().executeEventCode(presenter.configuration.onEndEventCode);
        }
    };

    // For tests purposes.
    presenter.__internalElements = {
        isEnabledDecorator: isModuleEnabledDecorator
    };

    presenter.setWCAGStatus = function (isOn) {
        presenter.isWCAGOn = isOn;
    };

    presenter.getElementsForKeyboardNavigation = function () {
        let elements;
        switch (presenter.configuration.controls) {
            case controls.CUSTOM:
                elements = [
                    presenter.$playPauseBtn,
                    presenter.$stopBtn
                ];
                if (presenter.configuration.enablePlaybackSpeedControls) {
                    elements.push(presenter.$playbackRateControls);
                }
                break;
            default:
                elements = [];
                break;
        }

        return elements.concat(presenter.slidesSpanElements.map(
            function(spanElement) {
                return $(spanElement);
            }
        ));
    };

    presenter.actualizeKeyboardControllerElements = function () {
        if (presenter.keyboardControllerObject) {
            const elements = presenter.getElementsForKeyboardNavigation();
            presenter.keyboardControllerObject.setElements(elements);
        }
    };

    presenter.buildKeyboardController = function () {
        const elements = presenter.getElementsForKeyboardNavigation();
        presenter.keyboardControllerObject = new TextAudioKeyboardController(elements, 1);
    }

    presenter.keyboardController = function (keycode, isShiftDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftDown, event);
    };

    function TextAudioKeyboardController(elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
        this.updateMapping();

        // The 'selectedMode' variable is used to determine if a space has already been used on the current element.
        // When the navigation element is changed this variable should take the value false.
        this.selectedMode = false;
    }

    TextAudioKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    TextAudioKeyboardController.prototype.constructor = TextAudioKeyboardController;

    TextAudioKeyboardController.prototype.updateMapping = function () {
        this.mapping[window.KeyboardControllerKeys.ARROW_UP] = this.up;
        this.mapping[window.KeyboardControllerKeys.ARROW_DOWN] = this.down;
    };

    TextAudioKeyboardController.prototype.setElements = function (elements) {
        KeyboardController.prototype.setElements.call(this, elements);
        if (this.keyboardNavigationActive) {
            this.switchWithoutReadingToFirstVisibleElement();
        }
    };

    TextAudioKeyboardController.prototype.getCurrentElement = function () {
        return $(this.getTarget(this.keyboardNavigationCurrentElement, false));
    };

    TextAudioKeyboardController.prototype.mark = function (element) {
        KeyboardController.prototype.mark.call(this, element);

        const $currentElement = this.getCurrentElement();
        if ($currentElement.is('[class^="textelement"]') && this.isElementVisible($currentElement)) {
            this.scrollVertically($currentElement);
        }
    };

    TextAudioKeyboardController.prototype.scrollVertically = function ($textElement) {
        let pos = $textElement.position().top;
        const $slideWithElement = $textElement.closest(`.textaudio-text`);
        const currentScroll = $slideWithElement.scrollTop();
        const divHeight =  $slideWithElement.height();

        pos = (pos + currentScroll) - (divHeight / 2);

        $slideWithElement.scrollTop(pos);
    }

    TextAudioKeyboardController.prototype.enter = function (event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.keyboardNavigationActive) {
            this.keyboardNavigationActive = true;
            this.switchWithoutReadingToFirstVisibleElement();
        }

        if (presenter.isWCAGOn) {
            this.speakCurrentElement();
        }
    };

    TextAudioKeyboardController.prototype.select = function (event) {
        if (presenter.configuration.isEnabled) {
            this.selectedMode = true;
        }
        KeyboardController.prototype.select.call(this, event);
    };

    TextAudioKeyboardController.prototype.up = function (event) {
        if (event) {
            event.preventDefault();
        }

        const $currentElement = this.getCurrentElement();
        if (this.isElementActiveForAfterSelectionAction($currentElement)) {
            presenter.changePlaybackRate(presenter.OPERATION_TYPE.INCREASE);
        } else {
            this.previousRow(event);
        }
    };

    TextAudioKeyboardController.prototype.down = function (event) {
        if (event) {
            event.preventDefault();
        }

        const $currentElement = this.getCurrentElement();
        if (this.isElementActiveForAfterSelectionAction($currentElement)) {
            presenter.changePlaybackRate(presenter.OPERATION_TYPE.DECREASE);
        } else {
            this.nextRow(event);
        }
    };

    TextAudioKeyboardController.prototype.isElementActiveForAfterSelectionAction = function ($element) {
        return (presenter.configuration.isEnabled
            && this.selectedMode
            && $element.hasClass(presenter.CSS_CLASSES.AUDIO_SPEED_CONTROLLER)
        );
    };

    TextAudioKeyboardController.prototype.nextElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(1);

        if (!this.isCurrentElementVisible() && !this.isLastVisibleElementEqualsCurrentElement()) {
            this.nextElement(event);
        }
    };

    TextAudioKeyboardController.prototype.previousElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(-1);

        if (!this.isCurrentElementVisible() && !this.isLastVisibleElementEqualsCurrentElement()) {
            this.previousElement(event);
        }
    };

    TextAudioKeyboardController.prototype.nextRow = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(this.columnsCount);

        if (!this.isCurrentElementVisible() && !this.isLastVisibleElementEqualsCurrentElement()) {
            this.nextRow(event);
        }
    };

    TextAudioKeyboardController.prototype.previousRow = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(-this.columnsCount);

        if (!this.isCurrentElementVisible() && !this.isLastVisibleElementEqualsCurrentElement()) {
            this.previousRow(event);
        }
    };

    TextAudioKeyboardController.prototype.switchWithoutReadingToFirstVisibleElement = function () {
        for (let i = 0; i < this.keyboardNavigationElementsLen; i++) {
            let $nextElement = this.keyboardNavigationElements[i];
            if (this.isElementVisible($nextElement)) {
                this.lastVisibleElementIndex = i;
                this.keyboardNavigationCurrentElementIndex = i;
                this.keyboardNavigationCurrentElement = $nextElement;
                this.mark($nextElement);
                return;
            }
        }
    };

    TextAudioKeyboardController.prototype.isCurrentElementVisible = function () {
        return this.isElementVisible(this.getCurrentElement());
    };

    TextAudioKeyboardController.prototype.isElementVisible = function ($element) {
        const style = window.getComputedStyle($element[0]);
        return style.display !== 'none' && style.visibility === 'visible';
    };

    TextAudioKeyboardController.prototype.isLastVisibleElementEqualsCurrentElement = function () {
        return this.lastVisibleElementIndex === this.keyboardNavigationCurrentElementIndex;
    };

    TextAudioKeyboardController.prototype.switchElement = function (move) {
        this.selectedMode = false;
        KeyboardController.prototype.switchElement.call(this, move);
        if (this.isCurrentElementVisible()) {
            this.lastVisibleElementIndex = this.keyboardNavigationCurrentElementIndex;
            if (presenter.isWCAGOn) {
                this.speakCurrentElement();
            }
        }
    };

    TextAudioKeyboardController.prototype.escape = function (event) {
        presenter.pause();

        if (!presenter.audio) {
            presenter.audio.currentTime = 0;
        }

        KeyboardController.prototype.escape.call(this, event);
    };

    TextAudioKeyboardController.prototype.exitWCAGMode = function () {
        this.selectedMode = false;
        KeyboardController.prototype.exitWCAGMode.call(this);
    };

    TextAudioKeyboardController.prototype.speakCurrentElement = function () {
        const $currentElement = this.getCurrentElement();

        if ($currentElement.hasClass(presenter.CSS_CLASSES.PLAY_PAUSE_BUTTON)) {
            this.speakForPlayPauseButton();
        } else if ($currentElement.hasClass(presenter.CSS_CLASSES.STOP_BUTTON)) {
            this.speakForStopButton();
        } else if ($currentElement.hasClass(presenter.CSS_CLASSES.AUDIO_SPEED_CONTROLLER)) {
            this.speakForSpeedController();
        }
    };

    TextAudioKeyboardController.prototype.speakForPlayPauseButton = function () {
        const textToSpeak = presenter.isPlaying
            ? presenter.speechTexts.Pause
            : presenter.speechTexts.Play;
        speakMessage(textToSpeak);
    };

    TextAudioKeyboardController.prototype.speakForStopButton = function () {
        speakMessage(presenter.speechTexts.Stop);
    };

    TextAudioKeyboardController.prototype.speakForSpeedController = function () {
        speakMessage(presenter.speechTexts.AudioSpeedController);
    };

    function speakMessage(message) {
        const speechTextVoices = [TTSUtils.getTextVoiceObject(message)];
        presenter.speak(speechTextVoices);
    }

    presenter.speak = function (data) {
        const tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.getTextToSpeechOrNull = function AddonTextAudio_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    return presenter;
}
