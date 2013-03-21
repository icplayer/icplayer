function AddonPuzzle_create() {
    var presenter = function() {};

    /* Global variables */
    var board = []; // Array that will hold the 2-dimentional representation of the board.
    var indexBoard = [];

    var intPuzzleWidth = 0;
    var intPuzzleHeight = 0;

    var animation = false;
    var clickNumber = 0; //Check if this is first or second click

    //Keep data from first click
    var PieceOld;
    var PiecePos;
    var PiecePos2;

    var puzzleWidth = 0;
    var puzzleOuterWidth = 0;
    var puzzleHeight = 0;
    var puzzleOuterHeight = 0;
    var leftOffset = 0;
    var topOffset = 0;

    var puzzle = null;

    var Container;
    var jImg;
    var mark;

    var playerController;
    var eventBus;

    function getElementDimensions(element) {
        element = $(element);

        return {
            border:{
                top:parseInt(element.css('border-top-width'), 10),
                bottom:parseInt(element.css('border-bottom-width'), 10),
                left:parseInt(element.css('border-left-width'), 10),
                right:parseInt(element.css('border-right-width'), 10)
            },
            margin:{
                top:parseInt(element.css('margin-top'), 10),
                bottom:parseInt(element.css('margin-bottom'), 10),
                left:parseInt(element.css('margin-left'), 10),
                right:parseInt(element.css('margin-right'), 10)
            },
            padding:{
                top:parseInt(element.css('padding-top'), 10),
                bottom:parseInt(element.css('padding-bottom'), 10),
                left:parseInt(element.css('padding-left'), 10),
                right:parseInt(element.css('padding-right'), 10)
            }
        };
    }

    function calculateOuterDistance(elementDimensions) {
        var top = elementDimensions.border.top;
        top += elementDimensions.margin.top;
        top += elementDimensions.padding.top;

        var bottom = elementDimensions.border.bottom;
        bottom += elementDimensions.margin.bottom;
        bottom += elementDimensions.padding.bottom;

        var left = elementDimensions.border.left;
        left += elementDimensions.margin.left;
        left += elementDimensions.padding.left;

        var right = elementDimensions.border.right;
        right += elementDimensions.margin.right;
        right += elementDimensions.padding.right;

        return {
            vertical : top + bottom,
            horizontal : left + right,
            top: top,
            bottom: bottom,
            left: left,
            right: right,
            paddingLeft: elementDimensions.padding.left,
            paddingTop: elementDimensions.padding.top
        };
    }

    function getOuterDistances() {
        var containerDimensions = getElementDimensions(Container);
        var containerDistances = calculateOuterDistance(containerDimensions);

        var puzzle = $(document.createElement("div"));
        puzzle.addClass('puzzle');
        $(Container).append(puzzle);
        var puzzleDimensions = getElementDimensions(puzzle);
        var puzzleDistances = calculateOuterDistance(puzzleDimensions);
        $(puzzle).remove();

        return {
            container: containerDistances,
            puzzle: puzzleDistances
        };
    }

    function getMarkDimensions() {
        var tempMark = $(document.createElement('div'));
        $(tempMark).addClass('mark').addClass('correct');
        $(Container).append(tempMark);

        var markWidth = $(tempMark).width();
        var markHeight = $(tempMark).height();

        $(tempMark).remove();

        return {
            width: markWidth,
            height: markHeight
        };
    }

    function addBorderClasses() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            h, v;

        for (h = 0; h < columns; h++) {
            $(board[0][h]).addClass('top');
            $(board[rows - 1][h]).addClass('bottom');
        }

        for (v = 0; v < rows; v++) {
            $(board[v][0]).addClass('left');
            $(board[v][columns - 1]).addClass('right');
        }
    }

    function InitPuzzle(width, height) {
        var outerDistances = getOuterDistances();
        var markDimensions = getMarkDimensions();
        var containerWidth = width - outerDistances.container.horizontal;
        var containerHeight = height - outerDistances.container.vertical;
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns;

        puzzleWidth =  parseInt(containerWidth / columns - outerDistances.puzzle.horizontal, 10);
        puzzleOuterWidth = puzzleWidth + outerDistances.puzzle.horizontal;
        puzzleHeight = parseInt(containerHeight / rows - outerDistances.puzzle.vertical, 10);
        puzzleOuterHeight = puzzleHeight + outerDistances.puzzle.vertical;

        topOffset = outerDistances.container.paddingTop;
        leftOffset = outerDistances.container.paddingLeft;

        var markHorizontalOffset = (puzzleOuterWidth - markDimensions.width) / 2;
        var markVerticalOffset = (puzzleOuterHeight - markDimensions.height) / 2;

        for (var row = 0; row < rows; row++) {
            board[row] = [];
            indexBoard[row] = [];

            for (var col = 0; col < columns; col++) {
                var randomId = Math.floor(Math.random() * 1000000 * 1000000) % 1000000;

                mark = $(document.createElement('div'));
                mark.addClass('mark');
                mark.css({
                    top: ((puzzleHeight * row + markVerticalOffset) + "px"),
                    left: ((puzzleWidth * col + markHorizontalOffset) + "px")
                });
                mark.attr("id", randomId + "-" + row + "-" + col);
                indexBoard[row][col] = mark;
                Container.append(mark);

                puzzle = $(document.createElement("div"));
                puzzle.addClass('puzzle');
                puzzle.css({
                    backgroundImage: "url( '" + jImg.attr("src") + "' )",
                    backgroundSize: width + "px " + height + "px" ,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: (
                        (col * -puzzleWidth) + "px " +
                            (row * -puzzleHeight) + "px"
                        ),
                    top: ((puzzleOuterHeight * row + topOffset) + "px"),
                    left: ((puzzleOuterWidth * col + leftOffset) + "px"),
                    width: puzzleWidth + 'px',
                    height: puzzleHeight + 'px'
                });

                puzzle.attr("href", "javascript:void( 0 );").click(clickHandler);
                puzzle.attr("id", randomId + "-" + row + "-" + col);
                board[row][col] = puzzle;
                Container.append(puzzle);
            }
        }

        Container.css({
            width: (puzzleOuterWidth * columns) + 'px',
            height: (puzzleOuterHeight * rows) + 'px'
        });

        addBorderClasses();
        Shuffle();
    }

    function Shuffle() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            i, somePiece;
        animation = false; // Shuffling should be without animation

        for (i = 0; i < (rows*columns*2); i++) {
            somePiece = board[(Math.floor(Math.random() * rows * rows) % rows)]
                [(Math.floor(Math.random() * columns * columns) % columns)];
            somePiece.trigger({
                type: "click",
                triggered: true
            });
        }

        animation = true;
    }

    function elementHasClasses(element) {
        element = $(element);

        return {
            top: element.hasClass('top'),
            bottom: element.hasClass('bottom'),
            left: element.hasClass('left'),
            right: element.hasClass('right')
        };
    }

    function removeBorderClasses(element) {
        $(element).removeClass('top').removeClass('bottom').removeClass('left').removeClass('right');
    }

    function applyBorderClasses(element, classes) {
        for (var className in classes) {
            if (classes[className]) {
                $(element).addClass(className);
            }
        }
    }

    function replaceBorderClasses(firstElement, secondElement) {
        var firstElementClasses = elementHasClasses(firstElement)
        var secondElementClasses = elementHasClasses(secondElement)

        removeBorderClasses(firstElement);
        removeBorderClasses(secondElement);

        applyBorderClasses(firstElement, secondElementClasses);
        applyBorderClasses(secondElement, firstElementClasses);
    }

    function isSamePiece(piece1, piece2) {
        var piece1ID = $(piece1).attr('id'),
            piece2ID = $(piece2).attr('id');

        return piece1ID == piece2ID;
    }

    function clickHandler(event) {
        if (presenter.configuration.isErrorMode) return;

        var Piece = $(this);
        // Check to see if we are in the middle of an animation.
        if (clickNumber == 0) {
            clickNumber = 1;
            PieceOld = $(this);
            PieceOld.addClass('selected');
            PiecePos = {
                top: parseInt(Piece.css("top")),
                left: parseInt(Piece.css("left"))
            };
            PiecePos.row = Math.floor(((PiecePos.top - topOffset) / puzzleOuterHeight) + 0.5);
            PiecePos.col = Math.floor(((PiecePos.left - leftOffset) / puzzleOuterWidth) + 0.5);
        } else {
            clickNumber = 0;
            PiecePos2 = {
                top: parseInt(Piece.css("top")),
                left: parseInt(Piece.css("left"))
            };
            PiecePos2.row = Math.floor(((PiecePos2.top - topOffset) / puzzleOuterHeight) + 0.5);
            PiecePos2.col = Math.floor(((PiecePos2.left - leftOffset) / puzzleOuterWidth) + 0.5);
            PieceOld.removeClass('selected');

            if (isSamePiece(PieceOld, Piece)) return;
            if (!event.triggered) presenter.configuration.shouldCalcScore = true;

            board[PiecePos2.row][PiecePos2.col] = PieceOld;
            board[PiecePos.row][PiecePos.col] = Piece;

            if (animation) {
                //Animate change of places
                board[PiecePos.row][PiecePos.col].animate({
                    left: ((puzzleOuterWidth * PiecePos.col + leftOffset) + "px"),
                    top: ((puzzleOuterHeight * PiecePos.row + topOffset) + "px")
                }, 200);

                board[PiecePos2.row][PiecePos2.col].animate({
                    left: ((puzzleOuterWidth * PiecePos2.col + leftOffset) + "px"),
                    top: ((puzzleOuterHeight * PiecePos2.row + topOffset) + "px")
                }, 200);
            } else {
                board[PiecePos.row][PiecePos.col].css({
                    left: ((puzzleOuterWidth * PiecePos.col + leftOffset) + "px"),
                    top: ((puzzleOuterHeight * PiecePos.row + topOffset) + "px")
                });
                board[PiecePos2.row][PiecePos2.col].css({
                    left: ((puzzleOuterWidth * PiecePos2.col + leftOffset) + "px"),
                    top: ((puzzleOuterHeight * PiecePos2.row + topOffset) + "px")
                });
            }

            replaceBorderClasses(board[PiecePos.row][PiecePos.col], board[PiecePos2.row][PiecePos2.col]);
            if (!event.triggered && presenter.isAllOK()) {
                sendAllOKEvent();
            }
        }
    }

    function setNormalMode() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            rowIndex, colIndex;

        for (rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (colIndex = 0; colIndex < columns; colIndex++) {
                indexBoard[rowIndex][colIndex].removeClass('wrong').removeClass('correct');
            }
        }

        presenter.configuration.isErrorMode = false;
    }

    presenter.reset = function() {
        presenter.configuration.shouldCalcScore = true;
        setNormalMode();
        Shuffle();

        if (presenter.configuration.isVisibleByDefault) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    presenter.getMaxScore = function() {
        return 1;
    };

    presenter.getScore = function() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            row, col;

        for (row = 0; row < rows; row++) {
            for (col = 0; col < columns; col++) {
                if( board[row][col].attr("id") !=  indexBoard[row][col].attr("id")) {
                    return 0;
                }
            }
        }

        return presenter.configuration.shouldCalcScore ? 1 : 0;
    };

    presenter.getErrorCount = function() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            errors = 0;

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < columns; col++) {
                if( board[row][col].attr("id") !=  indexBoard[row][col].attr("id")) {
                    errors++;
                }
            }
        }

        return presenter.configuration.shouldCalcScore ? errors : 0;
    };

    presenter.setWorkMode = function() {
        setNormalMode();
    };

    presenter.setShowErrorsMode = function() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            row, col;

        presenter.configuration.shouldCalcScore = true;

        for (row = 0; row < rows; row++) {
            for (col = 0; col < columns; col++) {
                var isEqual = board[row][col].attr("id") != indexBoard[row][col].attr("id");
                if(isEqual) { //wrong answer
                    indexBoard[row][col].addClass('wrong');
                }else{
                    indexBoard[row][col].addClass('correct');
                }
            }
        }

        presenter.configuration.isErrorMode = true;
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    presenter.run = function(view, model) {
        Container = $($(view).find('.puzzle-container:first')[0]);
        intPuzzleWidth = model.Width;
        intPuzzleHeight = model.Height;
        var width = model.Width;
        var height = model.Height;

        presenter.$view = $(view);
        eventBus = playerController.getEventBus();
        presenter.configuration = presenter.validateModel(model);

        jImg = Container.find( "img:first" );
        jImg.attr('src', model.Image);
        jImg.attr('height', height);
        jImg.attr('width', width);

        if (jImg.complete) { // The image has loaded so call Init.
            InitPuzzle(width, height);
        } else { // The image has not loaded so set an onload event handler to call Init.
            jImg.load(function() {
                InitPuzzle(width, height);
            });
        }

        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hide();
        }
    };

    presenter.validateModel = function (model) {
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isValid: true,
            isErrorMode: false,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            shouldCalcScore: false,
            columns: presenter.validatePuzzleDimension(model.Columns),
            rows: presenter.validatePuzzleDimension(model.Rows),
            addonID: model.ID
        };
    };

    presenter.validatePuzzleDimension = function (dimension) {
        var validatedRange = ModelValidationUtils.validateIntegerInRange(dimension, 10, 1);

        return validatedRange.isValid ? validatedRange.value : 4;
    };

    presenter.createPreview = function(view, model) {
        var element = view.getElementsByTagName('img')[0];
        element.setAttribute('src', model.Image);

        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isVisibleByDefault) {
            presenter.hide();
        }
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isAllOK': presenter.isAllOK
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.configuration.shouldCalcScore = true;
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.configuration.shouldCalcScore = true;
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.isAllOK = function () {
        presenter.configuration.shouldCalcScore = true;
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    function sendAllOKEvent () {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    }

    return presenter;
}