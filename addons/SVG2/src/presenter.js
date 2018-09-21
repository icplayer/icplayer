function AddonSVG2_create(){
    var presenter = function(){};

    var svgContainer, errorContainer, aspect, containerWidth, containerHeight;

    var errorMessages = {
        invalidFile: 'Invalid SVG file',
        svgSupportMissing: 'Your browser doesn\'t support SVG',
        xmlSerializerNotSupported: 'XmlSerializer not supported',
        missingFile: 'Please provide SVG file'
    };

    presenter.run = function(view, model){
        presenter.presenterLogic(view, model);
        presenter.setVisibility(presenter.isVisibleByDefault);
    };

    presenter.presenterLogic = function (view, model) {
        presenter.$view = $(view);
        svgContainer = $(view).find('.svgContainer:first');
        errorContainer = $(view).find('.errorContainer');
        aspect = model['Skip aspect ratio'] == 'True';
        containerWidth = model['Width'];
        containerHeight = model['Height'];
        presenter.isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        presenter.isVisibleByDefault = presenter.isVisible;

        if(this.hasSVGSupport()) {
            if(model['SVG file'] != '') {
                this.loadFile(model['SVG file']);
            } else {
                this.onError(errorMessages.missingFile);
            }
        } else {
            this.onError(errorMessages.svgSupportMissing);
        }
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model);
        presenter.setVisibility(true);
    };

    //detection based on Modernizer library
    presenter.hasSVGSupport = function() {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
    };

    presenter.loadFile = function(file) {
        $.ajax({
            url: file,
            success: this.onLoadComplete,
            error: this.onLoadError,
            dataType: 'xml'
        });
    };

    presenter.onLoadComplete = function(data) {
        var el = $(data).find('svg');
        //validate response
        if(el.length === 0) {
            presenter.onError(errorMessages.invalidFile);
            return;
        }

        var cw = el.attr('width') ? el.attr('width') : containerWidth;
        var ch = el.attr('height') ? el.attr('height') : containerHeight;

        //fit size of svg
        cw = cw.replace("px", "");
        ch = ch.replace("px", "");

        el.attr('viewBox', '0 0 ' + cw + ' ' + ch);
        el.attr('preserveAspectRatio', !aspect ? 'xMinYMin' : 'none');
        el.attr('width', '100%');
        el.attr('height', '100%');

        svgContainer.html('');
        //convert xml to string
        var svgHtml = presenter.xmlToString(data);
        if(svgHtml === false) {
            presenter.onError(errorMessages.xmlSerializerNotSupported);
        } else {
            //add converted content
            svgContainer.append(svgHtml);
        }
    };

    presenter.xmlToString = function(xml) {
        var output = false;
        try {
            // Gecko-based browsers, Safari, Opera
            output = new XMLSerializer().serializeToString(xml);
        } catch(e) {
            try {
                // Internet Explorer
                output = xml.xml;
            } catch(e2) {
                //Xmlserializer not supported
                return false;
            }
        }
        return output;
    };

    presenter.onLoadError = function() {
        presenter.onError(errorMessages.invalidFile);
    };

    presenter.onError = function(msg) {
        svgContainer.hide();
        errorContainer.find('.message').html(msg);
        errorContainer.show();
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.reset = function() {
        presenter.isVisibleByDefault ? presenter.show() : presenter.hide();
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.isVisible
        });
    };

    presenter.setState = function (state) {
        var parsedState = JSON.parse(state);
        presenter.isVisible = parsedState.isVisible;
        presenter.setVisibility(presenter.isVisible);
    };

    return presenter;
}