package com.lorepo.icplayer.client.model.page.group;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.SemiResponsivePositions;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.xml.group.parsers.GroupParser;

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

	public void setScoringGroupType(ScoringGroupType scoringType) {
		this.scoringType = scoringType;
	}

	public int getMaxScore() {
		return maxScore;
	}

	public void setMaxScore(int maxScore) {
		this.maxScore = maxScore;
	}

	public SemiResponsivePositions getSemiResponsivePositions() {
		return semiResponsivePositions;
	}

	public Page getPage() {
		return this.page;
	}

	public Element stylesToXML() {
		return super.stylesToXML();
	}

	public Group loadGroupFromXML(Element groupNode) {
		Group group = GroupParser.loadGroupFromXML(groupNode, page);
		group.initGroupPropertyProvider();
		return group;
	}

	public String toXML() {
		return GroupParser.toXML(this).toString();
	}

	public boolean isIdCorrect(String newValue) {
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

	public boolean isIDUnique(String newId) {
		for (Group group : page.getGroupedModules()) {
			if (group.getId().equals(newId)) {
				return false;
			}
		}

		if (page.getModules().getModuleById(newId) != null) {
			return false;
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

	public boolean isNewValueMaxScoreValid(String newValue, IProperty property) {
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
	
	public boolean isVisibleModules() {
		for(IModuleModel module : this.moduleModels) {
			if(module.isModuleInEditorVisible()) {
				return true; 
			}
		}
		return false;
	}
}
