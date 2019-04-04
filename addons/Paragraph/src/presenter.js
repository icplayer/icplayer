function AddonParagraph_create() {
    var presenter = function () {};

    presenter.placeholder = null;
    presenter.editor = null;
    presenter.jQueryTinyMCEHTML = null;
    presenter.$tinyMCEToolbar = null;
    presenter.tinyMceContainer = null;
    presenter.editor = null;
    presenter.playerController = null;
    presenter.isVisibleValue = null;

    presenter.LANGUAGES = {
        DEFAULT: "en_GB",
        FRENCH: "fr_FR"
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
        'W_01': 'Weight must be a positive number between 0 and 100'
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
            'unlock': presenter.unlock
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAttempted = function () {
        return $(presenter.editor.getContent({format: 'raw'})).text() != '';
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
        presenter.initializeEditor(view, model);
        presenter.setVisibility(true);
        var clickhandler = $("<div></div>").css({"background":"transparent", 'width': '100%', 'height': '100%', 'position':'absolute', 'top':0, 'left':0});
        presenter.$view.append(clickhandler);
    };

    presenter.run = function AddonParagraph_run(view, model) {
        presenter.initializeEditor(view, model, false);
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.isLocked = false;
    };

    presenter.initializeEditor = function AddonParagraph_initializeEditor(view, model) {
        presenter.view = view;
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.view.addEventListener('DOMNodeRemoved', presenter.destroy);

        presenter.$view.on('click', function viewClickHandler(e) {
            e.stopPropagation();
            e.preventDefault();
        });

        presenter.$view.find('.paragraph-wrapper').attr('id', presenter.configuration.ID + '-wrapper');

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
        });
        
        if(isIOSSafari()) {
            var input = document.createElement("input");
            input.type = "text";
            $(input).css('display', 'none');
            presenter.$view.append(input);
        }
    };

    presenter.getTinyMceSelector = function AddonParagraph_getTinyMceSelector() {
        return '#' + presenter.configuration.ID + '-wrapper .paragraph_field';
    };

    presenter.getTinymceInitConfiguration = function AddonParagraph_getTinyMceConfiguration(selector) {
        var layoutType = presenter.configuration.layoutType;

        return {
            plugins: presenter.configuration.plugins,
            selector : selector,
            width: presenter.configuration.width,
            height: presenter.configuration.textAreaHeight,
            statusbar: false,
            menubar: false,
            toolbar: layoutType === "Default" ? presenter.configuration.toolbar : presenter.getSpecifyToolbar(layoutType),
            content_css: presenter.configuration.content_css,
            setup: presenter.setup,
            language: layoutType === "Default" ? presenter.LANGUAGES.DEFAULT : presenter.LANGUAGES.FRENCH
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
     * @param model
     * @returns {{fontFamily: *, fontSize: *}}
     */
    presenter.validateModel = function AddonParagraph_validateModel(model) {
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
            weight = model['Weight'];

        if (ModelValidationUtils.isStringEmpty(fontFamily)) {
            fontFamily = presenter.DEFAULTS.FONT_FAMILY;
            hasDefaultFontFamily = true;
        }

        if (ModelValidationUtils.isStringEmpty(fontSize)) {
            fontSize = presenter.DEFAULTS.FONT_SIZE;
            hasDefaultFontSize = true;
        }

        if (!ModelValidationUtils.isStringEmpty(weight) && !ModelValidationUtils.validateIntegerInRange(weight, 100, 0).isValid ) {
            return {isError: true, errorCode: 'W_01'}
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
            weight: weight
        };
    };

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

        if(presenter.configuration.isPlaceholderSet) {
            plugins.push(presenter.configuration.pluginName);
        }

        return plugins.join(" ");
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradePlaceholderText(model);
            upgradedModel = presenter.upgradeManualGrading(upgradedModel);
            upgradedModel = presenter.upgradeTitle(upgradedModel);
            upgradedModel = presenter.upgradeWeight(upgradedModel);
        return presenter.upgradeEditablePlaceholder(upgradedModel);
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

    presenter.upgradeAttribute = function (model, attrName, defaultValue) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (model[attrName] == undefined) {
            upgradedModel[attrName] = defaultValue;
        }

        return upgradedModel;
    };

    presenter.destroy = function AddonParagraph_destroy(event) {
        if (event.target !== presenter.view) {
            return;
        }
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

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
        if (presenter.configuration.layoutType !== "Default") {
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

        if (presenter.editor.dom.$("placeholder").length > 0) {
            return;
        }

        if (!hasDefaultFontFamily || !hasDefaultFontSize || !hasContentCss) {
            var elements = [ presenter.editor.dom.$('p'), presenter.editor.dom.$('ol'), presenter.editor.dom.$('ul')];

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
            editorHeight -= presenter.$view.find('.mce-toolbar').height();
        }

        $editor.height(editorHeight);
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
        }

        presenter.$tinyMCEToolbar = presenter.$view.find('.mce-toolbar');
        presenter.$tinyMCEToolbar.on('resize', presenter.setIframeHeight);

        presenter.tinyMceContainer = presenter.$view.find('.mce-container.mce-panel.mce-tinymce');
        presenter.tinyMceContainer.css('border', 0);


        if (presenter.configuration.layoutType !== "Default") {
            presenter.addStylesToButton();
        }

        if (presenter.configuration.isPlaceholderEditable && presenter.state == null) {
            presenter.setText(presenter.configuration.placeholderText);
        }
    };

    presenter.setPlayerController = function AddonParagraph_setPlayerController(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.getState = function AddonParagraph_getState() {
        var tinymceState;
        if (presenter.editor != undefined && presenter.editor.hasOwnProperty("id")) {
            try{
                tinymceState = presenter.editor.getContent({format : 'raw'});
            }catch(err) {
                return  presenter.state;
            }
        } else {
            tinymceState = '';
        }

        // iOS fix to hide keyboard after page change
        // https://github.com/tinymce/tinymce/issues/3441
        if(isIOSSafari()){
            var iframe = presenter.$view.find('iframe');
            iframe.focus();
            document.activeElement.blur();
        }

        return JSON.stringify({
            'tinymceState' : tinymceState,
            'isVisible' : presenter.isVisibleValue,
            'isLocked' : presenter.isLocked
        });
    };

    presenter.setState = function AddonParagraph_setState(state) {
        var parsedState = JSON.parse(state),
            tinymceState = parsedState.tinymceState;

        presenter.configuration.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);

        if (tinymceState!=undefined && tinymceState!="" && tinymceState.indexOf("class=\"placeholder\"") == -1) {
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

    presenter.reset = function AddonParagraph_reset() {
        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.placeholder.removePlaceholder();
        if (presenter.configuration.isPlaceholderEditable) {
            presenter.setText(presenter.configuration.placeholderText);
        } else {
            presenter.editor.setContent('');
        }
        presenter.placeholder.addPlaceholder();
    };

    presenter.show = function AddonParagraph_show() {
        presenter.configuration.isVisible = true;
        presenter.setVisibility(true);
    };

    presenter.hide = function AddonParagraph_hide() {
        presenter.configuration.isVisible = false;
        presenter.setVisibility(false);
    };

    presenter.isVisible = function AddonParagraph_isVisible() {
        return presenter.configuration.isVisible;
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

    return presenter;
}