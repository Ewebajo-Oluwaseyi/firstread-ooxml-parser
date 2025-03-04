import * as mammoth from "mammoth";

export default class DocumentParserService {
  static async parseDocument(file) {
    try {
      // Check file type
      if (file.name.endsWith(".xml")) {
        return this.parseXmlDocument(file);
      } else if (file.name.endsWith(".docx")) {
        return this.parseOoxmlDocument(file);
      } else {
        throw new Error(
          "Unsupported file format. Please upload an XML or DOCX file."
        );
      }
    } catch (error) {
      console.error("Error parsing document:", error);
      throw new Error(`Failed to parse document: ${error.message}`);
    }
  }

  static async parseXmlDocument(file) {
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      // Check for parsing errors
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Invalid XML file: " + parserError.textContent);
      }

      // Convert XML to HTML representation
      const htmlContent = this.xmlToHtml(xmlDoc);

      return {
        content: htmlContent,
        structure: this.extractDocumentStructure(htmlContent),
        title: this.extractDocumentTitle(htmlContent, file.name),
      };
    } catch (error) {
      console.error("Error parsing XML document:", error);
      throw new Error(`Failed to parse XML document: ${error.message}`);
    }
  }

  static async parseOoxmlDocument(file) {
    try {
      const result = await mammoth.convertToHtml({
        arrayBuffer: await file.arrayBuffer(),
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Normal'] => p:fresh",
          "p[style-name='List Paragraph'] => ul > li:fresh",
        ],
      });

      return {
        content: result.value,
        messages: result.messages,
        structure: this.extractDocumentStructure(result.value),
        title: this.extractDocumentTitle(result.value, file.name),
      };
    } catch (error) {
      console.error("Error parsing OOXML document:", error);
      throw new Error(`Failed to parse OOXML document: ${error.message}`);
    }
  }

  static xmlToHtml(xmlDoc) {
    let html = '<div class="xml-document">';

    const paragraphs = xmlDoc.getElementsByTagName("w:p");

    for (const paragraph of paragraphs) {
      let textContent = "";
      const runs = paragraph.getElementsByTagName("w:r");

      for (const run of runs) {
        const textNode = run.getElementsByTagName("w:t")[0];
        if (textNode && textNode.textContent) {
          textContent += textNode.textContent + " ";
        }
      }

      const numPr = paragraph.getElementsByTagName("w:numPr")[0];
      if (numPr) {
        html += `<li>${textContent.trim()}</li>`;
      } else {
        html += `<p>${textContent.trim()}</p>`;
      }
    }

    html += "</div>";
    return html;
  }

  static processXmlNode(node, depth) {
    let html = "";
    const nodeName = node.nodeName;

    // Create heading for the node
    // For top-level elements or elements that seem to represent sections
    const isSectionLike = this.isSectionLikeElement(node);

    if (isSectionLike) {
      // Max heading level is h6
      const headingLevel = Math.min(depth + 1, 6);
      let headingText = nodeName;

      // Try to find a title or name attribute or child element
      const titleAttr =
        node.getAttribute("title") ||
        node.getAttribute("name") ||
        node.getAttribute("id");
      if (titleAttr) {
        headingText = titleAttr;
      } else {
        // Look for a title/name/header child element
        const titleElement =
          node.querySelector(":scope > title") ||
          node.querySelector(":scope > name") ||
          node.querySelector(":scope > header");

        if (titleElement && titleElement.textContent) {
          headingText = titleElement.textContent;
        }
      }

      html += `<h${headingLevel} id="section-${this.generateId(
        nodeName,
        depth
      )}">${this.escapeHtml(headingText)}</h${headingLevel}>`;
    }

    // Process attributes as a property list if there are any
    if (node.attributes.length > 0) {
      html += '<div class="xml-attributes">';
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        html += `<div class="xml-attribute"><span class="attr-name">${this.escapeHtml(
          attr.name
        )}</span>: <span class="attr-value">${this.escapeHtml(
          attr.value
        )}</span></div>`;
      }
      html += "</div>";
    }

    // Process child nodes
    if (node.children.length > 0) {
      html += '<div class="xml-children">';
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        html += this.processXmlNode(child, isSectionLike ? depth + 1 : depth);
      }
      html += "</div>";
    } else if (node.textContent && node.textContent.trim()) {
      // If it's a leaf node with text content, display it
      html += `<div class="xml-text">${this.escapeHtml(
        node.textContent.trim()
      )}</div>`;
    }

    return html;
  }

  static isSectionLikeElement(element) {
    const name = element.nodeName.toLowerCase();

    // Common section-like element names
    const sectionNames = [
      "section",
      "chapter",
      "part",
      "div",
      "article",
      "document",
      "header",
      "body",
      "footer",
      "title",
      "heading",
    ];

    // Check if element has certain attributes that suggest it's a section
    const hasIdentifier =
      element.hasAttribute("id") ||
      element.hasAttribute("name") ||
      element.hasAttribute("title");

    // Check if element has section-like child elements
    const hasSubsections =
      element.querySelector(":scope > section") !== null ||
      element.querySelector(":scope > header") !== null ||
      element.querySelector(":scope > title") !== null;

    return (
      sectionNames.includes(name) ||
      hasIdentifier ||
      hasSubsections ||
      element.parentElement === element.ownerDocument.documentElement
    );
  }

  static generateId(baseName, counter) {
    return `${baseName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${counter}`;
  }

  static escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  static extractDocumentTitle(htmlContent, fallbackName) {
    // Try to find first heading
    const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (titleMatch && titleMatch[1]) {
      // Strip any HTML tags from the title
      return titleMatch[1].replace(/<\/?[^>]+(>|$)/g, "");
    }

    // Fallback to filename without extension
    return fallbackName.replace(/\.[^/.]+$/, "");
  }

  static extractDocumentStructure(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Get all headings
    const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    // Root level sections
    const rootSections = [];
    let currentSection = null;
    let sectionStack = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const title = heading.textContent || `Section ${index + 1}`;
      const id = heading.id || `section-${index}`;

      // Assign id to the heading element for navigation if it doesn't have one
      if (!heading.id) {
        heading.id = id;
      }

      const newSection = {
        id,
        title,
        level,
        children: [],
      };

      // Find appropriate parent for this section
      if (sectionStack.length === 0) {
        // First heading or root level
        rootSections.push(newSection);
        sectionStack = [newSection];
        currentSection = newSection;
      } else {
        // Check where this heading belongs in the hierarchy
        while (
          sectionStack.length > 0 &&
          sectionStack[sectionStack.length - 1].level >= level
        ) {
          sectionStack.pop();
        }

        if (sectionStack.length === 0) {
          // This is a root level section
          rootSections.push(newSection);
          sectionStack = [newSection];
        } else {
          // Add as child to the last item in the stack
          sectionStack[sectionStack.length - 1].children.push(newSection);
          sectionStack.push(newSection);
        }

        currentSection = newSection;
      }
    });

    return rootSections;
  }
}
