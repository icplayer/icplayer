TestCase('[TextAudio] filter frames tests', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();

        this.frames = []
            .concat(Array(56).fill({ slide_id: -1, selection_id: -1 }))
            .concat(Array(25).fill({ slide_id: 0, selection_id: 1 }))
            .concat(Array(30).fill({ slide_id: 0, selection_id: 2 }))
            .concat(Array(45).fill({ slide_id: 0, selection_id: 3 }))
            .concat(Array(18).fill({ slide_id: 1, selection_id: 1 }))
            .concat(Array(12).fill({ slide_id: 2, selection_id: 1 }))
            .concat(Array(15).fill({ slide_id: 3, selection_id: 1 }))
            .concat(Array(16).fill({ slide_id: 4, selection_id: 1 }))
            .concat(Array(15).fill({ slide_id: 5, selection_id: 1 }))
            .concat(Array(10).fill({ slide_id: 5, selection_id: 2 }));
    },

    "test given frames when executing filtration then filter out all frames with negative id": function() {
        const filteredFrames = this.presenter.filterFrames(this.frames);

        const areFramesFilteredWrongly = filteredFrames.some(function (frame) {return frame.slide_id < 0 || frame.selection_id < 0});
        assertFalse(areFramesFilteredWrongly);
    },

    "test given frames when executing filtration then filter out duplicated frames": function() {
        const filteredFrames = this.presenter.filterFrames(this.frames);

        const areFramesFilteredWrongly = filteredFrames.length !== new Set(filteredFrames.map(frame => JSON.stringify(frame))).size;
        assertFalse(areFramesFilteredWrongly);
    },

    "test given frames when executing filtration then frames with positive ids will not be filtered out": function() {
        const filteredFrames = this.presenter.filterFrames(this.frames);

        const areFramesFilteredWrongly = filteredFrames.length !== 9
        assertFalse(areFramesFilteredWrongly);
    }
});
