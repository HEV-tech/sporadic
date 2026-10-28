/**
 * Перевод логотипа в символы — целиком на клиенте, без сборки и внешних утилит.
 *
 * Логотип — чёрно-белая графика с прозрачным фоном. Считаем, сколько «белого»
 * приходится на каждую клетку символьной сетки, слегка размываем результат
 * (иначе тонкие линии рассыпаются в шум) и раскладываем по градациям.
 * Получается тот же образ, но набранный символами.
 */

export const DEFAULT_RAMP = ' .:-=+*#%@'

/** Отношение ширины знака к высоте строки у моноширинного шрифта.
 *  Подобрано под эталонную эмблему: 115 колонок на 61 строку. */
export const CHAR_ASPECT = 0.462

/** Сколько пикселей растра приходится на одну клетку при отрисовке. */
export const SAMPLES_PER_CELL = 6

function gaussianKernel(sigma) {
  const radius = Math.max(1, Math.ceil(sigma * 2))
  const kernel = []
  let sum = 0
  for (let i = -radius; i <= radius; i += 1) {
    const value = Math.exp(-(i * i) / (2 * sigma * sigma))
    kernel.push(value)
    sum += value
  }
  return kernel.map((value) => value / sum)
}

/** Размытие поля по сетке: два прохода одномерным ядром. */
function blurField(field, sigma) {
  if (sigma <= 0) return field

  const kernel = gaussianKernel(sigma)
  const radius = (kernel.length - 1) / 2
  const rows = field.length
  const columns = field[0].length
  const clamp = (value, max) => (value < 0 ? 0 : value > max ? max : value)

  const horizontal = field.map((row) => {
    const line = new Float32Array(columns)
    for (let x = 0; x < columns; x += 1) {
      let sum = 0
      for (let k = -radius; k <= radius; k += 1) {
        sum += row[clamp(x + k, columns - 1)] * kernel[k + radius]
      }
      line[x] = sum
    }
    return line
  })

  const vertical = []
  for (let y = 0; y < rows; y += 1) {
    const line = new Float32Array(columns)
    for (let x = 0; x < columns; x += 1) {
      let sum = 0
      for (let k = -radius; k <= radius; k += 1) {
        sum += horizontal[clamp(y + k, rows - 1)][x] * kernel[k + radius]
      }
      line[x] = sum
    }
    vertical.push(line)
  }
  return vertical
}

/**
 * Границы непрозрачной части: логотип лежит на прозрачном фоне с полями,
 * и без обрезки половина сетки уходит на пустоту.
 */
function alphaBounds(image) {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth || image.width
  canvas.height = image.naturalHeight || image.height

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null
  context.drawImage(image, 0, 0)

  const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
  let left = canvas.width
  let top = canvas.height
  let right = -1
  let bottom = -1

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      if (data[(y * canvas.width + x) * 4 + 3] <= 10) continue
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }

  if (right < 0) return null
  return { left, top, width: right - left + 1, height: bottom - top + 1 }
}

/**
 * Рисует обрезанный логотип в canvas так, чтобы на клетку приходилось
 * несколько пикселей. Возвращает контекст и размеры либо null.
 */
export function rasterize(image, targetWidth) {
  const bounds = alphaBounds(image)
  if (!bounds) return null

  const width = Math.max(1, Math.round(targetWidth))
  const height = Math.max(1, Math.round((width * bounds.height) / bounds.width))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    bounds.left,
    bounds.top,
    bounds.width,
    bounds.height,
    0,
    0,
    width,
    height,
  )

  return { context, width, height }
}

/**
 * Считает строки символьной эмблемы по растру.
 * Возвращает массив строк без хвостовых пробелов.
 */
export function buildRows(context, width, height, options = {}) {
  const {
    columns = 115,
    ramp = DEFAULT_RAMP,
    gamma = 1.28,
    blur = 0,
    aspect = CHAR_ASPECT,
  } = options

  const rows = Math.max(1, Math.round(columns * (height / width) * aspect))
  const cellWidth = width / columns
  const cellHeight = height / rows
  const { data } = context.getImageData(0, 0, width, height)

  let field = Array.from({ length: rows }, () => new Float32Array(columns))

  for (let y = 0; y < height; y += 1) {
    const cellY = Math.min(rows - 1, Math.floor(y / cellHeight))
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4
      const alpha = data[offset + 3] / 255
      if (alpha === 0) continue

      const luminance =
        (0.299 * data[offset] + 0.587 * data[offset + 1] + 0.114 * data[offset + 2]) / 255
      field[cellY][Math.min(columns - 1, Math.floor(x / cellWidth))] += alpha * luminance
    }
  }

  const normalize = 1 / (cellWidth * cellHeight)
  field = field.map((row) => row.map((value) => value * normalize))
  field = blurField(field, blur)

  const last = ramp.length - 1
  return field.map((row) => {
    let line = ''
    for (let x = 0; x < columns; x += 1) {
      const value = Math.min(1, Math.max(0, row[x])) ** gamma
      line += ramp[Math.round(value * last)]
    }
    return line.replace(/\s+$/, '')
  })
}
