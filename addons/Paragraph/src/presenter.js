function AddonParagraph_create() {
    var presenter = function () {};
    var presentationController;
    var myEditor;

    var defaultToolbar = "bold italic underline numlist bullist alignleft aligncenter alignright alignjustify";

    presenter.createPreview = function(view, model) {
    	presenter.initializeEditor(view, model);
    };

    presenter.run = function(view, model) {
    	presenter.initializeEditor(view, model);
    };

    /**
     * Initialize the addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way and it didn't make sense
     * for prototype purpose. Also the set of controls is static and it coulde be moved to
     * configuration.
     */
    presenter.initializeEditor = function(view, model) {
    	tinymce.init({
    		selector : '.paragraph_field',
    		width: model['Width'],
    		height: model['Height'] - 37,
    		statusbar: false,
    		menubar: false,
    		toolbar: defaultToolbar,
    		oninit: presenter.onInit
    	});
    }

    presenter.onInit = function() {
    	myEditor = tinymce.activeEditor.id;
    }

    presenter.setPlayerController = function(controller) {
        presentationController = controller;
    };

    presenter.getState = function() {
    	return tinymce.get(myEditor).getContent({format : 'raw'});
    }

    presenter.setState = function(state) {
    	tinymce.get(myEditor).setContent(state, {format : 'raw'});
    }

    return presenter;
}