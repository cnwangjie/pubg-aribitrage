import rp from 'request-promise'
import cheerio from 'cheerio'

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
