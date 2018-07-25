package com.lorepo.icplayer.client.model.page;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.XMLUtils;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;
import com.lorepo.icplayer.client.semi.responsive.StylesDTO;

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
		group.maxScore = maxScore;
		group.scoringType = scoringType;
		group.id = id;
		
		for (int j = 0; j < groupModuleElements.getLength(); j++) {
			Element groupModule = (Element) groupModuleElements.item(j);
			String moduleID = groupModule.getAttribute("moduleID");
			IModuleModel m = page.getModules().getModuleById(moduleID); 
			if(m != null) {
				group.add(m);
			}
		}
		
		NodeList layoutsNode = groupNode.getElementsByTagName("layouts");
		if(layoutsNode != null && layoutsNode.getLength() > 0) {
			Element layouts = (Element)layoutsNode.item(0);
			if(layouts!=null) {
				parseLayouts(layouts, group);
			}
		}
		
		NodeList stylesNode = groupNode.getElementsByTagName("styles");
		if(stylesNode != null && stylesNode.getLength() > 0) {
			Element styles = (Element)stylesNode.item(0);
			if(styles!=null) {
				 parseStyles(styles, group); 
			}
		}
		
		group.initGroupPropertyProvider();
		
		return group;
	}
	
	private void parseStyles(Element xml, Group group) {
		StylesDTO result = SemiResponsiveStyles.parseXML(xml);
		group.setInlineStyles(result.inlineStyles);
		group.setStylesClasses(result.stylesClasses);
	}
	
	private void parseLayouts(Element xml, Group group) {
		NodeList nodes = xml.getChildNodes();
		
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("layout") == 0 && childNode instanceof Element) {
				parseSingleLayout(childNode, group);
			}
		}
	}
	
	private void parseSingleLayout(Node xml, Group group) {
		String id = XMLUtils.getAttributeAsString((Element) xml, "id");
		Boolean isVisible = XMLUtils.getAttributeAsBoolean((Element) xml, "isVisible", true);
		Boolean isModuleVisibleInEditor = XMLUtils.getAttributeAsBoolean((Element) xml, "isModuleVisibleInEditor", true);
		Boolean isLocked = XMLUtils.getAttributeAsBoolean((Element) xml, "isLocked", false);
		Boolean isDiv = XMLUtils.getAttributeAsBoolean((Element) xml, "isDiv", false); 
		ModuleDimensions dimensions = null;
		
		NodeList nodes = xml.getChildNodes();
		for(int i = 0; i < nodes.getLength(); i++){
			Node childNode = nodes.item(i);
			
			if(childNode.getNodeName().compareTo("absolute") == 0 && childNode instanceof Element) {
				dimensions = this.parseAbsoluteLayout(childNode);
			} 
		}
		group.setSemiResponsiveLayoutID(id);
		group.setIsDiv(id, isDiv);
		group.addSemiResponsiveDimensions(id, dimensions);
		group.setIsVisible(id, isVisible);
		group.setIsLocked(id, isLocked);
		group.setIsVisibleInEditor(id, isModuleVisibleInEditor);
	}
	
	
	
	private ModuleDimensions parseAbsoluteLayout(Node node) {
		Element xml = (Element) node;
		
		int left = XMLUtils.getAttributeAsInt(xml, "left");
		int top = XMLUtils.getAttributeAsInt(xml, "top");
		int right = XMLUtils.getAttributeAsInt(xml, "right");
		int bottom = XMLUtils.getAttributeAsInt(xml, "bottom");
		int width = XMLUtils.getAttributeAsInt(xml, "width");
		int height = XMLUtils.getAttributeAsInt(xml, "height");

		return new ModuleDimensions(left, right, top, bottom, height, width);
	}
	
	
	public String toXML() {
		Element groupModule = XMLUtils.createElement("group");
		groupModule.setAttribute("id", id);
		Element scoring = XMLUtils.createElement("scoring");
		scoring.setAttribute("type", String.valueOf(scoringType));
		scoring.setAttribute("max", String.valueOf(maxScore));
		groupModule.appendChild(scoring); 
		Element groupedModulesList = XMLUtils.createElement("groupedModulesList");
		groupModule.appendChild(groupedModulesList);
		
		for(IModuleModel module: this) {
			Element modules = XMLUtils.createElement("groupModule");
			modules.setAttribute("moduleID", module.getId());
			groupedModulesList.appendChild(modules); 
		}
		
		groupModule.appendChild(semiResponsivePositions.toXML());
		groupModule.appendChild(stylesToXML());
		return groupModule.toString();
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
