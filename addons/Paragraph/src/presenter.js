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
        presenter.initializeEditor(view, model);
    };

    presenter.validateToolbar = function(controls) {
        if (!controls) {
            return presenter.DEFAULTS.TOOLBAR;
        }
        var allowedButtons = 'newdocument bold italic underline strikethrough alignleft aligncenter '+
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
            hasDefaultFontSize = false;

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
            width: model['Width']
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
            plugins.push("placeholder");
        }

        var pluginsArrayString = "";
        plugins.forEach(function (element) {
            pluginsArrayString += " " + element;
        });

        return pluginsArrayString.trim();
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradePlaceholderText(model);
    };

    presenter.upgradePlaceholderText = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model["Placeholder Text"] == undefined) {
            upgradedModel["Placeholder Text"] = "";
        }

        return upgradedModel;
    };

    presenter.initializeEditor = function(view, model) {
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);

        presenter.$view.on('click', function(e){
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

    presenter.getTinymceInitConfiguration = function (selector) {
        var config = {
            plugins: presenter.configuration.plugins,
            selector : selector,
            width: presenter.configuration.width,
            height: presenter.configuration.textAreaHeight,
            statusbar: false,
            menubar: false,
            toolbar: presenter.configuration.toolbar,
            oninit: presenter.onInit,
            content_css: presenter.configuration.content_css,
            setup: presenter.setup
        };

        return config;
    };

    presenter.addPlugins = function () {
        if(presenter.configuration.isPlaceholderSet) {
            presenter.addPlaceholderPlugin();
        }
    };

    presenter.addPlaceholderPlugin = function () {
        tinymce.PluginManager.add('placeholder', function(editor) {
            editor.on('init', function () {
                presenter.placeholder = new presenter.placeholderElement(editor);

                editor.on('blur', onBlur);
                editor.on('focus', onFocus);

                function onFocus() {
                   if(presenter.placeholder.isSet) {
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
        this.isSet = true;
        this.shouldBeSet = false;
        this.placeholderText = presenter.configuration.placeholderText;
        this.contentAreaContainer = tinymce.activeEditor.getBody();

        tinymce.DOM.setStyle(this.contentAreaContainer, 'position', 'relative');

        this.attrs = {style: {position: 'absolute', top:'5px', left:0, color: '#888', padding: '1%', width:'98%', overflow: 'hidden'} };

        this.el = tinymce.DOM.add( this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);
        tinymce.DOM.addClass(this.el, "placeholder");
    };

    presenter.placeholderElement.prototype.addPlaceholder = function() {
        this.el = tinymce.DOM.add(this.contentAreaContainer, "placeholder", this.attrs, this.placeholderText);
        tinymce.DOM.addClass(this.el, "placeholder");
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
        tinymce.DOM.remove(this.el);
    };

    presenter.placeholderElement.prototype.getEditorContent = function () {
        return tinymce.get(editorID).getContent();
    };

    presenter.onTinymceChange = function (editor, event) {
        if (presenter.configuration.isPlaceholderSet) {
            presenter.placeholder.setPlaceholderAfterEditorChange();
        }
    };

    presenter.setup = function (ed) {
        ed.on("NodeChange", presenter.onNodeChange);
        ed.on("keyup", presenter.onTinymceChange);
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

    presenter.setIframeHeight = function(){
        var $editor = presenter.$view.find('#' + editorID + '_ifr'),
            editorHeight = presenter.$view.height();

        if (!presenter.configuration.isToolbarHidden) {
            editorHeight -=  presenter.$view.find('.mce-toolbar').height();
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

        presenter.setIframeHeight();

        presenter.$view.find('.mce-toolbar').on('resize', presenter.setIframeHeight);

        presenter.$view.find('.mce-container.mce-panel.mce-tinymce').css('border',0);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
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
            tinymceState = parsedState.tinymceState,
            isVisibleState = parsedState.isVisible;

    	if (editorID !== undefined) {
    		tinymce.get(editorID).setContent(tinymceState, {format : 'raw'});
    	} else {
    		presenter.configuration.state = tinymceState;
    	}

        isVisible = isVisibleState;
        presenter.setVisibility(isVisible);

        setPlaceholderInSetState(tinymceState);
    };

    function setPlaceholderInSetState (tinymceState) {
        if (presenter.configuration.isPlaceholderSet) {
            if(editorID != undefined) {
                if (tinymceState.indexOf("class=\"placeholder\"") != -1) {
                    tinymce.get(editorID).setContent("");
                    presenter.placeholder = new presenter.placeholderElement(tinymce.get(editorID));
                }
            }
        }
    }

    presenter.reset = function() {
        presenter.setVisibility(presenter.configuration.isVisible);
        isVisible = presenter.configuration.isVisible;

        var selector = '#' + presenter.configuration.ID + '-wrapper .paragraph_field';

        tinymce.activeEditor = tinymce.init(presenter.getTinymceInitConfiguration(selector));
    };

    presenter.show = function() {
        isVisible = true;
        presenter.setVisibility(true);
        clearInterval(presenter.timerId);
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