/*
 KNOWN ISSUES
    Text parsing:
        Do not change the space special character (&nbsp;) support due to backward compatibility #6613
        Do not add html escape support due to backward compatibility #6902
*/

function AddonText_Coloring_create() {
    var presenter = function () {};
    presenter.printableState = null;

    function markAsValidValues(value) {
        value.isValid = true;
        return value;
    }

    function filterInvalid(definition) {
        return !definition.isValid;
    }

    function removeIsValidFlag(colorDefinition) {
        delete colorDefinition.isValid;
        return colorDefinition;
    }

    function filterSelectablesTokens(token) {
        return token.type == presenter.TOKENS_TYPES.SELECTABLE;
    }

    function filterSelectedTokens(token) {
        return token.isSelected;
    }

    function filterWrongTokens(token) {
        if (token.color == undefined) {
            return true;
        }

        return token.selectionColorID != token.color;
    }

    function flattenArrays(result, array) {
        array.forEach(function (element) {
            if (element)
                result.push(element);
        });

        return result;
    }

    presenter.MODE = {
        'Mark phrases to select': 'MARK_PHRASES',
        'All selectable': 'ALL_SELECTABLE',
        DEFAULT: 'All selectable'
    };

    function parseIDs(colorDefinition) {
        var trimmedColorID = colorDefinition.id.trim();
        if (ModelValidationUtils.isStringEmpty(trimmedColorID)) {
            colorDefinition.isValid = false;
            colorDefinition.errorCode = presenter.ERROR_CODES_KEYS.TC_COLORS_COLOR_MUST_HAVE_ID;
            return colorDefinition;
        }

        colorDefinition.id = trimmedColorID;

        return colorDefinition;
    }

    function parseRGBHex(colorDefinition) {
        var parsedColor = ModelValidationUtils.validateColor(colorDefinition.color.trim());

        colorDefinition.color = parsedColor.color;

        if (!parsedColor.isValid) {
            colorDefinition.errorCode = presenter.ERROR_CODES_KEYS.TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX;
            colorDefinition.isValid = false;
        }

        return colorDefinition;
    }

    function parseDescriptions(colorDefinition) {
        colorDefinition.description = colorDefinition.description.trim();

        return colorDefinition;
    }

    function getWordToken(value) {
        return {
            "value": value,
            "type": presenter.TOKENS_TYPES.WORD
        };
    }

    function getNewLineToken() {
        return {
            "type": presenter.TOKENS_TYPES.NEW_LINE
        };
    }

    function getSelectableToken(value, colorID) {
        return {
            "type": presenter.TOKENS_TYPES.SELECTABLE,
            "value": value,
            "color": colorID
        };
    }

    function getSpaceToken() {
        return {
            type: presenter.TOKENS_TYPES.SPACE
        };
    }

    function deleteActiveClass() {
        var $buttons = presenter.$view.find(StringUtils.format(".{0}", presenter.defaults.css.activeButton));
        $buttons.removeClass(presenter.defaults.css.activeButton);
    }

    function TextColoringStateMachine(cssConfiguration) {
        StatefullAddonObject.call(this, cssConfiguration);
        this.blocked = false;
        this.currentShowingAnswerId = 0;
        this.notifyEdit();
        this.previousActiveColorID = null;
        this.previousActiveColor = null;
        this.previousEraserMode = null;
    }

    TextColoringStateMachine.prototype = Object.create(StatefullAddonObject.prototype);
    TextColoringStateMachine.constructor = TextColoringStateMachine;

    TextColoringStateMachine.prototype.onBlock = function () {
        presenter.disconnectHandlers();
        this.blocked = true;
    };

    TextColoringStateMachine.prototype.onUnblock = function () {
        presenter.connectHandlers();
        if (presenter.configuration.activeColorID != null || presenter.configuration.eraserMode != null) {
            presenter.connectWordTokensHandlers();
        }
        this.blocked = false;
    };

    TextColoringStateMachine.prototype.onShowAnswers = function () {
        this.onBlockAnswers();
        presenter.configuration.filteredTokens.filter(filterSelectablesTokens).forEach(function (token) {
            var colorDefinition = presenter.getColorDefinitionById(token.color);
            if (colorDefinition !== undefined) {
                var $tokenElement = presenter.getWordTokenByIndex(token.index);
                presenter.addShowAnswerClass($tokenElement, colorDefinition.id);
                presenter.markToken($tokenElement, colorDefinition.color);
            }
        });
    };

    TextColoringStateMachine.prototype.onShowSingleAnswer = function () {
        if (!presenter.configuration.showAllAnswersInGradualShowAnswersMode) {
            var currentShowingAnswerId = this.currentShowingAnswerId;
            var id = 0;

            if (!this.blocked) {
                this.savePreviousState();
                this.onBlock();
            }

            try {
                presenter.configuration.filteredTokens.filter(filterSelectablesTokens).forEach(function (token) {
                    var colorDefinition = presenter.getColorDefinitionById(token.color);
                    if (colorDefinition !== undefined) {
                        if (id === currentShowingAnswerId) {
                            var $tokenElement = presenter.getWordTokenByIndex(token.index);
                            presenter.addShowAnswerClass($tokenElement, colorDefinition.id);
                            presenter.markToken($tokenElement, colorDefinition.color);
                            throw BreakException;
                        }
                        id++;
                    }
                });
            } catch (e) {}

            this.currentShowingAnswerId++;
        } else {
            this.onShowAnswers();
        }
    };

    TextColoringStateMachine.prototype.onBlockAnswers = function () {
        if (!this.blocked) {
            this.savePreviousState();
            this.onBlock();
            presenter.unmarkToken(presenter.$wordTokens);
            presenter.hideTokenClasses(presenter.$wordTokens);
        }
    };

    presenter.addShowAnswerClass = function ($element, colorName) {
        var className = StringUtils.format(presenter.defaults.css.showAnswer, colorName);
        $element.addClass(className);
    };

    presenter.removeShowAnswerClass = function ($element, colorName) {
        var className = StringUtils.format(presenter.defaults.css.showAnswer, colorName);
        $element.removeClass(className);
    };

    TextColoringStateMachine.prototype.onHideAnswers = function () {
        this.currentShowingAnswerId = 0;
        this.blocked = false;
        this.restorePreviousState();
        this.onUnblock();
        presenter.unmarkToken(presenter.$wordTokens);

        presenter.configuration.filteredTokens.filter(filterSelectablesTokens).forEach(function (token) {
            var $tokenElement = presenter.getWordTokenByIndex(token.index);
            presenter.removeShowAnswerClass($tokenElement, token.color);
        });

        presenter.configuration.filteredTokens.filter(function (token) {
            return token.isSelected == true;
        }).forEach(function (token) {
            var colorDefinition = presenter.getColorDefinitionById(token.selectionColorID);
            var $tokenElement = presenter.getWordTokenByIndex(token.index);
            presenter.markToken($tokenElement, colorDefinition.color);
        });


        if (this.previousActiveColor != null) {
            presenter.setColorButtonAsActive(this.previousActiveColorID);
        }

        if (this.previousEraserMode) {
            presenter.setEraserButtonAsActive();
        }

        presenter.showTokenClasses(presenter.$wordTokens);
    };

    TextColoringStateMachine.prototype.gradualShowAnswers = function () {
        switch (this._actualState) {
            case StatefullAddonObject._internal.STATE.WORK:
                this.onShowSingleAnswer();
                this.setCssOnShowAnswers();
                break;
            default:
                break;
        }
    };

    TextColoringStateMachine.prototype.gradualBlockAnswers = function () {
        switch (this._actualState) {
            case StatefullAddonObject._internal.STATE.WORK:
                this.onBlockAnswers();
                this.setCssOnShowAnswers();
                break;
            default:
                break;
        }
    };

    TextColoringStateMachine.prototype.gradualHideAnswers = function () {
        switch (this._actualState) {
            case StatefullAddonObject._internal.STATE.WORK:
                StatefullAddonObject._internal.hideAnswersShowAnswersState.call(this);
                break;
            default:
                break;
        }
    };

    TextColoringStateMachine.prototype.isCorrect = function () {
        return true;
    };

    TextColoringStateMachine.prototype.onCorrect = function () {
        this.savePreviousState();
        this.onBlock();
        presenter.configuration.filteredTokens.filter(filterSelectedTokens).forEach(function (token) {
            if (presenter.getScoreForWordMarking(token.index, token.selectionColorID)) {
                presenter.addCorrectClass(token.index);
            } else {
                presenter.addWrongClass(token.index);
            }
        });
    };

    TextColoringStateMachine.prototype.onUnCorrect = function () {
        this.restorePreviousState();
        this.onUnblock();
        presenter.removeAllCheckAnswersClasses();
    };

    TextColoringStateMachine.prototype.savePreviousState = function () {
        this.previousActiveColorID = presenter.configuration.activeColorID;
        this.previousActiveColor = presenter.configuration.activeColor;
        this.previousEraserMode = presenter.configuration.eraserMode;
    };

    TextColoringStateMachine.prototype.restorePreviousState = function () {
        presenter.configuration.activeColorID = this.previousActiveColorID;
        presenter.configuration.activeColor = this.previousActiveColor;
        presenter.configuration.eraserMode = this.previousEraserMode;
    };

    TextColoringStateMachine.prototype.setCssOnCorrect = function () {
        presenter.unsetColorButtonsAsActive();
        presenter.unsetEraserButtonAsActive();
    };

    TextColoringStateMachine.prototype.setCssOnUnCorrect = function () {
        if (this.previousActiveColor != null) {
            presenter.setColorButtonAsActive(this.previousActiveColorID);
        }

        if (this.previousEraserMode) {
            presenter.setEraserButtonAsActive();
        }
    };

    TextColoringStateMachine.prototype.addCssClass = function () {
    };

    TextColoringStateMachine.prototype.removeCssClass = function () {
    };

    TextColoringStateMachine.prototype.onReset = function () {
        presenter.unmarkToken(presenter.$wordTokens);

        presenter.resetColoredWords();

        $.makeArray(presenter.$wordTokens).forEach(function (tokenHTML) {
            presenter.removeColorData($(tokenHTML));
        });

        deleteActiveClass();
        if (presenter.configuration.eraserMode) {
            presenter.toggleEraserMode();
        }

        if (presenter.configuration.activeColorID !== null) {
            presenter.configuration.activeColorID = null;
            presenter.configuration.activeColor = null;
        }
        presenter.disconnectWordTokensHandlers();
        presenter.setColor(presenter.configuration.colors[0].id);
    };

    presenter.defaults = {
        eraserButtonDefaultText: "Eraser Mode",
        dataHolders: {
            colorID: "colorid"
        },
        css: {
            selectableWord: "text-coloring-selectable-word",
            colorButton: "text-coloring-color-button",
            pointer: "text-coloring-pointer-class",
            hover: "text-coloring-hover-class",
            eraserButton: "text-coloring-eraser-button",
            mainContainer: {
                top: 'text-coloring-main-container-top-position',
                left: 'text-coloring-main-container-left-position',
                bottom: 'text-coloring-main-container-bottom-position',
                right: 'text-coloring-main-container-right-position'
            },
            colorButtonsContainer: {
                top: 'text-coloring-colors-buttons-container-top-position',
                left: 'text-coloring-colors-buttons-container-left-position',
                bottom: 'text-coloring-colors-buttons-container-bottom-position',
                right: 'text-coloring-colors-buttons-container-right-position'
            },
            eraserButtonContainer: {
                top: 'text-coloring-eraser-button-container-top-position',
                left: 'text-coloring-eraser-button-container-left-position',
                bottom: 'text-coloring-eraser-button-container-bottom-position',
                right: 'text-coloring-eraser-button-container-right-position'
            },
            buttonsContainer: {
                top: 'text-coloring-buttons-container-top-position',
                left: 'text-coloring-buttons-container-left-position',
                bottom: 'text-coloring-buttons-container-bottom-position',
                right: 'text-coloring-buttons-container-right-position'
            },
            tokensContainer: {
                top: 'text-coloring-tokens-container-top-position',
                left: 'text-coloring-tokens-container-left-position',
                bottom: 'text-coloring-tokens-container-bottom-position',
                right: 'text-coloring-tokens-container-right-position'
            },
            markings: {
                correct: 'text-coloring-token-correct-marking',
                wrong: 'text-coloring-token-wrong-marking'
            },
            activeButton: 'text-coloring-active-button',
            coloredWord: 'text-coloring-colored-with-{0}',
            showAnswer: 'text-coloring-show-answers-{0}'
        }
    };

    presenter.ERROR_CODES = {
        "TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX": "Color definitions in colors property have to be proper rgb hex e.g #FF0000 (red)",
        "TC_COLORS_COLOR_MUST_HAVE_ID": "Color definitions in colors property must have id",
        "TC_TEXT_COLOR_DEFINITION_WRONG_ID": "Text Coloring has to use defined color id"
    };

    presenter.ERROR_CODES_KEYS = {
        "TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX": "TC_COLORS_COLOR_DEFINITION_HAVE_TO_BE_RGB_HEX",
        "TC_COLORS_COLOR_MUST_HAVE_ID": "TC_COLORS_COLOR_MUST_HAVE_ID",
        "TC_TEXT_COLOR_DEFINITION_WRONG_ID": "TC_TEXT_COLOR_DEFINITION_WRONG_ID"
    };

    presenter.TOKENS_TYPES = {
        WORD: "word",
        SELECTABLE: "selectable",
        NEW_LINE: "new_line",
        SPACE: "space"
    };

    presenter.POSITIONS = {
        LEFT: "left",
        RIGHT: "right",
        TOP: "top",
        BOTTOM: "bottom"
    };

    presenter.EVENT_TYPES = {
        SELECTING: 1,
        DESELECTING: 0
    };

    presenter.eventBus = null;
    presenter.view = null;
    presenter.stateMachine = null;
    presenter.$colorButtons = null;
    presenter.$eraserButton = null;
    presenter.$wordTokens = null;

    presenter.configuration = {
        ID: "id",
        isValid: true,
        isError: false,
        textTokens: [],
        filteredTokens: [],
        colors: [],
        buttonsPosition: "left",
        showAllAnswersInGradualShowAnswersMode: false,
        showSetEraserButtonMode: false,
        hideColorsButtons: false,
        activeColor: null,
        activeColorID: null,
        eraserMode: false,
        eraserButtonText: "Eraser Mode",
        isVisible: true
    };

    presenter.setPlayerController = function (controller) {
        presenter.eventBus = controller.getEventBus();
        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (var i = 0; i < events.length; i++) {
            presenter.eventBus.addEventListener(events[i], this);
        }
    };


    presenter.run = function (view, model) {
        presenter.runLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.runLogic(view, model, true);
    };

    presenter.destroy = function (event) {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.disconnectWordTokensHandlers();
        presenter.disconnectHandlers();
    };

    presenter.runLogic = function (view, model, isPreview) {
        model = presenter.upgradeModel(model);
        presenter.configuration = $.extend({}, presenter.configuration, presenter.validateModel(model));
        presenter.view = view;
        presenter.$view = $(view);
        if (presenter.configuration.isError) {
            ModelErrorUtils.showErrorMessage(presenter.view, presenter.ERROR_CODES[presenter.configuration.errorCode]);
            return;
        }

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(event) {
            if (event.target === this) {
                presenter.destroy();
            }
        });

        presenter.createStateMachine();
        presenter.setFilteredTokensData();
        presenter.setView(presenter.createView());

        if (!presenter.configuration.isVisible && !isPreview) {
            presenter.hide();
        }

        if (isPreview) {
            presenter.colorTokensInPreview();
        } else {
            presenter.connectHandlers();
            presenter.setColor(presenter.configuration.colors[0].id);
            presenter.stateMachine.notifyEdit();
        }
    };

    presenter.createStateMachine = function() {
        presenter.stateMachine = new TextColoringStateMachine({});
    };

    presenter.colorTokensInPreview = function () {
        presenter.configuration.filteredTokens.filter(filterSelectablesTokens).forEach(function (token) {
            var $token = presenter.getWordTokenByIndex(token.index);
            presenter.markToken($token, token.color);
        });
    };

    presenter.setFilteredTokensData = function () {
        presenter.configuration.filteredTokens = presenter.configuration.textTokens.filter(function (token) {
            return token.type == presenter.TOKENS_TYPES.WORD || token.type == presenter.TOKENS_TYPES.SELECTABLE;
        }).map(function (token, index) {
            token.isSelected = false;
            token.selectionColorID = null;
            token.index = index;
            return token;
        });
    };

    presenter.setView = function (view) {
        presenter.$view.html(StringUtils.format("<div class='text_coloring'>{0}</div>", view));
        presenter.$wordTokens = presenter.$view.find(StringUtils.format(".{0}", presenter.defaults.css.selectableWord));
        presenter.$colorButtons = presenter.$view.find(StringUtils.format(".{0}", presenter.defaults.css.colorButton));
        presenter.$eraserButton = presenter.$view.find(StringUtils.format(".{0}", presenter.defaults.css.eraserButton));

        if (!presenter.configuration.showSetEraserButtonMode) {
            presenter.hideEraserButtonMode();
        }

        if (presenter.configuration.hideColorsButtons) {
            presenter.hideColorsButtons();
        }
    };

    presenter.hideEraserButtonMode = function () {
        presenter.$eraserButton.parent().hide();
    };

    presenter.hideColorsButtons = function () {
        presenter.$colorButtons.parent().hide();
    };

    presenter.createView = function () {
        var buttonsContainerHTML;
        var textHTML;
        var css;

        var mainContainer = "<div class='{0}'>";

        switch (presenter.configuration.buttonsPosition) {
            case presenter.POSITIONS.LEFT:
                css = presenter.getContainerCssByPosition(presenter.configuration.buttonsPosition);
                buttonsContainerHTML = presenter.getButtonsContainerHTML(css);
                textHTML = presenter.getTextHTML(presenter.configuration.textTokens, css.tokensContainer, presenter.configuration.mode);
                mainContainer = StringUtils.format(mainContainer, css.mainContainer);
                mainContainer += buttonsContainerHTML + textHTML;
                break;
            case presenter.POSITIONS.RIGHT:
                css = presenter.getContainerCssByPosition(presenter.configuration.buttonsPosition);
                textHTML = presenter.getTextHTML(presenter.configuration.textTokens, css.tokensContainer, presenter.configuration.mode);
                buttonsContainerHTML = presenter.getButtonsContainerHTML(css);
                mainContainer = StringUtils.format(mainContainer, css.mainContainer);
                mainContainer += textHTML + buttonsContainerHTML;
                break;
            case presenter.POSITIONS.TOP:
                css = presenter.getContainerCssByPosition(presenter.configuration.buttonsPosition);
                textHTML = presenter.getTextHTML(presenter.configuration.textTokens, css.tokensContainer, presenter.configuration.mode);
                buttonsContainerHTML = presenter.getButtonsContainerHTML(css);
                mainContainer = StringUtils.format(mainContainer, css.mainContainer);
                mainContainer += buttonsContainerHTML + textHTML;
                break;
            case presenter.POSITIONS.BOTTOM:
                css = presenter.getContainerCssByPosition(presenter.configuration.buttonsPosition);
                textHTML = presenter.getTextHTML(presenter.configuration.textTokens, css.tokensContainer, presenter.configuration.mode);
                buttonsContainerHTML = presenter.getButtonsContainerHTML(css);
                mainContainer = StringUtils.format(mainContainer, css.mainContainer);
                mainContainer += textHTML + buttonsContainerHTML;
                break;
        }

        mainContainer += "</div>";
        return mainContainer;
    };

    presenter.getContainerCssByPosition = function (position) {
        var result = {
            eraserContainer: "",
            colorsContainer: "",
            mainContainer: "",
            buttonContainer: "",
            tokensContainer: ""
        };

        switch (position) {
            case presenter.POSITIONS.LEFT:
                result.eraserContainer = presenter.defaults.css.eraserButtonContainer.left;
                result.colorsContainer = presenter.defaults.css.colorButtonsContainer.left;
                result.mainContainer = presenter.defaults.css.mainContainer.left;
                result.buttonContainer = presenter.defaults.css.buttonsContainer.left;
                result.tokensContainer = presenter.defaults.css.tokensContainer.left;
                break;
            case presenter.POSITIONS.RIGHT:
                result.eraserContainer = presenter.defaults.css.eraserButtonContainer.right;
                result.colorsContainer = presenter.defaults.css.colorButtonsContainer.right;
                result.mainContainer = presenter.defaults.css.mainContainer.right;
                result.buttonContainer = presenter.defaults.css.buttonsContainer.right;
                result.tokensContainer = presenter.defaults.css.tokensContainer.right;
                break;
            case presenter.POSITIONS.TOP:
                result.eraserContainer = presenter.defaults.css.eraserButtonContainer.top;
                result.colorsContainer = presenter.defaults.css.colorButtonsContainer.top;
                result.mainContainer = presenter.defaults.css.mainContainer.top;
                result.buttonContainer = presenter.defaults.css.buttonsContainer.top;
                result.tokensContainer = presenter.defaults.css.tokensContainer.top;
                break;
            case presenter.POSITIONS.BOTTOM:
                result.eraserContainer = presenter.defaults.css.eraserButtonContainer.bottom;
                result.colorsContainer = presenter.defaults.css.colorButtonsContainer.bottom;
                result.mainContainer = presenter.defaults.css.mainContainer.bottom;
                result.buttonContainer = presenter.defaults.css.buttonsContainer.bottom;
                result.tokensContainer = presenter.defaults.css.tokensContainer.bottom;
                break
        }

        return result;
    };

    presenter.getButtonsContainerHTML = function (css) {
        var colorsButtons = presenter.getColorsButtonsHTML(presenter.configuration.colors, css.colorsContainer);
        var eraserButtons = presenter.getEraserModeButtonHTML(css.eraserContainer);
        return StringUtils.format("<div class='{0}'>{1} {2}</div>", css.buttonContainer, colorsButtons, eraserButtons);
    };

    presenter.getColorsButtonsHTML = function (colorsDefinitions, containerCssClass) {
        var result = StringUtils.format("<div class='{0}'>", containerCssClass);

        var colorsLen = colorsDefinitions.length;
        for (var i = 0; i < colorsLen; i++) {
            result = StringUtils.format("{0}{1}", result, presenter.getColorHTMLText(colorsDefinitions[i]));
        }

        result += "</div>";

        return result;
    };

    presenter.getEraserModeButtonHTML = function (containerCssClass) {
        var result = StringUtils.format("<div class='{0}'>", containerCssClass);
        result += StringUtils.format("<div class='{0}'>{1}</div>", presenter.defaults.css.eraserButton, presenter.configuration.eraserButtonText);
        result += "</div>";

        return result;
    };

    presenter.getColorHTMLText = function (colorDefinition) {
        return StringUtils.format("<div class='{0}' data-{1}='{2}'>{3}</div>", presenter.defaults.css.colorButton, presenter.defaults.dataHolders.colorID, colorDefinition.id, colorDefinition.description);
    };

    presenter.getTextHTML = function (tokens, containerCssClass, mode) {
        var tokensLen = tokens.length;
        var result = StringUtils.format("<div class='{0}'>", containerCssClass);

        for (var i = 0, wordIndex = 0; i < tokensLen; i++) {
            if (tokens[i].type == presenter.TOKENS_TYPES.NEW_LINE) {
                result = StringUtils.format("{0}{1}", result, presenter.getNewLineHTML());
            } else if (tokens[i].type == presenter.TOKENS_TYPES.SPACE) {
                result = StringUtils.format("{0}{1}", result, presenter.getSpaceHTML());
            } else if (tokens[i].type == presenter.TOKENS_TYPES.SELECTABLE) {
                result = StringUtils.format("{0}{1}", result, presenter.getWordHTML(tokens[i], wordIndex));
                wordIndex++;
            } else {
                if (mode == "ALL_SELECTABLE") {
                    result = StringUtils.format("{0}{1}", result, presenter.getWordHTML(tokens[i], wordIndex));
                } else {
                    result = StringUtils.format("{0}{1}", result, tokens[i].value);
                }
                wordIndex++;
            }
        }

        result += "</div>";
        return result;
    };

    presenter.getNewLineHTML = function () {
        return "<br>";
    };

    presenter.getSpaceHTML = function () {
        return "<span> </span>";
    };

    presenter.getWordHTML = function (token, index) {
        return StringUtils.format("<span class='{0}' data-word-index='{1}' >{2}</span>",
            presenter.defaults.css.selectableWord, index, token.value);
    };

    presenter.upgradeModel = function(model) {
        var upgradedModel = upgradeModelAddProperties(model);
        return upgradedModel;
    };

    function upgradeModelAddProperties(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if(!upgradedModel['Mode']){
            upgradedModel['Mode'] = presenter.MODE.DEFAULT;
        }
        if(!upgradedModel['countErrors']) {
            upgradedModel['countErrors'] = false;
        }
        if(!upgradedModel['showAllAnswersInGradualShowAnswersMode']) {
            upgradedModel['showAllAnswersInGradualShowAnswersMode'] = false;
        }
        if(!upgradedModel['Legend title']) {
            upgradedModel['Legend title'] = 'Legend';
        }

        return upgradedModel;
    };

    presenter.validateModel = function (model) {
        var validatedColors = presenter.validateColors(model.colors);
        if (validatedColors.isError) {
            return validatedColors;
        }

        var mode = ModelValidationUtils.validateOption(presenter.MODE, model.Mode);

        var parsedText = presenter.parseText(model.text, mode);
        var validatedText = presenter.validateUsingOnlyDefinedColors(parsedText, validatedColors.value);
        var modelText = model.text ? model.text.split(' ') : '';
        var height = model.Height ? model.Height / 2 : 0;
        var legendTitle = model['Legend title'] ?  model['Legend title'] : 'Legend';

        if (validatedText.isError) {
            return validatedText;
        }

        return {
            ID: model["ID"],
            isValid: true,
            isError: false,
            textTokens: parsedText,
            colors: validatedColors.value,
            buttonsPosition: presenter.parseButtonsPosition(model.buttonsPosition),
            showAllAnswersInGradualShowAnswersMode: ModelValidationUtils.validateBoolean(model.showAllAnswersInGradualShowAnswersMode),
            showSetEraserButtonMode: ModelValidationUtils.validateBoolean(model.showSetEraserModeButton),
            hideColorsButtons: ModelValidationUtils.validateBoolean(model.hideColorsButtons),
            eraserButtonText: presenter.parseEraserButtonText(model.eraserButtonText),
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            mode: mode,
            countErrors: ModelValidationUtils.validateBoolean(model.countErrors),
            modelText: modelText,
            height: height,
            legendTitle: legendTitle
        };
    };

    presenter.validateUsingOnlyDefinedColors = function (text, colors) {
        var tokenHaveInvalidColor = text.filter(filterSelectablesTokens).some(function (token) {
            var foundColorDefinition = colors.some(function (colorDefinition) {
                return token.color == colorDefinition.id;
            });

            return !foundColorDefinition;
        });

        if (tokenHaveInvalidColor) {
            return ModelErrorUtils.getErrorObject(presenter.ERROR_CODES_KEYS.TC_TEXT_COLOR_DEFINITION_WRONG_ID);
        }

        return {
            isValid: true,
            isError: false
        };
    };

    presenter.parseEraserButtonText = function (eraserButtonText) {
        if (ModelValidationUtils.isStringEmpty(eraserButtonText)) {
            return presenter.defaults.eraserButtonDefaultText;
        } else {
            return eraserButtonText.trim();
        }
    };

    presenter.parseButtonsPosition = function (buttonsPosition) {
        if (buttonsPosition === undefined) {
            return "top";
        }

        if (ModelValidationUtils.isStringEmpty(buttonsPosition.trim())) {
            return "top";
        }

        return buttonsPosition.trim();
    };

    presenter.validateColors = function (colorsDefinitions) {
        var parsedValues = colorsDefinitions.map(markAsValidValues).map(parseIDs).map(parseRGBHex).map(parseDescriptions);

        var errorDefinitions = parsedValues.filter(filterInvalid);
        if (errorDefinitions.length > 0) {
            return ModelErrorUtils.getErrorObject(errorDefinitions[0].errorCode);
        }

        return {
            isValid: true,
            value: parsedValues.map(removeIsValidFlag)
        };
    };

    presenter.parseText = function (text, mode) {
        if (ModelValidationUtils.isStringEmpty(text.trim())) {
            return [];
        }

        var groups = text.trim().split("\n").map(function (element) {
            return element.trim();
        });
        var groupsLen = groups.length;
        var result = [];
        var lastGroup = groups.length - 1;
        for (var groupNumber = 0; groupNumber < groupsLen; groupNumber++) {
            var wordGroup = groups[groupNumber];
            if (wordGroup.length == 0) {
                result.push(getNewLineToken());
                continue;
            }

            var parsedWords = presenter.splitGroupToWords(groups[groupNumber], mode)
                .map(presenter.parseWords)
                .reduce(flattenArrays, []);

            if (parsedWords[parsedWords.length - 1].type == presenter.TOKENS_TYPES.SPACE) {
                parsedWords = parsedWords.slice(0, -1);
            }

            if (groupNumber != lastGroup) {
                result = result.concat(parsedWords, getNewLineToken());
            } else {
                result = result.concat(parsedWords)
            }
        }

        return result;
    };

    presenter.splitGroupToWords = function (group, mode) {
        if (mode == "ALL_SELECTABLE") {
            return group.split(" ").map(function (element) {
                element.trim();
                return element;
            }).filter(function (element) {
                return element != "";
            });
        } else {
            var splitGroup = [];
            var space = / /.source;
            var color = /\\color{[^}]*?}{[^}]*?}[^\s]*/.source;

            var mainRex = new RegExp([color,space].join('|'));
             var match = mainRex.exec(group);
            while (match !== null) {
                var before = group.substring(0,match.index);
                group = group.substring(match.index + match[0].length);

                if (before.trim().length > 0) {
                    splitGroup.push(before.trim());
                }
                if (match[0].trim().length > 0) {
                    splitGroup.push(match[0].trim());
                }

                match = mainRex.exec(group);
            }
            if (group.trim().length > 0) {
                splitGroup.push(group.trim());
            }
            return splitGroup;
        }
    };

    presenter.parseWords = function (word) {
        var result = [];

        var selectablePart = {
            pattern: /\\color{[^}]+}{[^}]+}/g,

            getStartOfIndex: function () {
                return word.search(this.pattern);
            },

            getStopOfIndex: function () {
                return this.pattern.lastIndex;
            },

            getSelectablePhrase: function () {
                this.pattern.test(word);
                return word.substring(0, this.getStopOfIndex());
            },

            isExists: function () {
                return this.getStartOfIndex() != -1;
            },

            hasPrecedingWord: function () {
                return this.getStartOfIndex() > 0;
            },

            separatePrecedingWord: function () {
                var precedingWord = word.substring(0, this.getStartOfIndex());
                return precedingWord;
            }
        };

        while (selectablePart.isExists()) {
            if (selectablePart.hasPrecedingWord()) {
                var precedingWord = selectablePart.separatePrecedingWord();
                result.push(getWordToken(precedingWord));

                word = word.substring(selectablePart.getStartOfIndex(), word.length);
            }

            var selectablePhrase = selectablePart.getSelectablePhrase();
            if (selectablePhrase.length > 0) {
                var selectableWord = presenter.getSelectableWord(selectablePhrase);
                var selectableColor = presenter.getSelectableColor(selectablePhrase);
                result.push(getSelectableToken(selectableWord, selectableColor));
            }

            word = word.substring(selectablePart.getStopOfIndex(), word.length);
            selectablePart.pattern = /\\color{[^}]+}{[^}]+}/g;
        }

        if (word.length > 0)
            result.push(getWordToken(word));

        result.push(getSpaceToken());

        return result;
    };

    presenter.getSelectableColor = function (phrase) {
        var pattern = /{[^}]+}/g;

        pattern.test(phrase);

        var startOfIndex = "\\color{".length;
        var stopOfIndex = pattern.lastIndex - 1;

        var color = phrase.substring(startOfIndex, stopOfIndex);

        return color;
    };

    presenter.getSelectableWord = function (phrase) {
        var pattern = /{[^}]+}{/g;

        pattern.test(phrase);
        phrase = phrase.substring(pattern.lastIndex, phrase.length);

        var word = phrase.substring(0, phrase.length - 1);

        return word;
    };

    presenter.connectHandlers = function () {
        presenter.$colorButtons.hover(presenter.hoverInAddPointerHandler, presenter.hoverOutRemovePointerHandler);
        presenter.$colorButtons.click(presenter.selectColorButtonHandler);

        presenter.$eraserButton.hover(presenter.hoverInAddPointerHandler, presenter.hoverOutRemovePointerHandler);
        presenter.$eraserButton.click(presenter.activateEraserMode);
    };

    presenter.activateEraserMode = function (event) {
        deleteActiveClass();
        presenter.setEraserMode(event);
    };

    presenter.disconnectHandlers = function () {
        presenter.$colorButtons.off();
        presenter.$eraserButton.off();

        if (presenter.configuration.eraserMode) {
            presenter.disconnectWordTokensHandlers();
            presenter.toggleEraserMode();
        } else if (presenter.configuration.activeColorID !== null) {
            presenter.disconnectWordTokensHandlers();
            presenter.configuration.activeColor = null;
            presenter.configuration.activeColorID = null;
        }
    };

    presenter.connectWordTokensHandlers = function () {
        presenter.$wordTokens.hover(presenter.hoverInAddPointerHandler, presenter.hoverOutRemovePointerHandler);
        presenter.$wordTokens.hover(presenter.hoverInAddBackgroundHandler, presenter.hoverOutRemoveBackgroundHandler);
        presenter.$wordTokens.click(presenter.underlineWordHandler);
    };

    presenter.disconnectWordTokensHandlers = function () {
        presenter.$wordTokens.off();
    };

    presenter.eraserButtonClickHandler = function (event) {
        presenter.setEraserMode();
    };

    presenter.toggleEraserMode = function () {
        presenter.configuration.eraserMode = !presenter.configuration.eraserMode;
    };

    presenter.hoverInAddPointerHandler = function (event) {
        $(this).addClass(presenter.defaults.css.pointer);
    };

    presenter.hoverOutRemovePointerHandler = function (event) {
        $(this).removeClass(presenter.defaults.css.pointer);
    };

    presenter.hoverInAddBackgroundHandler = function (event) {
        $(this).addClass(presenter.defaults.css.hover);
    };

    presenter.hoverOutRemoveBackgroundHandler = function (event) {
        $(this).removeClass(presenter.defaults.css.hover);
    };

    presenter.resetColoredWords = function () {
        presenter.$view.find("[class*='text-coloring-colored-with']").each(function () {
            $(this).removeClass(function (index, css) {
                return (css.match(/\btext-coloring-colored-with\S+/g) || []).join(' ');
            });
        })
    };

    presenter.resetColoredWord = function (element) {
        $(element).removeClass(function (index, css) {
            return (css.match(/\btext-coloring-colored-with\S+/g) || []).join(' ');
        });
    };

    presenter.underlineWordHandler = function (event) {
        var $element = $(this);
        var wordIndex = $element.data("word-index");
        var tokenData = presenter.configuration.filteredTokens[wordIndex];
        if (presenter.configuration.eraserMode || (tokenData.selectionColorID == presenter.configuration.activeColorID)) {
            presenter.unmarkToken($element);
            presenter.removeColoredWordCss($element, presenter.configuration.filteredTokens[wordIndex]);
            presenter.removeColorData($element);
            presenter.sendErasingEvent(wordIndex);
        } else if (presenter.configuration.activeColor !== null && tokenData.selectionColorID !== presenter.configuration.activeColorID) {
            presenter.markToken($element, presenter.configuration.activeColor);
            presenter.addColorData($element);
            presenter.sendMarkingEvent(wordIndex);
            presenter.resetColoredWord($element);
            presenter.addColoredWordCss($element, presenter.configuration.filteredTokens[wordIndex]);
        }


        if (presenter.isAllOK()) {
            presenter.sendAllOKEvent();
        }

        presenter.stateMachine.notifyEdit();
    };

    presenter.addColoredWordCss = function ($element, colorData) {
        var colorID = colorData.selectionColorID;
        $element.addClass(StringUtils.format(presenter.defaults.css.coloredWord, colorID))
    };

    presenter.removeColoredWordCss = function ($element, colorData) {
        var colorID = colorData.selectionColorID;
        $element.removeClass(StringUtils.format(presenter.defaults.css.coloredWord, colorID))
    };

    presenter.unmarkToken = function ($element) {
        $element.css({
            "text-decoration": "none",
            "padding-bottom": "none",
            "border-bottom": "none"
        });
    };

    presenter.markToken = function ($element, color) {
        $element.css({
            "text-decoration": "none",
            "padding-bottom": "0.1em",
            "border-bottom": StringUtils.format("0.1em solid {0}", color)
        });
    };


    presenter.hideTokenClasses = function ($element) {
        if (!$element) return;
        $element.each(function(){
            var $this = $(this);
            var classNames = $this.attr('class').split(/\s+/);
            var disabledClasses = [];
            for (var i = 0; i < classNames.length; i++) {
                if (classNames[i] != presenter.defaults.css.selectableWord){
                    $this.removeClass(classNames[i]);
                    disabledClasses.push(classNames[i]);
                }
            }
            this.dataset.disabledClasses = disabledClasses.join(' ');
        });
    };

    presenter.showTokenClasses = function ($element) {
        if (!$element) return;
        $element.each(function(){
            var $this = $(this);
            var disabledClasses = this.dataset.disabledClasses;
            if (disabledClasses) {
                var classNames = disabledClasses.split(/\s+/);
                for (var i = 0; i < classNames.length; i++) {
                    $this.addClass(classNames[i]);
                }
                this.dataset.disabledClasses = '';
            }
        });
    };

    presenter.addColorData = function ($element) {
        presenter.setTokenData($element, true, presenter.configuration.activeColorID);
    };

    presenter.removeColorData = function ($element) {
        presenter.setTokenData($element, false, null);
    };

    presenter.setTokenData = function ($element, isSelected, colorID) {
        var tokenIndex = $element.data("word-index");
        presenter.configuration.filteredTokens[tokenIndex].isSelected = isSelected;
        presenter.configuration.filteredTokens[tokenIndex].selectionColorID = colorID;
    };

    presenter.selectColorButtonHandler = function (event) {
        var $button = $(this);
        presenter.setColor($button.data(presenter.defaults.dataHolders.colorID));
    };

    presenter.shouldActivateColoringMode = function () {
        return presenter.configuration.activeColorID == null;
    };

    presenter.shouldDisableColoringMode = function (colorID) {
        return colorID == presenter.configuration.activeColorID;
    };

    presenter.activateColoringMode = function (colorID) {
        presenter.setActiveColor(colorID);
        presenter.connectWordTokensHandlers();
    };

    presenter.disableColoringMode = function () {
        presenter.configuration.activeColor = null;
        presenter.configuration.activeColorID = null;
        presenter.disconnectWordTokensHandlers();
    };

    presenter.setActiveColor = function (colorID) {
        var activeColorDefinition = presenter.getColorDefinitionById(colorID);

        presenter.configuration.activeColor = activeColorDefinition.color;
        presenter.configuration.activeColorID = colorID;
    };

    presenter.getColorDefinitionById = function (colorID) {
        return presenter.configuration.colors.filter(function (colorDefinition) {
            return colorDefinition.id == colorID;
        })[0];
    };

    presenter.onEventReceived = function (eventName, data) {
        if (eventName == "ShowAnswers") {
            presenter.stateMachine.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.stateMachine.hideAnswers();
        }

        if (eventName == "GradualShowAnswers") {
            if (presenter.configuration.ID == data.moduleID) {
                presenter.stateMachine.gradualBlockAnswers();
                presenter.stateMachine.gradualShowAnswers();
            } else {
                presenter.stateMachine.gradualBlockAnswers();
            }
        }

        if (eventName == "GradualHideAnswers") {
            presenter.stateMachine.gradualHideAnswers();
        }
    };

    presenter.getActivitiesCount = function () {
        if (!presenter.configuration.showAllAnswersInGradualShowAnswersMode) {
            var answersNumber = 0;
            presenter.configuration.filteredTokens.filter(filterSelectablesTokens).forEach(function (token) {
                var colorDefinition = presenter.getColorDefinitionById(token.color);
                if (colorDefinition !== undefined) {
                    answersNumber++;
                }
            });
            return answersNumber;
        }
        return 1;
    };

    presenter.getWordTokenByIndex = function (tokenIndex) {
        if (presenter.configuration.mode == "ALL_SELECTABLE") {
            return $(presenter.$wordTokens[tokenIndex]);
        } else {
            return presenter.$view.find('[data-word-index='+tokenIndex+']');
        }
    };

    presenter.reset = function () {
        presenter.stateMachine.reset();
        presenter.stateMachine.notifyEdit();
    };

    presenter.setWorkMode = function () {
        presenter.stateMachine.hideAnswers();
        presenter.stateMachine.onUnCorrect();
        presenter.stateMachine.notifyEdit();

        if (presenter.configuration.activeColorID !== null) {
            presenter.configuration.activeColorID = null;
            presenter.configuration.activeColor = null;
        }
        presenter.disconnectWordTokensHandlers();
        presenter.setColor(presenter.configuration.colors[0].id);
    };

    presenter.setShowErrorsMode = function () {
        presenter.stateMachine.check();
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'setEraserMode': presenter.setEraserMode,
            'setColor': presenter.setColorCommand,
            'isAttempted': presenter.isAttempted
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setColorCommand = function (args) {
        var validatedArgs = presenter.validateColorCommandArgs(args);

        if (validatedArgs.isError) {
            return;
        }

        presenter.setColor(validatedArgs.value);
    };

    presenter.validateColorCommandArgs = function (args) {
        if (args.length != 1) {
            return ModelErrorUtils.getErrorObject("");
        }

        var colorDefinition = presenter.getColorDefinitionById(args[0]);

        if (colorDefinition == undefined) {
            return ModelErrorUtils.getErrorObject("");
        }

        return {
            isError: false,
            value: args[0]
        };
    };

    presenter.setEraserMode = function () {
        if (!presenter.configuration.eraserMode) {
            presenter.disableColoringMode();
            presenter.setEraserButtonAsActive();
            presenter.connectWordTokensHandlers();
            presenter.toggleEraserMode();
        }
    };

    presenter.setColor = function (colorID) {
        if (presenter.configuration.eraserMode) {
            presenter.toggleEraserMode();
            presenter.setActiveColor(colorID);
            presenter.unsetEraserButtonAsActive();
            presenter.setColorButtonAsActive(colorID);
        } else if (presenter.shouldActivateColoringMode()) {
            presenter.activateColoringMode(colorID);
            presenter.setColorButtonAsActive(colorID);
        } else {
            presenter.setActiveColor(colorID);
            presenter.setColorButtonAsActive(colorID);
        }
    };
 
     presenter.isAttempted = function () {
        var words = presenter.configuration.filteredTokens;
        var attempted = false;
        for (var i = 0; i < words.length; i++) {
            if (words[i].isSelected) {
                attempted = true;
                break;
            }
        };
        return attempted;
    };

    presenter.setEraserButtonAsActive = function () {
        if (presenter.$colorButtons !== null) {
            presenter.$colorButtons.removeClass(presenter.defaults.css.activeButton);
        }

        if (presenter.$eraserButton !== null) {
            presenter.$eraserButton.addClass(presenter.defaults.css.activeButton);
        }
    };

    presenter.unsetEraserButtonAsActive = function () {
        if (presenter.$eraserButton !== null) {
            presenter.$eraserButton.removeClass(presenter.defaults.css.activeButton);
        }
    };

    presenter.unsetColorButtonsAsActive = function () {
        presenter.$colorButtons.removeClass(presenter.defaults.css.activeButton);
    };

    presenter.setColorButtonAsActive = function (colorID) {
        var button = presenter.getColorButtonByID(colorID);
        if (button !== null) {
            presenter.unsetColorButtonsAsActive();
            $(button).addClass(presenter.defaults.css.activeButton);
        }
    };

    presenter.getColorButtonByID = function (colorID) {
        var colorButton = $.makeArray(presenter.$colorButtons).filter(function (button) {
            return $(button).data(presenter.defaults.dataHolders.colorID) == colorID;
        });

        if (colorButton.length > 0) {
            return colorButton;
        } else {
            return null;
        }
    };

    presenter.show = function () {
        presenter.configuration.isVisible = true;
        presenter.$view.css("visibility", "visible");
    };

    presenter.hide = function () {
        presenter.configuration.isVisible = false;
        presenter.$view.css("visibility", "hidden");
    };

    presenter.sendErasingEvent = function (wordIndex) {
        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item': (wordIndex + 1),
            'value': presenter.EVENT_TYPES.DESELECTING,
            'score': 0
        });
    };

    presenter.sendMarkingEvent = function (wordIndex) {
        presenter.eventBus.sendEvent('ValueChanged', {
            'source': presenter.configuration.ID,
            'item': (wordIndex + 1),
            'value': presenter.EVENT_TYPES.SELECTING,
            'score': presenter.getScoreForWordMarking(wordIndex, presenter.configuration.activeColorID)
        });
    };

    presenter.getScoreForWordMarking = function (wordIndex, colorID) {
        if (presenter.configuration.filteredTokens[wordIndex].color == colorID) {
            return 1;
        }

        return 0;
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.filteredTokens.filter(filterSelectablesTokens).length;
    };

    presenter.getErrorCount = function () {
        return presenter.configuration.filteredTokens.filter(filterSelectedTokens).filter(filterWrongTokens).length;
    };

    presenter.getScore = function () {
        return presenter.getMaxScore() - presenter.configuration.filteredTokens.filter(filterSelectablesTokens).filter(filterWrongTokens).length;
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            tokens: presenter.configuration.filteredTokens,
            activeColorID: presenter.configuration.activeColorID
        });
    };

    presenter.setState = function (stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) {
            return;
        }

        var parsedState = JSON.parse(stateString);

        presenter.configuration.filteredTokens = parsedState.tokens;
        presenter.configuration.isVisible = parsedState.isVisible;

        if (!presenter.configuration.isVisible) {
            presenter.hide();
        }
        presenter.colorAllMarkedTokens();

        if (parsedState.activeColorID !== undefined) {
            if (parsedState.activeColorID == null) {
                presenter.setEraserMode();
            } else {
                presenter.setColor(parsedState.activeColorID);
            }
        }
    };

    presenter.colorAllMarkedTokens = function () {
        presenter.configuration.filteredTokens.filter(function (token) {
            return token.selectionColorID !== null;
        }).forEach(function (token) {
            var $token = presenter.getWordTokenByIndex(token.index);
            var colorDefinition = presenter.getColorDefinitionById(token.selectionColorID);
            presenter.markToken($token, colorDefinition.color);
            presenter.addColoredWordCss($token, token);
        });
    };

    presenter.sendAllOKEvent = function () {
        var eventData = {
            'source': presenter.configuration.ID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.isAllOK = function () {
        if (presenter.configuration.countErrors) {
            return presenter.getMaxScore() === presenter.getScore() - presenter.getErrorCount();
        } else {
            return presenter.configuration.filteredTokens.filter(filterSelectablesTokens).every(function (token) {
                return presenter.getScoreForWordMarking(token.index, token.selectionColorID);
            });
        }

    };

    presenter.addCorrectClass = function (tokenIndex) {
        presenter.getWordTokenByIndex(tokenIndex).addClass(presenter.defaults.css.markings.correct);
    };

    presenter.addWrongClass = function (tokenIndex) {
        presenter.getWordTokenByIndex(tokenIndex).addClass(presenter.defaults.css.markings.wrong);
    };

    presenter.removeAllCheckAnswersClasses = function () {
        presenter.$wordTokens.removeClass(presenter.defaults.css.markings.correct);
        presenter.$wordTokens.removeClass(presenter.defaults.css.markings.wrong);
    };

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;

        presenter.printableState = JSON.parse(state);
    }

    presenter.getPrintableHTML = function (model, showAnswers) {
        var printableHTML = '';
        var userAnswer = presenter.getUserAnswer();
        var didUserAnswer = userAnswer ? userAnswer.some(answer => answer.isSelected) : false;
        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);
        var modelText = presenter.configuration.textTokens.filter(token => ![presenter.TOKENS_TYPES.SPACE, presenter.TOKENS_TYPES.NEW_LINE].includes(token.type));
        var areAllSelectable = presenter.configuration.mode === 'ALL_SELECTABLE'

        modelText.forEach((token, index) => {
            switch (true) {
                case (userAnswer && userAnswer[index].isSelected) && !showAnswers:
                    var color = parseToGrayscale(presenter.getColorInHex(model, userAnswer[index].selectionColorID));
                    printableHTML += `<span style="border: 2px solid ${color}">${userAnswer[index].value}</span> `;
                    break;

                case (userAnswer && userAnswer[index].isSelected) && showAnswers:
                    var color = parseToGrayscale(presenter.getColorInHex(model, userAnswer[index].selectionColorID));
                    var answerMark = presenter.isAnswerCorrect(userAnswer[index], token.value) ? '&#10004;' : '&#10006;';
                    printableHTML += `<span style="border: 2px solid ${color}">${userAnswer[index].value} ${answerMark}</span> `;
                    break;

                case token.hasOwnProperty('color') && showAnswers && !didUserAnswer:
                    var color = presenter.getColor(model, token.color);
                    printableHTML += `<span style="border: 2px dashed ${color}">${token.value}</span> `;
                    break;

                case token.hasOwnProperty('color') && (!areAllSelectable || showAnswers):
                    printableHTML += `<span style="border-bottom: 1px solid">${token.value}</span> `;
                    break;

                default:
                    printableHTML += `${token.value} `;
            }
        });

        return presenter.createHTML(showAnswers || userAnswer, printableHTML, presenter.configuration);
    }

    presenter.createHTML = function (shouldChangeLineHeight, htmlContent) {
        var $legend = $('<div></div>');
        var $wrapper = $('<div></div>');
        var colors = presenter.configuration.colors;
        var height = presenter.configuration.height + (2 + colors.length) * 20;
        var legendTitle = presenter.configuration.legendTitle
        $wrapper.addClass('printable_addon_Paragraph');
        $wrapper.css("left", "0px");
        $wrapper.css("right", "0px");
        $wrapper.css("height", `${height}px`);
        $wrapper.css("padding", "10px 10px 10px 0px");
        var $paragraph = $('<div></div>');
        $paragraph.css("left", "0px");
        $paragraph.css("right", "0px");
        $paragraph.css("height", `${presenter.configuration.height}`);
        $paragraph.css("border", "1px solid");
        $paragraph.css("padding", "10px");
        if (shouldChangeLineHeight) {
            $paragraph.css("line-height", "1.5");
        }
        $paragraph.html(htmlContent);
        $legend.append(presenter.createLegend(colors,  legendTitle))
        $wrapper.append($paragraph);
        $wrapper.append($legend);
        return $wrapper[0].outerHTML;
    }

    /* Return colors in grayscale from the model */
    presenter.getColors = function (model) {
        var colors = [];
        model['colors'].forEach(colorObject => {
           colors.push({name: colorObject.description, value: parseToGrayscale(colorObject.color)});
        });

        return colors;
    }

    /* Returns color in hex code from color name */
    presenter.getColorInHex = function (model, colorName) {
        var colors =  presenter.getColors(model);

        return colors.find(color => color.name === colorName).value;
    }

    /* Extracts the word from phrase \\color{color}{word} */
    presenter.getWord = function (phrase) {
        var regExp = /(\\color{\w*}{)/;
        return phrase.replace(regExp, '').replace(/}/, '');
    }

    /* Extracts the color from phrase and convert into grayscale \\color{color}{word} */
    presenter.getColor = function (model, color) {
        return parseToGrayscale(presenter.getColorInHex(model, color));
    }

    /* Return user answers */
    presenter.getUserAnswer = function () {
        if (presenter.printableState && presenter.printableState.hasOwnProperty('tokens')) {
            return presenter.printableState['tokens'];
        }

        return null;
    }

    /* Checks if the user answer is correct */
    presenter.isAnswerCorrect = function (userAnswer, modelAnswer) {
        return modelAnswer.includes(`{${userAnswer.selectionColorID}}{${userAnswer.value}}`);
    }

    presenter.createLegend = function (colors, legendTitle) {
        var $table = $("<table></table>");
        var $tbody = $("<tbody></tbody>");

        $tbody.append($(`<caption>${legendTitle}</caption>`));
        colors.forEach(colorObject => {
            var $tr = $("<tr></tr>");

            var $td = $("<td><div style='width: 20px; height: 10px'></div></td>");
            $td.css('background', parseToGrayscale(colorObject.color));

            var $description = $(`<td><div style="padding-left: 10px">${colorObject.description}</div></td>`);

            $tr.append($td);
            $tr.append($description);
            $tbody.append($tr);
        });
        $table.append($tbody);

        return $table
    }

    return presenter;
}

function parseToGrayscale(hexColor) {
    var rgbColor = hexToRGB(hexColor);
    return rgbToGrayscaleHex(rgbColor);
}

function hexToRGB(hexColor) {
    var r = 0, g = 0, b = 0;

    if (hexColor.length === 4) {
        r = '0x' + hexColor[1] + hexColor[1];
        g = '0x' + hexColor[2] + hexColor[2];
        b = '0x' + hexColor[3] + hexColor[3];
    } else if (hexColor.length === 7) {
        r = '0x' + hexColor[1] + hexColor[2];
        g = '0x' + hexColor[3] + hexColor[4];
        b = '0x' + hexColor[5] + hexColor[6];
    }

    return [+r, +g, +b];
}

function rgbToGrayscaleHex(rgbColor) {
    var grayIntensity = Math.round(0.3 * rgbColor[0] + 0.59 * rgbColor[1] + 0.11 * rgbColor[2]);

    return '#' + decimalToHex(grayIntensity) + decimalToHex(grayIntensity) + decimalToHex(grayIntensity);
}

function decimalToHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
