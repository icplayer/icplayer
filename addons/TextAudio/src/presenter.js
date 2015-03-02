// #0013
function AddonTextAudio_create() {

    function getErrorObject(ec) { return { isValid: false, errorCode: ec }; }
    function getCorrectObject(val) { return { isValid: true, value: val }; }

    var presenter = function() {};
    var originalFile = {};
    var vocabularyFile = {};
    var eventBus;
    var currentTimeAlreadySent;
    var hasBeenStarted = false;
    var isPlaying = false;
    var globalIntervalNumber = 0;
    var isVocabularyAudioLoaded = false;

    function showLoadingArea(clickAction) {
        if (clickAction === 'play_vocabulary_interval' && presenter.buzzAudio.length === 0 && !MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.$view.find('div.text-audio-loading-area').css('display','block');
        }
    }

    function hideLoadingArea() {
        var $loadingArea = presenter.$view.find('div.text-audio-loading-area');
        $loadingArea.css('display','none');
        $loadingArea.remove();
    }

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
    var isVocabularyPlaying = false;

    function transposeDict(dict) {
        var transp = {};
        for (var key in dict) {
            if (dict.hasOwnProperty(key))
                transp[dict[key]] = key;
        }
        return transp;
    }

    presenter.buzzAudio = [];

    function startTimeMeasurement() {
        isPlaying = true;
        if (!presenter.audioClock) {
            presenter.audioClock = setInterval(function() { onTimeUpdateCallback(); }, 1000 / presenter.fps);
        }
    }

    function stopTimeMeasurement() {
        isPlaying = false;
        clearInterval(presenter.audioClock);
        presenter.audioClock = undefined;
    }

    function startVocabularyTimeMeasurement() {
        isVocabularyPlaying = true;
        if (!presenter.audioVocClock) {
            presenter.audioVocClock = setInterval(function() { onTimeUpdateCallback(); }, 1000 / presenter.fps);
        }
    }

    function stopVocabularyTimeMeasurement() {
        isVocabularyPlaying = false;
        clearInterval(presenter.audioVocClock);
        presenter.audioVocClock = undefined;
        presenter.clearSelection();
    }

    presenter.ERROR_CODES = {
        'M01': 'This addon needs at least 1 audio file.',
        'M02': 'Number of texts in the slide should be the same as number of time entities',
        'M03': 'Incorrectly defined period of time',
        'M04': 'Entry ends before start',
        'M05': 'Duplicated text for second',
        'SAF01': 'Property Vocabulary audio files cannot be empty',
        'SAF02': 'Number of Vocabulary audio files and time items must be the same',
        'SAF03': 'All values in property Vocabulary audio files has to be filled',
        'VI01': 'At least one vocabulary audio file have to be set.',
        'VI02': 'Number of parts in Vocabulary intervals have to be equal to sum of times periods defined in Slides property',
        'VI03': 'Vocabulary time intervals are not set'
    };

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

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    function stopSingleAudioPlayer() {
        removeMarkFromItems();

        for (var i=0; i<presenter.buzzAudio.length; i++) {
            presenter.buzzAudio[i].stop();
        }
    }

    function playSingleAudioPlayer(slideId, elementID) {
        stopSingleAudioPlayer();

        for (var i=0; i<slideId; i++) {
            elementID += presenter.slidesLengths[i];
        }

        presenter.buzzAudio[elementID].play();
    }

    function markItem(selectionId) {
        var selector = 'span[data-selectionid="[NUMBER]"]'.replace('[NUMBER]', selectionId);
        presenter.$view.find('.textaudio-text').find(selector).addClass('active');
    }

    function removeMarkFromItems() {
        presenter.$view.find('span.active').removeClass('active');
    }

    presenter.upgradeModel = function(model) {
        return presenter.upgradeClickAction(model);
    };

    presenter.upgradeClickAction = function(model) {
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

    function getSlideNumber() {
        return presenter.current_slide_data.slide_id + 1;
    }

    function getEventObject(_item, _value, _score) {
        return {
            source : presenter.addonID,
            item: _item + "",
            value: _value + "",
            score: _score + ""
        };
    }

    presenter.createTimeUpdateEventData = function(data) {
        return getEventObject(getSlideNumber(), data.currentTime, "");
    };

    presenter.createOnEndEventData = function() {
        return getEventObject("end", "", "");
    };

    function createOnPlayEventData() {
        return getEventObject(getSlideNumber(), "playing", "");
    }

    function createOnPauseEventData() {
        return getEventObject(getSlideNumber(), "stop", "");
    }

    presenter.getAudioCurrentTime = function () {
        return this.audio.currentTime;
    };

    function formatTime(seconds) {
        function addZero(v) { return (v < 10 ? '0' : '') + v }

        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = Math.floor(seconds % 60);

        return addZero(minutes) + ":" + addZero(remainingSeconds);
    }

    function onLoadedMetadataCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        displayTimer(0, duration);
    }

    presenter.sendEventAndSetCurrentTimeAlreadySent = function(eventData, currentTime) {
        eventBus.sendEvent('ValueChanged', eventData);
        currentTimeAlreadySent = currentTime;
    };

    presenter.sendOnEndEvent = function() {
        var eventData = presenter.createOnEndEventData();
        eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onTimeUpdateSendEventCallback = function() {
        var currentTime = formatTime(presenter.getAudioCurrentTime());
        if (currentTime !== currentTimeAlreadySent) { // to prevent duplicated value
            var eventData = presenter.createTimeUpdateEventData({'currentTime' : currentTime});
            presenter.sendEventAndSetCurrentTimeAlreadySent(eventData, currentTime);
        }
    };

    function onTimeUpdateCallback() {
        if (isVocabularyPlaying) {
            if (presenter.vocabulary.getTime() >= presenter.vocabulary_end) {
                presenter.vocabulary.setTime(0);
                presenter.vocabulary.pause();
            }
            return;
        }
        var currentTime = presenter.audio.currentTime;
        if (presenter.configuration.displayTime) {
            var duration = parseInt(presenter.audio.duration, 10);
            duration = isNaN(duration) ? 0 : duration;
            displayTimer(currentTime, duration);
        }
        change_slide(currentTime);
        if (presenter.stopClicked) {
            presenter.$view.find('span').removeClass('active');
            hasBeenStarted = false;
            presenter.stopClicked = false;
        }
    }

    function displayTimer(current, duration) {
        presenter.$view.find('#currentTime').html(formatTime(current) + ' / ');
        presenter.$view.find('#durationTime').html(formatTime(duration));
    }

    function go_to(slide_id, selectionId) {
        if (slide_id >= 0 || selectionId >= 0) {
            var frame2go = presenter.configuration.slides[slide_id].Times[selectionId].start + 0.1;
            presenter.audio.currentTime = frame2go / presenter.fps;
        }
        presenter.play();
    }

    function make_slide(textWrapper, slide_id) {
        slide_id = parseInt(slide_id, 10);

        if (slide_id < 0) {
            textWrapper.html('');
        } else {
            textWrapper.html(presenter.configuration.slides[slide_id].html);
            textWrapper.attr('data-slideId', slide_id);
            textWrapper.find("span[class^='textelement']").each(function() {
                if(!presenter.configuration.isClickDisabled){
                    $(this).on('click', function(e) {
                        e.stopPropagation();

                        var isVocabularyInterval = presenter.configuration.clickAction == 'play_vocabulary_interval';
                        var isLoaded = isVocabularyAudioLoaded || presenter.buzzAudio.length !== 0;
                        if (isVocabularyInterval && !MobileUtils.isMobileUserAgent(navigator.userAgent) && !isLoaded) {
                            return false;
                        }

                        presenter.playedByClick = true;
                        presenter.selectionId = parseInt($(this).attr('data-selectionId'), 10);

                        switch (presenter.configuration.clickAction) {
                            case 'play_vocabulary_interval':
                                if (isVocabularyPlaying || !isPlaying) {
                                    var intervalId = parseInt($(this).attr('data-intervalId'), 10);
                                    var frame = presenter.configuration.vocabularyIntervals[intervalId];

                                    if (isPlaying) {
                                        presenter.vocabulary.stop();
                                    }
                                    presenter.clearSelection();
                                    presenter.vocabulary.setTime(frame.start / presenter.fps);
                                    presenter.vocabulary_end = frame.end / presenter.fps;
                                    presenter.vocabulary.play();
                                    markItem(presenter.selectionId);
                                    break;
                                }
                            case 'play_interval_or_vocabulary':
                            case 'play_vocabulary_file':
                                if (!isPlaying) {
                                    presenter.pause();
                                    playSingleAudioPlayer(slide_id, presenter.selectionId);
                                    markItem(presenter.selectionId);
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
                                    function fun() {
                                        if (slide_id >= 0 || presenter.selectionId >= 0) {
                                            var frame2go = presenter.configuration.slides[slide_id].Times[presenter.selectionId].start;
                                            presenter.audio.currentTime = frame2go / presenter.fps;
                                        }
                                        presenter.audio.removeEventListener("playing", fun, false);
                                    }
                                    if (hasBeenStarted) {
                                        presenter.pause();
                                        go_to(slide_id, presenter.selectionId);
                                    } else {
                                        presenter.audio.addEventListener("playing", fun, false);
                                    }
                                } else {
                                    go_to(slide_id, presenter.selectionId);
                                }
                        }
                    });
                }
            });

        }
    }

    function highlight_selection(textWrapper, selection_id) {
        textWrapper.find('span').each(function() {
            $(this).removeClass('active');
        });
        if (selection_id >= 0) {
            textWrapper.find('span.textelement' + selection_id).addClass('active');
        }
    }

    function areSlidesEqual(slide1, slide2) {
        return slide1.slide_id == slide2.slide_id && slide1.selection_id == slide2.selection_id;
    }

    function change_slide_from_data(slide_data) {
        var textWrapper = presenter.$view.find(".wrapper-addon-textaudio .textaudio-text");

        if (!areSlidesEqual(slide_data, presenter.current_slide_data)) {
            var blockHighlight = false;

            var currentSelId = presenter.current_slide_data.selection_id;
            if (presenter.configuration.playPart && currentSelId !== -1 && presenter.selectionId === currentSelId) {
                presenter.pause();
                blockHighlight = true;
            }

            if (slide_data.slide_id != presenter.current_slide_data.slide_id) {
                make_slide(textWrapper, slide_data.slide_id);
            }
            highlight_selection(textWrapper, slide_data.selection_id);

            if (blockHighlight) {
                textWrapper.find('span').each(function() {
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
                highlight_selection(textWrapper, slide_data.selection_id);
            }
        }
    }

    function change_slide(currentTime) {
        currentTime = Math.round(currentTime * presenter.fps);

        var frames_array = presenter.configuration.frames;
        var isCurrentTimeInRange = currentTime < frames_array.length;

        var slide_data = {
            slide_id: isCurrentTimeInRange ? frames_array[currentTime].slide_id : -1,
            selection_id: isCurrentTimeInRange ? frames_array[currentTime].selection_id : 0
        };

        if (!hasBeenStarted) {
            slide_data.selection_id = -1;
        }

        var difference = slide_data.selection_id - presenter.previousSelectionId;
        if (difference > 1 && !presenter.playedByClick) {
            slide_data.selection_id -= difference - 1;
        }

        presenter.previousSelectionId = slide_data.selection_id;
        change_slide_from_data(slide_data);
    }

    function createView(view, model, isPreview) {
        originalFile.mp3 = model.mp3;
        originalFile.ogg = model.ogg;

        var audio = new Audio();

        if (presenter.configuration.defaultControls) {
            $(audio).attr("controls", "controls").attr("preload", "auto");
        }

        var currentTime = document.createElement("span");
        var durationTime = document.createElement("span");
        $(currentTime).attr("id", "currentTime");
        $(durationTime).attr("id", "durationTime");

        var audioWrapper = presenter.$view.find(".wrapper-addon-textaudio .textaudio-player");
        audioWrapper.append(audio);
        if (presenter.configuration.displayTime) {
            audioWrapper.append(currentTime).append(durationTime);
            audio.addEventListener('loadeddata', onLoadedMetadataCallback, false);
        }

        change_slide(0);

        if (!isPreview) {
            audio.addEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
            audio.addEventListener('playing', function() { hasBeenStarted = true; }, false);
            audio.addEventListener('play', function() {
                if (isVocabularyPlaying) {
                    presenter.vocabulary.pause();
                }
                if (!presenter.playedByClick) {
                    presenter.selectionId = undefined;
                }
                eventBus.sendEvent('ValueChanged', createOnPlayEventData());
                startTimeMeasurement();
            }, false);
            audio.addEventListener('pause', function() {
                stopTimeMeasurement();
                eventBus.sendEvent('ValueChanged', createOnPauseEventData())
            }, false);
        }

        presenter.audio = audio;
    }

    function attachEventListeners(audio) {
        audio.addEventListener('ended', function() {
            if (presenter.configuration.enableLoop) {
                this.currentTime = 0;
                this.play();
            } else {
                presenter.executeOnEndEvent();
                presenter.sendOnEndEvent();
                presenter.stop();
                presenter.$view.find(".wrapper-addon-textaudio .textaudio-text :last-child").removeClass('active');
            }

            presenter.playedByClick = false;
        }, false);

        audio.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);
    }

    function loadFiles() {
        var canPlayMp3 = false;
        var canPlayOgg = false;
        var audio = presenter.audio;

        if (audio.canPlayType) {
            canPlayMp3 = audio.canPlayType && "" != audio.canPlayType('audio/mpeg');
            canPlayOgg = audio.canPlayType && "" != audio.canPlayType('audio/ogg; codecs="vorbis"');

            if (canPlayMp3) {
                $(audio).attr("src", originalFile.mp3);
            } else if (canPlayOgg) {
                $(audio).attr("src", originalFile.ogg);
            }

            if (presenter.configuration.clickAction == 'play_vocabulary_interval') {
                presenter.vocabulary = new buzz.sound([
                    presenter.configuration.vocabulary_mp3,
                    presenter.configuration.vocabulary_ogg
                ]);
                presenter.vocabulary.bind('canplaythrough', function() {
                    presenter.vocabulary.unbind('canplaythrough');
                    isVocabularyAudioLoaded = true;
                    hideLoadingArea();
                }, false);
                presenter.vocabulary.bind('ended', function() {
                    presenter.clearSelection();
                });
                presenter.vocabulary.bind('play', function() {
                    if (!presenter.playedByClick) {
                        presenter.selectionId = undefined;
                    }
                    startVocabularyTimeMeasurement();
                }, false);
                presenter.vocabulary.bind('pause', function() {
                    stopVocabularyTimeMeasurement();
                }, false);
            }
        } else {
            $(audio).append("Your browser doesn't support audio.");
        }

        $(audio).load();
        attachEventListeners(audio);
    }

    function createSeparateAudioFiles(audioFiles) {
        for (var i=0; i<audioFiles.length; i++) {
            var localBuzz = new buzz.sound([
                audioFiles[i].mp3,
                audioFiles[i].ogg
            ]);

            localBuzz.bind('ended', function() {
                presenter.clearSelection();
            });

            presenter.buzzAudio.push(localBuzz);
        }
    }

    presenter.run = function(view, model) {
        presenter.initialize(view, model, false);
        eventBus = presenter.playerController.getEventBus();
        presenter.isLoaded = false;
        if (presenter.configuration.isValid) {
            this.audio.addEventListener("loadeddata", function() {
                presenter.isLoaded = true;
            });
        }
        presenter.addonID = model.ID;
    };

    presenter.createPreview = function(view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function(view, model, isPreview) {
        buzz.defaults.preload = 'auto';
        buzz.defaults.autoplay = false;
        buzz.defaults.loop = false;

        presenter.$view = $(view);

        var upgradedModel = presenter.upgradeModel(model);
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

        createView(view, upgradedModel, isPreview);

        if (!isPreview) {
            loadFiles();

            if (presenter.configuration.playSeparateFiles) {
                createSeparateAudioFiles(presenter.configuration.separateFiles);
            }

            showLoadingArea(presenter.configuration.clickAction);
        }
    };

    presenter.toFrames = function(time_entry) {
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

    presenter.timeEntry = function(slide_time) {
        var entry = slide_time.split('-');
        if (entry.length != 2) {
            return {
                errorCode: 'M03',
                errorData: slide_time
            }
        }

        return {
            start: presenter.toFrames(entry[0]),
            end: presenter.toFrames(entry[1])
        };
    };

    presenter.parseSlideText = function(text) {

        function createNewSpan(n1, n2, text) {
            var $span = $('<span></span>');
            $span.addClass('textelement' + n1);
            $span.attr('data-selectionid', n1);
            $span.attr('data-intervalid', n2);
            $span.html(text);
            return $span.prop("outerHTML");
        }

        var elemNumber = 0;
        var resultHTML = "";

        HTMLParser(text, {
            start: function(tag, attrs, unary) {
                resultHTML += "<" + tag;
                for (var i=0; i<attrs.length; i++) {
                    resultHTML += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                }
                resultHTML += (unary ? "/" : "") + ">";
            },
            end: function(tag) {
                resultHTML += "</" + tag + ">";
            },
            chars: function(text) {
                var localParts = text.split('||');

                for (var i=0; i<localParts.length; i++) {
                    if (localParts[i] !== '') {
                        resultHTML += createNewSpan(elemNumber, globalIntervalNumber, localParts[i]);
                    }

                    if (i !== localParts.length-1) {
                        elemNumber++;
                        globalIntervalNumber++;
                    }
                }
            }
        });

        return resultHTML;
    };

    presenter.validateSlides = function(slides) {
        var validationResult = {
            isValid: false,
            value: [{
                Text: [''],
                Times: [{start: 0, end: 0}]
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

            if (slide_texts.length != slide_times.length) {
                validationResult.errorCode = 'M02';
                return validationResult;
            }

            for (var j=0; j<slide_times.length; j++) {
                var entry = slide_times[j];
                slide_times[j] = presenter.timeEntry(entry);
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
                if (frames.length > entry_start) {
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
        }
        validationResult.isValid = true;
        validationResult.value = slides;
        validationResult.frames = frames;

        presenter.slidesLengths = [];
        presenter.totalNumberOfParts = interval;

        return validationResult;
    };

    presenter.validateSeparateFiles = function(audioFiles) {
        function hasEmptyField(audioFiles) {
            return audioFiles.filter(function(v) {
                return ModelValidationUtils.isStringEmpty(v.mp3) || ModelValidationUtils.isStringEmpty(v.ogg);
            }).length > 0;
        }

        if (ModelValidationUtils.isArrayEmpty(audioFiles)) {
            return getErrorObject('SAF01');
        }

        if (presenter.totalNumberOfParts !== audioFiles.length) {
            return getErrorObject('SAF02');
        }

        if (hasEmptyField(audioFiles)) {
            return getErrorObject('SAF03');
        }

        return getCorrectObject(audioFiles);
    };

    presenter.validateVocabularyIntervals = function(intervals) {
        var returnObj = {
            intervals: undefined,
            errorCode: false
        };

        if (intervals === undefined) {
            returnObj.errorCode = 'VI03';
            return returnObj;
        }

        var vocIntervals = intervals.split('\n'),
            intervals=[], time_range;
        if (vocIntervals.length != presenter.totalNumberOfParts) {
            returnObj.errorCode = 'VI02';
            return returnObj;
        }

        for (var i=0; i<vocIntervals.length; i++) {
            time_range = presenter.timeEntry(vocIntervals[i]);
            intervals.push(time_range);
        }

        returnObj.intervals = intervals;
        return returnObj;
    };

    presenter.validateModel = function (model) {
        if (model.clickAction === '') {
            model.clickAction = presenter.ALLOWED_CLICK_BEHAVIOUR.play_from_the_moment;
        }
        var validatedAudioFiles = null,
            transposedBehaviors = transposeDict(presenter.ALLOWED_CLICK_BEHAVIOUR),
            clickAction = transposedBehaviors[model.clickAction];
        originalFile.mp3 = model.mp3;
        originalFile.ogg = model.ogg;

        if (!originalFile.ogg && !originalFile.mp3) {
            return getErrorObject('M01');
        }

        presenter.totalNumberOfParts = 0;
        var validatedSlides = presenter.validateSlides(model.Slides);
        var validatedVocabularyIntervals = presenter.validateVocabularyIntervals(model.vocabulary_intervals);
        if (validatedSlides.errorCode) {
            return getErrorObject(validatedSlides.errorCode);
        }

        if (clickAction == 'play_vocabulary_file' || clickAction == 'play_interval_or_vocabulary') {
            validatedAudioFiles = presenter.validateSeparateFiles(model.separateFiles);
            if (!validatedAudioFiles.isValid) return getErrorObject(validatedAudioFiles.errorCode);
        } else {
            validatedAudioFiles = getCorrectObject(false);
        }

        if (clickAction == 'play_vocabulary_interval') {
            vocabularyFile.mp3 = model.vocabulary_mp3;
            vocabularyFile.ogg = model.vocabulary_ogg;
            if (!vocabularyFile.mp3 && !vocabularyFile.ogg) {
                return getErrorObject('VI01');
            }
            if (validatedVocabularyIntervals.errorCode) {
                return getErrorObject(validatedVocabularyIntervals.errorCode);
            }
        }

        return {
            isValid: true,
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            onEndEventCode: model.onEnd,
            enableLoop: ModelValidationUtils.validateBoolean(model.enableLoop),
            displayTime: ModelValidationUtils.validateBoolean(model.displayTime),
            defaultControls: ModelValidationUtils.validateBoolean(model.defaultControls),
            slides: validatedSlides.value,
            frames: validatedSlides.frames,
            clickAction: clickAction,
            playPart: (clickAction == 'play_interval' || clickAction == 'play_interval_or_vocabulary'),
            separateFiles: validatedAudioFiles.value,
            playSeparateFiles: (clickAction == 'play_vocabulary_file' || clickAction == 'play_interval_or_vocabulary'),
            vocabulary_mp3: model.vocabulary_mp3,
            vocabulary_ogg: model.vocabulary_ogg,
            vocabularyIntervals: validatedVocabularyIntervals.intervals,
            isClickDisabled: ModelValidationUtils.validateBoolean(model.isClickDisabled)
        };
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'play': presenter.play,
            'stop': presenter.stop,
            'pause': presenter.pause,
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    function pauseZero() {
        stopTimeMeasurement();

        if (!presenter.audio.paused && presenter.isLoaded) {
            presenter.stopClicked = true;
            presenter.audio.pause();
            presenter.audio.currentTime = 0;
        }
    }

    presenter.play = function() {
        startTimeMeasurement();
        if (presenter.audio.paused) {
            presenter.stopClicked = false;
            pauseZero();
            presenter.audio.play();
        }
    };

    presenter.stop = function() {
        removeMarkFromItems();
        pauseZero();
        if (!presenter.isLoaded) {
            this.audio.addEventListener("loadeddata", function() {
                presenter.isLoaded = true;
                presenter.stop();
            });
        }
    };

    presenter.playPartStop = function() {
        pauseZero();
        if (!presenter.isLoaded) {
            this.audio.addEventListener("loadeddata", function() {
                presenter.isLoaded = true;
                presenter.stop();
            });
        }
    };

    presenter.pause = function() {
        stopTimeMeasurement();

        if (!this.audio.paused) {
            this.audio.pause();
        }
    };

    presenter.show = function() {
        this.setVisibility(true);
        this.configuration.isVisible = true;
    };

    presenter.hideAddon = function() {
        this.setVisibility(false);
        this.configuration.isVisible = false;
    };

    presenter.hide = function () {
        this.stop();
        this.hideAddon();
    };

    presenter.reset = function() {
        presenter.stop();

        hasBeenStarted = false;
        isPlaying = false;
        presenter.playedByClick = false;

        presenter.configuration.isVisible = presenter.isVisibleByDefault;
        if (presenter.configuration.isVisible) {
            presenter.show();
        } else {
            presenter.hideAddon();
        }
    };

    presenter.clearSelection = function() {
        presenter.$view.find('.textaudio-text span.active').removeClass('active');
    };

    presenter.getState = function() {
        presenter.stop();
        if (presenter.vocabulary !== undefined) {
            presenter.vocabulary.stop();
        }

        return JSON.stringify({
            isVisible : presenter.configuration.isVisible
        });
    };

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return false;
        if (!presenter.configuration.isValid) return false;

        presenter.stop();

        if (JSON.parse(stateString).isVisible) {
            this.show();
        } else {
            this.hideAddon();
        }

        return false;
    };

    presenter.executeOnEndEvent = function () {
        if (presenter.configuration.onEndEventCode) {
            presenter.playerController.getCommands().executeEventCode(presenter.configuration.onEndEventCode);
        }
    };

    return presenter;
}