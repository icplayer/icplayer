function AddonVimeo_create(){
			
	var presenter = function(){}

	presenter.run = function(view, model){
		var iframe = view.getElementsByTagName('iframe')[0];
		var src = iframe.getAttribute('src');
		src = src.replace('${movie id}', model['movie id'])
        src = src.replace('http', 'https');
		iframe.setAttribute('src', src);
	}

	presenter.createPreview = function(view, model){
		$.ajax({
	        type:'GET',
	        url: 'https://vimeo.com/api/v2/video/' + model['movie id'] + '.json',
	        jsonp: 'callback',
	        dataType: 'jsonp',
	        success: function(data){
	        	$(view).children("img:first").attr("src", data[0].thumbnail_large);
	        }
	    });		
	};
	
	return presenter;
}