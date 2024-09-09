function AddonMultiAudio_create(){
    var presenter = function(){};
    var AUDIO_FILES_MISSING = "This addon needs at least 1 audio file.";
    var eventBus;
    var currentTimeAlreadySent;
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);
    presenter.currentAudio = 0;
    presenter.audio = {};
    presenter.files = [];
    presenter.visible = true;
    presenter.defaultVisibility = true;
    presenter.globalView = null;
    presenter.globalModel = null;
    presenter.playerController = null;
    presenter.addonID = null;
    presenter.type = 'multiaudio';
    presenter.draggableItems = {};
    presenter.isWCAGOn = false;
    presenter.selectedItemID = '';
    presenter.currentDraggableItemID = '';

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    function getTextVoiceObject(text, lang) {return window.TTSUtils.getTextVoiceObject(text, lang);}
    
    presenter.onEventReceived = function(eventName, eventData) {
        if (eventName == "ValueChanged") {
            if (eventData.value == 'dropdownClicked' && !presenter.audio.playing && !isTemporarilyPaused()) {
                this.audio.load();
            }
        }else if (eventName == "ItemConsumed") {
            if (presenter.globalModel["Interface"] == "Draggable items") {
                var itemID = getItemIdFromEvent(eventData.item);
                if (itemID != null) {
                    removeDraggableItem(itemID);
                }
            }
        } else if (eventName == "ItemReturned") {
            if (presenter.globalModel["Interface"] == "Draggable items") {
                var itemID = getItemIdFromEvent(eventData.item);
                if (itemID != null) {
                    createDraggableItem(itemID);
                }
            }
        } else if (eventName == "itemDragged") {
            if (presenter.globalModel["Interface"] == "Draggable items") {
                var itemID = getItemIdFromEvent(eventData.item);
                presenter.fireSelectedDraggableEvent(itemID);
                hideDraggableItem(itemID);
            }
        } else if (eventName == "itemStopped") {
            if (presenter.globalModel["Interface"] == "Draggable items") {
                var itemID = getItemIdFromEvent(eventData.item);
                if (itemID != null) {
                    showDraggableItem(itemID);
                }
            }
        } else if (eventName == "ItemSelected" && eventData.item !== null) { // when ImageSource deselects item, then item is null
            var itemID = getItemIdFromEvent(eventData.item);
            this.applySelectedClass(itemID);
        }
    };

    function isTemporarilyPaused() {
        return (presenter.audio.paused
            && presenter.audio.readyState > 2
            && presenter.audio.currentTime > 0
            && !presenter.audio.ended
        );
    }

    function getItemIdFromEvent(eventDataItem) {
        var addonAndItemIds = eventDataItem.split('-');
        if (addonAndItemIds.length != 2) return null;
        if (addonAndItemIds[0] != presenter.addonID) return null;
        return addonAndItemIds[1];
    }

    presenter.applySelectedClass = function(itemID) {
        if (presenter.globalModel["Interface"] != "Draggable items") return;
        var keys = Object.keys(presenter.draggableItems);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = presenter.draggableItems[key];
            if (key == itemID) {
                item.addClass('multiaudio-selected');
            } else {
                item.removeClass('multiaudio-selected');
            }
        }
    }

    function getEventObject(_item, _value, _score) {
    	return {
            source : presenter.addonID,
            item : _item + '',
            value : _value + '',
            score : _score + ''
        };
    }

    function deferredQueueDecoratorChecker () {
        return presenter.isLoaded;
    }
    
    presenter.createEventData = function (data) {
    	return getEventObject(data.currentItem, data.currentTime, '');
    };

    presenter.createOnEndEventData = function (data) {
        return getEventObject(data.currentItem, 'end', '');
    };
    
    presenter.createOnPlayingEventData = function (data) {
        return getEventObject(data.currentItem, 'playing', '');
    };

    presenter.createOnPauseEventData = function (data) {
        return getEventObject(data.currentItem, 'pause', '');
    };
    
    presenter.sendEventAndSetCurrentTimeAlreadySent = function (eventData, currentTime) {
        eventBus.sendEvent('ValueChanged', eventData);
        currentTimeAlreadySent = currentTime;
    };

    presenter.getAudioCurrentTime = function () {
        return this.audio.currentTime;
    };

    presenter.onTimeUpdateSendEventCallback = function() {

        var ua = navigator.userAgent;
        if( ua.indexOf("Android") >= 0 )
        {
            var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
            if (androidversion == 4.4)
            {
                var duration = parseInt(presenter.audio.duration, 10);
                duration = isNaN(duration) ? 0 : duration;
                var currentTime2 = parseInt(presenter.audio.currentTime, 10);

                if(duration == currentTime2){
                    presenter.sendOnEndEvent();
                }
            }
        }

        var currentTime = presenter.formatTime(presenter.getAudioCurrentTime());
        var currentItem = presenter.currentAudio+1;
        if (currentTime !== currentTimeAlreadySent) { // to prevent duplicated value
            var eventData = presenter.createEventData({'currentTime' : currentTime, 'currentItem': currentItem});
            presenter.sendEventAndSetCurrentTimeAlreadySent(eventData, currentTime);
        }
    };
    
    presenter.addAttributeLoop = function(audio) {
        $(audio).on("ended", function() {
            this.currentTime = 0;
            this.play();
        });
    };

    presenter.prepareAudio = function(){
        this.audio = document.createElement("audio");
        var audioWrapper = presenter.globalView.find(".wrapper-addon-audio");
        audioWrapper.html("");
        audioWrapper.append(this.audio);
        return audioWrapper;
    };
    
    presenter.sendOnEndEvent = function () {
        var currentItem = presenter.currentAudio+1;
        var eventData = presenter.createOnEndEventData({'currentItem': currentItem});
        eventBus.sendEvent('ValueChanged', eventData);
    };
    
    presenter.sendOnPlayingEvent = function () {
        var currentItem = presenter.currentAudio+1;
        var eventData = presenter.createOnPlayingEventData({'currentItem': currentItem});
            eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.sendOnPausedEvent = function () {
        var currentItem = presenter.currentAudio+1;
        var eventData = presenter.createOnPauseEventData({'currentItem': currentItem});
            eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.playingEventSent = false;
    presenter.createView = function(view, model){
        var interfaceType = model["Interface"];
        var audioWrapper = this.prepareAudio();
        this.audio.addEventListener('timeupdate', function() {
            presenter.onTimeUpdateSendEventCallback();

            var ua = navigator.userAgent;
            if( ua.indexOf("Android") >= 0 )
            {
                var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
                if (androidversion == 5)
                {
                    if(presenter.audio.currentTime > 0 && !presenter.playingEventSent){
                        presenter.sendOnPlayingEvent();
                        presenter.playingEventSent = true;
                    }
                }
            }
        }, false);
        this.audio.addEventListener('playing', function () {
            var ua = navigator.userAgent;
            if( ua.indexOf("Android") >= 0 ){
                var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
                if (androidversion == 5){
                    //do nothing
                }else{
                    presenter.sendOnPlayingEvent();
                }
            }else{
                presenter.sendOnPlayingEvent();
            }
        }, false);
        this.audio.addEventListener('play', function () {
        }, false);
        this.audio.addEventListener('click', function(e) {
            e.stopPropagation();
        }, false);
        this.audio.addEventListener('ended', function() {
            presenter.stop();
            presenter.sendOnEndEvent();
            presenter.playingEventSent = false;
        }, false);

        this.audio.addEventListener('pause', function() {
                if (interfaceType == "Default controls") {
                    presenter.sendOnPausedEvent();
                }
            }, false);

        if (!presenter.isLoaded) {
            this.audio.addEventListener("loadeddata", function() {
                presenter.isLoaded = true;

                deferredSyncQueue.resolve();
            });
        }

        switch(interfaceType) {
            case "Default controls":
                $(this.audio).attr("controls", "controls").attr("preload", "auto");
                break;
            case "Display time":
                this.createCurrentAndDuration(audioWrapper);
                this.audio.addEventListener('loadeddata', onLoadedMetadataCallback, false);
                this.audio.addEventListener('timeupdate', onTimeUpdateCallback, false);
                break;
            case "Draggable items":
                presenter.createDraggableItems(model['Files']);
                break;
        }

        Object.defineProperty(presenter.audio, 'playing', {
            get: function () {
                return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            }
        });
    };

    presenter.createDraggableItems = function(filesModel) {
        for (var i=0; i < filesModel.length; i++) {
            createDraggableItem(filesModel[i].ID);
        }
        if (presenter.selectedItemID.length > 0) {
            presenter.applySelectedClass(presenter.selectedItemID);
        }
    };

    function createDraggableItem (itemID) {
        if (itemID in presenter.draggableItems) return;

        var $el = $('<div></div>');
            $el.attr('data-audio-id', itemID);
            $el.attr('data-addon-id', presenter.addonID);
            $el.addClass('multiaudio-item-wrapper');

            var $grab = $('<div></div>');
            $grab.addClass('multiaudio-item-grab-area');
            $el.append($grab);

            var itemText = presenter.getTextFromFileID(itemID);
            if (presenter.playerController) {
                itemText = presenter.playerController.getTextParser().parseAltTexts(itemText);
            } else {
                itemText = window.TTSUtils.parsePreviewAltText(itemText);
            }
            if ($("<span>" + itemText + "</span>").text().length > 0) {
                var $text = $('<span></span>');
                $text.addClass('multiaudio-item-text');
                $text.html(itemText);
                $grab.append($text);
                $el.addClass("multiaudio-item-has-text");
            }

            $grab.click(function(){presenter.handleGrabAreaClick(itemID)});

            var $button = $('<div></div>');
            $button.addClass('multiaudio-item-button');
            $el.append($button);

            var $icon = $('<div></div>');
            $icon.addClass('multiaudio-item-icon');
            $button.append($icon);

            $button.click(draggableItemButtonClickHandler);

            $el.draggable({
                revert: true,
                helper: "original",
                handle: ".multiaudio-item-grab-area",
                start : function(event, ui) {
                    presenter.fireSelectedDraggableEvent(itemID);
                    if (presenter.draggableItems[itemID].hasClass('playing')) {
                        presenter.stop();
                        presenter.draggableItems[itemID].removeClass('playing');
                    }
                },
                drag : function(event, ui) {
                    ui.position.left = ui.position.left / getScale().X;
                    ui.position.top = ui.position.top / getScale().Y;
                }
            });

            presenter.globalView.find(".wrapper-addon-audio").append($el);
            presenter.draggableItems[itemID] = $el;
    }

    function getScale() {
        if (presenter.playerController) {
            const scaleInformation = presenter.playerController.getScaleInformation();
            if (scaleInformation.baseScaleX !== 1.0 ||
                scaleInformation.baseScaleY !== 1.0 ||
                scaleInformation.scaleX !== 1.0 ||
                scaleInformation.scaleY !== 1.0
            ) {
                return {X: scaleInformation.scaleX, Y: scaleInformation.scaleY};
            }
        }

        const $content = $("#content");
        if ($content.size() > 0) {
            const contentElem = $content[0];
            const scaleX = contentElem.getBoundingClientRect().width / contentElem.offsetWidth;
            const scaleY = contentElem.getBoundingClientRect().height / contentElem.offsetHeight;
            return {X: scaleX, Y: scaleY};
        } else {
            return {X: 1.0, Y: 1.0};
        }
    }

    presenter.getTextFromFileID = function(itemID) {
        // This method is used by the multiplegap addon while creating the draggable audio widgets
        var item = null;
        for (var i = 0; i < presenter.globalModel.Files.length; i++) {
            var tmpItem = presenter.globalModel.Files[i];
            if (tmpItem.ID === itemID) {
                item = tmpItem;
            }
        }
        if (item === null) return null;
        return item["Text"];
    }

    function removeDraggableItem(itemID) {
        if (!(itemID in presenter.draggableItems)) return;

        presenter.draggableItems[itemID].remove();
        delete presenter.draggableItems[itemID];
        if (presenter.selectedItemID == itemID) {
            presenter.selectedItemID = '';
        }
    }

    function removeDraggableItems() {
        presenter.globalView.find('.multiaudio-item-wrapper').remove();
        presenter.draggableItems = {};
        presenter.selectedItemID = '';
    }

    function hideDraggableItem(itemID) {
        if (itemID in presenter.draggableItems) {
            presenter.draggableItems[itemID].css('display','none');
        }
    }

    function showDraggableItem(itemID) {
        if (itemID in presenter.draggableItems) {
            presenter.draggableItems[itemID].css('display','');
        }
    }

    // itemID is optional, if left empty a "deselecting" event will be fired
    presenter.fireSelectedDraggableEvent = function(itemID) {
        var eventData = {
            source : presenter.addonID,
            type : 'audio',
            item : "",
            value : ""
        };
        if (itemID != null) {
            eventData.item = presenter.addonID + '-' + itemID;
            eventData.value = itemID + '';
        }
        eventBus.sendEvent('ItemSelected', eventData);
    };

    presenter.handleGrabAreaClick = function(itemID) {
        if (presenter.draggableItems[itemID].hasClass('ui-draggable-dragging')) return;
        if (presenter.draggableItems[itemID].hasClass('multiaudio-selected')) {
            presenter.fireSelectedDraggableEvent();
            presenter.selectedItemID = '';
            readDeselected();
        } else {
            presenter.fireSelectedDraggableEvent(itemID);
            presenter.selectedItemID = itemID;
            readSelected();
        }
    };

    function draggableItemButtonClickHandler (event) {
        var $parent = $(event.currentTarget).parent();
        var itemID = $parent.attr('data-audio-id');
        if ($parent.hasClass('playing')) {
            presenter.stop();
            presenter.jumpToID(itemID);
        } else {
            $parent.addClass('playing');
            presenter.jumpToID(itemID);
            presenter.play();

        }
    }

    presenter.createCurrentAndDuration = function(audioWrapper) {
        var currentTime = document.createElement("span");
        var durationTime = document.createElement("span");
        $(currentTime).attr("id", "currentTime");
        $(durationTime).attr("id", "durationTime");
        audioWrapper.html(currentTime).append(durationTime);
    };

    presenter.formatTime = function(seconds) {
        var minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    };

    function onLoadedMetadataCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        presenter.displayTimer(0, duration);
    }

    function onTimeUpdateCallback() {
        var duration = parseInt(presenter.audio.duration, 10);
        duration = isNaN(duration) ? 0 : duration;
        var currentTime = presenter.audio.currentTime;
        presenter.displayTimer(currentTime, duration);
    }

    presenter.displayTimer = function(current, duration) {
        presenter.globalView.find('#currentTime').html(presenter.formatTime(current) + ' / ');
        presenter.globalView.find('#durationTime').html(presenter.formatTime(duration));
    };

    presenter.loadFiles = function(audio, model){
        this.files = model["Files"];
        var oggFile = this.files[this.currentAudio]["Ogg"];
        var mp3File = this.files[this.currentAudio]["Mp3"];
        var loop = !!(this.files[this.currentAudio]["Enable loop"] == "True");
        var canPlayMp3 = false;
        var canPlayOgg = false;

        var validated = this.validateFiles(this.files[this.currentAudio]);

        if (!validated) {
            this.globalView.find(".wrapper-addon-audio").html(AUDIO_FILES_MISSING);
        }

        if (loop) {
            presenter.addAttributeLoop(audio);
        }

        if(audio.canPlayType) {
            canPlayMp3 = !!audio.canPlayType && "" != audio.canPlayType('audio/mpeg');
            canPlayOgg = !!audio.canPlayType && "" != audio.canPlayType('audio/ogg; codecs="vorbis"');
            if(canPlayMp3){
                $(audio).attr("src", mp3File);
            } else if (canPlayOgg) {
                $(audio).attr("src", oggFile);
            }
        } else {
            $(audio).append("Your browser doesn't support audio.");
        }

        audio.load();

    };

    function upgradeModel(model) {
        var upgradedModel = upgradeFileText(model);
        upgradedModel = upgradeTextToSpeechSupport(upgradedModel);
        return upgradedModel;
    }

    function upgradeFileText(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);
        for (var i = 0; i < upgradedModel["Files"].length; i++) {
            if (upgradedModel["Files"][i]["Text"] === undefined) {
                upgradedModel["Files"][i]["Text"] = "";
            }
        }
        return upgradedModel;
    }

    function upgradeTextToSpeechSupport(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel['speechTexts'] === undefined) {
            upgradedModel['speechTexts'] = {
                Selected: {Selected: "Selected"},
                Deselected: {Deselected: "Deselected"},
                Empty: {Empty: "Empty"}
            };
        }

        if (upgradedModel['langAttribute'] === undefined) {
            upgradedModel['langAttribute'] = "";
        }

        return upgradedModel;
    }

    function getSpeechTextProperty (rawValue, defaultValue) {
            var value = rawValue.trim();

            if (value === undefined || value === null || value === '') {
                return defaultValue;
            }

            return value;
        }

    presenter.getSpeechTexts = function(speechTextsModel) {
        var speechTexts = {
            selected:  'Selected',
            deselected: 'Deselected',
            empty: 'Empty'
        };

        if (!speechTextsModel) {
            return speechTexts;
        }

        speechTexts = {
            selected:        getSpeechTextProperty(speechTextsModel['Selected']['Selected'], speechTexts.selected),
            deselected:        getSpeechTextProperty(speechTextsModel['Deselected']['Deselected'], speechTexts.deselected),
            empty:        getSpeechTextProperty(speechTextsModel['Empty']['Empty'], speechTexts.empty)
        };

        return speechTexts;
    };

    presenter.run = function(view, model){
        this.initialize(view, model, false);
        eventBus = presenter.playerController.getEventBus();
        presenter.addonID = model.ID;
        eventBus.addEventListener('ValueChanged', this);
        eventBus.addEventListener('ItemSelected', this);
        eventBus.addEventListener('ItemConsumed', this);
        eventBus.addEventListener('ItemReturned', this);
        eventBus.addEventListener('itemStopped', this);
        eventBus.addEventListener('itemDragged', this);
    };

    presenter.createPreview = function(view, model){
        this.initialize(view, model, true);
    };

    presenter.initialize = function(view, model, isPreview) {
        var upgradedModel = upgradeModel(model);
        this.globalModel = upgradedModel;
        this.speechTexts = presenter.getSpeechTexts(upgradedModel['speechTexts']);
        this.globalView = $(view);
        this.createView(view, upgradedModel);
        presenter.view = view;
        if (!isPreview) {
        	this.loadFiles(this.audio, upgradedModel);
            MutationObserverService.createDestroyObserver(presenter.addonID, presenter.destroy, presenter.view);
            MutationObserverService.setObserver();
        }
        this.visible = !!(upgradedModel['Is Visible'] == 'True');
        this.defaultVisibility = this.visible;
    };

    presenter.destroy = function AddonMultiAudio_destroy() {
        presenter.audio.pause();
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'play': presenter.play,
            'stop': presenter.stop,
            'next': presenter.next,
            'previous': presenter.previous,
            'jumpTo': presenter.jumpToCommand,
            'jumpToID': presenter.jumpToIDCommand,
            'pause': presenter.pause
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        $(presenter.globalView).css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.play = deferredSyncQueue.decorate(function() {
        if (!this.audio.playing) {
            this.audio.play();
        }
        if (presenter.globalModel["Interface"] == "Draggable items") {
            presenter.setCurrentDraggableItemToPlay();
        }
    });

    presenter.setCurrentDraggableItemToPlay = function() {
        var itemID = presenter.files[presenter.currentAudio].ID;
        $(presenter.view).find(".multiaudio-item-wrapper").each(function(){
            var $this = $(this);
            if ($this.attr('data-audio-id') == itemID) {
                $this.addClass('playing');
            } else {
                $this.removeClass('playing');
            }
        });
    };

    presenter.stop = deferredSyncQueue.decorate(function() {
        if (!presenter.audio.paused) {
            presenter.audio.pause();
            presenter.playingEventSent = false;
            presenter.sendOnPausedEvent();
        }

        presenter.audio.currentTime = 0;
        if (presenter.globalModel["Interface"] == "Draggable items") {
            presenter.stopDraggableItems();
        }
    });

    presenter.stopDraggableItems = function() {
        $(presenter.view).find('.multiaudio-item-wrapper.playing').removeClass('playing');
    };

    presenter.pause = function() {
        if (!presenter.audio.paused) {
            presenter.audio.pause();
            presenter.playingEventSent = false;
            presenter.sendOnPausedEvent();
        }
        presenter.stopDraggableItems();
    };

    presenter.show = function() {
        this.setVisibility(true);
        this.visible = true;
        if(audioStarted(this.audio)) {
            this.audio.play();
        }
    };

    function increaseVolume() {
        var volume = presenter.audio.volume;
        volume += 0.1;
        if (volume > 1.0) volume = 1.0;
        presenter.audio.volume = volume;
    };

    function decreaseVolume() {
        var volume = presenter.audio.volume;
        volume -= 0.1;
        if (volume < 0.0) volume = 0.0;
        presenter.audio.volume = volume;
    };

    function forward() {
        presenter.audio.currentTime += 5;
    }

    function backward() {
            presenter.audio.currentTime -= 5;
        }

    function playPause() {
        if (presenter.audio.paused) {
            presenter.play();
        } else {
            presenter.pause();
        }
    }

    function playStop() {
            if (presenter.audio.paused) {
                presenter.play();
            } else {
                presenter.stop();
            }
        }

    presenter.hide = function() {
        this.setVisibility(false);
        this.visible = false;
        if(audioStarted(this.audio)){
            this.audio.pause();
        }
    };

    function audioStarted(audio) {
        return audio.currentTime > 0;
    }
    
    presenter.reset = function() {
        this.visible = this.defaultVisibility;
        if (this.visible) {
            this.show();
        } else {
            this.hide();
        }
        this.stop();
        this.currentAudio = 0;
        presenter.loadFiles(this.audio, this.globalModel);

        if (presenter.globalModel["Interface"] == "Draggable items") {
            removeDraggableItems();
            for (var i = 0; i < presenter.globalModel.Files.length; i++) {
                createDraggableItem(presenter.globalModel.Files[i].ID);
            }
        }
    };

    presenter.jumpTo = function(audioNumber) {
        var newAudio = parseInt(audioNumber, 10) - 1;
        if (0 <= newAudio && newAudio < this.files.length) {
            presenter.sendOnPausedEvent();
            this.currentAudio = newAudio;
            presenter.isLoaded = false;
            presenter.loadFiles(this.audio, this.globalModel);
        }
    };

    presenter.jumpToCommand = function(params) {
        presenter.jumpTo(params[0]);
        presenter.playingEventSent = false;
    };

    presenter.previous = function() {
        if (this.currentAudio > 0) {
            presenter.sendOnPausedEvent();
            this.currentAudio--;
            this.initialize(this.globalView[0], this.globalModel);
        }
    };

    presenter.next = function() {
        if (this.currentAudio < this.files.length - 1) {
            presenter.sendOnPausedEvent();
            this.currentAudio++;
            this.initialize(this.globalView[0], this.globalModel);
        }
    };

    presenter.previousDraggableItem = function() {
        var itemIDs = Object.keys(presenter.draggableItems);
        if (itemIDs.length == 0){
            presenter.currentDraggableItemID = '';
            return;
        }
        if (presenter.currentDraggableItemID.length == 0) {
            presenter.currentDraggableItemID = itemIDs[itemIDs.length - 1];
            presenter.jumpToID(presenter.currentDraggableItemID);
            updateWCAGSelectedClass();
        } else {
            var index = itemIDs.indexOf(presenter.currentDraggableItemID);
            if (index > 0) {
                presenter.currentDraggableItemID = itemIDs[index-1];
                presenter.jumpToID(presenter.currentDraggableItemID);
                updateWCAGSelectedClass();
            }
        }
        }

    presenter.nextDraggableItem = function() {
        var itemIDs = Object.keys(presenter.draggableItems);
        if (itemIDs.length == 0){
            presenter.currentDraggableItemID = '';
            return;
        }
        if (presenter.currentDraggableItemID.length == 0) {
            presenter.currentDraggableItemID = itemIDs[0];
            presenter.jumpToID(presenter.currentDraggableItemID);
            updateWCAGSelectedClass();
        } else {
            var index = itemIDs.indexOf(presenter.currentDraggableItemID);
            if (index < itemIDs.length -1 && index != -1) {
                presenter.currentDraggableItemID = itemIDs[index+1];
                presenter.jumpToID(presenter.currentDraggableItemID);
                updateWCAGSelectedClass();
            }
        }
    }

    function updateWCAGSelectedClass() {
        if (presenter.globalModel["Interface"] != "Draggable items") return;

        clearWCAGSelectedClass();
        if (presenter.currentDraggableItemID.length > 0) {
            presenter.draggableItems[presenter.currentDraggableItemID].addClass('keyboard_navigation_active_element');
        }
    }

    function clearWCAGSelectedClass() {
        var activeClassName = 'keyboard_navigation_active_element';
        presenter.globalView.find('.'+activeClassName).removeClass(activeClassName);
    }

    presenter.jumpToID = function(id) {
        for (var i = 0; i < this.files.length; i++) {
            if (id === this.files[i].ID) {
                this.jumpTo(i + 1);  // Audio numbers are counted from 1 to n
                break;
            }
        }
    };

    presenter.jumpToIDCommand = function(params) {
        presenter.jumpToID(params[0]);
    };

    presenter.getState = function() {
        var state = {
            'visible' : "" + this.visible,
            'currentAudio' : "" + this.currentAudio,
            'currentTime'   : "" + this.audio.currentTime
        };
        var draggableKeys = Object.keys(presenter.draggableItems);
        if (draggableKeys.length != 0) {
            state['draggableItems'] = Object.keys(presenter.draggableItems).join(',')
        }
        return this.convertStateToString(state);
    };

    presenter.convertStateToString = function(state) {
        var stateString = "";
        $.each(state, function(key, value){
            stateString += "[" + key + ":" + value + "]";
        });
        return stateString;
    };

    presenter.convertStringToState = function(stateString) {
        var state = {};
        var pattern = /\w+:[\w|\,]+/g;
        var stateElements = stateString.match(pattern);
        for (var i = 0; i < stateElements.length; i++) {
            var keyAndValue = stateElements[i].split(":");
            var key = keyAndValue[0];
            state[key] = keyAndValue[1];
        }
        return state;
    };

    presenter.setState = function(stateString) {
        var state = this.convertStringToState(stateString);
        var visible = !!(state["visible"] == "true");
        var currentAudio = parseInt(state["currentAudio"]);
        var currentTime = parseInt(state["currentTime"]);

        if (visible) {
            this.show();
        } else {
            this.hide();
        }

        this.currentAudio = currentAudio;
        presenter.loadFiles(this.audio, this.globalModel);

        if (presenter.globalModel["Interface"] == "Draggable items") {
            var keys = Object.keys(presenter.draggableItems);
            if ('draggableItems' in state) {
                var loadedDraggableItems = state['draggableItems'].split(',');
                for (var i = 0; i < keys.length; i++) {
                    if (loadedDraggableItems.indexOf(keys[i]) == -1) {
                        removeDraggableItem(keys[i]);
                    }
                }
            } else {
                for (var i = 0; i < keys.length; i++) {
                    removeDraggableItem(keys[i]);
                }
            }
        }
    };

    presenter.validateFiles = function(files) {
        return !(!files["Ogg"] && !files["Mp3"]);
    };

    presenter.setWCAGStatus = function (isOn) {
            presenter.isWCAGOn = isOn;
            if (!isOn) {
                clearWCAGSelectedClass();
                presenter.currentDraggableItemID = '';
            }
        };

    presenter.keyboardController = function (keycode, isShift, event) {
        event.preventDefault();
        if (presenter.globalModel["Interface"] == "Draggable items") {
            presenter.draggableKeyboardController(keycode, isShift, event);
        } else {
            presenter.audioKeyboardController(keycode, isShift, event);
        }
    };

    presenter.draggableKeyboardController = function (keycode, isShift, event) {
        switch (keycode) {
            case 9: // TAB
                if (isShift) {
                    presenter.previousDraggableItem();
                } else {
                    presenter.nextDraggableItem();
                }
                readCurrentDraggableFileText();
                break;
            case 13: //ENTER
                if (isShift) {
                    presenter.stop();
                    clearWCAGSelectedClass();
                    presenter.currentDraggableItemID = '';
                } else {
                    if (presenter.currentDraggableItemID.length > 0) {
                        playStop();
                        updateWCAGSelectedClass();
                    }
                }
                break;
            case 32: //SPACE
                var itemID = presenter.files[presenter.currentAudio].ID;
                presenter.handleGrabAreaClick(itemID);
                break;
            case 38: // UP
                presenter.previousDraggableItem();
                readCurrentDraggableFileText();
                updateWCAGSelectedClass();
                break;
            case 40: // DOWN
                presenter.nextDraggableItem();
                readCurrentDraggableFileText();
                updateWCAGSelectedClass();
                break;
            case 37: // LEFT
                presenter.previousDraggableItem();
                readCurrentDraggableFileText();
                updateWCAGSelectedClass();
                break;
            case 39: // RIGHT
                presenter.nextDraggableItem();
                readCurrentDraggableFileText();
                updateWCAGSelectedClass();
                break;
            case 27: // ESC
                presenter.stop();
                clearWCAGSelectedClass();
                presenter.currentDraggableItemID = '';
                break;
        }
    }

    presenter.audioKeyboardController = function (keycode, isShift, event) {
        switch (keycode) {
            case 9: // TAB
                if (isShift) {
                    presenter.previous();
                } else {
                    presenter.next();
                }
                readCurrentAudioFileText();
                break;
            case 13: //ENTER
                if (!isShift) {
                    presenter.pause();
                    readCurrentAudioFileText();
                }
                break;
            case 32: // SPACE
                playPause();
                break;
            case 38: // UP
                increaseVolume();
                break;
            case 40: // DOWN
                decreaseVolume();
                break;
            case 37: // LEFT
                backward();
                break;
            case 39: // RIGHT
                forward();
                break;
            case 27: // ESC
                presenter.stop();
                break;
        }
    }

    function readSelected() {
        var textVoiceArray = [];
        textVoiceArray.push(getTextVoiceObject(presenter.speechTexts.selected, ""));
        speak(textVoiceArray);
    }

    function readDeselected() {
        var textVoiceArray = [];
        textVoiceArray.push(getTextVoiceObject(presenter.speechTexts.deselected, ""));
        speak(textVoiceArray);
    }

    function readCurrentDraggableFileText() {
        var textVoiceArray = [];
        if (Object.keys(presenter.draggableItems).length == 0) {
            textVoiceArray.push(getTextVoiceObject(presenter.speechTexts.empty, ""));
        } else {
            var item = presenter.files[presenter.currentAudio];
            textVoiceArray.push(getTextVoiceObject(item.Text, presenter.globalModel['langAttribute']));
            if (presenter.selectedItemID == item.ID) {
                textVoiceArray.push(getTextVoiceObject(presenter.speechTexts.selected, ""));
            }
        }
        speak(textVoiceArray);
    }

    function readCurrentAudioFileText() {
        var item = presenter.files[presenter.currentAudio];
        var textVoiceArray = [getTextVoiceObject(item.Text, presenter.globalModel['langAttribute'])];
        speak(textVoiceArray);
    }

    presenter.getTextToSpeechOrNull = function () {
        if (presenter.playerController) {
            return presenter.playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull();
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    return presenter;
}