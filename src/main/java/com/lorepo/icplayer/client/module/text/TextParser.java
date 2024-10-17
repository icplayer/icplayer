package com.lorepo.icplayer.client.module.text;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.regexp.shared.MatchResult;
import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.UUID;
import com.lorepo.icf.utils.URLUtils;
import com.lorepo.icplayer.client.model.alternativeText.AlternativeTextService;
import com.lorepo.icplayer.client.module.NestedAddonUtils;
import com.lorepo.icplayer.client.module.text.LinkInfo.LinkType;
import com.lorepo.icplayer.client.utils.DomElementManipulator;

import java.util.*;

public class TextParser {

	public class ParserResult {
		public String parsedText;
		public String originalText;
		public boolean hasSyntaxError;
		public List<GapInfo> gapInfos = new ArrayList<GapInfo>();
		public List<InlineChoiceInfo> choiceInfos = new ArrayList<InlineChoiceInfo>();
		public List<LinkInfo> linkInfos = new ArrayList<LinkInfo>();
		public List<AudioInfo> audioInfos = new ArrayList<AudioInfo>();
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
	private boolean hasSyntaxError = false;
	private String langTag = "";
	private boolean isNumericOnly = false;
	private String baseURL;
	private String contentBaseURL;

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

	public void setLangTag(String langTag) {
		this.langTag = langTag == null ? "" : langTag;
	}

	// parse srcText for editor in HTMLWidget as rendered view
	public ParserResult parse(String srcText, boolean editorMode) {
		this.editorMode = editorMode;
		
		return parse(srcText);
	}

	public ParserResult parse (String srcText) {
		this.gapsOrder = calculateGapsOrder(srcText);

		parserResult = new ParserResult();
		parserResult.originalText = srcText;
		srcText = srcText.replaceAll("\\s+", " ");
		hasSyntaxError = false;
		try {
			if (this.editorMode) {
				parserResult = this.parseInEditorMode(srcText);
				return parserResult;
			} else {
				if (!skipGaps) {
					parserResult.parsedText = parseGaps(srcText);
					parserResult.parsedText = parseAudio(parserResult.parsedText);
					if (!useMathGaps) {
						parserResult.parsedText = AlternativeTextService.escapeAltText(parserResult.parsedText);
						parserResult.parsedText = parseOldSyntax(parserResult.parsedText);
						parserResult.parsedText = AlternativeTextService.unescapeAltText(parserResult.parsedText);
					}
					parserResult.parsedText = parseExternalLinks(parserResult.parsedText);
					parserResult.parsedText = parseLinks(parserResult.parsedText);
				} else {
					parserResult.parsedText = parseExternalLinks(srcText);
					parserResult.parsedText = parseLinks(parserResult.parsedText);
				}
				parserResult.parsedText = parseAltText(parserResult.parsedText);
				parserResult.parsedText = parseDefinitions(parserResult.parsedText);
				parserResult.parsedText = parseAddonGap(parserResult.parsedText, false);
			}
		} catch (Exception e) {
			parserResult.parsedText = "#ERROR#";
		}

		parserResult.hasSyntaxError = hasSyntaxError;
		return parserResult;
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

				if (nextChar == "5") {
					result.add("audio");
				}
			}
		}

		return result;
	}

	private String getRawTextSource (String text) {
		final String availableCharsInGapContent = "[^\\}]+";
		return text
				.replaceAll("\\<.*?>", "").replaceAll("&nbsp;", "")
				.replaceAll("\\\\gap\\{" + availableCharsInGapContent + "\\}", "#1#")
				.replaceAll("\\{\\{" + availableCharsInGapContent + "\\}\\}", "#2#")
				.replaceAll("\\\\(" + availableCharsInGapContent + "\\\\)", "#3#")
				.replaceAll("\\\\filledGap\\{" + availableCharsInGapContent + "\\}", "#4#")
				.replaceAll("\\\\audio\\{" + availableCharsInGapContent + "\\}", "#5#");
	}

	private ParserResult parseInEditorMode(String srcText) {
		ParserResult result = new ParserResult();
		hasSyntaxError = false;

		result.parsedText = parseGaps(srcText);
		result.parsedText = parseOldSyntax(result.parsedText);
		result.parsedText = parseDefinitions(result.parsedText);
		result.parsedText = parseAudio(result.parsedText);
		result.parsedText = parseAddonGap(result.parsedText, true);

		result.hasSyntaxError = hasSyntaxError;
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
					hasSyntaxError = true;
					replaceText = "{{" + expression + "}}";
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
		boolean gapOptionsIncludeLang = gapOptions != null && gapOptions.containsKey("lang");
		String langTag = gapOptionsIncludeLang ? gapOptions.get("lang") : this.langTag;
		int index = expression.indexOf(":");

		String replaceText = null;
		try{
			if (index > 0) {
				String value = expression.substring(0, index).trim();
				String answer = expression.substring(index + 1).trim();
				String id = baseId + "-" + idCounter;
				idCounter++;
				DomElementManipulator inputElement = this.createGapInputElement(id, answer, gapOptions);

				GapInfo gi = new GapInfo(id, Integer.parseInt(value), isCaseSensitive, isIgnorePunctuation, gapMaxLength, isNumericOnly, langTag);
				String[] answers = answer.split("\\|");
				for (int i = 0; i < answers.length; i++) {
					gi.addAnswer(answers[i]);
				}
				parserResult.gapInfos.add(gi);
				replaceText = inputElement.getHTMLCode();
			}
		} catch(Exception e) {
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
		for (String key : gapOptions.keySet()) {
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
			GapInfo gi = new GapInfo(id, 1, isCaseSensitive, isIgnorePunctuation, gapMaxLength,isNumericOnly, langTag);
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
					isCaseSensitive, isIgnorePunctuation, gapMaxLength, isNumericOnly, langTag);
			String[] answers = answer.split("\\|");
			for (int i = 0; i < answers.length; i++) {
				gi.addAnswer(answers[i]);
			}
			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}

	private String matchDraggableFilledGap(String expression, Map<String,String> gapOptions) {
		String langTag = getLangTagForGap(gapOptions);
		String replaceText = null;

		// filled gap has it's placeholder defined in element before first pipe sign
		int index = expression.indexOf("|");
		if (index > 0) {
			String placeholder = expression.substring(0, index).trim();
			placeholder = StringUtils.unescapeXML(placeholder);
			String answer = expression.substring(index + 1).trim();

			String id = baseId + "-" + idCounter;
			idCounter++;
			
			replaceText = getSpanElementCodeForDraggableFilledGap(id, placeholder);

			GapInfo gi = new GapInfo(id, 1, isCaseSensitive, isIgnorePunctuation, gapMaxLength, isNumericOnly, langTag);
			gi.setPlaceHolder(placeholder);

			addAnswersToFilledDraggableGapInfo(gi, answer);
			parserResult.gapInfos.add(gi);
		}
		return replaceText;
	}
	
	private String matchDraggableGap(String expression, Map<String,String> gapOptions) {
		String langTag = getLangTagForGap(gapOptions);
		String replaceText = null;

		// expression is for example 1:someText
		int colonIndex = expression.indexOf(":");
		if (colonIndex > 0) {
			String answerIndex = expression.substring(0, colonIndex).trim(); // this gets number before colon
			String answerValue = expression.substring(colonIndex + 1).trim(); // this gets text after colon
			String id = baseId + "-" + idCounter;
			idCounter++;

			replaceText = getSpanElementCodeForDraggableGap(id);

			GapInfo gi = new GapInfo(id, Integer.parseInt(answerIndex), isCaseSensitive, isIgnorePunctuation, 0, isNumericOnly, langTag);

			addAnswersToDraggableGapInfo(gi, answerValue);

			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}

	private String getLangTagForGap(Map<String,String> gapOptions) {
		boolean gapOptionsIncludeLang = gapOptions != null && gapOptions.containsKey("lang");
		return gapOptionsIncludeLang ? gapOptions.get("lang") : this.langTag;
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
				for (int i = 0; i < answers.length; i++) {
					answers[i]= AlternativeTextService.unescapeAltText(answers[i]);
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
							optionElement.getGWTElement().setInnerHTML(dist);
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
			for (int i = 0; i < answers.length; i++) {
				answers[i]=  AlternativeTextService.unescapeAltText(answers[i]);
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
							optionElement.getGWTElement().setInnerHTML(dist);
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
	 * @param key
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
			pli.setLang(this.langTag);
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
	 * @param href
	 * @return
	 */
	private String externalLink2Anchor(String href) {

		String replaceText = null;
		String id = baseId + "-" + UUID.uuid(4);
		String target = (openLinksinNewTab) ? "_blank" : "_self";
		
		LinkInfo pli = new LinkInfo(id, LinkType.EXTERNAL, href, target);
		pli.setLang(this.langTag);
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

	private String parseAudio(String srcText) {
		final String patternString = "\\\\audio\\{(.+?)\\}";
		RegExp regexp = RegExp.compile(patternString);
		MatchResult matchResult;

		String input = srcText;
		String output = "";

		while ((matchResult = regexp.exec(input)) != null) {
			if (matchResult.getGroupCount() > 0) {
				String group = matchResult.getGroup(0);
				String filePath = matchResult.getGroup(1);
				if (contentBaseURL != null) {
					filePath = URLUtils.resolveURL(contentBaseURL, filePath, true);
				} else if (ExtendedRequestBuilder.getSigningPrefix() != null) {
					filePath = URLUtils.resolveURL(baseURL, filePath, false);
				}
				filePath = ExtendedRequestBuilder.signURL(filePath);
				int lastIndex = matchResult.getIndex();
				int groupLength = group.length();

				output += input.substring(0, lastIndex);
				input = input.substring(lastIndex + groupLength);
				output += createAudio(filePath);
			} else {
				break;
			}

		}
		output += input;

		return output;
	}

	private String createAudio(String filePath) {
		String id = UUID.uuid(8);

		AudioInfo info = new AudioInfo(id);
		parserResult.audioInfos.add(info);

		DomElementManipulator buttonElement = new DomElementManipulator("input");
		buttonElement.setHTMLAttribute("id", AudioButtonWidget.BUTTON_ID_PREFIX + id);
		buttonElement.addClass(AudioButtonWidget.BUTTON_CLASS);
		buttonElement.addClass(AudioButtonWidget.BUTTON_CLASS_PLAY_STYLE);
		buttonElement.setHTMLAttribute("type", "button");

		if (editorMode) {
			buttonElement.setHTMLAttribute("data-audio-value", "\\audio{" + filePath + "}");
			buttonElement.setHTMLAttribute("style", "width: 22px; height: 22px; vertical-align: middle;");
			return buttonElement.getHTMLCode();
		}

		DomElementManipulator audioElement = new DomElementManipulator("audio");
		audioElement.setHTMLAttribute("id", AudioWidget.AUDIO_ID_PREFIX + id);
		audioElement.setHTMLAttribute("src", filePath);

		return buttonElement.getHTMLCode() + audioElement.getHTMLCode();
	}

	private String parseAddonGap(String srcText, boolean isEditorMode) {
		final String patternString = "\\\\addon\\{(.+?)\\}";
		RegExp regexp = RegExp.compile(patternString);
		MatchResult matchResult;

		String input = srcText;
		String output = "";

		while ((matchResult = regexp.exec(input)) != null) {
			if (matchResult.getGroupCount() > 0) {
				String group = matchResult.getGroup(0);
				String addonID = matchResult.getGroup(1);
				int lastIndex = matchResult.getIndex();
				int groupLength = group.length();

				output += input.substring(0, lastIndex);
				input = input.substring(lastIndex + groupLength);
				if (isEditorMode) {
					output += NestedAddonUtils.getPlaceholderInEditorMode(addonID).getString();
				} else {
					output += NestedAddonUtils.getPlaceholder(addonID).getString();
				}
			} else {
				break;
			}

		}
		output += input;

		return output;
	}

	public String parseAltText(String srcText) {
		return AlternativeTextService.getAltTextAsHtml(srcText);
	}

	private String getReadableAltText(String srcText) {
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

	private String getSpanElementCode(String id, String innerHTML, String[] classes) {
		DomElementManipulator spanElement = new DomElementManipulator("span");
		spanElement.setHTMLAttribute("id", id);
		spanElement.setInnerHTMLText(innerHTML);
		for (String className : classes) {
			spanElement.addClass(className);
		}

		return spanElement.getHTMLCode();
	}

	private String getSpanElementCodeForDraggableFilledGap(String id, String placeholder) {
		String[] classes = {
				"ic_draggableGapEmpty",
				"ic_filled_gap",
		};

		return getSpanElementCode(id, placeholder, classes);
	}

	private String getSpanElementCodeForDraggableGap(String id) {
		String[] classes = {
				"ic_draggableGapEmpty",
		};
		String innerHTML = DomElementManipulator.getFromHTMLCodeUnicode("&#160");

		return getSpanElementCode(id, innerHTML, classes);
	}

	private void addAnswersToDraggableGapInfo(GapInfo gi, String answerValue) {
		String answersWithEscapedAltText = AlternativeTextService.escapeAltTextWithAllVisibleText(answerValue);

		String[] answers = answersWithEscapedAltText.split("\\|"); // answers are divided by | sign
		String answerToken = null;

		for (String singleAnswer : answers) {
			if (answerToken != null) {
				answerToken += "|" + singleAnswer;
			} else {
				answerToken = singleAnswer;
			}
			// check if answer contains math expression
			if (answerToken.indexOf("\\(") < 0 || answerToken.indexOf("\\)") > 0) {
				gi.addAnswer(answerToken);
				answerToken = null;
			}
		}

		if (answerToken != null) {
			gi.addAnswer(answerToken);
		}
	}

	private void addAnswersToFilledDraggableGapInfo(GapInfo gi, String answer) {
		String answersWithEscapedAltText = AlternativeTextService.escapeAltText(answer);
		String[] answers = answersWithEscapedAltText.split("\\|");
		for (String singleAnswer : answers) {
			gi.addAnswer(singleAnswer);
		}
	}
	
	public void setIsNumericOnly(boolean isNumericOnly) {
		this.isNumericOnly = isNumericOnly;
	}

	public static String parseAnswer(String rawAnswer) {
		String apostrophes = "‚’‘";
		String quotationMarks = "“”„";
		String answer = rawAnswer;
		for (int i = 0; i < apostrophes.length(); i++) {
			answer = answer.replaceAll(apostrophes.substring(i,i+1),"'");
		}
		for (int i = 0; i < quotationMarks.length(); i++) {
			answer = answer.replaceAll(quotationMarks.substring(i,i+1),"\"");
		}
		return answer;
	}

	public void setBaseURL(String baseURL) {
		this.baseURL = baseURL;
	}

	public void setContentBaseURL(String baseURL) {
		this.contentBaseURL = baseURL;
	}

}
