package com.lorepo.icplayer.client.mockup.xml;

import org.w3c.dom.CDATASection;

import com.google.gwt.xml.client.Attr;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NamedNodeMap;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icf.utils.StringUtils;

public class ElementImpl implements Element{

	private org.w3c.dom.Element elementImpl;
	
	
	public ElementImpl(org.w3c.dom.Element element) {
		this.elementImpl = element;
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
		return new NodeListImpl(elementImpl.getChildNodes());
	}

	@Override
	public Node getFirstChild() {
		if(elementImpl.getFirstChild() instanceof CDATASection){
			return new CDATASectionImpl((CDATASection) elementImpl.getFirstChild());
		}
		
		return new NodeImpl(elementImpl.getFirstChild());
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
		return elementImpl.getNodeName();
	}

	@Override
	public short getNodeType() {
		return elementImpl.getNodeType();
	}

	@Override
	public String getNodeValue() {
		throw new UnsupportedOperationException();
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

	@Override
	public String getAttribute(String name) {
		return StringUtils.escapeHTML(elementImpl.getAttribute(name));
	}

	@Override
	public Attr getAttributeNode(String name) {
		throw new UnsupportedOperationException();
	}

	@Override
	public NodeList getElementsByTagName(String name) {
		return new NodeListImpl(elementImpl.getElementsByTagName(name));
	}

	@Override
	public String getTagName() {
		throw new UnsupportedOperationException();
	}

	@Override
	public boolean hasAttribute(String name) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void removeAttribute(String name) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void setAttribute(String name, String value) {
		throw new UnsupportedOperationException();
	}
	
	@Override
	public String toString() {
		return elementImpl.toString();
	}
}
