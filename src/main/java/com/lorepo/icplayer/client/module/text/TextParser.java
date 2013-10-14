package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;

public class TextParser {

	public class ParserResult{

		public String parsedText;
		public List<GapInfo>	gapInfos = new ArrayList<GapInfo>();
		public List<InlineChoiceInfo>	choiceInfos = new ArrayList<InlineChoiceInfo>();
		public List<LinkInfo>	linkInfos = new ArrayList<LinkInfo>();
	}
	
	/**
	 * Base id
	 * Na podstawie tego będą tworzone ID inputu i select poprzez dodanie "-1"
	 */
	private String baseId = "";
	private int idCounter = 1;
	private boolean useDraggableGaps = false;
	private boolean isCaseSensitive = false;
	private boolean isIgnorePunctuation = false;
	private boolean skipGaps = false;
	
	private HashMap<String, String>	variables = new HashMap<String, String>();
	private ParserResult parserResult;
	

	public void setUseDraggableGaps(boolean draggable){
		useDraggableGaps = draggable;
	}
	
	
	public void setCaseSensitiveGaps(boolean value){
		isCaseSensitive = value;
	}
	
	
	public void setIgnorePunctuationGaps(boolean value){
		isIgnorePunctuation = value;
	}
	
	
	public void addVariable(String key, String value) {
		variables.put(key, value);
	}
	
	
	public ParserResult parse(String srcText){
		
		parserResult = new ParserResult();

		try{
			srcText = srcText.replaceAll("\\s+", " ");
			if(!skipGaps){
				parserResult.parsedText = parseGaps(srcText);
				parserResult.parsedText = parseOldSyntax(parserResult.parsedText);
				parserResult.parsedText = parseLinks(parserResult.parsedText);
			}
			else{
				parserResult.parsedText = parseLinks(srcText);
			}
			parserResult.parsedText = parseDefinitions(parserResult.parsedText);
		}
		catch(Exception e){
			parserResult.parsedText = "#ERROR#";
		}
		
		return parserResult;
	}
	
	
	public void setId(String id) {
		baseId = id;
	}
	
	
	/**
	 * Parsowanie wyrażen w klamrach {{ }}
	 * @param srcText
	 * @return
	 */
	private String parseOldSyntax(String srcText){
	
		String input = srcText;
		String output = "";
		int index = -1;
		
		while((index = input.indexOf("{{")) >= 0){
			
			output += input.substring(0, index);
			if(!isInMath(input.substring(index))){
				input = input.substring(index+2);
				index = input.indexOf("}}");
				if(index < 0){
					return output + "{{" + input;
				}
				
				String expression = input.substring(0, index);
				input = input.substring(index+2);
	
				String replaceText = matchVariable(expression);
				if(replaceText == null){
					replaceText = matchInlineChoice(expression);
				}
				if(replaceText == null){
					if(useDraggableGaps){
						replaceText = matchDraggableGap(expression);
					}
					else{
						replaceText = matchGap(expression);
					}
				}
				if(replaceText == null){
					replaceText = "#ERR#";
				}
	
				output +=  replaceText;
			}
			else{
				output += "{{";
				input = input.substring(index+2);
			}
		}
		
		output += input;
		
		return output;
	}


	private boolean isInMath(String text) {
		int endIndex = text.indexOf("\\)");
		if(endIndex > 0){
			int startIndex = text.indexOf("\\(");
			return startIndex < 0 || startIndex > endIndex;
		}
		return false;
	}


	/**
	 * Replace expression with gap
	 * @param expression
	 * @return
	 */
	private String matchGap(String expression) {
	
		String replaceText = null;
		
		int index = expression.indexOf(":");
		if(index > 0){
			String value = expression.substring(0, index).trim();
			String answer = expression.substring(index+1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			replaceText = "<input id='" + id + "' type='edit' size='" + answer.length() + "' class='ic_gap'/>";
			GapInfo gi = new GapInfo(id, Integer.parseInt(value), isCaseSensitive, isIgnorePunctuation);
			String[] answers = answer.split("\\|");
			for(int i = 0; i < answers.length; i++){
				gi.addAnswer(answers[i]);
			}
			parserResult.gapInfos.add(gi);
		}
		
		return replaceText;
	}


	private String matchDraggableGap(String expression) {
	
		String replaceText = null;
		
		int index = expression.indexOf(":");
		if(index > 0){
			String value = expression.substring(0, index).trim();
			String answer = expression.substring(index+1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			replaceText = "<span id='" + id + "' class='ic_draggableGapEmpty'>&nbsp;</span>";
			GapInfo gi = new GapInfo(id, Integer.parseInt(value), isCaseSensitive, isIgnorePunctuation);
			String[] answers = answer.split("\\|");
			String answerToken = null;
			for(int i = 0; i < answers.length; i++){
				if(answerToken != null){
					answerToken += "|" + answers[i];
				}
				else{
					answerToken = answers[i];
				}
				if(answerToken.indexOf("\\(") < 0 || answerToken.indexOf("\\)") > 0){
					gi.addAnswer(answerToken);
					answerToken = null;
				}
			}
			if(answerToken != null){
				gi.addAnswer(answerToken);
			}
			parserResult.gapInfos.add(gi);
		}
		
		return replaceText;
	}


	/**
	 * Replace expression with inline choice
	 * @param expression
	 * @return
	 */
	private String matchInlineChoice(String expression) {

		String replaceText = null;
		
		int index = expression.indexOf(":");
		if(index > 0){
			String value = expression.substring(0, index).trim();
			String answerValues = StringUtils.removeNewlines(expression.substring(index+1));
			String[] answers = answerValues.split("\\|");
			if(answers.length > 1){
				
				String id = baseId + "-" + idCounter;
				idCounter++;
				String answer = StringUtils.unescapeXML(answers[0].trim());
				InlineChoiceInfo info = new InlineChoiceInfo(id, answer, Integer.parseInt(value) );
				parserResult.choiceInfos.add(info);
				replaceText = "<select id='" + id + "' class='ic_inlineChoice'>";
				replaceText += "<option value='-'>---</option>";
				for(int i=0; i < answers.length; i++){
					info.addDistractor(answers[i].trim());
				}
				Iterator<String> distractors = info.getDistractors();
				while(distractors.hasNext()){
					String dist = distractors.next();
					String itemValue = StringUtils.escapeXML(dist);
					replaceText += "<option value='" + itemValue + "'>" + dist + "</option>";
				}
				replaceText += "</select>";
			}
		}
		
		return replaceText;
	}


	/**
	 * Try to match variable
	 * @param subSequence
	 * @return null if no match found
	 */
	private String matchVariable(String key) {
		
		return variables.get(key);
	}

	
	private String parseLinks(String srcText){

		final String pattern = "\\[\\[[^\\]]+\\]\\]";
		RegExp gapRegExp = RegExp.compile(pattern);
		MatchResult matchResult;
		String replaceText;
		
		String parsedText = srcText;

		while( (matchResult = gapRegExp.exec(parsedText)) != null){
			
			if(matchResult.getGroupCount() > 0){
				
				String group = matchResult.getGroup(0);
				String expression = group.substring(2, group.length()-2);
				
				replaceText = link2Anchor(expression, LinkType.PAGE);

				if(replaceText == null){
					replaceText = "#ERR#";
				}

				parsedText = parsedText.replaceFirst(pattern, replaceText);
			}
			else{
				break;
			}
		}
		
		return parsedText;
	}
	
	
	private String parseGaps(String srcText){
		
		String input = srcText;
		String output = "";
		int index = -1;
		String replaceText;
		
		
		while((index = input.indexOf("\\gap{")) >= 0){
			
			output += input.substring(0, index);
			input = input.substring(index+5);
			index = findClosingBracket(input);
			if(index < 0){
				return output + "\\gap{" + input;
			}
			
			String expression = "1:" + input.substring(0, index);
			input = input.substring(index+1);

			if(useDraggableGaps){
				replaceText = matchDraggableGap(expression);
			}
			else{
				replaceText = matchGap(expression);
			}			
			
			if(replaceText == null){
				replaceText = "#ERR#";
			}

			output +=  replaceText;
		}
		
		output += input;
		
		return output;
	}

	
	private int findClosingBracket(String input) {

		int counter = 0;
		
		for(int index = 0; index < input.length(); index++){
			
			if(input.charAt(index) == '{'){
				counter++;
			}
			else if(input.charAt(index) == '}'){
				counter--;
				if(counter < 0){
					return index;
				}
			}
		}
		
		return -1;
	}


	/**
	 * Replace link with anchor
	 * @param expression
	 * @return
	 */
	private String link2Anchor(String expression, LinkType type) {
	
		String replaceText = null;
		
		int index = expression.indexOf("|");
		if(index > 0){
			String pageName = expression.substring(0, index);
			pageName = StringUtils.removeAllFormatting(pageName);
			pageName = StringUtils.unescapeXML(pageName);
			String linkText = expression.substring(index+1).trim();
			String id = baseId + "-" + UUID.uuid(4);	
			replaceText = "<a id='" + id + "' class='ic_definitionLink' href='#'>" + linkText + "</a>";
			LinkInfo pli = new LinkInfo(id, type, pageName );
			parserResult.linkInfos.add(pli);
		}
		
		return replaceText;
	}


	private String parseDefinitions(String srcText){

		final String pattern = "\\\\def\\{[^}]+\\}";
		RegExp regExp = RegExp.compile(pattern);
		MatchResult matchResult;
		String replaceText;
		
		String input = srcText;
		String output = "";

		while( (matchResult = regExp.exec(input)) != null){
			
			if(matchResult.getGroupCount() > 0){

				String group = matchResult.getGroup(0);
				output += input.substring(0, matchResult.getIndex());
				input = input.substring(matchResult.getIndex()+group.length());
				String expression = group.substring(5, group.length()-1);
				
				if(expression.indexOf("|") > 0){
					replaceText = link2Anchor(expression, LinkType.DEFINITION);
				}
				else{
					replaceText = link2Anchor(expression + "|" + expression, LinkType.DEFINITION);
				}

				if(replaceText == null){
					replaceText = "#ERR#";
				}
				
				output += replaceText;
			}
			else{
				break;
			}
		}
		
		output += input;
		return output;
	}


	public void skipGaps() {
		skipGaps = true;
	}

	
}
