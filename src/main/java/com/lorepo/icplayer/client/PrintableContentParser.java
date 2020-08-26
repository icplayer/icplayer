package com.lorepo.icplayer.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.user.client.Random;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.ModuleList;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.IPrintableModuleModel;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;
import com.lorepo.icplayer.client.module.api.IModuleModel;

public class PrintableContentParser {
	

	private void randomizePrintables(List<IPrintableModuleModel> printables) {
		int startIndex = 0;
		for (int i = 0; i < printables.size(); i++) {
			IPrintableModuleModel printable = printables.get(i);
			if (printable.isSection() && i > startIndex) {
				randomizePrintableSection(printables, startIndex, i-1);
				startIndex = i;
			}
		}
		randomizePrintableSection(printables, startIndex, printables.size()-1);
	}
	
	private void randomizePrintableSection(List<IPrintableModuleModel> printables, int startIndex, int endIndex) {
		if (startIndex >= endIndex) return;
		List<IPrintableModuleModel> randomizable = new ArrayList<IPrintableModuleModel>();
		for (int i = startIndex; i <= endIndex; i++) {
			IPrintableModuleModel printable = printables.get(i);
			if (printable.getPrintableMode() == PrintableMode.YES_RANDOM) {
				randomizable.add(printable);
			}
		}
		
		for(int index = 0; index < randomizable.size(); index += 1) {  
		    Collections.swap(randomizable, index, index + Random.nextInt(randomizable.size() - index));  
		}
		
		int randomizableIndex = 0;
		for (int i = startIndex; i <= endIndex; i++) {
			IPrintableModuleModel printable = printables.get(i);
			if (printable.getPrintableMode() == PrintableMode.YES_RANDOM) {
				printables.set(i, randomizable.get(randomizableIndex));
				randomizableIndex++;
			}
		}
	}
	
	private IPrintableModuleModel generatePrintableGroup(final Group group, boolean randomizeModules, boolean showAnswers) {
		List<IPrintableModuleModel> groupPrintables = new ArrayList<IPrintableModuleModel>();
		for (int i = 0; i < group.size(); i++) {
			IModuleModel model = group.get(i);
			if (model instanceof IPrintableModuleModel) {
				IPrintableModuleModel printable = (IPrintableModuleModel) model;
				if (printable.getPrintableMode() != PrintableMode.NO) {
					groupPrintables.add(printable);
				}
			}
		}
		Collections.reverse(groupPrintables);
		if (randomizeModules) {
			randomizePrintables(groupPrintables);
		}
		
		String parsed = "";
		for (IPrintableModuleModel printable: groupPrintables) {
			parsed += printable.getPrintableHTML(showAnswers);
		}
		final String finalParsed = parsed;
		
		return new IPrintableModuleModel(){

			@Override
			public String getPrintableHTML(boolean showAnswers) {
				return finalParsed;
			}

			@Override
			public PrintableMode getPrintableMode() {
				return group.getPrintable();
			}

			@Override
			public boolean isSection() {
				return false;
			}
			
		};
	}
	
	public String generatePrintableHTML(Content contentModel, boolean randomizePages, boolean randomizeModules, boolean showAnswers) {
		List<Page> pages = contentModel.getPages().getAllPages();
		String result = generatePrintableHTMLForPages(pages, randomizePages, randomizeModules, showAnswers);
		return result;
	}
	
	
	public String generatePrintableHTMLForPages(List<Page> pages, boolean randomizePages, boolean randomizeModules, boolean showAnswers) {
		String result = "<div>";
		
		if (randomizePages) {
			for(int index = 0; index < pages.size(); index += 1) {  
			    Collections.swap(pages, index, index + Random.nextInt(pages.size() - index));  
			}
		}
		
		List<IPrintableModuleModel> printables = new ArrayList<IPrintableModuleModel>();
		
		for (Page page: pages) {
			List<Group> parsedGroups = new ArrayList<Group>();
			List<IPrintableModuleModel> pagePrintables = new ArrayList<IPrintableModuleModel>();
			ModuleList modules = page.getModules();
			for (int i = 0; i < modules.size(); i++) {
				IModuleModel model = modules.get(i);
				if (model.hasGroup()) {
					Group modelGroup = null;
					for (Group group: page.getGroupedModules()) {
						if (group.contains(model)) {
							modelGroup = group;
						}
					}
					if (modelGroup != null && !parsedGroups.contains(modelGroup)) {
						parsedGroups.add(modelGroup);
						pagePrintables.add(generatePrintableGroup(modelGroup, randomizeModules, showAnswers));
					}
				}else if (model instanceof IPrintableModuleModel) {
					IPrintableModuleModel printable = (IPrintableModuleModel) model;
					if (printable.getPrintableMode() != PrintableMode.NO) {
						pagePrintables.add(printable);
					}
				}
			}
			Collections.reverse(pagePrintables);
			if (randomizeModules) {
				randomizePrintables(pagePrintables);
			}
			printables.addAll(pagePrintables);
		}
		
		for (IPrintableModuleModel printable: printables) {
			result += printable.getPrintableHTML(showAnswers);
		}
		
		result += "</div>";
		return result;
	};
}
