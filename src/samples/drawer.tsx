import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import _ from 'lodash'

type TPoint = {
  x: number, y: number
}
type TRect = TPoint & {
  width: number
  height: number
}

export default () => {
  const refCanvas = useRef() as MutableRefObject<HTMLCanvasElement>
  const [context, setContext] = useState(null as CanvasRenderingContext2D | null)
  const [points, setPoints] = useState(new Array<TPoint>())
  const [caption, setCaption] = useState('あいうえおかきくけこさしすせそたちつてと')
  const [textRect, setTextRect] = useState({} as TRect)

  useEffect(() => {
    const canvas = refCanvas.current
    const ctx = canvas.getContext("2d")
    setContext(ctx)
  }, [])

  const getPolygonCentroid = (_pts: TPoint[]): TPoint => {
    const pts = _pts.map(i => i)
    const first = pts[0],
      last = pts[pts.length - 1];
    if (first.x != last.x || first.y != last.y) pts.push(first);
    const nPts = pts.length;
    let twicearea = 0,
      x = 0,
      y = 0,
      p1,
      p2,
      f;
    for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
      p1 = pts[i];
      p2 = pts[j];
      f =
        (p1.y - first.y) * (p2.x - first.x) - (p2.y - first.y) * (p1.x - first.x);
      twicearea += f;
      x += (p1.x + p2.x - 2 * first.x) * f;
      y += (p1.y + p2.y - 2 * first.y) * f;
    }
    f = twicearea * 3;
    return { x: x / f + first.x, y: y / f + first.y }
  };

  const getRectFromCentroid = (x: number, y: number, width: number, height: number, fontSize: number, caption: string, centroid: TPoint) => {
    const captionLength = caption.length
    const textWidth = captionLength * fontSize > width ? width : captionLength * fontSize
    const textHeight = Math.ceil(captionLength / (textWidth / captionLength)) * fontSize
    return {
      vertically: true,
      x: (centroid.x - textWidth / 2) < x ? x : (centroid.x - textWidth / 2),
      width: textWidth,
      y: (centroid.y - textHeight / 2) < y ? y : (centroid.y - textHeight / 2),
      height: textHeight,
    }
  }
  const fontSize = 10
  const lineHeight = 1.1
  const fontHeight = Math.ceil(fontSize * lineHeight)

  const clearCanvas = (ctx: CanvasRenderingContext2D) => ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)

  const draw = (ctx: CanvasRenderingContext2D, points: TPoint[]) => {
    if (points.length === 0) return
    ctx.lineWidth = 1;
    points.reduce((prev: TPoint | null, curr: TPoint) => {
      ctx.strokeStyle = 'blue'
      ctx.beginPath()
      ctx.arc(curr.x, curr.y, 2, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
      ctx.stroke();
      if (prev) {
        ctx.beginPath()
        ctx.strokeStyle = 'lightblue'
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(curr.x, curr.y)
        ctx.stroke();
      }
      return curr
    }, null)
    ctx.strokeStyle = 'lightblue'
    ctx.lineTo(points[0].x, points[0].y)
    ctx.stroke();
    ctx.closePath()
    const center: TPoint = getPolygonCentroid(points)
    ctx.beginPath()
    ctx.strokeStyle = 'red'
    ctx.arc(center.x, center.y, 2, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    ctx.stroke();
    const minCoordinate: TPoint = {
      x: (_.minBy(points, 'x') || { x: 10 }).x,
      y: (_.minBy(points, 'y') || { y: 10 }).y,
    };
    const maxCoordinate: TPoint = {
      x: (_.maxBy(points, 'x') || { x: 10 }).x,
      y: (_.maxBy(points, 'y') || { y: 10 }).y,
    };

    let textCoordinate: TRect = { x: 0, y: 0, width: 0, height: 0 };
    let textPattern: Number = 1
    switch (textPattern) {
      case 1:
        textCoordinate = getRectFromCentroid(minCoordinate.x, minCoordinate.y, Math.floor(maxCoordinate.x - minCoordinate.x), Math.floor(maxCoordinate.y - minCoordinate.y), fontHeight, caption || '', center)
        break;
      case 2:
        textCoordinate = {
          x: Math.floor(minCoordinate.x),
          y: Math.floor(minCoordinate.y),
          width: Math.floor(maxCoordinate.x - minCoordinate.x),
          height: Math.floor(maxCoordinate.y - minCoordinate.y),
        } || { x: 10, y: 10 };
        break;
    }
    ctx.beginPath()
    ctx.strokeStyle = 'red'
    setTextRect(textCoordinate)
    ctx.rect(textCoordinate.x, textCoordinate.y, textCoordinate.width, textCoordinate.height)
    ctx.stroke();

  }

  return (
    <>
      <canvas
        width={800}
        height={400}
        ref={refCanvas}
        onClick={(e: React.MouseEvent) => {
          const newPoints = [...points, { x: e.clientX, y: e.clientY }]
          if (context) {
            clearCanvas(context)
            draw(context, newPoints)
          }
          setPoints(newPoints)
        }}></canvas>
      <button onClick={() => {
        if (context) clearCanvas(context)
        setPoints(new Array<TPoint>())
      }}>clear</button>
      <input type="text" value={caption} onChange={(e: React.ChangeEvent<any>) => {
        setCaption(e.target.value)
        if (context) {
          clearCanvas(context)
          draw(context, points)
        }
      }}></input>
      <p>---</p>
      <svg x="0" y="0" width="800" height="600">
        {textRect && <foreignObject
          x={textRect.x}
          y={textRect.y}
          width={textRect.width}
          height={textRect.height}
          style={{}}
        >
          <div
            id="myDiv"
            style={{
              display: "inline-block",
              wordBreak: "break-all",
              fontSize: fontSize,
              lineHeight: `${lineHeight * 100}%`,
              textAlign: "center",
              verticalAlign: "top",
              paddingTop: 0,
              width: '100%',
              backgroundColor: 'yellow'
              //border: 'solid 1px #0000ff',
            }}
          >
            {caption}
          </div>
        </foreignObject>}
        <polygon
          points={points.reduce((prev: string, curr: TPoint, idx) => prev + (idx === 0 ? '' : ' ') + `${curr.x},${curr.y}`, '')}
          style={{
            fill: 'red',
            fillOpacity: 0.1,
            stroke: 'black',
            strokeWidth: 1,
          }}
        />
      </svg>
    </>
  );
}
