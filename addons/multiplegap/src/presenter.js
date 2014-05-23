function Addonmultiplegap_create(){
    var presenter = function(){};

    presenter.ORIENTATIONS = {
        HORIZONTAL: 0,
        VERTICAL: 1
    };

    presenter.SOURCE_TYPES = {
        IMAGES: 0,
        TEXTS: 1
    };

    presenter.ERROR_MESSAGES = {
        INVALID_ITEM_WIDTH         : "Item width has to be greater than 0",
        INVALID_ITEM_HEIGHT        : "Item height has to be greater than 0",
        INVALID_ITEM_SPACING       : "Item spacing has to be greater or equal than 0",
        INVALID_MAXIMUM_ITEM_COUNT : "Maximum item count has to be greater or equal than 1"
    };

    presenter.eventBus            = null;
    presenter.playerController    = null;

    presenter.$view       = null;

    presenter.selectedItem        = null;

    presenter.sourceType          = null;
    presenter.orientation         = null;

    presenter.maximumItemCount    = 1;
    presenter.itemWidth           = null;
    presenter.itemHeight          = null;
    presenter.itemSpacing         = null;
    presenter.stretchImages       = false;

    presenter.itemHorizontalAlign = null;
    presenter.itemVerticalAlign   = null;


    presenter.items               = []

    presenter.showErrorsMode      = false;

    presenter.showErrorMessage = function(message) {
        presenter.$view.text(message);
    };

    presenter.createPreview = function(view, model) {
        presenter.createLogic(view, model);
    };

    presenter.run = function(view, model) {
        presenter.createLogic(view, model);
    };

    presenter.validateModel = function (model) {
        return {
            isError: false,
            ID: model.ID,
            isActivity: !ModelValidationUtils.validateBoolean(model['Is not an activity'])
        };
    };

    presenter.createLogic = function(view, model) {
        presenter.$view = $(view);
        presenter.addonID = model.ID;

        var container = $('<div class="multiplegap_container"></div>');
        container.click(function(event) {
			event.stopPropagation();
			event.preventDefault();
        });
        var placeholders = $('<div class="multiplegap_placeholders"></div>');

        container.append(placeholders);

        presenter.configuration = presenter.validateModel(model);

        switch(model['Orientation']) {
            default:
            case 'horizontal':
                presenter.orientation = presenter.ORIENTATIONS.HORIZONTAL;
                container.addClass("multiplegap_horizontal");
                break;

            case 'vertical':
                presenter.orientation = presenter.ORIENTATIONS.VERTICAL;
                container.addClass("multiplegap_vertical");
                break;
        }


        switch(model['Source type']) {
            default:
            case 'images':
                presenter.sourceType = presenter.SOURCE_TYPES.IMAGES;
                container.addClass("multiplegap_images");
                break;

            case 'texts':
                presenter.sourceType = presenter.SOURCE_TYPES.TEXTS;
                container.addClass("multiplegap_texts");
                break;

        }

        presenter.itemWidth = parseInt(model['Item width']);
        if(presenter.itemWidth <= 0)
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.INVALID_ITEM_WIDTH);

        presenter.itemHeight = parseInt(model['Item height']);
        if(presenter.itemHeight <= 0)
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.INVALID_ITEM_HEIGHT);

        presenter.itemSpacing = parseInt(model['Item spacing']);
        if(presenter.itemSpacing < 0)
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.INVALID_ITEM_SPACING);

        presenter.maximumItemCount = parseInt(model['Maximum item count']);
        if(presenter.maximumItemCount < 1)
            presenter.showErrorMessage(presenter.INVALID_MAXIMUM_ITEM_COUNT);

        presenter.stretchImages = model['Stretch images?'] == 'True';
        presenter.itemHorizontalAlign = model['Item horizontal align'];
        presenter.itemVerticalAlign = model['Item vertical align'];

        container.css({
            width: presenter.$view.css('width'),
            height: presenter.$view.css('height')
        });

        var handler = $('<div class="handler"></div>');
        handler.click(presenter.acceptDraggable);
        container.append(handler);
        handler.hide();
        
        handler.droppable({drop: function(event, ui) { 
			event.stopPropagation();
			event.preventDefault();
        	handler.click() 
        }});

        for(var i = 0; i < model['Items'].length; i++) {
            presenter.items.push(model['Items'][i]['Answer ID']);
        }

        presenter.$view.append(container);
    };

    presenter.eventListener = {
        onEventReceived: function(eventName, eventData) {
            if(presenter.showErrorsMode) return;

            if(typeof(eventData.item) == "undefined") {
                presenter.clearSelected();

            } else if(presenter.sourceType == presenter.SOURCE_TYPES.IMAGES && eventData.type == "image") {
                presenter.saveSelected(eventData);

            } else if(presenter.sourceType == presenter.SOURCE_TYPES.TEXTS && eventData.type == "string") {
                presenter.saveSelected(eventData);
            }
        }
    };

    presenter.selectorRootClass = function() {
        switch(presenter.sourceType) {
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

        presenter.$view.find('.handler').css('background-color', '');
    };

    presenter.saveSelected = function(eventData) {
        presenter.selectedItem = eventData;

        if(!presenter.maximumItemCountReached()) {
            presenter.$view.find('.multiplegap_container').addClass('multiplegap_active');
            presenter.$view.find('.handler').show();
        }
    };

    presenter.acceptDraggable = function(e) {
        e.stopPropagation();
        e.preventDefault();

        if(presenter.showErrorsMode) return;

        presenter.performAcceptDraggable($(e.target), presenter.selectedItem, true, false);
    };

    presenter.maximumItemCountReached = function() {
        return presenter.countItems() >= presenter.maximumItemCount;
    };

    presenter.performAcceptDraggable = function(handler, item, sendEvents, force) {
        if(!force && presenter.selectedItem == null)
            return;

        if(presenter.maximumItemCountReached())
            return;

        var placeholder = handler.parent();
        var child;


        var placeholder = $('<div class="placeholder"></div>');
        placeholder.css({
            width: presenter.itemWidth + 'px',
            height: presenter.itemHeight + 'px'
        });

        var i = presenter.countItems();

        switch(presenter.orientation) {
            case presenter.ORIENTATIONS.HORIZONTAL:
                placeholder.css({
                    top: 0,
                    left: (i == 0 ? 0 : presenter.itemWidth * i + presenter.itemSpacing * i) + 'px'
                });
                break;

            case presenter.ORIENTATIONS.VERTICAL:
                placeholder.css({
                    left: 0,
                    top: (i == 0 ? 0 : presenter.itemHeight * i + presenter.itemSpacing * i) + 'px'
                });
                break;
        }

        presenter.$view.find('.multiplegap_placeholders').append(placeholder);



        switch(presenter.sourceType) {
            case presenter.SOURCE_TYPES.IMAGES:
                child = $('<img class="contents" alt="" />');
                child.attr('src', item.value);

                if(presenter.stretchImages) {
                    child.css({
                        width: presenter.itemWidth + 'px',
                        height: presenter.itemHeight + 'px'
                    });
                }
                break;

            case presenter.SOURCE_TYPES.TEXTS:
                child = $('<p class="contents"></p>');
                child.text(item.value);
                break;
        }

        placeholder
            .attr({
                draggableValue: item.value,
                draggableItem: item.item,
                draggableType: item.type
            })
            .append(child);

        MathJax.CallBack.Queue().Push(function () {MathJax.Hub.Typeset(child[0])});

        var placeholderPadding = DOMOperationsUtils.getOuterDimensions(placeholder).padding,
            placeholderVerticalPadding = placeholderPadding.left + placeholderPadding.right,
            placeholderHorizontalPadding = placeholderPadding.top + placeholderPadding.bottom;

        switch(presenter.itemHorizontalAlign) {
            case 'left':
                child.css({
                    position: 'absolute',
                    left: 0
                });
                break;
            case 'center':

                switch(presenter.sourceType) {
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
                            left: Math.round((presenter.itemWidth - placeholderHorizontalPadding - parseInt(child.css('width'))) / 2) + 'px'
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

        switch(presenter.itemVerticalAlign) {
            case 'top':
                child.css({
                    position: 'absolute',
                    top: 0
                });
                break;
            case 'center':
                child.css({
                    position: 'absolute',
                    top: Math.round((presenter.itemHeight - placeholderVerticalPadding - parseInt(child.css('height'))) / 2) + 'px'
                });
                break;
            case 'bottom':
                child.css({
                    position: 'absolute',
                    bottom: 0
                });
                break;
        }

        var handler = $('<div class="handler"></div>');

        // Workaround for IE bug: empty divs in IE are not clickable so let's
        // make them not empty and appear as empty.
        if($.browser.msie) {
            handler.css('background', '#000');
            handler[0].style.filter = "alpha(opacity=0)";
        }

        handler.click(presenter.removeDraggable);
        placeholder.append(handler);


        if(sendEvents) {
            presenter.eventBus.sendEvent('ItemConsumed', item);

            presenter.eventBus.sendEvent('ValueChanged', {
                'source': presenter.configuration.ID,
                'item'  : '' + item.item, // ensure that we send string
                'value' : 'add',
                'score' : '1'
            });

            if (presenter.isAllOK()) sendAllOKEvent();
        }

        $(presenter.selectorRootClass() + '>.handler').hide();

        presenter.clearSelected();

    };

    presenter.removeDraggable = function(e) {
        e.stopPropagation();
        e.preventDefault();

        if(presenter.showErrorsMode)
            return;

        presenter.performRemoveDraggable($(e.target));
    };

    presenter.performRemoveDraggable = function(handler) {
        var placeholder = handler.parent();

        presenter.$view.find('.placeholder').each(function(i, element) {
            switch(presenter.orientation) {
                case presenter.ORIENTATIONS.HORIZONTAL:
                    if(parseInt($(element).css('left')) > parseInt(placeholder.css('left'))) {
                        $(element).css('left', (parseInt($(element).css('left')) - presenter.itemWidth - presenter.itemSpacing) + 'px');
                    }
                    break;

                case presenter.ORIENTATIONS.VERTICAL:
                    if(parseInt($(element).css('top')) > parseInt(placeholder.css('top'))) {
                        $(element).css('top', (parseInt($(element).css('top')) - presenter.itemHeight - presenter.itemSpacing) + 'px');
                    }
                    break;

            }
        });

        placeholder.remove();

        presenter.eventBus.sendEvent('ItemReturned', {
            value: placeholder.attr('draggableValue'),
            item: placeholder.attr('draggableItem'),
            type: placeholder.attr('draggableType')
        });

        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item'  : '' + placeholder.attr('draggableItem'), // ensure that we send string
            'value' : 'remove',
            'score' : '1'
        });

        if (presenter.isAllOK()) sendAllOKEvent();
    };


    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();

        presenter.eventBus.addEventListener('ItemSelected', presenter.eventListener);
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
        return presenter.configuration.isActivity ? getItemsLength(presenter.items) : 0;
    };

    presenter.getScore = function() {
        return presenter.configuration.isActivity ? presenter.items.length - presenter.getInvalidItems().length : 0;
    };

    presenter.getErrorCount = function() {
        return presenter.configuration.isActivity ? presenter.countItems() - presenter.getScore() : 0;
    };

    presenter.isAllOK = function () {
        if (!presenter.configuration.isActivity) return;

        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.getInvalidItems = function() {
        var remainingItems = presenter.items.slice(0), currentItem;

        presenter.$view.find('.placeholder').each(function(index, placeholder) {
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
        presenter.showErrorsMode = true;
        markInactive();
        if (!presenter.configuration.isActivity) return;

        var remainingItems = presenter.items.slice(0), currentItem;
        presenter.$view.find('.placeholder').each(function(index, placeholder) {
            currentItem = $(placeholder).attr('draggableItem');
            var currentItemIndex = remainingItems.indexOf(currentItem);
            if (currentItemIndex !== -1) {
                remainingItems.splice(currentItemIndex, 1);
                $(placeholder).addClass('placeholder_valid');
            }
        });

        presenter.$view.find('.placeholder:not(.placeholder_valid)').addClass('placeholder_invalid');
    };



    presenter.setWorkMode = function() {
        presenter.showErrorsMode = false;
        removeInactivityMark();
        if (!presenter.configuration.isActivity) return;

        presenter.$view.find('.placeholder_valid').removeClass('placeholder_valid');
        presenter.$view.find('.placeholder_invalid').removeClass('placeholder_invalid');
    };

    presenter.reset = function() {
        presenter.$view.find('.placeholder').remove();

        presenter.setWorkMode();

        presenter.clearSelected();
    };

    presenter.getState = function() {
        var state = [];

        presenter.$view.find('.placeholder').each(function(i, placeholder) {
            state.push({
                item : $(placeholder).attr('draggableItem'),
                value : $(placeholder).attr('draggableValue'),
                type : $(placeholder).attr('draggableType')
            });
        });

        return JSON.stringify(state);
    };

    presenter.setState = function(serializedState) {
        var state = JSON.parse(serializedState);

        for(var i = 0; i < state.length; i++) {
            presenter.performAcceptDraggable(presenter.$view.find('.multiplegap_container>.handler'), state[i], false, true);
        }
    };

    presenter.countItems = function () {
        return presenter.$view.find('.placeholder').length;
    };

    presenter.isAttemptedCommand = function () {
        return presenter.isAttempted();
    };

    presenter.isAttempted = function() {
        return presenter.countItems() > 0;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'countItems': presenter.countItems,
            'isAllOK': presenter.isAllOK,
            'isAttempted' : presenter.isAttempted
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    return presenter;
}