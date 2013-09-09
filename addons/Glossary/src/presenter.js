function AddonGlossary_create(){
    var presenter = function() {};
    presenter.$ICPage = null;
    presenter.lastReceivedEvent = null;
    presenter.isPinchZoom = false;

    var playerController;
    var eventBus;

    presenter.ERROR_MESSAGES = {
        UNIQUE_ID: "Id of each word must be unique."
    };

    presenter.addTitle = function(element, title) {
        $(element).attr('title', title);
    };

    presenter.addDescription = function(element, description) {
        $(element).html(description);
    };

    presenter.updateLaTeX = function(text) {
        var div = MathJax.HTML.Element("div", {id: "MathDiv"}, [text] );
        var math = MathJax.Hub.getAllJax(div)[0];
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]);
    };

    presenter.validateModel = function(model) {
        var validated = true;
        var idList = [];
        for(var i = 0; i < model["List of words"].length; i++) {
            var id = model["List of words"][i]["ID"];
            if(idList.indexOf(id) >= 0) { // check if id already exist in model
                validated = false;
                break;
            }
            idList[i] = id;
        }
        return validated;
    };

    presenter.setDisplay = function(element, display) {
        var currentDisplay = $(element).css('display') === 'block';
        if (currentDisplay != display) {
            $(element).css({
                "display":"block",
                "width":"95%",
                "height":"90%"
            });
        }
    };

    presenter.getDialogDataById = function(id) {
        var model = this.model;
        var listOfWords = model["List of words"];
        var dialogData = {
            "title" : "",
            "description" : ""
        };
        for(var i = 0; i < listOfWords.length; i++) {
            var elementID = listOfWords[i].ID;
            if(elementID == id) {
                dialogData.title = listOfWords[i].Text;
                dialogData.description = listOfWords[i].Description;
                return dialogData;
            }
        }
        return dialogData;
    };

    presenter.findICPage = function () {
        presenter.$ICPage = $(presenter.$view.parent('.ic_page:first')[0]);
        if (presenter.$ICPage.offset() == null){
            presenter.$ICPage = $(presenter.$view.parent('.ic_popup_page:first')[0]);
        }
    };

    presenter.openDialogEventHandler = function(event, ui) {
        var $dialog  = $(event.target).closest('.ui-dialog');
        var presentationPosition = $(presenter.$ICPage).offset();
        var presentationWidth = $(presenter.$ICPage).outerWidth();
        var presentationHeight = $(presenter.$ICPage).outerHeight();
        var dialogWidth = $dialog.outerWidth();
        var dialogHeight = $dialog.outerHeight();
        var scrollTop = $(top.window).scrollTop();
        var windowHeight = $(top.window).height();
        var visibleArea = presenter.estimateVisibleArea(presentationPosition.top, presentationHeight, scrollTop, windowHeight);
        var popupTop = 0;
        var popupLeft = 0;
        var topPosition = 0;
        var dialogTop = 0;

        var availableHeight = visibleArea.bottom - visibleArea.top;

        if (dialogHeight >= availableHeight) {

            dialogHeight = presenter.calculateReducedDialogHeight($dialog, availableHeight);
            $dialog.css({
                height: dialogHeight + 'px'
            });
        }

        if ($(presenter.$ICPage).is('.ic_popup_page'))
        {
            popupLeft = presentationPosition.left;
            popupTop =  presentationPosition.top;
            topPosition = parseInt((availableHeight - dialogHeight) / 2, 10);
        }
        else
        {
            topPosition = parseInt((windowHeight - dialogHeight) / 2, 10);
        }

        var presentationHorizontalOffset = parseInt((presentationWidth - dialogWidth) / 2, 10);
        var leftPosition = presentationPosition.left + presentationHorizontalOffset;

        // adjust top position if Player was embedded in iframe (i.e. EverTeach)
        if (window !== top.window) {
            var iframe = window.parent.document.getElementsByTagName('iframe');
            var offset = parseInt($(iframe).offset().top, 10);
            var iframeDialogHeight = parseInt($dialog.height(), 10);
            iframeDialogHeight += DOMOperationsUtils.calculateOuterDistances(DOMOperationsUtils.getOuterDimensions($dialog)).vertical;

            topPosition -= offset - scrollTop;

            if (topPosition < 0) {
                topPosition = 0;
            } else if (topPosition > $(window).height() - iframeDialogHeight) {
                topPosition = $(window).height() - iframeDialogHeight;
            }
        }

        if  ( $(window).scrollTop() == 0)
        {
            dialogTop  =   topPosition;
        }
        else
        {
            dialogTop = (topPosition + $(window).scrollTop() - popupTop);
        }
       $dialog.css({
            left: (leftPosition - popupLeft) + 'px',
            top: (dialogTop) + 'px',
            'font-size': '18px',
            'font-family': 'Trebuchet MS, Tahoma, Verdana, Arial, sans-serif'
        });
        $dialog.find('.ui-dialog-content').css({
            color: 'black'
        });

        if($(presenter.$ICPage).is('.ic_popup_page'))
        {
            var $overlay = $(".ui-widget-overlay");
            $(presenter.$view.closest(".ui-widget-overlay")).remove();
            $(".ui-dialog").before($overlay);
        }

        // due to the inability to close the dialog, when any video is under close button
        var videos = presenter.$ICPage.find('video');
        $.each(videos, function(){
            $(this).removeAttr('controls');
        });

    };

    presenter.closeDialogEventHandler = function() {
        // due to the inability to close the dialog, when any video is under close button
        var videos = presenter.$ICPage.find('video');
        $.each(videos, function(){
            $(this).attr('controls', 'controls');
        });
        presenter.dialog.css("maxHeight", "none");
    };

    presenter.show = function(id) {
        var dialog = presenter.dialog;
        var dialogData = presenter.getDialogDataById(id);
        dialog.dialog("option", "title", dialogData.title);
        presenter.addDescription(dialog, dialogData.description);
        dialog.dialog("open");
        presenter.updateLaTeX(dialogData.description);
    };

    presenter.initializeView = function(view, model) {
        presenter.model = model;
        presenter.$view = $(view);
        presenter.findICPage();
        presenter.title = "";
        presenter.description = "";


        var dialog = presenter.$view.find(".modal-dialog");
        dialog.dialog({
            modal: true,
            autoOpen: false,
            draggable: false,
            width: model.Width,
            minHeight: 'auto',
            resizable: false,
            open: presenter.openDialogEventHandler,
            close: presenter.closeDialogEventHandler

        });

        // Dialog must be placed outside Player so that position:absolute wouldn't be suppressed by Player's overflow:hidden
        var $popup = $('#icplayer').parent().find('.ic_popup');
        if ($popup.is('.ic_popup'))
        {
            $popup.children().last().after(dialog.dialog("widget"));
        }
        else
        {
             $('#icplayer').after(dialog.dialog("widget"));
        }
        presenter.dialog = dialog;
     };

    presenter.calculateReducedDialogHeight = function($dialog, pageHeight) {
        var titleHeight = $dialog.find(".ui-dialog-titlebar").outerHeight();
        var padding = parseInt($dialog.css("padding-top")) + parseInt($dialog.css("padding-bottom"));

        var $content = $dialog.find('.ui-dialog-content');
        var contentPadding = parseInt($content.css('paddingTop'), 10) + parseInt($content.css('paddingBottom'), 10);
        var contentBorder = parseInt($content.css('borderTopWidth'), 10) + parseInt($content.css('borderBottomWidth'), 10);
        var contentMargin = parseInt($content.css('marginTop'), 10) + parseInt($content.css('marginBottom'), 10);

        return pageHeight - padding - titleHeight - contentPadding - contentBorder - contentMargin;
    };

    presenter.estimateVisibleArea = function(presentationTop, presentationHeight, scrollTop, windowHeight) {
        var borders = {
            top: presentationTop,
            bottom: presentationTop + presentationHeight
        };

        if (presentationTop < scrollTop) {
            borders.top = scrollTop;
        }

        if (presentationTop + presentationHeight > scrollTop + windowHeight) {
            borders.bottom = scrollTop + windowHeight;
        }

        return borders;
    };

    presenter.createPreview = function(view, model) {
        var validated = presenter.validateModel(model);
        if(validated) {
            var dialog = $(view).find(".modal-dialog");
            var visible = ModelValidationUtils.validateBoolean(model["Visible"]);
            var title = model["List of words"][0]["Text"];
            var description = model["List of words"][0]["Description"];

            presenter.addTitle(dialog, title);
            presenter.addDescription(dialog, description);

            dialog.dialog({
                modal: false,
                autoOpen: false,
                zIndex : 0,
                stack: false,
                draggable: false,
                width: model.Width,
                resizable: false
            });

            var preview = dialog.dialog("widget");
            presenter.setDisplay(preview, visible);

            $(view).append(preview);
        } else {
            $(view).html(presenter.ERROR_MESSAGES["UNIQUE_ID"]);
        }
    };

    presenter.showCommand = function (params) {
        presenter.show(params[0]);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.showCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.onEventReceived = function(eventName, eventData) {
        presenter.show(eventData.word);
    };

    function areTwoFingersOnTheScreen(event) {
        return !!(event.originalEvent.touches.length >= 2);
    }

    function isTap(event) {
        return presenter.lastReceivedEvent == "touchstart"
            && event.type == "touchend"
            && !presenter.isPinchZoom;
    }

    presenter.shouldCloseDialog = function(event) {
        if(event.type == "click" || isTap(event)) return true;

        if(areTwoFingersOnTheScreen(event)) {
            this.isPinchZoom = true;
            return false;
        }

        this.isPinchZoom = false;
        this.lastReceivedEvent = event.type;
        return false;
    };

    function bindEvents() {
        $(".ui-widget-overlay").live("click touchstart touchend touchmove", function(event){
            if(presenter.shouldCloseDialog(event)){
                presenter.dialog.dialog("close");
            }
        });
    }

    presenter.run = function(view, model){
        presenter.initializeView(view, model);
        eventBus = playerController.getEventBus();
        eventBus.addEventListener('Definition', this);
        bindEvents();
    };

    return presenter;
}