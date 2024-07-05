package com.lorepo.icplayer.client.module.skiplink.mocks;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.metadata.IMetadata;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.page.group.GroupPropertyProvider;
import com.lorepo.icplayer.client.module.LayoutDefinition;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.INameValidator;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkItem;
import com.lorepo.icplayer.client.module.skiplink.interfaces.ISkipLinkModule;
import com.lorepo.icplayer.client.semi.responsive.SemiResponsiveStyles;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

public class SkipLinkModuleMockup implements ISkipLinkModule {
    List<ISkipLinkItem> items = new ArrayList<ISkipLinkItem>();

    @Override
    public String getName() {
        return null;
    }

    public void addItem(ISkipLinkItem item) {
        this.items.add(item);
    }

    public String getItemId(int index) {
        return this.items.get(index).getModuleId();
    }

    public String getItemText(int index) {
        return this.items.get(index).getModuleText();
    }

    @Override
    public List<? extends ISkipLinkItem> getItems() {
        return items;
    }

    @Override
    public String getModuleTypeName() {
        return null;
    }

    @Override
    public String getModuleName() {
        return null;
    }

    @Override
    public String getId() {
        return "ModuleID";
    }

    @Override
    public String getButtonType() {
        return null;
    }

    @Override
    public IMetadata getMetadata() {
        return null;
    }

    @Override
    public void setId(String id) {

    }

    @Override
    public void release() {

    }

    @Override
    public String toXML() {
        return null;
    }

    @Override
    public void addNameValidator(INameValidator validator) {

    }

    @Override
    public boolean isLocked() {
        return false;
    }

    @Override
    public void lock(boolean state) {

    }

    @Override
    public boolean isModuleInEditorVisible() {
        return false;
    }

    @Override
    public void setModuleInEditorVisibility(boolean moduleInEditorVisibility) {

    }

    @Override
    public void load(Element node, String baseURL, String version) {

    }

    @Override
    public boolean isTabindexEnabled() {
        return false;
    }

    @Override
    public void setIsTabindexEnabled(boolean value) {

    }

    @Override
    public boolean shouldOmitInKeyboardNavigation() {
        return false;
    }

    @Override
    public void setOmitInKeyboardNavigation(boolean value) {

    }

    @Override
	public boolean shouldOmitInTTS() {
		return false;
	}

	@Override
	public void setOmitInTTS(boolean value) {}

    @Override
    public String getTTSTitle() {
        return "";
    }

    @Override
    public void setTTSTitle(String title) {

    }

    @Override
    public void setContentDefaultLayoutID(String layoutID) {

    }

    @Override
    public void setIsVisible(Boolean isVisible) {

    }

    @Override
    public SemiResponsiveStyles getSemiResponsiveStyles() {
        return null;
    }

    @Override
    public boolean isVisible() {
        return false;
    }

    @Override
    public String getProviderName() {
        return null;
    }

    @Override
    public void addPropertyListener(IPropertyListener listener) {

    }

    @Override
    public void removePropertyListener(IPropertyListener listener) {

    }

    @Override
    public int getPropertyCount() {
        return 0;
    }

    @Override
    public IProperty getProperty(int index) {
        return null;
    }

    @Override
    public void addStyleListener(IStyleListener listener) {

    }

    @Override
    public String getInlineStyle() {
        return null;
    }

    @Override
    public String getStyleClass() {
        return "test-class";
    }

    @Override
    public void setInlineStyle(String inlineStyle) {

    }

    @Override
    public void setStyleClass(String styleClass) {

    }

    @Override
    public String getClassNamePrefix() {
        return null;
    }

    @Override
    public void syncSemiResponsiveStyles(Set<PageLayout> actualSemiResponsiveLayouts) {

    }

    @Override
    public ILayoutDefinition getLayout() {
        return null;
    }

    @Override
    public int getLeft() {
        return 0;
    }

    @Override
    public int getRight() {
        return 0;
    }

    @Override
    public int getTop() {
        return 0;
    }

    @Override
    public int getBottom() {
        return 0;
    }

    @Override
    public int getWidth() {
        return 0;
    }

    @Override
    public int getHeight() {
        return 0;
    }

    @Override
    public void setLeft(int left) {

    }

    @Override
    public void setRight(int left) {

    }

    @Override
    public void setTop(int top) {

    }

    @Override
    public void setBottom(int top) {

    }

    @Override
    public void setWidth(int width) {

    }

    @Override
    public void setHeight(int height) {

    }

    @Override
    public void disableChangeEvent(boolean disable) {

    }

    @Override
    public void changeAbsoluteToRelative(int deltaLeft, int deltaTop) {

    }

    @Override
    public void changeRelativeToAbsolute(int deltaLeft, int deltaTop) {

    }

    @Override
    public void setGroupPropertyProvider(GroupPropertyProvider group) {

    }

    @Override
    public boolean hasGroup() {
        return false;
    }

    @Override
    public void setSemiResponsiveLayoutID(String semiResponsiveLayoutID) {

    }

    @Override
    public HashMap<String, ModuleDimensions> getResponsiveLayouts() {
        return null;
    }

    @Override
    public HashMap<String, Boolean> getResponsiveVisibilityInEditor() {
        return null;
    }

    @Override
    public HashMap<String, Boolean> getResponsiveLocked() {
        return null;
    }

    @Override
    public HashMap<String, LayoutDefinition> getResponsiveRelativeLayouts() {
        return null;
    }

    @Override
    public void addSemiResponsiveDimensions(String name, ModuleDimensions dimensions) {

    }

    @Override
    public void syncSemiResponsiveLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {

    }

    @Override
    public void copyConfiguration(String lastSeenLayout) {

    }

    @Override
    public void translateSemiResponsiveIDs(HashMap<String, String> translationMap) {

    }

    @Override
    public LayoutDefinition getCurrentLayoutDefinition() {
        return null;
    }

    @Override
    public List<String> getNameProperties() {
        return null;
    }

    @Override
    public List<IProperty> getProperties() {
        return null;
    }

    @Override
    public void setContentBaseURL(String baseURL) {
        // TODO Auto-generated method stub
    }

}