function AddonVimeo_create(){
			
	var presenter = function(){}

	presenter.run = function(view, model){
		
		var iframe = view.getElementsByTagName('iframe')[0];
		var src = iframe.getAttribute('src');
		src = src.replace('${movie id}', model['movie id'])
		iframe.setAttribute('src', src);
	}

	return presenter;
}