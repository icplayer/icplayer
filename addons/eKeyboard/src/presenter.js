function AddoneKeyboard_create(){

    var presenter = function(){};

    var math = require('https://unpkg.com/mathlive/dist/mathlive.mjs');

    presenter.playerController = null;
    presenter.eventBus = null;
    presenter.display = null;
    presenter.isLoaded = false;
    presenter.functionsQueue = [];

    var keyboardIsVisible = true;
    var closeButtonElement = null;
    var openButtonElement = null;
    var lastClickedElement = null;
    var movedInput = false;
    var escClicked = false;
    var mathfields = [];
    var inputValue;

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

    presenter.initializeCloseButton = function AddoneKeyboard_initializeCloseButton() {
        closeButtonElement = document.createElement('button');
        closeButtonElement.className = 'eKeyboard-close-button';
        closeButtonElement.style.position = 'absolute';
        closeButtonElement.innerHTML = '<span>\u2716</span>';
        closeButtonElement.style.display = 'none';

        $(presenter.keyboardWrapper).append(closeButtonElement);

        touchStartDecorator(closeButtonCallBack, closeButtonElement);
    };

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
            correctAnswers = model['correctAnswers'],
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
                
                    console.log(this);
                
                    var inputs = $("#"+this+" input");
                    var spans = $("#"+this+" span[class = 'subAnswer']");
                    $("#"+this+" span[class = 'normal']").css('margin-bottom', '30px');

                    for(i = 0; i < inputs.length; i++){
                        var div = document.createElement('div');
                        div.classList.add("mathfieldDiv");
                        div.id = "mathfieldDiv"+i;
                        div.style.width = 100 + "px";
                        div.style.height = 45 + "px";
                        spans[i].append(div);
    
                        var script = document.createElement("script");
                        script.type = 'module';
                        script.text = "import MathLive from 'https://unpkg.com/mathlive/dist/mathlive.mjs';"+
                        "window.mySuperField"+i+" = MathLive.makeMathField('mathfieldDiv"+i+"');";
                        $("body").append(script);
                        mathfields[i] = 'mathfieldDiv'+i;
                        
                        inputs[i].classList.add('inputNumber'+ i);
                    }
                    
    
                    var link1 = document.createElement("link");
                    link1.rel = 'stylesheet';
                    link1.href = 'https://unpkg.com/mathlive/dist/mathlive.core.css';
                    $("head").append(link1);
    
                    var link2 = document.createElement("link");
                    link2.rel = 'stylesheet';
                    link2.href = 'https://unpkg.com/mathlive/dist/mathlive.css';
                    $("head").append(link2);

                    if(inputValue != undefined){
                        var stateObject = Object.entries(inputValue);
                        stateObject.forEach(function(value){
                            var id = value[0].split('_')[1];
                            var text = value[1];
                            console.log(text.includes('⬚'));
                            if(text.includes('n') && text.includes('d')){
                                $('#'+id).append('\\frac{'+fracNumeratorText(text.split('n')[0])+'}{'+DenumeratorText(text.split('d')[0])+'}');
                            }
                            else if(text.includes('%')){
                                $('#'+id).append('\\%')
                            }else if(text.includes('_p')){
                                $('#'+id).append(powerText(text))
                            }else if(text.includes('_vec')){
                                $('#'+id).append(vectorText(text))
                            }else{
                                $('#'+id).append(text);
                            }
                            function vectorText(text){
                                var splitVal = text.split('_vec')[0];
                                if(splitVal.includes('⃗')){
                                    if(splitVal.includes('⬚')){return '\\vec{\\placeholder{}}}'}
                                    else{return '\\vec{'+splitVal.slice(0, -1)+'}}'}
                                }else{
                                    if(splitVal.includes('⬚')){return '\\bar{\\placeholder{}}}'}
                                    else{return '\\bar{'+splitVal.slice(0, -1)+'}}'}
                                }
                            }
                            function powerText (text){
                                var powerValue = text.split('_p')[0];
                                console.log(powerValue);
                                if(powerValue.includes('â¬š')){return '^{placeholder{}}'}
                                else{return '^{'+powerValue+'}'}
                            }
                            function fracNumeratorText (text){
                                if(text.includes('⬚')){return '\\placeholder{}'}
                                else{return text}
                            }
                             function DenumeratorText (text){
                                text = text.split('n')[1];
                                if(text.includes('⬚')){return '\\placeholder{denominator}'}
                                else{return text}
                            }
                        })};

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

    presenter.removeEventListeners = function () {
        presenter.configuration.$inputs.each(function (index, element) {
            element.removeEventListener('mousedown', presenter.focusOnMouseDown);
            element.removeEventListener('focus', presenter.openEKeyboardOnFocus);
            element.removeEventListener('forceClick', presenter.openEKeyboardOnForceClick);
            element.removeEventListener('keyup', presenter.onESCHideKeyboard);
            element.removeEventListener('change', presenter.moveToNextGap);
            element.removeEventListener('paste', presenter.moveToNextGap);
            element.removeEventListener('keyup', presenter.moveToNextGap);
            element.removeEventListener('focusout', focusoutCallBack);
        });
    };

    function runLogic(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.view = view;
        presenter.isPreview = isPreview;
        presenter.isShowCloseButton = false;

        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();

        presenter.keyboardWrapper = document.createElement("div");
        presenter.keyboardWrapper.className = "ui-ekeyboard-wrapper";
        $(document.body).append(presenter.keyboardWrapper);

        //initializeOpenButton();
        presenter.initializeCloseButton();

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
            presenter.configuration.$inputs = $(presenter.configuration.workWithViews).find('input');

            presenter.configuration.$inputs.each(
                function(){
                    var classList = $(this).attr("class");
                    var dividedClassList = classList.split(' ')[1];
                    var classNumber = dividedClassList.split('inputNumber')[1];
                    if($('#mathfieldDiv'+classNumber+'').text().trim().length == 0){
                        var p = document.createElement("p");
                        p.classList.add("writing");
                        p.id = "writing"+classNumber;
                        p.innerHTML = '123';
                        p.style.width = 10 + "px";
                        p.style.height = 10 + "px";
                        var x = $(this).offset().left;
                        var y = $(this).offset().top;
                        p.style.top = y+"px";
                        p.style.left = (x+79)+"px";
                        p.style.position = "absolute";
                        p.style.color = '#B8B8B8';
                        p.style.fontStyle = 'italic';
                        p.style.fontSize = 13+'px';
                        $('.ic_page').append(p);
                    }
            });

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
                    up     : '\u2191',              // up arrow (move caret)
                    down   : '\u2193',              // down arrow (move caret)
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
                presenter.display = $.extend(defaultDisplay, customDisplay);

                if (MobileUtils.isMobileUserAgent(navigator.userAgent) && presenter.configuration.lockInput) {
                    $('input').addClass('ui-keyboard-lockedinput');
                    $('input').attr("readonly", true);
                }

                presenter.removeEventListeners();
                const allButtons  = $(":button");
                allButtons.off('click');
                presenter.connectHandlers();
            }
            for (var i = 0; i < presenter.functionsQueue.length; i++) {
                presenter.functionsQueue[i]();
            }
            presenter.isLoaded = true;
        });
    }

    /**
     * Adds handlers to all input elements with which eKeyboard works
     */

    presenter.connectHandlers = function AddoneKeyboard_connectHandlers() {
        $('.eKeyboard-close-button > span').click(presenter.hideKeyboard);
        presenter.configuration.$inputs.each(
            function (index, element) {
                if (DevicesUtils.isInternetExplorer()) {
                    element.addEventListener('mousedown', presenter.focusOnMouseDown);
                }

                element.addEventListener('focus', presenter.openEKeyboardOnFocus);
                element.addEventListener('forceClick', presenter.openEKeyboardOnForceClick);
                element.addEventListener('keyup', presenter.onESCHideKeyboard);
                element.addEventListener('input', (e) => {
                    console.log(e.srcElement.value);
                })



                if (presenter.configuration.maxCharacters !== false) {
                    element.addEventListener('change', presenter.moveToNextGap);
                    element.addEventListener('paste', presenter.moveToNextGap);
                    element.addEventListener('keyup', presenter.moveToNextGap);
                }

                //This is after setState because validateModel is in promise.
                if (!keyboardIsVisible) {
                    element.addEventListener('focusout', focusoutCallBack);
                }
            });
            

    };

    presenter.focusOnMouseDown = function AddoneKeyboard_focusOnMouseDown () {
        $(this).focus();
    };

    var lastFocused;
    var mySuperField;
    presenter.openEKeyboardOnFocus = function AddoneKeyboard_openEKeyboardOnFocus (event) {
        var input = event.path[0];
        input.style.zIndex = -1;
        var inputClass = input.classList[1];
        var mathNumber = inputClass.split('inputNumber')[1];
        var pId = 'writing'+mathNumber;
        $('#'+pId+'').css('z-index', '-1');
        lastClickedElement = this;
        if (!keyboardIsVisible) {
            if ($(this).data('keyboard') !== undefined) {
                $(this).data('keyboard').destroy();
            }
            showOpenButton();
        } else {
            if (MobileUtils.isMobileUserAgent(navigator.userAgent) && presenter.configuration.lockInput) {
                // hides native keyboard
                document.activeElement.blur();
            }
            presenter.createEKeyboard(this, presenter.display);
            $(this).trigger('showKeyboard');
        }
        var inputPosition = input.getBoundingClientRect();
        $('.ui-keyboard.ui-widget-content.ui-widget.ui-corner-all.ui-helper-clearfix.ui-keyboard-has-focus.ui-draggable').css({'left': inputPosition.x, 'top': (inputPosition.y+50)});
        var navigationPanelInNormalClass  = $('div.ui-keyboard-keyset.ui-keyboard-keyset-normal > button.ui-keyboard-button.ui-keyboard-default.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-normal > button.ui-keyboard-button.ui-keyboard-meta.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-normal > button.ui-keyboard-button.ui-keyboard-meta2.ui-keyboard-widekey.ui-keyboard-actionkey.ui-state-default.ui-corner-all.ui-keyboard-hasactivestate');
        var navigationPanelInMetaClass  = $('div.ui-keyboard-keyset.ui-keyboard-keyset-meta > button.ui-keyboard-button.ui-keyboard-default.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-meta > button.ui-keyboard-button.ui-keyboard-meta.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-meta > button.ui-keyboard-button.ui-keyboard-meta2.ui-keyboard-widekey.ui-keyboard-actionkey.ui-state-default.ui-corner-all.ui-keyboard-hasactivestate');
        var navigationPanelInMeta2Class  = $('div.ui-keyboard-keyset.ui-keyboard-keyset-meta2 > button.ui-keyboard-button.ui-keyboard-default.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-meta2 > button.ui-keyboard-button.ui-keyboard-meta.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-meta2 > button.ui-keyboard-button.ui-keyboard-meta2.ui-keyboard-widekey.ui-keyboard-actionkey.ui-state-default.ui-corner-all.ui-keyboard-hasactivestate');
        var navigationPanelInMeta3Class  = $('div.ui-keyboard-keyset.ui-keyboard-keyset-meta3 > button.ui-keyboard-button.ui-keyboard-default.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-meta3 > button.ui-keyboard-button.ui-keyboard-meta.ui-keyboard-widekey.ui-state-default.ui-corner-all,div.ui-keyboard-keyset.ui-keyboard-keyset-meta3 > button.ui-keyboard-button.ui-keyboard-shift.ui-keyboard-widekey.ui-keyboard-actionkey.ui-state-default.ui-corner-all.ui-keyboard-hasactivestate');

        navigationPanelInNormalClass.wrapAll( "<div class='navigationPanel' />");
        navigationPanelInMetaClass.wrapAll( "<div class='navigationPanel' />");
        navigationPanelInMeta2Class.wrapAll( "<div class='navigationPanel' />");
        navigationPanelInMeta3Class.wrapAll( "<div class='navigationPanel' />");

        var numbersPanel  = $('div.ui-keyboard-keyset-normal > button.ui-keyboard-7, div.ui-keyboard-keyset-normal > button.ui-keyboard-8, div.ui-keyboard-keyset-normal > button.ui-keyboard-9, div.ui-keyboard-keyset-normal > button.ui-keyboard-4, div.ui-keyboard-keyset-normal > button.ui-keyboard-5, div.ui-keyboard-keyset-normal > button.ui-keyboard-6, div.ui-keyboard-keyset-normal > button.ui-keyboard-1, div.ui-keyboard-keyset-normal > button.ui-keyboard-2, div.ui-keyboard-keyset-normal > button.ui-keyboard-3, div.ui-keyboard-keyset-normal > button.ui-keyboard-0, div.ui-keyboard-keyset-normal > button.ui-keyboard-44, div.ui-keyboard-keyset-normal > button.ui-keyboard-9176');
        numbersPanel.wrapAll( "<div class='numbersPanel' />");
        
        var mathOperatorsPanel  = $('div.ui-keyboard-keyset-normal > button.ui-keyboard-43, div.ui-keyboard-keyset-normal > button[data-value="-"], div.ui-keyboard-keyset-normal > button.ui-keyboard-8901, div.ui-keyboard-keyset-normal > button.ui-keyboard-215, div.ui-keyboard-keyset-normal > button.ui-keyboard-247, div.ui-keyboard-keyset-normal > button[data-value=":"], div.ui-keyboard-keyset-normal > button.ui-keyboard-61, div.ui-keyboard-keyset-normal > button.ui-keyboard-43-47');
        mathOperatorsPanel.wrapAll( "<div class='mathOperatorsPanel' />");

        var mathExpressionsPanel  = $('div.ui-keyboard-keyset-normal > button.ui-keyboard-2013, div.ui-keyboard-keyset-normal > button.ui-keyboard-8735, div.ui-keyboard-keyset-normal > button.ui-keyboard-11579, div.ui-keyboard-keyset-normal > button.ui-keyboard-R, div.ui-keyboard-keyset-normal > button.ui-keyboard-37, div.ui-keyboard-keyset-normal > button.ui-keyboard-124-9725-124');
        mathExpressionsPanel.wrapAll( "<div class='mathExpressionsPanel' />");

        var comparisonsPanel  = $('div.ui-keyboard-keyset-normal > button.ui-keyboard-60, div.ui-keyboard-keyset-normal > button.ui-keyboard-62, div.ui-keyboard-keyset-normal > button.ui-keyboard-8804, div.ui-keyboard-keyset-normal > button.ui-keyboard-8805, div.ui-keyboard-keyset-normal > button.ui-keyboard-8776, div.ui-keyboard-keyset-normal > button.ui-keyboard-8800, div.ui-keyboard-keyset-normal > button.ui-keyboard-8801, div.ui-keyboard-keyset-normal > button.ui-keyboard-126');
        comparisonsPanel.wrapAll( "<div class='comparisonsPanel' />");

        var bracketsPanel  = $('div.ui-keyboard-keyset-normal > button[data-value="("], div.ui-keyboard-keyset-normal > button.ui-keyboard-41, div.ui-keyboard-keyset-normal > button.ui-keyboard-91, div.ui-keyboard-keyset-normal > button.ui-keyboard-93, div.ui-keyboard-keyset-normal > button.ui-keyboard-8451, div.ui-keyboard-keyset-normal > button.ui-keyboard-8457, div.ui-keyboard-keyset-normal > button.ui-keyboard-8364, div.ui-keyboard-keyset-normal > button.ui-keyboard-162');
        bracketsPanel.wrapAll( "<div class='bracketsPanel' />");

        var signsPanel  = $('div.ui-keyboard-keyset-normal > button.ui-keyboard-9650, div.ui-keyboard-keyset-normal > button.ui-keyboard-63, div.ui-keyboard-keyset-normal > button.ui-keyboard-9632, div.ui-keyboard-keyset-normal > button.ui-keyboard-2590, div.ui-keyboard-keyset-normal > button.ui-keyboard-11054, div.ui-keyboard-keyset-normal > button.ui-keyboard-9670, div.ui-keyboard-keyset-normal > button[data-value="_"]');
        signsPanel.wrapAll( "<div class='signsPanel' />");

        var controlPanelInNormalClass  = $('div.ui-keyboard-keyset-normal > button.ui-keyboard-bksp, div.ui-keyboard-keyset-normal > button.ui-keyboard-del, div.ui-keyboard-keyset-normal > button.ui-keyboard-8593, div.ui-keyboard-keyset-normal > button.ui-keyboard-8592, div.ui-keyboard-keyset-normal > button.ui-keyboard-8595, div.ui-keyboard-keyset-normal > button.ui-keyboard-8594');
        controlPanelInNormalClass.wrapAll( "<div class='controlPanelInNormalClass' />");

        var controlPanelInNormalClassBottomArrays  = $('div.ui-keyboard-keyset-normal > div.controlPanelInNormalClass > button.ui-keyboard-8592, div.ui-keyboard-keyset-normal > div.controlPanelInNormalClass > button.ui-keyboard-8595, div.ui-keyboard-keyset-normal > div.controlPanelInNormalClass > button.ui-keyboard-8594');
        controlPanelInNormalClassBottomArrays.wrapAll( "<div class='bottomArrays' />");

        var controlPanelInMetaClass  = $('div.ui-keyboard-keyset-meta > button.ui-keyboard-bksp, div.ui-keyboard-keyset-meta > button.ui-keyboard-del, div.ui-keyboard-keyset-meta > button.ui-keyboard-8593, div.ui-keyboard-keyset-meta > button.ui-keyboard-8592, div.ui-keyboard-keyset-meta > button.ui-keyboard-8595, div.ui-keyboard-keyset-meta > button.ui-keyboard-8594');
        controlPanelInMetaClass.wrapAll( "<div class='controlPanelInMetaClass' />");

        var controlPanelInMetaClassBottomArrays  = $('div.ui-keyboard-keyset-meta > div.controlPanelInMetaClass > button.ui-keyboard-8592, div.ui-keyboard-keyset-meta > div.controlPanelInMetaClass > button.ui-keyboard-8595, div.ui-keyboard-keyset-meta > div.controlPanelInMetaClass > button.ui-keyboard-8594');
        controlPanelInMetaClassBottomArrays.wrapAll( "<div class='bottomArrays' />");

        var controlPanelInMeta2Class  = $('div.ui-keyboard-keyset-meta2 > button.ui-keyboard-bksp, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-del, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-8593, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-8592, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-8595, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-8594');
        controlPanelInMeta2Class.wrapAll( "<div class='controlPanelInMeta2Class' />");

        var controlPanelInMeta2ClassBottomArrays  = $('div.ui-keyboard-keyset-meta2 > div.controlPanelInMeta2Class > button.ui-keyboard-8592, div.ui-keyboard-keyset-meta2 > div.controlPanelInMeta2Class > button.ui-keyboard-8595, div.ui-keyboard-keyset-meta2 > div.controlPanelInMeta2Class > button.ui-keyboard-8594');
        controlPanelInMeta2ClassBottomArrays.wrapAll( "<div class='bottomArrays' />");

        var controlPanelInMeta3Class  = $('div.ui-keyboard-keyset-meta3 > button.ui-keyboard-bksp, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-del, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-8593, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-8592, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-8595, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-8594');
        controlPanelInMeta3Class.wrapAll( "<div class='controlPanelInMeta3Class' />");

        var controlPanelInMeta3ClassBottomArrays  = $('div.ui-keyboard-keyset-meta3 > div.controlPanelInMeta3Class > button.ui-keyboard-8592, div.ui-keyboard-keyset-meta3 > div.controlPanelInMeta3Class > button.ui-keyboard-8595, div.ui-keyboard-keyset-meta3 > div.controlPanelInMeta3Class > button.ui-keyboard-8594');
        controlPanelInMeta3ClassBottomArrays.wrapAll( "<div class='bottomArrays' />");

        var signsInGeometryPanel  = $('div.ui-keyboard-keyset-meta > button.ui-keyboard-94, div.ui-keyboard-keyset-meta > button.ui-keyboard-9651, div.ui-keyboard-keyset-meta > button.ui-keyboard-960, div.ui-keyboard-keyset-meta > button.ui-keyboard-124-124, div.ui-keyboard-keyset-meta > button.ui-keyboard-8869, div.ui-keyboard-keyset-meta > button.ui-keyboard-176, div.ui-keyboard-keyset-meta > button[data-value="-"], div.ui-keyboard-keyset-meta > button.ui-keyboard-10230, div.ui-keyboard-keyset-meta > button.ui-keyboard-10231');
        signsInGeometryPanel.wrapAll( "<div class='signsInGeometryPanel' />");

        var alphabeticSmallLettersPanel  = $('div.ui-keyboard-keyset-meta2 > button.ui-keyboard-a, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-b, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-c, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-d, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-e, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-f, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-g, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-h, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-i, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-j, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-k, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-l, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-m, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-n, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-o, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-p, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-q, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-r, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-s, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-t, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-u, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-v, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-w, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-x, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-y, div.ui-keyboard-keyset-meta2 > button.ui-keyboard-z, div.ui-keyboard-keyset-meta2 > button[data-value="caps"]');
        alphabeticSmallLettersPanel.wrapAll( "<div class='alphabeticSmallLettersPanel' />");

        var alphabeticBigLettersPanel  = $('div.ui-keyboard-keyset-meta3 > button.ui-keyboard-A, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-B, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-C, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-D, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-E, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-F, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-G, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-H, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-I, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-J, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-K, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-L, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-M, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-N, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-O, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-P, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-Q, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-R, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-S, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-T, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-U, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-V, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-W, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-X, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-Y, div.ui-keyboard-keyset-meta3 > button.ui-keyboard-Z, div.ui-keyboard-keyset-meta3 > button[data-value="small"]');
        alphabeticBigLettersPanel.wrapAll( "<div class='alphabeticBigLettersPanel' />");

        const allButtons  = $(":button");
        if(lastFocused !== undefined && mySuperField === mathNumber){lastFocused.focus()};
        allButtons.on('click', function(){
            var script = document.createElement("script");
            script.text = methodDispatcher($(this).attr('data-html'), $(this).text());
            console.log(script.text);
            $("body").append(script);
            event.preventDefault();
            event.stopPropagation();
            lastFocused = document.activeElement;
        });
        $(lastFocused).focusout(function(){allButtons.off('click');$(lastFocused).off('focusout')});
        $(window).focusout(function(){allButtons.off('click');$(window).off('focusout')});
        mySuperField = mathNumber;
        function methodDispatcher(atr, text){
            var splitAtrr = atr.split('<span class="ui-keyboard-text">');
            var splitText = splitAtrr[1].split('</span>');
            var value = splitText[0];

            switch (value){
                case 'space':
                    return "window.mySuperField"+mathNumber+".$insert('{ }', {'focus' : true});";
                case '⋅':
                case '&#215;':
                    return "window.mySuperField"+mathNumber+".$insert('{*}', {'focus' : true});";         
                case '+/-':
                    return "window.mySuperField"+mathNumber+".$insert('{-}', {'focus' : true});"; 
                case '^':
                    return "window.mySuperField"+mathNumber+".$insert('\\\\^', {'focus' : true});";
                case '%':
                    return "window.mySuperField"+mathNumber+".$insert('\\\\%', {'focus' : true});";
                case '-':
                    return "window.mySuperField"+mathNumber+".$insert('{\\\\bar{\\\\placeholder{}}}', {'focus' : true});"
                case '&#10230;':
                case '&#10231;':
                    return "window.mySuperField"+mathNumber+".$insert('{\\\\vec{\\\\placeholder{}}}', {'focus' : true});"    
                case '&#2013;':
                    return "window.mySuperField"+mathNumber+".$insert('^{\\\\placeholder{}}', {'focus' : true});";
                case '&#11579;':
                    return "window.mySuperField"+mathNumber+".$insert('\\\\frac{\\\\placeholder{}}{\\\\placeholder{denominator}}', {'focus' : true});";
                case '|&#9725;|':
                    return "window.mySuperField"+mathNumber+".$insert('{\\\\lvert \\\\placeholder{} \\\\rvert }', {'focus' : true});";   
                case '&#9176;':
                    return "window.mySuperField"+mathNumber+".$insert('{ }', {'focus' : true});";   
                case 'Basic':
                case 'Geometry':
                case 'abc':
                case 'ABC':
                    return '';
                case '&#8676;':
                    return "window.mySuperField"+mathNumber+".$perform('deletePreviousChar');";                                    
                case 'del':
                    return "window.mySuperField"+mathNumber+".$perform('deleteNextChar');";  
                case '&#8593;':
                    return "window.mySuperField"+mathNumber+".$perform('moveUp');";    
                case '&#8592;':
                    return "window.mySuperField"+mathNumber+".$perform('moveToPreviousChar');";                                            
                case '&#8595;':
                    return "window.mySuperField"+mathNumber+".$perform('moveDown');";       
                case '&#8594;':
                    return "window.mySuperField"+mathNumber+".$perform('moveToNextChar');";           
                default:
                    return "window.mySuperField"+mathNumber+".$insert('"+text+"', {'focus' : true});";   
            }
        }
    };

    

    presenter.openEKeyboardOnForceClick = function AddoneKeyboard_openEKeyboardOnForceClick() {
        if (presenter.configuration.openOnFocus) {
            $(this).data('keyboard').reveal();
            if ($(".ic_popup_page").length == 0) {
                $(this).data('keyboard').startup();
            }
        } else {
            $(this).focus();
        }
    };

    presenter.onESCHideKeyboard = function AddoneKeyboard_onESCHideKeyboard(e) {
        if (e.keyCode === 27) {
            onEscClick(this);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };

    presenter.moveToNextGap = function AddoneKeyboard_moveToNextGap() {
        if ($(this).val().length >= presenter.configuration.maxCharacters) {
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
    };

    presenter.clickedOutsideCallback = function AddoneKeyboard_clickedOutsideCallback(event) {
        // shouldn't hide keyboard when current input was clicked
        if (event.target === lastClickedElement) return;
        lastClickedElement.value = "";
        lastClickedElement.style.zIndex = 1;
        var fieldContainerHeight = $('.ML__fieldcontainer').css('height');
        lastClickedElement.style.height = (fieldContainerHeight.split('px')[0]-8+'px');
        var lastClickedElementClassList = lastClickedElement.classList;
        var number = lastClickedElementClassList[1].split('inputNumber')[1];
        var mathfieldId = 'mathfieldDiv'+number;
        var mathfield = $('#'+mathfieldId);
        var field = mathfield.find('span.ML__fieldcontainer__field');
        var span = field.find('span.ML__mathrm');
        console.log(span.attr('class'));
        if(span.attr('class') == undefined){
            var pId = 'writing'+number;
            $('#'+pId+'').css('z-index', '1');
        };
        var wrapper = $(presenter.keyboardWrapper);

        // if click outside of wrapper or it's descendant, hide keyboard
        if (!wrapper.is(event.target) && wrapper.has(event.target).length === 0) {
            presenter.hideKeyboard();
        }
    };

    presenter.hideKeyboard = function () {
        document.removeEventListener('mousedown', presenter.clickedOutsideCallback);

        $(closeButtonElement).hide();
        $(lastClickedElement).removeAttr("readonly");
        var keyboard = $(lastClickedElement).data('keyboard');
        if (keyboard !== undefined) {
            keyboard.accept();
        }
    };

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
                    initialFocus: presenter.configuration.lockInput,

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
                    lockInput: presenter.configuration.lockInput,

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

            appendTo: presenter.keyboardWrapper,

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

                        keyboard['$keyboard'].draggable({
                            drag: function () {
                                $(closeButtonElement).position({
                                    my:        "left top",
                                    at:        "right top",
                                    of:         keyboard['$keyboard'],
                                    collision: 'fit'
                                });
                            },
                            stop: function () {
                                $.ui.ddmanager.current = null;
                            }
                        });
                        var $keyboard = keyboard['$keyboard'];
                        var position = $keyboard.position();
                        $keyboard.css({'left': element.getBoundingClientRect().x, 'top': (element.getBoundingClientRect().y+50)})
                        var widthMargin = ($keyboard.outerWidth(true) -  $keyboard.innerWidth()) / 2;
                        var width = $keyboard.outerWidth() + widthMargin;
                        var heightMargin = ($keyboard.outerHeight(true) -  $keyboard.innerHeight()) / 2;
                        
                        showCloseButton();
                        var closeButton = $('.eKeyboard-close-button');
                        closeButton.css({'left': (element.getBoundingClientRect().x+752), 'top': (element.getBoundingClientRect().y+80)})

                        document.addEventListener('mousedown', presenter.clickedOutsideCallback);
                    },
                    change: function (e, keyboard, el) {
                        var api = $(lastClickedElement).data('keyboard');

                        //Fixing the issue where if a key contains word 'meta' it will be treated as a meta key
                        if (api.last.key && api.last.key.indexOf('meta') != -1
                            && presenter.configuration.customLayout[api.last.key] == null) {
                            keyboard.insertText(api.last.key);
                        }

                        var event = new Event('change');
                        el.dispatchEvent(event);

                    },
                    beforeClose: function(e, keyboard, el, accepted) {
                        document.removeEventListener('mousedown', presenter.clickedOutsideCallback);
                        $(closeButtonElement).hide();
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

        document.removeEventListener('mousedown', presenter.clickedOutsideCallback);
        $(closeButtonElement).hide();
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

        document.activeElement.blur();

        $(lastClickedElement).click();
        $(lastClickedElement).focus();
        $(lastClickedElement).trigger('showKeyboard');
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

        presenter.configuration.$inputs.each(function (index, element) {
            try {
                $(element).data('keyboard').destroy();
            } catch(err){}
        });

        document.removeEventListener('mousedown', presenter.clickedOutsideCallback);

        presenter.configuration.$inputs.on('focusout', focusoutCallBack);
        presenter.configuration.$inputs.removeClass('ui-keyboard-input ui-keyboard-input-current');
        presenter.configuration.$inputs.removeAttr("readonly");
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
        if (presenter.isPreview || !presenter.configuration) {
            return;
        }

        presenter.configuration.$inputs.off('focusout', focusoutCallBack);

        presenter.configuration.$inputs.each(function (index, element){
            try {
                $(element).data('keyboard').destroy();
                $(element).off('focusout change paste keyup forceClick focus mousedown');
            } catch(err){}
        });

        document.removeEventListener('mousedown', presenter.clickedOutsideCallback);
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        $(presenter.keyboardWrapper).remove();
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
    var spans = $('.ic_page').find('.ML__base');
        var valueToMathfieldId = new Map();
        var numberIterator = 1;
        var numberIteratorForFraction = -1;
        var numberIteratorForPower = 1000;
        var numberIteratorForPi = -1000;
        var numberIteratorForVectors = -2000;
        spans.each(function(){
            var mathfield = $(this).closest('.mathfieldDiv');
            var mathfieldText = $(this).text();
            var textSpan = $(this).children().first();

            var children = textSpan.children('.ML__mathrm');
            children.each(function(){
                valueToMathfieldId.set(numberIterator+'_'+mathfield.attr('id'), $(this).text());
                numberIterator++;
            });

            var childrenWithPiValue = textSpan.children('.ML__mathit')
            childrenWithPiValue.each(function(){
                valueToMathfieldId.set(numberIterator+'_'+mathfield.attr('id'), $(this).text());
                numberIteratorForPi--;
            });

            var vectors = $(this).find('span.vlist:has(span.math)');
            vectors.each(function(){
                valueToMathfieldId.set(numberIterator+'_'+mathfield.attr('id'), $(this).text()+'_vec');
                numberIteratorForVectors--;
            });

            var frac = $(this).find('span.vlist.mfrac');
            frac.each(function(){
                if(frac.text() != ""){
                    var numerator = frac.children()[0];
                    numerator.textContent;
                    var denominator = frac.children()[2];
                    denominator.textContent;
                    var fractionValue =numerator.textContent+'n'+denominator.textContent+'d';
                    valueToMathfieldId.set(numberIteratorForFraction+'_'+mathfield.attr('id'), fractionValue);
                    numberIteratorForFraction--;
                    }
            })

            var powers = $(this).find('span.msubsup');
            powers.each(function(){
                if(powers.text() != ""){
                    var power = powers.text()+'_p';
                    console.log(power);
                    valueToMathfieldId.set(numberIteratorForPower+'_'+mathfield.attr('id'), power);
                    numberIteratorForPower++;
                    }
            })
        });
        return JSON.stringify({
            value: Object.fromEntries(valueToMathfieldId),
        })
    };

    presenter.setState = function (state) {
        var state2 = JSON.parse(state);
        inputValue = state2.value;
    };

    

    return presenter;
}