TestCase("[Count_and_Graph] [Graph Object] Create columns", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.axisYMaximumValue = 5;
        this.answers = [1, 2, 3, 4, 5];
        this.colors = ["red", "green", "blue", "yellow", "brown"];
        this.descriptions = ["1", "2", "3", "4", "5"];
        this.imagesDescriptions = ["1", "2", "3", "4", "5"];
        this.barsWidth = 40;
        this.divMock = {
            width: function () {return 10;},
            height: function () {return 10;}
        };
    },

    'test graph creating columns to provided configuration': function () {
        var graph = new this.presenter.graphObject(
            this.divMock, this.axisYMaximumValue, this.answers, this.colors, this.descriptions, this.imagesDescriptions, this.barsWidth
        );

        var columns = graph._getColumns(40, 200);

        assertEquals(1, columns[0]._answer);
        assertEquals(2, columns[1]._answer);
        assertEquals(3, columns[2]._answer);
        assertEquals(4, columns[3]._answer);
        assertEquals(5, columns[4]._answer);

        assertEquals("red", columns[0]._barsColor);
        assertEquals("green", columns[1]._barsColor);
        assertEquals("blue", columns[2]._barsColor);
        assertEquals("yellow", columns[3]._barsColor);
        assertEquals("brown", columns[4]._barsColor);

        assertEquals(5, columns[0]._axisYMaximumValue);
        assertEquals(5, columns[1]._axisYMaximumValue);
        assertEquals(5, columns[2]._axisYMaximumValue);
        assertEquals(5, columns[3]._axisYMaximumValue);
        assertEquals(5, columns[4]._axisYMaximumValue);
    }
    
});

TestCase("[Count_and_Graph] [Graph Object] Grid line step", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.graph = new this.presenter.graphObject(jQuery('<div></div>'), 1, [1], [1], [1], [1], 1, 1, 1);
    },

    'test grid step should be a height divided equally among all Y axis values': function () {
        this.graph._axisYMaximumValue = 5;

        var validationResult = this.graph._getGridLineStep(100);

        assertEquals(20, validationResult);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Create grid", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.graph = new this.presenter.graphObject(jQuery('<div></div>'), 1, [1], [1], [1], [1], 1, 1, 1);
        this.div = {
            width: function () {
                return 1;
            },

            height: function () {
                return 1;
            },

            append: function () {
                return false;
            }
        };

        this.stubs = {
            getGridLineStep: sinon.stub(this.graph, '_getGridLineStep'),
            getGridLine: sinon.stub(this.graph, '_getGridLine'),
            positionGridLine: sinon.stub(this.graph, '_positionGridLine')
        };
    },

    tearDown: function () {
        this.graph._getGridLine.restore();
        this.graph._getGridLineStep.restore();
        this.graph._positionGridLine.restore();
    },

    'test grid should contain valid amount of lines': function () {
        this.graph._axisYMaximumValue = 5;
        this.graph._createGrid(this.div);

        assertEquals(6, this.stubs.getGridLine.callCount);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Columns max width", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var divMock = {
            width: function () {return 530;},
            height: function () {return 50;}
        };

        this.graph = new this.presenter.graphObject(divMock, _, _, _, _, _, _, _, _);
        this.graph._columnsNumber = 5;
        this.graph._$graphContainer = {
            width: function () {
                return 500;
            }
        };
    },

    'test every column should get equal share of width in container, minus width offset': function () {
        assertEquals(100, this.graph._getColumnsMaxWidth());
    }
});

TestCase("[Count_and_Graph] [Graph Object] Middle of column section", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var divMock = {
            width: function () {return 50;},
            height: function () {return 50;}
        };

        this.graph = new this.presenter.graphObject(divMock, _, _, _, _, _, _, _, _);
    },

    'test middle of column should be placed in middle of section': function () {
        var validationResult = this.graph._getMiddleOfColumnSection(0, 100, 40);
        assertEquals(30, validationResult);

        validationResult = this.graph._getMiddleOfColumnSection(125, 250, 20);
        assertEquals(177.5, validationResult);
    },

    'test when columns width is as large as section it should be placed in begin of section': function () {
        var validationResult = this.graph._getMiddleOfColumnSection(0, 100, 100);
        assertEquals(0, validationResult);

        validationResult = this.graph._getMiddleOfColumnSection(200, 400, 200);
        assertEquals(200, validationResult);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Positioning columns in graph", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;

        var divMock = {
            width: function () {return 50;},
            height: function () {return 50;}
        };

        this.graph = new this.presenter.graphObject(divMock, _, _, _, _, _, _, _, _);
        this.columnMock = new this.presenter.columnObject(_, _, _, _, _, _);
        this.stubs = {
            getWidth: sinon.stub(this.columnMock, 'getWidth'),
            setPosition: sinon.stub(this.columnMock, 'setPosition'),
            getColumnsMaxWidth: sinon.stub(this.graph, '_getColumnsMaxWidth')
        }
    },

    tearDown: function () {
    },

    'test position columns in middle of sections': function () {
        var columns = [this.columnMock, this.columnMock, this.columnMock, this.columnMock, this.columnMock];
        this.graph._columns = columns;

        this.stubs.getColumnsMaxWidth.returns(100);
        this.stubs.getWidth.returns(40);

        this.graph._positionColumnsInGraph();
        assertEquals(30, this.stubs.setPosition.getCall(0).args[0]);
        assertEquals(130, this.stubs.setPosition.getCall(1).args[0]);
        assertEquals(230, this.stubs.setPosition.getCall(2).args[0]);
        assertEquals(330, this.stubs.setPosition.getCall(3).args[0]);
        assertEquals(430, this.stubs.setPosition.getCall(4).args[0]);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Border offset", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.divMock = {
            width: function () {return 50;},
            height: function () {return 50;}
        }
    },

    'test columns with 1 bar should have no offset': function () {
        var _ = 1;
        this.graph = new this.presenter.graphObject(this.divMock, 1, _, _, _, _, _, _, _);

        var validationResult = this.graph._getBorderOffset();

        assertEquals(0, validationResult);
    },

    'test columns with many bars should have offset equal to borders in between of columns': function () {
        var _ = 1;
        var graph = new this.presenter.graphObject(this.divMock, 5, _, _, _, _, _, _, _);

        var validationResult = graph._getBorderOffset();

        assertEquals(8, validationResult);

        graph = new this.presenter.graphObject(this.divMock, 2, _, _, _, _, _, _, _);
        validationResult = graph._getBorderOffset();

        assertEquals(2, validationResult);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Create axis Y", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var divMock = {
            width: function () {return 50;},
            height: function () {return 50;}
        };

        this.graph = new this.presenter.graphObject(divMock, 5, _, _, _, _, _, _, _, _, _);
        this.stubs = {
            axisYObject: sinon.stub(this.presenter, 'axisYObject'),
            getAxisYHeight: sinon.stub(this.graph, '_getAxisYHeight'),
            getAxisYWidth: sinon.stub(this.graph, '_getAxisYWidth')
        };
    },

    tearDown: function () {
        this.graph._getAxisYHeight.restore();
        this.graph._getAxisYWidth.restore();
        this.presenter.axisYObject.restore();
    },

    'test axis Y object should be have graph height but small axis Y width': function () {
        this.stubs.getAxisYHeight.returns(50);
        this.stubs.getAxisYWidth.returns(50);

        this.graph._createAxisY();

        assertTrue(this.stubs.axisYObject.calledWith(5, 50, 50, 1, 1));
    }
});

TestCase("[Count_and_Graph] [Graph Object] Create axis X", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();

        var _ = 1;

        this.axisYMax = 5;
        this.answers = ["1", "2", "3", "4", "5"];
        this.descriptions = ["1", "2", "3", "4", "5"];
        this.descriptionsImages = ["1", "2", "3", "4", "5"];
        this.barsWidth = 50;

        this.mockDiv = {
            width: function () {return 500;},
            height: function () {return 500;}
        };


        this.graph = new this.presenter.graphObject(this.mockDiv, this.axisYMax, this.answers, _, this.descriptions,
                                                    this.descriptionsImages, this.barsWidth, _, _, _, _, 30);

        this.graph._$graphContainer = {
            css: function (elem) {
                return "0px";
            }
        };

        this.stubs = {
            getColumnsPositions: sinon.stub(this.graph, '_getColumnsDescriptionsPositions'),
            getColumnsMaxWidth: sinon.stub(this.graph, '_getColumnsMaxWidth')
        };
    },

    tearDown: function () {
        this.graph._getColumnsDescriptionsPositions.restore();
        this.graph._getColumnsMaxWidth.restore();
    },

    'test axis X should be created with number of columns equal to answers length': function () {
        this.stubs.getColumnsPositions.returns([1, 2, 3, 4, 5]);
        this.stubs.getColumnsMaxWidth.returns(25);

        this.graph._createAxisX();

        assertEquals(5, this.graph._axisX._numberOfColumns);
    },

    'test axis X should be created with axis space as height': function () {
        this.stubs.getColumnsPositions.returns([1, 2, 3, 4, 5]);
        this.stubs.getColumnsMaxWidth.returns(25);

        this.graph._createAxisX();

        assertEquals(30, this.graph._axisX._height);
    },

    'test axis X should be created with graph container width': function () {
        this.stubs.getColumnsPositions.returns([1, 2, 3, 4, 5]);
        this.stubs.getColumnsMaxWidth.returns(25);

        this.graph._createAxisX();

        assertEquals(470, this.graph._axisX._width);
    },

    'test axis X should be created with series descriptions & series images descriptions': function () {
        this.stubs.getColumnsPositions.returns([1, 2, 3, 4, 5]);
        this.stubs.getColumnsMaxWidth.returns(25);

        this.graph._createAxisX();

        assertEquals(this.descriptions, this.graph._axisX._seriesDescriptions);
        assertEquals(this.descriptionsImages, this.graph._axisX._seriesImageDescriptions);
    },

    'test axis X should be created with columns positions equal to columns positioning': function () {
        var expectedPositions = [0, 50, 100, 150];
        this.stubs.getColumnsPositions.returns(expectedPositions);
        this.stubs.getColumnsMaxWidth.returns(25);

        this.graph._createAxisX();

        assertTrue(this.stubs.getColumnsPositions.called);
        assertEquals(expectedPositions, this.graph._axisX._columnsPositions);
    },

    'test axis X should be created with columns max width': function () {
        var expectedValue = 50;
        this.stubs.getColumnsPositions.returns([1, 2, 3, 4, 5]);
        this.stubs.getColumnsMaxWidth.returns(expectedValue);

        this.graph._createAxisX();

        assertTrue(this.stubs.getColumnsMaxWidth.called);
        assertEquals(50, this.graph._axisX._columnsMaxWidth);

    }
});

TestCase("[Count_and_Graph] [Graph Object] Get columns descriptions positions", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();

        var _ = 1;

        this.axisYMax = 5;
        this.answers = ["1", "2", "3", "4", "5"];
        this.descriptions = ["1", "2", "3", "4", "5"];
        this.descriptionsImages = ["1", "2", "3", "4", "5"];
        this.barsWidth = 50;

        this.mockDiv = {
            width: function () {return 530;},
            height: function () {return 500;}
        };


        this.graph = new this.presenter.graphObject(this.mockDiv, this.axisYMax, this.answers, _, this.descriptions,
                                                    this.descriptionsImages, this.barsWidth, _, _, _, _);
    },

    'test should return array with middle points under columns': function () {
        var expectedValues = [0, 100, 200, 300, 400];

        var validationResult = this.graph._getColumnsDescriptionsPositions();

        assertEquals(expectedValues.length, validationResult.length);
        assertEquals(expectedValues, validationResult);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Column width", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();

        var _ = 1;

        this.answers = [1, 2, 3, 4, 5];

        this.mockDiv = {
            width: function () {return 530;},
            height: function () {return 500;}
        };

        this.graph = new this.presenter.graphObject(this.mockDiv, _, this.answers, _, _, _, _, _, _, _, _);
        this.stubs = {
            getMaxColumnsWidth: sinon.stub(this.graph, '_getColumnsMaxWidth')
        }
    },

    tearDown: function () {
        this.graph._getColumnsMaxWidth.restore();
    },

    'test when bar width is larger than max column width, it should be max column width minus offset': function () {
        this.graph._barsWidth = 200;
        this.stubs.getMaxColumnsWidth.returns(50);
        this.graph._columnsAtMaxOffset = 10;

        var validationResult = this.graph._getColumnWidth();

        assertEquals(40, validationResult);
    },

    'test when bar width is smaller equal than max column width, it should be bar width': function () {
        this.graph._barsWidth = 50;
        this.stubs.getMaxColumnsWidth.returns(1000);

        var validationResult = this.graph._getColumnWidth();

        assertEquals(50, validationResult);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Get axis X height", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;

        var div = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.graph = new this.presenter.graphObject(div, _, _, _, _, _, _, _, _, _, _, _);
    },

    'test axis X height should be equal to axis space': function () {
        this.graph._axisSpace = 40;

        var validationResult = this.graph._getAxisXHeight();

        assertEquals(40, validationResult);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Show / hide answers", {
    setUp: function () {
        var _ = 1;
        this.presenter = AddonCount_and_Graph_create();
        var div = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.column = new this.presenter.columnObject(_, _, _, _, _);
        this.stubs = {
            showAnswer: sinon.stub(this.column, 'showAnswer'),
            hideAnswer: sinon.stub(this.column, 'hideAnswer')
        };

        this.graph = new this.presenter.graphObject(div, _, _, _, _, _, _, _, _, _, _, _);
    },

    tearDown: function () {
        this.column.showAnswer.restore();
        this.column.hideAnswer.restore();
    },

    'test show answers should be called on every column': function () {

        this.graph._columns = [this.column, this.column, this.column, this.column];
        this.graph.showAnswers();

        assertEquals(4, this.stubs.showAnswer.callCount);
    },

    'test hide answers should be called on every column': function () {
        this.graph._columns = [this.column, this.column, this.column, this.column];
        this.graph.hideAnswers();

        assertEquals(4, this.stubs.hideAnswer.callCount);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Block / unblock", {
    setUp: function () {
        var _ = 1;
        this.presenter = AddonCount_and_Graph_create();
        var div = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.column = new this.presenter.columnObject(_, _, _, _, _);
        this.stubs = {
            block: sinon.stub(this.column, 'block'),
            unblock: sinon.stub(this.column, 'unblock')
        };

        this.graph = new this.presenter.graphObject(div, _, _, _, _, _, _, _, _, _, _, _);
    },

    tearDown: function () {
        this.column.block.restore();
        this.column.unblock.restore();
    },

    'test block should be called on every column': function () {
        this.graph._columns = [this.column, this.column, this.column, this.column];
        this.graph.block();

        assertEquals(4, this.stubs.block.callCount);
    },

    'test unblock should be called on every column': function () {
        this.graph._isBlocked = true;
        this.graph._columns = [this.column, this.column, this.column, this.column];
        this.graph.unblock();

        assertEquals(4, this.stubs.unblock.callCount);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Max score", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };
        var _ = 1;
        this.graph = new this.presenter.graphObject(divMock, _, [1, 2, 3, 4, 5], _, _, _, _, _, _, _, _, _);
    },

    'test max score should be equal to columns number': function () {
        assertEquals(5, this.graph.getMaxScore());
    }

});

TestCase("[Count_and_Graph] [Graph Object] Score", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var mockDiv = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.graph = new this.presenter.graphObject(mockDiv, _, _, _, _, _, _, _, _, _, _, _);
        this.column1 = new this.presenter.columnObject(_, _, _, _, 1);
        this.column2 = new this.presenter.columnObject(_, _, _, _, 2);
        this.column3 = new this.presenter.columnObject(_, _, _, _, 3);

        this.graph._columns = [this.column1, this.column2, this.column3];

        this.stubs = {
            getScoreColumn1: sinon.stub(this.column1, 'getScore'),
            getScoreColumn2: sinon.stub(this.column2, 'getScore'),
            getScoreColumn3: sinon.stub(this.column3, 'getScore')
        };
    },

    'test score should be called on all columns': function () {
        this.graph.getScore();

        assertTrue(this.stubs.getScoreColumn1.called);
        assertTrue(this.stubs.getScoreColumn2.called);
        assertTrue(this.stubs.getScoreColumn3.called);
    },

    'test score should be sum of columns provided values from getScore': function () {
        this.stubs.getScoreColumn1.returns(1);
        this.stubs.getScoreColumn2.returns(1);
        this.stubs.getScoreColumn3.returns(0);

        var scoreValidation = this.graph.getScore();

        assertEquals(2, scoreValidation);
    }
});

TestCase("[Count_and_Graph] [Graph Object] Error count", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };
        var _ = 1;

        this.graph = new this.presenter.graphObject(divMock, _, _, _, _, _, _, _, _, _, _, _);

        this.stubs = {
            getMaxScore: sinon.stub(this.graph, 'getMaxScore'),
            getScore: sinon.stub(this.graph, 'getScore'),
            isAttempted: sinon.stub(this.graph, 'isAttempted')
        };
    },

    tearDown: function () {
        this.graph.getMaxScore.restore();
        this.graph.getScore.restore();
    },

    'test error count should be diffrence between max score and score': function () {
        this.stubs.isAttempted.returns(true);
        this.stubs.getMaxScore.returns(3);
        this.stubs.getScore.returns(3);

        assertEquals(0, this.graph.getErrorCount());

        this.stubs.getMaxScore.returns(3);
        this.stubs.getScore.returns(0);

        assertEquals(3, this.graph.getErrorCount());
    }
});

TestCase("[Count_and_Graph] [Graph Object] Get / set state", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        var divMock = {
            width: function () {return 500;},
            height: function () {return 500;}
        };

        this.column = new this.presenter.columnObject(_, _, _, _, _, _);
        this.graph = new this.presenter.graphObject(divMock, _, _, _, _, _, _, _, _, _, _, _);
        this.graph._columns = [this.column, this.column, this.column];

        this.stubs = {
            columnGetState: sinon.stub(this.column, 'getState'),
            columnSetState: sinon.stub(this.column, 'setState')
        };
    },

    'test graph should get state from every column': function () {
        this.graph.getState();

        assertEquals(3, this.stubs.columnGetState.callCount);
    },

    'test graph should set state to every column': function () {
        this.graph.setState([1, 2, 3]);

        assertEquals(3, this.stubs.columnSetState.callCount);
    },

    'test get state should return columns positions': function () {
        this.stubs.columnGetState.returns(1).call(0);
        this.stubs.columnGetState.returns(1).call(1);
        this.stubs.columnGetState.returns(1).call(2);

        var expectedResult = [1, 1, 1];

        var validationResult = this.graph.getState();

        assertEquals(expectedResult, validationResult);
    },

    'test set state should distribute provided columns positions': function () {
        this.graph.setState([1, 2, 3]);

        assertEquals(1, this.stubs.columnSetState.getCall(0).args[0]);
        assertEquals(2, this.stubs.columnSetState.getCall(1).args[0]);
        assertEquals(3, this.stubs.columnSetState.getCall(2).args[0]);
    }
});


TestCase("[Count_and_Graph] [Graph Object] Get graph has finished loading event", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var divMock = {
            width: function () {return 1;},
            height: function () {return 1;}
        };

        var answers = [1];

        this.graph = new this.presenter.graphObject(divMock, 1, answers);
    },

    'test event should be type of graph has finished loading': function () {
        var expectedEvent = {
            type: this.presenter.GRAPH_EVENT_TYPE.GRAPH_HAS_FINISHED_LOADING
        };

        var eventValidation = this.graph._getGraphHasFinishedLoadingEvent();

        assertEquals(expectedEvent, eventValidation)
    }
});

TestCase("[Count_and_Graph] [Graph Object] Notify", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var divMock = {
            width: function () {return 1;},
            height: function () {return 1;}
        };

        var answers = [1];

        this.graph = new this.presenter.graphObject(divMock, 1, answers);
        this.presenter.observer = new this.presenter.graphObserver();

        this.stubs = {
            update: sinon.stub(this.presenter.observer, 'update'),
            getEvent: sinon.stub(this.graph, '_getGraphHasFinishedLoadingEvent')
        };
    },

    tearDown: function () {
        this.presenter.observer.update.restore();
        this.graph._getGraphHasFinishedLoadingEvent.restore();
    },

    'test notifying observer should be with provided event and only once': function () {
        var expectedEvent = {
            type: "TestingEvent",
            data: "yupikajej"
        };

        this.stubs.getEvent.returns(expectedEvent);

        this.graph.notify();

        assertTrue(this.stubs.update.calledOnce);
        assertTrue(this.stubs.update.calledWith(expectedEvent));
    }
});