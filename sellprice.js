import rp from 'request-promise'
import cheerio from 'cheerio'
import chalk from 'chalk'


export const getNetEasePrice = async item => {
  const res = await rp({
    uri: `https://buff.163.com/api/market/goods`,
    method: 'GET',
    qs: {
      game: 'pubg',
      page_num: 1,
      search: item,
      _: Date.now(),
    },
  })

  const data = JSON.parse(res)

  const r = {
    item: item,
    bid: data.data.items[0].buy_max_price,
    bidVolumn: data.data.items[0].buy_num,
    ask: data.data.items[0].sell_min_price,
    askVolumn: data.data.items[0].sell_num,
    steamPrice: data.data.items[0].goods_info.steam_price_cny,
    time: Date.now(),
  }

  return r

}

export const getStmbuyPrice = async item => {
  const res = await rp({
    uri: `http://www.stmbuy.com/pubg`,
    method: 'GET',
    qs: {
      keywords: item,
    }
  })

  const ask = /最低价[^\d]+(\d+.\d+)/.test(res) ? /最低价[^\d]+(\d+.\d+)/.exec(res)[1] - 0 : undefined
  const askVolumn = /在售数：[^\d]+(\d+)/.test(res) ? /在售数：[^\d]+(\d+)/.exec(res)[1] - 0 : undefined

  return {
    item: item,
    ask,
    askVolumn,
    time: Date.now(),
  }
}

export const getHuzuPrice = async item => {
  const res = await rp({
    uri: `https://www.huzu.com/pubg`,
    method: 'GET',
    qs: {
      s: item,
    }
  })

  const askRE = /last_price[^\d]*(\d+.?\d*)/
  const askVolRE = /在售[^\d]+(\d+)/
  const ask = askRE.test(res) ? askRE.exec(res)[1] - 0 : undefined
  const askVolumn = askVolRE.test(res) ? askVolRE.exec(res)[1] - 0 : undefined

  return {
    item: item,
    ask,
    askVolumn,
    time: Date.now(),
  }
}

export const getV5foxPrice = async item => {
  const res = await rp({
    uri: `http://www.v5fox.com/pubg/0-0`,
    method: 'GET',
    qs: {
      keyword: item,
    }
  })

  const askRE = /(\d+.?\d*)[^\d]*起[^\d]*\d+件 在售/
  const askVolRE = /(\d+)件 在售/
  const ask = askRE.test(res) ? askRE.exec(res)[1] - 0 : undefined
  const askVolumn = askVolRE.test(res) ? askVolRE.exec(res)[1] - 0 : undefined

  return {
    item: item,
    ask,
    askVolumn,
    time: Date.now(),
  }
}

export const getIgxePrice = async item => {
  const res = await rp({
    uri: `https://www.igxe.cn/pubg/578080/1/0/0`,
    method: 'GET',
    qs: {
      keyword: item,
    }
  })

  const askRE = /在售数量：[^\d]*(\d+)/
  const askVolRE = /起价[^\d]*(\d+.\d*)/
  const ask = askRE.test(res) ? askRE.exec(res)[1] - 0 : undefined
  const askVolumn = askVolRE.test(res) ? askVolRE.exec(res)[1] - 0 : undefined

  return {
    item: item,
    ask,
    askVolumn,
    time: Date.now(),
  }
}

export const getXxskinsPrice = async item => {
  const res = await rp({
    uri: `https://apis.xxskins.com/goods/578080/0`,
    method: 'GET',
    qs: {
      keyword: item,
      page: 1,
      _: Date.now(),
    }
  })

  const data = JSON.parse(res)

  const ask = data.data.list.length > 0 ? data.data.list[0].price : undefined
  const askVolumn = data.data.list.length > 0 ? data.data.list[0].sell_num : undefined

  return {
    item: item,
    ask,
    askVolumn,
    time: Date.now(),
  }
}

export const getDotasellPrice = async item => {
  const res = await rp({
    uri: `http://www.dotasell.com/xhr/json_search.ashx`,
    method: 'GET',
    qs: {
      keyw: item,
      Sockets: 0,
      start: 0,
      fuzz: true,
      AssetsType: 0,
      OrderBy: 'Default',
      AppID: 578080,
      safeonly: false,
    }
  })

  const data = JSON.parse(res)

  const ask = data.MerchandiseList.length > 0 ? data.MerchandiseList[0].Price / 100 : undefined
  const askVolumn = undefined

  return {
    item: item,
    ask,
    askVolumn,
    time: Date.now(),
  }
}

export const getIgvPrice = async item => {
  const handledItem = item.replace(/[^A-Za-z]/ig, '')

  const res = await rp({
    uri: `https://pubg.igv.cn/items/index`,
    method: 'GET',
    qs: {
      keywords: handledItem,
    }
  })

  const askRE = /¥[^\d]*(\d+)/
  const ask = askRE.test(res) ? askRE.exec(res)[1] - 0 : undefined

  return {
    item: item,
    ask,
    askVolumn: undefined,
    time: Date.now(),
  }
}

const own = `Sleeveless Turtleneck Top (Gray) 36.50
Sleeveless Turtleneck (Black) 87.99
Baggy Pants (Brown) 126.50
Leather Boots (Black) 23.80
Punk Knuckle Gloves (Red) 80.99
Baggy Pants (Black) 189
Wide Pants (Red) 29.70
Training Pants (Light Blue) 97.72
Baggy Pants (Black) 189
Punk Knuckle Gloves (Red) 80.99
Training Pants (Light Blue) 97.72
Wide Pants (Red) 29.40
Wide Pants (Red) 29.40
Leather Boots (Brown) 17.15
Long Leather Boots (Brown) 24.20
Leather Boots (Black) 23.88
Striped Shirt (Gray) 24.10
Horn-rimmed Glasses (Black) 103
Leather Boots (Black) 23.88
Beanie (Brown) 16.50
Punk Knuckle Gloves (Red) 80.99`.split('\n')
  .map(i => i.split(' ')
  .slice(0, -1)
  .join(' '))
  .reduce((r, i) => {
    if (i in r) {
      r[i] += 1
    } else {
      r[i] = 1
    }
    return r
  }, {})

const main = async () => {
  const price = {}
  await Promise.all(Object.keys(own).map(async item => {
    const netease = await getNetEasePrice(item)
    const stmbuy = await getStmbuyPrice(item)
    const huzu = await getHuzuPrice(item)
    const v5fox = await getV5foxPrice(item)
    const igxe = await getIgxePrice(item)
    const xxskins = await getXxskinsPrice(item)
    const dotasell = await getDotasellPrice(item)
    const steamPrice = netease.steamPrice
    const asks = {
      steam: netease.steamPrice,
      netease: netease.ask,
      stmbuy: stmbuy.ask || NaN,
      huzu: huzu.ask || NaN,
      v5fox: v5fox.ask || NaN,
      igxe: igxe.ask || NaN,
      xxskins: xxskins.ask || NaN,
      dotasell: dotasell.ask || NaN,
    }
    price[item] = asks
    let maxAskMarket = null
    let maxAsk = 0
    for (let market in asks) {
      if (+asks[market] > maxAsk) {
        maxAskMarket = market
        maxAsk = asks[market]
      }
    }
    const pricesText = Object.keys(asks).map(i => `${i}: ${chalk.yellow(asks[i])}`).join(' ')
    console.log(`${item} ${chalk.bold.white('x' + own[item])}\n${pricesText} max ask: ${chalk.green(maxAsk)} (${maxAskMarket})`)
    own[item] = {
      sum: own[item],
      maxAsk: maxAsk,
    }
  }))
  const mps = Object.keys(own).reduce((r, i) => {
    r += own[i].maxAsk * own[i].sum
    return r
  }, 0)
  //
  const st = Object.keys(own).reduce((r, i) => {
    r += price[i].netease * own[i].sum
    return r
  }, 0)

  console.log(`----------${st}`)
  console.log(`max price sum: ${chalk.green(mps.toFixed(2))}`)
}

main()
const test = async () => {
  console.log(await getDotasellPrice('DESPERADO CRATE'))
}
// test()
