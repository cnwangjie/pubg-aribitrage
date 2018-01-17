import fs from 'fs'
import chalk from 'chalk'

const data = JSON.parse(fs.readFileSync(`./data/allItemsAsksData.json`).toString())

const allItemDataAnalytics = data.map(i => {
  const asks = i.asks
  let maxAsk = 0
  let maxAskMarket = null
  let minAsk = Infinity
  let minAskMarket = null
  Object.keys(asks).map(m => {
    if (m === 'steam') return
    if (m === 'igxe') return
    if (asks[m] === null) return
    if (Math.abs(asks[m] - asks.steam) > 100) return
    if (+asks[m] > maxAsk) {
      maxAsk = asks[m]
      maxAskMarket = m
    }
    if (+asks[m] < minAsk) {
      minAsk = asks[m]
      minAskMarket = m
    }
  })
  return Object.assign({}, i, {
    maxAsk, maxAskMarket,
    minAsk, minAskMarket,
    diff: (maxAsk - minAsk).toFixed(2),
  })
}).sort((a, b) => b.diff - a.diff)

fs.writeFileSync(`./data/allItemDataAnalytics.json`, JSON.stringify(allItemDataAnalytics, null, 4))

for (let i = 0; i < 20; i += 1) {
  const tmp = allItemDataAnalytics[i]
  console.log(`${chalk.bold.white(tmp.item)}`)
  console.log(`diff: ${chalk.green(tmp.diff)} min ask: ${chalk.yellow(tmp.minAsk)} (${chalk.white(tmp.minAskMarket)}) max ask: ${chalk.yellow(tmp.maxAsk)} (${chalk.white(tmp.maxAskMarket)}) steam: ${chalk.yellow(tmp.asks.steam)}`)
}
