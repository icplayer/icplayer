function AddonPuzzle_create() {
    var presenter = function () {};

    /* Global variables */
    var board = []; // Array that will hold the 2-dimentional representation of the board.
    var indexBoard = []; // board storing marks
    var savedBoard = [];

    var intPuzzleWidth = 0;
    var intPuzzleHeight = 0;

    var animation = false;
    var clickNumber = 0; //Check if this is first or second click

    //Keep data from first click
    var PieceOld;
    var PiecePos;
    var PiecePos2;

    var DragStartPos;
    var DraggedPiece;
    var hoverClass = "being-hovered";
    var hoveredOverByOtherClass = "hovered-over-by-other";

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

    presenter.previousScore = 0;
    presenter.previousErrors = 0;
    presenter.isPreview = false;

    function getElementDimensions(element) {
        element = $(element);

        return {
            border: {
                top: parseInt(element.css('border-top-width'), 10),
                bottom: parseInt(element.css('border-bottom-width'), 10),
                left: parseInt(element.css('border-left-width'), 10),
                right: parseInt(element.css('border-right-width'), 10)
            },
            margin: {
                top: parseInt(element.css('margin-top'), 10),
                bottom: parseInt(element.css('margin-bottom'), 10),
                left: parseInt(element.css('margin-left'), 10),
                right: parseInt(element.css('margin-right'), 10)
            },
            padding: {
                top: parseInt(element.css('padding-top'), 10),
                bottom: parseInt(element.css('padding-bottom'), 10),
                left: parseInt(element.css('padding-left'), 10),
                right: parseInt(element.css('padding-right'), 10)
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
            vertical: top + bottom,
            horizontal: left + right,
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

    function InitPuzzleBoard() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns;
        for (var row = 0; row < rows; row++) {
            board[row] = [];
            indexBoard[row] = [];
            for (var col = 0; col < columns; col++) {
                mark = $(document.createElement('div'));
                mark.addClass('mark');
                mark.attr("position", row + "-" + col);
                indexBoard[row][col] = mark;

                puzzle = $(document.createElement("div"));
                puzzle.addClass('puzzle');
                puzzle.attr("position", row + "-" + col);
                puzzle.attr("href", "javascript:void( 0 );").click(clickHandler);
                board[row][col] = puzzle;
            }
        }
    }

    function InitPuzzle(width, height) {
        var outerDistances = getOuterDistances();
        var markDimensions = getMarkDimensions();
        var containerWidth = width - outerDistances.container.horizontal;
        var containerHeight = height - outerDistances.container.vertical;
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns;

        puzzleWidth = parseInt(containerWidth / columns - outerDistances.puzzle.horizontal, 10);
        puzzleOuterWidth = puzzleWidth + outerDistances.puzzle.horizontal;
        puzzleHeight = parseInt(containerHeight / rows - outerDistances.puzzle.vertical, 10);
        puzzleOuterHeight = puzzleHeight + outerDistances.puzzle.vertical;

        topOffset = outerDistances.container.paddingTop;
        leftOffset = outerDistances.container.paddingLeft;

        var markHorizontalOffset = (puzzleOuterWidth - markDimensions.width) / 2;
        var markVerticalOffset = (puzzleOuterHeight - markDimensions.height) / 2;

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < columns; col++) {
                mark = indexBoard[row][col];
                mark.css({
                    top: ((puzzleHeight * row + markVerticalOffset) + "px"),
                    left: ((puzzleWidth * col + markHorizontalOffset) + "px")
                });
                indexBoard[row][col] = mark;
                Container.append(mark);

                puzzle = board[row][col];
                puzzle.css({
                    backgroundImage: "url( '" + jImg.attr("src") + "' )",
                    backgroundSize: width + "px " + height + "px",
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
                board[row][col] = puzzle;
                Container.append(puzzle);

                // first add it to DOM, then apply draggable, so that it won't add position: relative to element
                addDraggableDroppable(puzzle);
            }
        }

        Container.css({
            width: (puzzleOuterWidth * columns) + 'px',
            height: (puzzleOuterHeight * rows) + 'px'
        });

        addBorderClasses();
        Shuffle();
    }

    function addDraggableDroppable(puzzle) {
        puzzle.draggable({
            delay: 150, // to give more time before drag starts, to prevent drags when clicking
            // don't use container or revert, as those options are bugged in subtle ways
            start: function(event,ui) {
                // clear state if it was clicked before
                clickNumber = 0;

                // remove class selected, so that when user clicks on piece, and then starts to drag, it won't
                if (PieceOld)
                    PieceOld.removeClass('selected');

                // this prevents clickHandler from being called, because jquery would call it in such situation:
                // user is dragging element, and lifts mouse button, and *pointer is still over element when drag stops*
                ui.helper.off("click");

                DraggedPiece = ui.helper;
                DraggedPiece.addClass( hoverClass );

                DragStartPos = presenter.getPiecePositionData(DraggedPiece);

                ui.position.left = 0;
                ui.position.top = 0;
            },
            drag : function(event, ui) {
                const scale = getScale();
                const changeLeft = ui.position.left - ui.originalPosition.left;  // find change in left
                const newLeft = ui.originalPosition.left + changeLeft / scale.X; // adjust new left by our zoomScale

                const changeTop = ui.position.top - ui.originalPosition.top;  // find change in top
                const newTop = ui.originalPosition.top + changeTop / scale.Y; // adjust new top by our zoomScale

                ui.position.left = newLeft;
                ui.position.top = newTop;
            },
            stop: function(event,ui) {

                if (DraggedPiece) {
                    // revert position
                    DraggedPiece.animate({
                        left: (DragStartPos.left + "px"),
                        top: (DragStartPos.top + "px")
                        }, 200,
                        function() { ui.helper.removeClass( hoverClass ); }
                    );
                    DraggedPiece = null;
                    DragStartPos = null;
                } else {
                    // it was dropped on other puzzle before, but we still need to clear hover
                    ui.helper.removeClass( hoverClass );
                }

                sendEvents(puzzle);

                // bringing it back here directly would make the click be called on puzzle (see comment in start), so we want
                // to do it in next browser update cycle
                setTimeout(
                    function() { ui.helper.attr("href", "javascript:void( 0 );").click(clickHandler); }
                    ,  0 );
            }
        });

        puzzle.droppable({
            activate: function (event, ui) {
                const scale = getScale();
                // add marker to currently dragged element to scale its proportions
                if (presenter.$view.find( "." + hoverClass ).length > 0 && scale.X !== 1 && scale.Y !== 1) {
                    $.ui.ddmanager.current.useScaledProportions = true;
                }
            },
            drop: function (event, ui) {
                if (!DragStartPos)
                    return;

                var DraggedOnPiece = $(this);
                DraggedOnPiece.removeClass(hoveredOverByOtherClass);

                var DragEndPos = presenter.getPiecePositionData(DraggedOnPiece);

                board[DragEndPos.row][DragEndPos.col].animate({
                    left: ((puzzleOuterWidth * DragStartPos.col + leftOffset) + "px"),
                    top: ((puzzleOuterHeight * DragStartPos.row + topOffset) + "px")
                }, 200);

                board[DragStartPos.row][DragStartPos.col].animate({
                    left: ((puzzleOuterWidth * DragEndPos.col + leftOffset) + "px"),
                    top: ((puzzleOuterHeight * DragEndPos.row + topOffset) + "px")
                }, 200);

                var temp = board[DragStartPos.row][DragStartPos.col];
                board[DragStartPos.row][DragStartPos.col] = DraggedOnPiece;
                board[DragEndPos.row][DragEndPos.col] = temp;

                replaceBorderClasses(board[DragStartPos.row][DragStartPos.col], board[DragEndPos.row][DragEndPos.col]);

                DraggedPiece = null;
                DragStartPos = null;
            },
            over: function (event, ui) {
                $(this).addClass(hoveredOverByOtherClass);
            },
            // Triggered when an accepted draggable is dragged out of the droppable
            out: function (event, ui) {
                $(this).removeClass(hoveredOverByOtherClass);
            }
        });
    }

    function getScale() {
        if (playerController) {
            const scaleInformation = playerController.getScaleInformation();
            if (scaleInformation.baseScaleX !== 1.0 ||
                scaleInformation.baseScaleY !== 1.0 ||
                scaleInformation.scaleX !== 1.0 ||
                scaleInformation.scaleY !== 1.0
            ) {
                return {X: scaleInformation.scaleX, Y: scaleInformation.scaleY};
            }
        }

        const $content = $("#content");
        if ($content.size() > 0) {
            const contentElem = $content[0];
            const scaleX = contentElem.getBoundingClientRect().width / contentElem.offsetWidth;
            const scaleY = contentElem.getBoundingClientRect().height / contentElem.offsetHeight;
            return {X: scaleX, Y: scaleY};
        } else {
            return {X: 1.0, Y: 1.0};
        }
    }

    presenter.getPiecePositionData = function(piece) {
        var Pos = {
            top: parseInt(piece.css("top")),
            left: parseInt(piece.css("left"))
        };
        Pos.row = Math.floor(((Pos.top - topOffset) / puzzleOuterHeight) + 0.5);
        Pos.col = Math.floor(((Pos.left - leftOffset) / puzzleOuterWidth) + 0.5);
        return Pos;
    };

    /**
     * Fisher-Yates Shuffle algorithm: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
     * Original algorithm is based on flatt, one-dimension array. For our purposes (working on two-dimension arrays)
     * firstly we have to flatten the structure.
     *
     * Additionally Knuth allows items to be shuffled multiple times - in our case each puzzle (array element) has to be
     * shuffled once, but the whole procedure should be repeated at least twice.
     */

    presenter.getShuffleSequence = function (array) {
        var flatArray = [],
            shuffleSequence = [],
            row, column, counter, index;

        for (row = 0; row < array.length; row++) {
            for (column = 0; column < array[row].length; column++) {
                flatArray.push({ row: row, column: column });
            }
        }

        counter = flatArray.length - 1;

        // While there are at least two elements in the array we generate next shuffle sequence. If array has only one
        // element we end the sequence (there is no sense in shuffling puzzle in place).
        while (counter >= 2) {
            index = (Math.random() * counter) | 0;

            shuffleSequence.push({
                row: { from: flatArray[counter].row, to: flatArray[index].row },
                column: { from: flatArray[counter].column, to: flatArray[index].column }
            });

            flatArray.splice(index, 1);
            flatArray.splice(-1, 1);

            counter -= 2;
        }
        return shuffleSequence;
    };

    function Shuffle() {
        var i, iteration,
            shuffleSequence, shuffle,
            $firstPiece, $secondPiece;

        animation = false; // Shuffling should be without animation


        for (iteration = 0; iteration < 3; iteration++) {
            shuffleSequence = presenter.getShuffleSequence(board);

            for (i = 0; i < shuffleSequence.length; i++) {
                shuffle = shuffleSequence[i];

                $firstPiece = board[shuffle.row.from][shuffle.column.from];
                $firstPiece.trigger({
                    type: "click",
                    triggered: true
                });


                $secondPiece = board[shuffle.row.to][shuffle.column.to];
                $secondPiece.trigger({
                    type: "click",
                    triggered: true
                });
            }
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
        var firstElementClasses = elementHasClasses(firstElement);
        var secondElementClasses = elementHasClasses(secondElement);

        removeBorderClasses(firstElement);
        removeBorderClasses(secondElement);

        applyBorderClasses(firstElement, secondElementClasses);
        applyBorderClasses(secondElement, firstElementClasses);
    }

    function isSamePiece(piece1, piece2) {
        var piece1ID = $(piece1).attr('position'),
            piece2ID = $(piece2).attr('position');

        return piece1ID == piece2ID;
    }

    function clickHandler(event) {
        if(presenter.isShowAnswersActive) {
            return;
        }
        event.stopPropagation();

        if (presenter.configuration.isErrorMode) return;

        var Piece = $(this);
        // Check to see if we are in the middle of an animation.
        if (clickNumber == 0) {
            clickNumber = 1;
            PieceOld = $(this);
            PieceOld.addClass('selected');
            PiecePos = presenter.getPiecePositionData(Piece);
        } else {
            swapPieces(Piece, event);
        }
    }

    function swapPieces(Piece,event) {

        clickNumber = 0;
        PiecePos2 = presenter.getPiecePositionData(Piece);
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

        if (!event.triggered) {
            sendEvents(Piece);
        }
    }

    function sendEvents(puzzle) {
        sendValueChangedEvent(puzzle);
        if (presenter.isAllOK()) {
            sendAllOKEvent();
        }
    }

    function sendValueChangedEvent(puzzle) {
        var data = {
            'source': presenter.configuration.addonID,
            'item': puzzle.attr("position"),
            'value': '',
            'score': ''
        };
        eventBus.sendEvent('ValueChanged', data);
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
        presenter.setDraggableState("enable");
        presenter.configuration.isErrorMode = false;
    }

    presenter.setDraggableState = function(state) {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns;
        for (var row = 0; row < rows; row++) {
            for (var column = 0; column < columns; column++) {
                var element = board[row][column];
                element.draggable( state );
            }
        }
    };

    presenter.reset = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }
        presenter.configuration.shouldCalcScore = true;
        setNormalMode();
        Shuffle();

        if (presenter.configuration.isVisibleByDefault) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    presenter.setMarkVisibility = function (isVisible) {
        // it will be called by createPreview, in which case indexBoard won't be created
        if (presenter.isPreview || indexBoard.length === 0) {
            return;
        }

        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            rowIndex, colIndex;

        for (rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (colIndex = 0; colIndex < columns; colIndex++) {
                indexBoard[rowIndex][colIndex].css("visibility", isVisible ? "visible" : "hidden");
            }
        }
    }

    presenter.prepareBoardFromSavedState = function (savedBoard) {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            index, rowIndex, colIndex,
            newBoard = [],
            puzzle, savedPuzzle;

        animation = false;

        for (rowIndex = 0; rowIndex < rows; rowIndex++) {
            newBoard[rowIndex] = [];
        }

        for (rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (colIndex = 0; colIndex < columns; colIndex++) {
                puzzle = board[rowIndex][colIndex];
                for (index = 0; index < savedBoard.length; index++) {
                    if (puzzle.attr("position") == savedBoard[index].position) {
                        savedPuzzle = savedBoard[index];
                        newBoard[savedPuzzle.row][savedPuzzle.col] = puzzle;
                        newBoard[savedPuzzle.row][savedPuzzle.col].css({
                            left: ((puzzleOuterWidth * savedPuzzle.col + leftOffset) + "px"),
                            top: ((puzzleOuterHeight * savedPuzzle.row + topOffset) + "px")
                        });
                        savedBoard.splice(index, 1);
                    }
                }
            }
        }

        board = newBoard;
        animation = true;
    };

    presenter.saveBoard = function () {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            rowIndex, colIndex,
            tmpBoard = [];


        for (rowIndex = 0; rowIndex < rows; rowIndex++) {
            for (colIndex = 0; colIndex < columns; colIndex++) {
                var card = {};
                card.row = rowIndex;
                card.col = colIndex;
                card.position = board[rowIndex][colIndex].attr("position");
                tmpBoard.push(card);
            }
        }
        savedBoard = tmpBoard;
    };

    presenter.getState = function () {
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        if (!presenter.isFullyLoaded()) {
            return "";
        }

        presenter.saveBoard();

        return JSON.stringify({
            visible: presenter.configuration.isVisible,
            board: savedBoard,
            shouldCalcScore: presenter.configuration.shouldCalcScore,
            score: presenter.getScore(),
            errors: presenter.getErrorCount()
        });
    };

    presenter.setState = function (state) {
        if (!state) return;

        var parsedState = JSON.parse(state);

        if (parsedState.score) {
            presenter.previousScore = parsedState.score;
        }

        if (parsedState.errors) {
            presenter.previousErrors = parsedState.errors;
        }

        $.when(presenter['imageLoaded']).then(function () {
            presenter.prepareBoardFromSavedState(parsedState.board);
            presenter.configuration.shouldCalcScore = parsedState.shouldCalcScore;
            if (!parsedState.visible) {
                presenter.hide();
            } else {
                presenter.show();
            }
        });
    };

    presenter.getMaxScore = function () {
        if (presenter.isPreview || presenter.configuration.isNotActivity) {
            return 0;
        }
        return 1;
    };

    presenter.getScore = function () {
        if (!presenter.isFullyLoaded()) {
            return presenter.previousScore;
        }
        if(presenter.configuration.isNotActivity) {
            return 0;
        }

        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            row, col;

        for (row = 0; row < rows; row++) {
            for (col = 0; col < columns; col++) {
                if (board[row][col].attr("position") != indexBoard[row][col].attr("position")) {
                    return 0;
                }
            }
        }

        return presenter.configuration.shouldCalcScore ? 1 : 0;
    };

    presenter.getErrorCount = function () {
        if (!presenter.isFullyLoaded()) {
            return presenter.previousErrors;
        }
        if(presenter.configuration.isNotActivity) {
            return 0;
        }

        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            errors = 0;

        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < columns; col++) {
                if (board[row][col].attr("position") != indexBoard[row][col].attr("position")) {
                    errors++;
                }
            }
        }

        return presenter.configuration.shouldCalcScore ? errors : 0;
    };

    presenter.setWorkMode = function () {
        setNormalMode();
    };

    presenter.setShowErrorsMode = function () {
        if(presenter.configuration.isNotActivity) {
            return 0;
        }
        if (presenter.isShowAnswersActive) {
            presenter.hideAnswers();
        }

        presenter.setDraggableState("disable");
        presenter.configuration.isErrorMode = true;

        if (!presenter.isFullyLoaded()) {
            return;
        }

        presenter.configuration.shouldCalcScore = true;

        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns,
            row, col;

        for (row = 0; row < rows; row++) {
            for (col = 0; col < columns; col++) {
                var isEqual = board[row][col].attr("position") != indexBoard[row][col].attr("position");
                if (isEqual) { //wrong answer
                    indexBoard[row][col].addClass('wrong');
                } else {
                    indexBoard[row][col].addClass('correct');
                }
            }
        }
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    presenter.isFullyLoaded = function () {
        return presenter['imageLoadedDeferred'].state() != "pending";
    };

    presenter.run = function (view, model) {
        Container = $($(view).find('.puzzle-container:first')[0]);
        intPuzzleWidth = model.Width;
        intPuzzleHeight = model.Height;
        var width = model.Width;
        var height = model.Height;
        presenter.$view = $(view);
        eventBus = playerController.getEventBus();
        eventBus.addEventListener('ShowAnswers', this);
        eventBus.addEventListener('HideAnswers', this);
        const upgradedModel = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(upgradedModel);
        presenter.isPreview = false;
        InitPuzzleBoard()

        jImg = Container.find("img:first");
        jImg.attr('src', model.Image);
        jImg.attr('height', height);
        jImg.attr('width', width);
        jImg.load(function () {
            InitPuzzle(width, height);
            if (!presenter.configuration.isVisibleByDefault) {
                presenter.hide();
            }
            presenter['imageLoadedDeferred'].resolve();
            if (presenter.configuration.isErrorMode){
                presenter.setShowErrorsMode()
            }
        });

    };

    presenter.validateModel = function (model) {
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        var isNotActivity = ModelValidationUtils.validateBoolean(model['isNotActivity']);
        LoadedPromise(this, {
            'image' : true
        });
        return {
            isValid: true,
            isErrorMode: false,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            shouldCalcScore: false,
            columns: presenter.validatePuzzleDimension(model.Columns),
            rows: presenter.validatePuzzleDimension(model.Rows),
            isNotActivity: isNotActivity,
            addonID: model.ID
        };
    };

    presenter.validatePuzzleDimension = function (dimension) {
        var validatedRange = ModelValidationUtils.validateIntegerInRange(dimension, 10, 1);

        return validatedRange.isValid ? validatedRange.value : 4;
    };

    presenter.upgradeModel = function (model) {
        return presenter.upgradeIsNotActivity(model);
    };

    presenter.upgradeIsNotActivity = function (model) {
        const upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel['isNotActivity'] === undefined) {
            upgradedModel['isNotActivity'] = 'False';
        }

        return upgradedModel;
    };

    presenter.createPreview = function (view, model) {
        presenter.isPreview = true;
        var element = view.getElementsByTagName('img')[0];
        element.setAttribute('src', model.Image);

        presenter.$view = $(view);
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.configuration.isErrorMode) return;

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isAllOK': presenter.isAllOK,
            'getLoadedPromise': presenter.getLoadedPromise,
            'reset': presenter.reset
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        presenter.configuration.shouldCalcScore = true;
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
        presenter.setMarkVisibility(true);
    };

    presenter.hide = function () {
        presenter.configuration.shouldCalcScore = true;
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
        presenter.setMarkVisibility(false);
    };

    presenter.isAllOK = function () {
        presenter.configuration.shouldCalcScore = true;
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    function sendAllOKEvent() {
        var eventData = {
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };

        eventBus.sendEvent('ValueChanged', eventData);
    }

    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    function showCorrect() {
        var rows = presenter.configuration.rows,
            columns = presenter.configuration.columns;

        for (var row = 0; row < rows; row++) {
            for (var column = 0; column < columns; column++) {
                var element = board[row][column],
                    position = element.attr("position"),
                    splittedPosition = position.split("-");

                element.css({
                    left: ((puzzleOuterWidth * splittedPosition[1] + leftOffset) + "px"),
                    top: ((puzzleOuterHeight * splittedPosition[0] + topOffset) + "px")
                });

                element.addClass("show-answers");
            }
        }
    }

    presenter.showAnswers = function () {
        if(presenter.configuration.isNotActivity) {
            return;
        }
        presenter.isShowAnswersActive = true;
        presenter.saveBoard();
        presenter.setWorkMode();
        showCorrect();
        presenter.setDraggableState("disable");
    };

    presenter.hideAnswers = function () {
        if (!presenter.isShowAnswersActive) {
            return;
        }

        Container.find(".show-answers").removeClass("show-answers");
        $.when(presenter['imageLoaded']).then(function () {
            presenter.prepareBoardFromSavedState(savedBoard);
            presenter.setDraggableState("enable");
        });

        presenter.isShowAnswersActive = false;
    };

    return presenter;
}