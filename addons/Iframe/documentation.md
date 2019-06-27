## Description
Iframe allows embedding any html content into a lesson. It is possible to link an online website or to upload an html file and all its resources so that offline playback is also possible.

##**See also: [Iframe animation controlled by Advanced Connector](/doc/en/page/Iframe-animation-controlled-by-Advanced-Connector)**
(On this page you will find a description how to create an "avatar", an animated character that can react to user's answers, give feedback or provide hints to an activity and how to control an animation inside the Iframe module.)


## Online mode
If you want your content to be accessible only online, you can simply provide a link to your site that will be displayed in the lesson in the "Iframe URL" property. Modules configured this way will not work in offline applications like mLibro.

## Offline mode
For the Iframe to work offline:<br />
1. Upload the resources in the "File List" property (if there are any),<br />
2. In the main html file, change the URLs of your resources to the paths from the "File List Dictionary".<br />
3. Upload the main html file to the "Index File" property.	<br />
In this method please leave the "Iframe URL" property empty.

Your html site can communicate with the player, send and recieve messages, react to Check Answers Button, etc. using javasctipt. More details are presented below in the API section. <br />
Please make sure that your html and javascript code meet the HTML5 standards and are free of errors before uploading them to mAuthor.

## Memory and browser stability
Wrong usage of DOM operations or event listeners in scripts may cause memory leaks or browser crash. The script authors are responsible for memory leaks and browser stability.<br />

## Fixing memory leaks
The best way to detect page changes and free the memory is to add event listener onDomNodeRemved and release the memory.

	view.addEventListener('DOMNodeRemoved', destroy);
    destroy = function () {
        if (event.target !== this) {
            return;
        }
        view.removeEventListener('DOMNodeRemoved', destroy);
        window.removeEventListener("message",getMessage);
    };	
## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>IFrame URL</td>
        <td>An address of a site to be loaded. This site is loaded to iframe and has a greater priority than the Index File.</td>
    </tr>
    <tr>
        <td>Index File</td>
        <td>A site file to be loaded. The Index File is loaded to iframe if its URL is empty.</td>
    </tr>
    <tr>
        <td>File List</td>
        <td>A list of files used in iframe source. </br>
			<table border='1'>
				<tr>
					<th>Property name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>File</td>
					<td>Enables adding the iframe site resources.</td>
				</tr>
				<tr>
					<td>ID</td>
					<td>A unique file id.</td>
				</tr>		
		</table>		
		</td>
    </tr>
    <tr>
        <td>Communication ID</td>
        <td>ID used to communicate between the addon and iframe (must be unique in a lesson).</td>
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
        <td>show</td>
        <td>---</td>
        <td>Shows the addon.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>---</td>
        <td>Hides the addon.</td>
    </tr>
</table>

## Events
The IFrame addon sends ValueChanged event when the state has been updated.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>


## API
In order to validate the communication, the site must send messages and scores with a strict structure. 

**1. IFrameScore structure**

<table border='1'>
<tbody>
    <tr>
        <th>Name</th>
		<th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>pageCount</td>
			<td>Page Count.</td>
        </tr>
        <tr>
            <td>checks</td>
			<td>Actual checks count.</td>
        </tr>
        <tr>
            <td>errors</td>
			<td>Actual errors count.</td>
        </tr>
        <tr>
            <td>mistakes</td>
			<td>Actual mistakes count.</td>
        </tr>
		<tr>
            <td>score</td>
			<td>Actual gained score.</td>
        </tr>
	    <tr>
            <td>maxScore</td>
			<td>Maximum score to gain.</td>
        </tr>
	    <tr>
            <td>scaledScore</td>
			<td>Score after scaling.</td>
        </tr>
    </tr>
</tbody>
</table> 

**1.1 IFrame score example**

	{
		pageCount: 3,
		checks: 5,
		errors: 1,
		mistakes: 4,
		score: 23,
		maxScore: 30,
		scaledScore: 23	
	}
	
**2. Message Structure**
<table border='1'>
<tbody>
    <tr>
        <th>Name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>id</td>
            <td>Communication ID.</td>
        </tr>
        <tr>
            <td>actionID</td>
            <td>Action name.</td>
        </tr>
        <tr>
            <td>params</td>
            <td>Send strict parameters by addon or iframe.</td>
        </tr>
    </tr>
</tbody>
</table> 

**2.1 Message without params**

	{
		id: someCommunicationID,
		actionID: "STATE_REQUEST",
		params: {}
	}
	
**2.2 Message with params**

	{
		id:  someCommunicationID,
		actionID:  "STATE_ACTUALIZATION",
		params: {
			iframeScore: exampleIFrameScore,
			iframeState: {
				imagePosition: 2
			}
		}
	}
	
**2.3 Action id list:**
<table border='1'>
<tbody>
    <tr>
        <th>Name</th>
		<th>Description</th>
    </tr>
	<tr>
		<tr>
			<td>SET_WORK_MODE</td>
			<td>Set work mode.</td>
		</tr>
		<tr>
			<td>SET_SHOW_ERRORS_MODE</td>
			<td>Show errors.</td>
		</tr>
		<tr>
			<td>RESET</td>
			<td>Reset.</td>
		</tr>
		<tr>
			<td>STATE_ACTUALIZATION</td>
			<td>State update with iframe score and iframe state.</td>
		</tr>
		<tr>
			<td>STATE_REQUEST</td>
			<td>Request for state.</td>
		</tr>
		<tr>
			<td>SHOW_ANSWERS</td>
			<td>Show answers.</td>
		</tr>
		<tr>
			<td>HIDE_ANSWERS</td>
			<td>Hide answers.</td>
		</tr>
		<tr>
			<td>FILE_DICTIONARY_REQUEST</td>
			<td>Request for file dictionary.</td>
		</tr>
		<tr>
			<td>FILE_DICTIONARY_ACTUALIZATION</td>
			<td>File dictionary update.</td>
		</tr>
	</tr>
</tbody>
</table> 	

**IFrame to Addon communication examples:**  
<table border='1'>
<tbody>
    <tr>
        <th>Action id</th>
        <th>Description</th>
		<th>Response action id</th>
    </tr>
    <tr>
        <tr>
            <td>STATE</br>_ACTUALIZATION</td>
            <td>Send the actual iframe state to the addon.</br>If iframeState is undefined, the addon updates only the iframeScore. 
						
</td>
			<td>No response</td>
        </tr>
        <tr>
            <td>STATE_REQUEST</td>
            <td>Request state from the addon.
	
</td>
			<td>STATE</br>_ACTUALIZATION</td>
        </tr>
        <tr>
            <td>FILE_DICTIONARY</br>_REQUEST</td>
            <td>Request file path dictionary from the addon.
	
</td>
		<td>FILE_DICTIONARY</br>_ACTUALIZATION</td>
        </tr>
    </tr>
</tbody>
</table>

**3.1 State actualization example:**
		
	{
		id: someCommunicationID,
		actionID: "STATE_ACTUALIZATION",
		params: {
			iframeScore: exampleIFrameScore,
			iframeState: imageIndex
		}
	}

**3.2 State request example:**

	{
		id: someCommunicationID,
		actionID: "STATE_REQUEST",
		params: {}
	}
	
**3.3 File dictionary request example:**

	{
		id: someCommunicationID,
		actionID: "FILE_DICTIONARY_REQUEST",
		params: {}
	}
	
**Addon to IFrame communication examples:**
<table border='1'>
<tbody>
    <tr>
        <th>Action id</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>STATE_ACTUALIZATION</td>
            <td>Send the actual state from the addon to iframe.</br>If the addon doesn't have the iframeState, the iframeState is undefined during update.
	
</td>
        <tr>
            <td>SET_WORK_MODE</td>
            <td>IFrame should start the work mode.
				
</td>
        </tr>
        <tr>
            <td>SET_SHOW_ERRORS_MODE</td>
            <td>IFrame should show all errors.
	
</td>
        </tr>
		<tr>
            <td>RESET</td>
            <td>IFrame should reset itself.	
</td>
        </tr>
		<tr>
            <td>SHOW_ANSWERS</td>
            <td>IFrame should show answers.
	
</td>
        </tr>
		<tr>
            <td>HIDE_ANSWERS</td>
            <td>IFrame should hide answers.
	
</td>
        </tr>
		<tr>
            <td>FILE_DICTIONARY_ACTUALIZATION</td>
            <td>Send actual paths dictionary with id (don’t use paths from the file list property!).</td>
        </tr>
		<tr>
            <td>CUSTOM_EVENT</td>
            <td>Send custom event to handle events from iframe in Advanced Connector.</td>
        </tr>
    </tr>
</tbody>
</table>

**4.1 State actualization example:**
		
	{
		id: someCommunicationID,
		actionID: "STATE_ACTUALIZATION",
		params: {
				iframeScore: exampleIFrameScore,
				iframeState: imageIndex	
				}
	}	
	
**4.2 Set work mode example:**
		
	{
		id: someCommunicationID,
		actionID: "SET_WORK_MODE",
		params: {}
	}

**4.3 Set show errors mode example:**
		
	{
		id: someCommunicationID,
		actionID: "SET_SHOW_ERRORS_MODE",
		params: {}
	}

**4.4 Reset example:**
		
	{
		id: someCommunicationID,
		actionID: "RESET",
		params: {}
	}		
	
**4.5 Show answers example:**
		
	{
		id: someCommunicationID,
		actionID: "SHOW_ANSWERS",
		params: {}
	}	
	
**4.6 Hide answers example:**
		
	{
		id: someCommunicationID,
		actionID: "HIDE_ANSWERS",
		params: {}
	}

**4.7 Dictionary example:**

	{
		id: someCommunicationID,
		actionID: "FILE_DICTIONARY_ACTUALIZATION",
		params: {
			fileDictionary: {
			"Ball : "/file/1234124/",
			"Car" : "/file/5311341/"
			}	
		}
	}

**4.7 Custom event example:**

	{
		id: someCommunicationID,
		actionID: "CUSTOM_EVENTS",
		params: "SOME_EVENT"
	}
	
AC code:

	EVENTSTART
	Value:SOME_EVENT
	Item:CUSTOM_EVENT
	SCRIPTSTART

	  code();

	SCRIPTEND
	EVENTEND
	
## Other Examples
**5.1 Start listening for messages:**

	window.addEventListener("message", function (event) {
		receiveMessageFunction(event);
	}, false);
	
**5.2 Send message function:**

	function getOpener () {
		var parent = null;
		if (window.parent != null && window.parent.postMessage != null) {
			parent = window.parent;
		}
		if (window.opener != null && window.opener.postMessage != null) {
			parent = window.opener;
		}
		return parent;
	}
	
	function sendMessage (messageID, actionID, params){
		var parent = getOpener();
		if (parent != null) {
			if(params == undefined) {
				params = {};
			}
			var newMessage = {id : messageID, actionID : actionID, params:params};
			parent.postMessage(newMessage,'*');
		}
	}	

## Demo presentation

[Demo presentation](/embed/5241468276441088 "Demo presentation") contains examples showing how this addon can be used.                  
[Example code](/file/serve/6383346199822336 "Example code") contains an example of index.html, resources and scripts presenting how the addon can be used (Please save as .zip file).         