/**
 * Creates a TINYMCE instance on "example" div.
 * @param  {string} lang TinyMCE language. MathType integration read this variable to set the editor lang.
 * @param  {string} wiriseditorparameters JSON containing MathType Web parameters.
 */
 function createEditorInstance(lang, wiriseditorparameters) {

 	var dir = 'ltr';
 	if (lang == 'ar' || lang == 'he'){
 		dir = 'rtl';
 	}

 	if (typeof wiriseditorparameters == 'undefined') {
 		wiriseditorparameters = {};
 	}

 	tinymce.init({
 		selector: '#example',
 		height : 300,
 		auto_focus:true,
 		language: lang,
 		directionality : dir,
 		menubar : false,
 		plugins: 'tiny_mce_wiris',
 		toolbar: 'code,|,bold,italic,underline,|,cut,copy,paste,|,search,|,undo,redo,|,forecolor,backcolor,|,justifyleft,justifycenter,justifyright,fontselect,fontsizeselect,|,tiny_mce_wiris_formulaEditor,tiny_mce_wiris_formulaEditorChemistry,|,fullscreen',
 		init_instance_callback : "updateFunctionTimeOut",
 		setup : function(ed)
 		{
 			ed.on('init', function()
 			{
 				this.getDoc().body.style.fontSize = '16px';
 				this.getDoc().body.style.fontFamily = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
 			});
 		},
 		
 	});
 }

 function updateFunctionTimeOut() {
 	setTimeout(function(){ updateFunction();}, 500);
 }

 var exampleContainer = document.getElementById('example');
 if (exampleContainer.innerHTML.trim().length == 0 || exampleContainer.innerHTML == '<br>') {
 	exampleContainer.innerHTML = document.getElementById('example_content').innerHTML;
 }

// Creating TINYMCE demo instance.
createEditorInstance('en', {});

/**
 * Getting data from editor using getContent TINYMCE method.
 * MathType formulas are parsed to save mode format (mathml, image or base64)
 * For more information see: http://www.wiris.com/es/plugins/docs/full-mathml-mode.
 * @return {string} TINYMCE parsed data.
 */
 function getEditorData() {
 	return tinymce.get('example').getContent();
 }

/**
 * Changes dynamically wiriseditorparameters TINYMCE config variable.
 * @param {json} json_params MathType Web parameters.
 */
 function setParametersSpecificPlugin(wiriseditorparameters) {
 	//var lang = tinyMCE.activeEditor.settings.langCode;
 	//resetEditor(lang, wiriseditorparameters);
 	tinyMCE.activeEditor.settings.wiriseditorparameters = wiriseditorparameters;
 }

 function resetEditor(lang){
 	var editor_parameters = tinyMCE.activeEditor.settings.wiriseditorparameters;
 	tinymce.EditorManager.execCommand('mceRemoveEditor',true, "example");
 	createEditorInstance(lang, editor_parameters);
    _wrs_modalWindow = undefined;
 }

/**
 * Gets wiriseditorparameters from TINYMCE.
 * @return {object} MathType Web parameters as JSON. An empty JSON if is not defined.
 */
 function getWirisEditorParameters() {
 	if (typeof tinyMCE.activeEditor.settings != 'undefined' && typeof tinyMCE.activeEditor.settings.wiriseditorparameters != 'undefined') {
 		return tinyMCE.activeEditor.settings.wiriseditorparameters;
 	}
 	return {};
 }