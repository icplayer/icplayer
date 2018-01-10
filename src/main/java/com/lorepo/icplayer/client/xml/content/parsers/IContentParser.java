package com.lorepo.icplayer.client.xml.content.parsers;

import java.util.ArrayList;

import com.lorepo.icplayer.client.xml.IParser;

public interface IContentParser extends IParser{
	public void setPagesSubset(ArrayList<Integer> pagesSubset);
}
