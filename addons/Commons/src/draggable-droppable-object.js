/**
 * Commons for Draggable Droppable Objects
* @module commons
*/
(function (window) {
    /**
     *
     * This is helper function in this module. Creates a expcetion with specified message & name
     * @param message {String} Message to be shown when exception is thrown
     * @param name {String} Type of exception
     * @constructor
     */
    function CustomException(message, name) {
        this.message = message;
        this.name = name;
    }

    /**
     *
     * Function which checks if configuration object have specified attribute defined.
     *
     * @method
     * @param configuration {Object} Configuration Object passed to Draggable Droppable constructor
     * @param attributeName {String} Name of attribute of object to test
     * @param message {String} Message for exception which will be thrown
     * @param error {String} Type of exception which will be thrown
     * @returns {boolean}
     */
    function isDefined(configuration, attributeName, message, error) {
        var undefined;
        if (configuration[attributeName] === undefined) {
            throw new CustomException(message, error);
        }
        
        return true;
    }

    /**
     * Function which checks if configuration object have specified attribute defined.
     *
     * @method
     * @param configuration {Object} Configuration Object passed to Draggable Droppable constructor
     * @param attributeName {String} Name of attribute of object to test
     * @param message {String} Message for exception which will be thrown
     * @param type {String} Type for which will be checked attribute
     * @returns {boolean}
     */
    function isType(configuration, attributeName, message, type) {
        if (typeof configuration[attributeName] !== type) {
            throw new TypeError(message)
        }
        
        return true;
    }

    /**
     Draggable Droppable Object - Object is empty span at default, which is draggable, droppable and clickable.
     Holds logic for emptying gap, filling and sending proper events at all actions.

     User can provide in configuration one of below optional functions, just remember that changing createView may change
     functionging some of this functions:
        - createView
        - setValue
        - setViewValue
        - helper
        - makeGapEmpty
        - fillGap
        - connectEvents

     @class Draggable Droppable Object

     @param configuration {object} Configuration object
        @param configuration.addonID {String}
        @param configuration.objectID {String} Created DOM ID
        @param configuration.eventBus {Object} Event bus object, required for sending events
        @param configuration.getSelectedItem {Function} Function provided by addon to retrieve last selected item
        @param [configuration.source] {String} ID of source which will be used at sending proper events by this object - default value empty string
        @param [configuration.value] {String} Value which will be set to object - default value empty string
        @param [configuration.initialValue] {String} Value which used when the object will be reset by reset function - default value empty string
        @param [configuration.type] {String} It's used at sending proper events by this object - default value string "string"
        @param [configuration.showAnswersValue] {String} Value which will be used at show answers function - default value empty string, it is used also to determine if object is correct or wrong
        @param [configuration.createView] {Function} Method for object which will be used to create View, have to return jQuery object
        @param [configuration.connectEvents] {Function} Method for object which will connect to jQuery view mouse, drag, drop events and handlers
        @param [configuration.setValue] {Function} Method for object which will set object model value
        @param [configuration.setViewValue] {Function} Method for object which will set DOM value when proper changes are made, used by makeGapEmpty, fillGap
        @param [configuration.helper] {Function} Method for object which is used at binding draggable and helper, should return string "clone" or jQueryObject
        @param [configuration.makeGapEmpty] {Function} Method which is used to clean the object model & DOM view
        @param [configuration.fillGap] {Function} Method which is used to fill up object model & DOM view

     @param {object} [cssConfiguration] Css Configuration Object
        @param [cssConfiguration.correct] {String} Class added to view DOM when object is determined as correct
        @param [cssConfiguration.wrong] {String} Class added to view DOM when object is determined as wrong
        @param [cssConfiguration.showAnswer] {String} Class added to view DOM when object is in show answers mode
     @constructor
     */
    function DraggableDroppableObject (configuration, cssConfiguration) {
        DraggableDroppableObject._internal.validateConfiguration(configuration);


        this.addonID = configuration.addonID;
        this.objectID = configuration.objectID;

        this.source = configuration.source || "";
        this.value = configuration.value || "";
        this.initialValue = configuration.initialValue || "";
        this.showAnswersValue = configuration.showAnswersValue || "";
        this.type = configuration.type || "string";

        this.correctCSSClass = cssConfiguration.correct || "";
        this.wrongCSSClass = cssConfiguration.wrong || "";
        this.showAnswerCSSClass = cssConfiguration.showAnswer || "";

        this._isClickable = true;

        this.createView = configuration.createView || DraggableDroppableObject.prototype.createView;
        this.connectEvents = configuration.connectEvents || DraggableDroppableObject._internal.connectEvents;
        this.setValue = configuration.setValue || DraggableDroppableObject.prototype.setValue;
        this.setViewValue = configuration.setViewValue || DraggableDroppableObject.prototype.setViewValue;
        this.helper = configuration.helper || DraggableDroppableObject.prototype.helper;
        this.makeGapEmpty = configuration.makeGapEmpty || DraggableDroppableObject.prototype.makeGapEmpty;
        this.fillGap = configuration.fillGap || DraggableDroppableObject.prototype.fillGap;

        this.eventBus = configuration.eventBus;
        this.getSelectedItem = configuration.getSelectedItem;

        this.$view = this.createView.call(this);
        this.connectEvents(this);
    }

    DraggableDroppableObject._internal = {
        /**
         * @protected validateConfiguration
         * @param configuration
         */
        validateConfiguration: function validateConfiguration (configuration) {
            isDefined(configuration, "eventBus", "EventBus attribute object is undefined in configuration object", "UndefinedEventBusError");
            isType(configuration, "eventBus", "EventBus attribute should be a event bus object", "function");

            isDefined(configuration, "getSelectedItem", "Get Selected Item function is undefined in configuration object", "UndefinedGetSelectedItemError");
            isType(configuration, "getSelectedItem", "Get Selected Item should be a function", "function");

            isDefined(configuration, "addonID", "AddonID attribute is undefined in configuration object", "UndefinedAddonIDError");
            isType(configuration, "addonID", "AddonID attribute should be a string type in configuration object", "string");

            isDefined(configuration, "objectID", "objectID attribute is undefined in configuration object", "UndefinedObjectIDError");
            isType(configuration, "objectID", "objectID attribute should be a string type in configuration object", "string");


            if(configuration['createView'] !== undefined) {
                isType(configuration, "createView", "Create view have to be a function", "function");
            }

            if(configuration['setValue'] !== undefined) {
                isType(configuration, "setValue", "Set value have to be a function", "function");
            }

            if(configuration['setViewValue'] !== undefined) {
                isType(configuration, "setViewValue", "Set view value have to be a function", "function");
            }

            if(configuration['makeGapEmpty'] !== undefined) {
                isType(configuration, "makeGapEmpty", "Make gap empty have to be a function", "function");
            }

            if(configuration['connectEvents'] !== undefined) {
                isType(configuration, "connectEvents", "Fill gap have to be a function", "function");
            }

            if(configuration['fillGap'] !== undefined) {
                isType(configuration, "fillGap", "Fill gap have to be a function", "function");
            }
        },

        /**
         * Checks if selectedItem is after validation an object of type - empty.
         * @method isSelectedItem
         * @protected isSelectedItemEmpty
         * @param selectedItem {object} Validated data of event ItemSelected
         *      @param selectedItem.type {string}
         * @returns {boolean}
         */
        isSelectedItemEmpty: function (selectedItem) {
            return selectedItem.type === "Empty";
        },

        /**
         * Wrapper function for getSelectedItem method. Calls validation on raw getSelectedItem object
         * @param this {object} Draggable Droppable Object
         * @protected getSelectedItemWrapper
         * @method getSelectedItemWrapper
         * @returns {*}
         */
        getSelectedItemWrapper: function () {
                return DraggableDroppableObject._internal.validateSelectedItemData(this.getSelectedItem.call(this));
        },

        getClickHandler: function () {
            return function (event) {
                this.stopPropagationAndPreventDefault(event);
                this.clickDispatcher(event);
            }.bind(this);
        },
        
        getDropHandler: function () {
            return function (event, ui) {
                this.stopPropagationAndPreventDefault(event);
                this.dropHandler(event, ui);
            }.bind(this);
        },
        
        getStartDraggingHandler: function () {
            return function (event, ui) {
                this.wrapperStartDraggingHandler(event, ui);
            }.bind(this);
        },
    
        getStopDraggingHandler: function() {
            return function (event, ui) {
                this.wrapperStopDraggingHandler(event, ui);
            }.bind(this);
        },

        /**
         * Method validates type, value, item data of event itemSelected. Changes type to empty which is required at clicking
         * if object is invalid.
         * @protected validateSelectedItemData
         * @param data {object} Data of event itemSelected
         * @returns {object}
         */
        validateSelectedItemData: function (data) {
            function changeType (data) {
                data.type = "Empty";
                return data;
            }
        
            if (data.value === null) {
                return changeType(data);
            }
        
            if (data.item === null) {
                return changeType(data);
            }
        
            if (data.type === undefined) {
                return changeType(data);
            }
        
            if (data.value === undefined) {
                return changeType(data);
            }
        
            if (data.item === undefined) {
                return changeType(data);
            }
        
            return data;
        },

        /**
         * Compares value with showAnswersValue
         * Its called with this as Draggable Droppable Object.
         * @private isUserAnswerCorrect
         * @param this {object} Draggable Droppable Object
         * @returns {boolean}
         */
        isUserAnswerCorrect: function () {
            return this.value == this.showAnswersValue;
        },

        /**
         * Returns object with required data at sending events
         * Its called with this as Draggable Droppable Object.
         * @protected getDraggableEventsData
         * @method getDraggableEventsData
         * @param this {object} Draggable Droppable Object
         * @returns {{source: string, item: string, value: string, type: string}}
         */
        getDraggableEventsData: function () {
            return {
                source: this.addonID,
                item: this.source,
                value: this.value,
                type: "string"
            };
        },

        connectEvents: function () {
            this.bindClickHandler();
            this.bindDropHandler();
        }
    };

    /**
    * Its called with this as Draggable Droppable Object.
    * @method setValue
    * @param value {string}
    * @param this {object} Draggable Droppable Object
    */
    DraggableDroppableObject.prototype.setValue = function (value) {
        this.value = value;
    };

    /**
    * Sets proper value to html view attribute
    * Its called with this as Draggable Droppable Object.
    * @method setViewValue
    * @param value {string}
    * @param this {object} Draggable Droppable Object
    */
    DraggableDroppableObject.prototype.setViewValue = function (value) {
        this.$view.html(value);
    };

    /**
    * Function which is called upon binding draggable, its return value is passed to helper attribute of draggable jQuery UI
    * @method helper
    * @returns {string}
    */
    DraggableDroppableObject.prototype.helper = function () {
        return "clone";
    };

    /**
    * Change html View to empty, cleans source and value and also unbinds draggable property.
    * Its called with this as Draggable Droppable Object.
    * @method makeGapEmpty
    * @param this {object} Draggable Droppable Object
    */
    DraggableDroppableObject.prototype.makeGapEmpty = function () {
        this.setValue.call(this, "");
        this.setViewValue.call(this, "");
        this.setSource.call(this, "");
        this.destroyDraggableProperty();
    };

    /**
     * Creates a jQuery HTMLElement which will be used by Draggable Droppable Object.
     * Should be creating element with provided objectID, ui-draggable and ui-widget-content CSS classes which are required
     * for jQuery UI. By default creates draggable, droppable span
     * Its called with this as Draggable Droppable Object.
     * @method createView
     * @param this {object} Draggable Droppable Object
     * @returns {*|jQuery|HTMLElement}
     */
    DraggableDroppableObject.prototype.createView = function () {
        var $span = $('<span></span>');
        $span.attr('id', this.objectID);
        $span.addClass("ui-draggable");
        $span.addClass("ui-widget-content");

        return $span;
    };

    /**
     * Fills object with data passed by itemSelectedEvent. Changes source, value, viewValue. Sends item consumed event and
     * binds draggable handler.
     * Its called with this as Draggable Droppable Object.
     * @method fillGap
     * @param selectedItem {object} Data object of event ItemSelected
     * @param this {object} Draggable Droppable Object
     */
    DraggableDroppableObject.prototype.fillGap = function (selectedItem) {
        this.setValue.call(this, selectedItem.value);
        this.setViewValue.call(this, selectedItem.value);
        this.setSource.call(this, selectedItem.item);

        this.sendItemConsumedEvent();
        this.bindDraggableHandler();
    };

    /**
     * Returns object value
     * @method getValue
     * @returns {string}
     */
    DraggableDroppableObject.prototype.getValue = function () {
        return this.value;
    };

    /**
     * Returns object DOM View
     * @method getView
     * @returns {jQuery Object}
     */
    DraggableDroppableObject.prototype.getView = function () {
        return this.$view;
    };

    /**
     * @method getAddonID
     * @returns {string}
     */
    DraggableDroppableObject.prototype.getAddonID = function () {
        return this.addonID;
    };

    /**
     * Returns object DOM View ID
     * @method getObjectID
     * @returns {string}
     */
    DraggableDroppableObject.prototype.getObjectID = function () {
        return this.objectID;
    };

    /**
     * @method getSource
     * @returns {string}
     */
    DraggableDroppableObject.prototype.getSource = function () {
        return this.source;
    };

    /**
     * @method setSource
     * @param source {string}
     */
    DraggableDroppableObject.prototype.setSource = function (source) {
        this.source = source;
    };

    /**
     * Add provided css class to object view attribute
     * @method addCSSClass
     * @param {String} CSSClassName
     */
    DraggableDroppableObject.prototype.addCSSClass = function (CSSClassName) {
        this.$view.addClass(CSSClassName);
    };

    /**
     * Removes  provided css class from object view attribute
     * @method removeCSSClass
     * @param CSSClassName
     */
    DraggableDroppableObject.prototype.removeCSSClass = function (CSSClassName) {
        this.$view.removeClass(CSSClassName);
    };

    /**
     * Add provided class in cssConfiguration.wrong to object view attribute
     * @method addWrongCSSClass
     */
    DraggableDroppableObject.prototype.addWrongCSSClass = function () {
        this.addCSSClass(this.wrongCSSClass);
    };

    /**
     * Removes from view provided class in cssConfiguration.wrong
     * @method removeWrongCSSClass
     */
    DraggableDroppableObject.prototype.removeWrongCSSClass = function () {
        this.removeCSSClass(this.wrongCSSClass);
    };

    /**
     * Add correct css class provided in cssConfiguration.correct to object view attribute
     * @method addCorrectCSSClass
     */
    DraggableDroppableObject.prototype.addCorrectCSSClass = function () {
        this.addCSSClass(this.correctCSSClass);
    };

    /**
     * Removes correct css class provided in cssConfiguration.correct from object view attribute
     * @method removeCorrectCSSClass
     */
    DraggableDroppableObject.prototype.removeCorrectCSSClass = function () {
        this.removeCSSClass(this.correctCSSClass);
    };

    /**
     * Add show answer css class provided in cssConfiguration.showAnswer to object view attribute
     * @method addShowAnswersCorrectCSSClass
     */
    DraggableDroppableObject.prototype.addShowAnswersCSSClass = function () {
        this.addCSSClass(this.showAnswerCSSClass);
    };

    /**
     * Remove show answer css class provided in cssConfiguration.showAnswer from object view attribute
     * @method removeShowAnswersCorrectCSSClass
     */
    DraggableDroppableObject.prototype.removeShowAnswersCSSClass = function () {
        this.removeCSSClass(this.showAnswerCSSClass);
    };

    /**
     * Binds to object view attribute click event. Uses clickHandler method.
     * @method bindClickHandler
     */
    DraggableDroppableObject.prototype.bindClickHandler = function () {
        this.$view.click(DraggableDroppableObject._internal.getClickHandler.call(this));
    };

    /**
     * Binds to object view attribute drop event. Uses dropHandler method.
     * @method bindDropHandler
     */
    DraggableDroppableObject.prototype.bindDropHandler = function () {
        this.$view.droppable({
            drop: DraggableDroppableObject._internal.getDropHandler.call(this)
        });
    };

    /**
     * Binds to object view attribute draggable event.
     * Uses startDraggingHandler for start event.
     * Uses stopDraggingHandler for stop event.
     * Uses helper function for helper.
     * Revert is set to false
     * @method bindDraggableHandler
     */
    DraggableDroppableObject.prototype.bindDraggableHandler = function () {
        this.$view.draggable({
            revert: false,
            helper: this.helper(),
            start: DraggableDroppableObject._internal.getStartDraggingHandler.call(this),
            stop: DraggableDroppableObject._internal.getStopDraggingHandler.call(this)
        });
    };

    /**
     * Handler for click event on object DOM view.
     * Handler get last selected item, if its none object is being made empty, otherwise fills gap with item.
     * @method clickHandler
     * @param event {Object} click event object
     */
    DraggableDroppableObject.prototype.clickHandler = function (event) {
        var selectedItem = DraggableDroppableObject._internal.getSelectedItemWrapper.call(this);

        if (DraggableDroppableObject._internal.isSelectedItemEmpty(selectedItem)) {
            this.sendItemReturnedEvent();
            this.makeGapEmpty.call(this);
        } else {
            this.fillGap.call(this, selectedItem);
        }
    };

    /**
     * Helper method which prevents calling clickHandler directly after dragging action. Without this when user drags gap,
     * click event is being fired and click handler called after dropping DOM View.
     * @method clickDispatcher
     * @param event {Object} click event object
     */
    DraggableDroppableObject.prototype.clickDispatcher = function (event) {
        if (this._isClickable) {
            this.clickHandler.call(this, event);
        } else {
            this._isClickable = true;
        }
    };

    /**
     * Callback for drop event.
     * It sends item returned event and fills gap
     * Called with this as DraggableDroppableObject
     * @method dropHandler
     * @param event {object} drop event jQuery UI object
     * @param ui {object} jQuery UI object
     */
    DraggableDroppableObject.prototype.dropHandler = function (event, ui) {
        this.sendItemReturnedEvent();
        this.fillGap.call(this, DraggableDroppableObject._internal.getSelectedItemWrapper.call(this));
    };

    /**
     * Callback for start dragging event.
     * Sets temporary view value to empty gap.
     * Sends item returned event.
     * Sends item dragged events
     * Change ui helper zIndex to 100, so gap will be always on top other DOM elements
     * This method should always send ItemReturnedEvent & ItemDraggedEvent
     * Called with this as DraggableDroppableObject
     * @method startDraggingHandler
     * @param event {object} start dragging event jQuery UI object
     * @param ui {object} jQuery UI object
     */
    DraggableDroppableObject.prototype.startDraggingHandler = function (event, ui) {
        this.setViewValue.call(this, "");
        this.sendItemReturnedEvent();
        this.sendItemDraggedEvent();
        ui.helper.zIndex(100);
    };

    /**
     * Wrapper function for start dragging handler. Changes isClickable private attribute of object to false, so click handler
     * wont be fired after dropping object. Calls startDraggingHandler after ending.
     * @method wrapperStartDraggingHandler
     * @param event {object} start dragging event jQuery UI object
     * @param ui {object} jQuery UI object
     */
    DraggableDroppableObject.prototype.wrapperStartDraggingHandler = function (event, ui) {
        this._isClickable = false;
        this.startDraggingHandler(event, ui);
    };

    /**
     * Wrapper function for stop dragging handler. Changes isClickable private attribute of object to true
     * @method wrapperStopDraggingHandler
     * @param event {object} start dragging event jQuery UI object
     * @param ui {object} jQuery UI object
     */
    DraggableDroppableObject.prototype.wrapperStopDraggingHandler = function (event, ui) {
        this._isClickable = true;
        this.stopDraggingHandler(event, ui);
    };

    /**
     * Callback for stop dragging event.
     * Removes helper object created by jQuery UI, sends item stopped event and makes gap empty
     * @method stopDraggingHandler
     * @param event {object} start dragging event jQuery UI object
     * @param ui {object} jQuery UI object
     */
    DraggableDroppableObject.prototype.stopDraggingHandler = function (event, ui) {
        ui.helper[0].remove();
        this.sendItemStoppedEvent();
        this.makeGapEmpty.call(this);
    };

    /**
     * Unbinds draggable property from view attribute of object
     * @method destroyDraggableProperty
     */
    DraggableDroppableObject.prototype.destroyDraggableProperty = function () {
        this.$view.draggable("destroy");
    };

    /**
     * @method stopPropagationAndPreventDefault
     * @param event {object}
     */
    DraggableDroppableObject.prototype.stopPropagationAndPreventDefault = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };

    /**
     * Sends itemDragged by event bus with object value, source, type, addonID
     * @method sendItemDraggedEvent
     */
    DraggableDroppableObject.prototype.sendItemDraggedEvent = function () {
        this.sendEvent("itemDragged", DraggableDroppableObject._internal.getDraggableEventsData.call(this));
    };

    /**
     * Sends itemStopped by event bus with object value, source, type, addonID
     * @method sendItemStoppedEvent
     */
    DraggableDroppableObject.prototype.sendItemStoppedEvent = function () {
        this.sendEvent("itemStopped", DraggableDroppableObject._internal.getDraggableEventsData.call(this));
    };

    /**
     * Sends itemReturned by event bus with object value, source, type, addonID
     * @method sendItemReturnedEvent
     */
    DraggableDroppableObject.prototype.sendItemReturnedEvent = function () {
        this.sendEvent("ItemReturned", DraggableDroppableObject._internal.getDraggableEventsData.call(this));
    };

    /**
     * Sends itemConsumed by event bus with object value, source, type, addonID
     * @method sendItemConsumedEvent
     */
    DraggableDroppableObject.prototype.sendItemConsumedEvent = function () {
        this.sendEvent("ItemConsumed", DraggableDroppableObject._internal.getDraggableEventsData.call(this));
    };

    /**
     * Sends events by eventBus attribute with provided eventName & data
     * @method sendEvent
     * @param eventName {String} event name
     * @param data {object} data object
     */
    DraggableDroppableObject.prototype.sendEvent = function (eventName, data) {
        this.eventBus.sendEvent(eventName, data);
    };

    /**
     * Unbinds click, draggable, droppable events from view attribute
     * @method lock
     */
    DraggableDroppableObject.prototype.lock = function () {
        this.$view.unbind("click");
        this.$view.draggable("disable");
        this.$view.droppable("disable");
    };

    /**
     * Binds click, draggable, droppable events from view attribute
     * @method unlock
     */
    DraggableDroppableObject.prototype.unlock = function () {
        this.bindClickHandler();
        this.$view.draggable("enable");
        this.$view.droppable("enable");
    };

    /**
     * Resets object value, view value to initialValue and source to empty string
     * @method reset
     */
    DraggableDroppableObject.prototype.reset = function () {
        this.setValue.call(this, this.initialValue);
        this.setViewValue.call(this, this.initialValue);
        this.setSource.call(this, "");

        this.destroyDraggableProperty();
    };

    /**
     * Sets object to show errors mode.
     * Should lock object and depending if its correct or not add proper class
     * @method setShowErrorsMode
     */
    DraggableDroppableObject.prototype.setShowErrorsMode = function () {
        this.lock();

        if(DraggableDroppableObject._internal.isUserAnswerCorrect.call(this)) {
            this.addCorrectCSSClass();
        } else {
            this.addWrongCSSClass();
        }
    };

    /**
     * Sets object to work mode.
     * Should unlock object and depending if its correct or not remove proper class
     * @method setWorkMode
     */
    DraggableDroppableObject.prototype.setWorkMode = function () {
        this.unlock();

        if(DraggableDroppableObject._internal.isUserAnswerCorrect.call(this)) {
            this.removeCorrectCSSClass();
        } else {
            this.removeWrongCSSClass();
        }
    };

    /**
     * Method sets object to show answer mode.
     * Should lock object, add provided class and setViewValue to show answers value
     * @method showAnswer
     */
    DraggableDroppableObject.prototype.showAnswer = function () {
        this.lock();
        this.addShowAnswersCSSClass();

        this.setViewValue(this.showAnswersValue);
    };

    /**
     * Method hide answers.
     * Should unlock object, remove provided class and setViewValue to user actual value
     * @method showAnswer
     */
    DraggableDroppableObject.prototype.hideAnswer = function () {
        this.unlock();
        this.removeShowAnswersCSSClass();

        this.setViewValue(this.value);
    };

    /**
     * Sets state of object.
     * Sets value, viewValue, source and binds draggable handler, should be used if value is other than none
     * @method setState
     * @param value {string}
     * @param source {string}
     */
    DraggableDroppableObject.prototype.setState = function (value, source) {
        this.setValue.call(this, value);
        this.setViewValue.call(this, value);
        this.setSource.call(this, source);

        this.bindDraggableHandler();
    };
    window.DraggableDroppableObject = window.DraggableDroppableObject || DraggableDroppableObject;
})(window);
