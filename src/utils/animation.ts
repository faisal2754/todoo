export const col = function (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: string | number,
  g: string | number,
  b: string | number
) {
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
  ctx.fillRect(x, y, 1, 1)
}

export const R = function (x: number, y: number, t: number) {
  return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t))
}

export const G = function (x: number, y: number, t: number) {
  return Math.floor(
    192 +
      64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
  )
}

export const B = function (x: number, y: number, t: number) {
  return Math.floor(
    192 +
      64 *
        Math.sin(
          5 * Math.sin(t / 9) +
            ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
        )
  )
}
