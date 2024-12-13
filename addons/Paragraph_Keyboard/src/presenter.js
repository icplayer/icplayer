function AddonParagraph_Keyboard_create() {
    var presenter = function () {};
    var eventBus;
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
        eventBus = wrappedEventBus;

        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
        eventBus.addEventListener('GradualShowAnswers', this);
        eventBus.addEventListener('GradualHideAnswers', this);
        eventBus.addEventListener('ValueChanged', this);
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

        if (presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType] != undefined) {
            keyboardLayout = presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType];
        }

        height -= !isToolbarHidden ? 37 : 2;

        if (keyboardLayout.length > 0) {
            try {
                eval('keyboardLayout = ' + keyboardLayout);
            } catch(e) {
                presenter.ERROR_CODES['evaluationError'] = 'Custom keyboard layout parsing error: ' + e.message;
                return ModelErrorUtils.getErrorObject('evaluationError');
            }
        }

        if (typeof keyboardLayout['default'] !== 'object' || keyboardLayout['default'].length < 1) {
            return ModelErrorUtils.getErrorObject('defaultLayoutError');
        }

        const validatedWeight = presenter.validateWeight(weight, isPreview);
        if (!validatedWeight.isValid) {
            return validatedWeight;
        }

        var supportedPositions = ['top', 'bottom', 'custom', 'left', 'right'];

        if (keyboardPosition == 'left' || keyboardPosition == 'right') {
            keyboardLayout = transposeLayout(keyboardLayout);
        } else if (supportedPositions.indexOf(keyboardPosition) == -1) {
            keyboardPosition = 'bottom';
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
            keyboardLayout: keyboardLayout,
            keyboardPosition: keyboardPosition,
            manualGrading: manualGrading,
            title: title,
            weight: validatedWeight.value,
            modelAnswer: modelAnswer
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
        var upgradedModel = presenter.upgradeTitle(model);
        upgradedModel = presenter.upgradeManualGrading(upgradedModel);
        upgradedModel = presenter.upgradeWeight(upgradedModel);
        upgradedModel = presenter.upgradeModelAnswer(upgradedModel);
        upgradedModel = presenter.upgradePlaceholderText(upgradedModel);
        upgradedModel = presenter.upgradeEditablePlaceholder(upgradedModel);
        return presenter.upgradeUseCustomCSSFiles(upgradedModel);
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

    presenter.initializeEditor = function AddonParagraph_Keyboard_initializeEditor(view, model, isPreview) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.isPreview = isPreview;
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.parseModel(upgradedModel, isPreview);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

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
        var eventData = {
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
        presenter.$view.find('.paragraph-keyboard-shift:visible').addClass('clicked');

        window.setTimeout(function(){
            presenter.$view.find('.paragraph-keyboard-shift.clicked').removeClass('clicked');
        }, 200);

        presenter.window.focus();
        $(presenter.editor.contentDocument).find('body').focus();

        if (presenter.lastCaret) {
            presenter.caret(presenter.lastCaret);
        }
    };

    presenter.buildKeyboard = function AddonParagraph_Keyboard_buildKeyboard(){
        var keyboard = presenter.$view.find('.paragraph-keyboard'),
            row, currentSet, keys, key, keyRow, $button, t, keySetLayer;
        $.each(presenter.configuration.keyboardLayout, function(set, keySet) {
            keySetLayer = $('<div>').addClass('keySetLayer');
            keySetLayer.addClass('keyset-' + set);

            for ( row = 0; row < keySet.length; row++ ){
                currentSet = $.trim(keySet[row]).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g,'{$1:$2}');
                keys = currentSet.split(/\s+/);

                if (!keys) {
                    continue;
                }

                keyRow = $('<div>').addClass('keyRow');
                for ( key = 0; key < keys.length; key++ ) {
                    // ignore empty keys
                    if (keys[key].length === 0) {
                        continue;
                    }

                    t = keys[key];

                    if (t == '{empty}') {
                        keyRow.append($('<div>').addClass('paragraph-keyboard-empty').html('&nbsp;'));
                    } else if (t == '{shift}') {
                        $button = $('<div>').addClass('paragraph-keyboard-shift').html('&nbsp;');
                        $button.on('click', presenter.switchKeyboard);
                        keyRow.append($button);
                    } else {
                        $button = $('<div>').addClass('paragraph-keyboard-letter').text(t);
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
            presenter.$view.find('.mce-edit-area').css('border-top-width', '0');
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
        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.currentPageIndex = presenter.playerController.getCurrentPageIndex();
        presenter.pageID = presenter.playerController.getPresentation().getPage(presenter.currentPageIndex).getId();
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
    }

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
        var model = presenter.upgradeModel(model);
        const configuration = presenter.parseModel(model, false);
        const modelAnswer = configuration.modelAnswer;

        var $wrapper = $('<div></div>');
        $wrapper.addClass('printable_addon_Paragraph');
        $wrapper.css("left", "0px");
        $wrapper.css("right", "0px");
        $wrapper.css("height", configuration.paragraphHeight + "px");
        $wrapper.css("padding", "10px 10px 10px 0px");
        var $paragraph = $('<div></div>');
        $paragraph.css("left", "0px");
        $paragraph.css("right", "0px");
        $paragraph.css("height", "100%");
        $paragraph.css("border", "1px solid");

        let innerText = "";
        if (showAnswers) {
            innerText = modelAnswer;
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
    }

    presenter.handleUpdateScoreEvent = function (eventData) {
        if (eventData.source !== presenter.configuration.ID && eventData.value !== presenter.updateScoreEventName) { return; }

        clearInterval(presenter.aiGradeInterval);
        presenter.isWaitingForAIGrade = false;
        presenter.enableEdit();
    }

    return presenter;
}

AddonParagraph_Keyboard_create.__supported_player_options__ = {
    interfaceVersion: 2
};
