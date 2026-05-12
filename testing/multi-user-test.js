const { chromium } = require('playwright')

async function test() {

  const browser = await chromium.launch({
    headless: false
  })

  const pages = []

  const ROOM_CODE = 'TEST01'

  for (let i = 0; i < 15; i++) {

    const page = await browser.newPage()

    await page.goto(
      `http://localhost:5173/room/${ROOM_CODE}?username=user${i}`
    )

    pages.push(page)
  }

  await pages[0].waitForTimeout(3000)

  await pages[0].click('.monaco-editor')

  await pages[0].keyboard.type('Hello from user0')

  await pages[0].waitForTimeout(2000)

  console.log('\n===== SYNC RESULTS =====\n')

  for (let i = 0; i < pages.length; i++) {

    const content = await pages[i].evaluate(() => {
      return window.monaco.editor.getModels()[0].getValue()
    })

    console.log(`User${i}:`, content)
  }

  console.log('\n========================\n')
}

test()