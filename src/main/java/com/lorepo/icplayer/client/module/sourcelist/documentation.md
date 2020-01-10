## Description

Source list is closely related to Text and Multigap modules. It enables to insert a ready-made list of text items to be put into a draggable gap activity. The elements can also be filled in with mathematical or chemical formulas thanks to the LaTeX scripting language.

Each item in the source list can match more than one draggable gap and the already selected elements can either be removed from a source list, or can remain in the module.

Depending on the activity type, it is possible to place the items either vertically or horizontally.

Of course it is possible to alter the look of the individual items included in the source list. All elements can be the same or different size, depending on the CSS style used. 

## Properties

<table border='1'>
<tbody>
    <tr>
        <th>Property name</th>
        <th>Description</th> 
    </tr>
<tr>
        <td>Is visible</td>
        <td>This property allows to hide or show the module depending on the activity requirements.</td> 
    </tr>
    <tr>
        <td>Items</td>
        <td>This property serves for inserting text to be displayed in the module. Each item should be placed in a seperate line.</td> 
    </tr>
    <tr>
        <td>Removable</td>
        <td>
           This property indicates whether texts are to be removed from a source list after being inserted 
           into a text module.
        </td> 
    </tr>
<tr>
        <td>Vertical</td>
        <td>
          This property indicates whether the source list is in a vertical or horizontal position.
        </td> 
    </tr>
    <tr>
        <td>Random order</td>
        <td>
          This property indicates whether the source list items are to be displayed in random order.
        </td> 
    </tr>
    <tr>
        <td>Lang attribute</td>
        <td>This property allows to define the language for this addon (different than the language of the lesson).</td> 
    </tr>
    <tr>
        <td>Speech texts</td>
        <td>List of speech texts: Selected, Deselected. <br />
This texts will be read by Text to Speech addon after a user performs an action.</td> 
    </tr>
</tbody>
</table>


## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>reset</td>
        <td>---</td>
        <td>Reset a module.</td>
    </tr>
	<tr>
		<td>getText</td>
		<td>index – 1-based index of item in a module</td>
		<td>Returns item (text) with a given index. The order is based on the module configuration and does not change when 'Random order' option is selected.</td>
	</tr>
</table>


## Markup
It is possible to format all text items included in the source list by using simple markup language:

<table border='1'>
<tbody>
    <tr>
        <th>Syntax</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>**sample text**</td>
        <td>"sample text" will be written in bold.</td> 
    </tr>
    <tr>
        <td>__sample text__</td>
        <td>"sample text" will be written in italics.</td> 
    </tr>
</tbody>
</table>

##Events

The Source List addon sends ItemSelected type of events to Event Bus when a user selects an object.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of a selected object type.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is the file path.
        </td>
    </tr>
    <tr>
        <td>Item</td>
        <td>
           It's a name of a selected item.
        </td>
    </tr>
</table>

The Source List addon sends ItemConsumed type of events to Event Bus when a user consumes the object.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of a consumed object type.</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is the file path.
        </td>
    </tr>
    <tr>
        <td>Item</td>
        <td>
           It's a name of a consumed object.
        </td>
    </tr>
</table>

The Source List addon sends ItemReturned type of events to Event Bus when a user returns the object.

<table border='1'>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Type</td>
        <td>It's a string representation of a returned object type</td>
    </tr>
    <tr>
        <td>Value</td>
        <td>
           The Value is the file path.
        </td>
    </tr>
    <tr>
        <td>Item</td>
        <td>
           It's a name of a returned object.
        </td>
    </tr>
</table>


## CSS classes

<table border='1'>
<tbody>
    <tr>
        <th>Class name</th>
        <th>Description</th> 
    </tr>
    <tr>
        <td>ic_sourceListItem</td>
        <td>indicates the look of the items included in the source list</td> 
    </tr>
    <tr>
        <td>ic_sourceListItem-selected</td>
        <td>indicates the look of the item selected in the source list</td> 
    </tr>
</tbody>
</table>
    

### Examples

    .ic_sourceListItem {  
        background-color: #38c8d3;  
        border: 1px solid #38c8d3;  
        border-radius: 4px;  
        cursor: pointer;  
        display: inline;  
        margin-right: 10px;  
        padding: 4px;  
        text-align: center;  
        font-size: 16px;  
        color: #ffffff;  
        font-family: Verdana;  
        font-weight: bold;  
    }  


    .ic_sourceListItem-selected {  
        background-color: orange;  
        cursor: pointer;  
        border: 1px solid orange;  
    }      

## Keyboard navigation

* Tab – move between the elements
* Space - select a current element

## Demo presentation
[Demo presentation](/embed/5018312485371904 "Demo presentation") contains examples of the addon's usage.    