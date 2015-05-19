package com.lorepo.icplayer.client.module;

import java.util.LinkedList;
import java.util.List;

import com.lorepo.icf.utils.StringUtils;

public class ModuleUtils {
	
	public static List<String> getListFromRawText(String rawText) {
		String worksWith = StringUtils.unescapeXML(rawText);
		
		List<String> modules = new LinkedList<String>();
		
		if (rawText == null || rawText.equals("")) {
			return modules;
		}
		
		for (String moduleID : worksWith.split(";")) {
			moduleID = moduleID.trim();
			if (!moduleID.equals("")) {
				modules.add(moduleID.trim());
			}
		}
		
		return modules;
	}

}
