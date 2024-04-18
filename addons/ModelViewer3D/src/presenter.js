function AddonModelViewer3D_create() {

    var presenter = function() {};

    presenter.wasInitiated = false;
    presenter.annotationsVisibility = "visible";

    presenter.run = function(view, model){
        if(!presenter.wasInitiated) {
            presenter.init(view, model);
        }
    };

    presenter.createPreview = function(view, model){
        if(!presenter.wasInitiated) {
            presenter.init(view, model);
            presenter.disableEvents();
        }
    };

    presenter.init = function(view, model){
        presenter.model = model;
        presenter.model.environmentImage = (presenter.model.environmentImage === "" ? "neutral" : presenter.model.environmentImage);

        presenter.modelViewer = $(view).find("model-viewer").get(0);
        presenter.handleAttributes();
        //auto-rotate
        if(presenter.model.autoRotate === "True") $(presenter.modelViewer).attr("auto-rotate", true);

        //handle annotations
        $(presenter.modelViewer).append(model.annotations);
        presenter.model.labelsEnabled === "True" ? presenter.showAnnotations() : presenter.hideAnnotations();

        //handle buttons
        presenter.labelsButton = $(view).find(".labelsButton").get(0);
        presenter.copyButton = $(view).find(".copyButton").get(0);
        presenter.copyMessage = $(view).find(".copyMessage").get(0);

        presenter.handleDisplayingButtons();

        presenter.model.labelsEnabled === "True" ? $(presenter.labelsButton).addClass("labelsButton-selected") : $(presenter.labelsButton).removeClass("labelsButton-selected");
        $( presenter.labelsButton ).on( "click", function(e) {
            $(presenter.labelsButton).toggleClass("labelsButton-selected");
            $(presenter.labelsButton).hasClass("labelsButton-selected") ? presenter.showAnnotations() : presenter.hideAnnotations();
        });

        //handle copyright
        let copyText = '<div class="copyContainer">'+presenter.model.copyInfo+'</div>';
        $(presenter.copyMessage).append(copyText);


        //fix hyperlink clicking
        presenter.copyContainer = $(presenter.copyMessage).find(".copyContainer").get(0);
        let link = presenter.copyContainer.querySelector('a');
        if (link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                window.open(link.getAttribute('href'), '_blank');
            });
        }

        $( presenter.copyButton ).on( "click", function(e) {
            $(presenter.copyButton).toggleClass("copyButton-selected");
            $(presenter.copyMessage).toggleClass("copyMessage-visible");
        });

        //set scale on model load
        $(presenter.modelViewer).on('load', function(){
            if(presenter.model.scale !== undefined && presenter.model.scale !== "") presenter.setScale(presenter.model.scale);
        });

        presenter.wasInitiated = true;
    };

    presenter.handleAttributes = function () {
        $(presenter.modelViewer).attr("src", presenter.model.model);
        $(presenter.modelViewer).attr("poster", presenter.model.poster);
        $(presenter.modelViewer).attr("skybox-image", presenter.model.skyboxImage);
        $(presenter.modelViewer).attr("environment-image", presenter.model.environmentImage);
        $(presenter.modelViewer).attr("shadow-intensity", presenter.model.shadowIntensity);
        $(presenter.modelViewer).attr("shadow-softness", presenter.model.shadowSoftness);
        $(presenter.modelViewer).attr("alt", presenter.model.altText);

        presenter.addAttributesFromModel();
    };

    presenter.addAttributesFromModel = function () {
        if (!presenter.model.attributes.length) {
            return;
        }

        const attributes = JSON.parse(presenter.model.attributes);
        Object.keys(attributes).forEach(key => {
            $(presenter.modelViewer).attr(key, attributes[key]);
        });
    };

    presenter.handleDisplayingButtons = function () {
        if(presenter.model.annotations.trim() === "") {
            $( presenter.labelsButton ).addClass("hidden");
        }

        if( presenter.model.copyInfo === "") {
            $( presenter.copyButton ).addClass("hidden");
        }
    };
    
    presenter.disableEvents = function () {
        $(presenter.modelViewer).css('pointer-events', 'none');
    };

    presenter.setScale = function(scale){
        presenter.modelViewer.scale = scale+" "+scale+" "+scale;
    };

    presenter.showAnnotations = function(){
        presenter.setAnnotationsVisibility("visible");
        $(presenter.labelsButton).addClass("labelsButton-selected");
    };

    presenter.hideAnnotations = function(){
        presenter.setAnnotationsVisibility("hidden");
        $(presenter.labelsButton).removeClass("labelsButton-selected");
    };

    presenter.setAnnotationsVisibility = function(value) {
        $(presenter.modelViewer).find(".Hotspot").css("visibility", value);
        presenter.annotationsVisibility = value;
    };

    presenter.getAnnotationsVisibility = function(){
        return presenter.annotationsVisibility;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'showAnnotations': presenter.showAnnotations,
            'hideAnnotations': presenter.hideAnnotations,
            'getAnnotationsVisibility': presenter.getAnnotationsVisibility,
            'setScale': presenter.setScale
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setShowErrorsMode = function() {};

    presenter.setWorkMode = function() {};

    presenter.reset = function() {};

    presenter.getErrorCount = function(){
        return 0;
    };

    presenter.getMaxScore = function(){
        return 0;
    };

    presenter.getScore = function(){
        return 0;
    };

    presenter.changeAnimation = function(animation) {
        $(presenter.modelViewer).attr("animation - name ", animation);
    };

    presenter.play = function(repetitions, pingpong) {
        presenter.modelViewer.play(repetitions, pingpong);
    };

    presenter.pause = function() {
        presenter.modelViewer.pause();
    };

    presenter.listAnimations = function() {
        return presenter.modelViewer.availableAnimations;
    };

    presenter.jumpTo = function(time) {
        presenter.modelViewer.currentTime = time;
    };

    presenter.isPaused = function() {
        return presenter.modelViewer.paused;
    };

    presenter.animationDuration = function() {
        return presenter.modelViewer.duration;
    };

    presenter.changeSpeed = function(speed) {
        presenter.modelViewer.timeScale = speed;
    };

    presenter.userPrompt = function(value) {
        $(presenter.modelViewer).attr("interaction - prompt ", value);
    };

    presenter.currentTime = function() {
        return presenter.modelViewer.currentTime;
    };

    presenter.getState = function(){
        return JSON.stringify({
            annotationsVisibility: presenter.annotationsVisibility
        });
    };

    presenter.setState = function(stateString){
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        var state = JSON.parse(stateString);
        presenter.annotationsVisibility = state.annotationsVisibility;

        presenter.annotationsVisibility === "visible" ? presenter.showAnnotations() : presenter.hideAnnotations();
    };

    return presenter;
}