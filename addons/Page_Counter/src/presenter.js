function AddonPage_Counter_create() {
    var presenter = function() { };
    var presentationController;
    var isWCAGOn = false;

    presenter.isCurrentlyVisible = true;

    presenter.executeCommand = function(name, params) {
        switch(name.toLowerCase()) {
            case 'hide'.toLowerCase():
                presenter.hide();
                break;
            case 'show'.toLowerCase():
                presenter.show();
                break;
        }
    };
    
    presenter.hide = function() {
        presenter.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    };
    
    presenter.show = function() {
        presenter.isCurrentlyVisible = true;
        presenter.setVisibility(true);
    };
    
    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };
    
    presenter.updateVisibility = function() {
        if (presenter.isCurrentlyVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };
    
    presenter.ERROR_CODES = {
            "L_01": "No language selected, have to be selected proper language in Numericals property",
            'ST_01': "Start from property have to be a positive integer.",
            "OPT_01": "Omitted pages texts have to be comma separated positive integers, greater than 0.",
            "OPT_02": "Omitted pages texts property can define only one text for one page.",
            "OPT_03": "Omitted pages texts property page number can't be greater than Start From property.",
            "OPT_04": "Omitted pages texts needs pages filled, not only texts",
            "OPT_05": "Omitted pages texts needs text filled, not only pages"
        };
    
    presenter.isPositiveInt = function (value) {
        if (value.trim() == "0") {
            return false;
        }

        if (ModelValidationUtils.isStringEmpty(value.trim()) == true) {
            return false;
        }

        var exp = /[0-9]/;
        for(var i = 0 ; i < value.length; i++) {
            var character = value.charAt(i);
            if(!exp.test(character)) {
                return false;
            }
        }
        return true;
    };

    function getTextVoiceObject (text, lang) { return {text: text, lang: lang}; }

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    function speak (data) {
        var tts = presenter.getTextToSpeechOrNull(presentationController);

        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    }
    
    presenter.validateLanguage = function (model) {
        if (model.Numericals == 'Eastern Arabic') {
            return {isValid: true, value: Internationalization.EASTERN_ARABIC};
        }

        else if (model.Numericals == 'Perso-Arabic') {
            return {isValid: true, value: Internationalization.PERSO_ARABIC};
        }

        return {isValid: true, value: Internationalization.WESTERN_ARABIC};
    };

    function render(view, language, pageIndex, pageCount) {
        if (pageIndex >= 0) {
            var viewContainer = $(view);
            var element = viewContainer.find(".pagecounter:first")[0];
            DOMOperationsUtils.setReducedSize(view, element);

            var addonText = Internationalization.translate((pageIndex + 1), language) + ' / ' + Internationalization.translate(pageCount, language);

            // This asures us that text will be center vertically
            $(element).css('line-height', $(element).height() + 'px');
            $(element).html(addonText);
        }
    }

    function renderText(view, text) {
        var viewContainer = $(view);
        var element = viewContainer.find(".pagecounter:first")[0];
        DOMOperationsUtils.setReducedSize(view, element);

        // This asures us that text will be center vertically
        $(element).css('line-height', $(element).height() + 'px');
        $(element).html(text);
    }


    presenter.validateStartFrom = function (startFrom) {
        if (ModelValidationUtils.isStringEmpty(startFrom)) {
            return { isValid: true, value: undefined};
        }

        if (!presenter.isPositiveInt(startFrom)) {
            return { isValid: false, errorCode: "ST_01"};
        }

        return {isValid: true, value: (parseInt(startFrom, 10) - 1)};
    };

    function parsePages(omittedPagesTextsObject) {
        var pages = omittedPagesTextsObject.pages;
        var text = omittedPagesTextsObject.text;

        if (ModelValidationUtils.isStringEmpty(pages) && !ModelValidationUtils.isStringEmpty(text)) {
            return {isValid: false, errorCode: "OPT_04"};
        } else {
            if (ModelValidationUtils.isStringEmpty(text) && !ModelValidationUtils.isStringEmpty(pages)) {
                return {isValid: false, errorCode: "OPT_05"};
            }
        }

        pages = pages.split(",");

        var parsedPages = [];
        for(var page = 0; page < pages.length; page++) {
            var number = pages[page].trim();

            if(!presenter.isPositiveInt(number)) {
                return {isValid: false, errorCode: "OPT_01"};
            }

            parsedPages.push((parseInt(number, 10) - 1));
        }
        
        return {isValid: true, value: parsedPages};
    }

    presenter.validateOmittedPagesTexts = function (model, validatedStartFrom) {
        var omittedPagesTexts = model.omittedPagesTexts;

        if (omittedPagesTexts.length == 1 &&
            ModelValidationUtils.isStringEmpty(omittedPagesTexts[0].pages) &&
            ModelValidationUtils.isStringEmpty(omittedPagesTexts[0].text)) {

            return {isValid: true, value: {}};
        }

        var parsedOPT = {};
        
        for(var i = 0; i < (omittedPagesTexts).length; i++) {
            var parsedPages = parsePages(omittedPagesTexts[i]);
            if(!parsedPages.isValid) {
                return parsedPages;
            }
            
            for(var page = 0; page < parsedPages.value.length; page++) {
                if(parsedOPT[parsedPages.value[page]] != undefined) {
                    return {isValid: false, errorCode: "OPT_02"};
                }


                if(parsedPages.value[page] >= validatedStartFrom) {
                    return {isValid: false, errorCode: "OPT_03"};
                }
                
                parsedOPT[parsedPages.value[page]] = omittedPagesTexts[i].text;
            }
            
        }
        
        return {isValid: true, value: parsedOPT};
    };
    
    presenter.validateModel = function(model) {
        var validatedStartFrom = presenter.validateStartFrom(model.startFrom);
        if (!validatedStartFrom.isValid) {
            return validatedStartFrom;
        }

        var validatedOmittedPagesTexts = presenter.validateOmittedPagesTexts(model, validatedStartFrom.value);
        if (!validatedOmittedPagesTexts.isValid) {
            return validatedOmittedPagesTexts;
        }

        return {
            isValid: true,
            ID: model.ID,
            startFrom: validatedStartFrom.value,
            omittedPagesTexts: validatedOmittedPagesTexts.value,
            Numericals: presenter.validateLanguage(model).value,
            langTag: model['langAttribute'],
            speechTexts: presenter.getSpeechTexts(model['speechTexts']),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"])
        };
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    presenter.getSpeechTexts = function(speechTexts) {
        var speechTextsModel = {
            page:  'Page',
            outOf: 'Out of'
        };

        if (!speechTexts) {
            return speechTextsModel;
        }

        speechTextsModel = {
            page: getSpeechTextProperty(speechTexts['Page']['Page'], speechTextsModel.page),
            outOf: getSpeechTextProperty(speechTexts['OutOf']['OutOf'], speechTextsModel.outOf)
        };

        return speechTextsModel;
    };

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeStartFromAndOPT(model);
        return presenter.upgradeAddTTS(upgradedModel);
    };

    presenter.upgradeStartFromAndOPT = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.startFrom == undefined) {
            upgradedModel["startFrom"] = "";
        }

        if(model.omittedPagesTexts == undefined) {
            upgradedModel["omittedPagesTexts"] = [{"pages": "", "text": ""}];
        }

        return upgradedModel;
    };

    presenter.upgradeAddTTS = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.langAttribute == undefined) {
            upgradedModel['langAttribute'] = '';
        }

        if(model.speechTexts == undefined) {
            upgradedModel['speechTexts'] = {
                Page: {Page: ''},
                OutOf: {OutOf: ''}
            };
        }

        return upgradedModel;
    };
    
    function presenterLogic(view, model, isPreview) {
        presenter.$view = $(view);
        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);
        presenter.configuration = validatedModel;
        presenter.isCurrentlyVisible = presenter.configuration.isVisible;
        if (!isPreview) {
            presenter.updateVisibility();
        }
        
        if (!validatedModel.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, validatedModel.errorCode);
            return;
        }

        var language = validatedModel.Numericals;

        if (isPreview) {
            render(view, language, 0, 5);
        } else {
            var currentPageIndex = presentationController.getCurrentPageIndex();
            var pageCount = presentationController.getPresentation().getPageCount();

            if (validatedModel.startFrom) {
                var modifiedPageIndex = currentPageIndex - validatedModel.startFrom;
                pageCount = pageCount - validatedModel.startFrom;

                if (validatedModel.omittedPagesTexts[currentPageIndex]) {
                    renderText(view, validatedModel.omittedPagesTexts[currentPageIndex]);
                } else{
                    render(view, language, modifiedPageIndex, pageCount);
                }

            } else {
                render(view, language, currentPageIndex, pageCount);
            }
        }
    }

    presenter.setPlayerController = function(controller) {
        presentationController = controller;
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model) {
        presenterLogic(view, model, false);
    };

    presenter.keyboardController = function(keyCode, isShift, event) {
        if (keyCode == 13 || keyCode == 32) {
            if(event!== null && event !== undefined) {
                event.preventDefault();
            }
            presenter.clickHandler();
        }
    };

    presenter.clickHandler = function() {
        presenter.playContent();
    };

    presenter.playContent = function() {
        var currentPageIndex = presentationController.getCurrentPageIndex();
        var pageCount = presentationController.getPresentation().getPageCount();
        var TextVoices = [];
        if (presenter.configuration.startFrom) {
            var modifiedPageIndex = currentPageIndex - presenter.configuration.startFrom;
            pageCount = pageCount - presenter.configuration.startFrom;
            if (presenter.configuration.omittedPagesTexts[currentPageIndex]) {
                TextVoices.push(getTextVoiceObject(presenter.configuration.omittedPagesTexts[currentPageIndex], presenter.configuration.langTag));
            } else{
                if(modifiedPageIndex < 0) {
                    return;
                }
                var text = presenter.configuration.speechTexts.page + ' ';
                text += (modifiedPageIndex + 1) + ' ';
                text += presenter.configuration.speechTexts.outOf + ' ';
                text += presenter.getPageCount(pageCount);
                TextVoices.push(getTextVoiceObject(text));
            }

        } else {
            var text = presenter.configuration.speechTexts.page + ' ';
            text += (currentPageIndex + 1) + ' ';
            text += presenter.configuration.speechTexts.outOf + ' ';
            text += presenter.getPageCount(pageCount);
            TextVoices.push(getTextVoiceObject(text));
        }
        speak(TextVoices);
    };

    presenter.getPageCount = function(pageCount) {
        var lessonLangTag = document.documentElement.lang;
        if(0 === lessonLangTag.toLowerCase().localeCompare('pl') || 0 === lessonLangTag.toLowerCase().localeCompare('pl-pl')){
            if(pageCount===2) {
                return 'dwóch';
            }
            if(pageCount===3) {
                return 'trzech';
            }
            if(pageCount===4) {
                return 'czterech';
            }
        }
        return pageCount;
    };

    presenter.reset = function() {
        presenter.isCurrentlyVisible = presenter.configuration.isVisible;
        presenter.updateVisibility();
    };
    
    presenter.getState = function(){
        return JSON.stringify({
            visible : presenter.isCurrentlyVisible
        });
    };

    presenter.setState = function(state){
        if (state === undefined || state === '') {
             presenter.isCurrentlyVisible = true;
        } else {
             var parsedState = JSON.parse(state);
             presenter.isCurrentlyVisible = parsedState.visible;
        }

        presenter.updateVisibility();
    };
    
    presenter.isEnterable = function() {
        return false;
    };

    return presenter;
}
