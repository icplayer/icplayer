package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;

import com.google.gwt.regexp.shared.RegExp;
import com.google.gwt.xml.client.Element;

import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IListProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icf.utils.XMLUtils;


public class GroupGapsListItem extends BasicPropertyProvider {

	private String gapsIndexes;
	private IListProperty listProperty = null;

	private ArrayList<Integer> parsedGapsIndexes = new ArrayList<Integer>();
	private String errorCode = "";

	public GroupGapsListItem(IListProperty listProperty) {
		super(DictionaryWrapper.get("text_module_group_gaps_list_item"));
		addPropertyGapsIndexes();
		this.listProperty = listProperty;
	}
	
	private void addPropertyGapsIndexes() {

		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				setGapsIndexes(newValue);
				sendPropertyChangedEvent(this);
				listProperty.setValue("");
			}

			@Override
			public String getValue() {
				return gapsIndexes;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("text_module_group_gaps_list_item_gaps_indexes");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("text_module_group_gaps_list_item_gaps_indexes");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	private String getGapsIndexes() {
		return StringUtils.escapeXML(this.gapsIndexes);
	}

	private void setGapsIndexes(String gapsIndexes) {
		this.gapsIndexes = StringUtils.unescapeXML(gapsIndexes.trim());
	}

	public String getErrorCode() {
		return this.errorCode;
	}

	public ArrayList<Integer> getParsedGapsIndexes() {
		return this.parsedGapsIndexes;
	}

	public boolean isGapInGroup(Integer gapIndex) {
		return this.getParsedGapsIndexes().contains(gapIndex);
	}

	public void load(Element groupGaps) {
		String gapsIndexes = groupGaps.getAttribute("gapsIndexes");
		this.setGapsIndexes(gapsIndexes);
	}

	public Element toXML() {
		Element groupGaps = XMLUtils.createElement("groupGaps");
		groupGaps.setAttribute("gapsIndexes", this.getGapsIndexes());

		return groupGaps;
	}
	
	public boolean validate(Integer gapsNumber) {
		this.resetValidationResult();
		
		if (this.getGapsIndexes().isEmpty()) {
			return true;
		}
		
		LinkedHashSet<Integer> indexes = new LinkedHashSet<Integer>();
		String pattern = "^[0-9\\,\\- ]+$";
		RegExp regExp = RegExp.compile(pattern, "g");
		
		if (regExp.exec(this.getGapsIndexes()) == null) {
			this.errorCode = "text_module_group_gaps_syntax_error";
			return false;
		}
		
		String[] gapsIndexes = this.getGapsIndexes().split(",");
		for (String gapsIndexesRange : gapsIndexes) {
			if (gapsIndexesRange.isEmpty()) {
				errorCode = "text_module_group_gaps_empty_value_error";
				return false;
			}
			
			int dashesNumber = this.countDashes(gapsIndexesRange);
			String[] splitRange = gapsIndexesRange.split("-");
			if (splitRange.length > 2) {
				errorCode = "text_module_group_gaps_syntax_error";
				return false;
			} else if (splitRange.length == 2 && dashesNumber == 1) {
				if (splitRange[0].isEmpty() || splitRange[1].isEmpty()) {
					errorCode = "text_module_group_gaps_syntax_error";
					return false;
				}
				
				Integer rangeStart = Integer.parseInt(splitRange[0].trim(), 10);
				Integer rangeEnd = Integer.parseInt(splitRange[1].trim(), 10);
				
				if (rangeStart < 1 || rangeEnd < 1) {
					errorCode = "text_module_group_gaps_lower_than_error";
					return false;
				}
				
				if (rangeStart > rangeEnd) {
					errorCode = "text_module_group_gaps_start_range_greater_than_end_range_error";
					return false;
				}
				
				if (rangeStart > gapsNumber || rangeEnd > gapsNumber) {
					errorCode = "text_module_group_gaps_greater_than_error";
					return false;
				}
				
				for (Integer j = rangeStart; j <= rangeEnd; j++) {
					indexes.add(j);
				}
			} else if (splitRange.length == 1 && dashesNumber == 0) {
				Integer index = Integer.parseInt(splitRange[0].trim(), 10);
				
				if (index < 1) {
					errorCode = "text_module_group_gaps_lower_than_error";
					return false;
				}
				
				if (index > gapsNumber) {
					errorCode = "text_module_group_gaps_greater_than_error";
					return false;
				}
				
				indexes.add(index);
			} else {
				errorCode = "text_module_group_gaps_syntax_error";
				return false;
			}
		}
		
		this.parsedGapsIndexes.clear();
		this.parsedGapsIndexes.addAll(indexes);
		Collections.sort(this.parsedGapsIndexes);
		
		return true;
	}
	
	private int countDashes(String text) {
		String findStr = "-";
		int lastIndex = 0;
		int count = 0;
		
		while (lastIndex != -1) {
			lastIndex = text.indexOf(findStr, lastIndex);
			
			if (lastIndex != -1) {
				count++;
				lastIndex += findStr.length();
			}
		}
		
		return count;
	}
	
	private void resetValidationResult() {
		this.errorCode = null;
		this.parsedGapsIndexes.clear();
	}
}
