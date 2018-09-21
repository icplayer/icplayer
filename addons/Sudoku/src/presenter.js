function AddonSudoku_create(){

    var presenter = function(){};

    presenter.isActivity = false;
    presenter.isErrorCheckingMode = false;
    presenter.isActivity = false;
    presenter.initialView = [];
    presenter.initialViewNumbers = 0;
    presenter.currentViewNumbers = 0;
    presenter.isErrorCheckingMode = false;
    presenter.cells = [];
    presenter.currentAnswer = [];
    presenter.eventBus = '';
    presenter.isShowAnswerMode = false;

    function displayText() {
        var textToDisplay = presenter.model['Text to be displayed'],
            isTextColored = presenter.model['Color text'] === 'True',
            $textContainer = presenter.$view.find('.some-text-container');

        $textContainer.text(textToDisplay);
        if (isTextColored) {
            $textContainer.css('color', 'red');
        }
    }



    presenter.executeCommand = function(name, params) {
        switch(name.toLowerCase()) {
            case 'enable'.toLowerCase():
                presenter.enable();
                break;
            case 'disable'.toLowerCase():
                presenter.disable();
                break;
            case 'show'.toLowerCase():
                presenter.show();
                break;
            case 'hide'.toLowerCase():
                presenter.hide();
                break;
            case 'isAttempted'.toLowerCase():
                presenter.isAttempted();
                break;
            case 'reset'.toLowerCase():
                presenter.reset();
                break;
        }
    };

    presenter.drawSudoku = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.modelID = model.ID;
        presenter.Height = parseInt(model.Height,10);
        presenter.Width = parseInt(model.Width,10);
        presenter.number = Math.floor((Math.random()*100)+1);


        var fig = '<table>';
        fig += '<tr>';

        fig += '<td valign="top">';
        fig += '<form class="board" autocomplete="off">';
        fig += '<table cellspacing="0" cellpadding="0" border="0">';
        fig += '<tr>';
        fig += '<td><input class="c v h cell active" id="c11'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c12'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c13'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c14'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c15'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c16'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c17'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c18'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c19'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v h cell active" id="c21'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c22'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c23'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c24'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c25'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c26'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c27'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c28'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c29'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v  cell active" id="c31'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c32'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c33'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c34'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c35'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c36'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c37'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c38'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c39'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v h cell active" id="c41'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c42'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c43'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c44'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c45'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c46'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c47'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c48'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c49'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v h cell active" id="c51'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c52'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c53'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c54'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c55'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c56'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c57'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c58'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c59'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v  cell active" id="c61'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c62'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c63'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c64'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c65'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c66'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c67'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c68'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c69'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v h cell active" id="c71'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c72'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c73'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c74'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c75'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c76'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c77'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c78'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c79'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v h cell active" id="c81'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c82'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c83'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c84'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c85'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c86'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c87'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v h cell active" id="c88'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c   h cell active" id="c89'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '<tr>';
        fig += '<td><input class="c v  cell active" id="c91'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c92'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c93'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c94'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c95'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c96'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c97'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c v  cell active" id="c98'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '<td><input class="c    cell active" id="c99'+ presenter.modelID + presenter.number +'" maxlength="1" autocomplete="off" /></td>';
        fig += '</tr>';
        fig += '</table>';
        fig += '</form>';
        fig += '</td>';
        fig += '</tr>';
        fig += '</table>';

        return fig;
    };

    presenter.checkRowsValues = function(value, view){
        var regExp = new RegExp('\n');
        $counter = $(view).find('.sudoku-counter');
        var step = 1;
        var enters = 0;
        for(i = 0; i< value.length; i++){
            if(value[i] != ' ') {
                if((parseInt(value[i],10) < 1 || isNaN(value[i],10)) && !value[i].match(regExp) && value[i] != '_'){
                    $counter.text('Row '+(enters + 1)+' has incorrect value.');
                    return false;
                }
                if(step > 10){
                    $counter.text('Row '+(enters + 1)+' has more than 9 values.');
                    return false;
                }
                if(enters > 8){
                    $counter.text('There are more than 9 rows.');
                    return false;
                }
                if(value[i].match(regExp)) {
                    enters++;
                    step = 1;
                } else{
                    step++;
                }
            }

        }
        return true;
    };


    presenter.validate = function(view, model){
        presenter.$view = $(view);
        presenter.model = model;
        $counter = $(view).find('.sudoku-counter');

        if(!presenter.checkRowsValues(model.Values, view)){
            return false;
        }

        return true;
    };

    presenter.init = function(view, model){
        presenter.$view = $(view);
        presenter.model = model;
        presenter.modelID = model.ID;
        presenter.isActivity = model.isActivity == "True" ? true : false;
        presenter.isDisable = model.isDisable == "True" ? true : false;
        presenter.wasDisable = model.isDisable == "True" ? true : false;
        presenter.wasVisible = model["Is Visible"] == 'True';
        presenter.isVisible = model["Is Visible"] == 'True';
        presenter.Values = model.Values;


        var myDiv =  $(view).find('.sudoku-wrapper')[0];

        var figureSudoku = presenter.drawSudoku(view, model);
        $(myDiv).append(figureSudoku);

        if(presenter.isDisable){
            presenter.disable();
        }

        presenter.cells = [[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9]];
        presenter.currentAnswer = [['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','','']];
        for(j=1;j<=9;j++){
            for(i=1;i<=9;i++){
                presenter.cells[j-1][i-1] = presenter.$view.find('"#c'+j+i+ presenter.modelID + presenter.number + '"');
            }
        }

        presenter.drawInitial(model.Values);
    };

    presenter.run = function(view, model){
        presenter.$view = $(view);
        presenter.model = model;

        presenter.Values = model.Values;
        var score = '';
        var test = false;

        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);

        if(presenter.validate(view,model)){
            presenter.init(view, model);
            presenter.setVisibility(presenter.isVisible);

            if(model.isActivity == "True"){
                presenter.correctAnswer = presenter.checkSudoku(view);
            }

            presenter.$view.find("input.active").change(function() {

                if(parseInt(this.value,10) < 1 || isNaN(this.value,10) || this.value == ' '){
                    test = true;
                    presenter.cells[(this.id.slice(1,2)-1)][(this.id.slice(2,3)-1)].attr("value", '');

                    if(presenter.currentAnswer[(this.id.slice(1,2)-1)][(this.id.slice(2,3)-1)] != ''){
                        presenter.currentViewNumbers--;
                        presenter.currentAnswer[(this.id.slice(1,2)-1)][(this.id.slice(2,3)-1)] = '';
                    }

                } else{

                    test = false;

                }

                if(!test) {

                    var id = this.id.slice(2,3) + "-" + this.id.slice(1,2);

                    if(presenter.isActivity){
                        score = this.value == presenter.correctAnswer[(this.id.slice(1,2)-1)][(this.id.slice(2,3)-1)] ? 1 : 0;
                    } else {
                        score = '';

                    }
                    presenter.triggerFrameChangeEvent(this.value, id, score);

                    if(presenter.isActivity){
                        if(this.value != ''){
                            if(presenter.currentAnswer[(this.id.slice(1,2)-1)][(this.id.slice(2,3)-1)] == ''){
                                presenter.currentAnswer[(this.id.slice(1,2)-1)][(this.id.slice(2,3)-1)] = this.value;
                                presenter.currentViewNumbers++;
                            } else{
                                presenter.currentAnswer[(this.id.slice(1,2)-1)][(this.id.slice(2,3)-1)] = this.value;
                            }
                        } else{
                            presenter.currentViewNumbers--;
                        }
                    }
                }

                if(presenter.currentViewNumbers == 81){
                    presenter.isAllOkEvent();
                }
            });



        }
    };

    presenter.createPreview = function(view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        if(presenter.validate(view,model)){
            presenter.init(view, model);

            presenter.setVisibility(true);

            if(model.isActivity == "True"){
                presenter.checkSudoku(view);
            }
        }

    };
    presenter.isAllOkEvent = function(){
        if(presenter.isAllOk()){
            presenter.triggerFrameChangeEvent("allOk", "", "");
        }
    };

    presenter.isAllOkChecker = function(){
        var correct = 0;
        for(j=1;j<=9;j++){
            for(i=1;i<=9;i++){
                if(presenter.currentAnswer[j-1][i-1] == presenter.correctAnswer[j-1][i-1])
                {
                    correct++;
                } else{
                    return correct;
                }
            }
        }
        return correct;
    };

    presenter.isAllOk = function(){
        var check = presenter.isAllOkChecker();
        if(check == 81){
            return true;
        } else{
            return false;
        }
    };

    presenter.isAttempted = function(){
        presenter.hideAnswers();
        if(presenter.isActivity){
            return presenter.initialViewNumbers == presenter.currentViewNumbers ? false: true;
        } else{
            return true;
        }

    };

    presenter.checkSudoku = function(view) {
        function dlx_cover(c)
        {
            c.right.left = c.left;
            c.left.right = c.right;
            for (var i = c.down; i != c; i = i.down) {
                for (var j = i.right; j != i; j = j.right) {
                    j.down.up = j.up;
                    j.up.down = j.down;
                    j.column.size--;
                }
            }
        }

        function dlx_uncover(c)
        {
            for (var i = c.up; i != c; i = i.up) {
                for (var j = i.left; j != i; j = j.left) {
                    j.column.size++;
                    j.down.up = j;
                    j.up.down = j;
                }
            }
            c.right.left = c;
            c.left.right = c;
        }

        function dlx_search(head, solution, k, solutions, maxsolutions)
        {
            if (head.right == head) {
                solutions.push(solution.slice(0));
                if (solutions.length >= maxsolutions) {
                    return solutions;
                }
                return null;
            }
            var c = null;
            var s = 99999;
            for (var j = head.right; j != head; j = j.right) {
                if (j.size == 0) {
                    return null;
                }
                if (j.size < s) {
                    s = j.size;
                    c = j;
                }
            }

            dlx_cover(c);
            for (var r = c.down; r != c; r = r.down) {
                solution[k] = r.row;
                for (var j = r.right; j != r; j = j.right) {
                    dlx_cover(j.column);
                }
                var s = dlx_search(head, solution, k+1, solutions, maxsolutions);
                if (s != null) {
                    return s;
                }
                for (var j = r.left; j != r; j = j.left) {
                    dlx_uncover(j.column);
                }
            }
            dlx_uncover(c);
            return null;
        }

        function dlx_solve(matrix, skip, maxsolutions)
        {
            var columns = new Array(matrix[0].length);
            for (var i = 0; i < columns.length; i++) {
                columns[i] = new Object;
            }
            for (var i = 0; i < columns.length; i++) {
                columns[i].index = i;
                columns[i].up = columns[i];
                columns[i].down = columns[i];
                if (i >= skip) {
                    if (i-1 >= skip) {
                        columns[i].left = columns[i-1];
                    }
                    if (i+1 < columns.length) {
                        columns[i].right = columns[i+1];
                    }
                } else {
                    columns[i].left = columns[i];
                    columns[i].right = columns[i];
                }
                columns[i].size = 0;
            }
            for (var i = 0; i < matrix.length; i++) {
                var last = null;
                for (var j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j]) {
                        var node = new Object;
                        node.row = i;
                        node.column = columns[j];
                        node.up = columns[j].up;
                        node.down = columns[j];
                        if (last) {
                            node.left = last;
                            node.right = last.right;
                            last.right.left = node;
                            last.right = node;
                        } else {
                            node.left = node;
                            node.right = node;
                        }
                        columns[j].up.down = node;
                        columns[j].up = node;
                        columns[j].size++;
                        last = node;
                    }
                }
            }
            var head = new Object;
            head.right = columns[skip];
            head.left = columns[columns.length-1];
            columns[skip].left = head;
            columns[columns.length-1].right = head;
            solutions = [];
            dlx_search(head, [], 0, solutions, maxsolutions);
            return solutions;
        }

        function solve_sudoku(grid)
        {
            var mat = [];
            var rinfo = [];
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    var g = grid[i][j] - 1;
                    if (g >= 0) {
                        var row = new Array(324);
                        row[i*9+j] = 1;
                        row[9*9+i*9+g] = 1;
                        row[9*9*2+j*9+g] = 1;
                        row[9*9*3+(Math.floor(i/3)*3+Math.floor(j/3))*9+g] = 1;
                        mat.push(row);
                        rinfo.push({'row': i, 'col': j, 'n': g+1});
                    } else {
                        for (var n = 0; n < 9; n++) {
                            var row = new Array(324);
                            row[i*9+j] = 1;
                            row[9*9+i*9+n] = 1;
                            row[9*9*2+j*9+n] = 1;
                            row[9*9*3+(Math.floor(i/3)*3+Math.floor(j/3))*9+n] = 1;
                            mat.push(row);
                            rinfo.push({'row': i, 'col': j, 'n': n+1});
                        }
                    }
                }
            }
            var solutions = dlx_solve(mat, 0, 2);
            if (solutions.length > 0) {
                var r = solutions[0];
                for (var i = 0; i < r.length; i++) {
                    grid[rinfo[r[i]]['row']][rinfo[r[i]]['col']] = rinfo[r[i]]['n'];
                }
                return solutions.length;
            }
            return 0;
        }


        $counter = $(view).find('.sudoku-counter');
        $counter.text('');
        var g = [];
        for (var i = 1; i <= 9; i++) {
            var r = [];
            for (var j = 1; j <= 9; j++) {
                r.push(presenter.cells[i-1][j-1].attr("value"));
            }
            g.push(r);

        }
        var r = solve_sudoku(g);
        if (r > 0) {
            if (r > 1) {
                $counter = $(view).find('.sudoku-counter');
                $counter.text('There is more than one solution.');
                presenter.isDisable = true;
                return false;
            }
        } else {
            $counter = $(view).find('.sudoku-counter');
            $counter.text('There is no solution.');
            presenter.isDisable = true;
            return false;
        }

        presenter.isActivity = true;
        return g;
    };

    presenter.clearSudoku = function() {

        for (var i = 1; i <= 9; i++) {
            for (var j = 1; j <= 9; j++) {
                presenter.cells[i-1][j-1].attr("value", '');
            }

        }

        presenter.currentAnswer = [['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','','']];
        presenter.drawInitial(presenter.Values);
    };

    presenter.drawInitial = function (value){
        presenter.initialViewNumbers = 0;
        presenter.currentViewNumbers = 0;

        var regExp = new RegExp('\n');
        var j= 1;
        var step = 1;
        for(i = 0; i< value.length; i++){
            if(value[i] != ' ') {
                if(value[i].match(regExp)) {
                    j++;
                    step = 1;
                } else{
                    $element = presenter.cells[j-1][step-1];
                    if(value[i] == '_'){
                        $($element).attr("value", '');
                    } else{
                        $($element).attr("value", value[i]);
                        $($element).attr( "readonly", "readonly" );
                        $($element).addClass("filled");
                        $($element).removeClass("active");
                        presenter.initialViewNumbers++;
                        presenter.currentViewNumbers++;
                        presenter.currentAnswer[j-1][step-1] = value[i];
                    }
                    step++;
                }
            }

        }
    };

    presenter.disable = function(){
        presenter.hideAnswers();
        presenter.isDisable = true;
        presenter.$view.find('input.active').attr( "readonly", "readonly" );
        presenter.$view.find('input.cell').addClass('disable');

    };

    presenter.enable = function(){
        presenter.hideAnswers();
        presenter.isDisable = false;
        presenter.$view.find('input.active').removeAttr("readonly");
        presenter.$view.find('input.cell').removeClass('disable');
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.hideAnswers();
        presenter.setVisibility(true);
        presenter.isVisible = true;
    };

    presenter.hide = function() {
        presenter.hideAnswers();
        presenter.setVisibility(false);
        presenter.isVisible = false;
    };

    presenter.checkMyCurrentAnswer = function(){

        var test = 0;
        for(j=1;j<=9;j++){
            for(i=1;i<=9;i++){
                $element = presenter.cells[j-1][i-1];
                if($($element).attr("value") != ''){
                    if(presenter.correctAnswer[j-1][i-1] != $($element).attr("value")){
                        $($element).addClass("wrong");
                        $($element).removeClass("correct");

                    } else{
                        $($element).removeClass("wrong");
                        $($element).addClass("correct");
                    }
                } else{
                    $($element).removeClass("wrong");
                    $($element).removeClass("correct");
                }
            }
        }


    };


    presenter.getState = function () {
        presenter.isErrorCheckingMode = false;
        var isVisible = presenter.isVisible;
        var wasVisible = presenter.wasVisible;
        var initialViewNumbers = presenter.initialViewNumbers;
        var wasDisable = presenter.wasDisable;
        var isDisable = presenter.isDisable;
        var Values = presenter.Values;
        var currentViewNumbers = presenter.currentViewNumbers;

        for(j=1;j<=9;j++){
            for(i=1;i<=9;i++){
                $element = presenter.cells[j-1][i-1];
                $($element).removeClass("wrong");
                $($element).removeClass("correct");
            }
        }

        var current = presenter.currentAnswer;

        return JSON.stringify({
            initialViewNumbers: initialViewNumbers,
            isVisible: isVisible,
            wasVisible: wasVisible,
            wasDisable: wasDisable,
            isDisable: isDisable,
            Values: Values,
            current: current,
            currentViewNumbers: currentViewNumbers
        });

    };

    presenter.setState = function (state) {
        var parsedState = JSON.parse(state);
        presenter.initialViewNumbers = parsedState.initialViewNumbers;
        presenter.isVisible = parsedState.isVisible;
        presenter.wasVisible = parsedState.wasVisible;
        presenter.Values = parsedState.Values;
        presenter.wasDisable = parsedState.wasDisable;
        presenter.isDisable = parsedState.isDisable;
        presenter.setVisibility(presenter.isVisible);
        presenter.currentAnswer = parsedState.current;
        presenter.currentViewNumbers = parsedState.currentViewNumbers;

        for(j=1;j<=9;j++){
            for(i=1;i<=9;i++){
                $(presenter.cells[j-1][i-1]).attr("value", presenter.currentAnswer[j-1][i-1]);
            }
        }

        if(presenter.isDisable){
            presenter.$view.find("input.active").attr( "readonly", "readonly" );
            presenter.$view.find("input.cell").addClass('disable');
        } else {
            presenter.$view.find("input.active").removeAttr("readonly");
            presenter.$view.find("input.cell").removeClass('disable');
        }
    };

    presenter.reset = function () {
        presenter.hideAnswers();
        presenter.setWorkMode();
        presenter.isErrorCheckingMode = false;
        presenter.isShowAnswerMode = false;
        presenter.clearSudoku();

        presenter.drawInitial(presenter.Values);

        for(j=1;j<=9;j++){
            for(i=1;i<=9;i++){
                $element = presenter.cells[j-1][i-1];
                $($element).removeClass("wrong");
                $($element).removeClass("correct");
            }
        }
        presenter.isVisible = presenter.wasVisible;
        presenter.setVisibility(presenter.wasVisible);
        presenter.isDisable = presenter.wasDisable;
        presenter.isDisable === true ?  presenter.disable() : presenter.enable();
    };

    presenter.getMaxScore = function () {

        if(presenter.isActivity === true) {
            var maxScore = 81 - presenter.initialViewNumbers;
            return maxScore;
        } else {
            return 0;
        }
    };


    presenter.getScore = function () {

        presenter.hideAnswers();

        if(presenter.isActivity === true) {
            var correct = 0;
            for(j=1;j<=9;j++){
                for(i=1;i<=9;i++){
                    $element = presenter.cells[j-1][i-1];
                    if($($element).attr("value") != ''){
                        if(presenter.correctAnswer[j-1][i-1] == $($element).attr("value")){
                            correct++;
                        }
                    }
                }
            }
            var score = correct - presenter.initialViewNumbers;
            return score;
        } else {
            return 0;
        }
    };

    presenter.getErrorCount = function () {

        presenter.hideAnswers();

        if(presenter.isActivity === true) {
            var errors = 0;
            for(j=1;j<=9;j++){
                for(i=1;i<=9;i++){
                    $element = presenter.cells[j-1][i-1];
                    if($($element).attr("value") != ''){
                        if(presenter.correctAnswer[j-1][i-1] != $($element).attr("value")){
                            errors++;
                        }
                    }
                }
            }
            return errors;
        } else {
            return 0;
        }
    };



    presenter.neutralOption = function(){
        return presenter.getCurrentTime() == presenter.InitialTime ? 1 : 0;
    };

    presenter.setShowErrorsMode = function () {

        presenter.isErrorCheckingMode = true;


        presenter.hideAnswers();

        if(presenter.isActivity === true) {

            presenter.$view.find("input.active").attr( "readonly", "readonly" );
            presenter.$view.find("input.active").addClass("check");
            presenter.checkMyCurrentAnswer();


        }
    };

    presenter.setWorkMode = function () {

        presenter.isErrorCheckingMode = false;
        presenter.$view.find("input.active").removeClass("check");

        for(j=1;j<=9;j++){
            for(i=1;i<=9;i++){
                $element = presenter.cells[j-1][i-1];
                $($element).removeClass("wrong");
                $($element).removeClass("correct");
            }
        }
        if(!presenter.isDisable){
            presenter.$view.find("input.active").removeAttr("readonly");
        }

    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.createEventData = function(value, id, score) {
        return {
            source : presenter.modelID,
            item : "" + id,
            value : '' + value,
            score : '' + score
        };
    };

    presenter.triggerFrameChangeEvent = function(value, id, score) {
        var eventData = presenter.createEventData(value, id, score);
        presenter.eventBus.sendEvent('ValueChanged', eventData);
    };

    presenter.showAnswers = function () {

        presenter.setWorkMode();

        if(presenter.isActivity === true) {
            presenter.isShowAnswerMode = true;
            presenter.isErrorCheckingMode = true;

            presenter.$view.find("input.active").attr( "readonly", "readonly" );
            presenter.$view.find("input.active").addClass("showAnswers");

            for(j=1;j<=9;j++){
                for(i=1;i<=9;i++){
                    $(presenter.cells[j-1][i-1]).attr("value", presenter.correctAnswer[j-1][i-1]);
                }
            }
        }
    };

    presenter.hideAnswers = function () {

        if(presenter.isActivity === true && presenter.isShowAnswerMode == true) {
            presenter.isErrorCheckingMode = false;
            presenter.$view.find("input.active").removeClass("showAnswers");
            presenter.$view.find("input.active").removeAttr("readonly");

            for(j=1;j<=9;j++){
                for(i=1;i<=9;i++){
                    $(presenter.cells[j-1][i-1]).attr("value", presenter.currentAnswer[j-1][i-1]);
                }
            }
        }


    };

    presenter.onEventReceived = function (eventName) {

        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    return presenter;
}