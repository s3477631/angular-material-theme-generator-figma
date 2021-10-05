// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
import {ExtractionConversion} from './ExtractionConversion';
// This shows the HTML page in "ui.html".

figma.showUI(__html__, {width: 400, height: 300 });

const enum SELECTION_TYPE {
	'vector' = 'VECTOR',
	'rectangle' = 'RECTANGLE'
}


let selectionType = SELECTION_TYPE.vector;

const generateCode = (paletteName, palette): string => {
	return `$${paletteName}: (
    ${Object.keys(palette).map((key, index) => `${key}:${palette[key]}\n`)}
 );
 `
}
const setSelectionType = (selection: string) => {
	if(selection == 'vector') {
		selectionType = SELECTION_TYPE.vector;
	}
	if(selection == 'rectangle') {
		selectionType = SELECTION_TYPE.rectangle;
	}
}

const createStyleCode = (message) => {
	const rawValues = JSON.parse(message);
	const rawObject = Object.values(rawValues)[0];
	console.log(rawObject)
	const paletteName = Object.keys(rawObject).toString();
	const colorValues = Object.entries(rawObject)
	const palette = colorValues[0][1];
	figma.ui.postMessage(JSON.stringify({code: `${generateCode(paletteName, palette)}`}));
}

const filterMessage = (message) => {
	const filterType = Object.keys(JSON.parse(message)).toString();
	if(filterType === "selectableType") {
		setSelectionType(Object.values(JSON.parse(message)).toString())
	}
	if(filterType === "paletteUpdate") {
		createStyleCode(message);
	}
}

figma.ui.onmessage = (message) => {
	filterMessage(message);
};

figma.on('selectionchange', () => {
	console.log(figma.currentPage.selection)
	const selectedChildren = utility.extractor(figma.currentPage.selection, 'GROUP', selectionType)
	selectedChildren.reverse().forEach((selectedColor) => {
		const hex = utility.convertColor(selectedColor.color);
		figma.ui.postMessage(JSON.stringify({color: `${hex}`}));
	});
});


const utility = new ExtractionConversion()
