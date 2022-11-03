TestCase("[LottiePlayer] Get State", {

    setUp: function () {
        this.presenter = AddonLottiePlayer_create();
        this.presenter.configuration = createSimpleLottiePLayerConfigurationForTests();
        this.buildView();
        this.presenter.animationsElements = this.presenter.view.querySelectorAll("lottie-player");
    },

    buildView: function() {
        this.presenter.view = createLottiePlayerViewForTests(this.presenter.configuration);
        this.presenter.$view = $(this.presenter.view);
    },

    increaseAnimationsBy2: function () {
        for (let i = 0 ; i < 2; i ++) {
            this.presenter.configuration.animations.push({...this.presenter.configuration.animations[0]});
        }
        this.buildView();
        this.presenter.animationsElements = this.presenter.view.querySelectorAll("lottie-player");
    },

    'test given visible addon when getState is called then isVisible attribute in state equals to true': function () {
        this.presenter.setVisibility(true);

        let testedState = JSON.parse(this.presenter.getState());

        assertTrue(testedState.isVisible);
    },

    'test given not visible addon when getState is called then isVisible attribute in state equals to false': function () {
        this.presenter.setVisibility(false);

        let testedState = JSON.parse(this.presenter.getState());

        assertFalse(testedState.isVisible);
    },

    'test given addon with second animation currently displayed when getState is called then currentAnimationIndex attribute in state equals to 1': function () {
        this.presenter.currentAnimationIndex = 1;

        let testedState = JSON.parse(this.presenter.getState());

        assertEquals(1, testedState.currentAnimationIndex);
    },

    'test given addon when getState is called then previouslyVisited attribute in state always equals to true': function () {
        this.presenter.previouslyVisited = false;

        let testedState = JSON.parse(this.presenter.getState());

        assertTrue(testedState.previouslyVisited);
    },

    'test given addon with animations paused at various times when getState is called then animationsSavedFrames attribute in state have animations frame numbers on which the animations was paused': function () {
        const randomFrameNumbers = [1412, 0];
        this.presenter.animationsElements.forEach((animation, index) => {
            animation.getLottie = () => ({
                currentFrame: randomFrameNumbers[index]
            })
        })

        let testedState = JSON.parse(this.presenter.getState());

        this.presenter.animationsElements.forEach((animation, index) => {
            assertEquals(randomFrameNumbers[index], testedState.animationsSavedFrames[index]);
        })
    },

    'test given addon with animations at different statues when getState is called then animationsStates attribute in state have correct animations statuses': function () {
        this.increaseAnimationsBy2();
        this.presenter.initializeAnimationsStates();
        this.presenter.animationsStates[0].play();
        this.presenter.animationsStates[1].pause();
        this.presenter.animationsStates[2].stop();
        this.presenter.animationsStates[3].freeze();

        let testedState = JSON.parse(this.presenter.getState());

        const allStatues = this.presenter.animationsStates[0].STATUES;
        assertEquals(this.presenter.animationsElements.length, testedState.animationsStates.length);
        assertEquals(allStatues.PLAYING, testedState.animationsStates[0].status);
        assertEquals(allStatues.PAUSED, testedState.animationsStates[1].status);
        assertEquals(allStatues.STOPPED, testedState.animationsStates[2].status);
        assertEquals(allStatues.FROZEN, testedState.animationsStates[3].status);
    },

    'test given addon with animations at different played loops numbers when getState is called then animationsStates attribute in state have correct animations played loops numbers': function () {
        const playedLoops = [4, 3, 0, 1];
        this.increaseAnimationsBy2();
        this.presenter.initializeAnimationsStates();
        this.presenter.animationsStates.forEach((state, index) => {
            for (let amount = 0; amount < playedLoops[index]; amount ++) {
                state.increasePlayedLoops();
            }
        })

        let testedState = JSON.parse(this.presenter.getState());

        assertEquals(this.presenter.animationsElements.length, testedState.animationsStates.length);
        testedState.animationsStates.forEach((state, index) => {
            assertEquals(playedLoops[index], state.playedLoops);
        })
    }
});

TestCase("[LottiePlayer] Set State", {

    setUp: function () {
        this.presenter = AddonLottiePlayer_create();
        this.presenter.configuration = createSimpleLottiePLayerConfigurationForTests();
        for (let i = 0 ; i < 2; i ++) {
            this.presenter.configuration.animations.push({...this.presenter.configuration.animations[0]});
        }

        this.stubs = {
            setVisibilityStub: sinon.stub(),
            onAnimationReadyForSetStateStub: sinon.stub(),
            addEventListenerStub: sinon.stub()
        }

        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.onAnimationReadyForSetState = this.stubs.onAnimationReadyForSetStateStub;
        this.buildView();
    },

    buildView: function() {
        this.presenter.view = createLottiePlayerViewForTests(this.presenter.configuration);
        this.presenter.$view = $(this.presenter.view);
        this.presenter.animationsElements = this.presenter.view.querySelectorAll("lottie-player");
        this.presenter.animationsElements.forEach(animation => {
            animation.addEventListener = this.stubs.addEventListenerStub;
        })
    },

    getSampleOfState: function () {
        return {
            "isVisible": true,
            "currentAnimationIndex": 0,
            "animationsStates": [
                {
                    "index": 0,
                    "playedLoops": 2,
                    "status": 1
                },
                {
                    "index": 1,
                    "playedLoops": 1,
                    "status": 2
                },
                {
                    "index": 2,
                    "playedLoops": 5,
                    "status": 0
                },
                {
                    "index": 3,
                    "playedLoops": 0,
                    "status": 3
                },
            ],
            "animationsSavedFrames": [
                0,
                8.773199999999997,
                0,
                0,
            ],
            "previouslyVisited": true
        }
    },

    setState: function (state) {
        let parsedState = JSON.stringify(state);
        this.presenter.setState(parsedState);
    },

    'test given state with isVisible attribute set to true when setState is called then setVisibility is called with true as argument': function () {
        let state = this.getSampleOfState();
        state.isVisible = true;

        this.setState(state);

        assertTrue(this.stubs.setVisibilityStub.calledOnce);
        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test given state with isVisible attribute set to false when setState is called then setVisibility is called with false as argument': function () {
        let state = this.getSampleOfState();
        state.isVisible = false;

        this.setState(state);

        assertTrue(this.stubs.setVisibilityStub.calledOnce);
        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    },

    'test given state with currentAnimationIndex attribute equals to 2 when setState is called then currentAnimationIndex attribute in presenter equals to 2': function () {
        let state = this.getSampleOfState();
        state.currentAnimationIndex = 2;

        this.setState(state);

        assertEquals(2, this.presenter.currentAnimationIndex);
    },

    'test given state with previouslyVisited attribute equals to false when setState is called then previouslyVisited attribute presenter state equals to false': function () {
        let state = this.getSampleOfState();
        state.previouslyVisited = false;

        this.setState(state);

        assertFalse(this.presenter.previouslyVisited);
    },

    'test given state with animations frames set to various times when setState is called create event listener on ready to call onAnimationReadyForSetState': function () {
        let state = this.getSampleOfState();

        this.setState(state);

        assertEquals(state.animationsStates.length, this.stubs.addEventListenerStub.callCount);
    },

    'test given state with animations states at different statues when setState is called then animationsStates attribute in presenter have correct animations statuses': function () {
        let state = this.getSampleOfState();

        this.setState(state);

        assertEquals(state.animationsStates.length, this.presenter.animationsStates.length);
        assertTrue(this.presenter.animationsStates[0].isPlaying());
        assertTrue(this.presenter.animationsStates[1].isPaused());
        assertTrue(this.presenter.animationsStates[2].isStopped());
        assertTrue(this.presenter.animationsStates[3].isFrozen());
    },

    'test given state with animations states at different played loops numbers when setState is called animationsStates attribute in presenter have correct played loops numbers': function () {
        let state = this.getSampleOfState();

        this.setState(state);

        assertEquals(state.animationsStates.length, this.presenter.animationsStates.length);
        assertEquals(2, this.presenter.animationsStates[0].playedLoops);
        assertEquals(1, this.presenter.animationsStates[1].playedLoops);
        assertEquals(5, this.presenter.animationsStates[2].playedLoops);
        assertEquals(0, this.presenter.animationsStates[3].playedLoops);
    }
});
