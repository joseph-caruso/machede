const fs = require('fs');

function loadPage (pageName) {
  let page = document.getElementById('page');

  // Remove all current page content if it already exists
  if (page !== undefined) {
    // While the page still has elements, clear them.
    // NOTE: Do not change this to `.innerHTML = "";`, this method is faster.
    while (page.firstChild) {
      page.removeChild(page.firstChild);
    }
  }

  page.appendChild(loadPageAsElement(pageName));
}

function loadPageAsElement (pageName) {
  let path = 'content/'+pageName+'/layout.xml';
  let parser = new DOMParser();

  if (fs.existsSync(path)) {
    // Start with the root <layout> node of the document
    let layout = parser.parseFromString(fs.readFileSync(path, 'utf8'), "text/xml").getElementsByTagName('layout')[0];

    // Make sure layout.xml has a root <layout> node
    if (layout !== undefined) {
      let page = document.createElement('div');
      page.className = 'page';

      // Convert all subsequent nodes
      for (node of layout.childNodes) {
        // Convert node to element and append to root element
        page.appendChild(elementFromNode(pageName, node));
      }

      return page;
    }
  }

  // To prevent errors, return blank page
  let page = document.createElement('div');
  page.id = 'page';
  return page;
};

function elementFromNode (pageName, node) {
  let element;

  switch (node.tagName) {
    // <background-image content="imageName"/>
    case 'background-image':
      element = document.createElement('img');
      element.className = 'background-image';
      let contentPath = 'content/'+pageName+'/'+node.getAttribute('content');
      let svgPath = contentPath+'.svg';
      let bmpPath = contentPath+'.bmp';
      let pngPath = contentPath+'.png';
      let jpgPath = contentPath+'.jpg';
      // Try from highest- to lowest-quality format
      if (fs.existsSync(svgPath))
        element.src = svgPath;
      if (fs.existsSync(bmpPath))
        element.src = bmpPath;
      else if (fs.existsSync(pngPath))
        element.src = pngPath;
      else if (fs.existsSync(jpgPath))
        element.src = jpgPath;
      break;
    // <container>...</container>
    case 'container':
      element = document.createElement('div');
      element.className = 'container';
      break;
    // Skip all undefined type
    default:
      element = document.createElement('div');
      element.innerHTML = 'error';
      break;
  }
  // Convert all child nodes to elements and append to parent element
  for (child of node.childNodes) {
    element.appendChild(elementFromNode(pageName, child));
  }

  return element;
}

module.exports = {
  loadPage: loadPage,
  loadPageAsElement: loadPageAsElement
};
