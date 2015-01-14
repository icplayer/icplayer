function AddoneKeyboard_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;

    presenter.LAYOUT_TO_LANGUAGE_MAPPING = {
        'french (special characters)' : "{ \
            'default': ['\u00e0 \u00e2 \u00e7 \u00e8 \u00e9 \u00ea \u00ee \u00ef \u00f4 \u00f9 \u0153 \u00e6 \u00eb {shift}'], \
            'shift': ['\u00c0 \u00c2 \u00c7 \u00c8 \u00c9 \u00ca \u00cb \u00ce \u00cf \u00d4 \u00d9 \u00c6 \u0152 {shift}'] \
        }",
        'german (special characters)' : "{ \
            'default': ['\u00e4 \u00f6 \u00fc \u00df {shift}'], \
            'shift': ['\u00c4 \u00d6 \u00dc {empty} {shift}'] \
        }",
        'spanish (special characters)' : "{ \
            'default': ['\u00e1 \u00e9 \u00ed \u00f3 \u00fa \u00f1 \u00e7 \u00fc \u00a1 \u00bf \u00ba \u00aa {shift}'], \
            'shift': ['\u00c1 \u00c9 \u00cd \u00d3 \u00da \u00d1 \u00c7 \u00dc {empty} {empty} {empty} {empty} {shift}'] \
        }"
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);
    };

    presenter.onEventReceived = function(eventName) {
        if (eventName == 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        }
    };

    presenter.validateType = function(rawType) {
        if (rawType == 'Numeric' || rawType.length == 0) {
            return 'num';
        }

        return rawType.toLowerCase();
    };

    presenter.validateMaxCharacters = function(rawMaxCharacters) {
        if (rawMaxCharacters.length == 0) {
            return {
                'isError' : false,
                'value' : false
            };
        }

        if ( !(/\d+/.test(rawMaxCharacters)) ) {
            return {
                'isError' : true,
                'errorCode' : 'E04'
            }
        }

        return {
            'isError' : false,
            'value' : parseInt(rawMaxCharacters, 10)
        };
    };

    presenter.ERROR_CODES = {
        'E01' : 'The position is wrong. See documentation for more details.',
        'E02' : 'Module ID not found.',
        'E03' : 'The module you provided has no getView method implemented.',
        'E04' : 'Max Characters must be a digit or empty string (unlimited).'
    };

    presenter.validatePosition = function(rawPosition, isMy) {
        if (rawPosition.length == 0) {
            return {
                isError: false,
                value: isMy ? 'left center' : 'right center'
            }
        }

        var possibilitiesOnTheLeft = ['left', 'center', 'right'],
            possibilitiesOnTheRight = ['top', 'center', 'bottom'],
            splitted = rawPosition.split(' ');

        if (splitted.length == 2
            && possibilitiesOnTheLeft.indexOf(splitted[0]) >= 0
            && possibilitiesOnTheRight.indexOf(splitted[1]) >= 0
            ) {

            return {
                isError: false,
                value: rawPosition
            }

        } else {
            return {
                isError: true,
                errorCode: 'E01'
            }
        }
    };

    presenter.validateOffsetData = function(positionMy, positionAt) {
        var splittedMy = positionMy.split(' '),
            splittedAt = positionAt.split(' ');

        if (splittedMy[1] == 'bottom' && splittedAt[1] == 'top') {
            return {
                orientation: 'horizontal',
                directionSign: '-',
                value: '0 -10'
            }
        }

        if (splittedMy[0] == 'left' && splittedAt[0] == 'right') {
            return {
                orientation: 'vertical',
                directionSign: '',
                value: '10 0'
            };
        }

        if (splittedMy[1] == 'top' && splittedAt[1] == 'bottom') {
            return {
                orientation: 'horizontal',
                directionSign: '',
                value : '0 10'
            };
        }

        if (splittedMy[0] == 'right' && splittedAt[0] == 'left') {
            return {
                orientation: 'vertical',
                directionSign: '-',
                value: '-10 0'
            };
        }

        return {
            orientation: 'none',
            directionSign: '',
            value : ''
        };
    };

    presenter.createPreview = function(view, model) {
        runLogic(view, model, true);
    };

    presenter.validateModel = function(model, isPreview) {
        var workWithModules = Helpers.splitLines(model['workWith']),
            workWithViews = [],
            layoutType = presenter.validateType(model['layoutType']),
            customLayout = model['customLayout'],
            maxCharacters = presenter.validateMaxCharacters(model['maxCharacters']),
            positionMy = presenter.validatePosition(model['positionMy'], true),
            positionAt = presenter.validatePosition(model['positionAt'], false),
            workWithIsValid = true,
            workWithErrorCode = '',
            customDisplay = model['customDisplay'];

        if (!isPreview) {
            $.each(workWithModules, function() {
                var module = presenter.playerController.getModule(this.toString()),
                    moduleNotFound = false,
                    getViewNotImplemented = false;

                if (module) {
                    if ( module.getView() ) {
                        workWithViews.push( module.getView() );
                    } else {
                        getViewNotImplemented = true;
                        return false;
                    }
                } else {
                    moduleNotFound = true;
                    return false;
                }

                if (getViewNotImplemented || moduleNotFound) {
                    workWithIsValid = false;
                    workWithErrorCode = moduleNotFound ? 'E02' : 'E03';
                    return false;
                }
            });
        }

        if (!workWithIsValid) {
            return {
                'isError' : true,
                'errorCode' : workWithErrorCode
            }
        }

        if (maxCharacters.isError) {
            return {
                'isError' : true,
                'errorCode' : maxCharacters.errorCode
            }
        }

        if (positionMy.isError) {
            return {
                'isError' : true,
                'errorCode' : positionMy.errorCode
            }
        }

        if (positionAt.isError) {
            return {
                'isError' : true,
                'errorCode' : positionAt.errorCode
            }
        }

        if (presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType] != undefined) {
            customLayout = presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType];
            layoutType = 'custom';
        }

        if (typeof(customDisplay) == 'undefined') {
            customDisplay = '';
        }

        return {
            'isError' : false,
            'workWithViews' : workWithViews,
            'layoutType' : layoutType,
            'customLayout' : customLayout,
            'positionAt' : positionAt,
            'positionMy' : positionMy,
            'maxCharacters' : maxCharacters.value,
            'offset' : presenter.validateOffsetData(positionMy.value, positionAt.value),
            'openOnFocus' : !ModelValidationUtils.validateBoolean(model['noOpenOnFocus']),
            'lockInput' : ModelValidationUtils.validateBoolean(model['lockStandardKeyboardInput']),
            'customDisplay' : customDisplay
        }
    };

    function runLogic(view, model, isPreview) {
        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();

        presenter.$view = $(view);

        presenter.pageLoaded.then(function() {
            presenter.configuration = presenter.validateModel(model, isPreview);

            if (presenter.configuration.isError) {
                DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
                return;
            }

            if (!isPreview) {
                if (presenter.configuration.customLayout.length > 0) {
                    try {
                        eval('presenter.configuration.customLayout = ' + presenter.configuration.customLayout);
                    } catch(e) {
                        presenter.ERROR_CODES['evaluationError'] = e.message;
                        DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, 'evaluationError');
                    }
                }

                if (presenter.configuration.customDisplay.length > 0) {
                    try {
                        eval('presenter.configuration.customDisplay = ' + presenter.configuration.customDisplay);
                    } catch(e) {
                        presenter.ERROR_CODES['evaluationError'] = e.message;
                        DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, 'evaluationError');
                    }
                }
                presenter.configuration.customLayout.id = new Date().getTime();

                var defaultDisplay = {
                    a      : '\u2714:Accept (Shift-Enter)', // check mark - same action as accept
                    accept : 'Accept:Accept (Shift-Enter)',
                    alt    : 'AltGr:Alternate Graphemes',
                    b      : '\u2190:Backspace',    // Left arrow (same as &larr;)
                    bksp   : 'Bksp:Backspace',
                    c      : '\u2716:Cancel (Esc)', // big X, close - same action as cancel
                    cancel : 'Cancel:Cancel (Esc)',
                    clear  : 'C:Clear',             // clear num pad
                    combo  : '\u00f6:Toggle Combo Keys',
                    dec    : '.:Decimal',           // decimal point for num pad (optional), change '.' to ',' for European format
                    e      : '\u21b5:Enter',        // down, then left arrow - enter symbol
                    enter  : 'Enter:Enter',
                    left   : '\u2190',              // left arrow (move caret)
                    lock   : '\u21ea Lock:Caps Lock', // caps lock
                    next   : 'Next',
                    prev   : 'Prev',
                    right  : '\u2192',              // right arrow (move caret)
                    s      : '\u21e7:Shift',        // thick hollow up arrow
                    shift  : 'CapsLock:CapsLock',
                    sign   : '\u00b1:Change Sign',  // +/- sign for num pad
                    space  : '&nbsp;:Space',
                    t      : '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
                    tab    : '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
                }

                var customDisplay = presenter.configuration.customDisplay;
                var display = $.extend(defaultDisplay, customDisplay);

                var config = {
                    // *** choose layout ***
                    layout       : presenter.configuration.layoutType,
                    customLayout : presenter.configuration.customLayout,

                    position     : {
                        of : null, // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
                        my : presenter.configuration.positionMy.value,
                        at : presenter.configuration.positionAt.value,
                        at2 : presenter.configuration.positionAt.value,
                        offset : presenter.configuration.offset.value,
                        collision: 'flip'
                    },

                    // preview added above keyboard if true, original input/textarea used if false
                    usePreview   : false,

                    // if true, the keyboard will always be visible
                    alwaysOpen   : false,

                    // give the preview initial focus when the keyboard becomes visible
                    initialFocus : true,

                    // if true, keyboard will remain open even if the input loses focus.
                    stayOpen     : false,

                    // *** change keyboard language & look ***
                    display : display,

                    // Message added to the key title while hovering, if the mousewheel plugin exists
                    wheelMessage : 'Use mousewheel to see other keys',

                    css : {
                        input          : '', //'ui-widget-content ui-corner-all', // input & preview
                        container      : 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix', // keyboard container
                        buttonDefault  : 'ui-state-default ui-corner-all', // default state
                        buttonHover    : 'ui-state-hover',  // hovered button
                        buttonAction   : 'ui-state-active', // Action keys (e.g. Accept, Cancel, Tab, etc); replaces "actionClass"
                        buttonDisabled : 'ui-state-disabled' // used when disabling the decimal button {dec}
                    },

                    // *** Useability ***
                    // Auto-accept content when clicking outside the keyboard (popup will close)
                    autoAccept   : true,

                    // Prevents direct input in the preview window when true
                    lockInput    : presenter.configuration.lockInput,

                    // Prevent keys not in the displayed keyboard from being typed in
                    restrictInput: false,

                    // Check input against validate function, if valid the accept button is clickable;
                    // if invalid, the accept button is disabled.
                    acceptValid  : true,

                    // Use tab to navigate between input fields
                    tabNavigation: true,

                    // press enter (shift-enter in textarea) to go to the next input field
                    enterNavigation : true,
                    // mod key options: 'ctrlKey', 'shiftKey', 'altKey', 'metaKey' (MAC only)
                    enterMod : 'altKey', // alt-enter to go to previous; shift-alt-enter to accept & go to previous

                    // if true, the next button will stop on the last keyboard input/textarea; prev button stops at first
                    // if false, the next button will wrap to target the first input/textarea; prev will go to the last
                    stopAtEnd : false,

                    // Set this to append the keyboard immediately after the input/textarea it is attached to.
                    // This option works best when the input container doesn't have a set width and when the
                    // "tabNavigation" option is true
                    appendLocally: false,

                    // If false, the shift key will remain active until the next key is (mouse) clicked on;
                    // if true it will stay active until pressed again
                    stickyShift  : true,

                    // Prevent pasting content into the area
                    preventPaste : false,

                    // Set the max number of characters allowed in the input, setting it to false disables this option
                    maxLength    : presenter.configuration.maxCharacters,

                    // Mouse repeat delay - when clicking/touching a virtual keyboard key, after this delay the key
                    // will start repeating
                    repeatDelay  : 500,

                    // Mouse repeat rate - after the repeatDelay, this is the rate (characters per second) at which the
                    // key is repeated. Added to simulate holding down a real keyboard key and having it repeat. I haven't
                    // calculated the upper limit of this rate, but it is limited to how fast the javascript can process
                    // the keys. And for me, in Firefox, it's around 20.
                    repeatRate   : 20,

                    // resets the keyboard to the default keyset when visible
                    resetDefault : false,

                    // Event (namespaced) on the input to reveal the keyboard. To disable it, just set it to ''.
                    openOn       : presenter.configuration.openOnFocus ? 'focus' : '',

                    // When the character is added to the input
                    keyBinding   : 'mousedown',

                    // combos (emulate dead keys : http://en.wikipedia.org/wiki/Keyboard_layout#US-International)
                    // if user inputs `a the script converts it to à, ^o becomes ô, etc.
                    useCombos    : false,

                    // *** Methods ***
                    // Callbacks - add code inside any of these callback functions as desired
                    initialized : function(e, keyboard, el) {
                    },
                    beforeVisible: function(e, keyboard, el) {

                        if(!keyboard['$keyboard'].parent().hasClass('html')) {
                            var dialogBox = keyboard['$keyboard'].parent().find('.gwt-DialogBox');
                            dialogBox.append(keyboard['$keyboard']);
                        }

                    },
                    visible     : function(e, keyboard, el) {

                        var isVisibleInViewPort = getIsVisibleInViewPort(keyboard['$keyboard']);

                        while (!isVisibleInViewPort.vertical || !isVisibleInViewPort.horizontal) {
                            shiftKeyboard(keyboard, isVisibleInViewPort);
                            isVisibleInViewPort = getIsVisibleInViewPort(keyboard['$keyboard']);
                        }

                        keyboard['$keyboard'].draggable();

                    },
                    change      : function(e, keyboard, el) {
                    	var max_chars = presenter.configuration.maxCharacters;
                    	if ($(el).attr('maxlength')) {
                    		max_chars = $(el).attr('maxlength');
                    	}

                        if( $(el).val().length ===  max_chars) {
                            keyboard.switchInput(true, true);
                        }
                    	
                    },
                    beforeClose : function(e, keyboard, el, accepted) {
                    },
                    accepted    : function(e, keyboard, el) {},
                    canceled    : function(e, keyboard, el) {},
                    hidden      : function(e, keyboard, el) {
                    },
                    // switchInput : false, // called instead of base.switchInput
                    switchInput : function(keyboard, goToNext, isAccepted){
                    	var base = keyboard, kb, stopped = false,
                				all = $('input, textarea').filter(':enabled'),
                				indx = all.index(base.$el) + (goToNext ? 1 : -1);
                				base.$keyboard.show();
                			if (indx > all.length - 1) {
                				stopped = keyboard.stopAtEnd;
                				indx = 0; // go to first input
                			}
                			if (indx < 0) {
                				stopped = keyboard.stopAtEnd;
                				indx = all.length - 1; // stop or go to last
                			}
                			if (!stopped) {
                				isAccepted = base.close(isAccepted);
                				if (!isAccepted) { return; }
                                all.eq(indx).focus();
                			}
                		
                		return false;
                	},
                    // this callback is called just before the "beforeClose" to check the value
                    // if the value is valid, return true and the  will continue as it should
                    // (close if not always open, etc)
                    // if the value is not value, return false and the clear the keyboard value
                    // ( like this "keyboard.$preview.val('');" ), if desired
                    // The validate function is called after each input, the "isClosing" value will be false;
                    // when the accept button is clicked, "isClosing" is true
                    validate    : function(keyboard, value, isClosing) { return true; }

                };

                if (MobileUtils.isEventSupported("touchend")) {
                    config.keyBinding = "touchend"
                }

                $(presenter.configuration.workWithViews).find('input:enabled').keyboard(config);
                $.each($(presenter.configuration.workWithViews).find('input:enabled'), function(){
                    var keyboard = $(this).data('keyboard');
                    //keyboard.startup();
                });

            }
        });
    }

    function shiftKeyboard(keyboard, isVisibleInViewPort) {
        if (!isVisibleInViewPort.horizontal) {
            var currentLeft = parseInt(keyboard['$keyboard'].css('left'), 10);
            keyboard['$keyboard'].css('left', currentLeft + parseInt(isVisibleInViewPort.horizontalSign + '10', 10));
        }
        if (!isVisibleInViewPort.vertical) {
            var currentTop = parseInt(keyboard['$keyboard'].css('top'), 10);
            keyboard['$keyboard'].css('top', currentTop + parseInt(isVisibleInViewPort.verticalSign + '10', 10));
        }
    }

    function getIsVisibleInViewPort(element) {
        var $window = $(window);

        if (this.length < 1)
            return;

        var $element = $(element),
            vpWidth = $window.width(),
            vpHeight = $window.height(),
            viewTop = $window.scrollTop(),
            viewBottom = viewTop + vpHeight,
            viewLeft = $window.scrollLeft(),
            viewRight = viewLeft + vpWidth,
            offset = $element.offset(),
            _top = offset.top,
            _bottom = _top + $element.height(),
            _left = offset.left,
            _right = _left + $element.width();

        return {
            vertical: ((_bottom <= viewBottom) && (_top >= viewTop)),
            horizontal: ((_right <= viewRight) && (_left >= viewLeft)),
            verticalSign: _bottom <= viewBottom ? '' : '-',
            horizontalSign: _right <= viewRight ? '' : '-'
        };
    }

    presenter.run = function(view, model){
        runLogic(view, model, false);
    };

    presenter.setShowErrorsMode = function(){
    };

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isError) return;

        var commands = {
            'open' : presenter.openCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.open = function(moduleId, index) {
        var module = presenter.playerController.getModule(moduleId);
        try {
            var input = $(module.getView()).find('input:enabled').get(parseInt(index, 10) - 1);
            $(input).data('keyboard').reveal();
        } catch (e) {
            alert(e.message);
        }

    };

    presenter.openCommand = function(moduleId, index) {
        if ($.isArray(moduleId)) {
            presenter.open(moduleId[0], moduleId[1]);
        } else {
            presenter.open(moduleId, index);
        }
    };

    presenter.setWorkMode = function(){
    };

    presenter.reset = function(){
    };

    presenter.getErrorCount = function(){
        return 0;
    };

    presenter.getMaxScore = function(){
        return 0;
    };

    presenter.getScore = function(){
        return 0;
    };

    presenter.getState = function(){
    };

    presenter.setState = function(state){
    };

    return presenter;
}