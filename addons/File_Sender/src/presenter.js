function AddonFile_Sender_create() {
    var presenter = function() {};

    presenter.teachers = [];
    presenter.fileEndpointUrl = "";
    presenter.fileDownloadEndpointUrl = "";
    presenter.views = [];
    presenter.dialog = null;
    presenter.pageIndex = -1;
    presenter.$ICPage = null;
    presenter.contextLoaded = false;

    presenter.sentFileName = "";
    presenter.sentFileUrl = "";

    var currentScrollTop = 0;

    var LessonSendFileType = {
        'FILE': 0,
        'AUDIO': 1,
        'TEXT': 2,
    };

    var SOURCE_TYPES = {
        'FILE': 'File',
        'PARAGRAPH': 'Paragraph',
        'MEDIA_RECORDER': 'Media Recorder'
    };

    var ERROR_CODES = {
        V01: 'Source ID cannot be empty unless source type is set to File'
    };

    var sendFileEventType = "sendFile";


    function presenterLogic(view, model, isPreview) {
        presenter.addonID = model.ID;
        presenter.$view = $(view);
        presenter.isPreview = isPreview;

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            presenter.$view.html(ERROR_CODES[presenter.configuration.errorCode]);
            return;
        }
        presenter.loadViewHandlers();
        presenter.attachHandlers();

        presenter.views.sendFileButton.html(presenter.configuration.buttonText);
        if (presenter.configuration.sourceType !== SOURCE_TYPES.FILE) {
            presenter.views.form.css('display', 'none');
            presenter.views.formLabel.css('display', 'none');
            presenter.views.form.css('width', model['Width']+'px');
            presenter.views.form.css('height', model['Height']+'px');
        } else {
            presenter.views.sendFileButton.css('width', model['Width']+'px');
            presenter.views.sendFileButton.css('height', model['Width']+'px');
        }

        presenter.loadGlobalSendFileState();
        presenter.hideSentFile();

        if ((!isPreview) && (!presenter.contextLoaded)) {
            presenter.hide();
        }
    }

    presenter.show = function () {
        presenter.$view.css("display", "");
    }

    presenter.hide = function () {
        presenter.$view.css("display", "none");
    }

    presenter.validateModel = function (model) {
        var sourceType = model.SourceType;
        if (sourceType.length == 0) sourceType = SOURCE_TYPES.FILE;

        if (sourceType !== SOURCE_TYPES.FILE && model.SourceId.length == 0) {
             return {isValid: false, errorCode: 'V01'};
        }

        return {
            ID: model.ID,
            isValid: true,
            sourceId: model.SourceId,
            sourceType: sourceType,
            buttonText: model.ButtonText,
            dialogTitle: model.DialogTitle
        }
    }

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.pageIndex = presenter.playerController.getCurrentPageIndex();

        presenter.loadContext(10);
    };

    presenter.loadContext = function(iterationsLeft) {
        //return true if context was loaded and false if it was not
        var context = presenter.playerController.getContextMetadata();
        if (context != null) {
            if ("teachers" in context) {
                presenter.teachers = context["teachers"];
            }
            if ("fileEndpointUrl" in context) {
                presenter.fileEndpointUrl = context["fileEndpointUrl"];
            }
            if ("fileDownloadEndpointUrl" in context) {
                presenter.fileDownloadEndpointUrl = context["fileDownloadEndpointUrl"];
            }
            if (presenter.fileEndpointUrl.length > 0
                && presenter.fileDownloadEndpointUrl.length > 0
                && presenter.teachers.length > 0) {
                presenter.contextLoaded = true;
                if (presenter.$view) {
                    presenter.show();
                }
            }
        } else {
            if (iterationsLeft > 0) {
                window.setTimeout(function(){presenter.loadContext(iterationsLeft-1)}, 500);
            }
        }
    };

    presenter.getState = function() {
            var state = {
                sentFileName: presenter.sentFileName,
                sentFileUrl: presenter.sentFileUrl
            };
            return JSON.stringify(state);
    }

    presenter.setState = function(state) {
        var parsedState = JSON.parse(state);
        presenter.setSentFile(parsedState.sentFileName, parsedState.sentFileUrl);
        if (parsedState.sentFileName.length > 0 && parsedState.sentFileUrl.length > 0) {
            presenter.showSentFile();
        }
    }

    presenter.fireSendFileEvent = function(fileID, targetID) {
        if (presenter.playerController) {
            var fileType = LessonSendFileType.FILE; //FILE
            if (presenter.configuration.sourceType == SOURCE_TYPES.PARAGRAPH) {
                fileType = LessonSendFileType.TEXT;
            } else if (presenter.configuration.sourceType == SOURCE_TYPES.MEDIA_RECORDER) {
                fileType = LessonSendFileType.AUDIO;
            }
            var data = {
                teachers: [targetID],
                fileId: fileID,
                fileType: fileType
            };
            var jsonData = JSON.stringify(data);
            presenter.playerController.sendExternalEvent(sendFileEventType, jsonData);
        } else {
            console.error("Cannot make a request: no player controller");
        }
    }

    presenter.loadViewHandlers = function() {
        presenter.views.wrapper = presenter.$view.find('.file-sender-wrapper');
        presenter.views.form = presenter.$view.find('.file-sender-input-wrapper');
        presenter.views.formInput = presenter.$view.find('.file-sender-input-file');
        presenter.views.formLabel = presenter.$view.find('.file-sender-input-label');
        presenter.views.sendFileButton = presenter.$view.find('.file-sender-send-file-button');
        presenter.views.fileSentWrapper = presenter.$view.find('.file-sender-sent-file');
        presenter.views.fileSentLabel = presenter.$view.find('.file-sender-sent-file-label');
        presenter.views.fileSentReset = presenter.$view.find('.file-sender-sent-file-reset');
    }

    presenter.getSentFileName = function() {
        return presenter.sentFileName;
    }

    presenter.getSentFileUrl = function() {
        return presenter.sentFileUrl;
    }

    presenter.attachHandlers = function() {
        presenter.views.formInput.click(function(e){
            e.preventDefault();
            var tmpForm = $('<form>');
            var tmpInput = $('<input type="file">');
            tmpForm.append(tmpInput);
            tmpInput.change(function(){
                presenter.views.formInput[0].files = tmpInput[0].files;
                presenter.views.formInput.change();
            });
            tmpInput.click();
        });
        presenter.views.formInput.change(function(e){
            presenter.updateFileLabel();
            presenter.updateGlobalSendFileState();
        });
        presenter.views.sendFileButton.click(presenter.onSendFileClick);
        presenter.views.fileSentLabel.click(function() {
            var element = document.createElement("a");
            element.setAttribute("id", "dl");
            element.setAttribute("download", presenter.getSentFileName());
            element.setAttribute("href", presenter.getSentFileUrl());
            element.click();
        });
        presenter.views.fileSentReset.click(function() {
            presenter.resetSentFile();
            presenter.hideSentFile();
        });
    }

    presenter.updateFileLabel = function() {
        if (presenter.views.formInput.length == 0 || presenter.views.formInput[0].files.length == 0) {
            presenter.views.formLabel.html("");
        }
        presenter.views.formLabel.html(presenter.views.formInput[0].files[0].name);
    }

    presenter.loadGlobalSendFileState = function() {
        if (window.globalSendFileState === undefined ||
        window.globalSendFileState[presenter.pageIndex] === undefined ||
        window.globalSendFileState[presenter.pageIndex][presenter.configuration.ID] == null) return;

        presenter.views.formInput[0].files = window.globalSendFileState[presenter.pageIndex][presenter.configuration.ID];
        presenter.updateFileLabel();
    }

    presenter.updateGlobalSendFileState = function() {
        if (window.globalSendFileState === undefined) {
            window.globalSendFileState = {};
        };
        if (window.globalSendFileState[presenter.pageIndex] === undefined) {
            window.globalSendFileState[presenter.pageIndex] = {};
        }
        var files = presenter.views.formInput[0].files;
        if (files.length > 0) {
            window.globalSendFileState[presenter.pageIndex][presenter.configuration.ID] = files;
        } else {
            window.globalSendFileState[presenter.pageIndex][presenter.configuration.ID] = null;
        }
    }

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.showTeacherList = function() {
        presenter.onSendFileClick();
    }

    presenter.onSendFileClick = function() {
        if (!presenter.contextLoaded) return;

        if (presenter.configuration.sourceType == SOURCE_TYPES.FILE) {
            if (presenter.views.formInput[0].files.length > 0) {
                presenter.showTargetDialog();
            }
        } else if (presenter.configuration.sourceType == SOURCE_TYPES.MEDIA_RECORDER) {
            var module = presenter.getMediaRecorderModule();
            if (module != null && !module.isEmpty()) {
                presenter.showTargetDialog();
            }
        } else {
            if (presenter.getParagraphModule() != null) {
                presenter.showTargetDialog();
            }
        }
    }

    presenter.setSentFile = function(fileName, fileUrl) {
        presenter.sentFileName = fileName;
        presenter.sentFileUrl = fileUrl;
        presenter.views.fileSentLabel.html(fileName);
    }

    presenter.resetSentFile = function() {
        presenter.sentFileName = "";
        presenter.sentFileUrl = "";
        presenter.views.fileSentLabel.html("");
    }

    presenter.reset = function() {
        presenter.resetSentFile();
    }

    presenter.showSentFile = function() {
        presenter.views.fileSentWrapper.css("display", "");
        presenter.views.sendFileButton.css("display", "none");
        if (presenter.configuration.sourceType === SOURCE_TYPES.FILE) {
            presenter.views.form.css("display", "none");
        }
    }

    presenter.hideSentFile = function() {
        presenter.views.fileSentWrapper.css("display", "none");
        presenter.views.sendFileButton.css("display", "block");
        if (presenter.configuration.sourceType === SOURCE_TYPES.FILE) {
            presenter.views.form.css("display", "");
        }
    }

    presenter.fetchSessionJWTToken = function() {
        var result = fetch('/api/v2/jwt/session_token', {
            method: 'GET'
        });
        return result;
    }

    presenter.showTargetDialog = function() {
        //if (presenter.teachers.length == 0) return;
        var wrapper = $('<div></div>');
        wrapper.addClass('file-sender-teacher-dialog-content');
        for (var i = 0; i < presenter.teachers.length; i++) {
            var teacher = presenter.teachers[i];
            var teacherElement = $('<div></div>');
            teacherElement.addClass('file-sender-teacher-dialog-element');
            teacherElement.html(presenter.getTeacherName(teacher));
            teacherElement.attr('data-targetId', teacher.id);
            teacherElement.click(presenter.onTeacherSelect);
            wrapper.append(teacherElement);
        }
        currentScrollTop = presenter.playerController.iframeScroll();
        presenter.findICPage();

        presenter.dialog = wrapper.dialog({
                    modal: true,
                    autoOpen: false,
                    title: presenter.configuration.dialogTitle,
                    open: presenter.openDialogEventHandler,
                    close: presenter.closeDialogEventHandler
                    });
        presenter.dialog.dialog('open');
        var dialogParent = presenter.dialog.closest('.ui-dialog');
        dialogParent.addClass('file-sender-teacher-dialog');
        dialogParent.find('.ui-dialog-titlebar').addClass('file-sender-teacher-dialog-titlebar');

        if (!presenter.playerController.isPlayerInCrossDomain()) {
            $(top.window).scrollTop(currentScrollTop);
        }
    }

    presenter.getTeacherName = function(teacher) {
        if (teacher.first_name.length === 0 && teacher.last_name.length === 0) {
            return teacher.username;
        }
        return (teacher.first_name + " " + teacher.last_name).trim();

    }

    presenter.onTeacherSelect = function(event) {
        presenter.dialog.dialog('close');
        presenter.sendFile($(this).attr('data-targetId'));
    }

    presenter.sendFile = function(targetID) {
        presenter.fetchSessionJWTToken().then(result => result.json()).then(json => {
            presenter.getFile().then(file => {
                if (file == null) {
                    return;
                }
                if (presenter.fileEndpointUrl.length == 0) {
                    return;
                }
                var formData = new FormData();
                formData.append('file', file, file.name);
                fetch(presenter.fileEndpointUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'JWT ' + json.token,
                    }
                }).then(result => result.json()).then(
                    success => fetch(success["upload_url"], {
                       method: 'POST',
                       headers: {
                           'Authorization': 'JWT ' + json.token
                       },
                       body: formData
                    })
               ).then(result => result.json()).then(
                    success => {
                        presenter.fireSendFileEvent(success.uploaded_file_id, targetID);
                        var fileUrl = presenter.fileDownloadEndpointUrl + success.uploaded_file_id;
                        presenter.setSentFile(file.name, fileUrl);
                        presenter.showSentFile();
                    }
                ).catch((err) => {
                        console.log(err);
                    }
                );
            });
        });
    }

    presenter.executeCommand = function(name, params) {
        if (!presenter.configuration.isValid) return;

        var commands = {
            'showTeacherList': presenter.showTeacherList
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getParagraphModule = function() {
        if (presenter.configuration.sourceType !== SOURCE_TYPES.PARAGRAPH) return null;
        var module = presenter.playerController.getModule(presenter.configuration.sourceId);
        if (module == null || !module.hasOwnProperty('getText')) return null;
        return module;
    }


    presenter.getTextFile = function() {
        var module = presenter.getParagraphModule();
        if (module == null) return null;
        var text = module.getText();
        var file = new File([text], "paragraph.html", {type: "text/html;charset=utf-8"});
        return file;
    }

    presenter.getMediaRecorderModule = function() {
        if (presenter.configuration.sourceType !== SOURCE_TYPES.MEDIA_RECORDER) return null;
        var module = presenter.playerController.getModule(presenter.configuration.sourceId);
        if (module == null || !module.hasOwnProperty('getMP3File') || !module.hasOwnProperty('isEmpty')) return null;
        return module;
    }

    presenter.getMP3File = function() {
        var module = presenter.getMediaRecorderModule();
        if (module == null) return null;
        return module.getMP3File();
    }

    presenter.getFile = function() {
        return new Promise(resolve => {
        if (presenter.configuration.sourceType === SOURCE_TYPES.PARAGRAPH) {
            resolve(presenter.getTextFile());
        } else if (presenter.configuration.sourceType === SOURCE_TYPES.FILE) {
            if (presenter.views.formInput[0].files.length > 0) {
                 resolve(presenter.views.formInput[0].files[0]);
            } else {
                resolve(null);
            }
        } else { //SOURCE_TYPES.MEDIA_RECORDER
            var mp3 = presenter.getMP3File();
            if (mp3 == null) {
                resolve(null);
            } else {
                mp3.then(file => resolve(file));
            }
        }
        });
    }

    presenter.openDialogEventHandler = function(event, ui) {
        try{
            var $dialog  = $(event.target).closest('.ui-dialog');
            var isPreview = $(".gwt-DialogBox").is('.gwt-DialogBox');
            var isPopup =  $(presenter.$ICPage).is('.ic_popup_page');
            var isMarginalPage =  $(presenter.$ICPage).is('.ic_footer') || $(presenter.$ICPage).is('.ic_header');
            var presentationPosition = $(presenter.$ICPage).offset();
            var presentationWidth = $(presenter.$ICPage).outerWidth();
            var presentationHeight = isMarginalPage ?  $('.ic_page').outerHeight() : $(presenter.$ICPage).outerHeight();
            var dialogWidth = $dialog.outerWidth();
            var dialogHeight = $dialog.outerHeight();
            var windowHeight = $(top.window).height();
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
                if ($(top.window).scrollTop() > 0) presentationPosition.top = 0;
            }
            var visibleArea = presenter.estimateVisibleArea(presentationPosition.top, presentationHeight, scrollTop, windowHeight);
            var availableHeight = visibleArea.bottom - visibleArea.top;

            if (dialogHeight >= availableHeight) {
                dialogHeight = presenter.calculateReducedDialogHeight($dialog, availableHeight);
                $dialog.find('.file-sender-teacher-dialog-content').css({
                    height: dialogHeight + 'px'
                });
            }

            // Check if the addon needs to account for transform css
            var scaleInfo = presenter.playerController.getScaleInformation();
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
                var iframe = window.parent.document.getElementsByTagName('iframe');
                var iframeDialogHeight = parseInt($dialog.height(), 10);
                iframeDialogHeight += DOMOperationsUtils.calculateOuterDistances(DOMOperationsUtils.getOuterDimensions($dialog)).vertical;

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
                top: (topPosition + scrollTop + previewFrame) + 'px'
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
        }catch(e){console.log(e)}
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

    presenter.calculateReducedDialogHeight = function($dialog, pageHeight) {
        var titleHeight = $dialog.find(".ui-dialog-titlebar").outerHeight();
        var padding = parseInt($dialog.css("padding-top")) + parseInt($dialog.css("padding-bottom"));

        var $content = $dialog.find('.ui-dialog-content');
        var contentPadding = parseInt($content.css('paddingTop'), 10) + parseInt($content.css('paddingBottom'), 10);
        var contentBorder = parseInt($content.css('borderTopWidth'), 10) + parseInt($content.css('borderBottomWidth'), 10);
        var contentMargin = parseInt($content.css('marginTop'), 10) + parseInt($content.css('marginBottom'), 10);

        return pageHeight - padding - titleHeight - contentPadding - contentBorder - contentMargin - 100;
    };

    return presenter;
}