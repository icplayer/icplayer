function getMockForConiguration() {
    return {
            definition: {
                definition: 'def',
                correctAnswers: [1,2],
                answers: ['a','b', 'c']
            },
            timeForAnswer: 10,
            questionNumber: 1,
            $questionDiv: {
                html: sinon.spy(),
                show: sinon.spy(),
                hide: sinon.spy()
            },
            $levelDiv:{
                html: sinon.spy()
            },
            $answersWrapper: {
                append: sinon.spy()
            },
            onCorrectAnswerCallback: sinon.spy(),
            onWrongAnswerCallback: sinon.spy(),
            onDroppedCorrectAnswerCallback: sinon.spy(),
            onDroppedWrongAnswerCallback: sinon.spy(),
            onEndLevelCallback: sinon.spy()
        };
}

TestCase("[Shooting_Range - Level] generate answer", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;

        this.level = new this.Level(getMockForConiguration());
    },

    'test generate answer will create properly elements': function () {
        var answer = this.level.generateAnswer(1);

        assertTrue(answer.isCorrect);
        assertFalse(answer.isClicked);
        assertEquals('DIV', answer.element.prop('tagName'));
        assertEquals('DIV', answer.layer.prop('tagName'));
        assertEquals('DIV', answer.text.prop('tagName'));

        assertEquals('addon-Shooting_Range-answer-wrapper addon-Shooting_Range-answer-1', answer.element.prop('class'));
        assertEquals('addon-Shooting_Range-answer-layer', answer.layer.prop('class'));
        assertEquals('addon-Shooting_Range-answer-text', answer.text.prop('class'));

        assertEquals('b', answer.text.html());
    },

    'test generate answers will create three answers': function () {
        this.level.generateAnswers();

        assertEquals(3, this.level.answers.length);
    }

});

TestCase("[Shooting_Range - Level] start", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;
        this.mock = getMockForConiguration();
        this.level = new this.Level(this.mock);
        this.clock = sinon.useFakeTimers(new Date().getTime());
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test if start will set properly values': function () {
        this.level.clickedElements = 1;
        this.level.startTime = 50;
        this.level.destroyed = true;
        this.level.initialElapsedTime = 30;
        this.level.levelWasEnded = true;
        this.level.pauseTime = 12;
        this.level.isPaused = true;
        this.level.droppedElements = 3;

        this.level.start();

        assertTrue(this.mock.$questionDiv.show.calledOnce);
        assertTrue(this.mock.$questionDiv.html.calledOnce);
        assertEquals('def', this.mock.$questionDiv.html.getCall(0).args[0]);

        assertEquals(0, this.level.clickedElements);
        assertEquals(new Date().getTime() / 1000, this.level.startTime);
        assertEquals(false, this.level.destroyed);
        assertEquals(0, this.level.initialElapsedTime);
        assertEquals(false, this.level.levelWasEnded);
        assertEquals(0, this.level.pauseTime);
        assertEquals(false, this.level.isPaused);
        assertEquals(0, this.level.droppedElements);

    }

});

TestCase("[Shooting_Range - Level] events", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;
        this.mock = getMockForConiguration();
        this.level = new this.Level(this.mock);

        this.eventMock = {
            stopPropagation: sinon.spy(),
            preventDefault: sinon.spy()
        };

        this.level.start();
    },

    'test onClick will call correct callback if clicked answer was correct': function () {
        this.level.onClick(0, true, 1, this.eventMock);

        assertTrue(this.mock.onCorrectAnswerCallback.calledOnce);
        assertEquals(0, this.mock.onCorrectAnswerCallback.getCall(0).args[0]);
        assertEquals(1, this.mock.onCorrectAnswerCallback.getCall(0).args[1]);
    },

    'test onClick will call wrong callback if clicked answer was correct': function () {
        this.level.onClick(0, false, 1, this.eventMock);

        assertTrue(this.mock.onWrongAnswerCallback.calledOnce);
        assertEquals(0, this.mock.onWrongAnswerCallback.getCall(0).args[0]);
        assertEquals(1, this.mock.onWrongAnswerCallback.getCall(0).args[1]);
    },

    'test onClick will set isClicked and class name': function () {
        this.level.onClick(0, true, 1, this.eventMock);

        assertTrue(this.level.answers[1].isClicked);
        assertTrue(this.level.answers[1].element.hasClass('clicked'));
        assertEquals(1, this.level.clickedElements);

    },

    'test if element is clicked then onClick wont be called': function () {
        this.level.answers[1].isClicked = true;
        this.level.onClick(0, true, 1, this.eventMock);

        assertFalse(this.level.answers[1].element.hasClass('clicked'));
        assertEquals(0, this.level.clickedElements);
    },

    'test onDrop call correct answer callback': function () {
        this.level.onDrop(0, 1);

        assertTrue(this.mock.onDroppedCorrectAnswerCallback.calledOnce);
        assertEquals(0, this.mock.onDroppedCorrectAnswerCallback.getCall(0).args[0]);
        assertEquals(1, this.mock.onDroppedCorrectAnswerCallback.getCall(0).args[1]);
    },

    'test if element was clicked then callback wont be called in onDrop': function () {
        this.level.answers[1].isClicked = true;

        this.level.onDrop(0, 1);

        assertFalse(this.mock.onDroppedCorrectAnswerCallback.calledOnce);
        assertFalse(this.mock.onDroppedWrongAnswerCallback.calledOnce)
    }
});

TestCase("[Shooting_Range - Level] end level", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;
        this.mock = getMockForConiguration();
        this.level = new this.Level(this.mock);

        this.eventMock = {
            stopPropagation: sinon.spy(),
            preventDefault: sinon.spy()
        };

        this.level.start();
    },

    'test if level was ended then endlevel wont work': function () {
        this.level.levelWasEnded = true;

        this.level.endLevel();

        assertFalse(this.mock.onEndLevelCallback.calledOnce);
    },

    'test if level was ended then should destroy level and call callback': function () {
        this.level.destroy = sinon.spy();
        this.level.endLevel();

        assertTrue(this.level.destroy.calledOnce);
        assertTrue(this.level.levelWasEnded);
        assertTrue(this.mock.onEndLevelCallback.calledOnce);
    }
});

TestCase("[Shooting_Range - Level] destroy", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;
        this.mock = getMockForConiguration();
        this.level = new this.Level(this.mock);

        this.eventMock = {
            stopPropagation: sinon.spy(),
            preventDefault: sinon.spy()
        };

        this.level.start();
    },

    'test if level was destroyed then destroy wont work': function () {
        this.level.answers[0].element.off = sinon.spy();
        this.level.destroyed = true;
        this.level.destroy();

        assertFalse(this.level.answers[0].element.off.calledOnce);
    },

    'test destroy level will off events and remove elements': function () {
        this.level.answers[0].element.off = sinon.spy();
        this.level.answers[1].element.off = sinon.spy();
        this.level.answers[2].element.off = sinon.spy();

        this.level.answers[0].element.remove = sinon.spy();
        this.level.answers[1].element.remove = sinon.spy();
        this.level.answers[2].element.remove = sinon.spy();

        this.level.destroy();

        assertTrue(this.level.answers[0].element.off.calledOnce);
        assertTrue(this.level.answers[1].element.off.calledOnce);
        assertTrue(this.level.answers[2].element.off.calledOnce);

        assertTrue(this.level.answers[0].element.remove.calledOnce);
        assertTrue(this.level.answers[1].element.remove.calledOnce);
        assertTrue(this.level.answers[2].element.remove.calledOnce);
    }
});

TestCase("[Shooting_Range - Level] pause/resume", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;
        this.mock = getMockForConiguration();
        this.level = new this.Level(this.mock);
        this.clock = sinon.useFakeTimers(new Date().getTime());
        this.level.start();
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test if is paused then pause wont work': function () {
        this.level.isPaused = true;

        this.level.pause();

        assertEquals(0, this.level.pauseTime);
    },

    'test if is not paused then resume is not working': function () {
        this.level.resume();

        assertEquals(0, this.level.initialElapsedTime);
    },

    'test pause will set actual time': function () {
        this.level.pause();

        assertEquals(new Date().getTime() / 1000, this.level.pauseTime);
    },

    'test restore will add to elapsed time difference between start and now': function () {
        this.level.pause();
        this.level.pauseTime -= 100;

        this.level.resume();
        assertEquals(-100, this.level.initialElapsedTime);

        this.level.pause();
        this.level.pauseTime -= 25;

        this.level.resume();
        assertEquals(-125, this.level.initialElapsedTime);


    }
});

TestCase("[Shooting_Range - Level] get/set elapsed time", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;
        this.mock = getMockForConiguration();
        this.level = new this.Level(this.mock);
        this.clock = sinon.useFakeTimers(new Date().getTime());
        this.level.start();
    },

    tearDown: function () {
        this.clock.restore();
    },

    'test set elapsed time will set properly time': function () {
        assertEquals(0, this.level.initialElapsedTime);

        this.level.setElapsedTime(20);

        assertEquals(20, this.level.initialElapsedTime);
    },

    'test getElapsed time return elapsed time with initialElapsedTime': function () {
        this.level.initialElapsedTime = 20;
        this.level.startTime = (new Date().getTime() / 1000) - 20;

        var elapsed = this.level.getElapsedTime();

        assertEquals(40, elapsed);

    }
});

TestCase("[Shooting_Range - Level] show/hide answers", {
    setUp: function () {
        this.presenter = AddonShooting_Range_create();
        this.Level = this.presenter.__internalElements.Level;
        this.mock = getMockForConiguration();
        this.level = new this.Level(this.mock);
        this.level.start();
    },

    'test show answers will properly add classes': function () {
        this.level.showAnswers();

        assertTrue(this.level.answers[0].element.hasClass('wrong'));
        assertFalse(this.level.answers[0].element.hasClass('correct'));

        assertFalse(this.level.answers[1].element.hasClass('wrong'));
        assertTrue(this.level.answers[1].element.hasClass('correct'));

        assertFalse(this.level.answers[2].element.hasClass('wrong'));
        assertTrue(this.level.answers[2].element.hasClass('correct'));
    },

    'test hide answers will remove classes': function () {
        this.level.hideAnswers();

        assertFalse(this.level.answers[0].element.hasClass('wrong'));
        assertFalse(this.level.answers[0].element.hasClass('correct'));

        assertFalse(this.level.answers[1].element.hasClass('wrong'));
        assertFalse(this.level.answers[1].element.hasClass('correct'));

        assertFalse(this.level.answers[2].element.hasClass('wrong'));
        assertFalse(this.level.answers[2].element.hasClass('correct'));
    }
});
