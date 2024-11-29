function AddonVimeo_create(){
			
	var presenter = function(){};

	const ERROR_MESSAGES = {
		INVALID_ID: "Invalid movie ID"
	};

	presenter.run = function(view, model){
		const src = `https://player.vimeo.com/video/${model["movie id"]}?title=0&byline=0&portrait=0`;
		const sanitizedSrc = window.xssUtils.sanitize(src);
		
		const iframe = view.getElementsByTagName("iframe")[0];
		iframe.setAttribute("src", sanitizedSrc);
	};
	
	presenter.createPreview = function(view, model){
		const src = `https://vimeo.com/api/v2/video/${model["movie id"]}.json`;
		const sanitizedSrc = window.xssUtils.sanitize(src);
		
		fetch(sanitizedSrc, {method: "GET"})
			.then(response => response.json())
			.then(data => {
				const thumbnailUrl = data[0].thumbnail_large;
				$(view).children("img:first").attr("src", thumbnailUrl);
			}).catch(error => {
				showErrorMessage(view);
			});
	};
	
	function showErrorMessage (view) {
		$(view).html(`<p>${ERROR_MESSAGES.INVALID_ID}</p>`);
	}
	
	return presenter;
}
