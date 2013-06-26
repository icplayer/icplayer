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
            fontSize = model['Default font size'];

        if (ModelValidationUtils.isStringEmpty(fontFamily)) {
            fontFamily = presenter.DEFAULTS.FONT_FAMILY;
        }

        if (ModelValidationUtils.isStringEmpty(fontSize)) {
            fontSize = presenter.DEFAULTS.FONT_SIZE;
        }

        return { fontFamily: fontFamily, fontSize: fontSize };
    };

    /**
     * Initialize the addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way and it didn't make sense
     * for prototype purpose. Also the set of controls is static and it coulde be moved to
     * configuration.
     */
    presenter.initializeEditor = function(view, model) {
        $(view).find('.paragraph-wrapper').attr('id', model.ID + '-wrapper');
        var selector = '#' + model.ID + '-wrapper .paragraph_field';

        presenter.configuration = presenter.parseModel(model);

        tinymce.init({
            selector : selector,
            width: model['Width'],
            height: model['Height'] - 37,
            statusbar: false,
            menubar: false,
            toolbar: presenter.DEFAULTS.TOOLBAR,
            oninit: presenter.onInit,
            setup : function(editor) {
                editor.on("NodeChange", presenter.onNodeChange);
            }
        });
    };

    presenter.setStyles = function () {
        if (!editorDOM) return;

        var elements = [ editorDOM.select('p'), editorDOM.select('ol'), editorDOM.select('ul') ], i;

        for (i = 0; i < elements.length; i++) {
            editorDOM.setStyle(elements[i], 'font-family', presenter.configuration.fontFamily);
            editorDOM.setStyle(elements[i], 'font-size', presenter.configuration.fontSize);
        }
    };
    presenter.onInit = function() {
        editorID = tinymce.activeEditor.id;
        editorDOM = tinymce.activeEditor.dom;

        $(editorDOM.select('html')).click(function () {
            editorDOM.select('body')[0].focus();
        });

        presenter.setStyles();
    };

    presenter.onNodeChange = function () {
        presenter.setStyles();
    };

    presenter.getState = function() {
        return tinymce.get(editorID).getContent({format : 'raw'});
    };

    presenter.setState = function(state) {
        tinymce.get(editorID).setContent(state, {format : 'raw'});
    };

    presenter.reset = function() {
        tinymce.get(editorID).setContent('');
    };

    return presenter;
}