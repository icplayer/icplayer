function AddonParagraph_create() {
    var presenter = function () {};
    var eventBus;
    var userAnswerAIReviewRequest = 'gradeByAi';
    var userAnswerAIReviewResponse = 'aiGraded';

    presenter.placeholder = null;
    presenter.editor = null;
    presenter.jQueryTinyMCEHTML = null;
    presenter.$tinyMCEToolbar = null;
    presenter.tinyMceContainer = null;
    presenter.editor = null;
    presenter.playerController = null;
    presenter.isVisibleValue = null;
    presenter.isShowAnswersActive = false;
    presenter.wasShowAnswersActive = false;
    presenter.isErrorCheckingMode = false;
    presenter.cachedAnswer = [];
    presenter.currentGSAIndex = 0;
    presenter.savedInitializedSA = null;

    presenter.isEditorLoaded = false;
    presenter.isEditorReadOnly = false;

    presenter.toolbarChangeHeightTimeoutID = null;
    presenter.paragraphInitTimeoutID = null;
    presenter.currentPageIndex = null;

    presenter.LANGUAGES = {
        DEFAULT: "en_GB",
        FRENCH: "fr_FR",
        FRENCH_PURE: "fr_FR_pure"
    };

    presenter.DEFAULTS = {
        TOOLBAR: 'bold italic underline numlist bullist alignleft aligncenter alignright alignjustify',
        FONT_FAMILY: 'Verdana,Arial,Helvetica,sans-serif',
        FONT_SIZE: '11px',
        BUTTON_WIDTH: 37,
        FORMAT_WIDTH: 85,
        STYLE_SELECT_NAME: "styleselect"
    };

    presenter.ALLOWED_TOOLBAR_BUTTONS = 'customBold customUnderline customItalic newdocument bold italic underline strikethrough alignleft aligncenter '+
        'alignright alignjustify styleselect formatselect fontselect fontsizeselect '+
        'bullist numlist outdent indent blockquote undo redo '+
        'removeformat subscript superscript forecolor backcolor |'.split(' ');

    presenter.ERROR_CODES = {
        'W_01': 'Weight must be a whole number between 0 and 100'
    };

    presenter.TOOLBAR_ARIAS = {
        bold: "bold",
        italic: "italic",
        underline: "underline",
        alignleft: "alignLeft",
        aligncenter: "alignCenter",
        alignright: "alignRight",
        justify: "justify"
    };

    presenter.DEFAULT_TTS_PHRASES = {
        selected: "selected",
        deselected:"deselected",
        paragraphContent: "paragraph content",
        bold: "bold",
        italic: "italic",
        underline: "underline",
        alignLeft: "align left",
        alignCenter: "align center",
        alignRight: "align right",
        justify: "justify"
    };

    presenter.keys = {
        ESCAPE: 27
    };

    function isIOSSafari() {
        var ua = window.navigator.userAgent,
            iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i),
            webkit = !!ua.match(/WebKit/i),
            iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
        return iOSSafari
    }

    presenter.executeCommand = function AddonParagraph_executeCommand(name, params) {
        if (!presenter.configuration.isValid) { return; }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isVisible': presenter.isVisible,
            'getText': presenter.getText,
            'setText': presenter.setText,
            'isAttempted': presenter.isAttempted,
            'lock': presenter.lock,
            'unlock': presenter.unlock,
            'isAIReady': presenter.isAIReady,
            'sendUserAnswerToAICheck': presenter.sendUserAnswerToAICheck,
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAttempted = function () {
        if (!presenter.isEditorLoaded) {
            if (presenter.state) {
                var parser = new DOMParser();
                var stateNode = parser.parseFromString(JSON.parse(presenter.state).tinymceState, "text/html");
                return $(stateNode).text() != '';
            } else {
                return false;
            }
        }

        const editorContent = presenter.getText();
        if (presenter.configuration.isPlaceholderSet
            && !presenter.configuration.isPlaceholderEditable) {
            return !isPlaceholderClassInHTML(editorContent);
        }
        const textToCompare = presenter.configuration.isPlaceholderSet ? presenter.configuration.placeholderText : "";
        return $(editorContent).text() != textToCompare;
    };

    presenter.getText = function AddonParagraph_getText() {
        return presenter.editor.getContent({format: 'raw'});
    };

    presenter.sendOnBlurEvent = function () {
        var eventData = {
            'source': presenter.configuration.ID,
            'item': '',
            'value': 'blur',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.removeFocusFromDisabledElement = function () {
        if (presenter.isEditorReadOnly) {
            const iframe = presenter.$view.find('iframe');
            iframe.blur();
        }
    };

    presenter.setVisibility = function AddonParagraph_setVisibility(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        if (isVisible) {
            presenter.$view.find(".paragraph-wrapper").show();
        } else {
            presenter.$view.find(".paragraph-wrapper").hide();
        }

        presenter.isVisibleValue = isVisible;
    };

    presenter.createPreview = function AddonParagraph_createPreview(view, model) {
        presenter.initializeEditor(view, model, true);
        presenter.setVisibility(true);
        var clickhandler = $("<div></div>").css({"background":"transparent", 'width': '100%', 'height': '100%', 'position':'absolute', 'top':0, 'left':0});
        presenter.$view.append(clickhandler);
    };

    presenter.setEventBus = function (wrappedEventBus) {
        eventBus = wrappedEventBus;
        var events = ['ShowAnswers', 'HideAnswers', 'GradualShowAnswers', 'GradualHideAnswers'];
        for (var i = 0; i < events.length; i++) {
            eventBus.addEventListener(events[i], this);
        }
    };

    presenter.onEventReceived = function (eventName, eventData) {
        switch (eventName) {
            case "GradualShowAnswers":
                presenter.gradualShowAnswers(eventData);
                break;

            case "ShowAnswers":
                presenter.showAnswers();
                break;

            case "HideAnswers":
            case "GradualHideAnswers":
                presenter.hideAnswers();
                break;
        }
    };

    presenter.enableEdit = function () {
        if(presenter.isEditorReadOnly) {
            presenter.editor.setMode('design');
            presenter.isEditorReadOnly = false;
        }
    };

    presenter.disableEdit = function () {
        if(!presenter.isEditorReadOnly) {
            presenter.editor.setMode('readonly');
            presenter.isEditorReadOnly = true;
        }
    };

    presenter.showAnswers = function () {
        if (presenter.isShowAnswersActive) return;

        setTimeout(function () {
            const elements = presenter.getParagraphs();
            presenter.initializeShowAnswers(elements);
            presenter.savedInitializedSA = presenter.getText();
            var modelAnswer = combineAnswers(presenter.configuration.modelAnswer);
            presenter.editor.setContent(modelAnswer);
            presenter.setStyles();
            presenter.isShowAnswersActive = true;
            presenter.wasShowAnswersActive = true;
            presenter.isErrorCheckingMode = false;
        }, 0);
    };

    presenter.initializeShowAnswers = function Addon_Paragraph_initializeShowAnswers (elements) {
        presenter.disableEdit();
        presenter.cacheAnswersAndClearParagraphs(elements);
    };

    presenter.cacheAnswersAndClearParagraphs = function (elements) {
        $(elements).each((index, element) => {
            presenter.cachedAnswer.push(element.innerHTML);
            element.innerHTML = "";
        })
    };

    function combineAnswers(answersArray) {
        var newText = "";
        if (answersArray.length > 0) {
           newText += answersArray[0].Text;
        }
        for (var answerID = 1; answerID < answersArray.length; answerID++) {
           newText += "<div></div><br>" + answersArray[answerID].Text;
        }
        return newText;
    }

    presenter.hideAnswers = function (shouldEnableEdit = true) {
        if (presenter.savedInitializedSA) {
            presenter.setText(presenter.savedInitializedSA);
            presenter.savedInitializedSA = null;
        }
        const elements = presenter.getParagraphs();

        if (shouldEnableEdit) {
            presenter.enableEdit();
        }
        presenter.isShowAnswersActive = false;
        presenter.isGradualShowAnswersActive = false;
        presenter.isErrorCheckingMode = false;
        presenter.currentGSAIndex = 0;

        if (presenter.cachedAnswer.length) {
            for (var [key, value] of Object.entries(elements)) {
                if (+key > -1) {
                    value.innerHTML = presenter.cachedAnswer[+key];
                }
            }
            presenter.cachedAnswer = [];
        }
    };

    presenter.handleDisablingEdition = function () {
        if (presenter.wasShowAnswersActive && presenter.currentGSAIndex === 0) {
            presenter.wasShowAnswersActive = false;
            presenter.hideAnswers(false);
            setTimeout(function () {
                presenter.disableEdit();
            }, 0);
        } else {
            presenter.disableEdit();
        }
    };

    presenter.gradualShowAnswers = function (data) {
        presenter.handleDisablingEdition();

        if (data.moduleID !== presenter.configuration.ID) { return; }

        setTimeout(function () {
            const elements = presenter.getParagraphs();
            if (!presenter.isGradualShowAnswersActive) {
                presenter.initializeShowAnswers(elements);
                presenter.isGradualShowAnswersActive = true;
            }
            presenter.isErrorCheckingMode = false;

            if (presenter.currentGSAIndex !== 0) {
                elements[0].innerHTML += "<div></div><br>";
            }
            elements[0].innerHTML += presenter.configuration.modelAnswer[presenter.currentGSAIndex].Text;
            presenter.currentGSAIndex++;
        }, 0);
    };

    presenter.sendUserAnswerToAICheck = function () {
        if(!presenter.isAIReady()) { return; }

        const data = presenter.getDataRequestToAI();

        window.addEventListener("message", presenter.onExternalMessage);
        presenter.playerController.sendExternalEvent(userAnswerAIReviewRequest, data);
    };

    presenter.getDataRequestToAI = function () {
        const pageID = presenter.playerController.getPresentation().getPage(presenter.currentPageIndex).getId();
        const activityID = presenter.configuration.ID;
        const activityMaxScore = presenter.getMaxScore();
        const pageWeight = presenter.playerController.getPresentation().getPage(presenter.currentPageIndex).getPageWeight();
        const pageMaxScore = presenter.playerController.getPresentation().getPage(presenter.currentPageIndex).getModulesMaxScore();
        const answer = presenter.getText().replace(/<(.*?)>/g, '').replace(/&nbsp;/g, '');

        return JSON.stringify({
            'page_id': pageID,
            'activity_id': activityID,
            'activity_max_score': activityMaxScore,
            'page_weight': pageWeight,
            'page_max_score': pageMaxScore,
            'answer': answer
        });
    };

    presenter.onExternalMessage = function (event) {
        const data = event.data;

        if (presenter.isValidResponse(data)) {
            presenter.updateOpenActivityScore(data);
        }
    };

    presenter.isValidResponse = function (data) {
        const isAIResponse = data.includes(userAnswerAIReviewResponse);
        const pageID = presenter.playerController.getPresentation().getPage(presenter.currentPageIndex).getId();
        const activityID = presenter.configuration.ID;
        const isValidPageID = data.includes(pageID);
        const isValidActivityID = data.includes(activityID);

        return isAIResponse && isValidPageID && isValidActivityID;
    };

    presenter.updateOpenActivityScore = function (data) {
        const parsedData = JSON.parse(data.replace(`EXTERNAL_${userAnswerAIReviewResponse}:`, '').trim());
        const pageID = parsedData.page_id;
        const activityID = parsedData.activity_id;
        const grade = parsedData.ai_grade;

        OpenActivitiesUtils.updateOpenActivityScore(
            presenter.playerController,
            pageID,
            activityID,
            grade
        );
    };

    presenter.setShowErrorsMode = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (!presenter.isErrorCheckingMode && presenter.configuration.isBlockedInErrorCheckingMode) {
            presenter.isErrorCheckingMode = true;
            presenter.disableEdit();
        }
    };

    presenter.setWorkMode = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (presenter.isErrorCheckingMode && presenter.configuration.isBlockedInErrorCheckingMode) {
            presenter.isErrorCheckingMode = false;
            presenter.enableEdit();
        }
    };

    presenter.getParagraphs = function () {
        const $paragraph = presenter.$view.find(".paragraph-wrapper"),
            $iframe = $paragraph.find("iframe"),
            $iframeBody = $iframe.contents().find("#tinymce");

        return $iframeBody.children();
    };

    presenter.run = function AddonParagraph_run(view, model) {
        presenter.initializeEditor(view, model, false);
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.isLocked = false;
    };

    presenter.initializeEditor = function AddonParagraph_initializeEditor(view, model, isPreview) {
        if (presenter.loaded){ return;}
        presenter.loaded = true;
        presenter.view = view;
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        presenter.model = upgradedModel;
        presenter.configuration = presenter.validateModel(upgradedModel, isPreview);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.$view.on('click', function viewClickHandler(e) {
            e.stopPropagation();
            e.preventDefault();
        });

        presenter.setWrapperID();

        if (presenter.playerController) {
            var paragraphInitDelay = presenter.playerController.getExternalVariable('paragraphInitDelay');
            if (paragraphInitDelay.length == 0 || isNaN(paragraphInitDelay)) {
                presenter.initTinymce();
            } else {
                presenter.$view.css("visibility", "hidden");
                presenter.paragraphInitTimeoutID = setTimeout(presenter.initTinymce, Number(paragraphInitDelay));
            }
        } else {
            presenter.initTinymce();
        }
    };

    presenter.initTinymce = function() {
        if (!document.body.contains(presenter.view)) {
            return;
        }
        presenter.placeholder = new presenter.placeholderElement();
        presenter.configuration.plugins = presenter.getPlugins();
        presenter.addPlugins();

        tinymce.init(presenter.getTinymceInitConfiguration(presenter.getTinyMceSelector())).then(function (editors) {
            presenter.editor = editors[0];
            presenter.onInit();

            if (isIOSSafari()) {
                presenter.findIframeAndSetStyles();
            }

            presenter.editor.on('blur', function () {
                presenter.sendOnBlurEvent();
            });

            presenter.editor.on('focus', function () {
                presenter.removeFocusFromDisabledElement();
            });

            presenter.isEditorLoaded = true;
            presenter.setStyles();
            presenter.setSpeechTexts(presenter.model["speechTexts"]);
            presenter.buildKeyboardController();
        });

        if(isIOSSafari()) {
            var input = document.createElement("input");
            input.type = "text";
            $(input).css('display', 'none');
            presenter.$view.append(input);
        }
        presenter.paragraphInitTimeoutID = null;
    }

    presenter.setWrapperID = function AddonParagraph_setWrapperID() {
        var $paragraphWrapper = presenter.$view.find('.paragraph-wrapper');
        $paragraphWrapper.attr('id', presenter.configuration.ID + '-wrapper');
    };

    presenter.getTinyMceSelector = function AddonParagraph_getTinyMceSelector() {
        return '#' + presenter.configuration.ID + '-wrapper .paragraph_field';
    };

    presenter.getTinymceInitConfiguration = function AddonParagraph_getTinyMceConfiguration(selector) {
        var layoutType = presenter.configuration.layoutType;

        var language = layoutType === "Default"
            ? presenter.LANGUAGES.DEFAULT
            : layoutType === "French_pure"
                ? presenter.LANGUAGES.FRENCH_PURE
                : presenter.LANGUAGES.FRENCH;

        var toolbar = layoutType === "Default"
            ? presenter.configuration.toolbar
            : layoutType === "French"
                ? presenter.getSpecifyToolbar(layoutType)
                : presenter.configuration.toolbar;

        return {
            plugins: presenter.configuration.plugins,
            selector : selector,
            width: presenter.configuration.width,
            height: presenter.configuration.textAreaHeight,
            statusbar: false,
            menubar: false,
            toolbar: toolbar,
            content_css: presenter.configuration.content_css,
            setup: presenter.setup,
            language: language
        };
    };

    presenter.findIframeAndSetStyles = function AddonParagraph_findIframeAndSetStyles() {
        var iframe = presenter.$view.find(".paragraph-wrapper").find("iframe"),
            body = $(iframe).contents().find("#tinymce"),
            element = body.find("p");

        element.css({
            'overflow-wrap': 'break-word',
            'word-wrap': 'break-word',
            '-ms-word-break': 'break-all',
            'word-break': 'break-word',
            '-ms-hyphen': 'auto',
            '-moz-hyphens': 'auto',
            '-webkit-hyphens': 'auto',
            'hyphens': 'auto'
        });

        body.css('min-height', 'initial');

         if(presenter.configuration.isToolbarHidden) {
             iframe.css('height', presenter.configuration.height);
         }

        presenter.$view.find(".paragraph-wrapper").css("overflow", "scroll");
    };

    presenter.validateToolbar = function AddonParagraph_validateToolbar(controls, width) {
        if (!controls) {
            controls = presenter.DEFAULTS.TOOLBAR;
        }

        controls = controls.split(" ");
        if (controls.indexOf("|") != -1) {
            return presenter.parseToolbarWithGroups(controls, width);
        } else {
            return presenter.parseToolbarWithoutGroups(controls, width);
        }
    };

    presenter.parseToolbarWithGroups = function (controls, toolbarWidth) {
        var controlGroups = controls.join(" ").split("|");
        return controlGroups.filter(function (group) {
            return group.trim().length > 0;
        }).map(function (group) {
            return presenter.parseToolbarWithoutGroups(group.trim().split(" "), toolbarWidth);
        }).join(" | ");
    };

    presenter.parseToolbarWithoutGroups = function (controls, toolbarWidth) {
        var filteredControls = controls.filter(function(param){
            return presenter.ALLOWED_TOOLBAR_BUTTONS.indexOf(param) != -1;
        });

        var result = "";
        var bufor = 0;
        var widthToAdd = 0;
        for(var i = 0; i < filteredControls.length; i++) {
            if (filteredControls[i] !== presenter.DEFAULTS.STYLE_SELECT_NAME) {
                widthToAdd = presenter.DEFAULTS.BUTTON_WIDTH;
            } else {
                widthToAdd = presenter.DEFAULTS.FORMAT_WIDTH;
            }

            if (bufor + widthToAdd < toolbarWidth) {
                bufor += widthToAdd;
                result += filteredControls[i].trim() + " ";
            } else {
                bufor = widthToAdd;
                result += "| " + filteredControls[i].trim() + " ";
            }
        }

        return result.trim();
    };

    /**
     * Parses model and set settings to default values if either of them is empty
     *
     * IMPORTANT. Validation resulting in a validation error, e.g. W_01, must be implemented in Open Activities
     * on the mCourser side.
     *
     * @param model:object
     * @param isPreview:boolean
     * @returns {{fontFamily: *, fontSize: *}}
     */
    presenter.validateModel = function AddonParagraph_validateModel(model, isPreview) {
        var fontFamily = model['Default font family'],
            fontSize = model['Default font size'],
            isToolbarHidden = ModelValidationUtils.validateBoolean(model['Hide toolbar']),
            isPlaceholderEditable = ModelValidationUtils.validateBoolean(model['Editable placeholder']),
            toolbar = presenter.validateToolbar(model['Custom toolbar'], model.Width),
            height = model.Height,
            hasDefaultFontFamily = false,
            hasDefaultFontSize = false,
            layoutType = model["Layout Type"] || "Default",
            title = model["Title"],
            manualGrading = ModelValidationUtils.validateBoolean(model["Manual grading"]),
            weight = model['Weight'],
            modelAnswer = model['Show Answers'];

        if (ModelValidationUtils.isStringEmpty(fontFamily)) {
            fontFamily = presenter.DEFAULTS.FONT_FAMILY;
            hasDefaultFontFamily = true;
        }

        if (ModelValidationUtils.isStringEmpty(fontSize)) {
            fontSize = presenter.DEFAULTS.FONT_SIZE;
            hasDefaultFontSize = true;
        }

        const validatedWeight = presenter.validateWeight(weight, isPreview);
        if (!validatedWeight.isValid) {
            return validatedWeight;
        }

        height -= !isToolbarHidden ? 37 : 2;

        return {
            ID: model["ID"],
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isValid: true,
            fontFamily: fontFamily,
            fontSize: fontSize,
            isToolbarHidden: isToolbarHidden,
            toolbar: toolbar,
            textAreaHeight: height,
            hasDefaultFontFamily: hasDefaultFontFamily,
            hasDefaultFontSize: hasDefaultFontSize,
            content_css: model['Custom CSS'],
            isPlaceholderSet: !ModelValidationUtils.isStringEmpty(model["Placeholder Text"]),
            placeholderText: model["Placeholder Text"],
            pluginName: presenter.makePluginName(model["ID"]),
            width: model['Width'],
            height: parseInt(height, 10),
            layoutType: layoutType,
            isPlaceholderEditable: isPlaceholderEditable,
            title: title,
            manualGrading: manualGrading,
            weight: validatedWeight.value,
            modelAnswer: modelAnswer,
            langTag: model["langAttribute"],
            isBlockedInErrorCheckingMode: ModelValidationUtils.validateBoolean(model["Block in error checking mode"]),
        };
    };

    presenter.validateWeight = function (weight, isPreview) {
        if (ModelValidationUtils.isStringEmpty(weight)) {
            return getCorrectObject(1);
        }

        const validatedInteger = ModelValidationUtils.validateIntegerInRange(weight, 100, 0);
        if (!validatedInteger.isValid) {
            return ModelErrorUtils.getErrorObject("W_01");
        }
        if (isPreview && (validatedInteger.value + "") !== weight) {
            return ModelErrorUtils.getErrorObject("W_01");
        }
        return getCorrectObject(validatedInteger.value);
    };

    function getCorrectObject(val) { return { isValid: true, value: val }; }

    /**
     * Initialize the addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way and it didn't make sense
     * for prototype purpose. Also the set of controls is static and it could be be moved to
     * configuration.
     */
    presenter.getPlugins = function AddonParagraph_getPlugins() {
        var plugins = [];
        if (presenter.configuration.toolbar.indexOf('forecolor') > -1 ||
            presenter.configuration.toolbar.indexOf('backcolor') > -1 ) {
            plugins.push("textcolor");
        }

        if (presenter.configuration.isPlaceholderSet) {
            plugins.push(presenter.configuration.pluginName);
        }

        return plugins.join(" ");
    };

    presenter.upgradeModel = function (model) {
        let upgradedModel = presenter.upgradePlaceholderText(model);
        upgradedModel = presenter.upgradeManualGrading(upgradedModel);
        upgradedModel = presenter.upgradeTitle(upgradedModel);
        upgradedModel = presenter.upgradeWeight(upgradedModel);
        upgradedModel = presenter.upgradeModelAnswer(upgradedModel);
        upgradedModel = presenter.upgradeEditablePlaceholder(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        upgradedModel = presenter.upgradeBlockInErrorCheckingMode(upgradedModel);
        return presenter.upgradeSpeechTexts(upgradedModel);
    };

    presenter.upgradeManualGrading = function (model) {
        return presenter.upgradeAttribute(model, "Manual grading", false);
    };

    presenter.upgradeTitle = function (model) {
        return presenter.upgradeAttribute(model, "Title", "");
    };

    presenter.upgradePlaceholderText = function (model) {
        return presenter.upgradeAttribute(model, "Placeholder Text", "");
    };

    presenter.upgradeEditablePlaceholder = function (model) {
        return presenter.upgradeAttribute(model, "Editable placeholder", "");
    };

    presenter.upgradeWeight = function (model) {
        return presenter.upgradeAttribute(model, "Weight", "");
    };

    presenter.upgradeModelAnswer = function (model) {
        const upgradedModel = presenter.upgradeAttribute(model, "Show Answers", [{Text: ""}]);

        // for backward compatibility where modal answer was single string and now is Array of strings we need to upgrade model
        if (!Array.isArray(upgradedModel["Show Answers"])) {
            upgradedModel["Show Answers"] = [{Text: upgradedModel["Show Answers"]}];
        }

        return upgradedModel;
    };

    presenter.upgradeLangTag = function (model) {
        return presenter.upgradeAttribute(model, "langAttribute", "");
    };

    presenter.upgradeBlockInErrorCheckingMode = function (model) {
        return presenter.upgradeAttribute(model, "Block in error checking mode", "False");
    };

    presenter.upgradeSpeechTexts = function (model) {
        let defaultValue = {
            Bold: {Bold: ""},
            Italic: {Italic: ""},
            Underline: {Underline: ""},
            AlignLeft: {AlignLeft: ""},
            AlignCenter: {AlignCenter: ""},
            AlignRight: {AlignRight: ""},
            Justify: {Justify: ""}
        };

        const upgradedModel = presenter.upgradeAttribute(model, "speechTexts", defaultValue);
        if (!upgradedModel.speechTexts.hasOwnProperty("Selected")) {
            upgradedModel.speechTexts.Selected = {Selected: ""};
        }

        if (!upgradedModel.speechTexts.hasOwnProperty("ParagraphContent")) {
            upgradedModel.speechTexts.ParagraphContent = {ParagraphContent: ""};
        }

        if (!upgradedModel.speechTexts.hasOwnProperty("Deselected")) {
            upgradedModel.speechTexts.Deselected = {Deselected: ""};
        }

        return upgradedModel;
    };

    presenter.upgradeAttribute = function (model, attrName, defaultValue) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel.hasOwnProperty(attrName)) {
            upgradedModel[attrName] = defaultValue;
        }

        return upgradedModel;
    };

    presenter.setSpeechTexts = function AddonParagraph_setSpeechTexts (speechTexts) {
        presenter.speechTexts = {
            ...presenter.DEFAULT_TTS_PHRASES,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            selected: TTSUtils.getSpeechTextProperty(
                speechTexts.Selected.Selected,
                presenter.speechTexts.selected),
            deselected: TTSUtils.getSpeechTextProperty(
                speechTexts.Deselected.Deselected,
                presenter.speechTexts.deselected),
            paragraphContent: TTSUtils.getSpeechTextProperty(
                speechTexts.ParagraphContent.ParagraphContent,
                presenter.speechTexts.paragraphContent),
            bold : TTSUtils.getSpeechTextProperty(
                speechTexts.Bold.Bold,
                presenter.speechTexts.bold),
            italic: TTSUtils.getSpeechTextProperty(
                speechTexts.Italic.Italic,
                presenter.speechTexts.italic),
            underline : TTSUtils.getSpeechTextProperty(
                speechTexts.Underline.Underline,
                presenter.speechTexts.underline),
            alignLeft: TTSUtils.getSpeechTextProperty(
                speechTexts.AlignLeft.AlignLeft,
                presenter.speechTexts.alignLeft),
            alignCenter: TTSUtils.getSpeechTextProperty(
                speechTexts.AlignCenter.AlignCenter,
                presenter.speechTexts.alignCenter),
            alignRight: TTSUtils.getSpeechTextProperty(
                speechTexts.AlignRight.AlignRight,
                presenter.speechTexts.alignRight),
            justify: TTSUtils.getSpeechTextProperty(
                speechTexts.Justify.Justify,
                presenter.speechTexts.justify)
        };
    };

    presenter.onDestroy = function AddonParagraph_destroy() {
        // iOS fix to hide keyboard after page change
        // https://github.com/tinymce/tinymce/issues/3441
        try {
            if (isIOSSafari()) {
                var iframe = presenter.$view.find('iframe');
                iframe.focus();
                document.activeElement.blur();
            }

            clearTimeout(presenter.toolbarChangeHeightTimeoutID);
            clearTimeout(presenter.paragraphInitTimeoutID);
            presenter.toolbarChangeHeightTimeoutID = null;

            presenter.placeholder = null;
            presenter.editor.destroy();
            presenter.jQueryTinyMCEHTML.off();

            presenter.$view.off();
            presenter.$tinyMCEToolbar.off();

            tinymce.AddOnManager.PluginManager.items.length = 0;
            presenter.$tinyMCEToolbar = null;
            presenter.jQueryTinyMCEHTML = null;
            presenter.configuration = null;
            presenter.$view = null;
            presenter.view = null;
            presenter.editor = null;
            presenter.isVisibleValue = null;
            presenter.findIframeAndSetStyles = null;
            presenter.getSpecifyToolbar = null;
            presenter.addStylesToButton = null;
            presenter.getButton = null;
            presenter.onBlur = null;
            presenter.onFocus = null;
            presenter.onInit = null;
            presenter.setIframeHeight = null;
            presenter.destroy = null;
            presenter.tinyMceContainer = null;
            presenter.editor = null;
            presenter.playerController = null;
            presenter.LANGUAGES = null;
            presenter.setWrapperID = null;
        } catch (e) {
            // In case that the first layout is different than the default one
            // the addon may not fully initialize before onDestroy is called
        }
    };

    presenter.addPlugins = function AddonParagraph_addPlugins() {
        if (presenter.configuration.isPlaceholderSet) {
            presenter.addPlaceholderPlugin();
        }
    };

    presenter.makePluginName = function AddonParagraph_makePluginName(addonID) {
        var name = 'placeholder';
        addonID.replace(/[a-z0-9]+/gi, function(x) {
            name += "_" + x;
        });

        return name;
    };

     presenter.onFocus = function AddonParagraph_onFocus() {
        if (presenter.placeholder.isSet) {
            presenter.placeholder.removePlaceholder();
            presenter.placeholder.shouldBeSet = (presenter.placeholder.getEditorContent() == "");
        }
    };

     presenter.onBlur = function AddonParagraph_onBlur() {
        if (presenter.placeholder.shouldBeSet) {
            presenter.placeholder.addPlaceholder();
        } else {
            presenter.placeholder.removePlaceholder();
        }
    };

    presenter.addPlaceholderPlugin = function AddonParagraph_addPlaceholderPlugin() {
        tinymce.PluginManager.add(presenter.configuration.pluginName, function(editor) {
            editor.on('init', function () {
                presenter.placeholder.init(editor.id);
                editor.on('blur', presenter.onBlur);
                editor.on('focus', presenter.onFocus);
            });
        });
    };

    presenter.placeholderElement = function AddonParagraph_placeholderElement() {
        this.isSet = true;
        this.shouldBeSet = false;
        this.placeholderText = presenter.configuration.isPlaceholderEditable ? "" : presenter.configuration.placeholderText;
        this.contentAreaContainer = null;
        this.el = null;
        this.attrs = {style: {position: 'absolute', top:'5px', left:0, color: '#888', padding: '1%', width:'98%', overflow: 'hidden'} };
    };

    presenter.placeholderElement.prototype.init = function AddonParagraph_placeholderElement_init() {
        this.contentAreaContainer = presenter.editor.getBody();
        this.el = presenter.editor.dom.add(this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);

        tinymce.DOM.setStyle(this.contentAreaContainer, 'position', 'relative');
        tinymce.DOM.addClass(this.el, "placeholder");
    };

    presenter.placeholderElement.prototype.addPlaceholder = function AddonParagraph_addPlaceholder() {
        this.el = presenter.editor.dom.add(this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);
        presenter.editor.dom.addClass(this.el, "placeholder");
        this.isSet = true;
        presenter.setStyles();
    };

    presenter.placeholderElement.prototype.setPlaceholderAfterEditorChange = function AddonParagraph_setPlaceholderAfterEditorChange() {
        if (this.getEditorContent() == "") {
            this.shouldBeSet = true;
        } else {
            this.shouldBeSet = false;
            this.removePlaceholder();
        }
    };

    presenter.placeholderElement.prototype.removePlaceholder = function AddonParagraph_removePlaceholder() {
        this.isSet = false;
        presenter.editor.dom.remove(this.el);
    };

    presenter.placeholderElement.prototype.getEditorContent = function AddonParagraph_getEditorContent() {
        return presenter.editor.getContent();
    };

    presenter.onTinymceChange = function AddonParagraph_onTinymceChange(editor, event) {
        if (presenter.configuration.isPlaceholderSet) {
            presenter.placeholder.setPlaceholderAfterEditorChange();
        }
    };

     presenter.getSpecifyToolbar = function AddonParagraph_getSpecifyToolbar(language) {
        var toolbar = "";

        if (language === "French") {
            toolbar = "customBold customItalic customUnderline numlist bullist alignleft aligncenter alignright alignjustify";
        }

        return toolbar;
    };

     presenter.addStylesToButton =  function AddonParagraph_addStylesToButton() {
        var boldButton = presenter.$view.find("[aria-label='" + presenter.getButton("Bold").title + "'] button"),
            italicButton = presenter.$view.find("[aria-label='" + presenter.getButton("Italic").title + "'] button"),
            underlineButton = presenter.$view.find("[aria-label='" + presenter.getButton("Underline").title + "'] button");

        boldButton.css({'font-family': 'tinymce', 'font-size': '18px', 'font-weight': 'bold'});
        italicButton.css({'font-family': 'tinymce', 'font-size': '18px', 'font-weight': 'bold', 'font-style': 'italic'});
        underlineButton.css({'font-family': 'tinymce', 'font-size': '18px', 'font-weight': 'bold', 'text-decoration': 'underline'});
    };

     presenter.getButton = function AddonParagraph_getButton(type) {
        var layoutLanguage = presenter.configuration.layoutType;

        var french = {
            Bold: {
                text: '\u0047',
                title: 'Bold'
            },
            Underline: {
                text: 'S',
                title: 'Underline'
            },
            Italic: {
                text: 'I',
                title: 'Italic'
            }
        };

        var languages = {
            French: french
        };

        return languages[layoutLanguage][type];
    };

     presenter.createButton = function AddonParagraph_createButton(editor, type) {
        var button = presenter.getButton(type);

        return {
            text: button.text,
            title: button.title,
            icon: false,
            onclick: function() {
                editor.execCommand(type);
            }
        };
    };

    presenter.setup = function AddonParagraph_setup(ed) {
        if (presenter.editor == null) {
            presenter.editor = ed;
        }

        ed.on("NodeChange", presenter.onNodeChange);
        ed.on("keyup", presenter.onTinymceChange);
        if (presenter.configuration.layoutType === "French") {
            ed.addButton('customBold', presenter.createButton(this, "Bold"));
            ed.addButton('customItalic', presenter.createButton(this, "Italic"));
            ed.addButton('customUnderline', presenter.createButton(this, "Underline"));
        }
    };

    presenter.onNodeChange = function AddonParagraph_onNodeChange() {
        presenter.setStyles();
    };

    presenter.setStyles = function AddonParagraph_setStyles() {
        if (presenter.editor == null) {
            return;
        }

        var hasDefaultFontFamily = presenter.configuration.hasDefaultFontFamily,
            hasDefaultFontSize = presenter.configuration.hasDefaultFontSize,
            hasContentCss = !ModelValidationUtils.isStringEmpty(presenter.configuration.content_css);

        if (!hasDefaultFontFamily || !hasDefaultFontSize || !hasContentCss) {
            var elements = [ presenter.editor.dom.$('p'), presenter.editor.dom.$('ol'), presenter.editor.dom.$('ul'), presenter.editor.dom.$("placeholder")];

            for (var i = 0; i < elements.length; i++) {
                if (elements[i].length == 0) {
                    continue;
                }

                if (!hasDefaultFontFamily || !hasContentCss) {
                    elements[i].css('font-family', presenter.configuration.fontFamily);
                }

                if (!hasDefaultFontSize || !hasContentCss) {
                    elements[i].css('font-size', presenter.configuration.fontSize);
                }
            }
        }
    };

    presenter.setIframeHeight = function AddonParagraph_setIframeHeight() {
        if (presenter.$view == null) {
            return;
        }

        var $editor = presenter.$view.find('#' + presenter.editor.id + '_ifr'),
            editorHeight = presenter.$view.height();

        if (!presenter.configuration.isToolbarHidden) {
            //setTimouts for checking if height of the toolbar changed
            presenter.toolbarChangeHeightTimeoutID = setTimeout(function () {
                var lastHeight = presenter.$view.find('.mce-toolbar').height(),
                    newHeight,
                    counter = 0,
                    originalEditorHeight = editorHeight;

                editorHeight -= presenter.$view.find('.mce-toolbar').height();
                $editor.height(editorHeight);
                (function checkHeight(){
                    newHeight = presenter.$view.find('.mce-toolbar').height();
                    if(lastHeight !== newHeight) {
                        var height = originalEditorHeight - presenter.$view.find('.mce-toolbar').height();
                        $editor.height(height);
                    }
                    lastHeight = newHeight;

                    if(presenter.toolbarChangeHeightTimeoutID) {
                        clearTimeout(presenter.toolbarChangeHeightTimeoutID);
                    }

                    counter++;
                    if(counter < 3) {
                        presenter.toolbarChangeHeightTimeoutID = setTimeout(checkHeight, 500);
                    }
                })();
            }, 0);
        } else {
            $editor.height(editorHeight);
        }
    };

    presenter.onInit = function AddonParagraph_onInit() {
        if (presenter.configuration.isToolbarHidden) {
            presenter.$view.find('.mce-container.mce-panel.mce-first').remove();
            presenter.$view.find('.mce-edit-area').css('border-top-width', '0');
        }

        presenter.jQueryTinyMCEHTML = $(presenter.editor.dom.select('html'));
        presenter.jQueryTinyMCEHTML.click(function editorDOMSelectClick() {
            presenter.editor.contentWindow.focus();
            $(presenter.editor.contentDocument).find('body').focus();
        });

        presenter.editor.dom.loadCSS(DOMOperationsUtils.getResourceFullPath(presenter.playerController, "addons/resources/style.css"));
        presenter.editor.dom.$("body").css("height", "100%");

        presenter.setStyles();
        if (presenter.configuration.state !== undefined) {
            presenter.editor.setContent(presenter.configuration.state, {format : 'raw'});
            presenter.configuration.state = undefined;
            presenter.setVisibility(presenter.isVisibleValue);
        } else {
            presenter.setVisibility(presenter.configuration.isVisible);
        }

        presenter.$tinyMCEToolbar = presenter.$view.find('.mce-toolbar');
        presenter.setIframeHeight();

        presenter.tinyMceContainer = presenter.$view.find('.mce-container.mce-panel.mce-tinymce');
        presenter.tinyMceContainer.css('border', 0);


        if (presenter.configuration.layoutType === "French") {
            presenter.addStylesToButton();
        }

        if (presenter.configuration.isPlaceholderEditable && presenter.state == null) {
            presenter.setText(presenter.configuration.placeholderText);
        }

        presenter.addEventListenerOnKeyEscapeToEditorMCE();
    };

    presenter.addEventListenerOnKeyEscapeToEditorMCE = function EditableWindow_addEventListenerOnKeyEscapeToEditorMCE (){
        const mceIframe = presenter.$view.find('.mce-edit-area')[0].childNodes[0];
        const content = (mceIframe.contentDocument || mceIframe.contentWindow.document).documentElement;
        const escapeKeyCallback = function (e) {
            if (e.keyCode === presenter.keys.ESCAPE && presenter.keyboardControllerObject.keyboardNavigationActive) {
                presenter.dispatchEscapeKeydownEvent();
                document.activeElement.blur();
            }
        };

        content.addEventListener("keydown", escapeKeyCallback);
    };

    presenter.dispatchEscapeKeydownEvent = function EditableWindow_dispatchEscapeKeydownEvent () {
        const event = new KeyboardEvent('keydown', {
            code: 'Escape',
            key: 'Escape',
            charCode: presenter.keys.ESCAPE,
            keyCode: presenter.keys.ESCAPE,
            bubbles: true
        });
        document.body.dispatchEvent(event);
    };

    presenter.setPlayerController = function AddonParagraph_setPlayerController(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.currentPageIndex = presenter.playerController.getCurrentPageIndex();
        presenter.pageID = presenter.playerController.getPresentation().getPage(presenter.currentPageIndex).getId();
    };

    presenter.getState = function AddonParagraph_getState() {
        var tinymceState;
        if (presenter.configuration.state !== undefined) {
            tinymceState = presenter.configuration.state;
        } else if (presenter.editor != undefined && presenter.editor.hasOwnProperty("id")) {
            try{
                const isShowAnswersActive = presenter.isShowAnswersActive;
                if (isShowAnswersActive) presenter.hideAnswers();
                tinymceState = presenter.editor.getContent({format : 'raw'});
                if (isShowAnswersActive) presenter.showAnswers();
            }catch(err) {
                return  presenter.state;
            }
        } else {
            tinymceState = '';
        }

        return JSON.stringify({
            'tinymceState' : tinymceState,
            'isVisible' : presenter.isVisibleValue,
            'isLocked' : presenter.isLocked
        });
    };

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.printableState = JSON.parse(state).tinymceState;
    };

    presenter.setState = function AddonParagraph_setState(state) {
        var parsedState = JSON.parse(state),
            tinymceState = parsedState.tinymceState;

        presenter.isVisibleValue = parsedState.isVisible;
        if (presenter.editor != null && presenter.editor.initialized && presenter.isEditorLoaded) {
            presenter.setVisibility(presenter.isVisibleValue);
        }

        if (tinymceState!=undefined && tinymceState!="" && !isPlaceholderClassInHTML(tinymceState)) {
            if (presenter.editor != null && presenter.editor.initialized && presenter.isEditorLoaded) {
                presenter.editor.setContent(tinymceState, {format: 'raw'});
                presenter.state = state;
            } else {
                presenter.configuration.state = tinymceState;
                presenter.state = state;
            }
        }

        if (parsedState.isLocked) {
            presenter.lock();
        } else {
            presenter.unlock();
        }
    };

    function isPlaceholderClassInHTML (html) {
        return html.indexOf("class=\"placeholder\"") !== -1;
    }

    presenter.reset = function AddonParagraph_reset() {
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.placeholder.removePlaceholder();
        if (presenter.configuration.isPlaceholderEditable) {
            presenter.setText(presenter.configuration.placeholderText);
        } else {
            presenter.editor.setContent('');
            presenter.setStyles();
        }
        presenter.placeholder.addPlaceholder();
        if (presenter.isLocked) {
            presenter.unlock();
        }
    };

    presenter.show = function AddonParagraph_show() {
        presenter.setVisibility(true);
    };

    presenter.hide = function AddonParagraph_hide() {
        presenter.setVisibility(false);
    };

    presenter.isVisible = function AddonParagraph_isVisible() {
        return presenter.isVisibleValue;
    };

    presenter.setText = function(text) {
        if (presenter.editor != null && presenter.editor.initialized) {
            if (Array.isArray(text)) {
                presenter.editor.setContent(text[0]);
            } else if (typeof text === 'string' || text instanceof String) {
                presenter.editor.setContent(text);
            }
        }
    };

    presenter.lock = function AddonParagraph_lock() {
        if (!presenter.isLocked) {
            var mask = $('<div>').addClass('paragraph-lock');
            presenter.$view.find('#' + presenter.configuration.ID + '-wrapper').append(mask);
            presenter.isLocked = true;
        }
    };

    presenter.unlock = function AddonParagraph_unlock() {
        if (presenter.isLocked) {
            presenter.$view.find('.paragraph-lock').remove();
            presenter.isLocked = false;
        }
    };

    presenter.getPrintableHTML = function (model, showAnswers) {
        var model = presenter.upgradeModel(model);
        var configuration = presenter.validateModel(model, false);
        var modelAnswers = configuration.modelAnswer;

        var $wrapper = $('<div></div>');
        $wrapper.addClass('printable_addon_Paragraph');
        $wrapper.css("left", "0px");
        $wrapper.css("right", "0px");
        $wrapper.css("height", configuration.height + "px");
        $wrapper.css("padding", "10px 10px 10px 0px");
        var $paragraph = $('<div></div>');
        $paragraph.css("left", "0px");
        $paragraph.css("right", "0px");
        $paragraph.css("height", "100%");
        $paragraph.css("border", "1px solid");
        $paragraph.css("padding", "10px");

        var innerText = "";
        if (showAnswers) {
            modelAnswers.forEach((answer) => {
                innerText += answer.Text += "<div></div><br>";
            });
        }
        if (presenter.printableState) {
            innerText = presenter.printableState;
        }
        $paragraph.html(innerText);

        $wrapper.append($paragraph);
        return $wrapper[0].outerHTML;
    };

    presenter.getOpenEndedContent = function () {
        return presenter.getText();
    }

    presenter.getScoreWithMetadata = function() {
        return [{
            userAnswer: presenter.getText(),
            isCorrect: true
        }];
    }

    presenter.didUserAnswer = function (usersAnswer) {
        var parsedAnswer = usersAnswer.replace(/<(.*?)>/g, '').replace(/&nbsp;/g, '');
        return !!parsedAnswer;
    };
    
    function ParagraphKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    ParagraphKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    ParagraphKeyboardController.prototype.constructor = ParagraphKeyboardController;

    presenter.buildKeyboardController = function Paragraph_buildKeyboardController () {
        presenter.keyboardControllerObject = new ParagraphKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.getElementsForKeyboardNavigation = function Paragraph_getElementsForKeyboardNavigation() {
        return this.$view.find(".mce-btn, .mce-edit-area");
    };

    presenter.keyboardController = function Paragraph_keyboardController (keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    ParagraphKeyboardController.prototype.selectAction = function () {
        if (presenter.isShowAnswersActive
            || presenter.isGradualShowAnswersActive
            || presenter.isErrorCheckingMode) {
            return;
        }

        const el = this.getTarget(this.keyboardNavigationCurrentElement, true);
        if (el.hasClass("mce-edit-area")) {
            presenter.editor.execCommand('mceCodeEditor');
        } else {
            el[0].click();
            document.activeElement.blur();
            presenter.speakSelectedOnAction(el);
        }
        this.mark(this.keyboardNavigationCurrentElement);
    };

    presenter.speakSelectedOnAction = function Paragraph_speakSelectedOnAction (el) {
        if (el.hasClass("mce-active")) {
            presenter.speak(presenter.speechTexts.selected);
        } else {
            presenter.speak(presenter.speechTexts.deselected);
        }
    };

    ParagraphKeyboardController.prototype.mark = function (element) {
        var target = this.getTarget(element, false);
        target.addClass('keyboard_navigation_active_element_important');
        if (target.hasClass("mce-edit-area")) {
            target.addClass('keyboard-navigation-margin');
        }
    };

    ParagraphKeyboardController.prototype.unmark = function (element) {
        var target = this.getTarget(element, false);
        target.removeClass('keyboard_navigation_active_element_important');
        if (target.hasClass("mce-edit-area")) {
            target.removeClass('keyboard-navigation-margin');
        }
    };

    ParagraphKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    ParagraphKeyboardController.prototype.switchElement = function (move) {
        KeyboardController.prototype.switchElement.call(this, move);
        this.readCurrentElement();
    };

    ParagraphKeyboardController.prototype.enter = function (event) {
        KeyboardController.prototype.enter.call(this, event);
        this.readCurrentElement();
    };

    ParagraphKeyboardController.prototype.readCurrentElement = function () {
        const element = this.getTarget(this.keyboardNavigationCurrentElement, false);
        let ariaLabel = element[0].getAttribute("aria-label");
        let text = "";
        if (element.hasClass("mce-btn") && ariaLabel) {
            const label = ariaLabel.toLowerCase().replace(/\s/gm, "");
            const ttsKey = presenter.TOOLBAR_ARIAS[label];
            if (ttsKey) {
                text = presenter.speechTexts[ttsKey];
            } else {
                text = ariaLabel;
            }
            text = element.hasClass("mce-active") ? `${text} ${presenter.speechTexts.selected}` : text;
        } else if (element.hasClass("mce-edit-area")) {
            let contentToRead = $(presenter.editor.getContent({format : 'html'}));
            if (contentToRead.text().trim().length === 0) {
                text = presenter.speechTexts.paragraphContent;
            } else {
                text = TTSUtils.getTextVoiceArrayFromElement(contentToRead, presenter.configuration.langTag);
            }
        } else {
            let content;
            try {
                content = element[0].textContent;
            } catch (error) {
                console.error(error);
                content = "element";
            }
            text = content;
        }

        presenter.speak(text);
    };

    presenter.speak = function Paragraph_speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.setWCAGStatus = function Paragraph_setWCAGStatus(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.getTextToSpeechOrNull = function Paragraph_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.getActivitiesCount = function Paragraph_getActivitiesCount () {
        let answersCount = 0;
        presenter.configuration.modelAnswer.forEach(answer => {
            if (answer.Text.replace("<br>", "") !== "") {
                answersCount++;
            }
        });
        return answersCount;
    };

    presenter.getScore = function () {
        if (!presenter.configuration.isValid
            || !presenter.configuration.manualGrading
            || !presenter.playerController
        ) {
            return 0;
        }
        return OpenActivitiesUtils.getOpenActivityScore(
            presenter.playerController,
            presenter.pageID,
            presenter.configuration.ID
        );
    };

    presenter.getMaxScore = function () {
        if (!presenter.configuration.isValid || !presenter.configuration.manualGrading) {
            return 0;
        }
        return presenter.configuration.weight;
    };

    presenter.getErrorCount = function(){
        return 0;
    };

    presenter.isAIReady = function() {
        if (!presenter.configuration.isValid
            || !presenter.configuration.manualGrading
            || !presenter.playerController
        ) {
            return false;
        }
        return OpenActivitiesUtils.isAIReady(
            presenter.playerController,
            presenter.pageID,
            presenter.configuration.ID
        );
    };

    return presenter;
}

AddonParagraph_create.__supported_player_options__ = {
    interfaceVersion: 2
};
