function AddonDrawing_create() {
			
			var presenter = function(){};

			var element;

			function getPosition(e, canvas) {
				var x, y;
				
				if (e.pageX !== undefined && e.pageY !== undefined) {
					x = e.pageX;
					y = e.pageY;
				} else {
					x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}

				return {
					X: x - $(canvas).offset().left,
					Y: y - $(canvas).offset().top
				};
			}

            function draw(ctx, x, y) {
                ctx.moveTo(x, y);
                ctx.beginPath();
                ctx.stroke();
                ctx.arc(x, y, presenter.configuration.thickness, 0, 2 * Math.PI, false);
                ctx.fillStyle = presenter.configuration.color;
                ctx.fill();
                ctx.closePath();
            }
			
			presenter.turnOnEventListeners = function() {
				var $canvas = presenter.$view.find('.drawing'),
                    ctx = presenter.configuration.context,
					isPainting = false;

                // MOUSE events
				$canvas.on('mousedown', function(e) {
					isPainting = true;
                    var pos = getPosition(e, $canvas);
                    draw(ctx, pos.X, pos.Y);
				});
				
				$canvas.on('mousemove', function(e) {
                    var pos = getPosition(e, $canvas);

					if (isPainting) {
                        draw(ctx, pos.X, pos.Y);
					}
				});
				
				$canvas.on('mouseup', function() {
					isPainting = false;
				});

                // TOUCH events
                $canvas.on('touchstart', function(e) {
                    isPainting = true;
                    e.preventDefault();
                    var pos = getPosition(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0], $canvas);
                    draw(ctx, pos.X, pos.Y);
                });

                $canvas.on('touchmove', function(e) {
                    e.preventDefault();
                    var pos = getPosition(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0], $canvas);

                    if (isPainting) {
                        draw(ctx, pos.X, pos.Y);
                    }
                });

                $canvas.on('touchend', function(e) {
                    e.preventDefault();
                    isPainting = false;
                });

			};
			
			function returnErrorObject(errorCode) {
				return { isValid: false, errorCode: errorCode };
			}
			
			presenter.ERROR_CODES = {
				C01: 'Property color cannot be empty',
				C02: 'Property color has wrong length in hex format, it should be 3 or 6 digits [0 - F]',
				
				T01: 'Property thickness cannot be empty',
				T02: 'Property thickness cannot be smaller than 1',
				T03: 'Property thickness cannot be bigger than 20',
				
				B01: 'Property border cannot be empty',
				B02: 'Property border cannot be smaller than 0',
				B03: 'Property border cannot be bigger than 5'
			};
			
			presenter.run = function(view, model) {
				presenter.presenterLogic(view, model, false);
			};
			
			presenter.createPreview = function(view, model) {
				presenter.presenterLogic(view, model, true);
			};

            function resizeCanvas() {
                var con = presenter.$view.find('.drawing'),
                    canvas = presenter.configuration.canvas[0];
                    //aspect = canvas.height / canvas.width;

                canvas.width = con.width();
                canvas.height = con.height(); //Math.round(canvas.width * aspect);
            }
			
			presenter.presenterLogic = function(view, model, isPreview) {
				presenter.$view = $(view);
		
				presenter.configuration = presenter.validateModel(model);
				if (!presenter.configuration.isValid) {
					DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
					return;
				}

                presenter.$view.find('.drawing').append("<canvas>element canvas is not supported by your browser</canvas>");

                var border = presenter.configuration.border;

				presenter.$view.find('canvas')
				.height(presenter.configuration.height)
				.width(presenter.configuration.width);

				if (presenter.configuration.border !== 0) {
					presenter.$view.find('canvas').css('border', border + 'px solid black');
				}
				
				presenter.configuration.canvas = presenter.$view.find('canvas');
				presenter.configuration.context = presenter.configuration.canvas[0].getContext("2d");

                resizeCanvas();

                if (!isPreview) {
                    presenter.turnOnEventListeners();
                }

				presenter.setVisibility(presenter.configuration.isVisible);
			};

            presenter.setColor = function(color) {
                presenter.configuration.color = presenter.parseColor(color).color;
                presenter.configuration.context.fillStyle = presenter.parseColor(color).color;
            };

            presenter.setThickness = function(thickness) {
                presenter.configuration.thickness = presenter.parseThickness(thickness).thickness;
            };

			presenter.validateModel = function(model) {

				if (ModelValidationUtils.isStringEmpty(model.Color)) {
					return returnErrorObject('C01');
				}
				
				var parsedColor = presenter.parseColor(model.Color);
				if (!parsedColor.isValid) {
					return returnErrorObject(parsedColor.errorCode);
				}
				
				if (ModelValidationUtils.isStringEmpty(model.Thickness)) {
					return returnErrorObject('T01');
				}
		
				var parsedThickness = presenter.parseThickness(model.Thickness);
				if (!parsedThickness.isValid) {
					return returnErrorObject(parsedThickness.errorCode);
				}
				
				if (ModelValidationUtils.isStringEmpty(model.Border)) {
					return returnErrorObject('B01');
				}
				
				var parsedBorder = presenter.parseBorder(model.Border);
				if (!parsedBorder.isValid) {
					return returnErrorObject(parsedBorder.errorCode);
				}
		
				return {
					color: parsedColor.color,
                    thickness: parsedThickness.thickness,
					border: parsedBorder.border,
					
					canvas: null,
					context: null,
					
					width: model.Width,
					height: model.Height,
					isValid: true,
					isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
					isExerciseStarted: false
				};
			};
			
			presenter.parseColor = function(color) {
				
				if (color[0] === '#' && !(color.length === 4 || color.length === 7)) {
					return returnErrorObject('C02');
				}
				
				return {
					color: color,
					isValid: true
				};
				
			};
			
			presenter.parseThickness = function(thickness) {
				
				if (thickness < 1) {
					return returnErrorObject('T02');
				}
				
				if (thickness > 20) {
					return returnErrorObject('T03');
				}
				
				return {
                    thickness: thickness,
					isValid: true
				};

			};
			
			presenter.parseBorder = function(border) {
				
				if (border < 0) {
					return returnErrorObject('B02');
				}
				
				if (border > 5) {
					return returnErrorObject('B03');
				}
				
				return {
					border: border,
					isValid: true
				};

			};
			
			presenter.executeCommand = function(name, params) {
				if (!presenter.configuration.isValid) {
					return;
				}
		
				var commands = {
					'show': presenter.show,
					'hide': presenter.hide
				};
		
				Commands.dispatch(commands, name, params, presenter);
			};
		
			presenter.setVisibility = function(isVisible) {
				presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
			};
		
			presenter.show = function() {
				presenter.setVisibility(true);
				presenter.configuration.isVisible = true;
			};
		
			presenter.hide = function() {
				presenter.setVisibility(false);
				presenter.configuration.isVisible = false;
			};

			presenter.setShowErrorsMode = function() {

			};
			
			presenter.setWorkMode = function() {

			};
			
			presenter.reset = function() {
				presenter.configuration.context.clearRect(0, 0, presenter.configuration.canvas[0].width, presenter.configuration.canvas[0].height);
			};
			
			/*presenter.getErrorCount = function() {
				return 7;
			};
			
			presenter.getMaxScore = function() {
				return 3;
			};
			
			presenter.getScore = function() {
				return 1;
			};*/
			
			presenter.getState = function() {
                var img = presenter.configuration.context.getImageData(0, 0, presenter.configuration.canvas[0].width, presenter.configuration.canvas[0].height);

                return JSON.stringify({
                    pixels: img.data,
                    isVisible: presenter.configuration.isVisible
                });
			};

			presenter.setState = function(state) {
                if (ModelValidationUtils.isStringEmpty(state)) {
                    return;
                }

                var pixels = JSON.parse(state).pixels,
                    isVisible = JSON.parse(state).isVisible;

                var img = presenter.configuration.context.getImageData(0, 0, presenter.configuration.canvas[0].width, presenter.configuration.canvas[0].height);
                var pix = img.data;

                for (var p in pixels) {
                    pix[p] = pixels[p];
                }

                presenter.configuration.context.putImageData(img, 0, 0);

                presenter.configuration.isVisible = isVisible;
			};

			return presenter;
		}