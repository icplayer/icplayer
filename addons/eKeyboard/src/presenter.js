function AddoneKeyboard_create(){

    var presenter = function(){};

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.display = null;
    presenter.isLoaded = false;
    presenter.functionsQueue = [];

    var keyboardIsVisible = true;
    var closeButtonElement = null;
    var openButtonElement = null;
    var lastClickedElement = null;
    var keyboardWrapper = null;
    var movedInput = false;
    var escClicked = false;


    presenter.LAYOUT_TO_LANGUAGE_MAPPING = {
        'french (special characters)' : "{ \
            'default': ['\u00e0 \u00e2 \u00e7 \u00e8 \u00e9 \u00ea \u00ee \u00ef \u00f4 \u00f9 \u0153 \u00fb \u00e6 \u00eb {shift}'], \
            'shift': ['\u00c0 \u00c2 \u00c7 \u00c8 \u00c9 \u00ca \u00cb \u00ce \u00cf \u00d4 \u00d9 \u00db \u00c6 \u0152 {shift}'] \
        }",
        'german (special characters)' : "{ \
            'default': ['\u00e4 \u00f6 \u00fc \u00df {shift}'], \
            'shift': ['\u00c4 \u00d6 \u00dc {empty} {shift}'] \
        }",
        'spanish (special characters)' : "{ \
            'default': ['\u00e1 \u00e9 \u00ed \u00f3 \u00fa \u00f1 \u00e7 \u00fc \u00a1 \u00bf \u00ba \u00aa {shift}'], \
            'shift': ['\u00c1 \u00c9 \u00cd \u00d3 \u00da \u00d1 \u00c7 \u00dc {empty} {empty} {empty} {empty} {shift}'] \
        }",
        'italian (special characters)' : "{ \
            'default': ['\u00e0 \u00e8 \u00e9 \u00ec \u00f2 \u00f9 {shift}'], \
            'shift': ['\u00c0 \u00c8 \u00c9 \u00cc \u00d2 \u00d9 {shift}'] \
        }"
    };

    function touchStartDecorator(func, element) {
        $(element).on('click', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            func();
        });
    }

    function initializeCloseButton() {
        closeButtonElement = document.createElement('button');
        closeButtonElement.className = 'eKeyboard-close-button';
        closeButtonElement.style.position = 'absolute';
        closeButtonElement.style.display= 'none';
        closeButtonElement.innerHTML = '\u2716';

        $(keyboardWrapper).append(closeButtonElement);

        touchStartDecorator(closeButtonCallBack, closeButtonElement);
    }

    function initializeOpenButton() {
        openButtonElement = document.createElement('button');
        openButtonElement.className = 'eKeyboard-open-button';
        openButtonElement.style.display = 'none';
        openButtonElement.style.zindex = 'none';
        $(openButtonElement).on('mousedown', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            showOpenButtonCallback();
        });

        $("body").append(openButtonElement);
    }

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
            'ID': model["ID"],
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
            'customDisplay' : customDisplay,
            'showCloseButton': ModelValidationUtils.validateBoolean(model['showCloseButton'])
        }
    };

    function runLogic(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.view = view;
        presenter.isPreview = isPreview;
        presenter.isShowCloseButton = false;

        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();

        keyboardWrapper = document.createElement("div");
        keyboardWrapper.className = "ui-ekeyboard-wrapper";
        $(document.body).append(keyboardWrapper);

        initializeOpenButton();
        initializeCloseButton();

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved_eKeyboard (ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        var mathJaxDeferred = new jQuery.Deferred(),
            mathJaxProcessEnded = mathJaxDeferred.promise();

        MathJax.Hub.Register.MessageHook("End Process", function (message) {
            if ($(message[1]).hasClass('ic_page')) {
                if(mathJaxDeferred.state() != 'resolved'){
                    mathJaxDeferred.resolve();
                }
            }

            if ($(message[1]).hasClass('ic_popup_page')) {
                if(mathJaxDeferred.state() != 'resolved'){
                    mathJaxDeferred.resolve();
                }
            }
        });

        $.when(presenter.pageLoaded, mathJaxProcessEnded).then(function() {
            presenter.configuration = presenter.validateModel(model, isPreview);

            if (presenter.configuration.isError) {
                DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
                return;
            }

            if (!isPreview) {
                if (presenter.configuration.customLayout.length > 0) {
                    try {
                        eval('presenter.configuration.customLayout = ' + presenter.configuration.customLayout);
                    } catch (e) {
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
                };

                var customDisplay = presenter.configuration.customDisplay;
                var display = $.extend(defaultDisplay, customDisplay);
                presenter.display = $.extend(defaultDisplay, customDisplay);


                if (MobileUtils.isMobileUserAgent(navigator.userAgent) && presenter.configuration.lockInput) {
                    $('input').addClass('ui-keyboard-lockedinput');
                    $('input').attr("readonly", true);
                }

                if (DevicesUtils.isInternetExplorer()) {
                    $(presenter.configuration.workWithViews).find('input').on('mousedown', function () {
                        $(this).focus();
                    });
                }

                $(presenter.configuration.workWithViews).find('input').on('focusin', function () {
                    lastClickedElement = this;
                    if (!keyboardIsVisible) {
                        if ($(this).data('keyboard') !== undefined) {
                            $(this).data('keyboard').destroy();
                        }
                        showOpenButton();
                    } else {
                        presenter.createEKeyboard(this, display);
                        $(this).trigger('showKeyboard');
                    }
                });


                $(presenter.configuration.workWithViews).find('input').on('forceClick', function () {
                    if (presenter.configuration.openOnFocus) {
                        $(this).data('keyboard').reveal();
                        if($(".ic_popup_page").length == 0){
                            $(this).data('keyboard').startup();
                        }
                    } else {
                        $(this).focus();
                    }
                });

                $(presenter.configuration.workWithViews).find('input').on('keyup', function (e) {
                    if (e.keyCode === 27) {
                        onEscClick(this);
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                });

                if (presenter.configuration.maxCharacters !== false) {
                    $(presenter.configuration.workWithViews).find('input').on("change paste keyup", function () {
                        if ($(this).val().length > presenter.configuration.maxCharacters) {
                            var self = this;
                            $(this).val($(this).val().substring(0, presenter.configuration.maxCharacters));

                            if ($(this).data('keyboard') !== undefined) {
                                //Fix bug with events
                                setTimeout(function () {
                                    $(self).data('keyboard').switchInput(true, true);
                                }, 0);
                            } else {
                                lastClickedElement = this;
                                movedInput = true;
                                getNextFocusableElement(this, true).focus();


                            }
                        }
                    });
                }
                //This is after setState because validateModel is in promise.
                if (!keyboardIsVisible) {
                    $(presenter.configuration.workWithViews).find('input').on('focusout', focusoutCallBack);
                }
            }
            for (var i = 0; i < presenter.functionsQueue.length; i++) {
                presenter.functionsQueue[i]();
            }
            presenter.isLoaded = true;
        });

    }

    presenter.createEKeyboard = function (element, display) {
        if ($(element).data('keyboard') !== undefined) {
            return;
        }

        $(element).keyboard({
            // *** choose layout ***
            layout: presenter.configuration.layoutType,
            customLayout: presenter.configuration.customLayout,
            position: {
                of : null, // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
                my : presenter.configuration.positionMy.value,
                at : presenter.configuration.positionAt.value,
                at2 : presenter.configuration.positionAt.value,
                offset : presenter.configuration.offset.value,
                collision: 'flip'
            },

                    // preview added above keyboard if true, original input/textarea used if false
                    usePreview: false,

                    // if true, the keyboard will always be visible
                    alwaysOpen: false,

                    // give the preview initial focus when the keyboard becomes visible
                    initialFocus: true,

                    // if true, keyboard will remain open even if the input loses focus.
                    stayOpen: true,

                    // *** change keyboard language & look ***
                    display: display,

                    // Message added to the key title while hovering, if the mousewheel plugin exists
                    wheelMessage: 'Use mousewheel to see other keys',

                    css: {
                        input          : '', //'ui-widget-content ui-corner-all', // input & preview
                        container      : 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix', // keyboard container
                        buttonDefault  : 'ui-state-default ui-corner-all', // default state
                        buttonHover    : 'ui-state-hover',  // hovered button
                        buttonAction   : 'ui-state-active', // Action keys (e.g. Accept, Cancel, Tab, etc); replaces "actionClass"
                        buttonDisabled : 'ui-state-disabled' // used when disabling the decimal button {dec}
                    },

                    // *** Useability ***
                    // Auto-accept content when clicking outside the keyboard (popup will close)
                    autoAccept: true,

                    // Prevents direct input in the preview window when true
                    lockInput: false,

                    // Prevent keys not in the displayed keyboard from being typed in
                    restrictInput: false,

                    // Check input against validate function, if valid the accept button is clickable;
                    // if invalid, the accept button is disabled.
                    acceptValid: true,

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

            appendTo: keyboardWrapper,

                    // If false, the shift key will remain active until the next key is (mouse) clicked on;
                    // if true it will stay active until pressed again
                    stickyShift: true,

                    // Prevent pasting content into the area
                    preventPaste: false,

                    // Set the max number of characters allowed in the input, setting it to false disables this option
                    //maxLength: presenter.configuration.maxCharacters,

                    // Mouse repeat delay - when clicking/touching a virtual keyboard key, after this delay the key
                    // will start repeating
                    repeatDelay: 500,

                    // Mouse repeat rate - after the repeatDelay, this is the rate (characters per second) at which the
                    // key is repeated. Added to simulate holding down a real keyboard key and having it repeat. I haven't
                    // calculated the upper limit of this rate, but it is limited to how fast the javascript can process
                    // the keys. And for me, in Firefox, it's around 20.
                    repeatRate: 20,

                    // resets the keyboard to the default keyset when visible
                    resetDefault: false,

                    // Event (namespaced) on the input to reveal the keyboard. To disable it, just set it to ''.
                    openOn: presenter.configuration.openOnFocus ? 'showKeyboard' : '',

                    // When the character is added to the input
                    keyBinding: 'touchend mousedown',

                    // combos (emulate dead keys : http://en.wikipedia.org/wiki/Keyboard_layout#US-International)
                    // if user inputs `a the script converts it to à, ^o becomes ô, etc.
                    useCombos: false,

                    // if true, keyboard will not close if you press escape.
                    ignoreEsc : true,

                    autoAcceptOnEsc : false,
                    // *** Methods ***
                    // Callbacks - add code inside any of these callback functions as desired
                    initialized: function (e, keyboard, el) {
                    },
                    beforeVisible: function (e, keyboard, el) {
                        if (!keyboard['$keyboard'].parent().hasClass('html')) {
                            var dialogBox = keyboard['$keyboard'].parent().find('.gwt-DialogBox');
                            dialogBox.append(keyboard['$keyboard']);
                        }

                        var parent = keyboard['$keyboard'].parent(),
                            popup = parent.find('.ic_popup');

                        if (popup.length > 0) {
                            popup.append(keyboard['$keyboard']);
                        }
                    },
                    visible: function (e, keyboard, el) {
                        var isVisibleInViewPort = getIsVisibleInViewPort(keyboard['$keyboard']);
                        if (!isVisibleInViewPort) {
                            return;
                        }

                        if (!isVisibleInViewPort.vertical || !isVisibleInViewPort.horizontal) {
                            shiftKeyboard(keyboard, isVisibleInViewPort);
                        }

                        showCloseButton();

                        $(closeButtonElement).position({
                            my:        "left top",
                            at:        "right top",
                            of:         keyboard['$keyboard'],
                            collision: 'fit'
                        });

                        keyboard['$keyboard'].draggable({
                            drag: function (event) {
                                $(closeButtonElement).position({
                                    my:        "left top",
                                    at:        "right top",
                                    of:         keyboard['$keyboard'],
                                    collision: 'fit'
                                });
                            }
                        });

                        $(document).on('mousedown.ekeyboard', function (event) {
                            if (event.target === lastClickedElement) return;

                            var wrapper = $(keyboardWrapper);

                            if (!wrapper.is(event.target) && wrapper.has(event.target).length === 0) {
                                $(this).off('mousedown.ekeyboard');
                                $(closeButtonElement).hide();

                                if ($(lastClickedElement).data('keyboard') !== undefined) {
                                    console.log('destroy');
                                    $(lastClickedElement).data('keyboard').destroy();
                                }
                            }
                        });
                    },
                    change: function (e, keyboard, el) {
                        $(element).trigger("change");
                    },
                    beforeClose: function(e, keyboard, el, accepted) {
                        $(document).off('mousedown.ekeyboard');
                        hideCloseButton();
                    },
                    accepted: function(e, keyboard, el) {},
                    canceled: function(e, keyboard, el) {},
                    hidden: function(e, keyboard, el) {},

                    switchInput : function(keyboard, goToNext, isAccepted){
                        var base = keyboard, kb, stopped = false,
                            all = $('input, textarea').filter(':enabled'),
                            indx = all.index(base.$el) + (goToNext ? 1 : -1);

                        if (indx > all.length - 1) {
                            stopped = keyboard.stopAtEnd;
                            indx = 0; // go to first input
                        }
                        if (indx < 0) {
                            stopped = keyboard.stopAtEnd;
                            indx = all.length - 1; // stop or go to last
                        }
                			if (!stopped) {
                				if (!base.close(isAccepted)) {
                                    return;
                                }
                                if (presenter.addonIsWorkingWithElement(all.eq(indx))) {
                                        presenter.createEKeyboard(all.eq(indx), display);
                                }
                                if (keyboardIsVisible) {
                                    all.eq(indx).trigger('forceClick');
                                }
                                if($(".ic_popup_page").length == 0){
                                    all.eq(indx).focus();
                                }
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
                    validate: function (keyboard, value, isClosing) {
                        return true;
                    }
                });
                $(lastClickedElement).trigger('forceClick');
            };

    function getNextFocusableElement (element, next) {
        var all = $('input, textarea').filter(':enabled');
        var indx = all.index(element) + (next ? 1 : -1);

        if (indx > all.length - 1) {
            indx = 0; // go to first input
        }
        if (indx < 0) {
            indx = all.length - 1; // stop or go to last
        }
        return all.eq(indx);

    }

    presenter.addonIsWorkingWithElement = function (element) {
        return ($(presenter.configuration.workWithViews).find(element).length != 0);
    };

    function asyncFunctionDecorator(func) {
        if (presenter.isLoaded) {
            func();
        } else {
            presenter.functionsQueue.push(func);
        }
    }

    function hideOpenButton() {
        openButtonElement.style.display = 'none';
    }

    function hideCloseButton() {
        $(closeButtonElement).hide();
    }

    function focusoutCallBack(ev) {
        if (!keyboardIsVisible && !movedInput) {
            hideOpenButton();
        }
        movedInput = false;
        ev.preventDefault();
    }

    function showButtonDecorator(func) {
        if (presenter.configuration.showCloseButton || presenter.isShowCloseButton) {
            func();
        }
    }

    function showCloseButton() {
        showButtonDecorator(function () {
            $(closeButtonElement).show();
        });
    }

    function closeButtonCallBack() {
        presenter.disable();

        $(lastClickedElement).focus();
        $(lastClickedElement).click();

        $(document).off('mousedown.ekeyboard');

        hideCloseButton();
    }

    function showOpenButton() {
        showButtonDecorator(function showOpenButtonToDecorator() {
            openButtonElement.style.display = 'block';
            actualizeOpenButtonPosition($(lastClickedElement));
        });
    }

    function showOpenButtonCallback() {
        hideOpenButton();

        presenter.enable();

        escClicked = false;

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            // hides native keyboard
            document.activeElement.blur();
        }

        $(lastClickedElement).click();
        $(lastClickedElement).focus();
        $(lastClickedElement).trigger('showKeyboard');

        $(presenter.configuration.workWithViews).find('input').attr("readonly", "readonly")
            .addClass('ui-keyboard-input ui-keyboard-lockedinput ui-keyboard-autoaccepted');
    }

    function actualizeOpenButtonPosition(element) {
        $(openButtonElement).position({
            of: element,
            my: presenter.configuration.positionMy.value,
            at: presenter.configuration.positionAt.value,
            at2: presenter.configuration.positionAt.value,
            offset: presenter.configuration.offset.value,
            collision: 'flip'
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

        if ($(element).length == 0) {
            return;
        }

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

    function onEscClick(element) {
        if (escClicked) {
            $(element).val("");
        } else {
            presenter.disable();
            escClicked = true;
        }
        $(lastClickedElement).focus();
        $(lastClickedElement).click();
    }

    presenter.run = function(view, model){
        runLogic(view, model, false);
    };

    presenter.setShowErrorsMode = function(){
    };

    presenter.executeCommand = function(name, params) {
        if (presenter.configuration.isError) {
            return;
        }

        var commands = {
            'open' : presenter.openCommand,
            'disable' : presenter.disable,
            'enable' : presenter.enable,
            'showCloseButton' : presenter.showCloseButton
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.showCloseButton = function () {
        presenter.isShowCloseButton = true;
    };

    presenter.disable = function (){
        asyncFunctionDecorator(presenter.disableFunc.bind(this));
    };

    presenter.disableFunc = function () {
        presenter.sendEvent("disable");
        if (presenter.configuration.openOnFocus) {
            keyboardIsVisible = false;
        }
        var inputs = $(presenter.configuration.workWithViews).find('input');
        for (var i = 0; i < inputs.length; i++) {
            try {
                $(inputs[i]).data('keyboard').destroy();
            } catch(err){}
        }

        $(presenter.configuration.workWithViews).find('input').on('focusout', focusoutCallBack);
        $(presenter.configuration.workWithViews).find('input').removeClass('ui-keyboard-input ui-keyboard-input-current').removeAttr("readonly");
    };

    presenter.enable = function () {
        asyncFunctionDecorator(presenter.enableFunc.bind(this));
    };

    presenter.enableFunc = function () {
        presenter.sendEvent("enable");
        keyboardIsVisible = true;
        $(presenter.configuration.workWithViews).find('input').off('focusout', focusoutCallBack);
    };

    presenter.open = function (moduleId, index) {
        asyncFunctionDecorator(presenter.openFunc.bind(this, moduleId, index));
    };

    presenter.openFunc = function(moduleId, index) {
        var module = presenter.playerController.getModule(moduleId);
        try {
            var input = $(module.getView()).find('input:enabled').get(parseInt(index, 10) - 1);
            presenter.createEKeyboard(input, presenter.display);
            $(input).data('keyboard').reveal();
        } catch (e) {
        }

    };

    presenter.openCommand = function(moduleId, index) {
        if ($.isArray(moduleId)) {
            presenter.open(moduleId[0], moduleId[1]);
        } else {
            presenter.open(moduleId, index);
        }
    };

    presenter.sendEvent = function (status) {
        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item': '',
            'value': status
        });
    };




    presenter.destroy = function destroy_addon_eKeyboard_function () {
        if (presenter.isPreview) {
            return;
        }

        $(presenter.configuration.workWithViews).find('input').off('focusout', focusoutCallBack);
        var inputs = $(presenter.configuration.workWithViews).find('input');
        for (var i = 0; i < inputs.length; i++) {
            try {
                $(inputs[i]).data('keyboard').destroy();
            } catch(err){}
        }

        $(keyboardWrapper).remove();
        $(openButtonElement).remove();
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

    presenter.getState = function () {
        return JSON.stringify({
            "isClosed": keyboardIsVisible,
            "isShowCloseButton": presenter.isShowCloseButton
        });
    };

    presenter.setState = function (state) {
        var parsedState = JSON.parse(state);
        keyboardIsVisible = parsedState.isClosed;

        if(parsedState.isShowCloseButton != undefined) {
            presenter.isShowCloseButton = parsedState.isShowCloseButton;
        }
    };

    return presenter;
}