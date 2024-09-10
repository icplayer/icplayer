function AddonPrint_Report_create(){
    var presenter = function AddonPrint_Report_presenter () {};

    presenter.logic = function addonPrint_Report_logic (view, model, preview) {
        presenter.configuration = presenter.validateModel(model);
        presenter.$body = $('body');
        presenter.$view = $(view);
        presenter.$page = $('.ic_page');
        presenter.$wrapper = $('<div></div>').addClass('print-report-addon-wrapper').text(presenter.configuration.text);
        presenter.$exportButton = $('<button></button>').addClass('export-button').text(presenter.configuration.labels.exportCsvReport);
        presenter.$view.append(presenter.$exportButton);
        presenter.$view.append(presenter.$wrapper);

        if(!presenter.configuration.report.showExportButton){
            presenter.$exportButton.hide();
        }

        presenter.originalViewStyles = presenter.$view.attr('style');
        presenter.originalViewClasses = presenter.$view.attr('class');

        presenter.user = {
            'firstName': '',
            'lastName': ''
        };

        if (!preview) {
            presenter.$wrapper.click(presenter.clickAction);
            presenter.$popup = presenter.createPopup();
            presenter.$view.append(presenter.$popup);
            presenter.$popup.hide();
            presenter.bindPopupEvents();
            presenter.$exportButton.on("click", function () {
                presenter.showPopup(true);
            });
        }
    };

    presenter.exportButtonClickAction = function () {
        var data = presenter.getPagesData(),
            name = presenter.user.firstName || '',
            lastName = presenter.user.lastName || '',
            date = presenter.prepareDate(presenter.configuration.labels.date),
            firstNameLabel = presenter.configuration.labels.userFirstName,
            lastNameLabel = presenter.configuration.labels.userLastName,
            scoreLabel = presenter.configuration.labels.pageScore || "Score",
            errorsLabel = presenter.configuration.labels.errors || "Errors";

            var blob = new Blob([firstNameLabel+ ": " + name + ", " + lastNameLabel + ": " + lastName + ", " + scoreLabel + ": " + data.total.score + "/" + data.total.maxScore + ", " + errorsLabel + ": " + data.total.errors + ", " + date], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "report.txt");
    };

    presenter.clickAction = function addonPrint_Report_clickAction () {
        if (presenter.configuration.report.username) {
            presenter.showPopup(false);
        } else {
            presenter.showReport();
        }
    };

    presenter.getPagesData = function addonPrint_Report_getPagesData () {
        var data = {}, page, total;

        for(var i = 0; i < presenter.pageCount; i += 1) {
            page = presenter.presentation.getPage(i);
            if (page.isReportable()) {
                data[i + 1] = presenter.getPageData(page);
            }
        }
        page = null;

        total = presenter.calculateTotal(data);

        return {
            pages: data,
            total: total
        };
    };

    presenter.getPageData = function addonPrint_Report_getPageData (page) {
        var id = page.getId(),
            score = presenter.scoreService.getPageScoreById(id),
            time = presenter.timeService.getPageTimeById(id),
            percentageScore;

        if (score.score === 0 && score.maxScore === 0) {
            if (page.isVisited()) {
                percentageScore = 100;
            } else {
                percentageScore = 0;
            }
        } else {
            percentageScore = parseInt(Math.floor( (score.score / score.maxScore) * 100 ));
        }

        return {
            'name': page.getName(),
            'score': score.score,
            'maxScore': score.maxScore,
            'percentageScore': percentageScore,
            'mistakes': score.mistakeCount,
            'errors': score.errorCount,
            'checks': score.checkCount,
            'time': parseInt(time),
            'visited': page.isVisited()
        };
    };

    presenter.calculateTotal = function addonPrint_Report_calculateTotal (data) {
        var count = 0, total = {
            'score': 0,
            'maxScore': 0,
            'percentageScore': 0,
            'mistakes': 0,
            'errors': 0,
            'checks': 0,
            'time': 0
        };

        $.each(data, function AddonPrint_Report_calculateTotalEach (_, page) {
            count += 1;
            total.score += page.score;
            total.maxScore += page.maxScore;
            total.percentageScore += page.percentageScore;
            total.mistakes += page.mistakes;
            total.errors += page.errors;
            total.checks += page.checks;
            total.time += page.time;
        });

        total.percentageScore = parseInt(Math.floor( total.percentageScore / count ));
        return total;
    };

    presenter.createPopup = function addonPrint_Report_createPopup () {
        var $popup = $('<div></div>').
                addClass('print-report-popup'),
            $form = $('<div></div>').
                addClass('print-report-form'),
            $firstNameLabel = $('<label></label>').
                addClass('print-report-form-firstname-label').
                text(presenter.configuration.labels.userFirstName),
            $firstName = $('<input>').
                attr('type', 'text').
                attr('value', presenter.user.firstName).
                addClass('print-report-form-firstname'),
            $lastNameLabel = $('<label></label>').
                addClass('print-report-form-lastname-label').
                text(presenter.configuration.labels.userLastName),
            $lastName = $('<input>').
                attr('type', 'text').
                attr('value', presenter.user.lastName).
                addClass('print-report-form-lastname'),
            $confirmBtn = $('<button></button>').
                addClass('print-report-form-confirm-btn').
                text(presenter.configuration.labels.userConfirm),
            $exportBtn = $('<button></button>').
                addClass('export-report-form-confirm-btn').
                text(presenter.configuration.labels.exportCsvReport),
            $cancelBtn = $('<button></button>').
                addClass('print-report-form-cancel-btn').
                text(presenter.configuration.labels.userCancel);

        $form.append(
                $('<div></div>').
                    addClass('print-report-form-firstname-wrapper').
                    append($firstNameLabel).
                    append($firstName)
            ).
            append(
                $('<div></div>').
                    addClass('print-report-form-lastname-wrapper').
                    append($lastNameLabel).
                    append($lastName)
            ).
            append(
                $('<div></div>').
                    addClass('print-report-form-actions').
                    append($cancelBtn).
                    append($confirmBtn).
                    append($exportBtn)
            );

        $popup.css({
            width: presenter.$page.width() + 'px',
            height: presenter.$page.height() + 'px'
        });

        $popup.append($form);

        return $popup;
    };

    presenter.bindPopupEvents = function addonPrint_Report_bindPopupEvents () {
        presenter.$popup.on('click', '.print-report-form-confirm-btn', function addonPrint_Report_onConfirmClick (event) {
            event.preventDefault();
            presenter.hidePopup();
            presenter.showReport();
        });

        presenter.$popup.on('click', '.export-report-form-confirm-btn', function addonPrint_Report_onConfirmClick (event) {
            event.preventDefault();
            presenter.hidePopup();
            presenter.exportButtonClickAction();
        });

        presenter.$popup.on('click', '.print-report-form-cancel-btn', function addonPrint_Report_onCancelClick (event) {
            event.preventDefault();
            presenter.hidePopup();
        });

        presenter.$popup.on('input', '.print-report-form-firstname', function addonPrint_Report_onFirstNameInput () {
            presenter.user.firstName = $(this).val();
        });

        presenter.$popup.on('input', '.print-report-form-lastname', function addonPrint_Report_onLastNameInput () {
            presenter.user.lastName = $(this).val();
        });
    };

    presenter.unbindPopupEvents = function addonPrint_Report_unbindPopupEvents () {
        presenter.$popup.off();
    };

    presenter.showPopup = function AddonPrint_Report_showPopup (exportButtonClicked) {
        if(exportButtonClicked){
            presenter.$popup.find('.print-report-form-confirm-btn').hide();
        }else{
            presenter.$popup.find('.export-report-form-confirm-btn').hide();
        }

        var $firstName = presenter.$popup.find('.print-report-form-firstname'),
            $lastName = presenter.$popup.find('.print-report-form-lastname');

        $firstName.attr('value', presenter.user.firstName);
        $lastName.attr('value', presenter.user.lastName);

        $firstName = null;
        $lastName = null;

        presenter.$wrapper.hide();
        presenter.$exportButton.hide();

        presenter.$view.
            removeAttr('style class').
            css({
                'width': presenter.$page.width() + 'px',
                'height': presenter.$page.height() + 'px',
                'z-index': 9999
            });

        presenter.$popup.show();
        presenter.$body.animate({scrollTop: presenter.$popup.offset().top}, 'fast', 'swing');
    };

    presenter.hidePopup = function AddonPrint_Report_hidePopup () {
        presenter.$popup.hide();

        presenter.$view.
            removeAttr('style class').
            attr('style', presenter.originalViewStyles).
            attr('class', presenter.originalViewClasses);

        presenter.$popup.find('.print-report-form-confirm-btn').show();
        presenter.$popup.find('.export-report-form-confirm-btn').show();
        presenter.$wrapper.show();
        if(presenter.configuration.report.showExportButton){
            presenter.$exportButton.show();
        }
    };

    presenter.showReport = function addonPrint_Report_showReport () {
        var data = presenter.getPagesData(),
            $reportHtml = presenter.prepareReportHtml(data),
            reportWindow = window.open();

        $(reportWindow.document).ready(function addonPrint_Report_onReportWindowReady () {
            $(reportWindow.document.body).html($reportHtml);
            reportWindow = null;
            $reportHtml = null;
        });
    };

    presenter.prepareReportHtml = function addonPrint_Report_prepareReportHtml (data) {
        var $reportWrapper = $('<section></section>').addClass('wrapper'),
            $reportDefaultStyles = $('<style></style>'),
            $reportStyles = $('<style></style>').text(presenter.configuration.styles),
            $reportActions = presenter.prepareReportActionsHtml(),
            $reportHeader = presenter.prepareReportHeaderHtml(),
            $reportTable = presenter.prepareReportTableHtml(data);

        $reportDefaultStyles.text(
            '@media print and (color) { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }' +
            'body { width: 210mm; margin: 0 auto; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;' +
                'font-size: 14px; line-height: 20px; color: #333333; padding: 0; }' +
            'h1, h2 { line-height: 40px; margin: 0; }' +
            'h1 { font-size: 38.5px; }' +
            'h2 { font-size: 31.5px; }' +
            'table { width: 100%; max-width: 100%; border-collapse: collapse; border-spacing: 0; ' +
            'background-color: transparent; }' +
            'table th, table td { padding: 8px; line-height: 20px; text-align: left; vertical-align: top; }' +
            'table td { border-top: 1px solid #dddddd; }' +
            'table tbody > tr:nth-child(odd) td { background: #f9f9f9; }' +
            '.percentage-score-label, .percentage-score { color: blue; }' +
            '.checks-label, .checks { color: green; }' +
            '.mistakes-label, .mistakes { color: brown; }' +
            '.errors-label, .errors { color: red; }' +
            '.page-score-label, .page-score { color: blue; font-weight: bold; }' +
            '.total td { border-top: 3px solid #dddddd; font-weight: bold; }' +
            '.actions { border: 1px solid #ccc; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; ' +
                'border-top-width: 0; margin-bottom: 10px; overflow: auto; background: #fff; }' +
            '.actions button { display: inline-block; padding: 6px 12px; margin: 5px; font-size: 14px;' +
                'font-weight: bold; line-height: 1.42857143; text-align: center; white-space: nowrap;' +
                'vertical-align: middle; background-image: none; border: 1px solid transparent; border-radius: 4px;' +
                'cursor: pointer; }' +
            '.actions button.close { background: #ff0000; color: #ffffff; float: left; }' +
            '.actions button.print { background: #0000ff; color: #ffffff; float: right; }' +
            '@media print { body { width: 100% } .actions { display: none; } }'
        );

        $reportWrapper.append($reportDefaultStyles);
        $reportWrapper.append($reportStyles);
        $reportWrapper.append($reportActions);
        $reportWrapper.append($reportHeader);
        $reportWrapper.append($reportTable);

        return $reportWrapper;
    };

    presenter.prepareReportActionsHtml = function addonPrint_Report_prepareReportActionsHtml () {
        var $actions = $('<div></div>').addClass('actions');

        $actions.append(
            $('<button></button>').
                addClass('close').
                text(presenter.configuration.labels.closeReport).
                attr('onclick', 'javascript:window.close()')
        ).
        append(
            $('<button></button>').
                addClass('print').
                text(presenter.configuration.labels.printReport).
                attr('onclick', 'javascript:window.print()')
        );

        return $actions;
    };

    presenter.prepareMonthFormat = function addonPrint_Report_prepareMonthFormat (month) {
        if(month.toString().length < 2){
            return "0" + month;
        }

        return month;
    };

    presenter.prepareYearFormat = function addonPrint_Report_prepareYearFormat (year) {
        return year.toString().substring(2);
    };

    presenter.prepareDate = function addonPrint_Report_prepareDate (format) {
        var date = new Date(),
            day = date.getDate(),
            month = presenter.prepareMonthFormat(date.getMonth()+1),
            year = presenter.prepareYearFormat(date.getFullYear());


        switch(format) {
            case "dd-mm-yy":
                return day + "-" + month + "-" + year;
                break;
            case "mm-dd-yy":
                return month + "-" + day + "-" + year;
                break;
            case "yy-mm-dd":
                return year + "-" + month + "-" + day;
                break;
            case "dd/mm/yy":
                return day + "/" + month + "/" + year;
                break;
            case "mm/dd/yy":
                return month + "/" + day + "/" + year;
                break;
            case "yy/mm/dd":
                return year + "/" + month + "/" + day;
                break;
            default:
                return day + "-" + month + "-" + year;
        }
    };

    presenter.prepareReportHeaderHtml = function addonPrint_Report_prepareReportHeaderHtml () {
        var $header = $('<div></div>').addClass('header');

        if (presenter.configuration.report.title) {
            $header.append(
                $('<div></div>').addClass('title').append(
                    $('<h1></h1>').text(presenter.configuration.labels.title)
                )
            );
        }

        if (presenter.configuration.report.subtitle) {
            $header.append(
                $('<div></div>').addClass('subtitle').append(
                    $('<h2></h2>').text(presenter.configuration.labels.subtitle)
                )
            );
        }

        if(presenter.configuration.report.date) {
            $header.append(
                $('<div></div>').addClass('date').append(
                    $('<h2></h2>').text(presenter.prepareDate(presenter.configuration.labels.date))
                )
            )
        }

        if (presenter.configuration.report.username) {
            $header.append(
                $('<div></div>').addClass('user').append(
                        $('<span></span>').addClass('firstname').text(presenter.user.firstName || '')
                    ).
                    append(' ').
                    append(
                        $('<span></span>').addClass('lastname').text(presenter.user.lastName || '')
                    )
            );
        }

        return $header;
    };

    presenter.prepareReportTableHtml = function addonPrint_Report_prepareReportTableHtml (data) {
        var $report = $('<div></div>').addClass('report'),
            $table = $('<table></table>'),
            $header = presenter.prepareReportTableHeaderHtml(),
            $body = presenter.prepareReportTableBodyHtml(data.pages, data.total);

        $table.append($header).append($body);
        $report.append($table);

        return $report;
    };

    presenter.prepareReportTableHeaderHtml = function addonPrint_Report_prepareReportTableHeaderHtml () {
        var $header = $('<thead></thead>'),
            $row = $('<tr></tr>');

        $row.append(
            $('<th></th>').addClass('name-label')
        );

        if (presenter.configuration.report.percentageScore) {
            $row.append(
                $('<th></th>').addClass('percentage-score-label').text(presenter.configuration.labels.percentageScore)
            );
        }

        if (presenter.configuration.report.checks) {
            $row.append(
                $('<th></th>').addClass('checks-label').text(presenter.configuration.labels.checks)
            );
        }

        if (presenter.configuration.report.mistakes) {
            $row.append(
                $('<th></th>').addClass('mistakes-label').text(presenter.configuration.labels.mistakes)
            );
        }

        if (presenter.configuration.report.errors) {
            $row.append(
                $('<th></th>').addClass('errors-label').text(presenter.configuration.labels.errors)
            );
        }

        if (presenter.configuration.report.pageScore) {
            $row.append(
                $('<th></th>').addClass('page-score-label').text(presenter.configuration.labels.pageScore)
            );
        }

        if (presenter.configuration.report.timePerPage) {
            $row.append(
                $('<th></th>').addClass('time-per-page-label').text(presenter.configuration.labels.timePerPage)
            );
        }

        $header.append($row);
        return $header;
    };

    presenter.prepareReportTableBodyHtml = function addonPrint_Report_prepareReportTableBodyHtml (pagesData, total) {
        var $body = $('<tbody></tbody>');

        $.each(pagesData, function AddonPrint_Report_prepareReportTableBodyHtmlEach (_, page) {
            $body.append(
                presenter.prepareReportTableBodyRowHtml(page)
            );
        });

        if (presenter.configuration.report.total) {
            total.name = presenter.configuration.labels.total;

            $body.append(
                presenter.prepareReportTableBodyRowHtml(total).addClass('total')
            );
        }

        return $body;
    };

    presenter.prepareReportTableBodyRowHtml = function addonPrint_Report_prepareReportTableBodyRowHtml (pageData) {
        var $row = $('<tr></tr>');

        $row.append(
            $('<td></td>').addClass('name').text(pageData.name)
        );

        if (presenter.configuration.report.percentageScore) {
            $row.append(
                $('<td></td>').addClass('percentage-score').text(pageData.percentageScore + '%')
            );
        }

        if (presenter.configuration.report.checks) {
            $row.append(
                $('<td></td>').addClass('checks').text(pageData.checks)
            );
        }

        if (presenter.configuration.report.mistakes) {
            $row.append(
                $('<td></td>').addClass('mistakes').text(pageData.mistakes)
            );
        }

        if (presenter.configuration.report.errors) {
            $row.append(
                $('<td></td>').addClass('errors').text(pageData.errors)
            );
        }

        if (presenter.configuration.report.pageScore) {
            $row.append(
                $('<td></td>').addClass('page-score').text(pageData.score + '/' + pageData.maxScore)
            );
        }

        if (presenter.configuration.report.timePerPage) {
            $row.append(
                $('<td></td>').addClass('time-per-page').text(
                    presenter.humanReadableTime(pageData.time,
                        {
                            days: presenter.configuration.labels.timePerPageDays,
                            hours: presenter.configuration.labels.timePerPageHours,
                            minutes: presenter.configuration.labels.timePerPageMinutes,
                            seconds: presenter.configuration.labels.timePerPageSeconds
                        })
                )
            );
        }

        return $row;
    };

    presenter.humanReadableTime = function addonPrint_Report_humanReadableTime (time, labels) {
        var seconds, minutes,hours, days, output = '';

        seconds = parseInt( Math.floor( time / 1000 ) );

        minutes = parseInt( Math.floor( seconds / 60 ) );

        if (minutes > 0) {
            seconds = seconds - (minutes * 60);
        }

        hours = parseInt( Math.floor( minutes / 60 ) );

        if (hours > 0) {
            minutes = minutes - (hours * 60);
        }

        days = parseInt( Math.floor( hours / 24 ) );

        if (days > 0) {
            hours = hours - (days * 24);
        }

        output = seconds + labels.seconds;

        if (minutes > 0) {
            output = minutes + labels.minutes + ' ' + output;
        }
        if (hours > 0) {
            output = hours + labels.hours + ' ' + output;
        }
        if (days > 0) {
            output = days + labels.days + ' ' + output;
        }

        return output;
    };

    presenter.executeCommand = function addonPrint_Report_executeCommand (name) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, [], presenter);
    };

    presenter.setVisibility =  function addonPrint_Report_setVisibility (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.setPlayerController = function addonPrint_Report_setPlayerController (controller) {
        presenter.playerController = controller;
        presenter.presentation = controller.getPresentation();
        presenter.pageCount = presenter.presentation.getPageCount();
        presenter.scoreService = controller.getScore();
        presenter.timeService = controller.getTimeService();
    };

    presenter.createPreview = function addonPrint_Report_createPreview (view, model) {
        presenter.logic(view, model, true);
    };

    presenter.run = function addonPrint_run (view, model){
        presenter.logic(view, model, false);

        presenter.view = view;

        MutationObserverService.createDestroyObserver(presenter.configuration.ID, presenter.destroy, presenter.view);
        MutationObserverService.setObserver();
    };

    presenter.destroy = function addonPrint_Report_destroy () {
        presenter.$wrapper.off();
        presenter.$exportButton.off();
        presenter.unbindPopupEvents();

        presenter.user = null;
        presenter.configuration = null;
        presenter.originalViewStyles = null;
        presenter.originalViewClasses = null;

        presenter.playerController = null;
        presenter.presentation = null;
        presenter.pageCount = null;
        presenter.scoreService = null;
        presenter.timeService = null;

        presenter.$popup = null;
        presenter.$wrapper = null;
        presenter.$page = null;
        presenter.$view = null;
        presenter.$body = null;
        presenter.view = null;
        presenter.$exportButton = null;

        presenter.destroy = null;
        presenter = null;
    };

    presenter.show = function addonPrint_Report_show () {
        if (!presenter.configuration.isVisible) {
            presenter.setVisibility(true);
            presenter.configuration.isVisible = true;
        }
    };

    presenter.hide = function addonPrint_Report_hide () {
        if (presenter.configuration.isVisible) {
            presenter.setVisibility(false);
            presenter.configuration.isVisible = false;
        }
    };

    presenter.reset = function addonPrint_Report_reset () {
        presenter.hidePopup();
        presenter.user.firstName = '';
        presenter.user.lastName = '';
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    presenter.getState = function addonPrint_Report_getState () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            user: presenter.user
        });
    };

    presenter.setState = function addonPrint_Report_setState (state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        if (parsedState.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }

        if (parsedState.user) {
            presenter.user.firstName = parsedState.user.firstName || '';
            presenter.user.lastName = parsedState.user.lastName || '';
        } else {
            presenter.user.firstName = '';
            presenter.user.lastName = '';
        }
    };

    presenter.validateModel = function addonPrint_Report_validateModel (model) {
        return {
            'report': {
                'title': ModelValidationUtils.validateBoolean(model.Title),
                'subtitle': ModelValidationUtils.validateBoolean(model.Subtitle),
                'username': ModelValidationUtils.validateBoolean(model.Username),
                'percentageScore': ModelValidationUtils.validateBoolean(model.PercentageScore),
                'checks': ModelValidationUtils.validateBoolean(model.Checks),
                'mistakes': ModelValidationUtils.validateBoolean(model.Mistakes),
                'errors': ModelValidationUtils.validateBoolean(model.Errors),
                'pageScore': ModelValidationUtils.validateBoolean(model.PageScore),
                'timePerPage': ModelValidationUtils.validateBoolean(model.TimePerPage),
                'total': ModelValidationUtils.validateBoolean(model.Total),
                'date': ModelValidationUtils.validateBoolean(model.Date),
                'showExportButton': ModelValidationUtils.validateBoolean(model.ShowExportButton)
            },
            'labels': {
                'title': model.TitleLabel,
                'subtitle': model.SubtitleLabel,
                'percentageScore': model.PercentageScoreLabel,
                'checks': model.ChecksLabel,
                'mistakes': model.MistakesLabel,
                'errors': model.ErrorsLabel,
                'pageScore': model.PageScoreLabel,
                'timePerPage': model.TimePerPageLabel,
                'total': model.TotalLabel,
                'timePerPageDays': model.TimePerPageDaysLabel || 'd',
                'timePerPageHours': model.TimePerPageHoursLabel || 'h',
                'timePerPageMinutes': model.TimePerPageMinutesLabel || 'm',
                'timePerPageSeconds': model.TimePerPageSecondsLabel || 's',
                'userFirstName': model.UsernameFirstLabel || 'First name',
                'userLastName': model.UsernameLastLabel || 'Last name',
                'userConfirm': model.UsernameConfirmLabel || 'Generate',
                'userCancel': model.UsernameCancelLabel || 'Cancel',
                'closeReport': model.CloseReportLabel || 'Close',
                'printReport': model.PrintReportLabel || 'Print',
                'exportCsvReport': model.ExportCsvLabel || 'Export report',
                'date': model.DateLabel

            },
            'styles': model.Styles,
            'text': model.Text,
            'isVisible': ModelValidationUtils.validateBoolean(model['Is Visible']),
            'isVisibleByDefault': ModelValidationUtils.validateBoolean(model['Is Visible']),
            'ID': model['ID']
        };
    };

    presenter.setShowErrorsMode = function addonPrint_Report_setShowErrorsMode () {};

    presenter.setWorkMode = function addonPrint_Report_setWorkMode () {};

    return presenter;
}