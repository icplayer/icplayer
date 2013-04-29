function AddonParagraph_create() {
    var presenter = function () {};
    var presentationController;
    var myEditor;

    presenter.createPreview = function (view, model) {
    	$(view).find('.paragraph_field').css('height', model['Height'] + 'px');
    	$(view).find('.paragraph_field').css('width', model['Width'] + 'px');
    };

    presenter.onInit = function() {
    	myEditor = tinymce.activeEditor.id;
    }

    /**
     * Initialize the addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way and it didn't make sense
     * for prototype purpose. Also the set of controls is static and it coulde be moved to
     * configuration.
     */
    presenter.run = function (view, model) {
    	tinymce.init({
    		selector : '.paragraph_field',
    		width: model['Width'],
    		height: model['Height'] - 37,
    		statusbar: false,
    		menubar: false,
    		toolbar: "bold italic underline numlist bullist alignleft aligncenter alignright alignjustify",
    		oninit: presenter.onInit
    	});
    };

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