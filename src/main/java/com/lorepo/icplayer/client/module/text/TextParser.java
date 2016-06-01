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

	public class ParserResult {

		public String parsedText;
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
	
	public ParserResult parse(String srcText) {

		parserResult = new ParserResult();
		srcText = srcText.replaceAll("\\s+", " ");

		try {
			if (this.editorMode) {
				parserResult = this.parseInEditorMode(srcText);
				return parserResult;
			} else {
				if (!skipGaps) {
					parserResult.parsedText = parseGaps(srcText);
					if (!useMathGaps) {
						parserResult.parsedText = parseOldSyntax(parserResult.parsedText);
					}
					parserResult.parsedText = parseExternalLinks(parserResult.parsedText);
					parserResult.parsedText = parseLinks(parserResult.parsedText);
				} else {
					parserResult.parsedText = parseExternalLinks(srcText);
					parserResult.parsedText = parseLinks(parserResult.parsedText);
				}
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
						replaceText = mathInLineChoiceKeepOrder(expression);
					} else {
						replaceText = matchInlineChoice(expression);
					}
				}
				if (replaceText == null) {
					if (useDraggableGaps) {
						replaceText = matchDraggableGap(expression);
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

		String replaceText = null;

		int index = expression.indexOf(":");
		if (index > 0) {
			String value = expression.substring(0, index).trim();
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			replaceText = "<input id='" + id + "' type='edit' data-gap='editable' data-gap-value='\\gap{" + answer + "}' size='"
					+ answer.length() + "' class='ic_gap'" + (editorMode ? "readonly" : "") + "/>";

			GapInfo gi = new GapInfo(id, Integer.parseInt(value),
					isCaseSensitive, isIgnorePunctuation, gapMaxLength);
			String[] answers = answer.split("\\|");
			for (int i = 0; i < answers.length; i++) {

				gi.addAnswer(answers[i]);
			}
			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}
	
	private String matchFilledGap(String expression) {

		String replaceText = null;

		int index = expression.indexOf("|");
		if (index > 0) {
			String placeholder = expression.substring(0, index).trim();
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			placeholder = StringUtils.unescapeXML(placeholder);
			replaceText = "<input data-gap='filled' data-gap-value='\\filledGap{" + placeholder + "|" + answer +"}' id='" + id + "' type='edit' size='"
					+ Math.max(answer.length(), placeholder.length()) + "' class='ic_filled_gap' placeholder='" + placeholder +"'" + (editorMode ? "readonly" : "") + "/>";
			GapInfo gi = new GapInfo(id, 1, isCaseSensitive, isIgnorePunctuation, gapMaxLength);
			gi.setPlaceHolder(placeholder);
			gi.addAnswer(answer);
			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}
	
	private String matchMathGap(String expression) {

		String replaceText = null;

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
					isCaseSensitive, isIgnorePunctuation, gapMaxLength);
			String[] answers = answer.split("\\|");
			for (int i = 0; i < answers.length; i++) {
				gi.addAnswer(answers[i]);
			}
			parserResult.gapInfos.add(gi);
		}

		return replaceText;
	}

	private String matchDraggableFilledGap(String expression) {

		String replaceText = null;

		int index = expression.indexOf("|");
		if (index > 0) {
			String placeholder = expression.substring(0, index).trim();
			placeholder = StringUtils.unescapeXML(placeholder);
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			replaceText = "<span id='" + id + "' class='ic_draggableGapEmpty ic_filled_gap'>" + placeholder + "</span>";
			GapInfo gi = new GapInfo(id, 1, isCaseSensitive, isIgnorePunctuation, gapMaxLength);
			gi.setPlaceHolder(placeholder);
			gi.addAnswer(answer);
			parserResult.gapInfos.add(gi);
		}
		return replaceText;
	}
	
	private String matchDraggableGap(String expression) {
		String replaceText = null;

		int index = expression.indexOf(":");
		if (index > 0) {
			String value = expression.substring(0, index).trim();
			String answer = expression.substring(index + 1).trim();
			String id = baseId + "-" + idCounter;
			idCounter++;
			replaceText = "<span id='" + id
					+ "' class='ic_draggableGapEmpty'>&nbsp;</span>";
			GapInfo gi = new GapInfo(id, Integer.parseInt(value),
					isCaseSensitive, isIgnorePunctuation, 0);
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
				if (answers.length > 1) {

					String id = baseId + "-" + idCounter;
					idCounter++;
					String answer = StringUtils.unescapeXML(answers[0].trim());
					InlineChoiceInfo info = new InlineChoiceInfo(id, answer, Integer.parseInt(value));
					parserResult.choiceInfos.add(info);
					if (editorMode) {
						replaceText = "<input value='&#9660;' style='text-align: right; width: 80px' data-gap='dropdown' data-gap-value='{{" + expression +"}}' id='" + id + "'/>";
					} else {
						replaceText = "<select id='" + id + "' class='ic_inlineChoice'>";
						replaceText += "<option value='-'>---</option>";
						for (int i = 0; i < answers.length; i++) {
							info.addDistractor(answers[i].trim());
						}
						Iterator<String> distractors = info.getDistractors();
						while (distractors.hasNext()) {
							String dist = distractors.next();
							String itemValue = StringUtils.escapeXML(dist);
							replaceText += "<option value='" + itemValue + "'>" + dist
									+ "</option>";
						}
						replaceText += "</select>";
					}
				}
			}
		} catch (Exception e) {}


		return replaceText;
	}
	
	private String mathInLineChoiceKeepOrder(String expression) {
		String replaceText = null;
		
		int index = expression.indexOf(":");
		if (index > 0) {
			String[] answers = expression.split("\\|");
			
			if (answers.length > 1) {
				String id = baseId + "-" + idCounter;
				idCounter++;
				String correctAnswer = "";
				String value = "";
				InlineChoiceInfo info = null;
				
				for (int i = 0; i < answers.length; i++) {
					String answer = StringUtils.unescapeXML(answers[i].trim());
					String[] splitted = answer.split(":");
					if (splitted.length > 1) {
						correctAnswer = splitted[1];
						answers[i] = correctAnswer;
						value = splitted[0];
						info = new InlineChoiceInfo(id, correctAnswer, Integer.parseInt(value));
						parserResult.choiceInfos.add(info);
					}
				}

				if (info != null) {
					if (editorMode) {					
						replaceText = "<input value='&#9660;' style='text-align: right; width: 80px' data-gap='dropdown' data-gap-value='{{" + expression +"}}' id='" + id + "'/>";
					} else {
						replaceText = "<select id='" + id + "' class='ic_inlineChoice'>";
						replaceText += "<option value='-'>---</option>";
						
						for (int i = 0; i < answers.length; i++) {
							String dist = answers[i].trim();
							info.addDistractorInOrder(dist);
							String itemValue = StringUtils.escapeXML(dist);
							replaceText += "<option value='" + itemValue + "'>" + dist
									+ "</option>";
						}
						replaceText += "</select>";
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
				
				if (useDraggableGaps) {
					replaceText = matchDraggableFilledGap(expression);
				} else {
					replaceText = matchFilledGap(expression);
				}
				
			} else {
				if (index < 0) {
					return output + "\\gap{" + input;
				}

				String expression = "1:" + input.substring(0, index);
				input = input.substring(index + 1);

				if (useDraggableGaps) {
					replaceText = matchDraggableGap(expression);
				} else if (useMathGaps) {
					replaceText = matchMathGap(expression);
					if (!isRefactored && !isBetweenBrackets(srcText)) {
						replaceText = "\\(" + replaceText;
						isRefactored = true;
					}
				} else {
					replaceText = matchGap(expression);
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
				+ "data-gap='glossary' "
				+ "data-gap-value='\\def{" + dataGapValue + "}' "
				+ "href='javascript:void(0);'>" + linkText
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

	public void skipGaps() {
		skipGaps = true;
	}

	public void setGapWidth(int gapWidth) {
		this.gapWidth = gapWidth;
	}
	
	public void setGapMaxLength(int gapMaxLength) {
		this.gapMaxLength = gapMaxLength;
	}

}
