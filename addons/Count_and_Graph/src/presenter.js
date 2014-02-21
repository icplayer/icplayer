function AddonCount_and_Graph_create(){
    var presenter = function(){};

    presenter.seriesColors      = [];
    presenter.drawingXPosition  = null;
    presenter.absoluteRange     = null;
    presenter.chartInner        = null;
    presenter.axisXLine         = null;
    presenter.eventBus          = null;
    presenter.playerController  = null;
    presenter.errorMode         = false;
    presenter.isStarted         = false;
    presenter.charData          = null;
    presenter.charOptions       = {};
    presenter.chart = null;
    presenter.xAxisSeriesDescriptions = [];
    presenter.xAxisSeriesDescriptionImages = [];

    presenter.$view             = null;
    presenter.configuration     = {};
    presenter.selected          = [];

    presenter.ERROR_MESSAGES = {
        DATA_ROW_NOT_ENOUGH_COLUMNS:      "Row %row% in data contains not enough columns, minimum amount of columns is 2 - first indicates X axis description, second and further contain values",
        DATA_ROW_MALFORMED:               "Row %row% is not valid CSV - check its syntax",
        DATA_ROW_VALUE_NOT_NUMERIC:       "Value \"%value%\" of column %column% of row %row% is not numeric",
        DATA_ROW_DIFFERENT_COLUMNS_COUNT: "Row %row% contains different amount of columns than previous rows",
        AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC: "Y axis maximum value is not numeric",
        AXIS_Y_MINIMUM_VALUE_NOT_NUMERIC: "Y axis minimum value is not numeric",
        AXIS_Y_MAXIMUM_VALUE_TOO_SMALL:   "Cannot fit graph into view container - Y axis maximum value of %range% is smaller than maximum value %value% passed with the data",
        AXIS_Y_MINIMUM_VALUE_TOO_BIG:     "Cannot fit graph into view container - Y axis minimum value of %range% is bigger than minimum value %value% passed with the data",
        AXIS_Y_DOES_NOT_INCLUDE_ZERO:     "Invalid Y axis minimum & maximum value - graph should contain value of zero",
        AXIS_Y_GRID_STEP_NOT_NUMERIC:     "Y axis grid step is not numeric",
        SERIES_COLORS_AMOUNT_INVALID:     "Amount of Series colors is different that amount of columns in the data",
        INTERACTIVE_STEP_NOT_NUMERIC:     "Interactive step is not numeric",
        INTERACTIVE_STEP_NOT_POSITIVE:    "Interactive step is not a positive integer",
        ANSWER_NOT_NUMERIC:               "Answer \"%answer%\" is not numeric",
        ANSWERS_AMOUNT_INVALID:           "Amount of answers (%answers%) has to be equal amount of bars (%bars%)",
        AXIS_X_SERIES_DESCRIPTIONS_AMOUNT_INVALID: "Amount of X axis series descriptions (%descriptions%) has to be equal to amount of series (%series%)",
        AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID:   "Amount of X axis bars descriptions (%descriptions%) has to be equal to amount of bars (%bars%)"
    };

    presenter.showErrorMessage = function(message, substitutions) {
    //    console.log("");
        var errorContainer;
        if(typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for(var key in substitutions) {
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        presenter.$view.html(errorContainer);
    };



    presenter.setPlayerController = function(controller) {
        console.log("");
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    function drawChartfromData() {
        console.log("draw from data")
        for (var l = 0; l < presenter.configuration.columnsCount; l++) {
                   console.log("wykres: " + l + "count: " + presenter.configuration.columnsCount +"sel:" + presenter.selected[l]+", col:  " + presenter.seriesColors[l] )
            for (var i = 1; i <= presenter.selected[l]; i++) {
                            console.log("i: " + i + "answer: " + presenter.configuration.answers[l]);
                console.log(presenter.charData)
                presenter.charData.setValue(l,i*2, 'stroke-color: #000000; stroke-width: 0.8; fill-color: ' + presenter.seriesColors[l] ) ;
                console.log("draw from data21")
            }
            console.log("draw from data2")
        }

           console.log(presenter.charData )   ;
              console.log(presenter.charOptions );
        presenter.chart.draw(presenter.charData , presenter.charOptions);
    }

     presenter.setShowErrorsMode = function() {
    //    console.log("setShowErrorsMode");
//        if (!presenter.isStarted) {
//            return 0;
//        }

        presenter.errorMode = true;
        presenter.configuration.shouldCalcScore = true;

         for (var l = 0; l < presenter.configuration.columnsCount; l++) {
                  //    console.log("wykres: " + l + "count: " + presenter.configuration.columnsCount)
                    for (var i = 1; i <= presenter.selected[l]; i++) {
                //        console.log("i: " + i + "answer: " + presenter.configuration.answers[l]);
                        if (i<=presenter.configuration.answers[l])
                            presenter.charData.setValue(l,i*2, 'stroke-color: #009933; stroke-width: 2; fill-color: ' + presenter.seriesColors[l] ) ;
                        else
                            presenter.charData.setValue(l,i*2, 'stroke-color: #CC0033; stroke-width: 2; fill-color: ' + presenter.seriesColors[l] ) ;
                     }
}
       //      console.log(presenter.charData )   ;
             //       console.log(data);
         presenter.chart.draw(presenter.charData , presenter.charOptions);


    };

    presenter.setWorkMode = function() {
//        console.log("work mode");
        presenter.errorMode = false;
        presenter.configuration.shouldCalcScore = true;

        drawChartfromData();

    };

    presenter.calcScore = function () {
        var score = 0;
        for (var i=0;i<presenter.configuration.columnsCount;i++)
        {
            score += Math.min(presenter.configuration.answers[i], presenter.selected[i]) ;
        }
        return score;
    };

    presenter.getScore = function() {
        console.log("");
//        if (!presenter.configuration.isInteractive || !presenter.configuration.shouldCalcScore || !presenter.isStarted) {
//            return 0;
//        }

        return presenter.calcScore();
    };

    presenter.getMaxScore = function() {
//        if (!presenter.configuration.shouldCalcScore || !presenter.isStarted) {
//            return 0;
//        }
        var maxScore = 0;
        for (var i=0;i<presenter.configuration.columnsCount;i++)
               maxScore += presenter.configuration.answers[i] ;
            console.log("maxScore = " + maxScore);
        return maxScore;
    };

    presenter.getErrorCount = function() {
//        if (!presenter.configuration.shouldCalcScore || !presenter.isStarted) {
//            return 0;
//        }
        var errorCount = 0;
        var dif=0;
        for (var i=0;i<presenter.configuration.columnsCount;i++)
        {
    //       console.log(i +" " + presenter.configuration.answers[i] + " " + presenter.selected[i])
            dif = presenter.selected[i] - presenter.configuration.answers[i];
            if (dif > 0) errorCount += dif;
          //  errorCount += Math.min(presenter.configuration.answers[i], presenter.selected[i]) ;
//            console.log(score)
        }
        return errorCount;
    };

    presenter.getState = function() {
//        var r = [];
//        presenter.$view.find('.graph_value_container').each(function(index, element) {
//            r.push(parseFloat($(element).attr('current-value')));
//        });
        var state = {
            selected : presenter.selected,
            'isVisible' : presenter.configuration.isVisible,
            shouldCalcScore: presenter.configuration.shouldCalcScore,
            isStarted: presenter.isStarted
        };
        return JSON.stringify(state);
    };


    presenter.setState = function(stateString) {
        var state = JSON.parse(stateString);

//        for (i = 0; i < r.length; i++) {
//            currentValueContainer = $(valueContainers[i]);
//            currentValueContainer.attr('current-value', parseFloat(r[i]));
//            presenter.redrawGraphValue(currentValueContainer);
//        }

        presenter.setVisibility(state.isVisible);
        presenter.selected = state.selected;
        console.log(presenter.selected)
        presenter.configuration.isVisible = state.isVisible;
        presenter.configuration.shouldCalcScore = state.shouldCalcScore;
        presenter.isStarted = state.isStarted;

        $( document ).ready( drawChartfromData());
        console.log("end")
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
        presenter.configuration.shouldCalcScore = true;
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
        presenter.configuration.shouldCalcScore = true;
    };

     presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide' : presenter.hide,
            'getValue': presenter.getValue
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

         function createChartArray()
         {
             var dataArray = [];
             var naglowek = [];
             var rowArray = [];

             naglowek[0] = '';
             rowArray[0] = '';

             for (var i=1; i<=presenter.configuration.axisYMaximumValue; i++){
                 naglowek.push('');
                 naglowek.push({ role: 'style' });
                 rowArray.push(1);
                 rowArray.push(   'stroke-color: #000000; stroke-width: 0.8; fill-color: #FFFFFF')    ;
             }
            console.log(naglowek) ;
            console.log(rowArray)

             dataArray[0] = naglowek      ;
             for (var i=1; i<=presenter.configuration.columnsCount; i++){
           //    console.log(presenter.xAxisSeriesDescriptions.length)
          //       console.log(presenter.xAxisSeriesDescriptions)
                 dataArray[i] = rowArray;
                 if (presenter.xAxisSeriesDescriptions.length > 0)
                    dataArray[i][0] = presenter.xAxisSeriesDescriptions[i-1];
             }
             console.log(dataArray) ;

             return dataArray;

         }

        function setChartOptions()
        {
           var options = {
                //       width: presenter.configuration.width,
                legend: 'none',
               tooltip: { trigger: 'selection' },
                height: presenter.configuration.height2,
                bar: { groupWidth: presenter.configuration.barsWidth*0.66 },
                vAxis: {
                    title: presenter.configuration.axisYDescription  ,
                    maxValue:   presenter.configuration.axisYMaximumValue,
                    gridlines: {count: -1}
                },
               hAxis: {
                   title: presenter.configuration.axisXDescription
               },
                isStacked: true
            };


            return options;
        }
        function drawChart() {
            console.log(presenter.configuration.axisYMaximumValue+ ", "+ presenter.configuration.columnsCount);
            var dataArray = createChartArray();
    //        console.log(dataArray)
            presenter.charData  = google.visualization.arrayToDataTable( dataArray);
            if (presenter.xAxisSeriesDescriptionImages.length > 0)
            for (var i=0; i<presenter.configuration.columnsCount; i++){
//                console.log(presenter.xAxisSeriesDescriptionImages[i])

                if (presenter.xAxisSeriesDescriptionImages[i] != '')
                presenter.charData.setValue(i,0, "XASDI_" +i ) ;
                //dataArray[i][0] = presenter.xAxisSeriesDescriptionImages[i-1];
            }

  //          console.log(presenter.charData);
            presenter.charOptions = setChartOptions();

            //           console.log("chart2.1");



            presenter.chart = new google.visualization.ColumnChart(document.getElementById('countGraph'));
            google.visualization.events.addListener(presenter.chart, 'ready', readyHandler);
            //           console.log("chart2");
            presenter.chart.draw(presenter.charData, presenter.charOptions);

            //       console.log("chart3");



            function readyHandler() {
    //            console.log("podmianka")  ;

                $('text').each(function(i, el) {

                    if (el.textContent != undefined)   {
      //              console.log(i);
                    console.log(el.textContent);
                    if (el.textContent.split("_")[0] == 'XASDI') {
              //      if (presenter.xAxisSeriesDescriptionImages.indexOf(el.textContent) != -1) {
          //              console.log("podmieniamy")

            //            console.log(el);
                        var g = el.parentNode;
                        var x = el.getAttribute('x');
                        var y = el.getAttribute('y');
                        var width = el.getAttribute('width') || 50;
                        var height = el.getAttribute('height') || 50;

                        // A "ForeignObject" tag is how you can inject HTML into an SVG document.
                        var fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")   ;
                        fo.setAttribute('x', x - 16);
                        fo.setAttribute('y', y - 15);
                        $(fo).addClass(  "countGraph_image"        );
                        fo.setAttribute('height', height);
                        fo.setAttribute('width', width);
                        var body = document.createElementNS("http://www.w3.org/1999/xhtml", "BODY");
                        var a = document.createElement("img");
                        $(a).attr('src', presenter.xAxisSeriesDescriptionImages[el.textContent.split("_")[1]]);
                        $(a).addClass(  "countGraph_image"        );
//                       a.setAttribute('height', height);
//                        a.setAttribute('width', width);
////                        a.innerHTML = el.textContent;
                        body.appendChild(a);
                        fo.appendChild(body);

              //          console.log(fo)
                        // Remove the original SVG text and replace it with the HTML.
                        g.removeChild(el);
                        g.appendChild(fo);
                    }          }
                });
                //console.log("koniec podmianki")  ;

            }


            // Add our selection handler.
            google.visualization.events.addListener(presenter.chart, 'select', selectHandler);

            function selectHandler() {
                var selection = presenter.chart.getSelection();
                var item = selection[0];
                if (item.row != null && item.column != null) {
                    var selectedItem =  (Math.floor(item.column/2)+1);
                    if (selectedItem > presenter.selected[item.row])  {
                        for (var i = 1; i <= item.column; i=i+2) {
                            presenter.charData.setValue(item.row,i+1, 'stroke-color: #000000; stroke-width: 0.8; fill-color: ' + presenter.seriesColors[item.row] ) ;

                        }


                    } else
                    {
                        for (var i = item.column+2; i < (presenter.configuration.axisYMaximumValue*2)+1; i=i+2) {
                            presenter.charData.setValue(item.row,i+1, 'stroke-color: #000000; stroke-width: 0.8; fill-color: #FFFFFF' ) ;

                        }
                    }
                    presenter.selected[item.row]= selectedItem;
                }
                console.log(presenter.selected)   ;
                //       console.log(data);
                presenter.chart.draw(presenter.charData, presenter.charOptions);
            }
        }


    presenter.run = function(view, model) {
        console.log("Run");
        presenter.initialize(view, model, false);


      //  $("piechart").css('width','600') ;
        $.getScript("https://www.google.com/jsapi", function(){
            google.load("visualization", "1", {packages:["corechart"], callback:drawChart})   ;


        });

    };

    presenter.createPreview = function(view, model) {
        console.log("createPreview");
        presenter.initialize(view, model, true);
    };

    presenter.validateModel = function (model) {
        console.log("validateModel2");
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

//        // poczatkowe wartosci
//        var data2 = $.csv2Array(model['Data']);

        // Y-axis maximum value
        var modelYAxisMaximumValue = model['Y axis maximum value'];
        var axisYMaximumValue = ModelValidationUtils.validateFloat(modelYAxisMaximumValue);
        console.log("maxVa: ")
        console.log(axisYMaximumValue)
        if (!axisYMaximumValue.isValid) {
            return { isValid: false, errorCode: 'AXIS_Y_MAXIMUM_VALUE_NOT_NUMERIC' };
        }
        console.log(axisYMaximumValue.parsedValue)
        if (model['Series colors'].length != model['Number of columns']) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.SERIES_COLORS_AMOUNT_INVALID);
            return {isValid: false};
        }

    return {
            isValid: true,
            ID: model.ID,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            shouldCalcScore: false,
            axisYMaximumValue: axisYMaximumValue.parsedValue,
            axisYDescription: model['Y axis description'] ,
            axisXDescription: model['X axis description'],
            barsWidth: model['Bars width'] ,
            results: [],
            height2: model['Height']    ,
            columnsCount: model['Number of columns']
        };
    };

    presenter.validateAnswers = function (answers, barsCount) {
        var validatedAnswers = [], i;

        for (i = 0; i < answers.length; i++) {
            var answer = answers[i]['Answer'];


            var parseAnswer = parseFloat(answer);
            if (isNaN(parseAnswer)) {
                return { isValid: false, errorCode: 'ANSWER_NOT_NUMERIC', errorMessageSubstitutions: { answer: i + 1 } };
            }

            validatedAnswers.push(parseAnswer);
        }

        if (validatedAnswers.length != barsCount) {
            return { isValid: false, errorCode: 'ANSWERS_AMOUNT_INVALID', errorMessageSubstitutions: { answers: validatedAnswers.length, bars: barsCount } };
        }

        return {
            isValid: true,
            answers: validatedAnswers
        };
    };

    presenter.initialize = function(view, model, isPreview) {
        console.log("init");
        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);
        console.log("conf")
        console.log(presenter.configuration)
        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }
        console.log("conf is ok")

        presenter.setVisibility(presenter.configuration.isVisible);

    //    console.log(presenter.configuration.columnsCount);
        for (var i = 0; i<presenter.configuration.columnsCount; i++ ){
            presenter.selected[i]=0;
        }
    //    console.log(presenter.selected)  ;

        // Read data
        var currentValue;
        var maximumValue = null;
        var minimumValue = null;
        var i;
        var j;

            // Ensure that rows have valid amount of columns
            if (presenter.configuration.columnsCount < 1) {
                presenter.showErrorMessage(presenter.ERROR_MESSAGES.DATA_ROW_NOT_ENOUGH_COLUMNS, { row: i + 1 });
                return;
            }



        var showXAxisBarsDescriptions = typeof(model['Show X axis bars descriptions']) != 'undefined' && model['Show X axis bars descriptions'] === 'True';
        var showXAxisSeriesDescriptions = typeof(model['Show X axis series descriptions']) != 'undefined' && model['Show X axis series descriptions'] === 'True';

        var xAxisBarsDescriptions = [];
        if (showXAxisBarsDescriptions && typeof(model['X axis bars descriptions']) != 'undefined') {
            for (i = 0; i < model['X axis bars descriptions'].length; i++) {
                xAxisBarsDescriptions.push(model['X axis bars descriptions'][i]['Description']);
            }
        }
        console.log(showXAxisSeriesDescriptions)
        var xAxisSeriesDescriptions = [];
        if (showXAxisSeriesDescriptions && typeof(model['X axis series descriptions']) != 'undefined') {
            for (i = 0; i < model['X axis series descriptions'].length; i++) {
                presenter.xAxisSeriesDescriptions.push(model['X axis series descriptions'][i]['Description']);
                presenter.xAxisSeriesDescriptionImages.push(model['X axis series descriptions'][i]['Description image']);
            }
        }

  //      console.log(presenter.xAxisSeriesDescriptions) ;
  //      console.log(presenter.xAxisSeriesDescriptionImages) ;

        if (showXAxisBarsDescriptions && xAxisBarsDescriptions.length != presenter.configuration.columnsCount) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_X_BARS_DESCRIPTIONS_AMOUNT_INVALID, { bars: barsCount, descriptions: xAxisBarsDescriptions.length });
            return;
        }

//        if (showXAxisSeriesDescriptions && xAxisSeriesDescriptions.length != validRows) {
//            presenter.showErrorMessage(presenter.ERROR_MESSAGES.AXIS_X_SERIES_DESCRIPTIONS_AMOUNT_INVALID, { series: validRows, descriptions: xAxisSeriesDescriptions.length });
//            return;
//        }


        for (i = 0; i < model['Series colors'].length; i++) {
            presenter.seriesColors.push(model['Series colors'][i]['Color']);
        }


        var validatedAnswers = presenter.validateAnswers(model['Answers'], presenter.configuration.columnsCount);
        console.log("answ")
        console.log(validatedAnswers)
        if (!validatedAnswers.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[validatedAnswers.errorCode], validatedAnswers.errorMessageSubstitutions);
            return;
        }

        console.log("answ ok")
        presenter.configuration.answers = validatedAnswers.answers;
        console.log(presenter.configuration.answers);
        presenter.configuration.results = [];

   };
//    });
    return presenter;


}