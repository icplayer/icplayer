function AddonPointsLines_create() {
	var presenter = function() {
	};
	presenter.error = false;

	presenter.ERROR_CODES = {
		'PE' : 'Points coordinates incorrect!',
		'PO' : 'Points outside the addon!',
		'NP' : 'Define the points!',
		'IE' : 'Indexes incorrect!',
		'LE' : 'Starting lines incorrect!',
		'AE' : 'Answer incorrect!'
	};

	presenter.executeCommand = function(name, params) {
		switch (name.toLowerCase()) {
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
			case 'markAsCorrect'.toLowerCase():
				presenter.markAsCorrect();
				break;
			case 'markAsWrong'.toLowerCase():
				presenter.markAsWrong();
				break;
			case 'markAsNeutral'.toLowerCase():
				presenter.markAsNeutral();
				break;
			case 'isEmpty'.toLowerCase():
				presenter.isEmpty();
				break;
			case 'isAttempted'.toLowerCase():
				presenter.isAttempted();
				break;
			case 'isConnected'.toLowerCase():
				presenter.isConnected(params[0],params[1]);
				break;
		}
	};

	presenter.isAttempted = function() {
		return (!(presenter.activity) || (presenter.getScore() !== 0) || (presenter.getErrorCount() !== 0));
	};
	 
	presenter.markAsCorrect = function() {
		presenter.$view.find('.pointslines').removeClass('wrong');
		presenter.$view.find('.pointslines').addClass('correct');
	};
	 
	presenter.markAsWrong = function() {
		presenter.$view.find('.pointslines').removeClass('correct');
		presenter.$view.find('.pointslines').addClass('wrong');	
	};
	 
	presenter.markAsNeutral = function() {
		presenter.$view.find('.pointslines').removeClass('correct');
		presenter.$view.find('.pointslines').removeClass('wrong');
	};
	 
	presenter.isConnected = function(i,j) {
		var lineIndex = presenter.currentLines[Math.min(i-1,j-1)][Math.max(i-1,j-1)];
		if (lineIndex == 1 || lineIndex == 2) {
			return true;
		} else {
			return false;
		}
	}
	 
	presenter.isEmpty = function() {
		var numberOfPoints = presenter.points.length;
		var i, j;
		for (i = 0; i < numberOfPoints; i++) {
			for (j = i; j < numberOfPoints; j++) {
				if (presenter.startingLines[i][j] !== presenter.currentLines[i][j]) {
					return false;
				}
			}
		}
		return true;
	}
 
	presenter.isAllOK = function() {
		return ((presenter.getScore() == presenter.getMaxScore()) && (presenter.getErrorCount() === 0));
	};

	presenter.disable = function() {
		if (!(presenter.$view.find('.disabled').length > 0)) {
			presenter.disabled = true;
			div = $('<div>');
			div.attr('id', 'disabled_' + presenter.addonID);
			div.attr('class', 'disabled');
			presenter.$view.find('.pointslines').append(div);
		}
	};
	presenter.enable = function() {
		presenter.disabled = false;
		presenter.$view.find('.disabled').remove();
	};

	presenter.hide = function() {
		presenter.isVisible = false;
		presenter.setVisibility(false);
	};

	presenter.show = function() {
		presenter.isVisible = true;
		presenter.setVisibility(true);
	};

	presenter.setVisibility = function(isVisible) {
		presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
	};

	presenter.updateVisibility = function() {
		if (presenter.isVisible) {
			presenter.show();
		} else {
			presenter.hide();
		}
	};
	presenter.setPlayerController = function(controller) {
		presenter.playerController = controller;
		presenter.eventBus = presenter.playerController.getEventBus();
	};
	presenter.createEventData = function(line, state, score) {
		return {
			source : presenter.addonID,
			item : line,
			value : state,
			score : score
		};
	};
	presenter.triggerLineEvent = function(line, state, score) {
		var eventData = presenter.createEventData(line, state, score);
		presenter.eventBus.sendEvent('ValueChanged', eventData);
	};

	function checkIndexes(indexes, numberOfPoints) {
		indexes = indexes.replace(/\s/g, '');
		pointsIndexes = new Array(numberOfPoints);
		var i;
		if (indexes == '') {
			for (i = 0; i < numberOfPoints; i++) {
				pointsIndexes[i] = '';
			}
			return pointsIndexes;
		} else {
			pointsIndexes = indexes.split(',');
			if (pointsIndexes.length != numberOfPoints) {
				presenter.error = 'IE';
				return false;
			} else {
				return pointsIndexes;
			}
		}
	}

	function getPoint(con, coords) {
		coords = coords.replace(/\s/g, '');
		if (coords == '') {
			presenter.error = 'NP';
			return false;
		} else {
			var points = coords.split(']');
			var numberOfPoints = points.length - 1;
			var pointsCoordinates = new Array(numberOfPoints);
			var tmp_dane;
			if (points[numberOfPoints] != '') {
				presenter.error = 'PE';
				return false;
			}
			var i;
			for (i = 0; i < points.length - 1; i++) {
				tmp_dane = points[i].split(',');
				pointsCoordinates[i] = new Array(2);
				if (tmp_dane[0][0] != '[') {
					presenter.error = 'PE';
					return false;
				}
				pointsCoordinates[i][0] = tmp_dane[0].substring(1);
				pointsCoordinates[i][1] = tmp_dane[1];
				if (isNaN(pointsCoordinates[i][0])
						|| isNaN(pointsCoordinates[i][1])) {
					presenter.error = 'PE';
					return false;
				} else if (pointsCoordinates[i][0] >= (con.width()) || pointsCoordinates[i][0] <= 0 || pointsCoordinates[i][1] <= 0 || pointsCoordinates[i][1] >= (con.height())) {
					presenter.error = 'PO';
					return false;
				}
				pointsCoordinates[i][1] = parseInt(pointsCoordinates[i][1], 10);
				pointsCoordinates[i][0] = parseInt(pointsCoordinates[i][0], 10);
			}
		}
		return pointsCoordinates;
	}
	function getLines(dataLines, numberOfPoints, stars) {
		dataLines = dataLines.replace(/\s/g, '');
		var Lines = new Array(numberOfPoints);
		var i, j, tmp_dane, point1, point2;

		for (i = 0; i < numberOfPoints; i++) {
			Lines[i] = new Array(numberOfPoints);
			for (j = i; j < numberOfPoints; j++) {
				Lines[i][j] = 0;
			}
		}

		if (dataLines == '') {
			return Lines;
		}
		var addLine = dataLines.split(',');
		for (i = 0; i < addLine.length; i++) {
			tmp_dane = addLine[i].split('-');
			if (tmp_dane[0] == '' || tmp_dane[1] == '') {
				presenter.error = 'LE';
				return false;
			}
			if (!isNaN(tmp_dane[0]) && tmp_dane[0] <= numberOfPoints
					&& (!isNaN(tmp_dane[1])) && tmp_dane[1] <= numberOfPoints) {
				if (parseInt(tmp_dane[0], 10) > parseInt(tmp_dane[1], 10)) {
					point1 = parseInt(tmp_dane[1], 10) - 1;
					point2 = parseInt(tmp_dane[0], 10) - 1;
				} else {
					point1 = parseInt(tmp_dane[0], 10) - 1;
					point2 = parseInt(tmp_dane[1], 10) - 1;
				}
				Lines[point1][point2] = 1;
			} else if (stars && !isNaN(tmp_dane[0]) && parseInt(tmp_dane[0], 10) <= numberOfPoints && !isNaN(tmp_dane[1].substring(0, tmp_dane[1].length - 1)) && (tmp_dane[1].substring(tmp_dane[1].length - 1)) === '*' && parseInt(tmp_dane[1].substring(0, tmp_dane[1].length - 1), 10) <= numberOfPoints) {
				if (parseInt(tmp_dane[0], 10) > parseInt(tmp_dane[1].substring(0, tmp_dane[1].length - 1), 10)) {
					point1 = parseInt(tmp_dane[1].substring(0,tmp_dane[1].length - 1), 10) - 1;
					point2 = parseInt(tmp_dane[0], 10) - 1;
				} else {
					point1 = parseInt(tmp_dane[0], 10) - 1;
					point2 = parseInt(tmp_dane[1].substring(0,tmp_dane[1].length - 1), 10) - 1;
				}
				Lines[point1][point2] = 2;
			} else {
				if (stars) {
					presenter.error = 'LE';
				} else {
					presenter.error = 'AE';
				}
				return false;
			}
		}
		return Lines;
	}

	presenter.drawPoints = function() {
		for ( var i = 0; i < (presenter.points).length; i++) {
			div = $('<div>');
			div.attr('id', 'point_container_' + presenter.addonID + '_' + i);
			div.attr('class', 'point_container');
			div.attr('order_value', i + 1);
			div.attr('style', 'left: ' + presenter.points[i][0] + 'px; top: ' + presenter.points[i][1] + 'px;');
			presenter.$view.find('.pointslines').append(div);
			div = $('<div class="point"></div>');
			div.attr('id', 'point_' + presenter.addonID + '_' + i);
			presenter.$view.find('#point_container_' + presenter.addonID + '_' + i).append(div);
			div = $('<div class="point_index">' + presenter.indexes[i] + '</div>');
			presenter.$view.find('#point_container_' + presenter.addonID + '_' + i).append(div);
		}
	};

	presenter.drawLine = function(i, j) {
		if (presenter.$view.find('#line_' + (i) + '_' + (j)).length <= 0) {
			var m, angle, d, transform, id, line;
			x1 = parseInt(presenter.points[i][0], 10);
			y1 = parseInt(presenter.points[i][1], 10);
			x2 = parseInt(presenter.points[j][0], 10);
			y2 = parseInt(presenter.points[j][1], 10);
			m = (y2 - y1) / (x2 - x1);
			angle = (Math.atan(m)) * 180 / (Math.PI);
			d = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
			if (x2 >= x1) {
				transform = (360 + angle) % 360;
			} else {
				transform = 180 + angle;
			}

			div = $('<div>');
			div.attr('id', 'line_' + i + '_' + j);
			div.attr('point1', i);
			div.attr('point2', j);
			div.attr('class', 'line');
			div.attr('style', 'left: ' + x1 + 'px; top: ' + y1 + 'px');
			presenter.$view.find('.pointslines').prepend(div);
			presenter.$view.find('#line_' + i + '_' + j).css({
				'left' : x1,
				'top' : y1,
				'width' : d,
				'transform' : 'rotate(' + transform + 'deg)',
				'transform-origin' : '0px 0px',
				'-ms-transform' : 'rotate(' + transform + 'deg)',
				'-ms-transform-origin' : '0px 0px',
				'-moz-transform' : 'rotate(' + transform + 'deg)',
				'-moz-transform-origin' : '0px 0px',
				'-webkit-transform' : 'rotate(' + transform + 'deg)',
				'-webkit-transform-origin' : '0px 0px',
				'-o-transform' : 'rotate(' + transform + 'deg)',
				'-o-transform-origin' : '0px 0px'
			});
			if (presenter.startingLines[i][j] == 2) {
				presenter.$view.find('#line_' + i + '_' + j).addClass('noremovable');
			}
		}
	};

	presenter.initiate = function(view, model) {
		presenter.$view = $(view);
		presenter.model = model;
		presenter.addonID = model.ID;
		var coords = presenter.model['Points'];
		presenter.activity = ModelValidationUtils.validateBoolean(presenter.model['Is activity']);
		presenter.disabled = ModelValidationUtils.validateBoolean(presenter.model['Is disabled']);
		presenter.initDisabled = presenter.disabled;
		presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
		presenter.initIsVisible = presenter.isVisible;
		var startingLines = presenter.model['Starting lines'];
		var con = presenter.$view.find('.pointslines').parent();
		presenter.$view.find('.pointslines').css({
			'width' : con.width(),
			'height' : con.height()
		});
		presenter.points = getPoint(con, coords);
		presenter.indexes = checkIndexes(presenter.model['Indexes'],(presenter.points).length);
		if (presenter.points === false || presenter.indexes === false) {
			con.text(presenter.ERROR_CODES[presenter.error]);
			return;
		}
		presenter.drawPoints();
		numberOfPoints = presenter.points.length;
		presenter.startingLines = getLines(startingLines, numberOfPoints, true);
		presenter.currentLines = getLines(startingLines, numberOfPoints, true);

		if (presenter.startingLines === false) {
			con.text(presenter.ERROR_CODES[presenter.error]);
			return;
		}

		for ( var i = 0; i < numberOfPoints; i++) {
			for ( var j = i; j < numberOfPoints; j++) {
				if (presenter.currentLines[i][j] == 1 || presenter.currentLines[i][j] == 2) {
					presenter.drawLine(i, j);
				}
			}
		}
		var answer = presenter.model['Lines'];
		presenter.answer = getLines(answer, numberOfPoints, false);
		if (presenter.answer === false) {
			con.text(presenter.ERROR_CODES[presenter.error]);
			return;
		}
	};

	presenter.run = function(view, model) {
		presenter.initiate(view, model);
		var i, j;
		var line, score;
		var point1, point2;
		presenter.selectedPoint = -1;
		if (presenter.disabled)
			presenter.disable();
			$(view).find('.point_container').click(function(event) {
				event.stopPropagation();
				if (!presenter.isErrorMode && !presenter.isDisabled) {
					i = parseInt($(this).attr('order_value'), 10) - 1;
					if (presenter.selectedPoint == i) {
						$(view).find('#point_' + presenter.addonID + '_' + i).removeClass('selected');
						presenter.selectedPoint = -1;
					} else if (presenter.selectedPoint != -1) {
						if (presenter.selectedPoint < i) {
							point1 = presenter.selectedPoint;
							point2 = i;
						} else {
							point2 = presenter.selectedPoint;
							point1 = i;
						}
						if (presenter.currentLines[point1][point2] === 0) {
							presenter.drawLine(point1, point2);
							presenter.currentLines[point1][point2] = 1;
							line = 'line_' + (point1) + '_' + (point2);
							if (presenter.startingLines[point1][point2] === 0 && presenter.answer[point1][point2] == 1) {
								score = 1;
							} else {
								score = 0;
							}
							presenter.triggerLineEvent(line, 1, score);
							line = 'all';
							score = '';
							if (presenter.isAllOK()
									&& presenter.activity) {
								presenter.triggerLineEvent(line, score, score);
							}
							$(view).find('#point_' + presenter.addonID + '_' + presenter.selectedPoint).removeClass('selected');
							presenter.selectedPoint = -1;
						} else if (presenter.currentLines[point1][point2] == 1) {
							$(view).find('#line_' + (point1) + '_' + (point2)).remove();
							presenter.currentLines[point1][point2] = 0;
							line = 'line_' + (point1) + '_' + (point2);
							if (presenter.startingLines[point1][point2] == 1 && presenter.answer[point1][point2] === 0) {
								score = 1;
							} else {
								score = 0;
							}
							presenter.triggerLineEvent(line, 0, score);
							line = 'all';
							score = '';
							if (presenter.isAllOK() && presenter.activity) {
								presenter.triggerLineEvent(line, score, score);
							}
							$(view).find('#point_' + presenter.addonID + '_' + presenter.selectedPoint).removeClass('selected');
							presenter.selectedPoint = -1;
						} else {
							$(view).find('#point_' + presenter.addonID + '_' + presenter.selectedPoint).removeClass('selected');
							presenter.selectedPoint = -1;
						}
					} else {
						$(view).find('#point_' + presenter.addonID + '_' + i).addClass('selected');
						presenter.selectedPoint = i;
					}
				}
			});
	};

	function getMousePositionOnCanvas(e, isTouch) {
		var rect = presenter.canvas.getBoundingClientRect(), client = {
			x : e.clientX,
			y : e.clientY
		};

		return {
			x : parseInt(client.x - rect.left, 10),
			y : parseInt(client.y - rect.top, 10)
		};
	}

	presenter.createPreview = function(view, model) {
		presenter.initiate(view, model);
		var canvasElement = $('<canvas></canvas>'),
		ctx = canvasElement[0].getContext('2d');

		canvasElement.attr('width', presenter.$view.find('.pointslines').parent().width());
		canvasElement.attr('height', presenter.$view.find('.pointslines').parent().height());

		presenter.canvasWidth = presenter.$view.find('.pointslines').parent().width;
		presenter.canvasHeight = presenter.$view.find('.pointslines').parent().height;
		presenter.canvas = canvasElement[0];

		presenter.$view.find('.pointslines').append(canvasElement);
		presenter.canvasOffset = canvasElement.offset();

		var coordinatesContainer = $('<div></div>'),
			xContainer = $('<div>x: <span class="value"></span></div>'),
			yContainer = $('<div>y: <span class="value"></span></div>'),
			coloringWrapper = presenter.$view.find('.pointslines');

		coordinatesContainer.css({
			'width' : 35,
			'height' : 22,
			'border' : '1px solid #696969',
			'borderRadius' : '3px',
			'position' : 'absolute',
			'top' : 3,
			'left' : 3,
			'fontSize' : '9px',
			'padding' : '5px',
			'lineHeight' : '11px'
		});

		coordinatesContainer.append(xContainer).append(yContainer);

		coloringWrapper.append(coordinatesContainer);
		coloringWrapper.css({
			'position' : 'relative',
			'minHeight' : presenter.canvasHeight,
			'minWidth' : presenter.canvasWidth
		});

		canvasElement.on('mousemove', function(e) {
			xContainer.find('.value').html(getMousePositionOnCanvas(e).x);
			yContainer.find('.value').html(getMousePositionOnCanvas(e).y);
		});
	};

	presenter.reset = function() {
		var numberOfPoints = presenter.points.length;
		for ( var i = 0; i < numberOfPoints; i++) {
			for ( var j = i; j < numberOfPoints; j++) {
				presenter.currentLines[i][j] = presenter.startingLines[i][j];
				if ((presenter.startingLines[i][j] == 1 || presenter.startingLines[i][j] == 2) && (presenter.$view.find('#line_' + (i) + '_' + (j)).length <= 0)) {
					presenter.drawLine(i, j);
				} else if (presenter.startingLines[i][j] === 0 && presenter.$view.find('#line_' + (i) + '_' + (j)).length == 1) {
					presenter.$view.find('#line_' + (i) + '_' + (j)).remove();
				}
			}
		}
		presenter.$view.find('.selected').removeClass('selected');
		presenter.selectedPoint = -1;
		presenter.disabled = presenter.initDisabled;
		if (presenter.disabled) {
			presenter.disable();
		} else {
			presenter.enable();
		}
		presenter.isVisible = presenter.initIsVisible;
		presenter.updateVisibility();
		presenter.setWorkMode();
	};

	presenter.getState = function() {
		return JSON.stringify({
			currentLines : presenter.currentLines,
			disabled : presenter.disabled,
			visible : presenter.isVisible
		});
	};

	presenter.setState = function(state) {
		presenter.currentLines = JSON.parse(state).currentLines;
		presenter.disabled = JSON.parse(state).disabled;
		if (presenter.disabled) {
			presenter.disable();
		} else {
			presenter.enable();
		}
		presenter.isVisible = JSON.parse(state).visible;
		presenter.updateVisibility();
		var numberOfPoints = presenter.points.length;
		for ( var i = 0; i < numberOfPoints; i++) {
			for ( var j = i; j < numberOfPoints; j++) {
				if ((presenter.currentLines[i][j] == 1 || presenter.currentLines[i][j] == 2) && (presenter.$view.find('#line_' + (i) + '_' + (j)).length <= 0)) {
					presenter.drawLine(i, j);
				} else {
					if (presenter.currentLines[i][j] === 0 && presenter.$view.find('#line_' + (i) + '_' + (j)).length == 1) {
						presenter.$view.find('#line_' + (i) + '_' + (j)).remove();
					}
				}
			}
		}
	};

	presenter.getMaxScore = function() {
		var numberOfPoints = presenter.points.length;
		if (presenter.activity || (presenter.error !== false)) {
			var licznik = 0;
			var i, j;
			for (i = 0; i < numberOfPoints; i++) {
				for (j = i; j < numberOfPoints; j++) {
					if (presenter.startingLines[i][j] === 0 && presenter.answer[i][j] == 1) {
						licznik++;
					} else if (presenter.startingLines[i][j] == 1 && presenter.answer[i][j] === 0) {
						licznik++;
					}
				}
			}
			return licznik;
		} else {
			return 0;
		}
	};

	presenter.getScore = function(view, model) {
		var numberOfPoints = presenter.points.length;
		if (!presenter.activity || (presenter.error !== false)) {
			return 0;
		} else {
			var licznik = 0;
			var i, j;
			for (i = 0; i < numberOfPoints; i++) {
				for (j = i; j < numberOfPoints; j++) {
					if (presenter.startingLines[i][j] === 0 && presenter.answer[i][j] == 1 && presenter.currentLines[i][j] == 1) {
						licznik++;
					} else if (presenter.startingLines[i][j] == 1 && presenter.answer[i][j] === 0 && presenter.currentLines[i][j] === 0) {
						licznik++;
					}
				}
			}
			return licznik;
		}
	};
 
	presenter.getErrorCount = function() {
		var numberOfPoints = presenter.points.length;
		if (!presenter.activity || (presenter.error !== false)) {
			return 0;
		} else {
			var licznik = 0;
			var i, j;
			for (i = 0; i < numberOfPoints; i++) {
				for (j = i; j < numberOfPoints; j++) {
					if (presenter.startingLines[i][j] === 0 && presenter.answer[i][j] === 0 && presenter.currentLines[i][j] == 1) {
						licznik++;
					} else if (presenter.startingLines[i][j] == 1 && presenter.answer[i][j] == 1 && presenter.currentLines[i][j] === 0) {
						licznik++;
					}
				}
			}
			return licznik;
		}
	};

	presenter.setShowErrorsMode = function() {
		var numberOfPoints = presenter.points.length;
		presenter.isErrorMode = true;
		var i, j;
		if (!presenter.activity)
			return 0;
		if (presenter.getScore() > 0) {
			for (i = 0; i < numberOfPoints; i++) {
				for (j = i; j < numberOfPoints; j++) {
					if (presenter.startingLines[i][j] === 0 && presenter.answer[i][j] == 1 && presenter.currentLines[i][j] == 1) {
						presenter.$view.find('#line_' + i + '_' + j).addClass('correctLine');
					} else if (presenter.startingLines[i][j] == 1 && presenter.answer[i][j] === 0 && presenter.currentLines[i][j] === 0) {
						presenter.$view.find('#line_' + i + '_' + j).addClass('correctLine');
					}
				}
			}
		}
		if (presenter.getErrorCount() > 0) {
			for (i = 0; i < numberOfPoints; i++) {
				for (j = i; j < numberOfPoints; j++) {
					if (presenter.startingLines[i][j] === 0 && presenter.answer[i][j] === 0 && presenter.currentLines[i][j] == 1) {
						presenter.$view.find('#line_' + i + '_' + j).addClass('wrongLine');
					} else if (presenter.startingLines[i][j] == 1 && presenter.answer[i][j] == 1 && presenter.currentLines[i][j] === 0) {
						presenter.$view.find('#line_' + i + '_' + j).addClass('wrongLine');
					}
				}
			}
		}
		if (presenter.getScore() == presenter.getMaxScore() && presenter.getErrorCount() === 0 && !(presenter.isEmpty())) {
			presenter.$view.find('.pointslines').addClass('correct');
		} else if (presenter.getScore() === 0 && presenter.getErrorCount() === 0) {
		} else {
			presenter.$view.find('.pointslines').addClass('wrong');
		}
	};

	presenter.setWorkMode = function() {
		presenter.isErrorMode = false;
		presenter.$view.find('.wrongLine').removeClass('wrongLine');
		presenter.$view.find('.correctLine').removeClass('correctLine');
		presenter.$view.find('.pointslines').removeClass('correct');
		presenter.$view.find('.pointslines').removeClass('wrong');
	};

	return presenter;
}