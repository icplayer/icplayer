function AddonFigureDrawing_create(){
    var presenter = function(){}
    presenter.error = false;
    presenter.isEraser = false;
    presenter.isStarted = false;
    presenter.isErrorMode = false;
    presenter.isShowAnswersActive = false;
    presenter.executeCommand = function(name, params) {
        switch(name.toLowerCase()) {
            case 'hide'.toLowerCase():
                presenter.hide();
                break;
            case 'show'.toLowerCase():
                presenter.show();
                break;
            case 'reset'.toLowerCase():
                presenter.reset();
                break;
            case 'disable'.toLowerCase():
                presenter.disable();
                break;
            case 'enable'.toLowerCase():
                presenter.enable();
                break;
            case 'isAllOK'.toLowerCase():
                presenter.isAllOK();
                break;
            case 'isAttempted'.toLowerCase():
                presenter.isAttempted();
                break;
            case 'setColor'.toLowerCase():
                presenter.setColor(params[0]);
                break;
            case 'setDrawMode'.toLowerCase():
                presenter.setDrawMode();
                break;
            case 'setColorMode'.toLowerCase():
                presenter.setColorMode();
                break;
            case 'setEraserOn'.toLowerCase():
                presenter.setEraserOn();
                break;
            case 'allLinesDrawn'.toLowerCase():
                presenter.allLinesDrawn();
                break;
        }
    };
    presenter.allLinesDrawn = function() {
        var i, j, line, line2, color, counter = 0, errorCounter = presenter.$view.find('.line').not('.nonremovable').length, numberOfAnswers = presenter.AnswerLines.length;
        if (presenter.activity && !presenter.error) {
            for (i = 0; i <= numberOfAnswers; i++) {
                line = presenter.$view.find('#'+presenter.AnswerLines[i]);
                if (line.length > 0) {
                    counter++
                    errorCounter--;
                }
            }
        };
        if (counter == numberOfAnswers && errorCounter == 0)
            return true
        else
            return false;
    };
    presenter.setDrawMode = function(color) {
        presenter.drawingMode = true;
    };
    presenter.setColorMode = function() {
        if (presenter.coloring && (!presenter.blockColoring || presenter.allLinesDrawn())) {
            presenter.drawingMode = false;
            presenter.selected.isSelected = false;
            presenter.$view.find('.selected').removeClass('selected');
        }
    };
    presenter.setColor = function(color) {
        presenter.isEraser = false;
        presenter.currentColor = validateColor(color,false);
    };
    presenter.setEraserOn = function() {
        presenter.isEraser = true;
        presenter.currentColor = [255,255,255,0];
    };
    presenter.isAttempted = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        return presenter.isStarted;
    };
    presenter.isAllOK = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        return ((presenter.getScore() == presenter.getMaxScore()) && (presenter.getErrorCount() === 0));
    };
    presenter.disable = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        if (!(presenter.$view.find('.disabled').length > 0)) {
            presenter.disabled = true;
            presenter.$view.find('.figure').addClass('disabled');
            presenter.$view.find('.chart').addClass('disabled');
        }
    };
    presenter.enable = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.disabled = false;
        presenter.$view.find('.disabled').removeClass('disabled');
    };
    presenter.hide = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.isVisible = false;
        presenter.setVisibility(false);
    };
    presenter.show = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.isVisible = true;
        presenter.setVisibility(true);
    };
    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        if (presenter.coloring) presenter.$view.find('.canvas').css("visibility", isVisible ? "visible" : "hidden");
    };
    presenter.updateVisibility = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        if (presenter.isVisible) {
            presenter.show();
        } else
            presenter.hide();
    };
    function validateRadius(radius){
        if (radius == '' || radius == 0) {
            return 5;
        } else if (radius > 0) {
            return parseInt(radius)
        } else {
            presenter.error = 'radius';
            return 5;
        }
    };
    function validateStartingColor(params){
        var answer = [], point;
        if (params == '' || params == undefined) return '';
        var pointsData = Helpers.splitLines(params);
        var re = /^\d+;\d+;\d{1,3} \d{1,3} \d{1,3}$/;
        var testing;
        $.each(pointsData, function() {
            if (this != '') {
                testing = re.test(this);
                if (!testing) {
                    presenter.error = 'startingcolor';
                    return '';
                }
                point = this.split(';');
                if (isNaN(point[0]) || isNaN(point[1]) || point[0] < 0 || point[1] < 0 || point[0] > presenter.canvasWidth || point[1] > presenter.canvasHeight) {
                    presenter.error = 'startingcolor';
                    return '';
                }
                colors = validateColor(point[2],false);
                answer.push([parseInt(point[0]),parseInt(point[1]),colors[0],colors[1],colors[2],colors[3]]);
            }
        });
        return answer;
    }
    function validateLines(lines, draw, coloranswers){
        presenter.tmpLine = [];
        if (lines == '' || lines == undefined) return true;
        var Lines = Helpers.splitLines(lines);
        var point, x, y, tmpPoint1, tmpPoint2, nonremovable;
        var re = /^\d+;\d+-\d+;\d+$/;
        var re2 = /^\d+;\d+-\d+;\d+\*$/;
        var testing;
        $.each(Lines, function() {
            if (this != '') {
                nonremovable = true;
                testing = re.test(this);
                if (draw && !testing)
                    testing = re2.test(this);
                if (!testing) {
                    draw ? presenter.error = 'deflines' : presenter.error = 'answerlines';
                    return false;
                }
                splittedByDash = this.split('-');
                point = splittedByDash[0].split(';');
                if (isNaN(point[0]) || isNaN(point[1]) || point[0] > presenter.pointsX+1 || point[1] > presenter.pointsY+1) {
                    draw ? presenter.error = 'deflines' : presenter.error = 'answerlines';
                    return false;
                }
                if (presenter.grid3D && (parseInt(point[0]) + parseInt(point[1])) % 2 == 0) {
                    draw ? presenter.error = 'deflines' : presenter.error = 'answerlines';
                    return false;
                }
                x = countX(point[0]); y = countY(point[1]);
                tmpPoint1 = new Point(parseInt(point[1]), parseInt(point[0]), x, y);
                point = splittedByDash[1].split(';');
                if (point[1].slice(-1) == '*' && draw) {
                    nonremovable = false;
                    point[1] = point[1].substr(0,point[1].length-1);
                };
                if (isNaN(point[0]) || isNaN(point[1]) || point[0] > presenter.pointsX+1 || point[1] > presenter.pointsY+1) {
                    draw ? presenter.error = 'deflines' : presenter.error = 'answerlines';
                    return false;
                }
                if (presenter.grid3D && (parseInt(point[0]) + parseInt(point[1])) % 2 == 0) {
                    draw ? presenter.error = 'deflines' : presenter.error = 'answerlines';
                    return false;
                }
                y = countY(point[1]);
                x = countX(point[0]);
                tmpPoint2 = new Point(parseInt(point[1]), parseInt(point[0]), x, y);
                presenter.drawLine(tmpPoint1, tmpPoint2, nonremovable,draw, coloranswers,false);
            }
        });
    }
    function validateAnswersColor(list) {
        presenter.answersColors = [];
        var points, color = [], tmpPoint, helpString, tmpData, i, j, k;
        var re = /^(\d+;\d+-)+(\d+;\d)$/;
        var re2 = /^\d+;\d+;\d{1,3} \d{1,3} \d{1,3}$/;
        var testing;
        for (i = 0; i < list.length; i++) {
            points = [];
            if (tmpPoint == '') {
                presenter.error = 'answerfigure';
                return false;
            }
            testing = re.test(list[i]['Figure']);
            if (!testing) {
                presenter.error = 'answerfigure';
                return false;
            }
            tmpPoint = list[i]['Figure'].split('-');
            for (j=0; j < tmpPoint.length-1; j++) {
                helpString = tmpPoint[j] +'-'+tmpPoint[j+1];
                validateLines(helpString,false, true);
                for (k=0; k < presenter.tmpLine.length;k++)
                    points.push(presenter.tmpLine[k]);
            }
            if (list[i]['Color'] != '') {
                testing = re2.test(list[i]['Color']);
                if (!testing) {
                    presenter.error = 'colorerror';
                    return false;
                }
                color = validateStartingColor(list[i]['Color'])[0]
            }
            tmpData = {
                lines: points,
                x: color[0],
                y: color[1],
                color: color[2]+' '+color[3]+' '+color[4]+' '+color[5],
            };
            if (tmpPoint[0] != tmpPoint[j]) {
                presenter.error = 'answerfigure';
                return false;
            }
            presenter.answersColors.push(tmpData);
        }
    }
    function validateColor(color,isDefault){
        var rgb = color.split(' ');
        if (isNaN(rgb[0]) || isNaN(rgb[1]) || isNaN(rgb[2]) || rgb[0] < 0 || rgb[0] > 255 || rgb[1]<0 || rgb[1]>255 || rgb[2]<0 || rgb[2]>255 || rgb.length != 3)
            (isDefault) ? (presenter.error = 'defcolorerror') : (presenter.error = 'colorerror');
        rgb.push('255');
        return rgb;
    };
    function Point (row, column, x, y) {
        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
    }
    presenter.selected = {
        row: 0,
        column: 0,
        x: 0,
        y: 0,
        isSelected: false,
    }
    var gcd = function(a, b) {
        if (!b) {
            return a;
        }
        return gcd(b, a % b);
    }
    var countX = function(column) {
        if (presenter.grid3D) return (0.5 * column * presenter.grid)
        else return ((parseInt(column)-0.5) * presenter.grid);
    };
    var countY = function(row) {
        if (presenter.grid3D) return ((1/3*(parseInt(row)-1) + 0.5) * presenter.grid)
        else return ((parseInt(row)-0.5) * presenter.grid);
    };
    function uniq(a) {
        return a.sort().filter(function(item, pos) {
            return !pos || item != a[pos - 1];
        })
    }
    function drawOneLine(point1, point2, nonremovable) {
        var newLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        newLine.setAttribute("y1",point1.y);
        newLine.setAttribute("x1",point1.x);
        newLine.setAttribute("y2",point2.y);
        newLine.setAttribute("x2",point2.x);
        newLine.setAttribute("id",'line_'+(point1.column)+'_'+(point1.row)+'_'+(point2.column)+'_'+(point2.row))
        nonremovable ? newLine.setAttribute("class","line nonremovable") : newLine.setAttribute("class","line");
        var firstPoint = presenter.$view.find('.point')[0];
        presenter.$view.find('.chart')[0].insertBefore(newLine,firstPoint);
        if (!presenter.isShowAnswersActive && presenter.coloring) drawLineOnCanvas(point1.x,point1.y,point2.x,point2.y);
    }
    function drawLineOnCanvas(x1,y1,x2,y2) {
        presenter.ctx.beginPath();
        presenter.ctx.moveTo(x1,y1);
        presenter.ctx.lineTo(x2,y2);
        presenter.ctx.closePath();
        presenter.ctx.strokeStyle="rgba(5,5,5,0.8)";
        presenter.ctx.stroke();
    }
    presenter.redrawCanvas = function(showAnswers) {
        //	presenter.canvas.getContext('2d').clearRect(0,0,presenter.canvasWidth,presenter.canvasHeight);
        presenter.canvas.width += 0;
        var line = presenter.$view.find('.line');
        var i, x1, y1, x2, y2, tmpColor, tmpColor2, tmpPoint;
        var indexes = new Array();
        for(i = 0; i < line.length; i++) {
            indexes = line[i].id.split('_');
            x1 = countX(indexes[1]); y1 = countY(indexes[2]);
            x2 = countX(indexes[3]); y2 = countY(indexes[4]);
            drawLineOnCanvas(x1,y1,x2,y2);
        }
        if (showAnswers) {
            for(i = 0; i < presenter.answersColors.length; i++) {
                tmpPoint = [presenter.answersColors[i].x,presenter.answersColors[i].y];
                tmpColor = presenter.answersColors[i].color.split(' ');
                tmpColor2 = getClickedAreaColor(tmpPoint[0],tmpPoint[1]);
                if (tmpColor2[0] != tmpColor[0] || tmpColor2[1] != tmpColor[1] || tmpColor2[2] != tmpColor2[2] || tmpColor2[3] != tmpColor[3]) {
                    floodFill(tmpPoint,tmpColor);
                }
            }
        } else {
            for(i = 0; i < presenter.coloredAreas.length; i++) {
                tmpPoint = [presenter.coloredAreas[i][0],presenter.coloredAreas[i][1]];
                tmpColor = [presenter.coloredAreas[i][2],presenter.coloredAreas[i][3],presenter.coloredAreas[i][4],presenter.coloredAreas[i][5]];
                tmpColor2 = getClickedAreaColor(tmpPoint[0],tmpPoint[1]);
                if (tmpColor2[0] != tmpColor[0] || tmpColor2[1] != tmpColor[1] || tmpColor2[2] != tmpColor2[2] || tmpColor2[3] != tmpColor[3]) {
                    floodFill(tmpPoint,tmpColor);
                } else
                    presenter.coloredAreas.splice(i,1);
            }
            checkColors();
        }
    }
    presenter.drawLine = function(point1, point2, nonremovable, draw, coloranswers, trigger){
        var firstPoint, secondPoint, column1, row1, row, column, column2, row2, tmpPoint;
        var x1, x2, y1, y2, x1N, y1N, x2N, y2N, x, y;
        var i, line, counter = 0;
        if (point1.column < point2.column || (point1.column == point2.column && point1.row < point2.row)) {
            firstPoint = point1;
            secondPoint = point2;
        }  else {
            firstPoint = point2;
            secondPoint = point1;
        }
        var steps = Math.abs(gcd(secondPoint.row-firstPoint.row, secondPoint.column-firstPoint.column));
        if (presenter.grid3D && (secondPoint.row-firstPoint.row+secondPoint.column-firstPoint.column)/steps %2 != 0) steps = 0.5 * steps;
        var stepX = parseInt((secondPoint.column-firstPoint.column)/steps);
        var	stepY = parseInt((secondPoint.row-firstPoint.row)/steps);
        column1 = firstPoint.column;
        row1 = firstPoint.row;
        for (i = 1; i <= steps; i++) {
            column2 = column1 + stepX;
            row2 = row1 + stepY;
            line = presenter.$view.find('#line_'+column1+'_'+row1+'_'+column2+'_'+row2);
            if (line.length > 0)
                counter++;
            if (!draw && (line.length > 0) && line.attr('class') == 'line nonremovable' && !coloranswers) {
                presenter.error = 'nonremanswer';
                return false;
            };
            column1 = column2;
            row1 = row2;
        }
        column1 = firstPoint.column;
        row1 = firstPoint.row;
        if (steps == counter && draw) {
            for (i = 1; i <= steps; i++) {
                column2 = column1 + stepX;
                row2 = row1 + stepY;
                line = presenter.$view.find('#line_'+column1+'_'+row1+'_'+column2+'_'+row2);
                if (line.attr('class') != 'line nonremovable')
                    line.remove();
                column1 = column2;
                row1 = row2;

            }
            var item = 'line_'+point1.column+'_'+point1.row+'_'+point2.column+'_'+point2.row;
            var value = 0;
            var score = 0;
            if (trigger) presenter.triggerEvent(item,value,score);
        } else {
            var score = 1;
            for (i = 1; i <= steps; i++) {
                column = firstPoint.column + stepX;
                row = firstPoint.row + stepY;
                if (presenter.grid3D) {
                    x = firstPoint.x + stepX * 0.5 * presenter.grid;
                    y = firstPoint.y + stepY * 1/3 * presenter.grid;
                } else {
                    x = firstPoint.x + stepX * presenter.grid;
                    y = firstPoint.y + stepY * presenter.grid;
                }
                tmpPoint = new Point(row, column, x, y);
                if (presenter.$view.find('#line_'+firstPoint.column+'_'+firstPoint.row+'_'+tmpPoint.column+'_'+tmpPoint.row).length <= 0 && draw) {
                    drawOneLine(firstPoint, tmpPoint, nonremovable);
                    line = 'line_'+firstPoint.column+'_'+firstPoint.row+'_'+tmpPoint.column+'_'+tmpPoint.row
                    if (score == 1 && ($.inArray(line,presenter.AnswerLines) == -1))
                        score = 0;
                }
                if (!draw && !((line.length > 0) && line.attr('class') == 'line nonremovable'))
                    presenter.AnswerLines.push('line_'+firstPoint.column+'_'+firstPoint.row+'_'+tmpPoint.column+'_'+tmpPoint.row);
                if (coloranswers)
                    presenter.tmpLine.push('line_'+firstPoint.column+'_'+firstPoint.row+'_'+tmpPoint.column+'_'+tmpPoint.row);
                firstPoint = tmpPoint;
            }
            var item = 'line_'+point1.column+'_'+point1.row+'_'+point2.column+'_'+point2.row;
            var value = 1;
            if (trigger) presenter.triggerEvent(item,value,score);
        }
    }
    presenter.initiate = function(view, model){
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addonID = model.ID;
        presenter.figure = presenter.$view.find('.figure');
        presenter.activity = ModelValidationUtils.validateBoolean(presenter.model['IsActivity']);
        presenter.disabled = ModelValidationUtils.validateBoolean(presenter.model['IsDisabled']);
        presenter.initDisabled = presenter.disabled;
        presenter.isVisible = ModelValidationUtils.validateBoolean(presenter.model["Is Visible"]);
        presenter.initIsVisible = presenter.isVisible;
        presenter.grid3D = ModelValidationUtils.validateBoolean(presenter.model['3DGrid']);
        presenter.showGrid = ModelValidationUtils.validateBoolean(presenter.model['ShowGrid']);
        presenter.StartingLines = presenter.model['StartingLines'];
        presenter.Answer = presenter.model['Answer'];
        presenter.grid = parseInt(presenter.model['Grid']);
        if (!(presenter.grid > 1))
            presenter.error = 'grid';
        presenter.radius = validateRadius(presenter.model['Radius']);
        presenter.coloring = ModelValidationUtils.validateBoolean(presenter.model['Coloring']);
        presenter.blockColoring = ModelValidationUtils.validateBoolean(presenter.model['BlockColoring']);
        presenter.answersColors = [];
        if (presenter.coloring && !presenter.error) {
            presenter.defaultColor = validateColor(presenter.model['DefColor'],true);
            presenter.startingColors = validateStartingColor(presenter.model['StartingColors']);
        };
        return true;
    }
    presenter.drawGrid = function() {
        var Width = presenter.figure.width();
        var Height = presenter.figure.parent().height();
        var i, j, presentX, presentY;
        presenter.pointsX = parseInt((Width - presenter.grid) / presenter.grid);
        presenter.pointsY = parseInt((Height - presenter.grid) / presenter.grid);
        if (presenter.grid3D) {
            presenter.pointsY = parseInt(3*(Height - presenter.grid) / presenter.grid);
            Height = parseInt((presenter.pointsY / 3 + 1) * presenter.grid);
            presenter.pointsX = parseInt((Width - presenter.grid) / presenter.grid);
            Width = parseInt((presenter.pointsX + 1) * presenter.grid);
        } else {
            Width = (presenter.pointsX + 1) * presenter.grid;
            Height = (presenter.pointsY + 1) * presenter.grid;
        }
        presenter.figure.css({'width' : Width, 'height' : Height});
        var $svg = '<svg height="'+Height+'" width="'+Width+'" version="1.1" xmlns:xlink="http://www.w3.org/2000/svg" class="chart">';
        points = '';
        for (i = 0; i <= presenter.pointsX; i++) {
            presentX = (i + 0.5) * presenter.grid;
            if (presenter.showGrid && !presenter.grid3D)
                $svg += '<line id="j_'+(i+1)+'" class ="grid" y2="' + Height +'" x2="'+presentX+'" y1="0" x1="'+presentX+'"></line>';
            if (presenter.showGrid && presenter.grid3D) {
                if (presenter.pointsY % 2 == 0) {
                    $svg += '<line id="j_'+(i+1)+'" class ="grid" y2="' + (Height - 5/6 * presenter.grid) +'" x2="'+presentX+'" y1="'+(5/6*presenter.grid)+'" x1="'+presentX+'"></line>';
                } else {
                    $svg += '<line id="j_'+(i+1)+'" class ="grid" y2="' + (Height - 1/2*presenter.grid) +'" x2="'+presentX+'" y1="'+(5/6*presenter.grid)+'" x1="'+presentX+'"></line>';
                }
                if (presenter.grid3D && i < presenter.pointsX) {
                    if (presenter.pointsY % 2 == 0) {
                        $svg += '<line id="j__'+(i+1)+'" class ="grid" y2="' + (Height - 1/2*presenter.grid) +'" x2="'+(presentX+0.5*presenter.grid)+'" y1="'+(0.5*presenter.grid)+'" x1="'+(presentX+0.5*presenter.grid)+'"></line>';
                    } else {
                        $svg += '<line id="j__'+(i+1)+'" class ="grid" y2="' + (Height - 5/6*presenter.grid) +'" x2="'+(presentX+0.5*presenter.grid)+'" y1="'+(0.5*presenter.grid)+'" x1="'+(presentX+0.5*presenter.grid)+'"></line>';
                    }
                }
            }
            for (j = 0; j <= presenter.pointsY; j++) {
                if (presenter.grid3D) {
                    ((j % 2) == 0) ? (presentX = (1 + i)* presenter.grid) : (presentX = (0.5 + i)* presenter.grid);
                }
                (presenter.grid3D) ? (presentY = (1/3 * j + 0.5) * presenter.grid) : (presentY = (0.5 + j)* presenter.grid);
                if (!presenter.grid3D) {
                    points += '<circle class="point" row="'+(j+1)+'" column ="'+(i+1)+'" r="'+presenter.radius+'" cy="'+presentY+'" cx="'+presentX+'"></circle>';
                } else if (!(i == presenter.pointsX && (j % 2) == 0)) {
                    points += '<circle class="point" row="'+(j+1)+'" column ="'+ ((j%2==0) ? (2*(i+1)) : (2*(i+1)-1)) +'" r="'+presenter.radius+'" cy="'+presentY+'" cx="'+presentX+'"></circle>';
                }
                if (i == 0 && presenter.showGrid && !presenter.grid3D) {
                    $svg += '<line id="i_'+(j+1)+'" class ="grid" y2="'+presentY+'" x2="' + Width +'" y1="'+presentY+'" x1="0"></line>';
                }
            }
        }
        if (presenter.showGrid && presenter.grid3D) {
            for (i = 1; i <= (presenter.pointsY/2); i++) {
                $svg += '<line id="i_'+(i)+'" class ="grid" x1="'+(0.5*presenter.grid)+'" y1="'+((1/6+2/3*i)*presenter.grid)+'" x2="' + (0.5 * presenter.grid * (Math.min((presenter.pointsY-2*i+1),(2*presenter.pointsX)) + 1)) +'" y2="'+(1/3 * presenter.grid * (Math.min((presenter.pointsY-2*i+1),(2*presenter.pointsX)) + 0.5 + 2*i))+'"></line>';
                $svg += '<line id="i_'+(i)+'_" class ="grid" x1="'+(0.5*presenter.grid)+'" y1="'+((1/6+2/3*i)*presenter.grid)+'" x2="' + (0.5 * presenter.grid * (Math.min(2*i-1, 2*presenter.pointsX) + 1)) +'" y2="'+(1/3 * presenter.grid * (0.5 + 2*i - Math.min(2*i-1, 2*presenter.pointsX)))+'"></line>';
            }
            for (i = 1; i <= presenter.pointsX; i++) {
                $svg += '<line id="i__'+(i)+'" class ="grid" x1="'+(i*presenter.grid)+'" y1="'+(0.5*presenter.grid)+'" x2="'+ (0.5 * presenter.grid * (Math.min(2*(presenter.pointsX-i)+1, presenter.pointsY) + 2*i)) +'" y2="'+ (presenter.grid * (0.5 + 1/3* Math.min(2*(presenter.pointsX-i)+1, presenter.pointsY))) +'"></line>';
                if (presenter.pointsY % 2 == 0) {
                    $svg += '<line id="i__'+(i)+'_" class ="grid" x1="'+(i*presenter.grid)+'" y1="'+((presenter.pointsY/3+0.5)*presenter.grid)+'" x2="'+  (0.5 * presenter.grid * (Math.min(2*(presenter.pointsX-i)+1, presenter.pointsY) + 2*i)) +'" y2="'+ (1/3 * presenter.grid * (presenter.pointsY + 1.5 - Math.min(2*(presenter.pointsX-i)+1, presenter.pointsY))) +'"></line>';
                } else {
                    $svg += '<line id="i__'+(i)+'_" class ="grid" x1="'+((i-0.5)*presenter.grid)+'" y1="'+((presenter.pointsY/3+0.5)*presenter.grid)+'" x2 ="'+ (0.5 * presenter.grid * (Math.min(2*(presenter.pointsX-i)+1, presenter.pointsY-1) + 2*i)) +'" y2="' + (1/3 * presenter.grid * (presenter.pointsY + 1.5 - Math.min(2*(presenter.pointsX-i+1),presenter.pointsY))) +'"></line>';
                }
            }
        }
        $svg += points;
        $svg += '</svg>';
        presenter.figure.prepend($svg);
        var canvasElement = $('<canvas></canvas>');
        presenter.ctx = canvasElement[0].getContext('2d');
        canvasElement.attr('width', Width);
        canvasElement.attr('height', Height);
        canvasElement.attr('class', 'canvas');
        presenter.canvasWidth = Width;
        presenter.canvasHeight = Height;
        presenter.canvas = canvasElement[0];
        if (presenter.coloring) presenter.figure.prepend(canvasElement);
        //double canvas fix
        if (presenter.coloring && MobileUtils.isAndroidWebBrowser(window.navigator.userAgent)) {
            var android_ver = MobileUtils.getAndroidVersion(window.navigator.userAgent);
            if (["4.1.1", "4.1.2", "4.2.2", "4.3"].indexOf(android_ver) !== -1) {
                presenter.$view.find('.canvas').parents("*").css("overflow", "visible");
            }
        }
    }
    presenter.run = function(view, model){
        var row, column, x, y;
        var timeClick = true;
        presenter.initiate(view, model);
        presenter.coloredAreas = [];
        if (!presenter.error) {
            presenter.drawGrid();
            validateLines(presenter.StartingLines,true,false);
            presenter.updateVisibility();
            presenter.drawingMode = true;

            var coordinations = {x:0, y:0};
            var tmpColor, i;
            if (presenter.coloring && presenter.startingColors != '') {
                for (i = 0; i < presenter.startingColors.length; i++)
                    presenter.coloredAreas[i] = presenter.startingColors[i];
                presenter.redrawCanvas(false);
            }
            presenter.currentColor = presenter.defaultColor;
            if (presenter.disabled) presenter.disable();
            if (presenter.activity) {
                presenter.AnswerLines = new Array();
                validateLines(presenter.Answer,false,false);
                if (presenter.coloring && !presenter.error)
                    if (presenter.model['AnswerColors'].length != 1 || presenter.model['AnswerColors'][0]['Figure'] != '' || presenter.model['AnswerColors'][0]['Color'] != '')
                        validateAnswersColor(presenter.model['AnswerColors']);
                // delete duplicates from AnswerLines
                presenter.AnswerLines = uniq(presenter.AnswerLines);
            }
        }
        if (presenter.error) {
            presenter.figure.addClass(presenter.error);
            presenter.$view.find('.chart').remove();
            presenter.$view.find('.canvas').remove();
        };
        var point1, point2;

        presenter.$view.find('.point').on('mousedown touchstart', function(e){
            e.stopPropagation();
            e.preventDefault();
            if (!presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActive && presenter.drawingMode && timeClick) {
                if (e.type != 'mousedown') timeClick = false;
                setTimeout(function(){timeClick = true;},400);
                if (!presenter.selected.isSelected) {
                    presenter.selected.row = parseInt($(this).attr('row'),10);
                    presenter.selected.column = parseInt($(this).attr('column'),10);
                    presenter.selected.x = parseInt($(this).attr('cx'),10);
                    presenter.selected.y = parseInt($(this).attr('cy'),10);
                    presenter.selected.isSelected = true;
                    $(this).addClass('selected');
                } else {
                    if (presenter.selected.row == $(this).attr('row') && presenter.selected.column == $(this).attr('column')) {
                        presenter.selected.isSelected = false;
                        $(this).removeClass('selected');
                    } else {
                        presenter.isStarted = true;
                        point1 = new Point(presenter.selected.row, presenter.selected.column, presenter.selected.x, presenter.selected.y);
                        row = parseInt($(this).attr('row'),10);
                        column = parseInt($(this).attr('column'),10);
                        x = parseInt($(this).attr('cx'),10);
                        y = parseInt($(this).attr('cy'),10);
                        point2 = new Point(row, column, x, y);
                        presenter.drawLine(point1,point2,false,true,false,true);
                        presenter.$view.find('.point').removeClass('selected');
                        presenter.selected.isSelected = false;
                        //if blockColoring mode check if is OK
                        if (presenter.allLinesDrawn()) {
                            var item = 'lines';
                            var value = '';
                            var score = '';
                            presenter.triggerEvent(item,value,score);
                            if (presenter.blockColoring) presenter.setColorMode();
                        }
                        if (presenter.coloring) presenter.redrawCanvas(false);
                    }
                }
            }
        });
        presenter.$view.on('mousedown touchstart', function(e){
            e.stopPropagation();
            e.preventDefault();
            if (presenter.coloring && !presenter.isErrorMode && !presenter.disabled && !presenter.isShowAnswersActiv && !presenter.drawingMode) {
                coordinations.x = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                coordinations.y = e.originalEvent.pageY || e.originalEvent.touches[0].pageY;
                presenter.mouseSX = parseInt(coordinations.x,10) - parseInt(presenter.figure.offset().left,10);
                presenter.mouseSY = parseInt(coordinations.y,10) - parseInt(presenter.figure.offset().top,10);
                var imgData = presenter.ctx.getImageData(0, 0, presenter.canvasWidth, presenter.canvasHeight);
                var myPoint = (presenter.mouseSX + presenter.mouseSY * presenter.canvasWidth) * 4;
                var color = getClickedAreaColor(presenter.mouseSX,presenter.mouseSY);
                var startingPixel = [presenter.mouseSX,presenter.mouseSY];
                tmpColor = getClickedAreaColor(startingPixel[0],startingPixel[1]);
                if ((presenter.currentColor[0] != tmpColor[0] || presenter.currentColor[1] != tmpColor[1] || presenter.currentColor[2] != tmpColor[2] || presenter.currentColor[3] != tmpColor[3]) && (tmpColor[3] < 10 || tmpColor[3] > 245) && presenter.mouseSX > 0 && presenter.mouseSY > 0) {
                    presenter.isStarted = true;
                    floodFill(startingPixel,presenter.currentColor);
                    presenter.coloredAreas.push([startingPixel[0],startingPixel[1],presenter.currentColor[0],presenter.currentColor[1],presenter.currentColor[2],presenter.currentColor[3]]);
                    // checking if this area was not colored previously
                    checkColors();
                    var item = startingPixel[0]+' '+startingPixel[1];
                    var value = presenter.currentColor.join(" ");
                    var score = '';
                    presenter.triggerEvent(item,value,score);
                }
            }
        });
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    }
    function checkColors() {
        for(var i = 0; i < presenter.coloredAreas.length; i++) {
            var tmpColor = getClickedAreaColor(presenter.coloredAreas[i][0],presenter.coloredAreas[i][1]);
            if (tmpColor[0] != presenter.coloredAreas[i][2] || tmpColor[1] != presenter.coloredAreas[i][3] || tmpColor[2] != presenter.coloredAreas[i][4] || tmpColor[3] != presenter.coloredAreas[i][5])
                presenter.coloredAreas.splice(i,1);
        }
    }
    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") presenter.showAnswers();
        if (eventName == "HideAnswers") presenter.hideAnswers();
    };
    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };
    presenter.createPreview = function(view, model){
        presenter.initiate(view, model);
        presenter.coloredAreas = [];
        var coordinations = {x:0, y:0};
        if (!presenter.error) {
            presenter.drawGrid();
            validateLines(presenter.StartingLines,true,false);
            if (presenter.activity) {
                presenter.AnswerLines = new Array();
                validateLines(presenter.Answer,false,false);
                if (presenter.coloring && !presenter.error)
                    if (presenter.model['AnswerColors'].length != 1 || presenter.model['AnswerColors'][0]['Figure'] != '' || presenter.model['AnswerColors'][0]['Color'] != '')
                        validateAnswersColor(presenter.model['AnswerColors']);
            }
            presenter.updateVisibility();
            if (presenter.disabled) presenter.disable();
            if (presenter.coloring && presenter.startingColors != '') {
                presenter.coloredAreas = presenter.startingColors;
                presenter.redrawCanvas(false);
            }
            presenter.showAnswersInEditor = ModelValidationUtils.validateBoolean(presenter.model['ShowAns']);
            if (presenter.activity && presenter.showAnswersInEditor)
                presenter.showAnswers();
            var coordinatesContainer = $('<div></div>'),
                xContainer = $('<div>x: <span class="value"></span></div>'),
                yContainer = $('<div>y: <span class="value"></span></div>');
            coordinatesContainer.addClass('coordinates');
            coordinatesContainer.append(xContainer).append(yContainer);
            presenter.figure.append(coordinatesContainer);
            presenter.figure.on('mousemove', function(e) {
                coordinations.x = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                coordinations.y = e.originalEvent.pageY || e.originalEvent.touches[0].pageY;
                presenter.mouseSX = parseInt(coordinations.x,10) - parseInt(presenter.figure.offset().left,10);
                presenter.mouseSY = parseInt(coordinations.y,10) - parseInt(presenter.figure.offset().top,10);
                xContainer.find('.value').html(presenter.mouseSX);
                yContainer.find('.value').html(presenter.mouseSY);
            });
        };
        if (presenter.error) {
            presenter.figure.addClass(presenter.error);
            presenter.$view.find('.chart').remove();
            presenter.$view.find('.canvas').remove();
        }
    }
    presenter.reset = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.coloredAreas = [];
        presenter.drawingMode = true;
        presenter.setWorkMode();
        if (presenter.coloring && presenter.startingColors != '') {
            for (i = 0; i < presenter.startingColors.length; i++)
                presenter.coloredAreas[i] = presenter.startingColors[i];
        }
        presenter.$view.find('.line').remove();
        validateLines(presenter.StartingLines,true,false);
        presenter.isStarted = false;
        presenter.$view.find('.selected').removeClass('selected');
        presenter.selected.isSelected = false;
        presenter.disabled = presenter.initDisabled;
        if (presenter.disabled) presenter.disable()
        else presenter.enable();
        presenter.isVisible = presenter.initIsVisible;
        presenter.updateVisibility();
        if (presenter.coloring) presenter.redrawCanvas(false);
        presenter.isEraser = false;
        presenter.currentColor = presenter.defaultColor;
    };
    presenter.getErrorCount = function(){
        var errorCounter = 0, i, lineCounter, color;
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        if (presenter.activity && !presenter.error && presenter.isStarted) {
            errorCounter = presenter.$view.find('.line').not('.nonremovable').length;
            var numberOfAnswers = presenter.AnswerLines.length, line;
            for (i = 0; i <= numberOfAnswers; i++) {
                line = presenter.$view.find('#'+presenter.AnswerLines[i]);
                if (line.length > 0)
                    errorCounter--;
            }
            if (presenter.coloring) {
                for (i = 0; i < presenter.answersColors.length; i++) {
                    lineCounter = 0;
                    for (j = 0; j < presenter.answersColors[i].lines.length; j++) {
                        line = presenter.$view.find('#'+presenter.answersColors[i].lines[j]);
                        if (line.length > 0) lineCounter++;
                    }
                    color = getClickedAreaColor(presenter.answersColors[i].x,presenter.answersColors[i].y).join(" ");
                    if (color != presenter.answersColors[i].color && color != '0 0 0 0' && lineCounter == presenter.answersColors[i].lines.length)
                        errorCounter++;
                }
            }
        }
        return errorCounter;
    }
    presenter.getMaxScore = function(){
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        if (presenter.activity && !presenter.error && presenter.coloring)
            return (presenter.AnswerLines.length + presenter.answersColors.length)
        else if (presenter.activity && !presenter.error)
            return (presenter.AnswerLines.length)
        else
            return 0;
    }
    presenter.getScore = function(){
        if (presenter.activity && !presenter.error && presenter.isStarted) {
            var i, j, line, lineCounter, color, counter = 0, numberOfAnswers = presenter.AnswerLines.length;
            for (i = 0; i <= numberOfAnswers; i++) {
                line = presenter.$view.find('#'+presenter.AnswerLines[i]);
                if (line.length > 0)
                    counter++;
            }
            if (presenter.coloring) {
                for (i = 0; i < presenter.answersColors.length; i++) {
                    lineCounter = 0;
                    for (j = 0; j < presenter.answersColors[i].lines.length; j++) {
                        line = presenter.$view.find('#'+presenter.answersColors[i].lines[j]);
                        if (line.length > 0) lineCounter++;
                    }
                    color = getClickedAreaColor(presenter.answersColors[i].x,presenter.answersColors[i].y).join(" ");
                    if (lineCounter == presenter.answersColors[i].lines.length && color == presenter.answersColors[i].color) counter++;
                }
            }
            return counter;
        } else
            return 0;
    }
    presenter.setWorkMode = function() {
        presenter.isErrorMode = false;
        presenter.$view.find('.line').removeClass('correct');
        presenter.$view.find('.line').removeClass('wrong');
        presenter.$view.find('.icon-container').remove();
    };
    presenter.setShowErrorsMode = function() {
        var i, j, line, color, lineCounter;
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        presenter.isErrorMode = true;
        presenter.selected.isSelected = false;
        presenter.$view.find('.point').removeClass('selected');
        var Lines = presenter.$view.find('.line').not('.nonremovable');
        var i;
        if (presenter.activity && !presenter.error && presenter.isStarted) {
            for (i = 0; i < Lines.length; i++) {;
                if ($.inArray(Lines[i].id,presenter.AnswerLines) != -1)
                    presenter.$view.find('#'+Lines[i].id).addClass('correct')
                else
                    presenter.$view.find('#'+Lines[i].id).addClass('wrong');
            }
        }
        if (presenter.activity && !presenter.error && presenter.isStarted && presenter.coloring) {
            for (i = 0; i < presenter.answersColors.length; i++) {
                lineCounter = 0;
                for (j = 0; j < presenter.answersColors[i].lines.length; j++) {
                    line = presenter.$view.find('#'+presenter.answersColors[i].lines[j]);
                    if (line.length > 0) lineCounter++;
                }
                color = getClickedAreaColor(presenter.answersColors[i].x,presenter.answersColors[i].y).join(" ");
                if (lineCounter == presenter.answersColors[i].lines.length && color == presenter.answersColors[i].color)
                    presenter.displayIcon(presenter.answersColors[i].x,presenter.answersColors[i].y,true)
                else if (color != presenter.answersColors[i].color && color != '0 0 0 0' && lineCounter == presenter.answersColors[i].lines.length)
                    presenter.displayIcon(presenter.answersColors[i].x,presenter.answersColors[i].y,false);
            }
        }
    };
    presenter.displayIcon = function(x,y,isCorrect) {
        var iconContainer = $('<div class="icon-container"></div>');
        iconContainer.css({
            top: (y-5) + 'px',
            left: (x-5) + 'px'
        });
        iconContainer.addClass(isCorrect ? 'correct' : 'wrong');
        presenter.figure.append(iconContainer);
    }
    presenter.getState = function() {
        if (presenter.isShowAnswersActive) presenter.hideAnswers();
        var Lines = presenter.$view.find('.line').not('.nonremovable');
        var LinesIds = new Array();
        for (i = 0; i < Lines.length; i++) {
            LinesIds.push(Lines[i].id);
        }
        return JSON.stringify({
            isStarted : presenter.isStarted,
            disabled : presenter.disabled,
            visible : presenter.isVisible,
            lines : LinesIds,
            eraser: presenter.isEraser,
            color: presenter.currentColor,
            coloredAreas: presenter.coloredAreas,
            mode: presenter.drawingMode
        });
    };
    presenter.setState = function(state) {
        var point1, point2, x, y, i;
        presenter.disabled = JSON.parse(state).disabled;
        presenter.isEraser = JSON.parse(state).eraser;
        presenter.currentColor = JSON.parse(state).color;
        presenter.coloredAreas = JSON.parse(state).coloredAreas;
        presenter.drawingMode = JSON.parse(state).mode;
        if (presenter.disabled)
            presenter.disable()
        else
            presenter.enable();
        presenter.isVisible = JSON.parse(state).visible;
        presenter.isStarted = JSON.parse(state).isStarted;
        presenter.updateVisibility();
        presenter.$view.find('.line').not('.nonremovable').remove();
        var LinesIds = JSON.parse(state).lines;
        var indexes = new Array();
        for (i = 0; i < LinesIds.length; i++) {
            indexes = LinesIds[i].split('_');
            x = countX(indexes[1]); y = countY(indexes[2]);
            point1 = new Point(indexes[2], indexes[1], x, y);
            x = countX(indexes[3]); y = countY(indexes[4]);
            point2 = new Point(indexes[4], indexes[3], x, y);
            drawOneLine(point1,point2,false);
        }
        if (presenter.coloring) presenter.redrawCanvas(false);
    };
    presenter.showAnswers = function () {
        if (presenter.activity) {
            var i, x, y, point1, point2;
            if (presenter.isShowAnswersActive) presenter.hideAnswers();
            presenter.isShowAnswersActive = true;
            presenter.setWorkMode();
            var Lines = presenter.$view.find('.line').not('.nonremovable');
            presenter.LinesIds = new Array();
            for (i = 0; i < Lines.length; i++) {
                presenter.LinesIds.push(Lines[i].id);
            }
            presenter.$view.find('.line').not('.nonremovable').remove();
            var indexes = new Array();
            for (i = 0; i < presenter.AnswerLines.length; i++) {
                indexes = presenter.AnswerLines[i].split('_');
                x = countX(indexes[1]); y = countY(indexes[2]);
                point1 = new Point(indexes[2], indexes[1], x, y);
                x = countX(indexes[3]); y = countY(indexes[4]);
                point2 = new Point(indexes[4], indexes[3], x, y);
                drawOneLine(point1,point2,false);
            }
            presenter.selected.isSelected = false;
            presenter.$view.find('.selected').removeClass('selected');
            presenter.$view.find('.line').not('.nonremovable').addClass('show-answers');
            if (presenter.coloring) presenter.redrawCanvas(true);
        }
    };
    presenter.hideAnswers = function () {
        if (presenter.activity) {
            var i, x, y, point1, point2;
            presenter.isShowAnswersActive = false;
            presenter.$view.find('.line').not('.nonremovable').remove();
            var indexes = new Array();
            for (i = 0; i < presenter.LinesIds.length; i++) {
                indexes = presenter.LinesIds[i].split('_');
                x = countX(indexes[1]); y = countY(indexes[2]);
                point1 = new Point(indexes[2], indexes[1], x, y);
                x = countX(indexes[3]); y = countY(indexes[4]);
                point2 = new Point(indexes[4], indexes[3], x, y);
                drawOneLine(point1,point2,false);
            }
            if (presenter.coloring) presenter.redrawCanvas(false);
        }
    }
    function floodFill(startingPixel,fillColor) {
        var imgData = presenter.ctx.getImageData(0, 0, presenter.canvasWidth, presenter.canvasHeight);
        var pixelStack = [];
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        pixelStack.push(startingPixel);
        var start = getClickedAreaColor(startingPixel[0],startingPixel[1]);
        while(pixelStack.length) {
            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];
            pixelPos = (y*presenter.canvasWidth + x) * 4;
            while(y-- >= 0 && matchStartColor(imgData,pixelPos,start)) {
                pixelPos -= presenter.canvasWidth * 4;
            }
            pixelPos += presenter.canvasWidth * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            while(y++ < presenter.canvasHeight-1 && matchStartColor(imgData,pixelPos,start)) {
                colorPixel(imgData,pixelPos,fillColor);
                if(x > 0) {
                    if(matchStartColor(imgData,pixelPos - 4,start)) {
                        if(!reachLeft){
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if(reachLeft) {
                        reachLeft = false;
                    }
                }
                if(x < presenter.canvasWidth-1) {
                    if(matchStartColor(imgData,pixelPos + 4,start)) {
                        if(!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if(reachRight) {
                        reachRight = false;
                    }
                }
                pixelPos += presenter.canvasWidth * 4;
            }
        }
        presenter.ctx.putImageData(imgData, 0, 0);
    }
    function matchStartColor(imgData,pixelPos,start) {
        var r = imgData.data[pixelPos];
        var g = imgData.data[pixelPos+1];
        var b = imgData.data[pixelPos+2];
        var a = imgData.data[pixelPos+3];
        return (r == start[0] && g == start[1] && b == start[2] && a == start[3]);
    }
    function colorPixel(imgData,pixelPos,fillColor) {
        imgData.data[pixelPos] = fillColor[0];
        imgData.data[pixelPos+1] = fillColor[1];
        imgData.data[pixelPos+2] = fillColor[2];
        imgData.data[pixelPos+3] = fillColor[3];
    }
    function getClickedAreaColor(x, y) {
        var data = presenter.ctx.getImageData(x, y, 1, 1).data, color = [];
        for (var i = 0; i < data.length; i++) {
            color.push(data[i]);
        }
        return color;
    }
    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };
    presenter.createEventData = function(item,value,score) {
        return {
            source : presenter.addonID,
            item : item,
            value : value,
            score : score
        };
    };
    presenter.triggerEvent = function(item, state, score) {
        var eventData = presenter.createEventData(item, state, score);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
        if (presenter.getScore() == presenter.getMaxScore() && presenter.activity && presenter.getErrorCount() == 0) {
            eventData = presenter.createEventData('all','','');
            presenter.eventBus.sendEvent('ValueChanged', eventData);
        }
    };
    return presenter;
}