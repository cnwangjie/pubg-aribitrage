import {
  getNetEasePrice,
  getStmbuyPrice,
  getHuzuPrice,
  getV5foxPrice,
  getIgxePrice,
  getXxskinsPrice,
  getDotasellPrice,
  getIgvPrice,
} from './getData'
import fs from 'fs'
import async from 'async'

const data = []

const apis = {
  stmbuy: getStmbuyPrice,
  huzu: getHuzuPrice,
  v5fox: getV5foxPrice,
  igxe: getIgxePrice,
  xxskins: getXxskinsPrice,
  dotasell: getDotasellPrice,
  igv: getIgvPrice,
}

const items = fs.readFileSync('./data/allItems.txt').toString().split('\n')

const main = async () => {
  let sum = items.length
  let cur = 0
  console.log(items.length)
  async.mapLimit(items, 5, async item => {
    const asks = {}
    const ne = await getNetEasePrice(item)
    asks.steam = ne.steamPrice
    asks.netease = ne.ask
    for (let market in apis) {
      const dt = await apis[market](item)
      asks[market] = +dt.ask || NaN
    }
    data.push({item, asks})
    cur += 1
    console.log(`(${cur}/${sum}) ${item}`)
  }, (err, re) => {
    fs.writeFileSync(`./data/allItemsAsksData.json`, JSON.stringify(data, null, 4))
  })
}

main()
