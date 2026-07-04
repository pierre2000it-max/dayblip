export interface ShareImageStat {
  label: string
  value: string
}

export interface ShareImageOptions {
  title: string
  primaryStat: string
  primaryLabel: string
  stats: ShareImageStat[]
  tagline: string
  toolUrl: string
  filename?: string
  /** Optional week grid for Life in Weeks tool */
  grid?: {
    weeksLived: number
    weeksTotal: number
    cols: 52
    rows: number
  }
}

export function generateShareImage(opts: ShareImageOptions): void {
  const {
    title, primaryStat, primaryLabel, stats, tagline, toolUrl,
    filename = "dayblip-result.png", grid,
  } = opts

  const SIZE = 1080
  const canvas = document.createElement("canvas")
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext("2d")!

  // ── Background ────────────────────────────────────────────────
  ctx.fillStyle = "#0f1117"
  ctx.fillRect(0, 0, SIZE, SIZE)

  const grad = ctx.createLinearGradient(0, 0, SIZE * 0.6, SIZE * 0.4)
  grad.addColorStop(0, "rgba(15,52,96,0.5)")
  grad.addColorStop(1, "rgba(15,17,23,0)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, SIZE, SIZE)

  const PAD = 64
  const FONT = "system-ui,sans-serif"

  // ── Top bar ───────────────────────────────────────────────────
  ctx.textBaseline = "top"

  ctx.font = `bold 30px ${FONT}`
  ctx.fillStyle = "#ffffff"
  ctx.textAlign = "left"
  ctx.fillText(title, PAD, PAD)

  ctx.font = `bold 26px ${FONT}`
  ctx.fillStyle = "#e8445a"
  ctx.textAlign = "right"
  ctx.fillText("Dayblip", SIZE - PAD, PAD)

  const DIVIDER_Y = PAD + 52
  ctx.strokeStyle = "rgba(255,255,255,0.07)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(PAD, DIVIDER_Y)
  ctx.lineTo(SIZE - PAD, DIVIDER_Y)
  ctx.stroke()

  // ── Body ──────────────────────────────────────────────────────
  if (grid) {
    // GRID LAYOUT — compact stat + week grid below
    ctx.font = `bold 84px ${FONT}`
    ctx.fillStyle = "#e8445a"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(primaryStat, SIZE / 2, DIVIDER_Y + 80)

    ctx.font = `26px ${FONT}`
    ctx.fillStyle = "#a8a8b3"
    ctx.fillText(primaryLabel, SIZE / 2, DIVIDER_Y + 130)

    const GRID_TOP = DIVIDER_Y + 165
    const FOOTER_H = 110
    const GRID_PAD_X = 48
    const COLS = grid.cols
    const ROWS = grid.rows
    const GAP = 1
    const availW = SIZE - GRID_PAD_X * 2
    const availH = SIZE - GRID_TOP - FOOTER_H
    const cellW = Math.floor((availW - (COLS - 1) * GAP) / COLS)
    const cellH = Math.max(3, Math.floor((availH - (ROWS - 1) * GAP) / ROWS))
    const CELL = Math.min(cellW, cellH)
    const gridW = COLS * CELL + (COLS - 1) * GAP
    const offsetX = (SIZE - gridW) / 2

    for (let i = 0; i < grid.weeksTotal; i++) {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      const x = offsetX + col * (CELL + GAP)
      const y = GRID_TOP + row * (CELL + GAP)
      ctx.fillStyle = i < grid.weeksLived ? "#e8445a" : "#1e2435"
      ctx.fillRect(x, y, CELL, CELL)
    }

    ctx.font = `italic 22px ${FONT}`
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    ctx.fillText(tagline, SIZE / 2, SIZE - 70)

  } else {
    // STATS LAYOUT
    ctx.font = `bold 118px ${FONT}`
    ctx.fillStyle = "#e8445a"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(primaryStat, SIZE / 2, DIVIDER_Y + 145)

    ctx.font = `26px ${FONT}`
    ctx.fillStyle = "#a8a8b3"
    ctx.fillText(primaryLabel, SIZE / 2, DIVIDER_Y + 218)

    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
    let statY = DIVIDER_Y + 310
    for (const s of stats) {
      ctx.font = `22px ${FONT}`
      ctx.fillStyle = "#e8445a"
      ctx.fillText("→", PAD, statY)

      ctx.fillStyle = "#a8a8b3"
      ctx.fillText(`${s.label}:`, PAD + 32, statY)
      const labelW = ctx.measureText(`${s.label}: `).width
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold 22px ${FONT}`
      ctx.fillText(s.value, PAD + 32 + labelW, statY)
      statY += 54
    }

    ctx.strokeStyle = "rgba(255,255,255,0.07)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD, 852)
    ctx.lineTo(SIZE - PAD, 852)
    ctx.stroke()

    ctx.font = `italic 26px ${FONT}`
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.textBaseline = "alphabetic"
    ctx.fillText(tagline, SIZE / 2, 912)

    ctx.font = `20px ${FONT}`
    ctx.fillStyle = "#e8445a"
    ctx.fillText(toolUrl, SIZE / 2, 958)
  }

  // ── Watermark ─────────────────────────────────────────────────
  ctx.font = `18px ${FONT}`
  ctx.fillStyle = "rgba(168,168,179,0.65)"
  ctx.textAlign = "right"
  ctx.textBaseline = "alphabetic"
  ctx.fillText("dayblip.com", SIZE - PAD, SIZE - 36)

  // ── Trigger download ──────────────────────────────────────────
  canvas.toBlob(blob => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.download = filename
    a.href = url
    a.click()
    URL.revokeObjectURL(url)
  }, "image/png")
}
