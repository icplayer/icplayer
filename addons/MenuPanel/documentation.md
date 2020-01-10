## Description

This module allows users to create multiple double state buttons that can be organized in a hierarchical structure.

## Properties
<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Menu Items List</td>
        <td><b>Id</b> – Unique name identifying this particular button element. Used in events and commands.<br>
<b>Title (optional)</b> – Text that is to be displayed inside the button.<br>
<b>Parent Id (optional)</b> – Id of the parent element. If provided, this button will not be displayed by default, unless the parent element has the "Is Expanded" property enabled.
<b>Is Expanded</b> – After selecting this property, elements that are relative to this element will be shown by default.<br>
<b>Is Selected</b> – Determines whether this button should be selected by default.<br>
<b>Is Disabled</b> – Determines whether this button should be disabled by default.
</td>
    </tr>
    <tr>
        <td>Horizontal Alignment </td>
        <td>This property is used to select the initial horizontal position of the module.</td>
    </tr>
    <tr>
        <td>Auto Expand</td>
        <td>After selecting this property, the module will automatically expand and contract elements upon clicking to provide access to all available elements.</td>
    </tr>
    <tr>
        <td>Disable</td>
        <td>This option disables the whole module – all buttons will be disabled and no events will be sent.</td>
    </tr>
</table>

<div style="border:1px solid Tomato; padding:5px; margin-bottom:21px;">
Note: "Id" and "Parent Id" values can contain only alphanumerical characters with no spaces allowed.
</div>

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
<tr>
        <td>disable</td>
        <td>item (optional)</td>
        <td>Disables a particular item if provided, otherwise disables the whole module.</td> 
    </tr>
    <tr>
        <td>enable</td>
        <td>item (optional)</td>
        <td>Enables a particular item if provided, otherwise enables the whole module (in this case, the element that was disabled before, will not be enabled)</td> 
    </tr>
<tr>
        <td>select</td>
        <td>item</td>
        <td>Mark item as selected.</td> 
    </tr>
    <tr>
        <td>deselect</td>
        <td>item</td>
        <td>Mark item as deselected.</td> 
    </tr>
<tr>
        <td>setAlignment</td>
        <td>horizontal,vertical</td>
        <td>Places the module next to a page border. Available parameters for "horizontal" are: "left", "center" and "right", for "vertical": "top", "center" and "bottom".</td> 
    </tr>
    <tr>
        <td>expand</td>
        <td>item</td>
        <td>Use this command to display children elements of the selected item (if there are any).</td> 
    </tr>
<tr>
        <td>contract</td>
        <td>item</td>
        <td>Use this command to hide children elements of the selected item (if there are any).</td> 
    </tr>
    <tr>
        <td>toggleExpand</td>
        <td>item</td>
        <td>If this element has children elements and they are expanded, they will be contracted. If they are contracted, you will expand them. </td> 
    </tr>
</table>

## Advanced Connector integration

Example Advanced Connector code:

    EVENTSTART
    Name:PageLoaded
    SCRIPTSTART
        presenter.playerController.getModule('MenuPanel1').expand(‘1a’);
    SCRIPTEND
    EVENTEND

    EVENTSTART
    Source:MenuPanel1
    SCRIPTSTART
    if(event.value == '1'){
      presenter.playerController.getModule('MenuPanel1').expand(event.item);
    }else{
      presenter.playerController.getModule('MenuPanel1').contract(event.item);
    }
    SCRIPTEND
    EVENTEND

## Events
Menu Panel sends ValueChanged type events to Event Bus when either user selects or deselects it’s elements.

<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>Id of the clicked element.</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>1 for selection, 0 for deselection</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>N/A</td>
        </tr>
    </tr>
</tbody>
</table>

## CSS Classes
<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>menu-panel-wrapper</td>
        <td>DIV surrounding all other elements.</td>
    </tr>
    <tr>
        <td>menu-panel-item</td>
        <td>Basic element class</td>
    </tr>
    <tr>
        <td>menu-panel-item<br> selected/disabled</td>
        <td>menu-panel-item element gets also a "selected" class when selected and analogically for disabled</td>
    </tr>
    <tr>
        <td>children</td>
        <td>DIV containing menu-panel-item elements that are children to an element above</td>
    </tr>
</table>

## Sample presentation styles

    .MenuPanel_dev_Example{
    }

    .MenuPanel_dev_Example .menu-panel-wrapper{
    background: #e3e2df;
    }

    .MenuPanel_dev_Example .disabled{
 	opacity: 0.5;
  	cursor: default;
    }

    .MenuPanel_dev_Example .menu-panel-item{
  	display: inline-block;
 	border: 2px solid #c4d2c5;
  	border-radius: 10px;
  	background: #deddcd;
  	background-size: 288px 48px;
  	margin: 10px 10px 0px 10px;
  	width: 80px;
 	height: 20px;
  	padding: 8px;
    }

    .MenuPanel_dev_Example .menu-panel-item:hover{
  	border: 2px solid #abd2ae;
    }

    .MenuPanel_dev_Example .menu-panel-item.selected{
 	border: 2px solid #7fd285;
    }

    .MenuPanel_dev_Example .menu-panel-item img{
 	position: absolute;
  	width: 20px;
  	height: 20px;
  	right: 20px;
    }

    .MenuPanel_dev_Example .children{
 	position: absolute;
  	background: #e8edf1;
  	width: 100px;
  	padding: 0 10px 10px 10px;
  	margin-top: -50px;
      -webkit-box-shadow: 0px 2px 6px 0px rgba(50, 50, 50, 0.75);
      -moz-box-shadow:    0px 2px 6px 0px rgba(50, 50, 50, 0.75);
       box-shadow:           0px 2px 6px 0px rgba(50, 50, 50, 0.75);
    }

    .MenuPanel_dev_Example .menu-panel-wrapper.horizontal-left .children{
  	left: 70px;
    }

    .MenuPanel_dev_Example .menu-panel-wrapper.horizontal-right .children{
  	left: auto;
  	right: 68px;
    }

    .MenuPanel_dev_Example .children .menu-panel-item{
 	margin: 10px 0px 0px 0px;
    }

## Demo presentation
[Demo presentation](/embed/5339938271789056 "Demo presentation") contains examples of how to use the Menu Panel addon.                              