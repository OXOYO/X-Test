/**
 * Created by yangfan9244 on 2019/3/28.
 *
 *
 */

// 指定图表的配置项和数据
let chartOption = {
  title: {
    text: 'JS循环性能测试'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  toolbox: {
    right: 30,
    feature: {
      dataView: {show: true, readOnly: true},
      magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
      dataZoom: {show: true},
      restore: {show: true},
      saveAsImage: {show: true, name: ''}
    }
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 30,
    top: 50,
    bottom: 20,
    data: []
  },
  grid: {
    left: '3%',
    right: 200,
    bottom: '3%',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
      start: 0,
      end: 100
    },
    {
      type: 'slider',
      show: true,
      xAxisIndex: [0],
      start: 0,
      end: 100
    },
    {
      type: 'inside',
      yAxisIndex: [0],
      start: 0,
      end: 100
    },
    {
      type: 'slider',
      show: true,
      yAxisIndex: [0],
      start: 0,
      end: 100,
      left: '3%'
    }
  ],
  xAxis: {
    data: []
  },
  yAxis: {
    type : 'value',
    axisLabel: {
      formatter: '{value} ms'
    }
  },
  series: []
}
