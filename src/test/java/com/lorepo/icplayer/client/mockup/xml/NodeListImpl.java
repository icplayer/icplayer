package com.lorepo.icplayer.client.mockup.xml;

import org.w3c.dom.Element;

import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;

public class NodeListImpl implements NodeList {

	private org.w3c.dom.NodeList nodeListImpl;
	
	public NodeListImpl(org.w3c.dom.NodeList nodes){
		this.nodeListImpl = nodes;
	}
	
	
	@Override
	public int getLength() {
		return nodeListImpl.getLength();
	}

	@Override
	public Node item(int index) {
		if(nodeListImpl.item(index) instanceof Element){
			return new ElementImpl((Element) nodeListImpl.item(index));
		}
		return new NodeImpl(nodeListImpl.item(index));
	}

}
