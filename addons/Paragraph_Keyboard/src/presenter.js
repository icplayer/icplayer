function AddonParagraph_Keyboard_create() {
    var presenter = function () {};
    
    var userAnswerAIReviewRequest = 'gradeByAi';
    var userAnswerAIReviewResponse = 'aiGraded';

    presenter.placeholder = null;
    presenter.editor = null;
    presenter.window = null;
    presenter.isVisibleValue = null;
    presenter.view = null;
    presenter.configuration = null;
    presenter.$view = null;
    presenter.jQueryTinyMCEHTML = null;
    presenter.$tinyMCEToolbar = null;
    presenter.$TinyMCEBody = null;
    presenter.cachedAnswer = [];
    presenter.isShowAnswersActive = false;
    presenter.eKeyboardButtons = [];
    presenter.isEditorLoaded = false;
    presenter.currentPageIndex = null;
    presenter.isWaitingForAIGrade = false;
    presenter.aiGradeInterval = null;
    presenter.MAX_WAIT_TIME = 15;
    presenter.startTime = null;
    presenter.updateScoreEventName = 'updateScore';
    presenter.eventBus = null;
    presenter.textParser = null;
    presenter.altTextsMap = null;

    var checkHeightCounter = 0;

    presenter.DEFAULTS = {
        TOOLBAR: 'bold italic underline numlist bullist alignleft aligncenter alignright alignjustify',
        FONT_FAMILY: 'Verdana,Arial,Helvetica,sans-serif',
        FONT_SIZE: '11px',
        BUTTON_WIDTH: 37,
        FORMAT_WIDTH: 85,
        STYLE_SELECT_NAME: "styleselect",
    };

    presenter.ALLOWED_TOOLBAR_BUTTONS = 'customBold customUnderline customItalic newdocument bold italic underline strikethrough alignleft aligncenter '+
        'alignright alignjustify styleselect formatselect fontselect fontsizeselect '+
        'bullist numlist outdent indent blockquote undo redo '+
        'removeformat subscript superscript forecolor backcolor |'.split(' ');

    presenter.ERROR_CODES = {
        'defaultLayoutError' : 'Custom Keyboard Layout should be a JavaScript object with at least "default" property ' +
            'which should be an array of strings with space-seperated chars.',
        'W_01' : 'Weight must be a whole number between 0 and 100',
        'W_02': 'Occurs a problem with checking your answers. Please try later.'
    };

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
        justify: "justify",
        shift: "shift"
    };

    presenter.CSS_CLASSES = {
        MCE_EDIT_AREA: "mce-edit-area",
        MCE_BUTTON: "mce-btn",
        MCE_ACTIVE: "mce-active",
        KEYBOARD_LETTER: "paragraph-keyboard-letter",
        KEYBOARD_SHIFT: "paragraph-keyboard-shift",
    };

    presenter.validateType = function AddonParagraph_Keyboard_validateType(rawType) {
        if (!rawType || rawType.length == 0) {
            return 'french (special characters)';
        }

        return rawType.toLowerCase();
    };

    presenter.setVisibility = function AddonParagraph_Keyboard_setVisibility(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        if (isVisible) {
            presenter.$view.find(".paragraph-keyboard-wrapper").show();
        } else {
            presenter.$view.find(".paragraph-keyboard-wrapper").hide();
        }

        presenter.isVisibleValue = isVisible;
    };

    presenter.createPreview = function AddonParagraph_Keyboard_createPreview(view, model) {
        presenter.initializeEditor(view, model, true);
        presenter.setVisibility(true);
        var clickhandler = $("<div></div>").css({"background":"transparent", 'width': '100%', 'height': '100%', 'position':'absolute', 'top':0, 'left':0});
        presenter.$view.append(clickhandler);
    };

    presenter.setEventBus = function (wrappedEventBus) {
        presenter.eventBus = wrappedEventBus;

        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
        presenter.eventBus.addEventListener('GradualShowAnswers', this);
        presenter.eventBus.addEventListener('GradualHideAnswers', this);
        presenter.eventBus.addEventListener('ValueChanged', this);
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

            case "ValueChanged":
                presenter.handleUpdateScoreEvent(eventData);
                break;
        }
    };

    presenter.getActivitiesCount = function () {
        return 1;
    }

    presenter.enableEdit = function () {
        const paragraphKeyboard = presenter.$view.find(".paragraph-keyboard-wrapper");

        if(paragraphKeyboard.hasClass('disabled')) {
            paragraphKeyboard.removeClass('disabled');
        }
    }

    presenter.disableEdit = function () {
        const paragraphKeyboard = presenter.$view.find(".paragraph-keyboard-wrapper");

        if(!paragraphKeyboard.hasClass('disabled')) {
            paragraphKeyboard.addClass('disabled');
        }
    }

    presenter.showAnswers = function () {
        if (presenter.isShowAnswersActive) return;

        const elements = presenter.getParagraphs();

        presenter.disableEdit();
        presenter.isShowAnswersActive = true;

        for (let [key, value] of Object.entries(elements)) {
            if (+key > -1) {
                presenter.cachedAnswer.push(value.innerHTML);
                if (+key === 0) {
                    value.innerHTML = presenter.configuration.modelAnswer;
                } else {
                    value.innerHTML = '';
                }
            }
        }
    }

    presenter.hideAnswers = function () {
        const elements = presenter.getParagraphs();

        presenter.enableEdit();
        presenter.isShowAnswersActive = false;

        if (presenter.cachedAnswer.length) {
            for (let [key, value] of Object.entries(elements)) {
                if (+key > -1) {
                    value.innerHTML = presenter.cachedAnswer[+key];
                }
            }
            presenter.cachedAnswer = [];
        }
    }

    presenter.gradualShowAnswers = function (data) {
        presenter.disableEdit();
        if (data.moduleID !== presenter.configuration.ID) return;
        presenter.showAnswers();
    };

    presenter.sendUserAnswerToAICheck = function () {
        if(!presenter.isAIReady() || presenter.isWaitingForAIGrade) { return; }

        const data = presenter.getDataRequestToAI();

        window.addEventListener("message", presenter.onExternalMessage);
        presenter.playerController.sendExternalEvent(userAnswerAIReviewRequest, data);
        presenter.isWaitingForAIGrade = true;
        presenter.waitForAIGrade();
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
        if (!isAIResponse) { return isAIResponse; }

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
        const aiGrade = parsedData.ai_grade;
        const aiRelevance = parsedData.ai_relevance;

        OpenActivitiesUtils.updateOpenActivityScore(
            presenter.playerController,
            pageID,
            activityID,
            aiGrade,
            aiRelevance
        );
    };

    presenter.setShowErrorsMode = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
    };

    presenter.setWorkMode = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
    };

    presenter.getParagraphs = function () {
        const paragraph = presenter.$view.find(".paragraph-wrapper"),
            iframe = paragraph.find("iframe"),
            body = $(iframe).contents().find("#tinymce");

        return body.find("p");
    };

    presenter.run = function AddonParagraph_Keyboard_run(view, model) {
        presenter.initializeEditor(view, model, false);
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.isLocked = false;
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

    function pasteHtmlAtCaret(html, wnd, ownerDocument) {
        var sel, range;
        if (wnd.getSelection) {
            // IE9 and non-IE
            sel = wnd.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;

                // fix for IE
                if (ownerDocument) {
                    frag = ownerDocument.createDocumentFragment()
                }

                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

     function transposeLayout(layout){
        var newLayout = {};
        $.each(layout, function(name,keyset){
            var ar = [];
            for (var i=0; i < keyset.length; i++) {
                var row = keyset[i].split(' ');
                for (var j=0; j < row.length; j++) {
                    if (!ar[j]) ar[j] = [];
                    ar[j][i] = row[j];
                }
            }
            for (var k=0; k < ar.length; k++) {
                ar[k] = ar[k].join(' ');
            }
            newLayout[name] = ar;
        });
        return newLayout;
    }

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
    presenter.parseModel = function AddonParagraph_Keyboard_parseModel(model, isPreview) {
        var fontFamily = model['Default font family'],
            fontSize = model['Default font size'],
            isToolbarHidden = ModelValidationUtils.validateBoolean(model['Hide toolbar']),
            isPlaceholderEditable = ModelValidationUtils.validateBoolean(model['Editable placeholder']),
            toolbar = presenter.validateToolbar(model['Custom toolbar'], model["Width"]),
            height = model.Height,
            hasDefaultFontFamily = false,
            hasDefaultFontSize = false,
            keyboardPosition = model['keyboardPosition'] ? model['keyboardPosition'].toLowerCase() : 'bottom',
            layoutType = presenter.validateType(model['layoutType']),
            keyboardLayout = model['keyboardLayout'],
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

        height -= !isToolbarHidden ? 37 : 2;

        const validatedWeight = presenter.validateWeight(weight, isPreview);
        if (!validatedWeight.isValid) {
            return validatedWeight;
        }

        const supportedPositions = ['top', 'bottom', 'custom', 'left', 'right'];
        if (supportedPositions.indexOf(keyboardPosition) === -1) {
            keyboardPosition = 'bottom';
        }

        const validatedLayout = presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);
        if (!validatedLayout.isValid) {
            return validatedLayout;
        }

        return {
            ID: model["ID"],
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isValid: true,

            fontFamily: fontFamily,
            fontSize: fontSize,
            isToolbarHidden: isToolbarHidden,
            toolbar: toolbar,
            textAreaHeight: height,
            paragraphHeight: model.Height,
            width: model['Width'],
            hasDefaultFontFamily: hasDefaultFontFamily,
            hasDefaultFontSize: hasDefaultFontSize,
            content_css: model['Custom CSS'],
            useCustomCSSFiles: ModelValidationUtils.validateBoolean(model["useCustomCSSFiles"]),
            isPlaceholderSet: !ModelValidationUtils.isStringEmpty(model["Placeholder Text"]),
            placeholderText: model["Placeholder Text"],
            isPlaceholderEditable: isPlaceholderEditable,
            pluginName: presenter.makePluginName(model["ID"]),
            keyboardLayout: validatedLayout.value,
            keyboardPosition: keyboardPosition,
            manualGrading: manualGrading,
            title: title,
            weight: validatedWeight.value,
            modelAnswer: modelAnswer,
            langTag: model["langAttribute"]
        };
    };

    presenter.validateLayout = function (keyboardLayout, layoutType, keyboardPosition) {
        if (presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType]) {
            keyboardLayout = presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType];
        }

        const altTextsMap = {};
        if (keyboardLayout.length > 0) {
            keyboardLayout = replaceAltText(keyboardLayout, altTextsMap);
            try {
                eval('keyboardLayout = ' + keyboardLayout);
            } catch(e) {
                presenter.ERROR_CODES['evaluationError'] = 'Custom keyboard layout parsing error: ' + e.message;
                return ModelErrorUtils.getErrorObject('evaluationError');
            }
        }

        if (!Array.isArray(keyboardLayout['default']) || keyboardLayout['default'].length < 1) {
            return ModelErrorUtils.getErrorObject('defaultLayoutError');
        }

        if (['left', 'right'].includes(keyboardPosition)) {
            keyboardLayout = transposeLayout(keyboardLayout);
        }

        for (let [set, keyset]of Object.entries(keyboardLayout)) {
            let parsedKeyset = [];
            for ( let rowIndex = 0; rowIndex < keyset.length; rowIndex++ ){
                const parsedKeysetRow = [];
                let currentKeysetRow = keyset[rowIndex];
                currentKeysetRow = $.trim(currentKeysetRow);
                const keys = currentKeysetRow.split(/\s+/);

                for ( let keyIndex = 0; keyIndex < keys.length; keyIndex++ ) {
                    const key = keys[keyIndex];
                    if (hasMoreThenOneAltText(key)) {
                        presenter.ERROR_CODES['evaluationError'] = 'Alt texts should be separated by space';
                        return ModelErrorUtils.getErrorObject('evaluationError');
                    }
                    if (altTextsMap[key] !== undefined) {
                        if (hasWhiteSpace(altTextsMap[key].contents)) {
                            presenter.ERROR_CODES['evaluationError'] = 'Text with alternative text has white space: ' + altTextsMap[key].match;
                            return ModelErrorUtils.getErrorObject('evaluationError');
                        }
                        parsedKeysetRow.push(altTextsMap[key].match);
                    } else {
                        parsedKeysetRow.push(key);
                    }
                }
                parsedKeyset.push(parsedKeysetRow);
            }
            keyboardLayout[set] = parsedKeyset;
        }

         return {
            isValid: true,
            value: keyboardLayout,
            errorCode: ''
        };
    };

    function replaceAltText (text, altTextsMap) {
        let altTextIndex = 0;
        return text.replace(/\\alt{([^{}|]*?)\|[^{}|]*?}(\[[a-zA-Z0-9_\- ]*?\])*/g, function (match, contents, offset, string, groups) {
            altTextIndex++;
            const newIndex = "{altText" + altTextIndex + "}";
            altTextsMap[newIndex] = {
                match: match,
                contents: contents.trim()
            };
            return newIndex;
        });
    }

    function hasWhiteSpace(s) {
        return /\s/g.test(s);
    }

    function hasMoreThenOneAltText(s) {
        return (s.match(new RegExp(/\{altText[0-9]+\}/, "g")) || []).length > 1;
    }

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

    presenter.setWrapperID = function AddonParagraph_Keyboard_setWrapperID() {
        var $paragraphWrapper = presenter.$view.find('.paragraph-wrapper');
        $paragraphWrapper.attr('id', presenter.configuration.ID + '-wrapper');
    };

    presenter.upgradeAttribute = function (model, attrName, defaultValue) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (model[attrName] == undefined) {
            upgradedModel[attrName] = defaultValue;
        }

        return upgradedModel;
    };

    presenter.getPlugins = function AddonParagraph_Keyboard_getPlugins() {
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
        let upgradedModel = presenter.upgradeTitle(model);
        upgradedModel = presenter.upgradeManualGrading(upgradedModel);
        upgradedModel = presenter.upgradeWeight(upgradedModel);
        upgradedModel = presenter.upgradeModelAnswer(upgradedModel);
        upgradedModel = presenter.upgradePlaceholderText(upgradedModel);
        upgradedModel = presenter.upgradeEditablePlaceholder(upgradedModel);
        upgradedModel = presenter.upgradeUseCustomCSSFiles(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
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
        return presenter.upgradeAttribute(model, "Show Answers", "");
    };

    presenter.upgradeUseCustomCSSFiles = function (model) {
        return presenter.upgradeAttribute(model, "useCustomCSSFiles", "False");
    };

    presenter.upgradeLangTag = function (model) {
        return presenter.upgradeAttribute(model, "langAttribute", "");
    };

    presenter.upgradeSpeechTexts = function (model) {
        const defaultValue = {
            Selected: {Selected: ""},
            Deselected: {Deselected: ""},
            ParagraphContent: {ParagraphContent: ""},
            Bold: {Bold: ""},
            Italic: {Italic: ""},
            Underline: {Underline: ""},
            AlignLeft: {AlignLeft: ""},
            AlignCenter: {AlignCenter: ""},
            AlignRight: {AlignRight: ""},
            Justify: {Justify: ""}
        };

        const upgradedModel =  presenter.upgradeAttribute(model, "speechTexts", defaultValue);
        if (!upgradedModel.speechTexts.hasOwnProperty("Shift")) {
            upgradedModel.speechTexts.Shift = {Shift: ""};
        }

        return upgradedModel;
    };


    presenter.setSpeechTexts = function (speechTexts) {
        presenter.speechTexts = {
            ...presenter.DEFAULT_TTS_PHRASES
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
                presenter.speechTexts.justify),
            shift: TTSUtils.getSpeechTextProperty(
                speechTexts.Shift.Shift,
                presenter.speechTexts.shift),
        };
    };

    presenter.initializeEditor = function AddonParagraph_Keyboard_initializeEditor(view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.isPreview = isPreview;
        const upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.parseModel(upgradedModel, isPreview);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }
        presenter.setSpeechTexts(upgradedModel["speechTexts"]);

        presenter.$view.on('click', function(e){
            e.stopPropagation();
            e.preventDefault();
        });

        presenter.setWrapperID();

        presenter.initTinymce();
    };

    presenter.initTinymce = function () {
        if (presenter.isPreview || !presenter.configuration.useCustomCSSFiles || !presenter.configuration.content_css) {
            presenter.initTinymceWithoutParsingContentCSS();
        } else {
            presenter.initTinymceWithParsingContentCSS();
        }
    };

    presenter.initTinymceWithoutParsingContentCSS = function () {
        _initTinymce(presenter.configuration.content_css);
    };

    presenter.initTinymceWithParsingContentCSS = function () {
        presenter.$view.css("visibility", "hidden");
        URLUtils.parseCSSFile(presenter.playerController, presenter.configuration.content_css)
            .then((newCSSText) => {
                const newCSS = new File(
                    [newCSSText],
                    `parsed ${presenter.configuration.content_css}.css`,
                    {type: "text/css"}
                );
                return URL.createObjectURL(newCSS);
            }).then((contentCSSURL) => {
                _initTinymce(contentCSSURL);
            }).catch(() => {
                console.warn(`Failed to download assets provided in "Custom CSS" file for Paragraph Keyboard ${presenter.configuration.ID} addon`);
            });
    };

    function _initTinymce(contentCSSURL) {
        presenter.placeholder = new presenter.placeholderElement();
        presenter.configuration.plugins = presenter.getPlugins();
        presenter.addPlugins();

        presenter.buildKeyboard();

        presenter.calculateAndSetSizeForAddon();

        tinymce.init(presenter.getTinyMceInitConfiguration(contentCSSURL)).then(function (editors) {
            presenter.editor = editors[0];
            presenter.onInit();
            presenter.isEditorLoaded = true;
            presenter.setStyles();
            presenter.buildKeyboardController();
        });
    }

    /**
     * Calculate and set in configuration new size for addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way, and it didn't make sense
     * for prototype purpose. Also, the set of controls is static, and it could be moved to
     * configuration.
     */
    presenter.calculateAndSetSizeForAddon = function AddonParagraph_Keyboard_calculateAndSetAddonSize() {
        var $keyboard = presenter.$view.find('.paragraph-keyboard'),
            $paragraph = presenter.$view.find('.paragraph-wrapper'),
            keyboardPosition = presenter.configuration.keyboardPosition;

        if (keyboardPosition != 'custom') {

            var width, height, offset = {};

            width = parseInt($keyboard.width(), 10);
            height = parseInt($keyboard.height(), 10);
            offset.bottom = parseInt($keyboard.css('padding-bottom'), 10);
            offset.bottom += parseInt($keyboard.css('border-bottom-width'), 10);
            offset.top = parseInt($keyboard.css('padding-top'), 10);
            offset.top += parseInt($keyboard.css('border-top-width'), 10);

            offset.left = parseInt($keyboard.css('padding-left'), 10);
            offset.left += parseInt($keyboard.css('border-left-width'), 10);
            offset.right = parseInt($keyboard.css('padding-right'), 10);
            offset.right += parseInt($keyboard.css('border-right-width'), 10);

            switch (keyboardPosition) {
                case 'top':
                    presenter.configuration.paragraphHeight -= height + 2 * offset.bottom + offset.top + 1;
                    $paragraph.css('top', (height + offset.top + offset.bottom) + 'px');
                    $paragraph.width('100%');
                    break;
                case 'bottom':
                    presenter.configuration.paragraphHeight -= height + offset.bottom + 2 * offset.top - 1;
                    offset.additional = presenter.configuration.isToolbarHidden ? 1 : 0;
                    $keyboard.css('top', (presenter.configuration.paragraphHeight + offset.top - offset.additional) + 'px');
                    $paragraph.width('100%');
                    break;
                case 'left':
                    presenter.configuration.width -= width + offset.right + 1;
                    $paragraph.width(presenter.configuration.width + 'px');
                    $paragraph.css('left', (width + offset.left + offset.right) + 'px');
                    $paragraph.height('100%');
                    break;
                case 'right':
                    presenter.configuration.width -= width + offset.left + offset.right + 2;
                    $paragraph.width(presenter.configuration.width + 'px');
                    $keyboard.css('left', (presenter.configuration.width + offset.left - 1) + 'px');
                    $paragraph.height('100%');
                    break;
            }
        }
    };

    presenter.getTinyMceInitConfiguration = function AddonParagraph_Keyboard_getTinyMceConfiguration(contentCSSURL) {
        return {
            plugins: presenter.configuration.plugins,
            selector : presenter.getTinyMCESelector(),
            width: presenter.configuration.width,
            height: presenter.configuration.paragraphHeight,
            statusbar: false,
            menubar: false,
            toolbar: presenter.configuration.toolbar,
            content_css: contentCSSURL,
            setup: presenter.setup,
        };
    };

    presenter.setup = function AddonParagraph_Keyboard_setup(editor) {
        if (presenter.editor == null) {
            presenter.editor = editor;
        }

        editor.on("NodeChange", presenter.setStyles);
        editor.on("keyup", presenter.onTinymceChange);
    };

    presenter.sendOnBlurEvent = function () {
        const eventData = {
            'source': presenter.configuration.ID,
            'item': '',
            'value': 'blur',
            'score': ''
        };

        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.onDestroy = function () {
        try {
            presenter.$view.off();
        } catch (e) {
        }
        try {
            presenter.jQueryTinyMCEHTML.off();
        } catch (e) {
        }
        try {
            presenter.$tinyMCEToolbar.off();
        } catch (e) {
        }
        try {
            presenter.$TinyMCEBody.off();
        } catch (e) {
        }
        try {
            presenter.editor.destroy();
        } catch (e) {
        }
        try {
            tinymce.remove();
        } catch (e) {
        }

        tinymce.AddOnManager.PluginManager.items.length = 0;

        presenter.placeholder = null;
        presenter.$tinyMCEToolbar = null;
        presenter.jQueryTinyMCEHTML = null;
        presenter.$TinyMCEBody = null;
        presenter.configuration = null;
        presenter.$view = null;
        presenter.view = null;
        presenter.editor = null;
        presenter.tinyMceContainer = null;
        presenter.window = null;
        presenter.isVisibleValue = null;
        presenter.ERROR_CODES = null;
        presenter.DEFAULTS = null;
        presenter.LAYOUT_TO_LANGUAGE_MAPPING = null;

        presenter.setWrapperID = null;
        presenter.findIframeAndSetStyles = null;
        presenter.getSpecifyToolbar = null;
        presenter.addStylesToButton = null;
        presenter.getButton = null;
        presenter.onBlur = null;
        presenter.onFocus = null;
        presenter.onInit = null;
        presenter.setIframeHeight = null;
        presenter.setStyles = null;
        transposeLayout = null;
        pasteHtmlAtCaret = null;

        presenter.switchKeyboard = null;
        presenter.clickKeyboard = null;
        presenter.onMouseDownKeyboard = null;
        presenter.buildKeyboard = null;
        presenter.eKeyboardButtons.forEach(function ($button) {
            $button.off();
        });
        presenter.eKeyboardButtons.length = 0;
        presenter.eKeyboardButtons = null;
    };

    presenter.getTinyMCESelector = function AddonParagraph_Keyboard_getTinyMCESelector() {
        return '#' + presenter.configuration.ID + '-wrapper .paragraph_field';
    };

    presenter.setStyles = function AddonParagraph_Keyboard_setStyles() {
        if (presenter.editor == null) {
            return;
        }

        var hasDefaultFontFamily = presenter.configuration.hasDefaultFontFamily,
            hasDefaultFontSize = presenter.configuration.hasDefaultFontSize,
            hasContentCss = !ModelValidationUtils.isStringEmpty(presenter.configuration.content_css);

        if (!hasDefaultFontFamily || !hasDefaultFontSize || !hasContentCss) {
            var elements = [presenter.editor.dom.$('p'), presenter.editor.dom.$('ol'), presenter.editor.dom.$('ul'), presenter.editor.dom.$("placeholder")];

            for (var i = 0; i < elements.length; i++) {
                if (!hasDefaultFontFamily || !hasContentCss) {
                    elements[i].css('font-family', presenter.configuration.fontFamily);
                }

                if (!hasDefaultFontSize || !hasContentCss) {
                    elements[i].css('font-size', presenter.configuration.fontSize);
                }
            }
        }
    };

    presenter.setIframeHeight = function AddonParagraph_Keyboard_setIframeHeight() {
        var $editor = presenter.$view.find('#' + presenter.editor.id + '_ifr'),
            editorHeight = presenter.configuration.paragraphHeight;

        if (!presenter.configuration.isToolbarHidden) {
            editorHeight -=  presenter.$view.find('.mce-toolbar').height();
        }

        $editor.height(editorHeight);
    };


    presenter.caret = function AddonParagraph_Keyboard_caret() {
        var caretData;
        if (arguments.length) {
            caretData = arguments[0];
            presenter.window.getSelection().collapse(caretData.start.node, caretData.start.offset);
            if (caretData.range) {
                caretData.range.deleteContents();
            }
        } else {
            var selection = presenter.window.getSelection(),
                start = {
                    offset: selection.anchorOffset,
                    node: selection.anchorNode
                },
                range = false;

            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
            }

            caretData = {
                start : start,
                range: range
            };
            return caretData;
        }
    };

    presenter.clickKeyboard = function AddonParagraph_Keyboard_clickKeyboard(e){
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this),
            text = $this.text();
        const wasEditablePlaceholderSet = isEditablePlaceholderSet();

        presenter.window.focus();
        $(presenter.editor.contentDocument).find('body').focus();

        if (wasEditablePlaceholderSet) {
            setCaretOnEndOfEditorLastElement();
        }

        if (presenter.lastCaret) {
            // in IE 11 we have to set caret's position manually, because by default it is set at the beginning
            presenter.caret(presenter.lastCaret);
            pasteHtmlAtCaret(text, presenter.window, presenter.ownerDocument);
            presenter.lastCaret = presenter.caret();
        } else {
            pasteHtmlAtCaret(text, presenter.window, presenter.ownerDocument);
        }

        $this.addClass('clicked');
        window.setTimeout(function(){
            $this.removeClass('clicked');
        }, 200);
    };

    function isEditablePlaceholderSet() {
        return (presenter.placeholder.isSet
            && presenter.configuration.isPlaceholderEditable
            && presenter.configuration.isPlaceholderSet
            && !!$(presenter.getText()).text()
        );
    }

    function setCaretOnEndOfEditorLastElement() {
        var selection = presenter.window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
            var range = selection.getRangeAt(0);
            range.setStartAfter(range.endContainer);
        }
    }

    presenter.switchKeyboard = function AddonParagraph_Keyboard_switchKeyboard(e) {
        e.stopPropagation();
        e.preventDefault();
        presenter.$view.find('.keySetLayer:visible').hide();
        presenter.currentKeyboard = (presenter.currentKeyboard == 'default' ? 'shift' : 'default');
        presenter.$view.find('.keyset-' + presenter.currentKeyboard).show();
        presenter.$view.find(`.${presenter.CSS_CLASSES.KEYBOARD_SHIFT}:visible`).addClass('clicked');

        window.setTimeout(function(){
            presenter.$view.find(`.${presenter.CSS_CLASSES.KEYBOARD_SHIFT}.clicked`).removeClass('clicked');
        }, 200);

        presenter.window.focus();
        $(presenter.editor.contentDocument).find('body').focus();

        if (presenter.lastCaret) {
            presenter.caret(presenter.lastCaret);
        }
    };

    presenter.buildKeyboard = function AddonParagraph_Keyboard_buildKeyboard(){
        var keyboard = presenter.$view.find('.paragraph-keyboard'),
            row, keys, key, keyRow, $button, text, keySetLayer;
        $.each(presenter.configuration.keyboardLayout, function(set, keySet) {
            keySetLayer = $('<div>').addClass('keySetLayer');
            keySetLayer.addClass('keyset-' + set);

            for ( row = 0; row < keySet.length; row++ ){
                keys = keySet[row];

                if (!keys) {
                    continue;
                }

                keyRow = $('<div>').addClass('keyRow');
                for ( key = 0; key < keys.length; key++ ) {
                    // ignore empty keys
                    if (keys[key].length === 0) {
                        continue;
                    }

                    text = keys[key];
                    if (text == '{empty}') {
                        keyRow.append($('<div>').addClass('paragraph-keyboard-empty').html('&nbsp;'));
                    } else if (text == '{shift}') {
                        $button = $('<div>').addClass(presenter.CSS_CLASSES.KEYBOARD_SHIFT).html('&nbsp;');
                        $button.on('click', presenter.switchKeyboard);
                        keyRow.append($button);
                    } else {
                        $button = $('<div>');
                        $button.addClass(presenter.CSS_CLASSES.KEYBOARD_LETTER);
                        if (text.includes("\\alt")) {
                            const html = parseAltText(text);
                            $button.html(html);
                        } else {
                            $button.text(text);
                        }
                        $button.on('click', presenter.clickKeyboard);
                        $button.on('mousedown', presenter.onMouseDownKeyboard);
                        keyRow.append($button);
                    }

                    presenter.eKeyboardButtons.push($button);

                }
                keySetLayer.append(keyRow);
                keySetLayer.append($('<div>').addClass('keyboard-clear'));
            }
            if (set != 'default') {
                keySetLayer.hide();
            } else {
                presenter.currentKeyboard = 'default';
            }
            keyboard.append(keySetLayer);
        });
    };

    presenter.onMouseDownKeyboard = function () {
        presenter.placeholder.shouldBeSet = false;
    };

    presenter.onInit = function AddonParagraph_Keyboard_onInit() {
        presenter.window = presenter.editor.contentWindow;

        if (presenter.configuration.isToolbarHidden) {
            presenter.$view.find('.mce-container.mce-panel.mce-first').remove();
            presenter.$view.find('.' + presenter.CSS_CLASSES.MCE_EDIT_AREA).css('border-top-width', '0');
        }

        presenter.jQueryTinyMCEHTML = $(presenter.editor.dom.select('html'));
        presenter.jQueryTinyMCEHTML.click(function () {
            presenter.window.focus();
            $(presenter.editor.contentDocument).find('body').focus();
        });

        var stylesheetFullPath = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "addons/resources/style.css");
        presenter.editor.dom.loadCSS(stylesheetFullPath);

        presenter.setStyles();

        if (presenter.configuration.state !== undefined) {
        	presenter.editor.setContent(presenter.configuration.state, {format : 'raw'});
        }

        setTimeout(function () {
            if (presenter.setIframeHeight)
                presenter.setIframeHeight();
        }, 0);

        presenter.$tinyMCEToolbar = presenter.$view.find('.mce-toolbar');
        presenter.lastHeight = presenter.$tinyMCEToolbar.css('height');
        presenter.$tinyMCEToolbar.on('resize', function () {
            presenter.setIframeHeight();
        });

        checkForChanges();

        presenter.$view.find('.mce-container.mce-panel.mce-tinymce').css('border',0);

        var el = presenter.editor.dom.select('body')[0];
        presenter.$TinyMCEBody = $(el);
        if (typeof el.ownerDocument.parentWindow !== 'undefined') {
            presenter.window = el.ownerDocument.parentWindow;
            presenter.ownerDocument = el.ownerDocument;
            presenter.lastCaret = presenter.caret();
            presenter.$TinyMCEBody.on('mouseup keyup', function(e){
                presenter.lastCaret = presenter.caret();
            });
        } else {
            presenter.ownerDocument = false;
        }

        presenter.editor.on('blur', function () {
            presenter.sendOnBlurEvent();
        });

        if (presenter.configuration.isPlaceholderEditable && presenter.state == null) {
            presenter.setText(presenter.configuration.placeholderText);
        }

        presenter.addEventListenerOnKeyEscapeToEditorMCE();
    };

    presenter.addEventListenerOnKeyEscapeToEditorMCE = function (){
        const mceIframe = presenter.$view.find('.' + presenter.CSS_CLASSES.MCE_EDIT_AREA)[0].childNodes[0];
        const content = (mceIframe.contentDocument || mceIframe.contentWindow.document).documentElement;
        const escapeKeyCallback = function (e) {
            if (e.keyCode === window.KeyboardControllerKeys.ESCAPE && presenter.keyboardControllerObject.keyboardNavigationActive) {
                presenter.dispatchEscapeKeydownEvent();
                document.activeElement.blur();
            }
        };

        content.addEventListener("keydown", escapeKeyCallback);
    };

    presenter.dispatchEscapeKeydownEvent = function () {
        const event = new KeyboardEvent('keydown', {
            code: 'Escape',
            key: 'Escape',
            charCode: window.KeyboardControllerKeys.ESCAPE,
            keyCode: window.KeyboardControllerKeys.ESCAPE,
            bubbles: true
        });
        document.body.dispatchEvent(event);
    };

    function checkForChanges(){
        if (presenter.$tinyMCEToolbar && presenter.$tinyMCEToolbar.css('height') != presenter.lastHeight){
            presenter.lastHeight = presenter.$tinyMCEToolbar.css('height');
            presenter.setIframeHeight();
            return;
        }

        checkHeightCounter += 1;
        if(checkHeightCounter == 3) return;

        setTimeout(checkForChanges, 500);
    }

    presenter.setPlayerController = function AddonParagraph_Keyboard_playerController(controller) {
        presenter.playerController = controller;

        presenter.currentPageIndex = presenter.playerController.getCurrentPageIndex();
        presenter.pageID = presenter.playerController.getPresentation().getPage(presenter.currentPageIndex).getId();
        presenter.textParser = new TextParserProxy(presenter.playerController.getTextParser());
    };

    presenter.getState = function AddonParagraph_Keyboard_getState() {
        var tinymceState = '';
        if (presenter.editor != null && presenter.editor.hasOwnProperty("id")) {
            try {
                if (presenter.isShowAnswersActive) presenter.hideAnswers();
                tinymceState = presenter.editor.getContent({format : 'raw'});
            } catch (err) {
                return  presenter.state;
            }
        }

        return JSON.stringify({
            'tinymceState' : tinymceState,
            'isVisible' : presenter.isVisibleValue,
            'isLocked' : presenter.isLocked
        });
    };

    presenter.setState = function AddonParagraph_Keyboard_setState(state) {
        var parsedState = JSON.parse(state),
            tinymceState = parsedState.tinymceState;

        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);

        if (tinymceState !== undefined
            && tinymceState !== ""
            && !isPlaceholderClassInHTML(tinymceState)) {
            if (presenter.editor != null && presenter.editor.initialized) {
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

    presenter.executeCommand = function AddonParagraph_Keyboard_executeCommand(name, params) {
        if (!presenter.configuration.isValid) { return; }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isVisible': presenter.isVisible,
            'lock': presenter.lock,
            'unlock': presenter.unlock,
            'getText': presenter.getText,
            'setText': presenter.setText,
            'isAttempted': presenter.isAttempted,
            'isAIReady': presenter.isAIReady,
            'sendUserAnswerToAICheck': presenter.sendUserAnswerToAICheck,
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function AddonParagraph_Keyboard_reset() {
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

    presenter.show = function AddonParagraph_Keyboard_show() {
        presenter.setVisibility(true);
    };

    presenter.hide = function AddonParagraph_Keyboard_hide() {
        presenter.setVisibility(false);
    };

    presenter.isVisible = function AddonParagraph_Keyboard_isVisible() {
        return presenter.isVisibleValue;
    };

    presenter.lock = function AddonParagraph_Keyboard_lock() {
        if (!presenter.isLocked) {
            var mask = $('<div>').addClass('paragraph-lock');
            presenter.$view.find('.paragraph-keyboard').hide();
            presenter.$view.find('#' + presenter.configuration.ID + '-wrapper').append(mask);
            presenter.isLocked = true;
        }
    };

    presenter.unlock = function AddonParagraph_Keyboard_unlock() {
        if (presenter.isLocked) {
            presenter.$view.find('.paragraph-keyboard').show();
            presenter.$view.find('.paragraph-lock').remove();
            presenter.isLocked = false;
        }
    };

    presenter.getText = function AddonParagraph_Keyboard_getText() {
        return presenter.editor.getContent({format : 'raw'});
    };

    presenter.setText = function AddonParagraph_Keyboard_setText(text) {
        presenter.editor.setContent(text);
    };

    presenter.isAttempted = function AddonParagraph_Keyboard_isAttempted() {
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
    }

    presenter.getPrintableHTML = function (model, showAnswers) {
        const upgradedModel = presenter.upgradeModel(model);
        const configuration = presenter.parseModel(upgradedModel, false);
        const modelAnswer = configuration.modelAnswer;

        const $wrapper = $('<div></div>');
        $wrapper.addClass('printable_addon_Paragraph');
        $wrapper.css("left", "0px");
        $wrapper.css("right", "0px");
        $wrapper.css("height", configuration.paragraphHeight + "px");
        $wrapper.css("padding", "10px 10px 10px 0px");
        const $paragraph = $('<div></div>');
        $paragraph.css("left", "0px");
        $paragraph.css("right", "0px");
        $paragraph.css("height", "100%");
        $paragraph.css("border", "1px solid");

        let innerHTML = "";
        if (showAnswers) {
            innerHTML = modelAnswer;
        }
        if (presenter.printableState) {
            innerHTML = presenter.printableState;
        }
        $paragraph.html(innerHTML);

        $wrapper.append($paragraph);
        return $wrapper[0].outerHTML;
    };

    presenter.getOpenEndedContent = function () {
        return presenter.getText();
    };

    presenter.addPlugins = function AddonParagraph_Keyboard_addPlugins() {
        if (presenter.configuration.isPlaceholderSet) {
            presenter.addPlaceholderPlugin();
        }
    };

    presenter.makePluginName = function AddonParagraph_Keyboard_makePluginName(addonID) {
        var name = 'placeholder';
        addonID.replace(/[a-z0-9]+/gi, function(x) {
            name += "_" + x;
        });

        return name;
    };

    presenter.onFocus = function AddonParagraph_Keyboard_onFocus() {
        if (presenter.placeholder.isSet) {
            presenter.placeholder.removePlaceholder();
            presenter.placeholder.shouldBeSet = (presenter.placeholder.getEditorContent() == "");
        }
    };

    presenter.onBlur = function AddonParagraph_Keyboard_onBlur() {
        if (presenter.placeholder.shouldBeSet) {
            presenter.placeholder.addPlaceholder();
        } else {
            presenter.placeholder.removePlaceholder();
        }
    };

    presenter.addPlaceholderPlugin = function AddonParagraph_Keyboard_addPlaceholderPlugin() {
        tinymce.PluginManager.add(presenter.configuration.pluginName, function(editor) {
            editor.on('init', function () {
                presenter.placeholder.init(editor.id);
                editor.on('blur', presenter.onBlur);
                editor.on('focus', presenter.onFocus);
            });
        });
    };

    presenter.placeholderElement = function AddonParagraph_Keyboard_placeholderElement() {
        this.isSet = true;
        this.shouldBeSet = false;
        this.keyboardChange = false;
        this.placeholderText = presenter.configuration.isPlaceholderEditable ? "" : presenter.configuration.placeholderText;
        this.contentAreaContainer = null;
        this.el = null;
        this.attrs = {style: {position: 'absolute', top:'5px', left:0, color: '#888', padding: '1%', width:'98%', overflow: 'hidden'} };
    };

    presenter.placeholderElement.prototype.init = function AddonParagraph_Keyboard_placeholderElement_init() {
        this.contentAreaContainer = presenter.editor.getBody();
        this.el = presenter.editor.dom.add(this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);

        tinymce.DOM.setStyle(this.contentAreaContainer, 'position', 'relative');
        tinymce.DOM.addClass(this.el, "placeholder");
    };

    presenter.placeholderElement.prototype.addPlaceholder = function AddonParagraph_Keyboard_addPlaceholder() {
        this.el = presenter.editor.dom.add(this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);
        presenter.editor.dom.addClass(this.el, "placeholder");
        this.isSet = true;
        presenter.setStyles();
    };

    presenter.placeholderElement.prototype.setPlaceholderAfterEditorChange = function AddonParagraph_Keyboard_setPlaceholderAfterEditorChange() {
        if (this.getEditorContent() == "") {
            this.shouldBeSet = true;
        } else {
            this.shouldBeSet = false;
            this.removePlaceholder();
        }
    };

    presenter.placeholderElement.prototype.removePlaceholder = function AddonParagraph_Keyboard_removePlaceholder() {
        this.isSet = false;
        presenter.editor.dom.remove(this.el);
    };

    presenter.placeholderElement.prototype.getEditorContent = function AddonParagraph_Keyboard_getEditorContent() {
        return presenter.editor.getContent();
    };

    presenter.onTinymceChange = function AddonParagraph_Keyboard_onTinymceChange(editor, event) {
        this.keyboardChange = true;
        if (presenter.configuration.isPlaceholderSet) {
            presenter.placeholder.setPlaceholderAfterEditorChange();
        }
    };

    presenter.getMaxScore = function () {
        if (!presenter.configuration.isValid || !presenter.configuration.manualGrading) {
            return 0;
        }
        return presenter.configuration.weight;
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

    presenter.waitForAIGrade = function () {
        presenter.startTime = new Date().getTime();
        presenter.disableEdit();
        presenter.aiGradeInterval = setInterval(function () {
            presenter.checkTimer();
        }, 1000);
    };

    presenter.checkTimer = function () {
        const currentTime = new Date().getTime();
        if ((currentTime - presenter.startTime) / 1_000 >= presenter.MAX_WAIT_TIME) {
            clearInterval(presenter.aiGradeInterval);
            presenter.isWaitingForAIGrade = false;
            presenter.enableEdit();
        }
    };

    presenter.handleUpdateScoreEvent = function (eventData) {
        if (eventData.source !== presenter.configuration.ID && eventData.value !== presenter.updateScoreEventName) { return; }

        clearInterval(presenter.aiGradeInterval);
        presenter.isWaitingForAIGrade = false;
        presenter.enableEdit();
    };

    presenter.isOpenActivity = function () {
        return presenter.configuration.isValid && presenter.configuration.manualGrading;
    };

    function ParagraphKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    ParagraphKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    ParagraphKeyboardController.prototype.constructor = ParagraphKeyboardController;

    presenter.buildKeyboardController = function Paragraph_buildKeyboardController () {
        presenter.keyboardControllerObject = new ParagraphKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
        presenter.keyboardControllerObject.overrideKeysHandlers();
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return this.$view.find(`.${presenter.CSS_CLASSES.MCE_BUTTON}, .${presenter.CSS_CLASSES.MCE_EDIT_AREA}, .${presenter.CSS_CLASSES.KEYBOARD_LETTER}, .${presenter.CSS_CLASSES.KEYBOARD_SHIFT}`); // TODO check
    };

    presenter.keyboardController = function (keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event);
    };

    ParagraphKeyboardController.prototype.overrideKeysHandlers = function () {
        this.mapping[window.KeyboardControllerKeys.ARROW_UP] = this.previousElement;
        this.mapping[window.KeyboardControllerKeys.ARROW_DOWN] = this.nextElement;
    };

    ParagraphKeyboardController.prototype.selectAction = function () {
        if (presenter.isShowAnswersActive
            || presenter.isGradualShowAnswersActive
            || presenter.isErrorCheckingMode) {
            return;
        }

        const $element = this.getTarget(this.keyboardNavigationCurrentElement, true);
        if ($element.hasClass(presenter.CSS_CLASSES.MCE_EDIT_AREA)) {
            presenter.editor.execCommand('mceCodeEditor');
        } else if ($element.hasClass(presenter.CSS_CLASSES.MCE_BUTTON)) {
            $element[0].click();
            document.activeElement.blur();
            presenter.speakSelectedOnAction($element);
        } else if ($element.hasClass(presenter.CSS_CLASSES.KEYBOARD_LETTER)) {
            $element[0].click();
            document.activeElement.blur();
            $element[0].focus();
            presenter.speakSelectedOnAction($element);
        } else if ($element.hasClass(presenter.CSS_CLASSES.KEYBOARD_SHIFT)) {
            $element[0].click();
            document.activeElement.blur();
            presenter.speakSelectedOnAction($element);
            this.firstVisibleShift();
        }
        this.mark(this.keyboardNavigationCurrentElement);
    };

    presenter.speakSelectedOnAction = function ($element) {
        const textToSpeak = (
            $element.hasClass(presenter.CSS_CLASSES.MCE_ACTIVE)
            || $element.hasClass(presenter.CSS_CLASSES.KEYBOARD_LETTER)
            || $element.hasClass(presenter.CSS_CLASSES.KEYBOARD_SHIFT)
        )
            ? presenter.speechTexts.selected
            : presenter.speechTexts.deselected;
        presenter.speak(textToSpeak);
    };

    ParagraphKeyboardController.prototype.mark = function (element) {
        const $target = this.getTarget(element, false);
        $target.addClass('keyboard_navigation_active_element_important');
        if ($target.hasClass(presenter.CSS_CLASSES.MCE_EDIT_AREA)) {
            $target.addClass('keyboard-navigation-margin');
        }
    };

    ParagraphKeyboardController.prototype.unmark = function (element) {
        const $target = this.getTarget(element, false);
        $target.removeClass('keyboard_navigation_active_element_important');
        if ($target.hasClass(presenter.CSS_CLASSES.MCE_EDIT_AREA)) {
            $target.removeClass('keyboard-navigation-margin');
        }
    };

    ParagraphKeyboardController.prototype.switchElement = function (move) {
        KeyboardController.prototype.switchElement.call(this, move);
    };

    ParagraphKeyboardController.prototype.nextElement = function (event) {
        if (event) {
            event.preventDefault();
        }

        const wasSuccess = this.nextVisibleElement();
        if (wasSuccess) {
            this.readCurrentElement();
        }
    };

    ParagraphKeyboardController.prototype.previousElement = function (event) {
        if (event) {
            event.preventDefault();
        }

        const wasSuccess = this.previousVisibleElement();
        if (wasSuccess) {
            this.readCurrentElement();
        }
    };

    /**
     * Finds and switches to the next visible element in the keyboard navigation elements list.
     * @method nextVisibleElement
     * @returns {boolean} - Returns `true` if a visible element is found and switched to,
     *                      otherwise returns `false` if no visible elements are found.
     */
    ParagraphKeyboardController.prototype.nextVisibleElement = function () {
        for (var i = 1; i < this.keyboardNavigationElementsLen; i++) {
            var index = (this.keyboardNavigationCurrentElementIndex + i) % this.keyboardNavigationElementsLen;
            var element = this.keyboardNavigationElements[index];
            if (!this.isElementHidden(element)) {
                this.markCurrentElement(index);
                return true;
            }
        }
        return false;
    };

    /**
     * Finds and switches to the previous visible element in the keyboard navigation elements list.
     * @method previousVisibleElement
     * @returns {boolean} - Returns `true` if a visible element is found and switched to,
     *                      otherwise returns `false` if no visible elements are found.
     */
    ParagraphKeyboardController.prototype.previousVisibleElement = function () {
        for (var i = 1; i < this.keyboardNavigationElementsLen; i++) {
            var index = (this.keyboardNavigationCurrentElementIndex - i + this.keyboardNavigationElementsLen) % this.keyboardNavigationElementsLen;
            var element = this.keyboardNavigationElements[index];
            if (!this.isElementHidden(element)) {
                this.markCurrentElement(index);
                return true;
            }
        }
        return false;
    };

    ParagraphKeyboardController.prototype.firstVisibleShift = function () {
        for (var i = 1; i < this.keyboardNavigationElementsLen; i++) {
            var index = (this.keyboardNavigationCurrentElementIndex - i + this.keyboardNavigationElementsLen) % this.keyboardNavigationElementsLen;
            var element = this.keyboardNavigationElements[index];
            if (!this.isElementHidden(element) && $(element).hasClass(presenter.CSS_CLASSES.KEYBOARD_SHIFT)) {
                this.markCurrentElement(index);
                element.focus();
                return true;
            }
        }
        return false;
    };

    /**
     * Checks if a given DOM element is hidden.
     *
     * An element is considered hidden if:
     * - Its height or width is 0.
     * - Its CSS `display` property is set to `none`.
     * - Its CSS `visibility` property is not `visible`.
     *
     * @param {HTMLElement} element - The DOM element to check.
     * @returns {boolean} - Returns `true` if the element is hidden, otherwise `false`.
     */
    ParagraphKeyboardController.prototype.isElementHidden = function (element) {
        var elementHeight = element.offsetHeight;
        var elementWidth = element.offsetWidth;
        var isDisplayed = $(element).css('display') !== 'none';
        var isVisible = $(element).css('visibility') === 'visible';

        return elementHeight === 0 || elementWidth === 0 || !isDisplayed || !isVisible;
    };

    ParagraphKeyboardController.prototype.getCurrentElement = function () {
		return this.getTarget(this.keyboardNavigationCurrentElement, false);
	};

    ParagraphKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    ParagraphKeyboardController.prototype.enter = function (event) {
        KeyboardController.prototype.enter.call(this, event);
        this.readCurrentElement();
    };

    ParagraphKeyboardController.prototype.readCurrentElement = function () {
        const $element = this.getCurrentElement();
        const ariaLabel = $element.attr("aria-label");
        let text = "";

        if ($element.hasClass(presenter.CSS_CLASSES.KEYBOARD_LETTER)) {
            text = TTSUtils.getTextVoiceArrayFromElement($element, presenter.configuration.langTag);
        } else if ($element.hasClass(presenter.CSS_CLASSES.KEYBOARD_SHIFT)) {
            text = presenter.speechTexts.shift;
        } else if ($element.hasClass(presenter.CSS_CLASSES.MCE_BUTTON) && ariaLabel) {
            const label = ariaLabel.toLowerCase().replace(/\s/gm, "");
            const ttsKey = presenter.TOOLBAR_ARIAS[label];
            text = ttsKey ? presenter.speechTexts[ttsKey] : ariaLabel;
            if ($element.hasClass(presenter.CSS_CLASSES.MCE_ACTIVE)) {
                text += ` ${presenter.speechTexts.selected}`;
            }
        } else if ($element.hasClass(presenter.CSS_CLASSES.MCE_EDIT_AREA)) {
            let $contentToRead = $(presenter.editor.getContent({format : 'raw'}));
            if ($contentToRead.text().trim().length === 0) {
                text = presenter.speechTexts.paragraphContent;
            } else {
                text = TTSUtils.getTextVoiceArrayFromElement($contentToRead, presenter.configuration.langTag);
            }
        } else {
            let content;
            try {
                content = $element[0].textContent;
            } catch (error) {
                console.error(error);
                content = "element";
            }
            text = content;
        }

        presenter.speak(text);
    };

    presenter.speak = function (data) {
        const tts = presenter.getTextToSpeechOrNull(presenter.playerController);
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

    function parseAltText(text) {
        return presenter.isPreview ? window.TTSUtils.parsePreviewAltText(text) : presenter.textParser.parseAltTexts(text);
    }

    return presenter;
}

AddonParagraph_Keyboard_create.__supported_player_options__ = {
    interfaceVersion: 2
};
