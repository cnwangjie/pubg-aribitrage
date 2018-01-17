import rp from 'request-promise'
import fs from 'fs'

const itemNames = []

const getData = async (page) => {
  const res = await rp({
    uri: `https://buff.163.com/api/market/goods`,
    method: 'GET',
    qs: {
      game: 'pubg',
      page_num: page,
      _: Date.now(),
    },
  })

  const data = JSON.parse(res)

  return data
}

const main = async () => {
  let page = 1
  while (true) {
    const data = await getData(page)
    page += 1
    console.log(data)
    data.data.items.map(i => {
      itemNames.push(i.name)
    })
    if (data.data.items.length < 20) break
  }
  fs.writeFileSync('./allItems.txt', itemNames.join('\n'))
}

main()
