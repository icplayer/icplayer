package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.google.gwt.dom.client.Element;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;
import com.lorepo.icplayer.client.utils.DomElementManipulator;


public class TextParser {

	public class ParserResult {
		public String parsedText;
		public String originalText;
		public List<GapInfo> gapInfos = new ArrayList<GapInfo>();
		public List<InlineChoiceInfo> choiceInfos = new ArrayList<InlineChoiceInfo>();
		public List<LinkInfo> linkInfos = new ArrayList<LinkInfo>();
	}

	private String baseId = "";
	private int idCounter = 1;
	private boolean useDraggableGaps = false;
	private boolean useMathGaps = false;
	private boolean openLinksinNewTab = true;
	private boolean isCaseSensitive = false;
	private boolean isIgnorePunctuation = false;
	private boolean isKeepOriginalOrder = false;
	private boolean skipGaps = false;
	private int gapWidth = 0;
	private int gapMaxLength = 0;
	private boolean editorMode = false;
	private boolean useEscapeCharacterInGap = false;
	private List<String> gapsOrder;

	private HashMap<String, String> variables = new HashMap<String, String>();
	private ParserResult parserResult;

	public void setUseDraggableGaps(boolean draggable) {
		useDraggableGaps = draggable;
	}
	
	public void setUseMathGaps(boolean value) {
		useMathGaps = value;
	}

	public void setCaseSensitiveGaps(boolean value) {
		isCaseSensitive = value;
	}

	public void setIgnorePunctuationGaps(boolean value) {
		isIgnorePunctuation = value;
	}
	
	public void setKeepOriginalOrder(boolean value) {
		isKeepOriginalOrder = value;
	}

	public void addVariable(String key, String value) {
		variables.put(key, value);
	}
	
	public void setOpenLinksinNewTab(boolean linksTarget) {
		openLinksinNewTab = linksTarget;
	}

	// parse srcText for editor in HTMLWidget as rendered view
	public ParserResult parse(String srcText, boolean editorMode) {
		this.editorMode = editorMode;
		
		return parse(srcText);
	}
	
	private List<String> calculateGapsOrder (String text) {
		String rawText = getRawTextSource(text);
		ArrayList<String> result = new ArrayList<String>();
		
		for (int i=0; i<rawText.length(); i++) {
			String currentChar = Character.toString((char) rawText.charAt(i));
			String nextChar = i+1 < rawText.length() ? Character.toString((char) rawText.charAt(i+1)) : "_";
			String lastChar = i+2 < rawText.length() ? Character.toString((char) rawText.charAt(i+2)) : "_";
			
			if (currentChar == "#" && lastChar == "#") {
				if (nextChar == "1") {
					result.add("gap");
				}
				
				if (nextChar == "2") {
					result.add("dropdown");
				}
				
				if (nextChar == "3") {
					result.add("math");
				}
				
				if (nextChar == "4") {
					result.add("gap");
				}
			}
		}
		
		return result;
	}
	
	public String getRawTextSource (String text) {
		final String availableCharsInGapContent = "[^\\}]+";
		
		return text
			.replaceAll("\\<.*?>", "").replaceAll("&nbsp;", "")
			.replaceAll("\\\\gap\\{" + availableCharsInGapContent + "\\}", "#1#")
			.replaceAll("\\{\\{" + availableCharsInGapContent + "\\}\\}", "#2#")
			.replaceAll("\\\\(" + availableCharsInGapContent + "\\\\)", "#3#")
			.replaceAll("\\\\filledGap\\{" + availableCharsInGapContent + "\\}", "#4#");
	}
	
	public ParserResult parse (String srcText) {
		this.gapsOrder = calculateGapsOrder(srcText);

		parserResult = new ParserResult();
		parserResult.originalText = srcText;
		srcText = srcText.replaceAll("\\s+", " ");

		try {
			if (this.editorMode) {
				parserResult = this.parseInEditorMode(srcText);
				return parserResult;
			} else {
				if (!skipGaps) {
					parserResult.parsedText = parseGaps(srcText);
					if (!useMathGaps) {
						parserResult.parsedText = escapeAltText(parserResult.parsedText);
						parserResult.parsedText = parseOldSyntax(parserResult.parsedText);
						parserResult.parsedText = unescapeAltText(parserResult.parsedText);
					}
					parserResult.parsedText = parseExternalLinks(parserResult.parsedText);
					parserResult.parsedText = parseLinks(parserResult.parsedText);
				} else {
					parserResult.parsedText = parseExternalLinks(srcText);
					parserResult.parsedText = parseLinks(parserResult.parsedText);
				}
				parserResult.parsedText = parseAltText(parserResult.parsedText);
				parserResult.parsedText = parseDefinitions(parserResult.parsedText);
			}
		} catch (Exception e) {
			parserResult.parsedText = "#ERROR#";
		}

		return parserResult;
	}
	
	private ParserResult parseInEditorMode(String srcText) {
		ParserResult result = new ParserResult();
		
		result.parsedText = parseGaps(srcText);
		result.parsedText = parseOldSyntax(result.parsedText);
		
		result.parsedText = parseDefinitions(result.parsedText);
		return result;
	}

	public void setId(String id) {
		baseId = id;
	}

	/**
	 * Parsowanie wyrażen w klamrach {{ }}
	 * 
	 * @param srcText
	 * @return
	 */
	private String parseOldSyntax(String srcText) {

		String input = srcText;
		String output = "";
		int index = -1;

		while ((index = input.indexOf("{{")) >= 0) {

			output += input.substring(0, index);
			if (!isInMath(input.substring(index))) {
				input = input.substring(index + 2);
				index = input.indexOf("}}");
				if (index < 0) {
					return output + "{{" + input;
				}

				String expression = input.substring(0, index);
				input = input.substring(index + 2);

				String replaceText = matchVariable(expression);
				if (replaceText == null) {
					if (isKeepOriginalOrder) {
						replaceText = matchInLineChoiceKeepOrder(expression);
					} else {
						replaceText = matchInlineChoice(expression);
					}
				}
				if (replaceText == null) {
					if (useDraggableGaps) {
						replaceText = matchDraggableGap(expression, null);
					} else {
						replaceText = matchGap(expression);
					}
				}
				if (replaceText == null) {
					replaceText = "#ERR#";
				}

				output += replaceText;
			} else {
				output += "{{";
				input = input.substring(index + 2);
			}
		}

		output += input;

		return output;
	}

	public static boolean isInMath(String text) {
		int endIndex = text.indexOf("\\)");
		if (endIndex > 0) {
			int startIndex = text.indexOf("\\(");
			return startIndex <= 0 && startIndex < endIndex;
		}
		return false;
	}

	/**
	 * Replace expression with gap
	 * 
	 * @param expression
	 * @return
	 */
	private String matchGap(String expression) {
		return matchGap(expression, null);
	};
	
	private String matchGap(String expression, Map<String,String> gapOptions) {
		String langTag = gapOptions!=null && gapOptions.containsKey("lang") ? gapOptions.get("lang") : "";
		int index = expression.indexOf(":");
		String replaceText = null;
		
		if (index > 0) {
			String value = expression.substring(0, index).trim();
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			DomElementManipulator inputElement = this.createGapInputElement(id, answer, gapOptions);
			
			replaceText = inputElement.getHTMLCode();
			GapInfo gi = new GapInfo(id, Integer.parseInt(value), isCaseSensitive, isIgnorePunctuation, gapMaxLength, langTag);
			String[] answers = answer.split("\\|");
			for (int i = 0; i < answers.length; i++) {
				gi.addAnswer(answers[i]);
			}
			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}
	
	private DomElementManipulator createGapInputElement(String id, String answer, Map<String,String> gapOptions) {
		DomElementManipulator inputElement = new DomElementManipulator("input");
		inputElement.setHTMLAttribute("id", id);
		inputElement.setHTMLAttribute("type", "edit");
		inputElement.setHTMLAttribute("data-gap", "editable");
		if (this.editorMode) {
			inputElement.setHTMLAttribute("data-gap-value", "\\gap{" + answer + "}"+createGapOptionString(gapOptions));
		}
		inputElement.setHTMLAttribute("size", "" + answer.length());
		inputElement.addClass("ic_gap");
		if (this.editorMode) {
			inputElement.setHTMLAttribute("readonly", true);
		}
		
		return inputElement;
	}
	
	private String createGapOptionString(Map<String,String> gapOptions) {
		if(gapOptions==null) {
			return "";
		}
		String gapString = "";
		for(String key : gapOptions.keySet()){
			gapString+="["+key+" "+gapOptions.get(key)+"]";
		}
		return gapString;
	}
	
	private String matchFilledGap(String expression, Map<String,String> gapOptions) {
		String langTag = gapOptions!=null && gapOptions.containsKey("lang")? gapOptions.get("lang") : "";
		String replaceText = null;
		
		int index = expression.indexOf("|");
		if (index > 0) {
			
			String placeholder = expression.substring(0, index).trim();
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			placeholder = StringUtils.unescapeXML(placeholder);
			GapInfo gi = new GapInfo(id, 1, isCaseSensitive, isIgnorePunctuation, gapMaxLength, langTag);
			gi.setPlaceHolder(placeholder);
			String[] answers = answer.split("\\|");
			int maxValue = 0;
			for (int i = 0; i < answers.length; i++) {
				if (answers[i].length() > maxValue) {
					maxValue = answers[i].length();
				}
				gi.addAnswer(answers[i]);
			}
			
			DomElementManipulator inputElement = this.createFilledGapInputElement(placeholder, answer, id, maxValue, gapOptions);	
			replaceText = inputElement.getHTMLCode();

			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}
	
	private DomElementManipulator createFilledGapInputElement(String placeholder, String answer, String id, int maxAnswerLength, Map<String,String> gapOptions) {
		DomElementManipulator inputElement = new DomElementManipulator("input");
		inputElement.setHTMLAttribute("data-gap", "filled");
		if (this.editorMode) {
			inputElement.setHTMLAttribute("data-gap-value", "\\filledGap{" + placeholder + "|" + answer + "}"+createGapOptionString(gapOptions));
		}
		inputElement.setHTMLAttribute("id", id);
		inputElement.setHTMLAttribute("type", "edit");
		inputElement.setHTMLAttribute("size", "" + Math.max(maxAnswerLength, placeholder.length()));
		inputElement.setHTMLAttribute("placeholder", placeholder);
		inputElement.addClass("ic_filled_gap");
		if (this.editorMode) {
			inputElement.setHTMLAttribute("readonly", true);
		}
		
		return inputElement;
	}
	
	private String matchMathGap(String expression, Map<String,String> gapOptions) {
		String replaceText = null;
		String langTag = gapOptions!=null && gapOptions.containsKey("lang")? gapOptions.get("lang") : "";

		int index = expression.indexOf(":");
		
		if (index > 0) {
			String value = expression.substring(0, index).trim();
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			
			replaceText = // \gap{id|size|width|{{value:id}} - {{value:id}} will be replaced in setState
						"\\gap{" +
						id + 
						"|" + 
						answer.length() + 
						"|" + 
						gapWidth +  
						"|" +
						"{{value:" + id + "}}" + 
						"}";
			idCounter++;
			
			GapInfo gi = new GapInfo(id, Integer.parseInt(value),
					isCaseSensitive, isIgnorePunctuation, gapMaxLength, langTag);
			String[] answers = answer.split("\\|");
			for (int i = 0; i < answers.length; i++) {
				gi.addAnswer(answers[i]);
			}
			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}

	private String matchDraggableFilledGap(String expression, Map<String,String> gapOptions) {
		String langTag = gapOptions!=null && gapOptions.containsKey("lang") ? gapOptions.get("lang") : "";
		String replaceText = null;
		int index = expression.indexOf("|");
		if (index > 0) {
			String placeholder = expression.substring(0, index).trim();
			placeholder = StringUtils.unescapeXML(placeholder);
			String answer = expression.substring(index + 1).trim();
			String[] answers = answer.split("\\|");
			String id = baseId + "-" + idCounter;
			idCounter++;
			
			DomElementManipulator spanElement = new DomElementManipulator("span");
			spanElement.addClass("ic_draggableGapEmpty");
			spanElement.addClass("ic_filled_gap");
			spanElement.setInnerHTMLText(placeholder);
			spanElement.setHTMLAttribute("id", id);
			
			replaceText = spanElement.getHTMLCode();
			
			GapInfo gi = new GapInfo(id, 1, isCaseSensitive, isIgnorePunctuation, gapMaxLength, langTag);
			gi.setPlaceHolder(placeholder);
			for (int i = 0; i < answers.length; i++) {
				gi.addAnswer(answers[i]);
			}
			parserResult.gapInfos.add(gi);
		}
		return replaceText;
	}
	
	private String matchDraggableGap(String expression, Map<String,String> gapOptions) {
		String langTag = gapOptions!=null && gapOptions.containsKey("lang") ? gapOptions.get("lang") : "";
		String replaceText = null;

		int index = expression.indexOf(":");
		if (index > 0) {
			String value = expression.substring(0, index).trim();
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			
			DomElementManipulator spanElement = new DomElementManipulator("span");
			spanElement.setHTMLAttribute("id", id);
			spanElement.addClass("ic_draggableGapEmpty");
			spanElement.setInnerHTMLText(DomElementManipulator.getFromHTMLCodeUnicode("&#160"));
			replaceText = spanElement.getHTMLCode();
			
			GapInfo gi = new GapInfo(id, Integer.parseInt(value),
					isCaseSensitive, isIgnorePunctuation, 0, langTag);
			String[] answers = answer.split("\\|");
			String answerToken = null;
			for (int i = 0; i < answers.length; i++) {
				if (answerToken != null) {
					answerToken += "|" + answers[i];
				} else {
					answerToken = answers[i];
				}
				if (answerToken.indexOf("\\(") < 0
						|| answerToken.indexOf("\\)") > 0) {
					gi.addAnswer(answerToken);
					answerToken = null;
				}
			}
			if (answerToken != null) {
				gi.addAnswer(answerToken);
			}
			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}

	private String[] getAnswerAndValue(String value, boolean escape) {
		String [] returnValue = new String[2];
		returnValue[0] = null;
		returnValue[1] = "";

		String buffValue = "";

		//0 - Copy
		//1 - start escaping
		int actualCharState = 0;


		for (char c: value.toCharArray()) {
			if (actualCharState == 0) {
				if (c != '\\' && c != ':') {
					buffValue += c;
				} else if (c == ':') {
					returnValue[0] = buffValue;
					buffValue = "";
				} else if (c == '\\' && escape) {
                    actualCharState = 1;
				} else {
				    buffValue += c;
				}
			} else {
				buffValue += c;
				actualCharState = 0;
			}
		}

		returnValue[1] = buffValue;

		return returnValue;
	}

	/**
	 * Replace expression with inline choice
	 * 
	 * @param expression
	 * @return
	 */
	private String matchInlineChoice(String expression) {

		String replaceText = null;

		try {
			int index = expression.indexOf(":");
			if (index > 0) {
				String value = expression.substring(0, index).trim();
				String answerValues = StringUtils.removeNewlines(expression.substring(index + 1));
				String[] answers = answerValues.split("\\|");
				for(int i=0;i<answers.length;i++){
					answers[i]=unescapeAltText(answers[i]);
				}
				if (answers.length > 1) {

					String id = baseId + "-" + idCounter;
					idCounter++;
					String [] answerAndValue = this.getAnswerAndValue(answers[0].trim(), this.useEscapeCharacterInGap);
					String answerPrefixValue = "";
					if (answerAndValue[0] != null) {
						answerPrefixValue += ":" + answerAndValue[0];
					}
					String answer = answerPrefixValue + StringUtils.unescapeXML(answerAndValue[1].trim());
					InlineChoiceInfo info = new InlineChoiceInfo(id, answer, Integer.parseInt(value));
					parserResult.choiceInfos.add(info);
					if (editorMode) {
						DomElementManipulator inputElement = this.createEditorInputElement(expression, id);
						
						replaceText = inputElement.getHTMLCode();
					} else {
						DomElementManipulator selectElement = new DomElementManipulator("select");
						selectElement.addClass("ic_inlineChoice");
						selectElement.setHTMLAttribute("id", id);
						
						DomElementManipulator emptyOptionElement = new DomElementManipulator("option");
						emptyOptionElement.setHTMLAttribute("value", "-");
						emptyOptionElement.setInnerHTMLText("---"); //Changing these values might cause some addons to function incorrectly, as they assume them to be the default/empty values
						selectElement.appendElement(emptyOptionElement);

						for (int i = 0; i < answers.length; i++) {
							answerAndValue = this.getAnswerAndValue(answers[i].trim(), this.useEscapeCharacterInGap);
							String answerValue = "";
							if (answerAndValue[0] != null) {
								answerValue += answerAndValue[0] + ":";
							}
							info.addDistractor(StringUtils.unescapeXML(answerValue + answerAndValue[1]));
						}
						
						Iterator<String> distractors = info.getDistractors();
						while (distractors.hasNext()) {
							String dist = distractors.next();
							dist = dist.trim();
							String itemValue = StringUtils.escapeXML(dist);
							DomElementManipulator optionElement = new DomElementManipulator("option");
							optionElement.setHTMLAttribute("value", itemValue);
							optionElement.setHTMLAttribute("aria-label", this.getReadableAltText(itemValue));
							optionElement.setInnerHTMLText(dist);
							selectElement.appendElement(optionElement);
						}

						replaceText = selectElement.getHTMLCode();
					}
				}
			}
		} catch (Exception e) {
		}

		
		return replaceText;
	}
	
	private DomElementManipulator createEditorInputElement(String expression, String id) {
		DomElementManipulator inputElement = new DomElementManipulator("input");
		inputElement.setHTMLAttribute("value", "\u25BC");
		inputElement.setHTMLAttribute("style", "text-align: right; width: 80px");
		inputElement.setHTMLAttribute("data-gap", "dropdown");
		inputElement.setHTMLAttribute("data-gap-value", "{{" + expression + "}}");
		inputElement.setHTMLAttribute("id", id);

		return inputElement;
	}
	
	private String matchInLineChoiceKeepOrder(String expression) {
		String replaceText = null;
		
		int index = expression.indexOf(":");
		if (index > 0) {
			String[] answers = expression.split("\\|");
			for(int i=0;i<answers.length;i++){
				answers[i]=unescapeAltText(answers[i]);
			}
			
			if (answers.length > 1) {
				String id = baseId + "-" + idCounter;
				idCounter++;
				String value = "";
				InlineChoiceInfo info = null;

				for (int i = 0; i < answers.length; i++) {
					String answer = StringUtils.unescapeXML(answers[i].trim());
					String [] answerAndValue = this.getAnswerAndValue(answer, this.useEscapeCharacterInGap);
					answers[i] = answerAndValue[1];
					if (answerAndValue[0] != null && answerAndValue[0].length() > 0) {
						value = answerAndValue[0];
						info = new InlineChoiceInfo(id, answerAndValue[1], Integer.parseInt(value));
						parserResult.choiceInfos.add(info);
					}
				}
				
				if (info != null) {
					if (editorMode) {
						DomElementManipulator inputElement = this.createEditorInputElement(expression, id);
						
						replaceText = inputElement.getHTMLCode();
					} else {
						DomElementManipulator selectElement = new DomElementManipulator("select");
						selectElement.addClass("ic_inlineChoice");
						selectElement.setHTMLAttribute("id", id);
						
						DomElementManipulator emptyOptionElement = new DomElementManipulator("option");
						emptyOptionElement.setHTMLAttribute("value", "-");
						emptyOptionElement.setInnerHTMLText("---");
						selectElement.appendElement(emptyOptionElement);
						
						for (int i = 0; i < answers.length; i++) {
							String dist = answers[i].trim();
							info.addDistractorInOrder(dist);
							
							String itemValue = StringUtils.escapeXML(dist);
							DomElementManipulator optionElement = new DomElementManipulator("option");
							optionElement.setHTMLAttribute("value", itemValue);
							optionElement.setHTMLAttribute("aria-label", this.getReadableAltText(itemValue));
							optionElement.setInnerHTMLText(dist);
							selectElement.appendElement(optionElement);

						}
						replaceText = selectElement.getHTMLCode();
					}
				}
			}
		}

		return replaceText;
	}

	/**
	 * Try to match variable
	 * 
	 * @param subSequence
	 * @return null if no match found
	 */
	private String matchVariable(String key) {
		return variables.get(key);
	}

	private String parseLinks(String srcText) {

		final String pattern = "\\[\\[[^\\]]+\\]\\]";
		RegExp gapRegExp = RegExp.compile(pattern);
		MatchResult matchResult;
		String replaceText;

		String parsedText = srcText;

		while ((matchResult = gapRegExp.exec(parsedText)) != null) {
			if (matchResult.getGroupCount() > 0) {
				String group = matchResult.getGroup(0);
				String expression = group.substring(2, group.length() - 2);
				replaceText = link2Anchor(expression, LinkType.PAGE);

				if (replaceText == null) {
					replaceText = "#ERR#";
				}
				parsedText = parsedText.replaceFirst(pattern, replaceText);
			} else {
				break;
			}
		}
		return parsedText;
	}
	
	private String parseExternalLinks(String srcText) {

		final String pattern = "<a href=['\"](.+?)['\"]";
		RegExp gapRegExp = RegExp.compile(pattern, "g");
		MatchResult matchResult;
		String replaceText;
		String parsedText = srcText;
		String href = null;
		String literalReplacement = null;

		while ((matchResult = gapRegExp.exec(parsedText)) != null) {
			if (matchResult.getGroupCount() > 0) {
				href = matchResult.getGroup(1);
				replaceText = externalLink2Anchor(href);

				if (replaceText == null) {
					replaceText = "#ERR#";
				}

				literalReplacement = StringUtils.quoteReplacement(matchResult.getGroup(0));
				parsedText = parsedText.replaceFirst(literalReplacement,
						replaceText);
			} else {
				break;
			}
		}
		return parsedText;
	}

	private static boolean isBetweenBrackets(String text) {
		int endIndex = text.indexOf("\\)");
		if (endIndex > 0) {
			int startIndex = text.indexOf("\\(");
			return startIndex >= 0 && startIndex < endIndex;
		}
		return false;
	}
	
	private String parseGaps(String srcText) {
		final String pattern = "\\\\gap\\{|\\\\filledGap\\{";
		String input = srcText;
		String output = "";
		String replaceText;
		int index = -1;
		boolean isRefactored = false;
		RegExp regExp = RegExp.compile(pattern);
		MatchResult matchResult;
		
		while ((matchResult = regExp.exec(input)) != null) {
			if (matchResult.getGroupCount() <= 0) {
				break;
			}

			String group = matchResult.getGroup(0);
			output += input.substring(0, matchResult.getIndex());
			input = input.substring(matchResult.getIndex() + group.length());
			index = findClosingBracket(input);

			if (group.compareTo("\\filledGap{") == 0) {
				if (index < 0) {
					return output + "\\filledGap{" + input;
				}

				String expression = input.substring(0, index);
				input = input.substring(index + 1);
				Map<String,String> gapOptions = this.getGapOptions(input);
				input = removeGapOptions(input);

				if (useDraggableGaps) {
					replaceText = matchDraggableFilledGap(expression, gapOptions);
				} else {
					replaceText = matchFilledGap(expression, gapOptions);
				}
				
			} else {
				if (index < 0) {
					return output + "\\gap{" + input;
				}

				String expression = "1:" + input.substring(0, index);
				input = input.substring(index + 1);
				Map<String,String> gapOptions = this.getGapOptions(input);
				input = removeGapOptions(input);

				if (useDraggableGaps) {
					replaceText = matchDraggableGap(expression, gapOptions);
				} else if (useMathGaps) {
					replaceText = matchMathGap(expression, gapOptions);
					if (!isRefactored && !isBetweenBrackets(srcText)) {
						replaceText = "\\(" + replaceText;
						isRefactored = true;
					}
				} else {
					replaceText = matchGap(expression, gapOptions);
				}
			}
			
			if (replaceText == null) {
				replaceText = "#ERR#";
			}

			output = output + replaceText;
		}

		if (isRefactored) {
			output = output + "\\)";
		}

		return output + input;
	}

	public static int findClosingBracket(String input) {

		int counter = 0;

		for (int index = 0; index < input.length(); index++) {

			if (input.charAt(index) == '{') {
				counter++;
			} else if (input.charAt(index) == '}') {
				counter--;
				if (counter < 0) {
					return index;
				}
			}
		}

		return -1;
	}

	/**
	 * Replace link with anchor
	 * 
	 * @param expression
	 * @return
	 */
	private String link2Anchor(String expression, LinkType type) {
		String replaceText = null;

		int index = expression.indexOf("|");
		if (index > 0) {
			String pageName = expression.substring(0, index);
			pageName = StringUtils.removeAllFormatting(pageName);
			pageName = StringUtils.unescapeXML(pageName);
			String id = baseId + "-" + UUID.uuid(4);

			String linkText = expression.substring(index + 1).trim();	
			replaceText = this.getReplaceText(id, linkText, expression, type);
			
			LinkInfo pli = new LinkInfo(id, type, pageName, "");
			parserResult.linkInfos.add(pli);
		}

		return replaceText;
	}

	private String getReplaceText(String id, String linkText, String expression, LinkType type) {
		String replaceText = null;
		
		if (type == LinkType.DEFINITION) {
			replaceText = this.getDefinitionReplaceText(id, expression, linkText);
		} else {
			return "<a id='" + id
					+ "' class='ic_definitionLink' href='javascript:void(0);'>" + linkText
					+ "</a>";
		}

		return replaceText;
	}

	private String getDefinitionReplaceText(String id, String expression, String linkText) {
		String replaceText = null;
		int index = expression.indexOf("|");
		
		String forwardText = expression.substring(0, index).trim();
		
		String dataGapValue = "";
		if (forwardText.compareTo(linkText) == 0) {
			dataGapValue = forwardText;
		} else {
			dataGapValue = expression;
		}
		
		replaceText = "<a id='" + id 
				+ "' class='ic_definitionLink' "
				+ "data-gap='glossary' ";
		
		if (this.editorMode) {
			replaceText += "data-gap-value='\\def{" + dataGapValue + "}' ";
		}
		
		replaceText += "href='javascript:void(0);'>" + linkText
				+ "</a>";
		
		return replaceText;
	}

	/**
	 * Replace external link with anchor
	 * 
	 * @param expression
	 * @return
	 */
	private String externalLink2Anchor(String href) {
		
		String replaceText = null;
		String id = baseId + "-" + UUID.uuid(4);
		String target = (openLinksinNewTab) ? "_blank" : "_self";
		
		LinkInfo pli = new LinkInfo(id, LinkType.EXTERNAL, href, target);
		parserResult.linkInfos.add(pli);
		replaceText = "<a id='" + id +  "' target='" + target + "' href='" + href + "'";
		
		return replaceText;
	}

	private String parseDefinitions(String srcText) {

		final String pattern = "\\\\def\\{[^}]+\\}";
		RegExp regExp = RegExp.compile(pattern);
		MatchResult matchResult;
		String replaceText;

		String input = srcText;
		String output = "";

		while ((matchResult = regExp.exec(input)) != null) {

			if (matchResult.getGroupCount() > 0) {

				String group = matchResult.getGroup(0);
				output += input.substring(0, matchResult.getIndex());
				input = input.substring(matchResult.getIndex() + group.length());
				String expression = group.substring(5, group.length() - 1);

				if (expression.indexOf("|") > 0) {
					replaceText = link2Anchor(expression, LinkType.DEFINITION);
				} else {
					replaceText = link2Anchor(expression + "|" + expression, LinkType.DEFINITION);
				}

				if (replaceText == null) {
					replaceText = "#ERR#";
				}

				output += replaceText;
			} else {
				break;
			}
		}

		output += input;
		return output;
	}


	public static DomElementManipulator getAltTextElement(String visibleText, String altText){
		return getAltTextElement(visibleText, altText, "");
	}
	
	public static DomElementManipulator getAltTextElement(String visibleText, String altText, String langTag) {
		DomElementManipulator wrapper = new DomElementManipulator("span");
		wrapper.setHTMLAttribute("aria-label", altText);
		if (langTag.length() > 0) {
		    wrapper.setHTMLAttribute("lang", langTag);
		}
		DomElementManipulator visibleTextElement = new DomElementManipulator("span");
		visibleTextElement.setHTMLAttribute("aria-hidden", "true");
		visibleTextElement.setInnerHTMLText(visibleText);
		
		wrapper.appendElement(visibleTextElement);
		return wrapper;
		
	}
	
	private String parseAltText(String srcText) {
		srcText = this.escapeAltTextInTag(srcText);
		final String pattern = 	"\\\\alt\\{";
		String input = srcText;
		String output = "";
		String replaceText;
		int index = -1;
		RegExp regExp = RegExp.compile(pattern);
		MatchResult matchResult;
		
		while ((matchResult = regExp.exec(input)) != null) {
			if (matchResult.getGroupCount() <= 0) {
				break;
			}

			String group = matchResult.getGroup(0);
			output += input.substring(0, matchResult.getIndex());
			input = input.substring(matchResult.getIndex() + group.length());
			index = findClosingBracket(input);

			String expression = input.substring(0, index);
			input = input.substring(index + 1);
			Map<String,String> gapOptions = this.getGapOptions(input);
			input = removeGapOptions(input);
			int seperatorIndex = expression.indexOf("|");
			if (seperatorIndex > 0) {				
				String visibleText = expression.substring(0, seperatorIndex);
				String altText = expression.substring(seperatorIndex + 1);
				if (gapOptions!=null && gapOptions.containsKey("lang")) {
					replaceText =  StringUtils.unescapeXML(getAltTextElement(visibleText, altText, gapOptions.get("lang")).getHTMLCode());
				} else {
					replaceText =  StringUtils.unescapeXML(getAltTextElement(visibleText, altText).getHTMLCode());
				}
			} else {
				replaceText = "#ERR";
			}
			output = output + replaceText;
		}
		return this.unescapeAltTextInTag(output + input);
	}
	
	public static String escapeAltText(String srcText){
		String parsedText = srcText.replaceAll("\\\\alt\\{([^\\|\\{\\}]*?)\\|([^\\|\\{\\}]*?)\\}", "\\\\altEscaped$1&altTextSeperator&$2&altTextEnd&");
		return parsedText;
	}

	public static String unescapeAltText(String srcText){
		String parsedText = srcText.replaceAll("\\\\altEscaped([^\\|\\{\\}]*?)&altTextSeperator&([^\\|\\{\\}]*?)&altTextEnd&", "\\\\alt\\{$1\\|$2\\}");
		return parsedText;
	}
	
	private String escapeAltTextInTag(String srcText){
		String parsedText = srcText;
		String oldParsedText = "";
		String pattern = "<([^>]*?)\\\\alt\\{([^<]*?)>";
		while(!oldParsedText.equals(parsedText)){ //it is possible that there will be multiple alt texts inside one tag, all must be escaped
			oldParsedText = parsedText;
			parsedText =  parsedText.replaceAll(pattern, "<$1\\\\altEscaped\\{$2>");
		}
		return parsedText;
	}
	
	private String unescapeAltTextInTag(String srcText){
		String pattern = "<([^>]*?)\\\\altEscaped\\{([^<]*?)>";
		String parsedText = srcText;
		String oldParsedText = "";
		while(!oldParsedText.equals(parsedText)){ //it is possible that there will be multiple alt texts inside one tag, all must be unescaped
			oldParsedText = parsedText;
			parsedText =  parsedText.replaceAll(pattern, "<$1\\\\alt\\{$2>");
		}
		return parsedText;
	}
	
	
	
	private String getReadableAltText(String srcText){
		String parsedText =  srcText.replaceAll("\\\\alt\\{.*?\\|(.*?)\\}(\\[[a-zA-Z0-9_\\- ]*?\\])*", "$1");
		return parsedText;
	}
	
	public Map<String,String> getGapOptions(String expression) {
		final String pattern = 	"^\\[[a-zA-Z0-9_\\- ]*?\\]";
		Map<String,String> result = new HashMap<String,String>();
		RegExp regExp = RegExp.compile(pattern);
		MatchResult matchResult;
		
		while ((matchResult = regExp.exec(expression)) != null) {
			if (matchResult.getGroupCount() <= 0) {
				break;
			}

			String group = matchResult.getGroup(0);
			expression = expression.replaceFirst(pattern, "");
			group = group.replaceAll("[\\[\\]]", "");
			String[] values = group.split(" ");
			if(values.length==2) {
				result.put(values[0], values[1]);
			}
		}
		return result;
	};
	
	public static String removeGapOptions(String expression) {
		final String pattern = 	"^\\[[a-zA-Z0-9_\\- ]*?\\]";
		RegExp regExp = RegExp.compile(pattern);
		MatchResult matchResult;
		
		while ((matchResult = regExp.exec(expression)) != null) {
			if (matchResult.getGroupCount() <= 0) {
				break;
			}

			String group = matchResult.getGroup(0);
			group = group.replaceAll("[\\[\\]]", "");
			String[] values = group.split(" ");
			if(values.length!=2) {
				break;
			}
			expression = expression.replaceFirst(pattern, "");
		}
		return expression;
	};
	
	public void skipGaps() {
		skipGaps = true;
	}

	public void setGapWidth(int gapWidth) {
		this.gapWidth = gapWidth;
	}
	
	
	public void setGapMaxLength(int gapMaxLength) {
		this.gapMaxLength = gapMaxLength;
	}

	public void setUseEscapeCharacterInGap(boolean isUsing) {
		this.useEscapeCharacterInGap = isUsing;
	}
	
	public List<String> getGapsOrder () {
		return this.gapsOrder;
	}
	
	public static String removeHtmlFormatting( String html) {
		Element el = (new HTML(html)).getElement();
		return el.getInnerText();
	}

}
