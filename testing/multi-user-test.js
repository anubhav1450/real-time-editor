const { chromium } = require('playwright')

// Usage:
//   node multi-user-test.js
//   BASE_URL=https://your-app.vercel.app USERS=5 HEADLESS=true node multi-user-test.js
//   CHANNEL=chrome node multi-user-test.js   (use installed Chrome instead of Playwright's)
const BASE_URL = (process.env.BASE_URL || 'http://localhost:5173').replace(/\/$/, '')
const USERS = Number(process.env.USERS || 15)
const HEADLESS = process.env.HEADLESS === 'true'
const CHANNEL = process.env.CHANNEL || undefined
const ROOM_CODE = process.env.ROOM_CODE || `TEST${Date.now().toString(36).toUpperCase().slice(-4)}`

const MESSAGE = 'Hello from user0'

async function test() {

  const browser = await chromium.launch({
    headless: HEADLESS,
    channel: CHANNEL
  })

  const pages = []

  for (let i = 0; i < USERS; i++) {

    const page = await browser.newPage()

    await page.goto(
      `${BASE_URL}/room/${ROOM_CODE}?username=user${i}`
    )

    pages.push(page)
  }

  // Wait until every editor is mounted and connected.
  for (const page of pages) {
    await page.waitForSelector('.monaco-editor')
    await page.getByText('Live').waitFor({ timeout: 60000 })
  }

  await pages[0].click('.monaco-editor')

  await pages[0].keyboard.type(MESSAGE)

  await pages[0].waitForTimeout(2000)

  console.log(`\n===== SYNC RESULTS (room ${ROOM_CODE}) =====\n`)

  let failed = 0

  for (let i = 0; i < pages.length; i++) {

    const { content, online } = await pages[i].evaluate(() => ({
      content: window.monaco.editor.getEditors()[0].getValue(),
      // Every user should see everyone in the Active Users panel.
      online: document.querySelectorAll('aside li').length
    }))

    const ok = content === MESSAGE && online === USERS

    if (!ok) failed++

    console.log(
      `${ok ? 'PASS' : 'FAIL'}  user${i}:`,
      JSON.stringify(content),
      `(sees ${online}/${USERS} users online)`
    )
  }

  console.log(`\n${USERS - failed}/${USERS} users in sync with full presence\n`)

  await browser.close()

  process.exit(failed ? 1 : 0)
}

test().catch(error => {
  console.error(error)
  process.exit(1)
})
