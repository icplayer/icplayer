 function AddonYouTube_Addon_create(){
    var presenter = function() {
    };
 
    function createVideoThumbnailAsync(videoID, viewContainer, addonWidth, addonHeight) {
        var GDATA_YOUTUBE_FEED = "http://gdata.youtube.com/feeds/api/videos/";
        var GDATA_YOUTUBE_FEED_PARAMS = "?v=2&alt=jsonc";
        var feedURL = GDATA_YOUTUBE_FEED + videoID + GDATA_YOUTUBE_FEED_PARAMS;
 
        $.get(feedURL, function(jsonResponse) {
            var thumbnails = jsonResponse["data"]["thumbnail"];
            var thumbnailURL = thumbnails["hqDefault"] ? thumbnails["hqDefault"] : thumbnails["sqDefault"];
 
            var thumbnailElement = document.createElement("img");
            $(thumbnailElement).attr('src', thumbnailURL);
            viewContainer.html(thumbnailElement);
            $(thumbnailElement).css({
                width: addonWidth + 'px',
                height: addonHeight + 'px'
            });
        });
    }
 
    function showErrorMessage(viewContainer, errorMessage) {
        var errorElement = document.createElement('p');
        $(errorElement).text(errorMessage);
        viewContainer.html(errorElement);
    }

     function doesConnectionExist() {
         var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );

         //YouTube API key is generated in lorepocorporate google account
         xhr.open( "HEAD", "https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyAhdKL4WhiNG-fPIIC64LR95FNUOwddISs&part=status", false );

         try {
             xhr.send();
             return ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 );
         } catch (error) {
             return false;
         }
     }

    function presenterLogic(view, model, preview) {
        var width = model.Width;
        var height = model.Height;
        presenter.isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        presenter.isVisibleByDefault = presenter.isVisible;

        var viewContainer = $(view);
        var decodedVideoID = presenter.decodeVideoID(model.URL, model.ID);

        presenter.$view = $(view);

        presenter.setVisibility(presenter.isVisible);

        if (decodedVideoID.isError) {
            showErrorMessage(viewContainer, decodedVideoID.errorMessage);
        } else {
            if (preview) {
                createVideoThumbnailAsync(decodedVideoID.videoID, viewContainer, width, height);
            } else {
                var src = '${protocol}://www.youtube.com/embed/${video_id}';
                src = src.replace("${video_id}", decodedVideoID.videoID);

                //Protocol (HTTP or HTTPS)
                var myProtocol = window.location.protocol;
                myProtocol = myProtocol.replace(":","");
                var httsStr = model.HTTPS;
                var protocol = httsStr === 'True' ? 'https' : 'http';

                if (myProtocol == 'https' || protocol == 'http') {
                    src = src.replace("${protocol}", myProtocol);
                } else {
                    src = src.replace("${protocol}", protocol);
                }

                var iframe = document.createElement('iframe');
                $(iframe).attr('id', 'ytIframe');
                $(iframe).attr('frameborder', '0');
                $(iframe).attr('src', src);
                $(iframe).attr('width', parseInt(width, 10) + 'px');
                $(iframe).attr('height', parseInt(height, 10) + 'px');

                if(doesConnectionExist()){
                    viewContainer.html(iframe);
                }else{
                    var offlineDiv = document.createElement('div');
                    $(offlineDiv).addClass('offline-message');
                    if(model['Offline message']){
                        $(offlineDiv).text(model['Offline message']);
                        viewContainer.html(offlineDiv);
                    }else{
                        $(offlineDiv).text('No connection to the Internet');
                        viewContainer.html(offlineDiv);
                    }
                }
            }
        }
    }
 
    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };
 
    presenter.run = function(view, model) {
        presenterLogic(view, model, false);
    };
 
    // Return -1 if any error occurs
    presenter.decodeVideoID = function(URL, ID) {
        //Encoding video ID from URL if ID is not given
        var videoID = "";
        var prefix = "";
        var methodResult = {
            videoID : -1,
            isError: false,
            errorMessage : ''
        };
 
        if(ID !== '') {
            if (ID.search(/[^a-zA-Z0-9_-]/gm) === -1) {
                methodResult.videoID = ID;
 
                return methodResult;
            } else {
                methodResult.isError = true;
                methodResult.errorMessage = "Video ID seems to be incorrect!";
 
                return methodResult;
            }
        }
 
        if(URL === '') {
            methodResult.isError = true;
            methodResult.errorMessage = "Neither video ID nor URL was given!";
 
            return methodResult;
        }
 
        var ampersandIndex = URL.indexOf("&");
        var youtubeIndex = URL.indexOf("youtube.com/watch?v=");
 
        if(youtubeIndex == -1) {
            // There is a possibility that user enters shorted URL
            youtubeIndex = URL.indexOf("youtu.be/");
 
            if(youtubeIndex == -1) {
                methodResult.isError = true;
                methodResult.errorMessage = "URL seems to be incorrect!";
 
                return methodResult;
            }
 
            prefix = ".be/";
        } else {
            prefix = "?v=";
        }
 
        var startIndex = URL.indexOf(prefix) + prefix.length;
        if (startIndex == URL.length) {
            methodResult.isError = true;
            methodResult.errorMessage = "URL seems to be incorrect. It must contain video ID!";
 
            return methodResult;
        }
 
        if(ampersandIndex == -1) {
            videoID = URL.substring(startIndex);
        } else {
            videoID = URL.substring(startIndex, ampersandIndex);
        }
 
        methodResult.videoID = videoID;
 
        return methodResult;
    };

     presenter.setVisibility = function (isVisible) {
         presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
     };

     presenter.show = function() {
         presenter.setVisibility(true);
         presenter.isVisible = true;
     };

     presenter.hide = function() {
         presenter.setVisibility(false);
         presenter.isVisible = false;
     };

     presenter.executeCommand = function(name, params) {
         var commands = {
             'show': presenter.show,
             'hide': presenter.hide
         };

         Commands.dispatch(commands, name, params, presenter);
     };

     presenter.reset = function(){
         presenter.isVisible = presenter.isVisibleByDefault;
         presenter.setVisibility(presenter.isVisibleByDefault);
     };

     presenter.getState = function () {
         return JSON.stringify({
             isVisible: presenter.isVisible
         });
     };

     presenter.upgradeStateForVisibility = function(state) {
         if (state.isVisible === undefined) {
             state.isVisible = true;
         }

         return state;
     };

     presenter.upgradeState = function (parsedState) {
         parsedState = presenter.upgradeStateForVisibility(parsedState);

         return parsedState;
     };

     presenter.setState = function(state) {
         if (ModelValidationUtils.isStringEmpty(state)) {
             return;
         }

         var parsedState = presenter.upgradeState(JSON.parse(state));

         presenter.isVisible = parsedState.isVisible;

         presenter.setVisibility(presenter.isVisible);
     };
 
    return presenter;
}
/**
 * YouTube Addon
 * Version 1.5
 * Last update: 22-07-2015
 */