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
    return this.editor.canvas._objects.pop();
  }

  /**
   * @return {number}
   */
  getStrokeLength = (): number => {
    return this.editor.canvas._objects.length;
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
}