function AddonParagraph_create() {
    var presenter = function () {};
    var presentationController;
    var myEditor;

    var defaultToolbar = "bold italic underline numlist bullist alignleft aligncenter alignright alignjustify";
    var defaultFontFamily = 'Verdana,Arial,Helvetica,sans-serif';
    var defaultFontSize = '11px';

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
    	var id = $(view).attr('id');
    	var selector = '#' + id + ' .paragraph_field';
    	if (model['Default font family'] !== '') {
    		defaultFontFamily = model['Default font family'];
    	}
    	if (model['Default font size'] !== '') {
    		defaultFontSize = model['Default font size'];
    	}

    	tinymce.init({
    		selector : selector,
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
    	var dom = tinymce.get(myEditor).dom;
    	var pElements = dom.select('p');
    	dom.setStyle(pElements, 'font-family', defaultFontFamily);
    	dom.setStyle(pElements, 'font-size', defaultFontSize);
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

    presenter.reset = function() {
    	tinymce.get(myEditor).setContent('');
    }

    return presenter;
}