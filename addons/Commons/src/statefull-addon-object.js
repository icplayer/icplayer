/**
 * Commons for Statefull Addon Object
* @module commons
*/
(function (window) {
    /**
     * Statefull Addon Object
     * Abstract class for state machine implementing switching between WorkMode / ErrorsMode / ShowAnswers / HideAnswers
     * @class StatefullAddonObject
     * @param [configuration] {object} Configuration object with css for states
     *  @param [configuration.correct] {String} Class added when object moves to correct state
     *  @param [configuration.wrong] {String} Class added when object moves to wrong state
     *  @param [configuration.showAnswers] {String} Class added when object moves to showAnswers state
     *  @param [configuration.block] {String} Class added when object moves to block state
     *  @param [configuration.droppableHover] {String} Class added when draggable object is over view
     * @constructor StatefullAddonObject
     */
    function StatefullAddonObject (configuration) {
        this._actualState = StatefullAddonObject._internal.STATE.START;
        this.correctCSS = configuration.correct || '';
        this.wrongCSS = configuration.wrong || '';
        this.showAnswersCSS = configuration.showAnswers || '';
        this.blockCSS = configuration.block || '';
        this.droppableHoverCSS  = configuration.droppableHover || '';
    }

    StatefullAddonObject._internal = {
        STATE: {
            START: 0,
            BLOCK: 1,
            WORK: 2,
            CORRECT: 3,
            WRONG: 4,
            SHOW_ANSWERS: 5
        },

        changeStateToStart: function changeStateToStart () {
            this._actualState = StatefullAddonObject._internal.STATE.START;
        },

        changeStateToBlock: function changeStateToBlock () {
            this._actualState = StatefullAddonObject._internal.STATE.BLOCK;
        },

        changeStateToWork: function changeStateToWork () {
            this._actualState = StatefullAddonObject._internal.STATE.WORK;
        },

        changeStateToCorrect: function changeStateToCorrect () {
            this._actualState = StatefullAddonObject._internal.STATE.CORRECT;
        },

        changeStateToWrong: function changeStateToWrong () {
            this._actualState = StatefullAddonObject._internal.STATE.WRONG;
        },

        changeStateToShowAnswers: function changeStateToShowAnswers () {
            this._actualState = StatefullAddonObject._internal.STATE.SHOW_ANSWERS;
        },

        checkStartState: function checkStartState () {
            this.onBlock();
            this.setCssOnBlock();

            StatefullAddonObject._internal.changeStateToBlock.call(this);
        },

        showAnswersStartState: function showAnswersStartState () {
            this.notifyEdit();
            StatefullAddonObject._internal.showAnswersWorkState.call(this);
        },

        resetStartState: function resetStartState () {

        },

        uncheckBlockState: function uncheckBlockState () {
            this.onUnblock();
            this.setCssOnUnblock();

            StatefullAddonObject._internal.changeStateToStart.call(this);
        },

        resetBlockState: function resetBlockState () {
            StatefullAddonObject._internal.uncheckBlockState.call(this);
        },

        showAnswersBlockState: function showAnswersBlockState () {
            StatefullAddonObject._internal.uncheckBlockState.call(this);
            StatefullAddonObject._internal.showAnswersStartState.call(this);
        },

        resetWorkState: function resetWorkState () {
            this.onReset();
            StatefullAddonObject._internal.changeStateToStart.call(this);
        },

        checkWorkState: function checkWorkState () {
            if (this.isCorrect()) {
                this.setCssOnCorrect();
                this.onCorrect();
                StatefullAddonObject._internal.changeStateToCorrect.call(this);
            } else {
                this.setCssOnWrong();
                this.onWrong();
                StatefullAddonObject._internal.changeStateToWrong.call(this);
            }
        },

        showAnswersWorkState: function showAnswersWorkState () {
            this.onShowAnswers();
            this.setCssOnShowAnswers();
            StatefullAddonObject._internal.changeStateToShowAnswers.call(this);
        },

        resetShowAnswersState: function resetShowAnswersState () {
            StatefullAddonObject._internal.hideAnswersShowAnswersState.call(this);
            StatefullAddonObject._internal.resetWorkState.call(this);
        },

        hideAnswersShowAnswersState: function hideAnswersShowAnswersState () {
            this.setCssOnHideAnswers();
            this.onHideAnswers();

            StatefullAddonObject._internal.changeStateToWork.call(this);
        },

        checkShowAnswersState: function checkShowAnswersState () {
            StatefullAddonObject._internal.hideAnswersShowAnswersState.call(this);
            StatefullAddonObject._internal.checkWorkState.call(this);
        },

        uncheckCorrectState: function uncheckCorrectState () {
            this.setCssOnUnCorrect();
            this.onUnCorrect();
            
            StatefullAddonObject._internal.changeStateToWork.call(this);
        },

        resetCorrectState: function resetCorrectState () {
            StatefullAddonObject._internal.uncheckCorrectState.call(this);
            StatefullAddonObject._internal.resetWorkState.call(this);
        },

        showAnswersCorrectState: function showAnswersCorrectState () {
            StatefullAddonObject._internal.uncheckCorrectState.call(this);
            StatefullAddonObject._internal.showAnswersWorkState.call(this);
        },

        resetWrongState: function resetWrongState () {
            StatefullAddonObject._internal.uncheckWrongState.call(this);
            StatefullAddonObject._internal.resetWorkState.call(this);
        },

        uncheckWrongState: function uncheckWrongState () {
            this.setCssOnUnWrong();
            this.onUnWrong();

            StatefullAddonObject._internal.changeStateToWork.call(this);
        },

        showAnswersWrongState: function showAnswersWrongState () {
            StatefullAddonObject._internal.uncheckWrongState.call(this);
            StatefullAddonObject._internal.showAnswersWorkState.call(this);
        }
    };

    /**
     * Resets object to start state. Makes proper moves from currect state to start state.
     * Should be called on reset command.
     * @method reset
     */
    StatefullAddonObject.prototype.reset = function () {
        switch (this._actualState) {
            case StatefullAddonObject._internal.STATE.START:
                StatefullAddonObject._internal.resetStartState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.BLOCK:
                StatefullAddonObject._internal.resetBlockState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.WORK:
                StatefullAddonObject._internal.resetWorkState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.WRONG:
                StatefullAddonObject._internal.resetWrongState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.CORRECT:
                StatefullAddonObject._internal.resetCorrectState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.SHOW_ANSWERS:
                StatefullAddonObject._internal.resetShowAnswersState.call(this);
                break;
        }
    };

    /**
     * Moves object from current state to state which is defined by check action.
     * Should be called when user clicks check button.
     * @method check
     */
    StatefullAddonObject.prototype.check = function () {
        switch (this._actualState) {
            case StatefullAddonObject._internal.STATE.START:
                StatefullAddonObject._internal.checkStartState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.BLOCK:
                StatefullAddonObject._internal.uncheckBlockState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.WORK:
                StatefullAddonObject._internal.checkWorkState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.WRONG:
                StatefullAddonObject._internal.uncheckWrongState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.CORRECT:
                StatefullAddonObject._internal.uncheckCorrectState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.SHOW_ANSWERS:
                StatefullAddonObject._internal.checkShowAnswersState.call(this);
                break;
        }
    };

    /**
     * Moves object from current state to state which is defined by showAnswers action.
     * Should be called when user clicks show answers button.
     * @method showAnswers
     */
    StatefullAddonObject.prototype.showAnswers = function () {
        switch (this._actualState) {
            case StatefullAddonObject._internal.STATE.START:
                StatefullAddonObject._internal.showAnswersStartState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.BLOCK:
                StatefullAddonObject._internal.showAnswersBlockState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.WORK:
                StatefullAddonObject._internal.showAnswersWorkState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.WRONG:
                StatefullAddonObject._internal.showAnswersWrongState.call(this);
                break;
            case StatefullAddonObject._internal.STATE.CORRECT:
                StatefullAddonObject._internal.showAnswersCorrectState.call(this);
                break;
            default:
                break;
        }
    };

    /**
     * Moves object from current state to state which is defined by hideAnswers action.
     * Should be called when user clicks hide answers button.
     * @method hideAnswers
     */
    StatefullAddonObject.prototype.hideAnswers = function () {
        switch (this._actualState) {
            case StatefullAddonObject._internal.STATE.SHOW_ANSWERS:
                StatefullAddonObject._internal.hideAnswersShowAnswersState.call(this);
                break;
            default:
                break;
        }
    };

    /**
     * Notify state machine that editing / input action have occured. If addon is in start state, changes state to work.
     * This function should be called when object is have been edited or input have been made.
     * @method notifyEdit
     */
    StatefullAddonObject.prototype.notifyEdit = function () {
        StatefullAddonObject._internal.changeStateToWork.call(this);
    };

    /**
     * Abstract method.
     * Function called on state change from work state to start state. Should define what happends when user clicks
     * reset button when object is in work state.
     * @method onReset
     */
    StatefullAddonObject.prototype.onReset = function () {
        throw Error("onReset is  abstract method.");
    };


    /**
     * Abstract method.
     * Function called on state change from start to block state. Should define what happends when user clicks check
     * when object is just initialized and in start state.
     * @method onBlock
     */
    StatefullAddonObject.prototype.onBlock = function () {
        throw Error("onBlock is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from block start state. Should define what happendsd when user unchecks when
     * object is just initialized and in start state.
     * @method onUnblock
     */
    StatefullAddonObject.prototype.onUnblock = function () {
        throw Error("onUnblock is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from work to correct/wrong. Function should determine if object is considered as
     * correct.
     * @method isCorrect
     * @return {boolean} Retuns true if object is determined as "correct" otherwise false
     */
    StatefullAddonObject.prototype.isCorrect = function () {
        throw Error("isCorrect is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from work to wrong. Function should define actions taken by object when users
     * clicks check in work state, and object is determined as wrong.
     * @method onWrong
     */
    StatefullAddonObject.prototype.onWrong = function () {
        throw Error("onWrong is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from wrong to work. Function should define actions taken by object when users
     * clicks check in setShowErrors mode.
     * @method onUnWrong
     */
    StatefullAddonObject.prototype.onUnWrong = function () {
        throw Error("onUnWrong is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from work to correct. Function should define actions taken by object when users
     * clicks check in work state, and object is determined as correct.
     * @method onCorrect
     */
    StatefullAddonObject.prototype.onCorrect = function () {
        throw Error("onCorrect is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from correct to work. Function should define actions taken by object when users
     * clicks check in setShowErrors mode.
     * @method onUnCorrect
     */
    StatefullAddonObject.prototype.onUnCorrect = function () {
        throw Error("onUnCorrect is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from work to show_answers state. Function should define actions taken by object
     * when users clicks show answers in work state.
     * @method onShowAnswers
     */
    StatefullAddonObject.prototype.onShowAnswers = function () {
        throw Error("onShowAnswers is  abstract method.");
    };

    /**
     * Abstract method.
     * Function called on state change from show_answers to work state. Function should define actions taken by object
     * when users clicks show answers in show answers_state.
     * @method onHideAnswers
     */
    StatefullAddonObject.prototype.onHideAnswers = function () {
        throw Error("onHideAnswers is  abstract method.");
    };

    /**
     * Abstract method.
     * Function should define how to view of object add provided css class name.
     * @method addCssClass
     * @param cssClassName {String} Css class name
     */
    StatefullAddonObject.prototype.addCssClass = function (cssClassName) {
        throw Error("addCssClass is  abstract method.");
    };

    /**
     * Abstract method.
     * Function should define how to remove from view of object provided css class name.
     * @method removeCssClass
     * @param cssClassName {String} Css class name
     */
    StatefullAddonObject.prototype.removeCssClass = function (cssClassName) {
        throw Error("removeCssClass is  abstract method.");
    };

    /**
     * Method called on changing state from work to correct, for setting css configuration on object.
     * By default calls only addCssClass method with correctCss attribute passed in configuration.
     * @method setCssOnCorrect
     */
    StatefullAddonObject.prototype.setCssOnCorrect = function () {
        this.addCssClass(this.correctCSS);
    };

    /**
     * Method called on changing state from work to correct, for setting css configuration on object.
     * By default calls only addCssClass method with correctCss attribute passed in configuration.
     * @method setCssOnCorrect
     */
    StatefullAddonObject.prototype.setCssOnWrong = function () {
        this.addCssClass(this.wrongCSS);
    };

    /**
     * Method called on changing state from work to showAnswers, for setting css configuration on object.
     * By default calls only addCssClass method with showAnswers attribute passed in configuration.
     * @method setCssOnShowAnswers
     */
    StatefullAddonObject.prototype.setCssOnShowAnswers = function () {
        this.addCssClass(this.showAnswersCSS);
    };

    /**
     * Method called on changing state from showAnswers to work, for setting css configuration on object.
     * By default calls only removeCssClass method with showAnswers attribute passed in configuration.
     * @method setCssOnHideAnswers
     */
    StatefullAddonObject.prototype.setCssOnHideAnswers = function () {
        this.removeCssClass(this.showAnswersCSS);
    };

    /**
     * Method called on changing state from correct to work, for setting css configuration on object.
     * By default calls only removeCssClass method with correctCss attribute passed in configuration.
     * @method setCssOnUnCorrect
     */
    StatefullAddonObject.prototype.setCssOnUnCorrect = function () {
        this.removeCssClass(this.correctCSS);
    };

    /**
     * Method called on changing state from wrong to work, for setting css configuration on object.
     * By default calls only removeCssClass method with wrongCss attribute passed in configuration.
     * @method setCssOnUnCorrect
     */
    StatefullAddonObject.prototype.setCssOnUnWrong = function () {
        this.removeCssClass(this.wrongCSS);
    };

    /**
     * Method called on changing state from start to block, for setting css configuration on object.
     * By default calls only addCssClass method with blockCss attribute passed in configuration.
     * @method setCssOnBlock
     */
    StatefullAddonObject.prototype.setCssOnBlock = function () {
        this.addCssClass(this.blockCSS);
    };

    /**
     * Method called on changing state from block to start, for setting css configuration on object.
     * By default calls only removeCssClass method with blockCss attribute passed in configuration.
     * @method setCssOnUnblock
     */
    StatefullAddonObject.prototype.setCssOnUnblock = function () {
        this.removeCssClass(this.blockCSS);
    };

    window.StatefullAddonObject = window.StatefullAddonObject || StatefullAddonObject;
})(window);
