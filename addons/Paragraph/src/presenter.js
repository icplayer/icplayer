function AddonParagraph_create() {
    var presenter = function () {};
    var editorID;
    var editorDOM;
    var isVisible;

    presenter.placeholder = null;

    presenter.executeCommand = function(name, params) {
        if (!presenter.configuration.isValid) { return; }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isVisible': presenter.isVisible
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.DEFAULTS = {
        TOOLBAR: 'bold italic underline numlist bullist alignleft aligncenter alignright alignjustify',
        FONT_FAMILY: 'Verdana,Arial,Helvetica,sans-serif',
        FONT_SIZE: '11px'
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        if (isVisible) {
            presenter.$view.find(".paragraph-wrapper").show();
        } else {
            presenter.$view.find(".paragraph-wrapper").hide();
        }
    };

    presenter.createPreview = function(view, model) {
        presenter.initializeEditor(view, model);
        var clickhandler = $("<div></div>").css({"background":"transparent", 'width': '100%', 'height': '100%', 'position':'absolute', 'top':0, 'left':0});
        presenter.$view.append(clickhandler);
    };

    presenter.run = function(view, model) {
        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();

        presenter.initializeEditor(view, model);

        var ua = window.navigator.userAgent,
            iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i),
            webkit = !!ua.match(/WebKit/i),
            iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

        if (iOSSafari) {
            presenter.pageLoaded.then(function() {
                presenter.myVar = setInterval(function(){
                    findIframeAndSetStyles();
                }, 1000);
            });
        }
    };

    function findIframeAndSetStyles() {
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

        presenter.$view.find(".paragraph-wrapper").css("overflow", "scroll");

        if (iframe.length > 0){
            clearInterval(presenter.myVar);
        }
    }

    presenter.onEventReceived = function(eventName) {
        if (eventName == 'PageLoaded') {
            presenter.pageLoadedDeferred.resolve();
        }
    };

    presenter.validateToolbar = function(controls) {
        if (!controls) {
            return presenter.DEFAULTS.TOOLBAR;
        }
        var allowedButtons = 'customBold customUnderline customItalic newdocument bold italic underline strikethrough alignleft aligncenter '+
                             'alignright alignjustify styleselect formatselect fontselect fontsizeselect '+
                             'bullist numlist outdent indent blockquote undo redo '+
                             'removeformat subscript superscript forecolor backcolor |'.split(' ');
        controls = controls.split(' ');
        return controls.filter(function(param){
            return allowedButtons.indexOf(param) != -1
        }).join(' ');
    };

    /**
     * Parses model and set settings to default values if either of them is empty
     *
     * @param model
     * @returns {{fontFamily: *, fontSize: *}}
     */
    presenter.validateModel = function (model) {
        var fontFamily = model['Default font family'],
            fontSize = model['Default font size'],
            isToolbarHidden = ModelValidationUtils.validateBoolean(model['Hide toolbar']),
            toolbar = presenter.validateToolbar(model['Custom toolbar']),
            height = model.Height,
            hasDefaultFontFamily = false,
            hasDefaultFontSize = false,
            layoutType = model["Layout Type"] || "Default";

        if (ModelValidationUtils.isStringEmpty(fontFamily)) {
            fontFamily = presenter.DEFAULTS.FONT_FAMILY;
            hasDefaultFontFamily = true;
        }

        if (ModelValidationUtils.isStringEmpty(fontSize)) {
            fontSize = presenter.DEFAULTS.FONT_SIZE;
            hasDefaultFontSize = true;
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
            layoutType: layoutType
        };
    };

    /**
     * Initialize the addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way and it didn't make sense
     * for prototype purpose. Also the set of controls is static and it could be be moved to
     * configuration.
     */
    presenter.getPlugins = function () {
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
        return presenter.upgradePlaceholderText(model);
    };

    presenter.upgradePlaceholderText = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (model["Placeholder Text"] == undefined) {
            upgradedModel["Placeholder Text"] = "";
        }

        return upgradedModel;
    };

    presenter.initializeEditor = function(view, model) {
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        presenter.$view.on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });

        presenter.$view.find('.paragraph-wrapper').attr('id', presenter.configuration.ID + '-wrapper');
        var selector = '#' + presenter.configuration.ID + '-wrapper .paragraph_field';

        presenter.configuration.plugins = presenter.getPlugins();
        presenter.addPlugins();

        tinymce.init(presenter.getTinymceInitConfiguration(selector));

        isVisible = presenter.configuration.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.getTinymceInitConfiguration = function(selector) {
        var layoutType = presenter.configuration.layoutType;

        return {
            plugins: presenter.configuration.plugins,
            selector : selector,
            width: presenter.configuration.width,
            height: presenter.configuration.textAreaHeight,
            statusbar: false,
            menubar: false,
            toolbar: layoutType === "Default" ? presenter.configuration.toolbar : getSpecifyToolbar(layoutType),
            oninit: presenter.onInit,
            content_css: presenter.configuration.content_css,
            setup: presenter.setup,
            language: layoutType === "Default" ? '' : 'fr_FR',
            language_url : layoutType === "Default" ? '' : '/langs/fr_FR.js'
        };
    };

    presenter.addPlugins = function() {
        if (presenter.configuration.isPlaceholderSet) {
            presenter.addPlaceholderPlugin();
        }
    };

    presenter.makePluginName = function(addonID) {
        var name = 'placeholder';
        addonID.replace(/[a-z0-9]+/gi, function(x) {
            name += "_" + x;
        });
        return name;
    };

    presenter.addPlaceholderPlugin = function () {
        tinymce.PluginManager.add(presenter.configuration.pluginName, function(ed) {
            editorID = ed.id;
            var editor = tinymce.get(editorID);
            editor.on('init', function () {
                presenter.placeholder = new presenter.placeholderElement(editor);

                editor.on('blur', onBlur);
                editor.on('focus', onFocus);

                function onFocus() {
                   if (presenter.placeholder.isSet) {
                       presenter.placeholder.removePlaceholder();
                       presenter.placeholder.shouldBeSet = (presenter.placeholder.getEditorContent() == "");
                   }
                }

                function onBlur() {
                    if (presenter.placeholder.shouldBeSet) {
                        presenter.placeholder.addPlaceholder();
                    } else {
                        presenter.placeholder.removePlaceholder();
                    }
                }
            });
        });
    };

    presenter.placeholderElement = function(editor){
        editorID = editor.id;
        this.isSet = true;
        this.shouldBeSet = false;
        this.placeholderText = presenter.configuration.placeholderText;
        this.contentAreaContainer = tinymce.get(editorID).getBody();

        tinymce.DOM.setStyle(this.contentAreaContainer, 'position', 'relative');

        this.attrs = {style: {position: 'absolute', top:'5px', left:0, color: '#888', padding: '1%', width:'98%', overflow: 'hidden'} };

        this.el = tinymce.get(editorID).dom.add(this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);
        tinymce.DOM.addClass(this.el, "placeholder");
        return this;
    };

    presenter.placeholderElement.prototype.addPlaceholder = function() {
        this.el = tinymce.get(editorID).dom.add(this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);
        tinymce.get(editorID).dom.addClass(this.el, "placeholder");
        this.isSet = true;
    };

    presenter.placeholderElement.prototype.setPlaceholderAfterEditorChange = function () {
        if (this.getEditorContent() == "") {
            this.shouldBeSet = true;
        } else {
            this.shouldBeSet = false;
            this.removePlaceholder();
        }
    };

    presenter.placeholderElement.prototype.removePlaceholder = function () {
        this.isSet = false;
        tinymce.get(editorID).dom.remove(this.el);
    };

    presenter.placeholderElement.prototype.getEditorContent = function () {
        return tinymce.get(editorID).getContent();
    };

    presenter.onTinymceChange = function (editor, event) {
        if (presenter.configuration.isPlaceholderSet) {
            presenter.placeholder.setPlaceholderAfterEditorChange();
        }
    };

    function getSpecifyToolbar(language) {
        var toolbar = "";

        if (language === "French") {
            toolbar = "customBold customItalic customUnderline numlist bullist alignleft aligncenter alignright alignjustify";
        }

        return toolbar;
    }

    function addStylesToButton() {
        var boldButton = presenter.$view.find("[aria-label='" + getButton("Bold").title + "'] button"),
            italicButton = presenter.$view.find("[aria-label='" + getButton("Italic").title + "'] button"),
            underlineButton = presenter.$view.find("[aria-label='" + getButton("Underline").title + "'] button");

        boldButton.css({'font-family': 'tinymce', 'font-size': '18px', 'font-weight': 'bold'});
        italicButton.css({'font-family': 'tinymce', 'font-size': '18px', 'font-weight': 'bold', 'font-style': 'italic'});
        underlineButton.css({'font-family': 'tinymce', 'font-size': '18px', 'font-weight': 'bold', 'text-decoration': 'underline'});
    }

    function getButton(type) {
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
        }

        var languages = {
            French: french
        }

        return languages[layoutLanguage][type];
    }

    function createButton(editor, type) {
        var button = getButton(type);

        return {
            text: button.text,
            title: button.title,
            icon: false,
            onclick: function() {
                editor.execCommand(type);
            }
        }
    }

    presenter.setup = function (ed) {
        ed.on("NodeChange", presenter.onNodeChange);
        ed.on("keyup", presenter.onTinymceChange);
        if (presenter.configuration.layoutType !== "Default") {
            ed.addButton('customBold', createButton(this, "Bold"));
            ed.addButton('customItalic', createButton(this, "Italic"));
            ed.addButton('customUnderline', createButton(this, "Underline"));
        }
    };

    presenter.setStyles = function () {
        if (!editorDOM) return;
        
        var hasDefaultFontFamily = presenter.configuration.hasDefaultFontFamily,
            hasDefaultFontSize = presenter.configuration.hasDefaultFontSize,
            hasContentCss = !ModelValidationUtils.isStringEmpty(presenter.configuration.content_css);

        if (!hasDefaultFontFamily || !hasDefaultFontSize || !hasContentCss)
            {
            var elements = [ editorDOM.select('p'), editorDOM.select('ol'), editorDOM.select('ul') ], i;

            for (i = 0; i < elements.length; i++) {
                if (!hasDefaultFontFamily || !hasContentCss) {
                    editorDOM.setStyle(elements[i], 'font-family', presenter.configuration.fontFamily);
                    }
                if (!hasDefaultFontSize || !hasContentCss) {
                    editorDOM.setStyle(elements[i], 'font-size', presenter.configuration.fontSize);
                    }
                }
            }
    };

    presenter.setIframeHeight = function() {
        var $editor = presenter.$view.find('#' + editorID + '_ifr'),
            editorHeight = presenter.$view.height();

        if (!presenter.configuration.isToolbarHidden) {
            editorHeight -= presenter.$view.find('.mce-toolbar').height();
        }

        $editor.height(editorHeight);
    };

    presenter.onInit = function() {
        editorID = tinymce.activeEditor.id;
        editorDOM = tinymce.activeEditor.dom;

        if (presenter.configuration.isToolbarHidden) {
            presenter.$view.find('.mce-container.mce-panel.mce-first').remove();
            presenter.$view.find('.mce-edit-area').css('border-top-width', '0');
        }

        presenter.window = tinymce.get(editorID).contentWindow;
        $(editorDOM.select('html')).click(function () {
            presenter.window.focus();
            $(tinymce.get(editorID).contentDocument).find('body').focus();
        });

        var stylesheetFullPath = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "addons/resources/style.css");
        tinyMCE.activeEditor.dom.loadCSS(stylesheetFullPath);

        tinymce.activeEditor.dom.setStyle(tinymce.activeEditor.dom.select('body'), 'height', '100%');

        presenter.setStyles();

        if (presenter.configuration.state !== undefined) {
            tinymce.get(editorID).setContent(presenter.configuration.state, {format : 'raw'});
        }

        presenter.$view.find('.mce-toolbar').on('resize', presenter.setIframeHeight);

        presenter.$view.find('.mce-container.mce-panel.mce-tinymce').css('border', 0);

        // wait till toolbar render
        var intervalId = setInterval(function () {
            var toolbarHeight = presenter.$view.find('.mce-toolbar').height();
            if (toolbarHeight < 110 && toolbarHeight > 0) {
                clearInterval(intervalId);
                presenter.setIframeHeight();
            }
        }, 50);

        if (presenter.configuration.layoutType !== "Default") {
            addStylesToButton();
        }
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this);
    };

    presenter.onNodeChange = function () {
        presenter.setStyles();
    };

    presenter.getState = function() {
        var tinymceState;
        if (tinymce.get(editorID) != undefined && tinymce.get(editorID).hasOwnProperty("id")) {
            tinymceState = tinymce.get(editorID).getContent({format : 'raw'});
        } else {
            tinymceState = '';
        }

        return JSON.stringify({
            'tinymceState' : tinymceState,
            'isVisible' : isVisible
        });
    };

    presenter.setState = function(state) {
        var parsedState = JSON.parse(state),
            tinymceState = parsedState.tinymceState;

        isVisible = parsedState.isVisible;
        presenter.setVisibility(isVisible);

        if (tinymceState!="" && tinymceState.indexOf("class=\"placeholder\"") == -1) {
            if (editorID !== undefined) {
                tinymce.get(editorID).setContent(tinymceState, {format: 'raw'});
            } else {
                presenter.configuration.state = tinymceState;
            }
        }
    };

    presenter.reset = function() {
        presenter.setVisibility(presenter.configuration.isVisible);
        isVisible = presenter.configuration.isVisible;

        var selector = '#' + presenter.configuration.ID + '-wrapper .paragraph_field';
        tinymce.activeEditor = tinymce.init(presenter.getTinymceInitConfiguration(selector));
    };

    presenter.show = function() {
        isVisible = true;
        presenter.setVisibility(true);
    };

    presenter.hide = function() {
        isVisible = false;
        presenter.setVisibility(false);
    };

    presenter.isVisible = function() {
        return isVisible;
    };

    return presenter;
}