package com.lorepo.icplayer.client.model.page;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.api.IModuleModel;

@SuppressWarnings("serial")
public class Group extends GroupPropertyProvider {

	private Page page;
	private String id;
	private ScoringGroupType scoringType = ScoringGroupType.defaultScore;
	private int maxScore = 1;
	private IProperty propertyMaxScore;

	public enum ScoringGroupType {
		defaultScore,
		zeroMaxScore,
		graduallyToMaxScore,
		minusErrors
	}

	public Group(Page page) {
		super("Group");
		this.page = page;
		addPropertyId();
		addPropertyScoreType();
	}

	public Group() {
		super("Group");
		addPropertyId();
		addPropertyScoreType();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public ScoringGroupType getScoringType() {
		return scoringType;
	}

	public int getMaxScore() {
		return maxScore;
	}

	public Group loadGroupFromXML(Element groupNode) {
		NodeList groupModuleElements = groupNode.getElementsByTagName("groupModule");
		NodeList scoringNode = groupNode.getElementsByTagName("scoring");
		Element scoring = (Element)scoringNode.item(0);
		setScoreFromString(DictionaryWrapper.get(scoring.getAttribute("type")));
		maxScore = Integer.parseInt(scoring.getAttribute("max"));
		id = groupNode.getAttribute("id");

		Group group = new Group(page);

		for (int j = 0; j < groupModuleElements.getLength(); j++) {
			Element groupModule = (Element) groupModuleElements.item(j);
			String moduleID = groupModule.getAttribute("moduleID");
			group.add(page.getModules().getModuleById(moduleID));
		}

		group.maxScore = maxScore;
		group.scoringType = scoringType;
		group.id = id;

		return group;
	}

	public String toXML() {
		Group group = this;
		String xml;

		xml = "<group id='" + id + "'>";
		xml += "<scoring type='" + scoringType + "' max='" + maxScore + "'/>";
		xml += "<groupedModulesList>";

		for(IModuleModel module : group) {
			if (module != null) {
				xml += "<groupModule moduleID='" + StringUtils.escapeXML(module.getId()) + "'/>";
			}
		}

		xml += "</groupedModulesList>";
		xml += "</group>";
		return xml;
	}

	protected boolean isIdCorrect(String newValue) {
		return !newValue.trim().equals("");
	}

	private void addPropertyId() {

		IProperty propertyId = new IProperty() {

			@Override
			public void setValue(String newValue) {

				if (isIdCorrect(newValue) && isIDUnique(newValue)) {
					id = newValue;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return id;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("group_id");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("group_id");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(propertyId);
	}

	protected boolean isIDUnique(String newId) {
		for (Group group : page.getGroupedModules()) {
			if (group.getId().equals(newId)) {
				return false;
			}
		}

		return true;
	}

	private void addPropertyScoreType() {

		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {
				setScoreFromString(newValue);
				sendPropertyChangedEvent(this);
			}

			@Override
			public String getValue() {
				return DictionaryWrapper.get(scoringType.toString());
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("score_type");
			}

			@Override
			public int getAllowedValueCount() {
				return ScoringGroupType.values().length;
			}

			@Override
			public String getAllowedValue(int index) {
				String type = "";

				switch(ScoringGroupType.values()[index]) {
					case defaultScore:
						type = "Default";
						break;
					case zeroMaxScore:
						type = "Zero or Max";
						break;
					case graduallyToMaxScore:
						type = "Gradually to Max";
						break;
					case minusErrors:
						type = "Minus Errors";
						break;
				}

				return type;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("score_type");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}

	protected boolean isNewValueMaxScoreValid(String newValue, IProperty property) {
		try {
			maxScore = Integer.parseInt(newValue);
			sendPropertyChangedEvent(property);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public void addPropertyMaxScore() {
		if (propertyMaxScore != null) {
			return;
		}

		IProperty property = new IProperty() {

			@Override
			public void setValue(String newValue) {
				isNewValueMaxScoreValid(newValue, this);
			}

			@Override
			public String getValue() {
				return maxScore > 0 ? Integer.toString(maxScore) : "1";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("max_score");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("max_score");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		propertyMaxScore = property;
		addProperty(property);
	}

	public void removePropertyMaxScore() {
		removeProperty(propertyMaxScore);
		propertyMaxScore = null;
	}

	public void setScoreFromString(String scoreName) {
		if(scoreName != null){
			for(ScoringGroupType st : ScoringGroupType.values()){
				if(DictionaryWrapper.get(st.toString()).equals(scoreName)){
					scoringType = st;
				}
			}
		}
	}
}
