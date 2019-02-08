TestCase('[Limited Submit] External methods tests', {
    setUp: function () {
        this.presenter = AddonLimited_Submit_create();
        this.presenter.configuration = {
            worksWithModulesList: ["text1", "text2", "text3"]
        };

    },

    'test given modules list when getWorksWithModulesList method is called then will return new list with modules': function () {
        var modules = this.presenter.getWorksWithModulesList();


        assertFalse(modules === this.presenter.configuration.worksWithModulesList);
        assertEquals(modules, this.presenter.configuration.worksWithModulesList);
    }
});