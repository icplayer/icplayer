function Addonmultiplegap_create(){
    /*
     * KNOWN ISSUES:
     *     Invalid properties values (Item width, Item height, Item spacing, Maximum item count):
     *          When addon validated model it checks only value of those properties by numerical values. If parsed
     *         value is not a number - no error message is showed - that's because calculated values from those
     *         properties are only used in CSS. Invalid CSS value set with jQuery will simply not be added to
     *         DOM element, but it won't brake anything. Changing this behaviour will break backward compatibility!
     */
    
    var presenter = function(){};
    
    presenter.ORIENTATIONS = {
        HORIZONTAL: 0,
        VERTICAL: 1
    };
    
    presenter.SOURCE_TYPES = {
        IMAGES: 0,
        TEXTS: 1
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
    presenter.itemCounterMode = false;
    presenter.placeholders2drag = [];

    presenter.keyboardControllerObject = null;
    presenter.container = null;
    
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
        if (model["wrapItems"] == undefined) {
            upgradedModel = this.upgradeWrapItems(model);
        }
        
        return upgradedModel;
    };
    
    presenter.upgradeWrapItems = function (model) {
        model["wrapItems"] = false;
        
        return model;
    };
    
    
    presenter.validateModel = function (model) {
        var orientation = presenter.ORIENTATIONS.HORIZONTAL;
        if (model['Orientation'] === "vertical") {
            orientation = presenter.ORIENTATIONS.VERTICAL;
        }
        
        var sourceType = presenter.SOURCE_TYPES.IMAGES;
        if (model['Source type'] == "texts") {
            sourceType = presenter.SOURCE_TYPES.TEXTS;
        }
        
        var validatedItems = presenter.validateItems(model);
        if (validatedItems.isError) {
            return validatedItems;
        }
        
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var validatedRepetitions = presenter.validateRepetitions(model["Number of repetitions"]);
        var validateRepeatedElement = presenter.validateIdRepeatedElement(model["ID repeated element"]);
        
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
            stretchImages: model['Stretch images?'] == 'True',
            items: validatedItems.value,
            itemsAnswersID: model['Items'].map(function (item) {
                return item['Answer ID'];
            }),
            repetitions: validatedRepetitions.value,
            repeatedElement: validateRepeatedElement.value,
            blockWrongAnswers: ModelValidationUtils.validateBoolean(model["Block wrong answers"]),
            wrapItems: ModelValidationUtils.validateBoolean(model["wrapItems"])
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
        container.click (function (event) {
            event.stopPropagation ();
            event.preventDefault ();
        });
        var placeholders = $('<div class="multiplegap_placeholders"></div>');
        
        container.append(placeholders);
        
        container.addClass("multiplegap_" + (presenter.configuration.orientation == presenter.ORIENTATIONS.HORIZONTAL ? "horizontal" : "vertical"));
        container.addClass("multiplegap_" + (presenter.configuration.sourceType == presenter.SOURCE_TYPES.TEXTS ? "texts" : "images" ));
        
        container.css ({
            width: presenter.$view.css ('width'),
            height: presenter.$view.css ('height')
        });
        
        container.click (presenter.acceptDraggable);
        container.droppable ({
            drop: function (event, ui) {
                if (!presenter.configuration.isVisible) {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
                container.click();
            }
        });

        presenter.container = container;
        presenter.$view.append(container);
    };
    
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
            
            if (eventName === "ItemConsumed") {
                presenter.$view.find('.handler').show();
                presenter.isItemChecked = false;
            }
            
            if (eventName === "ItemSelected" && eventData.value !== null && eventData.value !== "") {
                presenter.$view.find('.handler').hide();
                presenter.isItemChecked = true;
            } else if (eventName === "ItemSelected" ) {
                presenter.$view.find('.handler').show();
                presenter.isItemChecked = false;
            }
            
            if(typeof(eventData.item) == "undefined" || eventData.item === null) {
                presenter.clearSelected();
            } else if(presenter.configuration.sourceType == presenter.SOURCE_TYPES.IMAGES && eventData.type == "image") {
                presenter.saveSelected(eventData);
                
            } else if(presenter.configuration.sourceType == presenter.SOURCE_TYPES.TEXTS && eventData.type == "string") {
                presenter.saveSelected(eventData);
            } else {
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
        
        if(presenter.showErrorsMode || presenter.isShowAnswersActive || !presenter.isItemChecked) {
            return;
        }
        
        presenter.performAcceptDraggable($(e.target), presenter.selectedItem, true, false, false);
        presenter.$view.find('.handler').show();
        presenter.$view.find('.multiplegap_container').removeClass('multiplegap_active');

        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
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
        MathJax.CallBack.Queue().Push(function () {
            MathJax.Hub.Typeset(element)
        });
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
        if(!presenter.isShowAnswersActive){
            if(!force && presenter.selectedItem == null) return;
            if(presenter.maximumItemCountReached()) return;
            if(presenter.configuration.blockWrongAnswers && !presenter.isElementCorrect(item.item)) {
                sendEvent(item, false);
                return;
            }
        }
        
        var child;
        var placeholder;
        if(presenter.isShowAnswersActive){
            placeholder = $('<div class="placeholder placeholder-show-answers"></div>');
        }else{
            placeholder = $('<div class="placeholder"></div>');
        }
        
        placeholder.css({
            width: presenter.configuration.items.width + 'px',
            height: presenter.configuration.items.height + 'px'
        });
        
        var positions = presenter.calculateElementPositions();
        placeholder.css({
            top: positions.top + 'px',
            left: positions.left + 'px'
        });
        
        presenter.$view.find('.multiplegap_placeholders').append(placeholder);
        
        switch(presenter.configuration.sourceType) {
            case presenter.SOURCE_TYPES.IMAGES:
                child = $('<img class="contents" alt="" />');
                child.attr('src', presenter.getImageURL(item));
                
                if(presenter.configuration.stretchImages) {
                    child.css({
                        width: presenter.configuration.items.width + 'px',
                        height: presenter.configuration.items.height + 'px'
                    });
                }
                break;
            
            case presenter.SOURCE_TYPES.TEXTS:
                child = $('<p class="contents"></p>');
                child.html(presenter.parseItemValue(item.value));
                break;
        }
        
        placeholder
          .attr({
              draggableValue: item.value,
              draggableItem: item.item,
              draggableType: item.type
          })
          .append(child);
        
        if (!isState) {
            presenter.updateLaTeX(child[0]);
        }
        
        var placeholderPadding = DOMOperationsUtils.getOuterDimensions(placeholder).padding,
          placeholderVerticalPadding = placeholderPadding.left + placeholderPadding.right,
          placeholderHorizontalPadding = placeholderPadding.top + placeholderPadding.bottom;
        
        switch(presenter.configuration.items.horizontalAlign) {
            case 'left':
                child.css({
                    position: 'absolute',
                    left: 0
                });
                break;
            case 'center':
                
                switch(presenter.configuration.sourceType) {
                    case presenter.SOURCE_TYPES.TEXTS:
                        child.css({
                            position: 'absolute',
                            width: '100%',
                            textAlign: 'center'
                        });
                        break;
                    
                    case presenter.SOURCE_TYPES.IMAGES:
                        child.css({
                            position: 'absolute',
                            left: Math.round((presenter.configuration.items.width - placeholderHorizontalPadding - parseInt(child.css('width'))) / 2) + 'px'
                        });
                        break;
                }
                break;
            case 'right':
                child.css({
                    position: 'absolute',
                    right: 0
                });
                break;
        }
        
        switch(presenter.configuration.items.horizontalAlign) {
            case 'top':
                child.css({
                    position: 'absolute',
                    top: 0
                });
                break;
            case 'center':
                child.css({
                    position: 'absolute',
                    top: Math.round((presenter.configuration.items.height - placeholderVerticalPadding - parseInt(child.css('height'))) / 2) + 'px'
                });
                break;
            case 'bottom':
                child.css({
                    position: 'absolute',
                    bottom: 0
                });
                break;
        }
        
        handler = $('<div class="handler"></div>');
        
        // Workaround for IE bug: empty divs in IE are not clickable so let's
        // make them not empty and appear as empty.
        if($.browser.msie) {
            handler.css({backgroundColor: "#000000", opacity: 0 });
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
    };
    
    function sendEvent(item, consumed) {
        if (consumed) {
            presenter.eventBus.sendEvent('ItemConsumed', item);
        }
        
        var score;
        if(presenter.isElementCorrect(item.item)){
            score = 1;
        }else{
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
                ui.helper.zIndex(0);
                ui.helper.remove();
                presenter.itemStopped(placeholder);
                ui.helper.remove();
            }
        });
    };
    
    var getDraggedSrc = function(placeholder) {
        if (placeholder.parents('.multiplegap_container').css("overflow") == "hidden") {
            if (presenter.configuration.sourceType == presenter.SOURCE_TYPES.IMAGES) {
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
        if (presenter.showErrorsMode || presenter.isShowAnswersActive) {
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
        var evnt = {
            source: presenter.configuration.ID,
            value: placeholder.attr('draggableValue'),
            item: placeholder.attr('draggableItem'),
            type: placeholder.attr('draggableType')
        };
        presenter.eventBus.sendEvent('itemStopped', evnt);
        placeholder.remove();
        presenter.$view.find('.placeholder').each(presenter.movePlaceholdersAfterRemove);
    };
    
    presenter.removeDraggable = function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        if(presenter.showErrorsMode || presenter.isShowAnswersActive) {
            return;
        }
        presenter.performRemoveDraggable($(e.target));

        presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());
    };
    
    presenter.performRemoveDraggable = function(handler) {
        
        var placeholder = handler.parent();
        
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
        presenter.eventBus = presenter.playerController.getEventBus();
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
        return (items.length == 1 && items[0] == '') ? 0 : items.length;
    }
    
    presenter.getMaxScore = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }
        
        if (presenter.itemCounterMode) {
            return presenter.configuration.isActivity ? 1 : 0;
        }
        
        return presenter.configuration.isActivity ? getItemsLength(presenter.configuration.itemsAnswersID) : 0;
    };
    
    function getItemsCount() {
        return presenter.$view.find('.placeholder').length;
    }
    
    function isAllCorrect () {
        return getItemsCount() === presenter.configuration.repetitions;
    }
    
    presenter.getScore = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }
        if (presenter.itemCounterMode) {
            var score = isAllCorrect() ? 1 : 0;
            
            return presenter.configuration.isActivity ? score : 0;
        }
        return presenter.configuration.isActivity ? presenter.configuration.itemsAnswersID.length - presenter.getInvalidItems().length : 0;
    };
    
    presenter.getErrorCount = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
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
        
        presenter.$view.find('.placeholder').each(function(index, placeholder) {
            
            // To get updated score during dragged element which is still in DOM we must break out of each
            if (!$(placeholder).find('.handler').filter(':visible').length) {
                return true;
            }
            currentItem = $(placeholder).attr('draggableItem');
            var currentItemIndex = remainingItems.indexOf(currentItem);
            
            if (currentItemIndex !== -1) {
                remainingItems.splice(currentItemIndex, 1);
            }
        });
        
        return remainingItems;
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
        
        if (presenter.configuration.isVisibleByDefault) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };
    
    presenter.getState = function() {
        if(presenter.isShowAnswersActive){
            presenter.hideAnswers();
        }
        
        var placeholders = jQuery.map(presenter.$view.find('.placeholder:not(.placeholder-show-answers)'), function(placeholder) {
            return {
                item : $(placeholder).attr('draggableItem'),
                value : $(placeholder).attr('draggableValue'),
                type : $(placeholder).attr('draggableType')
            };
        });
        
        return JSON.stringify({
            placeholders: placeholders,
            isVisible: presenter.configuration.isVisible
        });
    };
    
    presenter.upgradeState = function (parsedState) {
        return presenter.upgradeStateForVisibility(parsedState);
    };
    
    presenter.upgradeStateForVisibility = function (parsedState) {
        if (parsedState.constructor == Array) {
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
        
        for(var i = 0; i < upgradedState.placeholders.length; i++) {
            presenter.performAcceptDraggable(presenter.$view.find('.multiplegap_container>.handler'), upgradedState.placeholders[i], false, true, true);
        }
        
        if (upgradedState.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
        
        presenter.pageLoaded.then(function() {
            presenter.updateLaTeX(presenter.getContainerElement());
            for (var i=0; i<presenter.placeholders2drag.length; i++) {
                var placeholder = presenter.placeholders2drag[i];
                presenter.makePlaceholderDraggable(placeholder);
            }
        });
    };
    
    presenter.getContainerElement = function () {
        return presenter.$view.find('.multiplegap_container')[0];
    };
    
    presenter.countItems = function(itemsToCount) {
        var countItems;
        if (itemsToCount !== null && itemsToCount !== undefined) {
            countItems = itemsToCount;
        } else {
            countItems = presenter.$view.find('.placeholder:visible').not('.ui-draggable-dragging').length;
        }
        
        return countItems;
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
    
    presenter.onEventReceived = function(eventName) {
        if (eventName == 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        }
        
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }
        
        if (eventName == "HideAnswers" || eventName == "NotAllAttempted" || eventName == "Submitted") {
            presenter.hideAnswers();
        }
    };
    
    presenter.getElementText = function (id, element) {
        var module = presenter.playerController.getModule(id);
        
        if (module == null || !module.hasOwnProperty('getItem')) {
            return '';
        }
        
        return module.getItem(element);
    };
    
    presenter.showAnswers = function () {
        if (!presenter.configuration.isActivity) return;
        
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.isShowAnswersActive = true;
        presenter.setWorkMode();
        
        presenter.tmpState = [];
        presenter.$view.find('.placeholder').each(function(i, placeholder) {
            presenter.tmpState.push({
                item : $(placeholder).attr('draggableItem'),
                value : $(placeholder).attr('draggableValue'),
                type : $(placeholder).attr('draggableType')
            });
        });
        
        presenter.$view.find('.placeholder').remove();
        var moduleID,
          iteratedObject;
        if (presenter.itemCounterMode) {
            iteratedObject = presenter.configuration.repetitions;
        } else {
            iteratedObject = presenter.configuration.itemsAnswersID.length;
        }
        
        for (var i = 0; i < iteratedObject; i++) {
            if (presenter.itemCounterMode) {
                moduleID = presenter.configuration.repeatedElement;
            } else {
                moduleID = presenter.configuration.itemsAnswersID[i];
            }
            
            var value = '';
            if (presenter.configuration.sourceType != presenter.SOURCE_TYPES.IMAGES) {
                var elementId = moduleID.split('-')[0],
                  elementIndex = moduleID.split('-')[1];
                
                value = presenter.getElementText(elementId, elementIndex);
            }
            
            presenter.performAcceptDraggable('<div></div>', {type:'string', value: value, item: moduleID}, false, false, false);
        }
    };
    
    presenter.hideAnswers = function () {
        presenter.$view.find('.placeholder-show-answers').remove();
        
        if(presenter.tmpState){
            for(var i = 0; i < presenter.tmpState.length; i++) {
                presenter.performAcceptDraggable(presenter.$view.find('.multiplegap_container>.handler'), presenter.tmpState[i], false, false, false);
            }
        }
        presenter.$view.find('.placeholder-show-answers').removeClass('placeholder-show-answers');
        presenter.isShowAnswersActive = false;
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new MultipleGapKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return $.merge(presenter.$view.find('.placeholder:visible').not('.ui-draggable-dragging'), $(presenter.container));
    };

    presenter.keyboardController = function(keycode) {
        presenter.keyboardControllerObject.handle(keycode)
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
    return presenter;
}