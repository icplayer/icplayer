TestCase('[Maze] get state tests', {
    setUp: function () {
        this.presenter = AddonMaze_create();
        this.presenter.state = {
            isDisabled: false,
            actualGameIndex: 0,
            mistakes: 0,
            errorCount: 0,
            isVisible: false,
            games: []
        };
    },

    'test getState gets all properties': function () {
        var state = this.presenter.getState();

        assertEquals({
            isDisabled: false,
            actualGameIndex: 0,
            mistakes: 0,
            errorCount: 0,
            isVisible: false,
            actualGame: null
        }, JSON.parse(state));
    },


    'test get state returns isVisible as true is in state is true': function () {
        this.presenter.state.isVisible = true;

        var state = this.presenter.getState();

        assertEquals(true, JSON.parse(state).isVisible);
    },

    'test get state returns actual game index from state': function () {
        this.presenter.state.actualGameIndex = 23;

        var state = this.presenter.getState();

        assertEquals(23, JSON.parse(state).actualGameIndex);
    },

    'test get state returns mistakes count from state': function () {
        this.presenter.state.mistakes = 20;

        var state = this.presenter.getState();

        assertEquals(20, JSON.parse(state).mistakes);
    },

    'test get state returns error count from state': function () {
        this.presenter.state.errorCount = 2;

        var state = this.presenter.getState();

        assertEquals(2, JSON.parse(state).errorCount);
    },

    'test if actual game index in larger than games count then get state will return null': function () {
        this.presenter.actualGameIndex = 23;

        var state = this.presenter.getState();

        assertEquals(null, JSON.parse(state).actualGame);
    },

    'test get state will call serialize on actual game': function () {
        this.presenter.state.actualGameIndex = 1;
        this.presenter.state.games = [{},
            {
                serialize: function () {return 'ok'}
            }
        ];

        var state = this.presenter.getState();

        assertEquals('ok', JSON.parse(state).actualGame);
    }
});

TestCase('[Maze] set state tests', {
     setUp: function () {
        function getGameMock () {
            return {
                destroy: sinon.mock(),
                start: sinon.mock(),
                deserialize: sinon.mock()
            }
        }
        this.presenter = AddonMaze_create();
        this.exampleState = {
            isDisabled: false,
            actualGameIndex: 5,
            mistakes: 3,
            errorCount: 23,
            isVisible: false,
            actualGame: 'Test'
        };

        this.presenter.$view = $(document.createElement('div'));
        this.presenter.state.elements.endGame = document.createElement('div');
        this.presenter.state.elements.endGame.style.display = 'none';
        this.presenter.state.games = [
            getGameMock(),
            getGameMock(),
            getGameMock(),
            getGameMock(),
            getGameMock(),
            getGameMock(),
            getGameMock()
        ]
    },

    'test set state will set visibility to true when addon visibility is false': function () {
         this.presenter.setVisibility(false);
         this.exampleState.isVisible = true;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertEquals('visible', this.presenter.$view.css('visibility'));
         assertTrue(this.presenter.state.isVisible);
    },

    'test set state will set visibility to false when addon visibility is true': function () {
        this.presenter.setVisibility(true);
        this.exampleState.isVisible = false;

        this.presenter.setState(JSON.stringify(this.exampleState));

        assertEquals('hidden', this.presenter.$view.css('visibility'));
        assertFalse(this.presenter.state.isVisible);
    },

    'test set state will set isDisabled to true if in state was true': function () {
         this.presenter.isDisabled = false;
         this.exampleState.isDisabled = true;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertTrue(this.presenter.state.isDisabled);
    },

    'test set state will set isDisabled to false if in state was false': function () {
         this.presenter.isDisabled = true;
         this.exampleState.isDisabled = false;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertFalse(this.presenter.state.isDisabled);
    },

    'test setState will destroy game if new game index is not 0': function () {
         this.presenter.state.actualGameIndex = 1;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertTrue(this.presenter.state.games[1].destroy.calledOnce);
    },

    'test setState dont destroy game if new game index is 0': function () {
         this.presenter.state.actualGameIndex = 0;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertTrue(this.presenter.state.games[1].destroy.notCalled);
    },

    'test setState sets mistakes count': function () {
         this.presenter.setState(JSON.stringify(this.exampleState));

         assertEquals(this.exampleState.mistakes, this.presenter.state.mistakes);
    },

    'test setState sets error count': function () {
         this.presenter.setState(JSON.stringify(this.exampleState));

         assertEquals(this.exampleState.errorCount, this.presenter.state.errorCount);
    },

    'test setState sets actual game index': function () {
         this.presenter.setState(JSON.stringify(this.exampleState));

         assertEquals(this.exampleState.actualGameIndex, this.presenter.state.actualGameIndex);
    },

    'test setState will deserialize last game state': function () {
         this.presenter.state.actualGameIndex = 1;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertTrue(this.presenter.state.games[this.presenter.state.actualGameIndex].deserialize.calledOnce);
         assertTrue(this.presenter.state.games[this.presenter.state.actualGameIndex].deserialize.calledWith('Test'))
    },

    'test if new game index is not 0 then set state starts correct game': function () {
         this.presenter.state.actualGameIndex = 1;
         this.presenter.state.elements.gameContainer = {'test': 90};

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertTrue(this.presenter.state.games[this.presenter.state.actualGameIndex].start.calledOnce);
         assertTrue(this.presenter.state.games[this.presenter.state.actualGameIndex].start.calledWith(this.presenter.state.elements.gameContainer));
    },

    'test if index of new game is above games count then set state shows end game': function () {
         this.exampleState.actualGameIndex = this.presenter.state.games.length;
         this.presenter.state.actualGameIndex = 0;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertEquals('block', this.presenter.state.elements.endGame.style.display);
    },

    'test if index of new game is below games count then set state dont show end game': function () {
         this.exampleState.actualGameIndex = 0;

         this.presenter.setState(JSON.stringify(this.exampleState));

         assertEquals('none', this.presenter.state.elements.endGame.style.display);
    }
});