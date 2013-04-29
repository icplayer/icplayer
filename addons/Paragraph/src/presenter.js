function AddonParagraph_create() {
    var presenter = function () {};
    var presentationController;

    presenter.createPreview = function (view, model) {
    	$('#paragraph_field').css('height', model['Height'] + 'px');
    	$('#paragraph_field').css('width', model['Width'] + 'px');
    };

    presenter.run = function (view, model) {
    	tinymce.init({
    		selector : '#paragraph_field',
    		width: model['Width'],
    		height: model['Height'] - 37,
    		statusbar: false,
    		menubar: false,
    		toolbar: "bold italic underline numlist bullist alignleft aligncenter alignright alignjustify",
    	});
    };

    presenter.setPlayerController = function(controller) {
        presentationController = controller;
    };

    presenter.getState = function() {
    	return tinymce.activeEditor.getContent({format : 'raw'});
    }

    presenter.setState = function(state) {
    	tinymce.activeEditor.setContent(state, {format : 'raw'});
    }
    
    return presenter;
}