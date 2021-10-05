export interface ColorType {
    a: number;
    r: number;
    g: number;
    b: number;
}

export class ExtractionConversion {
    private COLOR_SET: number = 255;
    constructor() {
    }
    public extractor(selection, drillType?, selectionType?): any {
        return selection.reduce((acc, curr) => {
            if (curr.type == drillType) {
                return this.extractor(curr.children, drillType, selectionType);
            }
            // the could be a text node... sure why not?
            console.log(selectionType)
            if (curr.type == selectionType) {
                const name = (curr.name).split('/')[0];
                const objWithName = Object.assign({name: name}, ...curr.fills);
                const objWithWeight = Object.assign({weight: (curr.name).split('/')[1]}, objWithName);
                acc.push(objWithWeight);
            }
            return acc;
        }, []);
    };

    public convertColor = (colorObj: ColorType): string => {
        const {a, r, g, b} = colorObj;
        let red: number;
        let green: number;
        let blue: number;
        let alpha: number;
        red = parseInt((r * this.COLOR_SET).toString(), 0);
        green = parseInt((g * this.COLOR_SET).toString(), 0);
        blue = parseInt((b * this.COLOR_SET).toString(), 0);
        return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)}`;
    };
}
