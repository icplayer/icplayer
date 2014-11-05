function AddonParagraph_create() {
    var presenter = function () {};
    var editorID;
    var editorDOM;
    var isVisible;

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
    }

    /**
     * Parses model and set settings to default values if either of them is empty
     *
     * @param model
     * @returns {{fontFamily: *, fontSize: *}}
     */
    presenter.parseModel = function (model) {
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
            content_css: model['Custom CSS']
        };
    };

    /**
     * Initialize the addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way and it didn't make sense
     * for prototype purpose. Also the set of controls is static and it could be be moved to
     * configuration.
     */
    presenter.initializeEditor = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.$view.find('.paragraph-wrapper').attr('id', model.ID + '-wrapper');
        var selector = '#' + model.ID + '-wrapper .paragraph_field';

        presenter.configuration = presenter.parseModel(model);

        var plugins = undefined;
        if (presenter.configuration.toolbar.indexOf('forecolor') > -1 ||
            presenter.configuration.toolbar.indexOf('backcolor') > -1 ) {
            plugins = "textcolor";
        }
        tinymce.init({
            plugins: plugins,
            selector : selector,
            width: model['Width'],
            height: presenter.configuration.textAreaHeight,
            statusbar: false,
            menubar: false,
            toolbar: presenter.configuration.toolbar,
            oninit: presenter.onInit,
            content_css: presenter.configuration.content_css,
            setup : function(editor) {
                editor.on("NodeChange", presenter.onNodeChange);
            }
        });

        isVisible = presenter.configuration.isVisible;
        presenter.setVisibility(presenter.configuration.isVisible);
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

        $(editorDOM.select('html')).click(function () {
            editorDOM.select('body')[0].focus();
        });

        var stylesheetFullPath = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "addons/resources/style.css");
        tinyMCE.activeEditor.dom.loadCSS(stylesheetFullPath);

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
    };

    presenter.reset = function() {
        tinymce.get(editorID).setContent('');
        presenter.setVisibility(presenter.configuration.isVisible);
        isVisible = presenter.configuration.isVisible;
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