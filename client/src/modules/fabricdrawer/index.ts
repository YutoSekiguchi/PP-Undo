import { TAddText } from "@/@types/fabricdrawer";
import { fabric } from "fabric";
import { FabricJSEditor } from "fabricjs-react"

/**
 * @class fabric-jsの機能
 */
export class FabricDrawer {
  editor: FabricJSEditor;

  constructor(editor: FabricJSEditor) {
    this.editor = editor;
  }
  /**
   * @param {string} [svg]
   */
  setSVGFromString = (
    svg: string,
  ) => {
    fabric.loadSVGFromString(
      svg,
      (objects: fabric.Object[], _options: any) => {
        this.editor.canvas._objects.splice(0, this.editor.canvas._objects.length);
        // editor.canvas.backgroundImage = objects[0];
        const newObj = objects.filter((_, index) => index !== 0);
        newObj.forEach((object) => {
          this.editor.canvas.add(object);
        });
        this.editor.canvas.renderAll();
      }
    )
  }

  /**
   * @return {string} svg
  */
  getSVG = (): string | undefined => {
    const svg = this.editor.canvas.toSVG();
    return svg;
  }

  /**
   * @returns {string}
   */
  getImg = (): string => {
    const img = this.editor.canvas.toDataURL();
    return img
  }

  /**
   * @param {string} [color]
  */
  changeColor = (
    color: string,
  ) => {
    this.editor.canvas.freeDrawingBrush.color = color;
    this.editor.setStrokeColor(color);
  }

  /**
   * @param {string} [imgUrl]
  */
  setBackgroundImage = (imgUrl: string) => {
    fabric.Image.fromURL(
      imgUrl,
      (image: fabric.Image) => {
        this.editor.canvas.setBackgroundImage(
          image,
          this.editor.canvas.renderAll.bind(this.editor.canvas)
        );
      }
    );
  }

  setDrawingMode = () => {
    this.editor.canvas.isDrawingMode =  true;
  }

  setPointingMode = () => {
    this.editor.canvas.isDrawingMode =  false;
  }

  /**
   * @param {number | undefined} [width]
   * @param {number | undefined} [height]
  */
  setCanvasSize = (
    width?: number,
    height?: number,
  ) => {
    if (width !== undefined) {
      this.editor.canvas.setHeight(width);
    }
    if (height !== undefined) {
      this.editor.canvas.setHeight(height);
    }
  }

  reDraw = () => {
    this.editor.canvas.renderAll();
  }

  /**
   * @param {number} [width]
   */
  setStrokeWidth = (width: number) => {
    this.editor.canvas.freeDrawingBrush.width = width;
  }

  clear = () => {
    this.editor.canvas._objects.splice(0, this.editor.canvas._objects.length);
    this.reDraw();
  }

  /**
   * @param {fabric.Object} [stroke]
   */
  addStroke = (
    stroke: fabric.Object,
  ) => {
    this.editor.canvas.add(stroke);
  }

  /**
   * @param {fabric.Object} [stroke]
   */
  removeStroke = (
    stroke: fabric.Object,
  ) => {
    this.editor.canvas.remove(stroke);
  }

  /**
   * @return {fabric.Object}
   */
  getSelectedObjects = (): fabric.Object | null | undefined => {
    return this.editor.canvas.getActiveObject();
  }

  removeSelectedStrokes = () => {
    const obj = this.getSelectedObjects();
    if (obj !== null && obj !== undefined) {
      this.removeStroke(obj);
    }
  }

  /**
   * @return {fabric.Object}
   */
  getFinalStroke = (): fabric.Object | undefined => {
    return this.editor.canvas._objects[this.editor.canvas._objects.length - 1];
  }

  /**
   * @return {number}
   */
  getStrokeLength = (): number => {
    return this.editor.canvas._objects.length;
  }

  /**
   * @param {number} [index]
   */
  getStroke = (index: number): fabric.Object => {
    return this.editor.canvas._objects[index];
  }
  
  /**
   * @return {fabric.Object[]}
   */
  getAllStrokes = (): fabric.Object[] => {
    return JSON.parse(JSON.stringify(this.editor.canvas._objects));
  }

  /**
   * @return {Array}
   */
  getObjectPaths = (): any[] => {
    const obj: any = this.editor.canvas.getObjects();
    const res = [];
    for(var i=0; i<obj.length; i++) {
      res.push(obj[i].path);
    }
    return res;
  }

  /**
   * @param {TAddText} [{}]
   */
  addText = ({mode, text}: TAddText) => {
    switch (mode) {
      case "text":
        if (text !== undefined) {
          this.editor.addText(text);
        }
      case "circle":
        this.editor.addCircle();
      case "line":
        this.editor.addLine();
      case "rect":
        this.editor.addRectangle();
      default:
        return;
    }
  }


  /**
   * @param {number[]} [indexList]
   */
  changeStrokesColorToLight = (indexList: number[]) => {
    indexList.map((index: number, _: number) => {
      switch (this.editor.canvas._objects[index].stroke?.length) {
        case 4:
          this.editor.canvas._objects[index].set({stroke: `${this.editor.canvas._objects[index].stroke}2`});
        case 7:
          this.editor.canvas._objects[index].set({stroke: `${this.editor.canvas._objects[index].stroke}22`});
        default:
          break;
      }
    })
    this.reDraw();
  }

  /**
   * @param {number[]} [lowerIndexList]
   * @param {number[]} [newLowerIndexList]
   */
  changeStrokesColorToDark = (
    lowerIndexList: number[],
    newLowerIndexList: number[]
  ) => {
    lowerIndexList.map(index => {
      if (!newLowerIndexList.includes(index)) {
        const color = this.editor.canvas._objects[index].stroke;
        switch (color?.length) {
          case 5:
            if(color.slice(-1) != "0") {
              this.editor.canvas._objects[index].set({stroke: color.slice(0, -1)});
            }
          case 9:
            if (color.slice(-2) != "00") {
              this.editor.canvas._objects[index].set({stroke: color.slice(0, -2)});
            }
          default:
            break;
        }
      }
    })
    this.reDraw();
  }

  clearStrokesColor = () => {
    // 逆順じゃないと配列がどんどん小さくなって変になる
    for(var i=this.editor.canvas._objects.length - 1; i >= 0; i-- ) {
      const obj = this.editor.canvas._objects[i];
      switch (obj.stroke?.length) {
        case 5:
          if(obj.stroke.slice(-1) != "0") {
            this.editor.canvas.remove(obj)
          }
        case 9:
          if(obj.stroke.slice(-2) != "00") {
            this.editor.canvas.remove(obj)
          }
      }
    }
  }

  /**
   * @param {number} pressure
   * @description これ破壊的変更すぎてやばいからいつか直せたら直して
   */
  setPressureToStroke = (pressure: number) => {
    Object.assign(this.editor.canvas._objects[this.editor.canvas._objects.length - 1], { pressure: pressure });
  }

  /**
   * @return {number[]}
   */
  getPressureList = (): number[] => {
    const res: number[] = [];
    this.editor.canvas._objects.map((object: any, _: number) => {
      res.push(object.pressure);
    })
    return res;
  }
}