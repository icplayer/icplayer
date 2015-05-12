TestCase("[Count_and_Graph] [Column Object] Create bars", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.column = new this.presenter.columnObject(3, "red", 5, 40, 40);
        this.barsNumber = 3;
        this.columnMaxWidth;
        this.barsWidth;
    },

    'test column should create specified amount of bars': function () {
        var bars = this.column._createBars();

        assertEquals(3, bars.length);
        assertArray(bars);
    },

    'test column should create bars with specified color': function () {
        var bars = this.column._createBars();

        assertEquals("red", bars[0]._color);
        assertEquals("red", bars[1]._color);
        assertEquals("red", bars[2]._color);
    },

    'test column should create bars with parent as himself': function () {
        var bars = this.column._createBars();

        assertSame(this.column, bars[0]._column);
        assertSame(this.column, bars[1]._column);
        assertSame(this.column, bars[2]._column);
    },

    'test column should create bars with proper bar values': function () {
        var bars = this.column._createBars();

        assertEquals(1, bars[0]._barValue);
        assertEquals(2, bars[1]._barValue);
        assertEquals(3, bars[2]._barValue);
    },


    'test column should create bars with bars width when is lower then max column width': function () {
        this.barsWidth = 50;
        this.columnMaxWidth = 100;
        var _ = 1;

        var column = new this.presenter.columnObject(this.barsNumber, _, this.barsWidth, this.columnMaxWidth, _);

        var bars = column._createBars();

        assertEquals(50, bars[0]._width);
        assertEquals(50, bars[1]._width);
        assertEquals(50, bars[2]._width);
    },

    'test column should create bars with height divided equally among all bars': function () {
        var _ = 1;
        this.barsNumber = 5;
        var column = new this.presenter.columnObject(this.barsNumber, _, _, 125, _);

        var bars = column._createBars();

        assertEquals(25, bars[0]._height);
        assertEquals(25, bars[1]._height);
        assertEquals(25, bars[2]._height);
        assertEquals(25, bars[3]._height);
        assertEquals(25, bars[4]._height);
    }
});

TestCase("[Count_and_Graph] [Column Object] Should column get raised", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.column = new this.presenter.columnObject(3, "red", 5);
    },

    'test user selection should raise column': function () {
        assertTrue(this.column._columnShouldGetRaised(2));
    },

    'test user selection is at top of column, should lower': function () {
        this.column._topSelectedBarNumber = 1;

        assertFalse(this.column._columnShouldGetRaised(1));
    },

    'test user selected bar in middle of column, should lower': function () {
        this.column._topSelectedBarNumber = 3;

        assertFalse(this.column._columnShouldGetRaised(2));
    },

    'test user selected first bar, when no bar is on': function () {
        this.column._topSelectedBarNumber = -1;

        assertTrue(this.column._columnShouldGetRaised(1))
    }
});

TestCase("[Count_and_Graph] [Column Object] selected bar logic", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.column = new this.presenter.columnObject(3, "red", 3, 3, 3, 1);

        this.stubs = {
            setOff: sinon.spy(this.column, '_setOffBar'),
            setOn: sinon.spy(this.column, '_setOnBar'),
            raiseColumn: sinon.spy(this.column, '_raiseColumn'),
            lowerColumn: sinon.spy(this.column, '_lowerColumn'),
            setOffSelectedBar: sinon.spy(this.column, '_setOffSelectedBar'),
            sendEvents: sinon.stub(this.column, '_sendEvents')
        };

        this.event = {
            type: "click",
            preventDefault: function () {},
            stopPropagation: function () {}
        };
    },

    tearDown: function () {
        this.column._setOffBar.restore();
        this.column._setOnBar.restore();
        this.column._raiseColumn.restore();
        this.column._lowerColumn.restore();
        this.column._setOffSelectedBar.restore();
        this.column._sendEvents.restore();
    },

    'test column should trigger selected bar logic when bar is clicked': function () {
        var selectedLogicStub = sinon.stub(this.column, '_selectingBarLogic');

        this.column._bars[1].handleEvent(this.event);

        assertTrue(selectedLogicStub.calledOnce);

        this.column._selectingBarLogic.restore();
    },

    'test when user clicks bar, proper events should be send': function () {
        this.column._bars[1].handleEvent(this.event);

        assertTrue(this.stubs.sendEvents.called);
    },


    'test column should diminish highlighted bar first, before raising column': function () {
        this.column._bars[2].handleEvent(this.event);

        assertTrue(this.stubs.setOffSelectedBar.firstCall.calledWith(2));
        assertTrue(this.stubs.setOffSelectedBar.calledBefore(this.stubs.raiseColumn));
        assertTrue(this.stubs.setOffSelectedBar.calledBefore(this.stubs.lowerColumn));
        assertTrue(this.stubs.setOff.firstCall.calledWith(2));

        assertTrue(this.stubs.setOn.calledOnce);
        assertTrue(this.stubs.setOn.calledWith(0));

        assertTrue(this.stubs.raiseColumn.calledOnce);
        assertFalse(this.stubs.lowerColumn.called);
    },

    'test column should restore color of highlightedBar before lowering column': function () {
        this.column._topSelectedBarNumber = 2;
        this.column._bars[1].handleEvent(this.event);

        assertTrue(this.stubs.setOffSelectedBar.calledBefore(this.stubs.raiseColumn));
        assertTrue(this.stubs.setOffSelectedBar.calledBefore(this.stubs.lowerColumn));
        assertTrue(this.stubs.setOffSelectedBar.calledOnce);

        assertTrue(this.stubs.setOn.calledBefore(this.stubs.raiseColumn));
        assertTrue(this.stubs.setOn.calledBefore(this.stubs.lowerColumn));
        assertTrue(this.stubs.setOn.calledWith(1));
    }
});

TestCase("[Count_and_Graph] [Column Object] Column raising / lowering", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.column = new this.presenter.columnObject(3, "red", 3);
        this.stubs = {
            setOff: sinon.spy(this.column, '_setOffBar'),
            setOn: sinon.spy(this.column, '_setOnBar')
        };
    },

    tearDown: function () {
        this.column._setOnBar.restore();
        this.column._setOffBar.restore();
    },

    'test raising column should increase top selected bar number': function () {
        var previous = this.column._topSelectedBarNumber = 0;
        this.column._raiseColumn();
        var after = this.column._topSelectedBarNumber;

        assertTrue(after > previous);
        assertEquals(after, previous + 1);
        assertEquals(1, after);
    },

    'test decreasing column should lower top selected bar number': function () {
        var previous = this.column._topSelectedBarNumber = 2;
        this.column._lowerColumn();
        var after = this.column._topSelectedBarNumber;

        assertTrue(after < previous);
        assertEquals(after, previous - 1);
        assertEquals(1, after);
    },

    'test column should set color to next bar when raising': function () {
        this.column._topSelectedBarNumber = 1;

        this.column._raiseColumn();

        assertTrue(this.stubs.setOn.calledWith(2));
        assertEquals(1, this.stubs.setOn.callCount);
        assertFalse(this.stubs.setOff.called);
    },

    'test column should set off color to current top bar when lowering': function () {
        this.column._topSelectedBarNumber = 2;

        this.column._lowerColumn();

        assertTrue(this.stubs.setOff.calledWith(2));
        assertFalse(this.stubs.setOn.called);
    }
});

TestCase("[Count_and_Graph] [Column Object] Bar width", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.columnMaxWidth = 100;
        var _ = 1;
        this.column = new this.presenter.columnObject(_, _, this.columnMaxWidth, _);
    },

    'test bar width should be equal to columns width': function () {
        var validationResult = this.column._getBarWidth();

        assertEquals(100, validationResult);
    }
});

TestCase("[Count_and_Graph] [Column Object] Bar height", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.barsNumber = 5;
        this.height = 125;
    },

    'test height should be divided on all bars equally in column': function () {
        var _ = 1;
        var column = new this.presenter.columnObject(this.barsNumber, _, _, this.height, _);

        var validationResult = column._getBarHeight();

        assertEquals(25, validationResult);
    }
});

TestCase("[Count_and_Graph] [Column Object] Set off selected bar", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.column = new this.presenter.columnObject(3, _, _, _, _);
        this.stubs = {
            setOff: sinon.stub(this.column, '_setOffBar')
        };

    },

    'test turning off bar when its above selected on bars': function () {
        this.column._topSelectedBarNumber = 1;

        this.column._setOffSelectedBar(2);

        assertTrue(this.stubs.setOff.called);
        assertTrue(this.stubs.setOff.calledWith(2));
    },

    'test not turning any bar when selected bar is one of the turn on ones': function () {
        this.column._topSelectedBarNumber = 2;
        this.column._setOffSelectedBar(1);

        assertFalse(this.stubs.setOff.called);
    }
});

TestCase("[Count_and_Graph] [Column Object] Block / unblock", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.column = new this.presenter.columnObject(3, 1, 5, 5, 5);
        this.bar = new this.presenter.barObject(this.column, 5, 5, 5, 1);

        this.stubs = {
            block: sinon.stub(this.bar, 'block'),
            unblock: sinon.stub(this.bar, 'unblock')
        };

        this.column._bars = [this.bar, this.bar, this.bar];
    },

    tearDown: function () {
        this.bar.block.restore();
        this.bar.unblock.restore();
    },

    'test every bar in column should be blocked': function () {
        this.column.block();

        assertEquals(3, this.stubs.block.callCount);
    },

    'test every bar in column should be unblocked': function () {
        this.column.unblock();

        assertEquals(3, this.stubs.unblock.callCount);
    }
});

TestCase("[Count_and_Graph] [Column Object] Score", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.column = new this.presenter.columnObject(_, _, _, _, _);
    },

    'test should return 1 when column is marked correctly': function () {
        this.column._answer = 3;
        this.column._topSelectedBarNumber = 2;

        assertEquals(1, this.column.getScore());
    },

    'test should return 0 when column is marked wrong': function () {
        this.column._answer = 3;
        this.column._topSelectedBarNumber = -1;

        assertEquals(0, this.column.getScore());

        this.column._topSelectedBarNumber = 1;
        assertEquals(0, this.column.getScore());
    }
});

TestCase("[Count_and_Graph] [Column Object] User answer status", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var axisYMax = 10;
        this.column = new this.presenter.columnObject(axisYMax, _, _, _, _);
    },

    'test user answer is correct answer': function () {
        this.column._answer = 3;
        this.column._topSelectedBarNumber = 2;

        var validationResult = this.column._getUserAnswerStatus();

        assertEquals("ok", validationResult);
    },

    'test user answer is below correct answer': function () {
        this.column._answer = 3;
        this.column._topSelectedBarNumber = -1;

        var validationResult = this.column._getUserAnswerStatus();

        assertEquals("up", validationResult);
    },

    'test user answer is above correct answer': function () {
        this.column._answer = 3;
        this.column._topSelectedBarNumber = 6;

        var validationResult = this.column._getUserAnswerStatus();

        assertEquals("down", validationResult);
    }
});

TestCase("[Count_and_Graph] [Column Object] Set shows errors mode", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var axisYMax = 5;
        var answer = 3;
        this.columnIndex = 1;
        this.column = new this.presenter.columnObject(axisYMax, _, _, _, answer, this.columnIndex);

        this.spies = {
            getUserAnswerStatus: sinon.spy(this.column, '_getUserAnswerStatus'),
            setBarCssClass: sinon.spy(this.column, '_setBarCssClass'),
            getCssClassForCheckAnswers: sinon.spy(this.column, '_getCssClassForCheckAnswers')
        };
    },

    tearDown: function () {
        this.column._getUserAnswerStatus.restore();
        this.column._setBarCssClass.restore();
        this.column._getCssClassForCheckAnswers.restore();
    },

    'test errors mode should change top bar css class': function () {
        var expectedCssClass = "jqplot-point-label jqplot-series-1 jqplot-point-1 up";
        this.column._topSelectedBarNumber = 1;

        this.column.setShowErrorsMode();

        assertTrue(this.spies.getUserAnswerStatus.calledBefore(this.spies.setBarCssClass));
        assertTrue(this.spies.getCssClassForCheckAnswers.calledBefore(this.spies.setBarCssClass));
        assertTrue(this.spies.setBarCssClass.calledOnce);
        assertEquals(1, this.spies.setBarCssClass.getCall(0).args[0]);
        assertEquals(expectedCssClass, this.spies.setBarCssClass.getCall(0).args[1]);
    },

    'test when user did not selected any bar, there should not be a change in css for bar': function () {
        this.column._topSelectedBarNumber = -1;

        this.column.setShowErrorsMode();

        assertFalse(this.spies.getUserAnswerStatus.called);
        assertFalse(this.spies.setBarCssClass.called);
        assertFalse(this.spies.getCssClassForCheckAnswers.called);
    }
});

TestCase("[Count_and_Graph] [Column Object] Get css class for check answers", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var axisYMax = 5;
        this.columnIndex = 1;
        var answer = 3;
        this.column = new this.presenter.columnObject(axisYMax, _, _, _, answer, this.columnIndex);
    },

    'test css class should contain column index & bar index': function () {
        this.column._topSelectedBarNumber = 1;
        var expectedCssClass = "jqplot-point-label jqplot-series-1 jqplot-point-1 up";

        var validationResult = this.column._getCssClassForCheckAnswers();

        assertEquals(expectedCssClass, validationResult);
    }
});

TestCase("[Count_and_Graph] [Column Object] Set work mode", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var axisYMax = 5;
        var answer = 3;
        this.columnIndex = 1;
        this.column = new this.presenter.columnObject(axisYMax, _, _, _, answer, this.columnIndex);

        this.spies = {
            getUserAnswerStatus: sinon.spy(this.column, '_getUserAnswerStatus'),
            removeBarCssClass: sinon.spy(this.column, '_removeBarCssClass'),
            getCssClassForCheckAnswers: sinon.spy(this.column, '_getCssClassForCheckAnswers')
        };
    },

    tearDown: function () {
        this.column._getUserAnswerStatus.restore();
        this.column._removeBarCssClass.restore();
        this.column._getCssClassForCheckAnswers.restore();
    },

    'test work mode should delete show errors mode css class': function () {
        var expectedCssClass = "jqplot-point-label jqplot-series-1 jqplot-point-1 up";
        this.column._topSelectedBarNumber = 1;

        var expectation = sinon.mock(this.column._bars[1]);
        expectation.expects("removeCssClass").withArgs(expectedCssClass);

        this.column.setShowErrorsMode();
        this.column.setWorkMode();

        assertTrue(this.spies.getUserAnswerStatus.calledTwice);
        assertTrue(this.spies.removeBarCssClass.calledOnce);
        assertTrue(this.spies.getCssClassForCheckAnswers.calledTwice);
        assertTrue(this.spies.removeBarCssClass.calledOnce);
        assertEquals(1, this.spies.removeBarCssClass.getCall(0).args[0]);
        assertEquals(expectedCssClass, this.spies.removeBarCssClass.getCall(0).args[1]);

        expectation.verify();
    }
});

TestCase("[Count_and_Graph] [Column Object] Set / get state", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.column = new this.presenter.columnObject(_, _, _, _, _, _);
        this.stubs = {
            drawUserAnswer: sinon.stub(this.column, '_drawUserAnswer'),
            reset: sinon.stub(this.column, 'reset')
        };
    },

    tearDown: function () {
        this.column._drawUserAnswer.restore();
        this.column.reset.restore();
    },

    'test get state should return user selection in 0-n base': function () {
        this.column._topSelectedBarNumber = -1;
        var validationResult = this.column.getState();
        assertEquals(0, validationResult);


        this.column._topSelectedBarNumber = 3;
        var validationResult = this.column.getState();
        assertEquals(4, validationResult);

        this.column._topSelectedBarNumber = 10;
        var validationResult = this.column.getState();
        assertEquals(11, validationResult);
    },

    'test set state should change 0-n base to -1-n base': function () {
        this.column.setState(2);
        assertEquals(1, this.column._topSelectedBarNumber);

        this.column.setState(0);
        assertEquals(-1, this.column._topSelectedBarNumber);

        this.column.setState(8);
        assertEquals(7, this.column._topSelectedBarNumber);
    },

    'test set state should redraw user selection': function () {
        this.column.setState(3);

        assertTrue(this.stubs.reset.called);
        assertTrue(this.stubs.reset.calledBefore(this.stubs.drawUserAnswer));

        assertTrue(this.stubs.drawUserAnswer.called);
    }
});

TestCase("[Count_and_Graph] [Column Object] Draw user answer", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.column = new this.presenter.columnObject(_, _, _, _, _, _);
        this.column._topSelectedBarNumber = 3;
        this.stubs = {
            setOnBar: sinon.stub(this.column, '_setOnBar')
        };
    },

    tearDown: function () {
        this.column._setOnBar.restore();
    },

    'test should set on all user selected bar': function () {
        this.column._drawUserAnswer();

        assertEquals(4, this.stubs.setOnBar.callCount);
        assertEquals(0, this.stubs.setOnBar.getCall(0).args[0]);
        assertEquals(1, this.stubs.setOnBar.getCall(1).args[0]);
        assertEquals(2, this.stubs.setOnBar.getCall(2).args[0]);
        assertEquals(3, this.stubs.setOnBar.getCall(3).args[0]);
    }
});