TestCase("[Commons - Statefull Addon Object] Change state", {
    setUp: function () {
        this.stateObject = new StatefullAddonObject({});
    },

    'test changeStateToStart should change object state to start': function () {
        StatefullAddonObject._internal.changeStateToStart.call(this.stateObject);

        assertEquals(StatefullAddonObject._internal.STATE.START, this.stateObject._actualState);
    },

    'test changeStateToWork should change object state to work': function () {
        StatefullAddonObject._internal.changeStateToWork.call(this.stateObject);

        assertEquals(StatefullAddonObject._internal.STATE.WORK, this.stateObject._actualState);
    },

    'test changeStateToBlock should change object state to block': function () {
        StatefullAddonObject._internal.changeStateToBlock.call(this.stateObject);

        assertEquals(StatefullAddonObject._internal.STATE.BLOCK, this.stateObject._actualState);
    },

    'test changeStateToCorrect should change object state to correct': function () {
        StatefullAddonObject._internal.changeStateToCorrect.call(this.stateObject);

        assertEquals(StatefullAddonObject._internal.STATE.CORRECT, this.stateObject._actualState);
    },

    'test changeStateToWrong should change object state to wrong': function () {
        StatefullAddonObject._internal.changeStateToWrong.call(this.stateObject);

        assertEquals(StatefullAddonObject._internal.STATE.WRONG, this.stateObject._actualState);
    },

    'test changeStateToShowAnswers should change object state to show answers': function () {
        StatefullAddonObject._internal.changeStateToShowAnswers.call(this.stateObject);

        assertEquals(StatefullAddonObject._internal.STATE.SHOW_ANSWERS, this.stateObject._actualState);
    }
});