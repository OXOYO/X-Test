// 耗时
let TimeCconsuming = function () {
  this.start = new Date()
  this.get = function () {
    return new Date() - this.start
  }
  this.log = function (val) {
    console.log('TIME CONSUMING:', val !== undefined ? val : this.get())
  }
}

// 获取随机数组，数组length默认一万
let getRandomArr = function (length = 10000) {
  let arr = []
  for (let i = 0; i < length; i++) {
    arr.push(parseInt(Math.random() * 1000))
  }
  return arr
}

// 主函数
let main = function () {
  let length = parseInt(document.querySelector('#length').value)
  let target = parseInt(document.querySelector('#target').value)
  let max = parseInt(document.querySelector('#max').value)
  // 获取随机数组
  let arr = getRandomArr(length)
  console.log('arr', arr)
  // 初始化echarts实例
  let el = document.querySelector('#chart')
  let chartInstance = echarts.getInstanceByDom(el)
  if (chartInstance && chartInstance.clear) {
    chartInstance.clear()
  } else {
    chartInstance = echarts.init(el)
  }
  // 显示loading
  chartInstance.showLoading()

  setTimeout(function () {
    // 进行max次求和
    let seriesDataArr = []
    let legendData = []
    let handleSeriesData = function (name, index, loopIndex, data) {
      console.log('LoopIndex:', loopIndex, 'Func:', name, 'Data:', data)
      if (!seriesDataArr[index]) {
        seriesDataArr[index] = {
          type: 'line',
          name: name,
          smooth: true,
          markPoint: {
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          data: []
        }
      }
      if (Array.isArray(data)) {
        seriesDataArr[index].data[loopIndex] = data.pop()
      }
      if (!legendData[index]) {
        legendData[index] = name
      }
    }
    let funcNameArr = Object.keys(sumFuncMap)
    funcNameArr = funcNameArr.filter(funcName => {
      let el = document.querySelector('#' + funcName)
      return el && el.checked
    })
    if (!funcNameArr.length) {
      // 隐藏loading
      chartInstance.hideLoading()
      return
    }
    for (let i = 0; i < max; i++) {
      let index = 0
      for (let j = 0, len = funcNameArr.length; j < len; j++) {
        let funcName = funcNameArr[j]
        handleSeriesData(funcName, index++, i, sumFuncMap[funcName](arr, target))
      }
    }
    chartOption.legend.data = legendData
    chartOption.xAxis.data = Array.from({length: max}, (v, i) => i)
    chartOption.series = seriesDataArr
    console.log('chartOption', chartOption)
    // 使用刚指定的配置项和数据显示图表。
    chartInstance.setOption(chartOption)
    // 隐藏loading
    chartInstance.hideLoading()
  }, 2000)
}

// 绑定刷新事件
let el = document.querySelector('#refresh')
el.addEventListener('click', function (event) {
  event.stopPropagation()
  event.preventDefault()
  main()
})

// 执行主函数
main()
