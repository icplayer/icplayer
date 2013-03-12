ModelValidation = TestCase("Model Validation");

ModelValidation.prototype.testValidateModelTrue = function() {
    // Given
	var presenter = AddonGlossary_create();
    var model = {
		"List of words" : [
           {
			"ID" : "1",
			"Text" : "Frugo",
			"Description" : "Bez konserwantow"
           },
           {
    	   	"ID" : "2",
   			"Text" : "Clean Code",
   			"Description" : "A handbook of agile software craftmanship"
           }
		],
		"Visible" : "False"
    };
    
    // When
    var validated = presenter.validateModel(model);

    // Then
    assertTrue("After calling validateModel() validated should be True.", validated);
};

ModelValidation.prototype.testValidateModelFalse = function() {
    // Given
	var presenter = AddonGlossary_create();
    var model = {
		"List of words" : [
           {
			"ID" : "1",
			"Text" : "Frugo",
			"Description" : "Bez konserwantow"
           },
           {
    	   	"ID" : "1",
   			"Text" : "Clean Code",
   			"Description" : "A handbook of agile software craftmanship"
           }
		],
		"Visible" : "False"
    };
    
    // When
    var validated = presenter.validateModel(model);

    // Then
    assertFalse("After calling validateModel() validated should be False.", validated);
};