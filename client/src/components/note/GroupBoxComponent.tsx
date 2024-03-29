import { TGroupBox } from "@/@types/note"
import { useEffect, useState } from "react";

interface Props {
  rectangle: TGroupBox;
  basePressure: number;
}

export const GroupBoxComponent = (props: Props) => {

  const interpolateColor = (value: number) => {
    // 色相（Hue）を計算し、0から240の範囲にマッピング
    const hue = (1 - value) * 240;
    // HSLカラーモデルを使用して色を生成
    const hslColor = `hsla(${hue}, 100%, 50%, 50%)`;
    return hslColor;
  }

  const { rectangle, basePressure } = props;
  const [style, setStyle] = useState<React.CSSProperties>({
    pointerEvents: 'none',
    position: "absolute",
    display: (rectangle.left !== null && rectangle.top !== null && rectangle.right !== null && rectangle.bottom !== null)? "block": "none",
    left: rectangle.left !== null? rectangle.left-15: 0,
    top: rectangle.top !== null? rectangle.top-15: 0,
    width: (rectangle.right !== null && rectangle.left !== null)? rectangle.right - rectangle.left+30: 0,
    height: (rectangle.bottom !== null && rectangle.top !== null)? rectangle.bottom - rectangle.top+30: 0,
    border: `5px solid ${interpolateColor(basePressure)}`,
    zIndex: 9999,
  });
  useEffect(() => {
    setStyle({
      pointerEvents: 'none',
      position: "absolute",
      display: (rectangle.left !== null && rectangle.top !== null && rectangle.right !== null && rectangle.bottom !== null)? "block": "none",
      left: rectangle.left !== null? rectangle.left-15: 0,
      top: rectangle.top !== null? rectangle.top-15: 0,
      width: (rectangle.right !== null && rectangle.left !== null)? rectangle.right - rectangle.left+30: 0,
      height: (rectangle.bottom !== null && rectangle.top !== null)? rectangle.bottom - rectangle.top+30: 0,
      border: `5px solid ${interpolateColor(basePressure)}`,
      zIndex: 9999,
    })
  }, [rectangle])
  return <div style={style}></div>
}