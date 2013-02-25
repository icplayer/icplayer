package com.lorepo.icplayer.client.mockup.xml;

import org.apache.commons.lang.NotImplementedException;
import org.w3c.dom.CDATASection;

import com.google.gwt.xml.client.Attr;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NamedNodeMap;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;

public class ElementImpl implements Element{

	private org.w3c.dom.Element elementImpl;
	
	
	public ElementImpl(org.w3c.dom.Element element) {
		this.elementImpl = element;
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
		return elementImpl.getNodeName();
	}

	@Override
	public short getNodeType() {
		throw new NotImplementedException();
	}

	@Override
	public String getNodeValue() {
		throw new NotImplementedException();
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

	@Override
	public String getAttribute(String name) {
		return elementImpl.getAttribute(name);
	}

	@Override
	public Attr getAttributeNode(String name) {
		throw new NotImplementedException();
	}

	@Override
	public NodeList getElementsByTagName(String name) {
		return new NodeListImpl(elementImpl.getElementsByTagName(name));
	}

	@Override
	public String getTagName() {
		throw new NotImplementedException();
	}

	@Override
	public boolean hasAttribute(String name) {
		throw new NotImplementedException();
	}

	@Override
	public void removeAttribute(String name) {
		throw new NotImplementedException();
	}

	@Override
	public void setAttribute(String name, String value) {
		throw new NotImplementedException();
	}

}
