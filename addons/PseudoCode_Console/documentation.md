## Description
Pseudocode console allows executing pseudocode and defining correct output for checking answers.

You can select code from Programming Command Prompt or by calling executeCode from JS.
## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Functions list</td>
        <td>A list of functions' definitions for the user. The user can use these functions in his/her code.</br>
			<table border='1'>
				<tr>
					<th>Property name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Name</td>
					<td>Function name. The user can call a function by this name.</td>
				</tr>
				<tr>
					<td>Body</td>
					<td>The JavaScript code which will be executed while calling this function. The variable "arguments" contains all arguments passed to the function. Arguments are passed as an array of objects (see <a href="#point1.2">1.2</a> for variable object structure). All functions have the "builtIn" variable (see <a href="#builtIn">built in variable</a> structure for more information) while executing the code. The function <a href="#returnValue">returns value</a> by the "builtIn" variable and must be a valid variable object structure (see <a href="#point1.2">1.2</a> for variable object structure).</td>
				</tr>					
		</table>		
</td>
    </tr>	
	<tr>
        <td>Methods list</td>
        <td>A list of methods for each object defined in a pseudocode console.</br>
			<table border='1'>
				<tr>
					<th>Property name</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>Object Name</td>
					<td>The name of the object for which this method will be defined.</td>
				</tr>
				<tr>
					<td>Method Name</td>
					<td>A user can call the method by this name.</td>
				</tr>	
				<tr>
					<td>Method Body</td>
					<td>The JavaScript code which will be executed while calling this method. The variable "arguments" contains all arguments passed to the method. "This" variable contains information about an actual object. Arguments are passed as an array of objects (see <a href="#point1.2">1.2</a> for variable object structure). All methods have the "builtIn" variable (see <a href="#builtIn">"built in" variable</a> structure for more information) while executing the code. The method <a href="#returnValue">returns value</a> by the "builtIn" variable and must be a valid variable object structure (see <a href="#point1.2">1.2</a> for variable object structure).</td>
				</tr>					
		</table>		
</td>
    </tr>
	<tr>
        <td>Default aliases</td>
        <td>Change or translate a built-in instruction name.</td>
    </tr>
	<tr>
        <td>Exceptions Translations</td>
        <td>Change or translate built-in exceptions.</td>
    </tr>
    <tr>
        <td>Is not activity</td>
        <td>Disable scoring for a module.</td>
    </tr>
    <tr>
        <td>Run user code</td>
        <td>Run the last received code and pass the input defined in the "run parameters" property for the running code. If this property is deselected, then the last entered input will be passed for the running code.</td>
    </tr>
    <tr>
        <td>Max time for answer</td>
        <td>Maximum time (in seconds) for executing the user's code which was run while checking answers. If "run user code" property is selected, then this property is required. While checking answers, the lesson will be frozen.</td>
    </tr>
	<tr>
		<td>Run Parameters</td>
		<td>A list of parameters which will be passed to the console while running a user code.</td>
	</tr>	
    <tr>
        <td>Answer code</td>
        <td>Java Script code which will be run after executing a user code, if "run user code" property is selected. If not, it will be executed instantly while checking answers. As actual scope answer code will receive "builtIn" variable with saved data.(see <a href="#point1.1">1.1</a> for built in statistics and <a href="#point2.1">2.1</a> for examples). Code defined in Answer Code property should return true if a user code works properly or false.</td>
    </tr>
	<tr>
		<td>Available Console Input</td>
		<td>Available input in console which can be inserted by the user.</td>
	</tr>
	<tr>
		<td>Math Precision</td>
		<td>Number of decimal places for math calculations.</td>
	</tr>
</table>

## Language syntax
The language is similar to Pascal. All variable definitions are extracted to a separated variable block and a user can't define any new variable in a code.

 *  **variable block** block which contains all variable definitions for a function. Variables should be separated by a comma. Variable block is always optional. If variable block exists, then this block must be in a separate line.
		
		
		variable <variable_name1>, <variable_name2>=<variable_start_value>, ..., <variable_nameN>

 Examples:
 
 
		function testFunction ()
		variable a,b
		begin
<br />

		
		program testProgram
		variable a,b = 2
		begin
		
 *  **array block** block which contains all arrays' definitions extracted to a separated block. A user cannot define a new array variable in the code. 
 
		array <variable_name_1>[<size_as_number_1>], <variable_name_2>[<size_as_number_2], ..., <variable_name_n>[<size_as_number_n]
		
 or

		array <variable_name_1>[<size_as_number_1>] = [<value_1>, <value_2>]
		
	* Arrays are counted from 0.
		
 Examples:
 
		program A
		array a[2], b[3], c[20]
		begin

		end
<br />

		program A
		array a[2] = [1, 2]
		begin

		end

 *  **get array element**
		
		<array_variable>[<index_as_number>]
		
 *  **Math** and **logic** operations are available:

		>: greater
		>=: greater or equal
		<: less
		<=: less or equal
		==: equal
		!=: different
		or: logical or
		and: logical and
		( ): brackets for operations order
		+: addition
		-: substraction
		/: division
		/_: division without rest
		*: multiplication
		%: modulo
	
	
		
 *  **string** starts with " and ends with ". In string " can be escaped by \" characters.
 
 Examples:
 
		"This is \" still string"
 
 *  **instruction** each line can contain only one instruction call expected instructions calls as a call argument.
 
		<instruction_name>(<argument1 or function call>, <argument2 or function call>, ..., <argumentN or function call>)
	* Instruction name must match with [A-Za-z_][a-zA-Z0-9_]* regexp.

 *  **code block** block which contains code instructions.
 
		

		begin
			<code>
		end
	* Begin and end instructions always must be in separate lines.
		
		
 Examples:
 
 
		begin
			instructionA()
		end
 
 *  **main function** is function which will be called first.
 
 
		program <program_name>
		begin
			<code>
		end
	* Each program must have one and only one main function. 
	* Program name definition must be in separate line.
 
 
 Examples:
 
 
		program programName
		begin
		
		end
<br />

		program programName
		variable a,be
		begin
		
		end
		
 *  **function** can be defined by user in pseudocode.
 
 
		function <function_name> (<argument1>, <argument2>, ..., <argumentN>)
		begin
			<code>
			
			return <data>
		end
	* Function header definition must be in a separate line.
	* Return statement is optional. If function doesn't contain return, then at default it will return 0. Return statement must be in a separate line.
	* Defined functions must be at the beginning of the code.
	* An instruction name must match to [A-Za-z_][a-zA-Z0-9_]* regexp.


 Examples:
 
		function test ()
		variable a, b
		begin
			a = someCode()
		end
<br />

		function test2(a, b, c)
		begin
			b = anotherFunction()
			return b
		end
		
 *  **if** statement executes code when expression will return true.
 
 
		if <expression> then
			<instruction_call or code_block>
or

		if <expression> then
			<instruction_call or code_block>
		else
			<instruction_call or code_block>
	* "If" instruction definition header must be in a separate line. 
	* "Else" instruction is optional and must be in a separate line.

 Examples:
 
 
		if a == 2 then
		begin
			a = a + 2
			myFunction(a)
		end
<br />


		if a == 2 then
			myFunction(a)
		else
		begin
			a = a + 1
			myFunction(a)
		end
<br />

		if a == 2 then
			return 2
		else
			return 1
			

 * **case** allows improving code clarity by changing multiple "if" statements to one case statement. The program will enter to the option code if a variable value is equal to an option value.


		case <variable_name>
			option <number_or_string>, ... , <number_or_string> then
				<instruction_call or code_block>
			option <number_or_string>, ... , <number_or_string> then
				<instruction_call or code_block>
				
			...
			
			option <number_or_string>, ... , <number_or_string> then
				<instruction_call or code_block>
	* "Case" instruction definition header and "option" instruction definition header must be in separate lines.
	* "Case" option value can be a string or a number.
	
 Examples:


		case someVariable
			option 1 then 
			begin
				print ("Block")
				print ("Is cool")
			end
			option 2,4 then 
				print("2")
			option "3" then 
				print("3 as text")
				
 * **for** allows iterating in the range of &lt;from_number_or_variable; to_number_or_variable&gt;.
 
 
		for <variable_name> from <number_or_variable> to <number_or_variable> do
			<instruction_call or code_block>
			
		for <variable_name> from <number_or_variable> to <number_or_variable> by <number> do
			<instruction_call or code_block>
			
		for <variable_name> from <number_or_variable> downto <number_or_variable> do
			<instruction_call or code_block>
			
		for <variable_name> from <number_or_variable> downto <number_or_variable> by <number> do
			<instruction_call or code_block>
			
	* "For" instruction header must be in a separate line.
	* "To" can be value or variable.
	* "for" with "downto" statement will decrement counter.
	* "for" without "by" statement will increment/decrement by 1.
	
 Examples:

		for myVariable from 1 to 40 by 4 do
		begin
			print("myVariable\n")
		end

 * **while** loop allows executing the same code while expression returns true.
 
 
		while <expression> do
			<instruction_call or code_block>
	* While header definition must be in a separate line.
	* Expression will be checked before executing code.
	
 Examples:
			
			
		while a <= 5 do
		begin
			print(a)
			a = a + 1
		end
		
 * **do while** works similar to while instruction. Main difference is when the expression is checked. 
 
 
		do
			<instruction_call or code_block>
		while (<expression>)
	* In do while loop, expression will be checked after executing a code so the code will be always called.
	
 Examples:
	
	
		do
		    write("OK")
		while(1 == 2)
		
 * **method call**

		<object_name>.<method_name>(<argument1>, <argument2>, ..., <argumentn>)
 
 Examples:
		
		
		myArray.extend(2)
<br />


## Console

Functions defined in Functions list property contains in ```builtIn.console``` console object. This console gives the possibility of reading input from console and writing to console. Example access to console is ```builtIn.console.Write("text");```.


Console functions:

 * **Write**(text)
 * **ReadLine**(callback), where callback will receive text as first argument
 * **ReadChar**(callback), where callback will receive text as first argument
 
## Ready console wrappers for Functions List property

 * **print**
 
		builtIn.console.Write(arguments[0].value);
Usage in user code: ```print("Text")```

 * **read**
 
		var receivedValue = arguments[0];
		builtIn.console.ReadLine(function (value) {
			builtIn.retVal.value = builtIn.objects.String.__constructor__(value);
		});		
Usage in user code: ```variableToRead = read()```

 * **readChar**
 
		var receivedValue = arguments[0];
		builtIn.console.ReadChar(function (value) {
			builtIn.retVal.value = builtIn.objects.String.__constructor__(value);
		});
Usage in user code: ```variableToRead = readChar()```
		
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
        <td>stop</td>
        <td>---</td>
        <td>Stops executing user code.</td>
    </tr> 
    <tr>
        <td>executeCode</td>
        <td>code</td>
        <td>Executes passed code.</td>
    </tr> 
</table>

## Events
The Pseudocode Console addon sends ValueChanged event when the score has been calculated.
<table border='1'>
<tbody>
    <tr>
        <th>Field name</th>
        <th>Description</th>
    </tr>
    <tr>
        <tr>
            <td>Item</td>
            <td>all</td>
        </tr>
        <tr>
            <td>Value</td>
            <td>N/A</td>
        </tr>
        <tr>
            <td>Score</td>
            <td>New score</td>
        </tr>
    </tr>
</tbody>
</table>

## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>addon-PseudoCode_Console-wrapper</td>
        <td>Main DIV element surrounding console.</td>
    </tr>
    <tr>
        <td>pseudoConsole-console-right-element</td>
        <td>Text container on the right side of a cursor.</td>
    </tr>
    <tr>
        <td>pseudoConsole-console-left-element</td>
        <td>Text container on the left side of a cursor.</td>
    </tr>
	<tr>
		<td>pseudoConsole-console-cursor-active</td>
		<td>An active cursor element.</td>
	</tr>
	<tr>
		<td>pseudoConsole-console-cursor</td>
		<td>Cursor element.</td>
	</tr>
	<tr>
		<td>pseudoConsole-console-container</td>
		<td>DIV element surrounding all lines.</td>
	</tr>
</table>

## <a name="point1.1"></a>**1.1** Answer scope and "builtIn" variable in functions defined in Functions list property
Answer scope and variable "builtIn" in functions defined in Functions list property are the same. So, saving data in function like: ```builtIn.data.wroteValue = arguments[0]``` will be visible in answer (for example: ```this.wroteValue === 'ok'```).

Answer scope contains additional property ```calledInstructions``` where addon automatically will count how many times instruction was called. This object contains fields:


		for: <called_count>,
		while: <called_count>,
		doWhile: <called_count>,
		if: <called_count>,
		case: <called_count>
Each field of ```calledInstructions``` will be incremented when built-in instruction will be called in user code. For example, after executing this code:

		program test
		variable a
		begin
			a = 2
			if a == 2 then
				write("ok")
		end
then in answer code ```this.calledInstructions.if``` will equal to 1.

For loops ```calledInstructions``` will contain how many times loop executes code. For example after executing this code in answer:

		program test
		variable a
		begin
			for a from 1 to 4 do
				write(a)
		end
then in answer code ```this.calledInstructions.for``` will contain 4.
## <a name="point1.2"></a>**1.2** Variable object
Each variable in language is a JS object. 


		{
			value: <value>
			type: "<type>"
			methods: used by language
			parent: used by language
		}

Creating new variables should be done by ```builtIn.objects``` object which contains all builtIn objects. For creating a new variable ```__constructor__``` function must be called (for example ```builtIn.objects.Number.__constructor__(2)```)

Built in types:

 * Object```.__constructor__()```
 * Number```.__constructor__(<Optionally start value, if not defined then will receive 0>)```
 * String```.__constructor__(<Optionally start value, if not defined then will reveive "">)```
 * Boolean```.__constructor__(<Optionally start value, if not defined then will receive false>)```
 * Array```.__constructor__(<Required count as number;>, <Optionally start values as array of valid pseudocode console objects. At default array will be empty (null objects)>)```

There is no way to convert one type to second, so while receiving value from a user, checking type should be added manually. 

*Warning*:

To functions defined in the Functions list or methods defined in Methods list property argument is passed as reference, so while changing argument value, the original value will be changed too. In
```arguments[0].value = 2;```
 new value of first argument will be visible in user code, but
```arguments[0] = {value: 2};``` wont be visible in user code.
<br/>

To functions defined by user arguments will be passed as copy.

## **1.3** <a name="builtIn"></a> builtIn object:

```builtIn``` object is available in any function defined in Functions list property and in any method defined in Methods list property.
The same ```builtIn``` object is provided for each function or method, so if builtIn object was changed while executing function ```a``` then while executing function ```b``` this object will contain changed values.

```builtIn``` object fields:

 * *console* object which contains access to user console.
 * *data* object, which is initially empty. In this object data to be checked while checking answer should be saved. Saving data in data object must be done manualy in functions defined in Functions list property or in methods defined in Methods list property.
 * *retVal* object which contains returned value by function defined in Functions list property or method defined in Methods list property. Saved value to return should be set in ```value``` field in ```builtIn.retVal``` object.
 * *objects* reference to constructors of built in objects. 

## **1.4** <a name="returnValue"></a> Return value:

Returns value from function or method that is provided as reference in ```builtIn.retVal``` object. To return value, ```value``` field in ```buildIn.retVal``` must contain correct object. For example:

		builtIn.retVal.value = builtIn.objects.String.__constructor__("'" + this.value + "'");

		
If function returns value, then the type of this object must be the one of the built-in types.



## **2.1** Answer example
For addon with activated run user code and Run parameters: 227 and 9956, defined functions in Functions list:

 * **write**
 
		builtIn.console.Write(arguments[0].value);

 * **read**
 
		builtIn.console.ReadLine(function (value) {
		  if (/^\d+(.\d+)?$/.test(value)) {
			builtIn.retVal.value = builtIn.objects.Number.__constructor__(value);
		  } else {
			builtIn.retVal.value = builtIn.objects.String.__constructor__(value);
		  }
		});

 * **printSum** (here is saving answer in scope)
 
		var answer = arguments[0];
		builtIn.data.answer = answer.value;

		builtIn.console.Write(answer.value + '');

and defined exercise as: "Write the sum of two numbers with the 'printSum' function".

For checking the correct answer, the valid code would be:

		if (this.data.answer == 10183) {
		  return true;
		}

		return false;
In this code we can check how many times built-in function was called with ```this.calledInstructions``` object.

## Demo presentation

[Demo presentation](/present/5023646725439488 "Demo presentation") contains examples showing how this addon can be used.                                 