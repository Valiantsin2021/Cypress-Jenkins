/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable max-statements */
/* eslint-disable func-style */
import axios from 'axios'
import { createCanvas } from 'canvas'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

function readAllureData(path = './allure-report/widgets/summary.json') {
  try {
    const summaryData = JSON.parse(fs.readFileSync(path, 'utf8'))
    return {
      passed: summaryData.statistic.passed || 0,
      failed: summaryData.statistic.failed || 0,
      broken: summaryData.statistic.broken || 0,
      skipped: summaryData.statistic.skipped || 0,
      unknown: summaryData.statistic.unknown || 0,
      duration: summaryData.time.duration || 0
    }
  } catch (error) {
    console.error('Error reading Allure report data:', error.message)
    process.exit(1)
  }
}

function formatDuration(durationMs) {
  const pad = num => (num > 9 ? num : '0' + num)
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000)

  return `${pad(hours)}h:${pad(minutes)}m:${pad(seconds)}s`
}

function createPieChart(data) {
  const width = 600
  const height = 400
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)

  const centerX = width * 0.35
  const centerY = height / 2
  const radius = Math.min(centerX, centerY) * 0.8
  const innerRadius = radius * 0.6
  const labels = ['Passed', 'Failed', 'Broken', 'Skipped', 'Unknown']
  const values = [data.passed, data.failed, data.broken, data.skipped, data.unknown]
  const colors = ['#8BC34A', '#F44336', '#FF9800', '#2196F3', '#8A2BE2']
  const total = values.reduce((acc, val) => acc + val, 0)

  let startAngle = -0.5 * Math.PI // Start at top (90 degrees)

  for (let i = 0; i < values.length; i++) {
    if (values[i] === 0) continue

    const sliceAngle = (values[i] / total) * 2 * Math.PI

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
    ctx.closePath()

    ctx.fillStyle = colors[i]
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.stroke()

    const midAngle = startAngle + sliceAngle / 2
    const percentage = ((values[i] / total) * 100).toFixed(1)

    if (percentage > 0) {
      const textRadius = radius * 0.85
      const textX = centerX + Math.cos(midAngle) * textRadius
      const textY = centerY + Math.sin(midAngle) * textRadius

      ctx.fillStyle = 'white'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${percentage}%`, textX, textY)
    }

    startAngle += sliceAngle
  }

  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill()

  ctx.fillStyle = 'black'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(total.toString(), centerX, centerY)

  const legendX = width * 0.7
  const legendY = height * 0.2
  const legendSquareSize = 15

  for (let i = 0; i < labels.length; i++) {
    if (values[i] === 0) continue

    ctx.fillStyle = colors[i]
    ctx.fillRect(legendX - legendSquareSize, legendY + i * 30, legendSquareSize, legendSquareSize)

    ctx.fillStyle = 'black'
    ctx.font = '14px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${values[i]} - ${labels[i]}`, legendX, legendY + i * 30 + legendSquareSize / 2)
  }

  return canvas.toBuffer('image/png')
}

async function sendSlackNotification(data, imageBuffer, environment = 'test') {
  try {
    const slackToken = process.env.SLACK_TOKEN
    const slackChannel = process.env.SLACK_CHANNEL

    const formData = new Blob([imageBuffer], { type: 'image/png' })
    const form = new FormData()
    form.append('channels', slackChannel)
    form.append('file', formData, 'test-results-chart.png')
    form.append('filename', 'test-results-chart.png')
    form.append(
      'initial_comment',
      `*Test Results for Last run results Allure report on ${environment} environment*\n\n
         ⏳ *Duration:* ${data.durationFormatted}\n
         ✅ *Passed:* ${data.passed}\n
         ❌ *Failed:* ${data.failed}\n
         🔨 *Broken:* ${data.broken}\n
         🚩 *Skipped:* ${data.skipped}\n
         ❓ *Unknown:* ${data.unknown}\n
        *Report available at:* <https://valiantsin2021.github.io/Playwright_ProjectJS_2024|Report>`
    )

    const response = await axios.post('https://slack.com/api/files.upload', form, {
      headers: {
        Authorization: `Bearer ${slackToken}`
      }
    })

    if (!response.data.ok) {
      throw new Error(`Slack API error: ${response.data.error}`)
    }

    console.log('Slack notification sent successfully')
    return response.data
  } catch (error) {
    console.error('Error sending Slack notification:', error.message)
    throw error
  }
}

async function generateReportAndNotify(path, environment = 'test') {
  const data = readAllureData(path)
  const durationFormatted = formatDuration(data.duration)
  const chartPath = createPieChart(data)

  const reportData = {
    ...data,
    durationFormatted
  }

  await sendSlackNotification(reportData, chartPath, environment)
  return { data: reportData, chartPath }
}

const path = process.argv[2] || process.env.ALLURE_REPORT_PATH
const environment = process.argv[3] || process.env.platform

generateReportAndNotify(path, environment).catch(err => {
  console.error('Error generating report and sending notification:', err)
  process.exit(1)
})
