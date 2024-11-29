function Addonmultiplegap_create(){
    /*
     * KNOWN ISSUES:
     *     Invalid properties values (Item width, Item height, Item spacing, Maximum item count):
     *          When addon validated model it checks only value of those properties by numerical values. If parsed
     *         value is not a number - no error message is showed - that's because calculated values from those
     *         properties are only used in CSS. Invalid CSS value set with jQuery will simply not be added to
     *         DOM element, but it won't brake anything. Changing this behaviour will break backward compatibility!
     */

    function getTextVoiceObject (text, lang) {return {text: text, lang: lang};}
    var isWCAGOn = false;
    var printableController = null;

    var presenter = function(){};

    function getPlaceholders() {
        return jQuery.map(presenter.$view.find('.placeholder:not(.placeholder-show-answers)'), function (placeholder) {
            return {
                item: $(placeholder).attr('draggableItem'),
                value: $(placeholder).attr('draggableValue'),
                type: $(placeholder).attr('draggableType')
            };
        });
    }
    
    presenter.ORIENTATIONS = {
        HORIZONTAL: 0,
        VERTICAL: 1
    };
    
    presenter.SOURCE_TYPES = {
        IMAGES: 0,
        TEXTS: 1,
        AUDIO: 2
    };

    presenter.ERROR_CODES = {
        INVALID_ITEM_WIDTH: "Item width has to be greater than 0",
        INVALID_ITEM_HEIGHT: "Item height has to be greater than 0",
        INVALID_ITEM_SPACING: "Item spacing has to be greater or equal than 0",
        INVALID_MAXIMUM_ITEM_COUNT: "Maximum item count has to be greater or equal than 1",
        INVALID_NUMBER_OF_REPETITION: "Incorrect value. It should be integer and greater than 0",
        INVALID_REPEATED_ELEMENT: "Incorrect value. This field should contains only one ID"
    };
    
    presenter.eventBus            = null;
    presenter.playerController    = null;
    
    presenter.$view               = null;
    
    presenter.selectedItem        = null;
    
    presenter.showErrorsMode      = false;
    presenter.isShowAnswersActive = false;
    presenter.isGradualShowAnswersActive = false;
    presenter.itemCounterMode = false;
    presenter.placeholders2drag = [];

    presenter.keyboardControllerObject = null;
    presenter.container = null;
    presenter.elementCounter = 0;
    
    presenter.createPreview = function(view, model) {
        presenter.createLogic(view, model, true);
    };
    
    presenter.run = function(view, model) {
        presenter.createLogic(view, model, false);
    };
    
    presenter.validateItems = function (model) {
        var itemWidth = parseInt(model['Item width']);
        if (!isNaN(itemWidth) && itemWidth <= 0) {
            return {isError: true, errorCode: 'INVALID_ITEM_WIDTH'};
        }
        
        var itemHeight = parseInt(model['Item height']);
        if (!isNaN(itemHeight) && itemHeight <= 0) {
            return {isError: true, errorCode: 'INVALID_ITEM_HEIGHT'};
        }
        
        var itemSpacing = parseInt(model['Item spacing']);
        if (!isNaN(itemSpacing) && itemSpacing < 0) {
            return {isError: true, errorCode: 'INVALID_ITEM_SPACING'};
        }
        
        var maximumItemCount = parseInt(model['Maximum item count']);
        if (!isNaN(maximumItemCount) && maximumItemCount < 1) {
            return {isError: true, errorCode: 'INVALID_MAXIMUM_ITEM_COUNT'};
        }
        
        return {
            isError: false,
            value: {
                width: itemWidth,
                height: itemHeight,
                spacing: itemSpacing,
                maximumCount: maximumItemCount,
                horizontalAlign: model['Item horizontal align'],
                verticalAlign: model['Item vertical align']
            }
        };
    };
    
    presenter.validateRepetitions = function(number) {
        if (number === undefined || number === "") {
            number = 0;
        }
        number = parseInt(number, 10);
        if (isNaN(number) || number < 0) {
            return {isError: true, errorCode: 'INVALID_NUMBER_OF_REPETITION'};
        }
        
        return {
            isError: false,
            value: number
        }
    };
    
    presenter.validateIdRepeatedElement = function(id) {
        id = id || "";
        
        if (id.indexOf(",") !== -1 || id.indexOf(";") !== -1) {
            return {isError: true, errorCode: 'INVALID_REPEATED_ELEMENT'};
        }
        
        return {
            isError: false,
            value: id
        }
    };
    
    presenter.upgradeModel = function (model) {
        var upgradedModel = model;
        if (model["wrapItems"] === undefined) {
            upgradedModel = this.upgradeWrapItems(model);
        }
        upgradedModel = presenter.upgradeSpeechTexts(upgradedModel);
        return upgradedModel;
    };
    
    presenter.upgradeWrapItems = function (model) {
        model["wrapItems"] = false;
        
        return model;
    };

    presenter.upgradeSpeechTexts = function (model) {
         var upgradedModel = {};
        $.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]['Inserted']) {
            upgradedModel["speechTexts"]['Inserted'] = {Inserted: 'Inserted'};
        }
        if (!upgradedModel["speechTexts"]['Removed']) {
            upgradedModel["speechTexts"]['Removed'] = {Removed: 'Removed'};
        }
        if (!upgradedModel["speechTexts"]['Empty']) {
            upgradedModel["speechTexts"]['Empty'] = {Empty: 'Empty'};
        }
        if (!upgradedModel["speechTexts"]['Correct']) {
            upgradedModel["speechTexts"]['Correct'] = {Correct: 'Correct'};
        }
        if (!upgradedModel["speechTexts"]['Wrong']) {
            upgradedModel["speechTexts"]['Wrong'] = {Wrong: 'Wrong'};
        }
        if (!upgradedModel["langAttribute"]) {
            upgradedModel["langAttribute"] = "";
        }
        return upgradedModel;
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    function setSpeechTexts (speechTexts) {
        presenter.speechTexts = {
            inserted:  'inserted',
            removed: 'removed',
            empty: 'empty',
            correct: 'correct',
            wrong: 'wrong'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            inserted:    getSpeechTextProperty(speechTexts['Inserted']['Inserted'], presenter.speechTexts.inserted),
            removed: getSpeechTextProperty(speechTexts['Removed']['Removed'], presenter.speechTexts.removed),
            empty: getSpeechTextProperty(speechTexts['Empty']['Empty'], presenter.speechTexts.empty),
            correct: getSpeechTextProperty(speechTexts['Correct']['Correct'], presenter.speechTexts.correct),
            wrong: getSpeechTextProperty(speechTexts['Wrong']['Wrong'], presenter.speechTexts.wrong)
        };
    }
    
    
    presenter.validateModel = function (model) {
        setSpeechTexts(model['speechTexts']);
        var orientation = presenter.ORIENTATIONS.HORIZONTAL;
        if (model['Orientation'] === "vertical") {
            orientation = presenter.ORIENTATIONS.VERTICAL;
        }
        
        var sourceType = presenter.SOURCE_TYPES.IMAGES;
        if (model['Source type'] === "texts") {
            sourceType = presenter.SOURCE_TYPES.TEXTS;
        } else if (model['Source type'] === 'audio') {
            sourceType = presenter.SOURCE_TYPES.AUDIO;
        }
        
        var validatedItems = presenter.validateItems(model);
        if (validatedItems.isError) {
            return validatedItems;
        }
        
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var validatedRepetitions = presenter.validateRepetitions(model["Number of repetitions"]);
        var validateRepeatedElement = presenter.validateIdRepeatedElement(model["ID repeated element"]);

        var isTabindexEnabled = ModelValidationUtils.validateBoolean(model["Is Tabindex Enabled"]);
        
        if (validatedRepetitions.isError) {
            return validatedRepetitions;
        }
        if (validateRepeatedElement.isError) {
            return validateRepeatedElement;
        }
        
        return {
            isError: false,
            ID: model.ID,
            isActivity: !ModelValidationUtils.validateBoolean(model['Is not an activity']),
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            orientation: orientation,
            sourceType: sourceType,
            stretchImages: model['Stretch images?'] === 'True',
            items: validatedItems.value,
            itemsAnswersID: model['Items'].map(function (item) {
                return item['Answer ID'];
            }),
            repetitions: validatedRepetitions.value,
            repeatedElement: validateRepeatedElement.value,
            blockWrongAnswers: ModelValidationUtils.validateBoolean(model["Block wrong answers"]),
            wrapItems: ModelValidationUtils.validateBoolean(model["wrapItems"]),
            isTabindexEnabled: isTabindexEnabled,
            langTag: model['langAttribute']
        };
    };
    
    presenter.destroyCommands = function Multiplegap_destroyCommands() {
        delete presenter.executeCommand;
        delete presenter.countItems;
        delete presenter.isAllOK;
        delete presenter.isAttempted;
        delete presenter.show;
        delete presenter.hide;
        delete presenter.getMaxScore;
        delete presenter.getScore;
        delete presenter.getErrorCount;
        delete presenter.setShowErrorsMode;
        delete presenter.setWorkMode;
        delete presenter.reset;
        delete presenter.getState;
        delete presenter.setState;
    };
    
    presenter.createView = function Multiplegap_createView () {
        var container = $('<div class="multiplegap_container"></div>');

        if (this.configuration.isTabindexEnabled) {
            container.attr("tabindex", "0");
        }

        container.click (function (event) {
            event.stopPropagation ();
            event.preventDefault ();
        });
        var placeholders = $('<div class="multiplegap_placeholders"></div>');
        
        container.append(placeholders);
        
        container.addClass("multiplegap_" + (presenter.configuration.orientation === presenter.ORIENTATIONS.HORIZONTAL ? "horizontal" : "vertical"));
        container.addClass("multiplegap_" + (presenter.configuration.sourceType === presenter.SOURCE_TYPES.TEXTS ? "texts" : "images" ));
        
        container.css ({
            width: presenter.$view.css ('width'),
            height: presenter.$view.css ('height')
        });
        
        container.click (presenter.acceptDraggable);

        var originalGeneratePosition = null;
        container.droppable ({
            drop: function (event, ui) {
                if (!presenter.configuration.isVisible) {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
                container.click();
            },
            activate: function (event, ui) {
                if (presenter.$view.find('.dragging').length > 0 && originalGeneratePosition == null) {
                    originalGeneratePosition = $.ui.draggable.prototype._generatePosition;
                    $.ui.draggable.prototype._generatePosition = scaledOriginalPositionDecorator($.ui.ddmanager.current, originalGeneratePosition);
                }
            },
            deactivate: function (event, ui) {
                if (originalGeneratePosition != null) {
                    $.ui.draggable.prototype._generatePosition = originalGeneratePosition;
                    originalGeneratePosition = null;
                }
            }
        });

        presenter.container = container;
        presenter.$view.append(container);
    };

    function scaledOriginalPositionDecorator(obj, fn) {

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

        obj.isGeneratePositionScaled = true; //add marker to draggable for use in the droppable intersect fix
        return function (event) {
            var scale = getScale();
            var pos = fn.apply(obj, [event]);
            return {left: pos.left / scale.X, top: pos.top / scale.Y};
        }
    }
    
    presenter.setUpEventListeners = function Multiplegap_setUpEventListeners (isPreview) {
        if (!isPreview) {
            presenter.pageLoadedDeferred = new $.Deferred();
            presenter.pageLoaded = presenter.pageLoadedDeferred.promise ();
            
            presenter.eventBus.addEventListener ('ItemSelected', presenter.eventListener);
            presenter.eventBus.addEventListener ('ItemConsumed', presenter.eventListener);
            presenter.eventBus.addEventListener ('PageLoaded', this);
            presenter.eventBus.addEventListener ('ShowAnswers', this);
            presenter.eventBus.addEventListener ('HideAnswers', this);
            presenter.eventBus.addEventListener ('NotAllAttempted', this);
            presenter.eventBus.addEventListener ('Submitted', this);
            presenter.eventBus.addEventListener ('ValueChanged', this);
            presenter.eventBus.addEventListener('GradualShowAnswers', this);
            presenter.eventBus.addEventListener('GradualHideAnswers', this);
        }
    };

    presenter.createLogic = function Multiplegap_createLogic (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.addonID = model.ID;
        
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);
        presenter.setItemCounterModeValue();
        
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            presenter.destroyCommands ();
            return;
        }
        
        presenter.setUpEventListeners(isPreview);
        presenter.createView();
        
        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hide();
        }

        presenter.buildKeyboardController();
        presenter.elementCounter = presenter.$view.find('.placeholder').not('.ui-draggable-dragging').length;
    };
    
    presenter.setItemCounterModeValue = function MultipleGap_setItemCounterModeValue () {
        if (presenter.configuration.repetitions !== undefined &&
          presenter.configuration.repeatedElement !== undefined &&
          presenter.configuration.repetitions !== 0 &&
          presenter.configuration.repeatedElement !== "")
        {
            presenter.itemCounterMode = true;
        }
    };
    
    presenter.eventListener = {
        onEventReceived: function(eventName, eventData) {
            if(presenter.showErrorsMode || presenter.isShowAnswersActive) return;

            switch (true) {
                case eventName === "ItemConsumed":
                    presenter.$view.find('.handler').show();
                    presenter.isItemChecked = false;
                    break;

                case eventName === "ItemSelected" && eventData.value !== null && eventData.value !== "":
                    presenter.$view.find('.handler').hide();
                    presenter.isItemChecked = true;
                    break;

                case eventName === "ItemSelected" && eventData.value == null && presenter.isAllOK():
                    presenter.$view.find('.handler').show();
                    presenter.isItemChecked = false;
                    sendAllOKEvent();
                    break;

                case eventName === "ItemSelected":
                    presenter.$view.find('.handler').show();
                    presenter.isItemChecked = false;
                    break;
            }

            switch (true) {
                case typeof(eventData.item) == "undefined" || eventData.item === null:
                    presenter.clearSelected();
                    break;

                case presenter.configuration.sourceType === presenter.SOURCE_TYPES.IMAGES && eventData.type === "image":
                case presenter.configuration.sourceType === presenter.SOURCE_TYPES.TEXTS && eventData.type === "string":
                case presenter.configuration.sourceType === presenter.SOURCE_TYPES.AUDIO && eventData.type === "audio":
                    presenter.saveSelected(eventData);
                    break;

                default:
                    presenter.clearSelected();
            }
        }
    };
    
    presenter.selectorRootClass = function() {
        switch(presenter.configuration.sourceType) {
            case presenter.SOURCE_TYPES.IMAGES:
                return ".multiplegap_images";
            
            case presenter.SOURCE_TYPES.TEXTS:
                return ".multiplegap_texts";
        }
    };
    
    presenter.clearSelected = function() {
        presenter.selectedItem = null;
        $(presenter.selectorRootClass() + '.multiplegap_active').removeClass('multiplegap_active');
        
        $(presenter.selectorRootClass() + ' .placeholder_inactive').removeClass('placeholder_inactive');
        
        $(presenter.selectorRootClass() + ' .handler_disabled')
          .click(presenter.removeDraggable)
          .removeClass('handler_disabled');
        
        $(presenter.selectorRootClass() + '>.handler').hide();
    };
    
    presenter.saveSelected = function(eventData) {
        presenter.selectedItem = eventData;
        
        if(!presenter.maximumItemCountReached()) {
            presenter.$view.find('.multiplegap_container').addClass('multiplegap_active');
        }
        
        if (!presenter.isItemChecked) {
            presenter.$view.find('.multiplegap_container').removeClass('multiplegap_active');
        }
    };
    
    presenter.acceptDraggable = function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        if(presenter.showErrorsMode || presenter.isShowingAnswers() || !presenter.isItemChecked) {
            return;
        }

        presenter.performAcceptDraggable($(e.target), presenter.selectedItem, true, false, false);
        presenter.$view.find('.handler').show();
        presenter.$view.find('.multiplegap_container').removeClass('multiplegap_active');
        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());

        if (presenter.configuration.isTabindexEnabled) {
            presenter.container.removeAttr("tabindex");
        }
    };
    
    presenter.maximumItemCountReached = function() {
        return presenter.countItems() >= presenter.configuration.items.maximumCount;
    };
    
    presenter.parseItemValue = function (item) {
        if(item.indexOf("**") > -1 || item.indexOf("__") > -1){
            return item.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/__(.*?)__/g, "<i>$1</i>").replace(/__(.*?)_/g, "<i>$1_</i>").replace(/\*\*(.*?)\*/g, "<b>$1*</b>").replace(/_(.*?)__/g, "_$1").replace(/\*(.*?)\*\*/g, "*$1");
        }else{
            return item;
        }
    };
    
    presenter.getImageURL = function (elem) {
        var imageSourceModule = presenter.playerController.getModule(elem.item);
        
        if (imageSourceModule == null || !imageSourceModule.hasOwnProperty('getImageUrl')) {
            return '';
        }

        return imageSourceModule.getImageUrl();
    };

    presenter.updateLaTeX = function (element) {
        MathJax.Hub.Queue(() => {
            MathJax.Hub.Typeset(element)
        });
    };


    presenter.getAltText = function (id) {
        var imageSourceModule = presenter.playerController.getModule(id);
        if (imageSourceModule == null || !imageSourceModule.hasOwnProperty('getAltText')) {
            return '';
        }
        return imageSourceModule.getAltText();
    };

    presenter.getItemLangAttribute = function (id) {
        var imageSourceModule = presenter.playerController.getModule(id);
        if (imageSourceModule == null || !imageSourceModule.hasOwnProperty('getLangAttribute')) {
            return '';
        }
        return imageSourceModule.getLangAttribute();
    };
    
    presenter.calculateElementPositions = function () {
        var orientation = presenter.configuration.orientation;
        var wrapItems = presenter.configuration.wrapItems;
        var isHorizontalOrientation = orientation === presenter.ORIENTATIONS.HORIZONTAL;
        var isVerticalOrientation = orientation === presenter.ORIENTATIONS.VERTICAL;
        var elementWidth = presenter.configuration.items.width;
        var elementHeight = presenter.configuration.items.height;
        var rowPositions;
        
        var positions;
        if (isHorizontalOrientation && !wrapItems) {
            positions = {
                left: presenter.calculateSpaceUsedByElements(presenter.configuration.items.width),
                top: 0
            };
        } else if (isVerticalOrientation && !wrapItems) {
            positions = {
                left: 0,
                top: presenter.calculateSpaceUsedByElements(presenter.configuration.items.height)
            };
        } else if (isHorizontalOrientation && wrapItems) {
            rowPositions = presenter.calculatePositionsInRow(presenter.getContainerWidth(), elementWidth, elementHeight);
            positions = {
                top: rowPositions.rowPosition,
                left: rowPositions.positionInRow
            };
        } else if (isVerticalOrientation && wrapItems) {
            rowPositions = presenter.calculatePositionsInRow(presenter.getContainerHeight(), elementHeight, elementWidth);
            positions = {
                top: rowPositions.positionInRow,
                left: rowPositions.rowPosition
            };
        }
        
        return positions;
    };
    
    presenter.calculatePositionsInRow = function (containerSize, elementSize, rowSize, itemsCountFixed) {
        var elementSpacing = presenter.configuration.items.spacing;
        var howManyInRow = presenter.calculateHowManyElementsInContainer(containerSize, elementSize, elementSpacing);
        var countItems = presenter.countItems(itemsCountFixed);
        var row = parseInt(countItems / howManyInRow, 10);
        
        var rowPosition = 0;
        var positionInRow = presenter.calculateSpaceUsedByElements(elementSize, countItems);
        if (row > 0) {
            var itemInRow = countItems - (howManyInRow * row);
            rowPosition = row * (rowSize + elementSpacing);
            positionInRow = itemInRow * (elementSize + elementSpacing);
        }
        
        return {
            rowPosition: rowPosition,
            positionInRow: positionInRow
        };
    };
    
    presenter.calculateHowManyElementsInContainer = function (containerSize, elementSize, spacing) {
        var howManyInContainer = 1;
        var usedSize = elementSize;
        
        while (true) {
            usedSize += spacing;
            usedSize += elementSize;
            
            if (usedSize <= containerSize) {
                howManyInContainer++;
            } else {
                break;
            }
        }
        
        return howManyInContainer;
    };
    
    presenter.calculateSpaceUsedByElements = function (elementSize, itemsToCount) {
        return presenter.countItems(itemsToCount) * (elementSize + presenter.configuration.items.spacing);
    };
    
    presenter.getContainerWidth = function () {
        return presenter.$view.width();
    };
    
    presenter.getContainerHeight = function () {
        return presenter.$view.height();
    };

    presenter.performAcceptDraggable = function(handler, item, sendEvents, force, isState) {
        if(!presenter.isShowingAnswers()){
            if(!force && presenter.selectedItem == null) return;
            if(presenter.maximumItemCountReached()) return;
            if(presenter.configuration.blockWrongAnswers && !presenter.isElementCorrect(item.item)) {
                if (sendEvents) {
                    sendEvent(item, false);
                }
                return;
            }
        }

        const placeholder = presenter.createDraggablePlaceholderBase(item);
        const child = presenter.createDraggableItem(item);

        presenter.$view.find('.multiplegap_placeholders').append(placeholder);
        presenter.elementCounter++;
        placeholder.append(child);

        if (!isState) {
            presenter.updateLaTeX(child[0]);
        }

        presenter.positionDraggableItem(placeholder, child);

        handler = $('<div class="handler" style="color: rgba(0,0,0,0.0); font-size:1px">' + presenter.getAltText(item.item) + '</div>');
        
        // Workaround for IE bug: empty divs in IE are not clickable so let's
        // make them not empty and appear as empty.
        if($.browser.msie) {
            handler.css({backgroundColor: "#000000", opacity: 0 });
        }

        // If the source type is audio, the handler should only cover the grab area and leave the button uncovered
        if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.AUDIO) {
            handler.css('width','50px');
        }
        
        handler.click(presenter.removeDraggable);
        placeholder.append(handler);
        
        if(sendEvents) {
            sendEvent(item, true);
        }
        
        $(presenter.selectorRootClass() + '>.handler').hide();
        
        presenter.clearSelected();
        
        if (isState) {
            presenter.placeholders2drag.push(placeholder);
        } else {
            presenter.makePlaceholderDraggable(placeholder);
        }

        if(isWCAGOn) {
            presenter.handleDraggableItemTTS(child)
        }
    };

    presenter.createDraggablePlaceholderBase = function(item) {
        const placeholder = presenter.isShowingAnswers()
            ? $('<div class="placeholder placeholder-show-answers"></div>')
            : $('<div class="placeholder"></div>')

        const positions = presenter.calculateElementPositions();
        placeholder.css({
            top: positions.top + 'px',
            left: positions.left + 'px',
            width: presenter.configuration.items.width + 'px',
            height: presenter.configuration.items.height + 'px'
        });

        placeholder.attr({
              draggableValue: item.value,
              draggableItem: item.item,
              draggableType: item.type
          })

        if (presenter.configuration.isTabindexEnabled) {
            placeholder.attr("tabindex", "0");
        }

        return placeholder;
    };

    presenter.createDraggableItem = function(item) {
        const sourceType = presenter.configuration.sourceType;
        const draggableItemConstructorMap = {
            [presenter.SOURCE_TYPES.TEXTS]: presenter.createDraggableTextItem,
            [presenter.SOURCE_TYPES.IMAGES]: presenter.createDraggableImageItem,
            [presenter.SOURCE_TYPES.AUDIO]: createDraggableAudioItem,
        }

        return draggableItemConstructorMap[sourceType](item);
    };

    presenter.createDraggableTextItem = function(item) {
        var child = $('<p class="contents"></p>');
        var parsedValue = item.value;
        if (parsedValue.match(/<[^ ].*>/) == null) {
            parsedValue = item.value.replace('<', '< ');
        }
        child.html(presenter.parseItemValue(parsedValue));

        if (presenter.playerController) {
            child.html(presenter.playerController.getTextParser().parseAltTexts(child.html()));
        } else {
            child = window.TTSUtils.parsePreviewAltText(child);
        }

        return child;
    };

    presenter.createDraggableImageItem = function(item) {
        const child = $(`<img class="contents" alt="${presenter.getAltText(item.item)}" lang="${presenter.getItemLangAttribute(item.item)}" />`);
        child.attr('src', presenter.getImageURL(item));

        if(presenter.configuration.stretchImages) {
            child.css({
                width: presenter.configuration.items.width + 'px',
                height: presenter.configuration.items.height + 'px'
            });
        }

        return child;
    };

    function createDraggableAudioItem (item) {
        const itemID = item.item
        var $el = $('<div></div>');

        var addonAndItemIds = itemID.split('-');
        if (addonAndItemIds.length !== 2) return;
        var audioAddonID = addonAndItemIds[0];
        var audioItemID = addonAndItemIds[1];

        $el.attr('data-audio-id', audioItemID);
        $el.attr('data-addon-id', audioAddonID);
        $el.addClass('multiaudio-item-wrapper');

        var $grab = $('<div></div>');
        $grab.addClass('multiaudio-item-grab-area');
        $el.append($grab);

        var audioAddon = presenter.playerController.getModule(audioAddonID);
        if (audioAddon != null) {
            var itemText = audioAddon.getTextFromFileID(audioItemID);
            if (presenter.playerController) {
                itemText = presenter.playerController.getTextParser().parseAltTexts(itemText);
            } else {
                itemText = window.TTSUtils.parsePreviewAltText(itemText);
            }
            if (itemText !== null && $("<span>"+itemText+"</span>").text().length > 0) {
                var $text = $('<span></span>');
                $text.addClass('multiaudio-item-text');
                $text.html(itemText);
                $grab.append($text);
                $el.addClass("multiaudio-item-has-text");
            }
        }

        var $button = $('<div></div>');
        $button.addClass('multiaudio-item-button');
        $el.append($button);

        var $icon = $('<div></div>');
        $icon.addClass('multiaudio-item-icon');
        $button.append($icon);

        $button.click(function (event) {
            var $parent = $(event.currentTarget).parent();
            playDraggableAudio($parent, audioItemID, audioAddonID);
        });

        return $el;
    };

    function playDraggableAudio($parent, itemID, audioAddonID) {
        var audioAddon = presenter.playerController.getModule(audioAddonID);
        if ($parent.hasClass('playing')) {
            $parent.removeClass('playing');
            audioAddon.stop();
            audioAddon.jumpToID(itemID);
        } else {
            $parent.addClass('playing');
            audioAddon.jumpToID(itemID);
            audioAddon.play();
        }
    }

    function stopDraggableAudioOnRemove(helper, draggableItem) {
        if (presenter.configuration.sourceType !== presenter.SOURCE_TYPES.AUDIO) return;

        var addonAndItemIds = draggableItem.split('-');
        if (addonAndItemIds.length !== 2) return;

        var audioAddonID = addonAndItemIds[0];
        var audioAddon = presenter.playerController.getModule(audioAddonID);

        var itemID = addonAndItemIds[1];

        helper.find('.playing').each(function(){ //there should be no more than one such element
            var $this = $(this);
            $this.removeClass('playing');
            audioAddon.stop();
            audioAddon.jumpToID(itemID);
        })
    }

    presenter.positionDraggableItem = function(placeholder, item) {
        presenter.applyDraggableItemHorizontalPositioning(placeholder, item);
        presenter.applyDraggableItemVerticalPositioning(placeholder, item);
    };

    presenter.applyDraggableItemHorizontalPositioning = function(placeholder, item) {
        const sourceType = presenter.configuration.sourceType;
        const placeholderPadding = DOMOperationsUtils.getOuterDimensions(placeholder).padding;
        const placeholderHorizontalPadding = placeholderPadding.top + placeholderPadding.bottom;
        const horizontalAlignType = presenter.configuration.items.horizontalAlign;

        const centerTypeStylesBasedOnSourceTypeMap = {
            [presenter.SOURCE_TYPES.TEXTS]: { position: 'absolute', width: '100%', textAlign: 'center' },
            [presenter.SOURCE_TYPES.IMAGES]: { position: 'absolute', left: Math.round((presenter.configuration.items.width - placeholderHorizontalPadding - parseInt(item.css('width'))) / 2) + 'px'},
        }

        switch(horizontalAlignType) {
            case 'center':
                item.css(centerTypeStylesBasedOnSourceTypeMap[sourceType])
                break;
            case 'right':
            case 'left':
                item.css({
                    position: 'absolute',
                    [horizontalAlignType]: 0
                });
                break;
        }
    }

    presenter.applyDraggableItemVerticalPositioning = function(placeholder, item) {
        const placeholderPadding = DOMOperationsUtils.getOuterDimensions(placeholder).padding;
        const placeholderVerticalPadding = placeholderPadding.left + placeholderPadding.right;
        const verticalAlignType = presenter.configuration.items.verticalAlign;

        switch(verticalAlignType) {
            case 'center':
                item.css({
                    position: 'absolute',
                    top: Math.round((presenter.configuration.items.height - placeholderVerticalPadding - parseInt(item.css('height'))) / 2) + 'px'
                });
                break;
            case 'top':
            case 'bottom':
                item.css({
                    position: 'absolute',
                    [verticalAlignType]: 0
                });
                break;
        }
    }

    presenter.handleDraggableItemTTS = function(child) {
        var altText = "";
        var langTag = "";
        var voicesArray = [];
        voicesArray.push(getTextVoiceObject(presenter.speechTexts.inserted));
        if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.AUDIO) {
            voicesArray = voicesArray.concat(window.TTSUtils.getTextVoiceArrayFromElement(child, presenter.configuration.langTag));
        } else {
            if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.IMAGES) {
                altText = child.attr('alt');
                langTag = child.attr('lang');
                voicesArray.push(getTextVoiceObject(altText,langTag));
            } else {
                // presenter.SOURCE_TYPES.TEXTS
                voicesArray = voicesArray.concat(window.TTSUtils.getTextVoiceArrayFromElement(child, presenter.configuration.langTag));
            }
        }
        presenter.speak(voicesArray);
    }
    
    function sendEvent(item, consumed) {
        if (consumed) {
            presenter.eventBus.sendEvent('ItemConsumed', item);
        }
        
        var score;
        if (presenter.isElementCorrect(item.item)){
            score = 1;
        } else{
            score = 0;
        }

        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item'  : '' + item.item, // ensure that we send string
            'value' : 'add',
            'score' : score
        });
        
        if (presenter.isAllOK()) sendAllOKEvent();
    }
    
    presenter.isElementCorrect = function (item) {
        return presenter.configuration.itemsAnswersID.indexOf(item) > -1;
    };
    
    presenter.makePlaceholderDraggable = function(placeholder) {
        placeholder.draggable({
            revert : false,
            helper: function() {
                if (!presenter.isDragPossible()) {
                    return $('<div></div>');
                }
                placeholder.addClass('dragging');
                
                presenter.itemDragged(placeholder);
                return getDraggedSrc(placeholder).clone().show();
            },
            cursorAt: calculateCursorPosition(placeholder),
            appendTo: getDraggedSrc(placeholder) === placeholder ? 'parent' : placeholder.parents('.ic_page:first'),
            start : function(event, ui) {
                if (!presenter.isDragPossible()) {
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                ui.helper.zIndex(100);

            },
            stop : function(event, ui) {
                placeholder.removeClass('dragging');
                ui.helper.zIndex(0);
                ui.helper.remove();
                presenter.itemStopped(placeholder);
                ui.helper.remove();
            }
        });
    };
    
    var getDraggedSrc = function(placeholder) {
        var isAudioGap = presenter.configuration.sourceType === presenter.SOURCE_TYPES.AUDIO;
        if (placeholder.parents('.multiplegap_container').css("overflow") === "hidden" && !isAudioGap) {
            if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.IMAGES) {
                return $("[id='" + placeholder.attr('draggableitem') + "']");
            } else {
                var item_id = placeholder.attr('draggableitem');
                var container_id = item_id.replace(/\-[0-9]+$/, '');
                return $(presenter.playerController.getModule(container_id).getItemView(item_id));
            }
        } else {
            return placeholder;
        }
    };
    
    var calculateCursorPosition = function(placeholder) {
        var obj = getDraggedSrc(placeholder);
        var position;
        if (obj === placeholder) {
            position = {
                left: Math.round(obj.outerWidth() / 2),
                top: Math.round(obj.outerHeight() / 2)
            };
        } else {
            var src = obj.clone();
            src.width(obj.width());
            src.height(obj.height());
            presenter.$view.parents('.ic_page:first').append(src);
            position = {
                left:  Math.round(src.outerWidth()/2),
                top: Math.round(src.outerHeight()/2)
            };
            src.remove();
        }
        return position;
    };
    
    presenter.isDragPossible = function() {
        if (presenter.showErrorsMode || presenter.isShowingAnswers()) {
            return false;
        }
        return true;
    };
    
    presenter.itemDragged = function(placeholder) {
        var evnt = {
            source: presenter.configuration.ID,
            value: placeholder.attr('draggableValue'),
            item: placeholder.attr('draggableItem'),
            type: placeholder.attr('draggableType')
        };
        presenter.performRemoveDraggable(placeholder.find('.handler'), true);
        presenter.eventBus.sendEvent('itemDragged', evnt);
    };
    
    presenter.itemStopped = function(placeholder) {
        var value = placeholder.attr('draggableValue') + '';
        var item = placeholder.attr('draggableItem') + '';
        var type = placeholder.attr('draggableType') + '';
        placeholder.remove();

        var evnt = {
            source: presenter.configuration.ID,
            value: value,
            item: item,
            type: type
        };
        presenter.eventBus.sendEvent('itemStopped', evnt);
        presenter.$view.find('.placeholder').each(presenter.movePlaceholdersAfterRemove);
    };
    
    presenter.removeDraggable = function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        if(presenter.showErrorsMode || presenter.isShowingAnswers()) {
            return;
        }
        presenter.performRemoveDraggable($(e.target));
        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());

        if(presenter.configuration.isTabindexEnabled && presenter.$view.find('.placeholder').length === 0) {
            presenter.container.attr("tabindex", "0");
        }
    };
    
    presenter.performRemoveDraggable = function(handler) {
        presenter.elementCounter--;
        var placeholder = handler.parent();
        var child = placeholder.find('.contents, .multiaudio-item-text');
        if(isWCAGOn) {
            var altText = "";
            var langTag = "";
            var voicesArray = [];
            voicesArray.push(getTextVoiceObject(presenter.speechTexts.removed));
            if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.IMAGES) {
                altText = child.attr('alt');
                langTag = child.attr('lang');
                voicesArray.push(getTextVoiceObject(altText,langTag));
            } else {
                voicesArray = voicesArray.concat(window.TTSUtils.getTextVoiceArrayFromElement(child, presenter.configuration.langTag));
            }
            presenter.speak(voicesArray);
        }

        if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.AUDIO) {
            stopDraggableAudioOnRemove(placeholder, placeholder.attr('draggableitem'));
        }

        if (arguments[1]) {
            placeholder.hide();
            if (placeholder.is(":visible")) {
                placeholder.style("display", "none", "important");
            }
        } else {
            placeholder.remove();
        }
        
        presenter.$view.find('.placeholder').each(presenter.movePlaceholdersAfterRemove);
        
        presenter.eventBus.sendEvent('ItemReturned', {
            value: placeholder.attr('draggableValue'),
            item: placeholder.attr('draggableItem'),
            type: placeholder.attr('draggableType')
        });
        
        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item'  : '' + placeholder.attr('draggableItem'), // ensure that we send string
            'value' : 'remove',
            'score' : '0'
        });

        if (presenter.isAllOK()) sendAllOKEvent();
    };
        
    presenter.movePlaceholdersAfterRemove = function (index, element) {
        var orientation = presenter.configuration.orientation;
        var wrapItems = presenter.configuration.wrapItems;
        var isHorizontalOrientation = orientation === presenter.ORIENTATIONS.HORIZONTAL;
        var isVerticalOrientation = orientation === presenter.ORIENTATIONS.VERTICAL;
        var positions;
        var rowPositions;
        var elementWidth = presenter.configuration.items.width;
        var elementHeight = presenter.configuration.items.height;
        
        if (isHorizontalOrientation && !wrapItems) {
            positions = {
                left: presenter.calculateSpaceUsedByElements(presenter.configuration.items.width, index),
                top: 0
            };
        } else if (isVerticalOrientation && !wrapItems) {
            positions = {
                left: 0,
                top: presenter.calculateSpaceUsedByElements(presenter.configuration.items.height, index)
            };
        } else if (isHorizontalOrientation && wrapItems) {
            rowPositions = presenter.calculatePositionsInRow(presenter.getContainerWidth(), elementWidth, elementHeight, index);
            positions = {
                top: rowPositions.rowPosition,
                left: rowPositions.positionInRow
            };
            
        } else if (isVerticalOrientation && wrapItems) {
            rowPositions = presenter.calculatePositionsInRow(presenter.getContainerHeight(), elementHeight, elementWidth, index);
            positions = {
                top: rowPositions.positionInRow,
                left: rowPositions.rowPosition
            };
        }
        
        $(element).css({
            left: positions.left + 'px',
            top: positions.top + 'px'
        });
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    presenter.setEventBus = function (eventBus) {
        presenter.eventBus = eventBus;
    };
    
    function sendAllOKEvent () {
        var eventData = {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    }
    
    function getItemsLength(items) {
        return (items.length === 1 && items[0] === '') ? 0 : items.length;
    }
    
    presenter.getMaxScore = function() {
        if (presenter.itemCounterMode) {
            return presenter.configuration.isActivity ? 1 : 0;
        }
        
        return presenter.configuration.isActivity ? getItemsLength(presenter.configuration.itemsAnswersID) : 0;
    };
    
    function getItemsCount() {
        return presenter.$view.find('.placeholder').not('.dragging').length;
    }
    
    function isAllCorrect () {
        return getItemsCount() === presenter.configuration.repetitions;
    }

    presenter.isShowingAnswers = function() {
        return presenter.isShowAnswersActive || presenter.isGradualShowAnswersActive;
    }
    
    presenter.getScore = function() {
        if (presenter.isShowingAnswers()) {
            return presenter.tmpScore;
        }

        if (presenter.itemCounterMode) {
            var score = isAllCorrect() ? 1 : 0;

            return presenter.configuration.isActivity ? score : 0;
        }

        if (!presenter.configuration.isActivity) return 0;

        var invalidAndRedundantItems = presenter.getInvalidItems();
        var invalidItems = invalidAndRedundantItems.remainingItems;

        return presenter.configuration.itemsAnswersID.length - invalidItems.length;

    };
    
    presenter.getErrorCount = function() {
        if (presenter.isShowingAnswers()) {
            return presenter.tmpErrorCount;
        }

        if (presenter.itemCounterMode) {
            var isEmpty = getItemsCount() === 0,
              result = 0;
            
            if (!isAllCorrect() && !isEmpty) {
                result = 1;
            }

            return presenter.configuration.isActivity ? result : 0;
        }

        return presenter.configuration.isActivity ? presenter.countItems() - presenter.getScore() : 0;
    };
    
    presenter.isAllOK = function() {
        if (!presenter.configuration.isActivity) return;
        
        if (presenter.itemCounterMode) {
            return isAllCorrect() ? 1 : 0;
        }

        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };
    
    presenter.getInvalidItems = function() {
        var remainingItems = presenter.configuration.itemsAnswersID.slice(0), currentItem;
        var redundantItems = [];

        presenter.$view.find('.placeholder').not('.dragging').each(function(index, placeholder) {
            currentItem = $(placeholder).attr('draggableItem');
            var currentItemIndex = remainingItems.indexOf(currentItem);
            
            if (currentItemIndex !== -1) {
                remainingItems.splice(currentItemIndex, 1);
            } else {
                redundantItems.push(currentItem);
            }
        });

        return {remainingItems: remainingItems, redundantItems: redundantItems};
    };
    
    function markInactive () {
        presenter.$view.find('.multiplegap_container').addClass('multiplegap_inactive');
    }
    
    function removeInactivityMark () {
        presenter.$view.find('.multiplegap_container').removeClass('multiplegap_inactive');
    }
    
    presenter.setShowErrorsMode = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }
        presenter.showErrorsMode = true;
        markInactive();
        if (!presenter.configuration.isActivity) return;
        
        if (presenter.itemCounterMode) {
            if (isAllCorrect()) {
                presenter.$view.find('.multiplegap_placeholders').addClass('placeholder_valid');
            } else if (getItemsCount() === 0) {
                presenter.$view.find('.multiplegap_container').addClass('multiplegap_inactive');
            } else {
                presenter.$view.find('.multiplegap_placeholders').addClass('placeholder_invalid');
            }
        } else {
            var remainingItems = presenter.configuration.itemsAnswersID.slice(0), currentItem;
            presenter.$view.find('.placeholder').each(function(index, placeholder) {
                currentItem = $(placeholder).attr('draggableItem');
                var currentItemIndex = remainingItems.indexOf(currentItem);
                if (currentItemIndex !== -1) {
                    remainingItems.splice(currentItemIndex, 1);
                    $(placeholder).addClass('placeholder_valid');
                }
            });
            
            presenter.$view.find('.placeholder:not(.placeholder_valid)').addClass('placeholder_invalid');
        }
    };
    
    presenter.setWorkMode = function() {
        presenter.showErrorsMode = false;
        removeInactivityMark();
        if (!presenter.configuration.isActivity) return;
        
        presenter.$view.find('.placeholder_valid').removeClass('placeholder_valid');
        presenter.$view.find('.placeholder_invalid').removeClass('placeholder_invalid');
        
    };
    
    presenter.reset = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }
        
        presenter.$view.find('.placeholder').remove();
        
        presenter.setWorkMode();
        
        presenter.clearSelected();
        
        presenter.handleDisplayingAddon();
        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
        presenter.elementCounter = 0;
    };

    presenter.isVisible = function() {
        return presenter.$view.css("visibility") === 'visible';
    }

    presenter.handleDisplayingAddon = function () {
        if (presenter.configuration.isVisibleByDefault && presenter.isVisible()) {
            presenter.show();
        } else {
            presenter.hide();
        }
    }
    
    presenter.getState = function() {
        function getBaseState(placeholders) {
            return JSON.stringify({
                placeholders: placeholders,
                isVisible: presenter.configuration.isVisible
            });
        }

        if (presenter.isShowingAnswers()) {
            return getBaseState(this.tmpState);
        } else {
            return getBaseState(getPlaceholders());
        }
    };
    
    presenter.upgradeState = function (parsedState) {
        return presenter.upgradeStateForVisibility(parsedState);
    };
    
    presenter.upgradeStateForVisibility = function (parsedState) {
        if (parsedState.constructor === Array) {
            // Before introducing show and hide commands, whole state was an array of
            // entered by user elements (called placeholders).
            return {
                placeholders: parsedState,
                isVisible: true
            };
        }
        
        return parsedState;
    };
    
    presenter.setState = function(state) {
        if (!state) {
            return;
        }

        var parsedState = JSON.parse(state),
          upgradedState = presenter.upgradeState(parsedState);

        for (let i = 0; i < upgradedState.placeholders.length; i++) {
            presenter.performAcceptDraggable(presenter.$view.find('.multiplegap_container>.handler'), upgradedState.placeholders[i], false, true, true);
        }

        if (upgradedState.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
        
        presenter.pageLoaded.then(function() {
            for (let i=0; i<presenter.placeholders2drag.length; i++) {
                const placeholder = presenter.placeholders2drag[i];
                presenter.makePlaceholderDraggable(placeholder);
            }
            presenter.updateLaTeX(presenter.getContainerElement());
        });

        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
    };
    
    presenter.getContainerElement = function () {
        return presenter.$view.find('.multiplegap_container')[0];
    };
    
    presenter.countItems = function(itemsToCount) {
        if (itemsToCount !== null && itemsToCount !== undefined) {
            return itemsToCount;
        }
        return presenter.elementCounter;
    };
    
    presenter.isAttemptedCommand = function() {
        return presenter.isAttempted();
    };
    
    presenter.isAttempted = function() {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        return presenter.countItems() > 0;
    };
    
    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };
    
    presenter.hide = function () {
        if (presenter.configuration.isVisible) {
            presenter.setVisibility(false);
            presenter.configuration.isVisible = false;
        }
    };
    
    presenter.show = function () {
        if (!presenter.configuration.isVisible) {
            presenter.setVisibility(true);
            presenter.configuration.isVisible = true;
            presenter.updateLaTeX(presenter.getContainerElement());
        }
    };
    
    presenter.executeCommand = function(name, params) {
        var commands = {
            'countItems': presenter.countItems,
            'isAllOK': presenter.isAllOK,
            'isAttempted' : presenter.isAttempted,
            'show': presenter.show,
            'hide': presenter.hide
        };
        
        return Commands.dispatch(commands, name, params, presenter);
    };
    
    presenter.onEventReceived = function(eventName, eventData) {

        if (eventName === 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        } else if (eventName === "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName === "HideAnswers" || eventName === "NotAllAttempted" || eventName === "Submitted") {
            presenter.hideAnswers();
        } else if (eventName === "ValueChanged") {
            presenter.onValueChanged(eventData);
        } else if (eventName === 'GradualShowAnswers') {
            if (!presenter.isGradualShowAnswersActive) {
                presenter.isGradualShowAnswersActive = true;

                presenter.getTemporaryData();
                setUpResetOnce();
            }

            if (presenter.configuration.ID === eventData.moduleID) {
                presenter.resetOnce();
                presenter.gradualShowAnswers(parseInt(eventData.item, 10));
            }
        } else if (eventName === 'GradualHideAnswers') {
            presenter.gradualHideAnswers();
        }
    };

    presenter.onValueChanged = function (eventData) {
        if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.AUDIO) {
                presenter.$view.find(".multiaudio-item-wrapper").each(function(){
                    var $this = $(this);
                    if ($this.attr('data-addon-id') === eventData.source) {
                        if ($this.attr('data-audio-id') === eventData.item) {
                            if (eventData.value === "00:00" || eventData.value === "pause") {
                                $this.removeClass('playing');
                            } else if (eventData.value === "playing") {
                                $this.addClass('playing');
                            }
                        } else {
                            if (eventData.value === "playing") {
                                $this.removeClass('playing');
                            }
                        }
                    }
                });
            }
    }

    presenter.getElementText = function (id, element) {
        var module = presenter.playerController.getModule(id);

        if (module == null || !module.hasOwnProperty('getItem')) {
            return '';
        }

        return module.getItem(element);
    };

    presenter.getTemporaryData = function() {
        presenter.tmpState = getPlaceholders();
        presenter.tmpScore = presenter.getScore();
        presenter.tmpErrorCount = presenter.getErrorCount();
    }

    presenter.showAnswers = function () {
        if (!presenter.configuration.isActivity) return;

        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.setWorkMode();

        presenter.getTemporaryData();

        presenter.isShowAnswersActive = true;

        presenter.$view.find('.placeholder').remove();
        var iteratedObject = presenter.getActivitiesCount();

        presenter.elementCounter = 0;
        for (var i = 0; i < iteratedObject; i++) {
            presenter.showAnswer(i);
        }

        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
    };

    presenter.showAnswer = function (item) {
        var moduleID;
        var value = '';

        if (presenter.itemCounterMode) {
            moduleID = presenter.configuration.repeatedElement;
        } else {
            moduleID = presenter.configuration.itemsAnswersID[item];
        }

        if (presenter.configuration.sourceType !== presenter.SOURCE_TYPES.IMAGES) {
            var elementId = moduleID.split('-')[0],
              elementIndex = moduleID.split('-')[1];

            value = presenter.getElementText(elementId, elementIndex);
        }

        presenter.performAcceptDraggable('<div></div>', {type:'string', value: value, item: moduleID}, false, false, false);
    }

    presenter.hideAnswers = function () {
        if (!presenter.isShowAnswersActive && !presenter.isGradualShowAnswersActive) {
            return;
        }

        presenter.$view.find('.placeholder-show-answers').remove();

        if (presenter.tmpState){
            presenter.elementCounter = 0;
            for (var i = 0; i < presenter.tmpState.length; i++) {
                presenter.performAcceptDraggable(presenter.$view.find('.multiplegap_container>.handler'), presenter.tmpState[i], false, false, false);
            }
        }
        presenter.$view.find('.placeholder-show-answers').removeClass('placeholder-show-answers');
        presenter.isShowAnswersActive = false;
        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new MultipleGapKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return $.merge($(presenter.container), presenter.$view.find('.placeholder:visible').not('.ui-draggable-dragging'));
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event)
    };

    function MultipleGapKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    MultipleGapKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    MultipleGapKeyboardController.prototype.constructor = MultipleGapKeyboardController;


    MultipleGapKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        if (willBeClicked) {
            var handler = $(element).children(".handler");
            if (handler.length > 0) {
                return handler;
            }
        }

        return $(element);
    };

    MultipleGapKeyboardController.prototype.switchElement = function (move) {
        if (this.keyboardNavigationElementsLen < 2) {
            presenter.speak([getTextVoiceObject(presenter.speechTexts.empty)]);
            this.markCurrentElement(0);
        } else {
            var new_position_index = this.keyboardNavigationCurrentElementIndex + move;
            if (new_position_index >= this.keyboardNavigationElementsLen) {
                new_position_index = this.keyboardNavigationElementsLen - 1;
            } else if ( new_position_index < 1) {
                new_position_index = 1;
            }
            this.markCurrentElement(new_position_index);
            this.readActiveElement(new_position_index);
        }
    };

    MultipleGapKeyboardController.prototype.readActiveElement = function (index) {
        var voicesArray = [];
        if(index === 0 ){
            voicesArray.push(getTextVoiceObject(presenter.speechTexts.empty));
        } else {
            var $element = this.getTarget(this.keyboardNavigationElements[index]);
            voicesArray = voicesArray.concat(presenter.getTextVoicesFromPlaceholder($element));
        }
        presenter.speak(voicesArray);
    };

    MultipleGapKeyboardController.prototype.enter = function (event) {
        window.KeyboardController.prototype.enter.call(this, event);
        if(this.keyboardNavigationElementsLen > 1) {
            if (presenter.configuration.sourceType === presenter.SOURCE_TYPES.AUDIO) {
                var $element = presenter.$view.find('.placeholder.keyboard_navigation_active_element');
                if ($element.length === 0) {
                    readAllElements();
                } else {
                    var draggableItemValues = $element.attr('draggableitem').split('-');
                    var $wrapper = $element.find('.multiaudio-item-wrapper');
                    var callback = function() {
                        if (draggableItemValues.length === 2) {
                            playDraggableAudio($wrapper, draggableItemValues[1], draggableItemValues[0]);
                        }
                    }
                    var voicesArray = presenter.getTextVoicesFromPlaceholder($element);
                    if (voicesArray.length === 0 || !isWCAGOn) {
                        callback();
                    } else {
                        if ($wrapper.hasClass('playing')) {
                            callback();
                        } else {
                            presenter.speakWithCallback(voicesArray, callback);
                        }
                    }
                }
            } else {
                readAllElements();
            }
        } else {
            presenter.speak([getTextVoiceObject(presenter.speechTexts.empty)]);
        }
    };

    function readAllElements() {
        var voicesArray = [];
        var kc = presenter.keyboardControllerObject;
        for(var i  = 1; i <kc.keyboardNavigationElementsLen; i++) {
            var $element = kc.getTarget(kc.keyboardNavigationElements[i]);
            voicesArray = voicesArray.concat(presenter.getTextVoicesFromPlaceholder($element));
        }
        presenter.speak(voicesArray);
    }

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.getTextVoicesFromPlaceholder = function($placeholder) {
        var voicesArray =[];

        if ($placeholder.length===0) return [];

        if ($placeholder.hasClass('placeholder')) {
            var $child = $placeholder.find("img.contents");
            if ($child.length > 0) {
                voicesArray.push(getTextVoiceObject($child.attr('alt'),$child.attr('lang')));
            } else {
                $child = $placeholder.find("p.contents");
                if ($child.length > 0){
                    voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($child, presenter.configuration.langTag);
                } else {
                    $child = $placeholder.find('.multiaudio-item-text');
                    if ($child.length > 0){
                        voicesArray = window.TTSUtils.getTextVoiceArrayFromElement($child, presenter.configuration.langTag);
                    }
                }
            }
            if ($placeholder.hasClass('placeholder_invalid')) {
                voicesArray.push(getTextVoiceObject(presenter.speechTexts.wrong));
            } else if ($placeholder.hasClass('placeholder_valid')) {
                voicesArray.push(getTextVoiceObject(presenter.speechTexts.correct));
            }
        }
        return voicesArray;
    };

    presenter.speak = function (data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.speakWithCallback = function (data, callback) {
            var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
            if (tts && isWCAGOn) {
                tts.speakWithCallback(data, callback);
            }
        };

    presenter.setPrintableController = function (controller) {
        printableController = controller;
    };

    presenter.setPrintableState = function (state){
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.printableState = JSON.parse(state);
    }

    presenter.getPrintableHTML = function (model, showAnswers) {
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        var $view = $("<div></div>");
        $view.attr("id", model.ID);
        $view.addClass("printable_addon_multiplegap");

        var $wrapper = $("<div></div>");
        $wrapper.css("max-width", model.Width+"px");
        $wrapper.css("min-height", model.Height+"px");
        $wrapper.css("border", "1px solid");
        $wrapper.css("padding", "5px");

        if (printableController != null) {
            var correctAnswers = getCorrectAnswers();
            var answerHTML = "";

            if (presenter.printableState) {
                var studentAnswers = parseStudentAnswers(presenter.printableState);
                var correctAnswerList = correctAnswers.map(answer => answer.value);
                if (showAnswers) {
                    for (var i = 0; i < studentAnswers.length; i++) {
                        for (var j = 0; j < correctAnswers.length; j++) {
                            var index = correctAnswerList.indexOf(studentAnswers[i].value)
                            if (index > -1) {
                                studentAnswers[i].isCorrect = true;
                                correctAnswerList.splice(index, 1);
                                break;
                            }
                        }
                        answerHTML = prepareCheckedAnswerToPrint(answerHTML, i, ...studentAnswers);
                    }
                } else {
                    answerHTML = prepareBasicPrint(answerHTML, null, ...studentAnswers);
                }
            } else {
                if (showAnswers) {
                    answerHTML = prepareBasicPrint(answerHTML, $wrapper, ...correctAnswers);
                }
            }
            $wrapper.html(answerHTML);
        }

        $view.append($wrapper);

        return $view[0].outerHTML;
    };

    function getCorrectAnswers() {
        var contextDict = {};
        var correctAnswers = []

        for (var i = 0; i < presenter.configuration.itemsAnswersID.length; i++) {
            var splitItemAnswerID = presenter.configuration.itemsAnswersID[i].split("-");
            if (splitItemAnswerID.length === 2 && !isNaN(splitItemAnswerID[1])) {
                var answerAddonID = splitItemAnswerID[0];
                var answerItemIndex = splitItemAnswerID[1] - 1;

                if (!(answerAddonID in contextDict)) {
                    contextDict[answerAddonID] = printableController.getPrintableContext(answerAddonID);
                }
                var hasDictItems = contextDict[answerAddonID] && contextDict[answerAddonID].items;
                var isIndexCorrect = answerItemIndex >= 0 && answerItemIndex < contextDict[answerAddonID].items.length;

                if (hasDictItems && isIndexCorrect) {
                    var answer = {
                        value: contextDict[answerAddonID].items[answerItemIndex],
                        addonID: answerAddonID,
                        index: answerItemIndex
                    };
                    correctAnswers.push(answer);
                }
            }
        }

        return correctAnswers;
    }

    function getSeparatorBasedOnOrientation() {
        if (presenter.configuration.orientation === presenter.ORIENTATIONS.HORIZONTAL) {
            return ", ";
        } else {
            return "</br>";
        }
    }

    function prepareBasicPrint (answerHTML, $wrapper=null ,...answers) {
        var separator = getSeparatorBasedOnOrientation()
        for (var i = 0; i < answers.length; i++) {
            answerHTML = answerHTML + answers[i].value;
            if (i < answers.length - 1) {
                answerHTML = answerHTML + separator;
            }
        }
        if ($wrapper !== null) {
            $wrapper.css("background-color", "#eeeeee");
        }
        return answerHTML;
    }

    function parseStudentAnswers (state) {
        var studentAnswers = [];
        for (var i = 0; i < state.placeholders.length; i++){
            var splitItemAnswerID = state.placeholders[i].item.split("-");
            if (splitItemAnswerID.length === 2 && !isNaN(splitItemAnswerID[1])){
                var answerAddonID = splitItemAnswerID[0];
                var answerItemIndex = splitItemAnswerID[1] - 1;
                var answer = {
                    value : state.placeholders[i].value,
                    addonID : answerAddonID,
                    index : answerItemIndex,
                    isCorrect : false
                };
                studentAnswers.push(answer);
            }
        }
        return studentAnswers;
    }

    function prepareCheckedAnswerToPrint (answerHTML, i, ...answers){
        element = document.createElement("span");
        element.classList.add("answerSpan");
        if (answers[i].isCorrect) {
            element.classList.add("correctAnswerSpan");
        } else {
            element.classList.add("incorrectAnswerSpan");
        }
        var separator = getSeparatorBasedOnOrientation()
        element.innerHTML = answers[i].value;
        answers[i].value = element.outerHTML;

        answerHTML = answerHTML + answers[i].value;
        if(i < answers.length - 1){
            answerHTML = answerHTML + separator;
        }
        return answerHTML;
    }

    presenter.getActivitiesCount = function () {
        if (presenter.itemCounterMode) {
            return presenter.configuration.repetitions;
        } else {
            return presenter.configuration.itemsAnswersID.length;
        }
    }

    presenter.gradualShowAnswers = function (item) {
        presenter.showAnswer(item);
    }

    presenter.gradualHideAnswers = function () {
        presenter.removePlaceholders();
        presenter.hideAnswers();
        presenter.isGradualShowAnswersActive = false;
    }

    presenter.removePlaceholders = function () {
        presenter.$view.find('.placeholder').remove();
    }

    function setUpResetOnce() {
         presenter.resetOnce = (function() {
            let didReset = false;
            return function() {
                if(!didReset) {
                    didReset = true;
                    if(presenter.isShowAnswersActive){
                        presenter.hideAnswers();
                    }

                    presenter.$view.find('.placeholder').remove();
                    presenter.setWorkMode();
                    presenter.clearSelected();
                    presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
                    presenter.elementCounter = 0;
                }
            };
        })();
    }

    return presenter;
}
