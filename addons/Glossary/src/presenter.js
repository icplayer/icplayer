/*
    currentScrollTop is used to get around a problem with jQuery-ui, where on opening the dialog
    it would scroll up to an incorrect position. It is used to store the correct value of scrollTop
    (before jquery-ui scrolling it up), provide it for the needs of open dialog event handler,
    and then restore the correct value of scrollTop afterwards.
 */

function AddonGlossary_create(){
    var presenter = function() {};
    presenter.$ICPage = null;
    presenter.lastReceivedEvent = null;
    presenter.isPinchZoom = false;
    presenter.isPreview = false;
    var currentScrollTop = 0;

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

    presenter.getDialogDataById = function(words, wordID) {
        for(var i = 0; i < words.length; i++) {
            if(words[i].ID == wordID) {
                return {
                    title: words[i].Text,
                    description: words[i].Description
                };
            }
        }

        return undefined;
    };

    presenter.findICPage = function () {
        presenter.$ICPage = $(presenter.$view.parent('.ic_page:first')[0]);
        if (presenter.$ICPage.offset() == null){
            presenter.$ICPage = $(presenter.$view.parent('.ic_popup_page:first')[0]);
        }
        if (presenter.$ICPage.offset() == null){
            presenter.$ICPage = $(presenter.$view.parent('.ic_header:first')[0]);
        }
        if (presenter.$ICPage.offset() == null){
            presenter.$ICPage = $(presenter.$view.parent('.ic_footer:first')[0]);
        }
    };

    presenter.openDialogEventHandler = function(event, ui) {
        try{
            var $dialog  = $(event.target).closest('.ui-dialog');
            var isPreview = $(".gwt-DialogBox").is('.gwt-DialogBox');
            var isPopup =  $(presenter.$ICPage).is('.ic_popup_page');
            var isMarginalPage =  $(presenter.$ICPage).is('.ic_footer') || (presenter.$ICPage).is('.ic_header');

            var presentationPosition = $(presenter.$ICPage).offset();
            var presentationWidth = $(presenter.$ICPage).outerWidth();
            var presentationHeight = isMarginalPage ?  $('.ic_page').outerHeight() : $(presenter.$ICPage).outerHeight();
            var dialogWidth = $dialog.outerWidth();
            var dialogHeight = $dialog.outerHeight();
            var topWindow = window;
            if (playerController && !playerController.isPlayerInCrossDomain()) topWindow = top.window;
            var windowHeight = $(topWindow).height();
            var scrollTop = currentScrollTop;
            var previewFrame = 0;
            var popupTop = 0;
            var popupLeft = 0;
            var topPosition = 0;

            if (presenter.isPreview) {
                scrollTop = $(presenter.$ICPage).scrollTop();

                if (scrollTop > 0) {
                    previewFrame = $(presenter.$ICPage).parent().parent().parent().offset().top - $(".gwt-DialogBox").offset().top;
                }

                windowHeight = ($(presenter.$ICPage).parent().parent().parent().height());
                presentationPosition.top = 0;
            }

            if (isPopup) {
                scrollTop = $(presenter.$ICPage).scrollTop();
                popupTop =  presentationPosition.top;
                if ($(topWindow).scrollTop() > 0) presentationPosition.top = 0;
            }

            var visibleArea = presenter.estimateVisibleArea(presentationPosition.top, presentationHeight, scrollTop, windowHeight);
            var availableHeight = visibleArea.bottom - visibleArea.top;

            if (dialogHeight >= availableHeight) {
                dialogHeight = presenter.calculateReducedDialogHeight($dialog, availableHeight);
                $dialog.css({
                    height: dialogHeight + 'px'
                });
            }

            // Check if the addon needs to account for transform css
            var scaleInfo = playerController.getScaleInformation();
            if(scaleInfo.scaleY!==1.0) {
                $dialog.css('transform', scaleInfo.transform);
                $dialog.css('transform-origin', scaleInfo.transformOrigin);
            }

            if(parseFloat(window.MobileUtils.getAndroidVersion())=='4.1'){
                if (window !== window.top) {
                    var ancestorData;
                    for (var i=0; i<presenter.ancestorsData.length; i++)
                    {
                        ancestorData = presenter.ancestorsData[i];
                        $(ancestorData.wnd).scrollTop(ancestorData.offset);
                    }
                    presenter.ancestorsData = undefined;
                }
            }

            if (isPopup || presenter.isPreview) {
                popupLeft = presentationPosition.left;
                topPosition = parseInt((availableHeight - dialogHeight) / 2, 10);
            }
            else {
                topPosition = parseInt(( windowHeight - dialogHeight) / 2, 10) ;
            }

            var presentationHorizontalOffset = parseInt((presentationWidth - dialogWidth) * scaleInfo.scaleY / 2, 10);
            var leftPosition = presentationPosition.left + presentationHorizontalOffset;

            // adjust top position if Player was embedded in iframe (i.e. EverTeach)
            if (window !== window.top) {
                var iframeDialogHeight = parseInt($dialog.height(), 10);
                iframeDialogHeight += DOMOperationsUtils.calculateOuterDistances(DOMOperationsUtils.getOuterDimensions($dialog)).vertical;

                //topPosition -= scrollTop;

                if (topPosition < 0) {
                    topPosition = 0;
                } else if (topPosition > $(window).height() - iframeDialogHeight) {
                    topPosition = $(window).height() - iframeDialogHeight;
                }
            }


            if ($(window).scrollTop() > popupTop && isPopup) {
                topPosition += ($(window).scrollTop() - popupTop);
            }

            $dialog.css({
                left: (leftPosition - popupLeft) + 'px',
                top: (topPosition + scrollTop + previewFrame) + 'px',
                'font-size': '18px',
                'font-family': 'Trebuchet MS, Tahoma, Verdana, Arial, sans-serif'
            });

            $dialog.find('.ui-dialog-content').css({
                color: 'black'
            });

            if(isPopup || presenter.isPreview) {
                // For Preview and Popup dialog is moved to appropriate page
                var $overlay = $(".ui-widget-overlay");
                $(presenter.$view.closest(".ui-widget-overlay")).remove();
                if (isPreview) {
                    $(".ic_page_panel").children(".ic_page").children().last().after($overlay);
                }
                else {
                    $dialog.before($overlay);
                }
            }
        }catch(e){}
    };

    presenter.closeDialogEventHandler = function() {
        // due to the inability to close the dialog, when any video is under close button
        try{
            presenter.dialog.css("maxHeight", "none");

            if (presenter.ancestorsData !== undefined) {
                var ancestorData;
                for (i=0; i<presenter.ancestorsData.length; i++)
                {
                    ancestorData = presenter.ancestorsData[i];
                    $(ancestorData.wnd).scrollTop(ancestorData.offset);
                }
                presenter.ancestorsData = undefined;
            }
        }catch(e){}
    };

    presenter.show = function(id) {
        // due to event propagation player issue, it's necessary to make sure page with glossary still exist.
        var pageClass = "." + $(presenter.$ICPage).attr('class').split(' ').join('.');
        if (!$(pageClass).length > 0) {
            return
        }

        var dialog = presenter.dialog;
        var dialogData = presenter.getDialogDataById(presenter.model["List of words"], id);
        // don't display dialog if glossary hasn't needed ID
        if (!dialogData) return;

        dialog.dialog("option", "title", dialogData.title);
        presenter.addDescription(dialog, dialogData.description);

        currentScrollTop = playerController.iframeScroll();

        dialog.dialog("open");

        if (!playerController.isPlayerInCrossDomain()) {
            $(top.window).scrollTop(currentScrollTop);
        }

        presenter.updateLaTeX(dialogData.description);

        var openLinkOption = presenter.model["Open external link in"];

        if (openLinkOption == "New tab" || openLinkOption == "" || openLinkOption == undefined) {
            presenter.$view.find('.modal-dialog').find('a').attr("target", "_blank");
        } else {
            presenter.$view.find('.modal-dialog').find('a').attr("target", "_self");
        }
    };

    presenter.catchScroll = function() {
        try{
            if (window.parent != window && presenter.ancestorsData === undefined) {
                var current_window = window;
                presenter.ancestorsData = [];
                while (current_window != current_window.parent) {
                    presenter.ancestorsData.push({
                        wnd: current_window.parent,
                        offset: $(current_window.parent).scrollTop()
                    });
                    current_window = current_window.parent;
                }
            }
        }catch(e){}
    };

    presenter.initializeView = function(view, model) {
        presenter.model = model;
        presenter.$view = $(view);
        presenter.findICPage();
        presenter.title = "";
        presenter.description = "";
        var position = playerController.isPlayerInCrossDomain() ? window : window.top;

        var dialog = presenter.$view.find(".modal-dialog");
        dialog.dialog({
            modal: true,
            autoOpen: false,
            draggable: false,
            width: model.Width,
            minHeight: 'auto',
            resizable: false,
            focus: presenter.catchScroll,
            open: presenter.openDialogEventHandler,
            close: presenter.closeDialogEventHandler,
            position: {
                of: position
            }
        });

        var $popup = $('#icplayer').parent().find('.ic_popup');
        var dialogWidget = dialog.dialog("widget");
        var outsideView = presenter.$view;
        outsideView.css({'display': 'block',
                        'width': 0,
                        'height': 0,
                        'position': 'static'
                        });
        outsideView.append(dialogWidget);
        if ($popup.is('.ic_popup') && presenter.$view.parent().is('.ic_popup_page')) {
            // Dialog must be placed in popup page
            $popup.children().last().after(outsideView);
        }
        else if ($(".gwt-DialogBox").is('.gwt-DialogBox') ) {
            // Dialog must be placed in preview page
            $(".ic_page_panel").children(".ic_page").children().last().after(outsideView);
        }
        else {
            // Dialog must be placed outside Player so that position:absolute wouldn't be suppressed by Player's overflow:hidden
            $('#icplayer').after(outsideView);
        }
        presenter.dialog = dialog;
        presenter.$view = outsideView;
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
        presenter.isPreview = true;
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
        presenter.isPreview = false;
        presenter.initializeView(view, model);
        eventBus = playerController.getEventBus();
        eventBus.addEventListener('Definition', this);
        bindEvents();
    };

    return presenter;
}