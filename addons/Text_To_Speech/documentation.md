## Description
Text To Speech module allows the user to play voice from text in many languages, as well as supplies a dedicated screen reader. To achieve that, it takes advantage of the Web Speech API provided by the user's internet browser.

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
If you want to connect Text to Speech addon to player you have to set it's ID to: <strong>Text_To_Speech1</strong> . Only one Text_To_Speech module should be present on the page.
</div>

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Enter Text</td>
        <td>Text on entering WCAG navigation</td>
    </tr>
    <tr>
        <td>Exit Text</td>
        <td>Text on exiting WCAG navigation</td>
    </tr>
    <tr>
        <td>New Page</td>
        <td>Text played on entering the page while in WCAG navigation. The content of this property will be followed by the title of the page, for example "New page: Page 1". The default value is "New page". </td>
    </tr>
    <tr>
        <td>Page title language</td>
        <td>Language tag used when playing the title of the page (but not the contents of the "New page" property) after entering it while in WCAG navigation. By default, the lesson's language tag will be used.</td>
    </tr>
    <tr>
        <td>Configuration</td>
        <td>List of modules with parameters: ID, Area and Title. When moving between modules using the Tab button in WCAG navigation, the next module will be determined based on the order in which they are listed in this property.</td>
    </tr>
    <tr>
        <td>ID</td>
        <td>ID of the module</td>
    </tr>
    <tr>
        <td>Area</td>
        <td>Name of the area the module is in. Takes one of three values: Main, Header or Footer</td>
    </tr>
    <tr>
        <td>Title</td>
        <td>Text played on selecting the module. This will not be played on entering the WCAG navigation.</td>
    </tr>
</table>

There is also an additional property that can be found in the lesson's Settings:

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>Tag of the language to be used by the lesson. This language will be used whenever a given module does not specify a different tag, as well as when playing the enter text, exit text (defined in 'Enter Text' and 'Exit Text' properties), module's title (defined in 'Title' property) and module's speech texts (defined in 'speech texts' property. More information in the 'Supported modules' section).</td>
    </tr>
</table>

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the module.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>---</td>
        <td>Shows the module.</td>
    </tr>
    <tr>
        <td>playTitle</td>
        <td>area, id, langTag</td>
        <td>Play module's title from given id. langTag parameter is optional.</td>
    </tr>
    <tr>
        <td>speak</td>
        <td>text, langTag</td>
        <td>Play provided text. langTag parameter is optional.</td>
    </tr>
    <tr>
        <td>playEnterText</td>
        <td>---</td>
        <td>Play enter text (defined in the Enter Text property)</td>
    </tr>
    <tr>
        <td>playExitText</td>
        <td>---</td>
        <td>Play exit text (defined in the Exit Text property)</td>
    </tr>
    <tr>
        <td>getModulesOrder</td>
        <td>---</td>
        <td>returns list of module ids in correct order</td>
    </tr>
</table>

## Supported modules:

Modules listed below are supported by the Text To Speech module.

<ul>
<li>Check Button</li>
<li>Check Counter</li>
<li>Choice</li>
<li>Connection</li>
<li>Error Counter</li>
<li>Feedback</li>
<li>Heading</li>
<li>Hierarchical Lesson Report</li>
<li>Image</li>
<li>Image Identification</li>
<li>Image Source</li>
<li>Multiple Gap</li>
<li>Navigation Bar</li>
<li>Next Page Button</li>
<li>Ordering</li>
<li>Page Counter</li>
<li>Page Progress</li>
<li>Previous Page Button</li>
<li>Report</li>
<li>Reset Button</li>
<li>Show Answers</li>
<li>Source List</li>
<li>Text</li>
<li>Text Identification</li>
<li>Text Selection</li>
<li>True False</li>
<li>Video</li>
<li>Zoom Image</li>
</ul>

Supported modules typically will have the following properties:
<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>Tag of the language this module is using (more information in the 'Languages' section). If this value is empty, the lesson's language tag will be used.</td>
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>A list of speech texts to be used. Speech texts are used to provide various additional information and context about the contents of a module (For example, if a module allows for checking it's answers, it might have 'Correct', 'Wrong' and 'Empty' speech texts). Speech texts are always played using the lesson's language (as defined in lesson Setting's 'Lang attribute' property), regardless of the language used by the module. </td>
    </tr>
</table>

Additionally, all modules accessible through the WCAG navigation can be added to the list of modules in the Configuration property. However, these modules do not offer any additional TTS functionality beyond reading their title (defined in the Title property).


## Browser support

It is important to note that the speech synthesis is a new functionality provided by the user's internet browser. Because of that, Text To Speech module might not work properly on older browsers, and not all languages might be available on all browsers. Internet browsers known to support speech synthesis functionality are listed below:

Desktop
<ul>
<li>Chrome (since version 33)</li>
<li>Edge</li>
<li>Firefox (since version 49)</li>
<li>Safari (since version 7) </li>
</ul>

Mobile
<ul>
<li>Android</li>
<li>Chrome</li>
<li>Edge</li>
<li>Firefox OS (since version 2.0)</li>
<li>Safari Mobile (since version 7.1)</li>
</ul>

## Languages

The available languages, their speech synthesizer voices, as well as tags used to identify them, depend on the end user's operating system, internet browser, any additional libraries they may have installed and their internet connection (some voices are only available remotely and will not work properly without stable internet connection).  You can check what languages are available to you on your browser using the following script (use this <a href='/file/serve/4842318365196288'>download link</a> or run the script below by <a id='showVoices'>clicking here</a>).

<script>
	function getAvailableVoices() {
		if(typeof window.speechSynthesis === 'undefined') {
			return;
		};
		
		var noVoices = document.getElementById("noVoices");
		noVoices.style.display = "none";
		var voicesTab = document.getElementById("voicesTab");
		if ( voicesTab.getElementsByTagName("tr").length>1){
			return;
		};
		voicesTab.style.display = "";
		var voices = window.speechSynthesis.getVoices();

		for (var i = voices.length-1; i>=0; i--){
			var row = voicesTab.insertRow(1);
			
			var nameCell = row.insertCell(0);
			nameCell.innerHTML = voices[i].name;
			
			var tagCell = row.insertCell(1);
			tagCell.innerHTML = voices[i].lang;
		}
	};
	
	function showVoices() {
		var wrapper = document.getElementById('voicesWrapper');
		wrapper.style.display = '';
		getAvailableVoices();
		if (speechSynthesis.onvoiceschanged !== undefined) {
		  speechSynthesis.addEventListener("voiceschanged", getAvailableVoices);
		}
	}

	var showVoicesButton = document.getElementById('showVoices');
	showVoicesButton.addEventListener("click", function (event) {
		showVoices();
	});
</script>

<div id='voicesWrapper' style='display: none'>
<div id="noVoices" style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">If you see this message, your browser most likely does not support speechSynthesis API</div>
<table id="voicesTab" border='1' style="display: none">
	<tr>
		<th>Name</th>
		<th>Tag</th>
	</tr>
</table>
</div>

Using the full tag is not always necessary. Listed below are shortened tag, along with full tags they abbreviate.

<table id="voicesTab" border='1'>
	<tr>
		<th>Shortened tag</th>
		<th>SpeechSynthesis tag</th>
	</tr>
        <tr>
		<td>de</td>
		<td>de-DE</td>
	</tr>
        <tr>
		<td>en</td>
		<td>en-US</td>
	</tr>
        <tr>
		<td>pl</td>
		<td>pl-PL</td>
	</tr>
</table>

## Demo presentation
[Demo presentation](https://www.mauthor.com/embed/6130257959321600 "Demo presentation") contains examples on how to use the Text To Speech addon.                                                                          