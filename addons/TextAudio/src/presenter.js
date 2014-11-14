function AddonTextAudio_create() {
    var presenter = function(){};
    var mp3File;
    var oggFile;
    var eventBus;
    var currentTimeAlreadySent;
    var hasBeenStarted = false;

    presenter.ERROR_CODES = {
    	'M01': 'This addon needs at least 1 audio file.',
        'M02': 'Number of texts in the slide should be the same as number of time entities',
        'M03': 'Incorrectly defined period of time',
        'M04': 'Entry ends before start',
        'M05': 'Duplicated text for second '
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

    presenter.upgradeModel = function(model) {
        return presenter.upgradeEnableLoop(model);
    };

    presenter.upgradeEnableLoop = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["enableLoop"]) {
            upgradedModel["enableLoop"] = "";
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
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;

        return minutes + ":" + seconds;
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
        slide_id = parseInt(slide_id);
        selectionId = parseInt(selectionId);
        if (slide_id >= 0 || selectionId >= 0) {
            var frame2go = presenter.configuration.slides[slide_id].Times[selectionId].start;
            frame2go += 0.1;
            presenter.audio.currentTime = frame2go / presenter.fps;
        }
        presenter.play();
    }
    
    function make_slide(textWrapper, slide_id) {
    	if (slide_id < 0) {
            textWrapper.html('');
        } else {
        	var html = '', i, element;
            for (i=0; i<presenter.configuration.slides[slide_id].Text.length; i++) {
                element = '<span class="textelement' + i + '" data-selectionId="' + i + '">' + presenter.configuration.slides[slide_id].Text[i] + '</span>';
                html += element;
            }
            textWrapper.html(html);
            textWrapper.attr('data-slideId', slide_id);
            textWrapper.find("span[class^='textelement']").each(function() {
                $(this).on('click', function(e) {
                    presenter.playedByClick = true;
                    e.stopPropagation();
                    presenter.play();
                    var selectionId = $(this).attr('data-selectionId');
                    presenter.selectionId = parseInt(selectionId, 10);

                    if ($(this).hasClass("tmp-active")) {
                        $(this).removeClass("tmp-active");
                        $(this).addClass("active");
                    }

                    if (!MobileUtils.isSafariMobile(navigator.userAgent)) {
                        go_to(slide_id, selectionId);
                    } else {
                        function fun() {
                            slide_id = parseInt(slide_id, 10);
                            selectionId = parseInt(selectionId, 10);
                            if (slide_id >= 0 || selectionId >= 0) {
                                var frame2go = presenter.configuration.slides[slide_id].Times[selectionId].start;
                                presenter.audio.currentTime = frame2go / presenter.fps;
                            }
                            presenter.audio.removeEventListener("playing", fun, false);
                        }
                        if (!hasBeenStarted) {
                            presenter.audio.addEventListener("playing", fun, false);
                        } else {
                            presenter.pause();
                            go_to(slide_id, selectionId);
                        }
                    }
                });
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
        if (!areSlidesEqual(slide_data, presenter.current_slide_data)) {
            var blockHighlight = false;

            var currentSelId = presenter.current_slide_data.selection_id;
            if (presenter.configuration.playPart && currentSelId !== -1 && presenter.selectionId === currentSelId) {
                presenter.pause();
                blockHighlight = true;
            }

            var textWrapper = presenter.$view.find(".wrapper-addon-textaudio .textaudio-text");
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
        mp3File = model.mp3;
        oggFile = model.ogg;

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
        audio.addEventListener('timeupdate', onTimeUpdateCallback, false);

        change_slide(0);

        if (!isPreview) {
            audio.addEventListener('timeupdate', presenter.onTimeUpdateSendEventCallback, false);
            audio.addEventListener('playing', function() { hasBeenStarted = true; }, false);
            audio.addEventListener('play', function() { if (!presenter.playedByClick) presenter.selectionId = undefined; eventBus.sendEvent('ValueChanged', createOnPlayEventData()) }, false);
            audio.addEventListener('pause', function() { eventBus.sendEvent('ValueChanged', createOnPauseEventData()) }, false);
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
                $(audio).attr("src", mp3File);
            } else if (canPlayOgg) {
                $(audio).attr("src", oggFile);
            }

        } else {
            $(audio).append("Your browser doesn't support audio.");
        }

        $(audio).load();
        attachEventListeners(audio);
    }
    
    presenter.run = function(view, model) {
        presenter.initialize(view, model, false);
        eventBus = presenter.playerController.getEventBus();
        presenter.isLoaded = false;
        this.audio.addEventListener("loadeddata", function() {
            presenter.isLoaded = true;
        });
        presenter.addonID = model.ID;
    };

    presenter.createPreview = function(view, model) {
        presenter.initialize(view, model, true);
    };

    presenter.initialize = function(view, model, isPreview) {
        presenter.$view = $(view);

        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        createView(view, upgradedModel, isPreview);
        
        if (!isPreview) {
        	loadFiles();	
        }
    };

    presenter.toFrames = function(time_entry) {
        var entry = time_entry.split(':');
        var minutes = parseInt(entry[0], 10);
        var seconds = 0;
        var decyseconds = 0;
        if (entry[1].indexOf('.')>-1) {
            var seconds_with_decyseconds = entry[1].split('.');
            seconds = parseInt(seconds_with_decyseconds[0], 10);
            decyseconds = parseInt(seconds_with_decyseconds[1], 10);
            if (decyseconds.toString().length>1) {
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

    presenter.validateSlides = function(slides) {
        var validationResult = {
            isValid: false,
            value: [{
                Text: [''],
                Times: [{start:0, end:0}]
            }],
            errorCode: false
        };
        var frames = [];
        for (var i=0; i<slides.length; i++) {
            var slide = slides[i];
            var slide_texts = slide.Text.split('||');
            var slide_times = slide.Times.split('\n');

            if (slide_texts.length != slide_times.length) {
                validationResult.errorCode = 'M02';
                return validationResult;
            }

            for (var j=0; j<slide_times.length; j++) {
                var entry = slide_times[j].split('-');

                if (entry.length != 2) {
                    validationResult.errorCode = 'M03';
                    validationResult.errorData = slide_times[j];
                    return validationResult;
                }

                var entry_start = presenter.toFrames(entry[0]),
                    entry_end = presenter.toFrames(entry[1]);
                slide_times[j] = {start:entry_start, end:entry_end};
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
            }

            slide.Text = slide_texts;
            slide.Times= slide_times;
            slides[i] = slide;
        }
        validationResult.isValid = true;
        validationResult.value = slides;
        validationResult.frames = frames;

        return validationResult
    };

    function getErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    presenter.validateModel = function (model) {
        mp3File = model.mp3;
        oggFile = model.ogg;

        if (!oggFile && !mp3File) {
            return getErrorObject("M01");
        }

        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var validatedSlides = presenter.validateSlides(model.Slides);

        if (validatedSlides.errorCode) {
            return getErrorObject(validatedSlides.errorCode);
        }

        return {
            isValid: true,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            onEndEventCode: model.onEnd,
            enableLoop: ModelValidationUtils.validateBoolean(model.enableLoop),
            displayTime: ModelValidationUtils.validateBoolean(model.displayTime),
            defaultControls: ModelValidationUtils.validateBoolean(model.defaultControls),
            slides: validatedSlides.value,
            frames: validatedSlides.frames,
            playPart: ModelValidationUtils.validateBoolean(model.playPart)
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

    presenter.play = function() {
        if (this.audio.paused) {
            presenter.stopClicked = false;
            presenter.isPlay = true;
            presenter.stop();
            presenter.isPlay = false;
            this.audio.play();
        }
    };

    presenter.stop = function() {
        if (!this.audio.paused && presenter.isLoaded) {
            presenter.stopClicked = true;
            this.audio.pause();
            this.audio.currentTime = 0;
        }

        if (!presenter.isLoaded && !presenter.isPlay) {
            this.audio.addEventListener("loadeddata", function() {
                presenter.isLoaded = true;
                presenter.stop();
            });
        }
    };

    presenter.playPartStop = function() {
        if (!this.audio.paused && presenter.isLoaded) {
            presenter.stopClicked = true;
            this.audio.pause();
        }

        if (!presenter.isLoaded && !presenter.isPlay) {
            this.audio.addEventListener("loadeddata", function() {
                presenter.isLoaded = true;
                presenter.stop();
            });
        }
    };

    presenter.pause = function() {
        if(!this.audio.paused) {
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

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        if (presenter.configuration.isVisible) {
            presenter.show();
        } else {
            presenter.hideAddon();
        }
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible : presenter.configuration.isVisible
        });
    };

    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return false;

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