/**
 * Created by OXOYO on 2019/4/30.
 *
 *
 */

const XBW = require('@oxoyo/xbw')

const wallpaperMap = {
  today: [],
  tomorrow: [],
  week: []
}

const main = async function () {
  const instance = new XBW()
  wallpaperMap.today = await instance.getToday()
  wallpaperMap.tomorrow = await instance.getTomorrow()
  wallpaperMap.week = await instance.getWeek()
  console.log(JSON.stringify(wallpaperMap))
}

main()
