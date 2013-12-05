function AddonParagraph_create() {
    var presenter = function () {};
    var editorID;
    var editorDOM;

    presenter.DEFAULTS = {
        TOOLBAR: 'bold italic underline numlist bullist alignleft aligncenter alignright alignjustify',
        FONT_FAMILY: 'Verdana,Arial,Helvetica,sans-serif',
        FONT_SIZE: '11px'
    };

    presenter.createPreview = function(view, model) {
        presenter.initializeEditor(view, model);
    };

    presenter.run = function(view, model) {
        presenter.initializeEditor(view, model);
    };

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
            fontFamily: fontFamily,
            fontSize: fontSize,
            isToolbarHidden: isToolbarHidden,
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

        tinymce.init({
            selector : selector,
            width: model['Width'],
            height: presenter.configuration.textAreaHeight,
            statusbar: false,
            menubar: false,
            toolbar: presenter.DEFAULTS.TOOLBAR,
            oninit: presenter.onInit,
            content_css: presenter.configuration.content_css,
            setup : function(editor) {
                editor.on("NodeChange", presenter.onNodeChange);
            }
        });
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

        presenter.setStyles();
        
        if (presenter.configuration.state !== undefined) {
        	tinymce.get(editorID).setContent(presenter.configuration.state, {format : 'raw'});
        }
        $('#' + editorID + '_ifr').height(presenter.configuration.textAreaHeight);
        presenter.$view.find('.mce-container.mce-panel.mce-tinymce').css('border',0);
    };

    presenter.onNodeChange = function () {
        presenter.setStyles();
    };

    presenter.getState = function() {
       if (tinymce.get(editorID) != undefined && tinymce.get(editorID).hasOwnProperty("id")) {
            return tinymce.get(editorID).getContent({format : 'raw'});
        }
        else {
            return '';
        }
    };

    presenter.setState = function(state) {
    	if (editorID !== undefined) {
    		tinymce.get(editorID).setContent(state, {format : 'raw'});
    	}
    	else {
    		presenter.configuration.state = state;
    	}
    };

    presenter.reset = function() {
        tinymce.get(editorID).setContent('');
    };

    return presenter;
}