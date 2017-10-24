TestCase("[TrueFalse] Model validation tests", {
   setUp: function () {
       this.presenter = AddonTrueFalse_create();

       this.model = {
         'isNotActivity': "True",
         'Multi': "False",
         'Questions': [{
                 'Question': "True is on the left",
                 'Answser': "1"
             }],
         'Choices': [{
             'Choice': "True"
         }],
         'Is Tabindex Enabled': "False"
     };
   },

    'test should set isTabindexEnabled to false': function () {
        this.presenter.validateModel(this.model);

        assertFalse(this.presenter.isTabindexEnabled);
    },

    'test should set isTabindexEnabled to true': function () {
        this.model['Is Tabindex Enabled'] = "True";
        this.presenter.validateModel(this.model);

        assertTrue(this.presenter.isTabindexEnabled);
    }
});