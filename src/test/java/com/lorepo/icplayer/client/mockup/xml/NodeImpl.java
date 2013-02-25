package com.lorepo.icplayer.client.mockup.xml;

import org.apache.commons.lang.NotImplementedException;

import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.NamedNodeMap;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;

public class NodeImpl implements Node {

	private org.w3c.dom.Node nodeImpl;
	
	
	public NodeImpl(org.w3c.dom.Node item) {
		this.nodeImpl = item;
	}

	@Override
	public Node appendChild(Node newChild) {
		throw new NotImplementedException();
	}

	@Override
	public Node cloneNode(boolean deep) {
		throw new NotImplementedException();
	}

	@Override
	public NamedNodeMap getAttributes() {
		throw new NotImplementedException();
	}

	@Override
	public NodeList getChildNodes() {
		throw new NotImplementedException();
	}

	@Override
	public Node getFirstChild() {
		throw new NotImplementedException();
	}

	@Override
	public Node getLastChild() {
		throw new NotImplementedException();
	}

	@Override
	public String getNamespaceURI() {
		throw new NotImplementedException();
	}

	@Override
	public Node getNextSibling() {
		throw new NotImplementedException();
	}

	@Override
	public String getNodeName() {
		return nodeImpl.getNodeName();
	}

	@Override
	public short getNodeType() {
		return nodeImpl.getNodeType();
	}

	@Override
	public String getNodeValue() {
		return nodeImpl.getNodeValue();
	}

	@Override
	public Document getOwnerDocument() {
		throw new NotImplementedException();
	}

	@Override
	public Node getParentNode() {
		throw new NotImplementedException();
	}

	@Override
	public String getPrefix() {
		throw new NotImplementedException();
	}

	@Override
	public Node getPreviousSibling() {
		throw new NotImplementedException();
	}

	@Override
	public boolean hasAttributes() {
		throw new NotImplementedException();
	}

	@Override
	public boolean hasChildNodes() {
		throw new NotImplementedException();
	}

	@Override
	public Node insertBefore(Node newChild, Node refChild) {
		throw new NotImplementedException();
	}

	@Override
	public void normalize() {
		throw new NotImplementedException();
	}

	@Override
	public Node removeChild(Node oldChild) {
		throw new NotImplementedException();
	}

	@Override
	public Node replaceChild(Node newChild, Node oldChild) {
		throw new NotImplementedException();
	}

	@Override
	public void setNodeValue(String nodeValue) {
		throw new NotImplementedException();
	}

}
