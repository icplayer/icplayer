package com.lorepo.icplayer.client.mockup.xml;

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
		throw new UnsupportedOperationException();
	}

	@Override
	public Node cloneNode(boolean deep) {
		throw new UnsupportedOperationException();
	}

	@Override
	public NamedNodeMap getAttributes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public NodeList getChildNodes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getFirstChild() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getLastChild() {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getNamespaceURI() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getNextSibling() {
		throw new UnsupportedOperationException();
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
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getParentNode() {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getPrefix() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node getPreviousSibling() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean hasAttributes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean hasChildNodes() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node insertBefore(Node newChild, Node refChild) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void normalize() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node removeChild(Node oldChild) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Node replaceChild(Node newChild, Node oldChild) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void setNodeValue(String nodeValue) {
		throw new UnsupportedOperationException();
	}

}
