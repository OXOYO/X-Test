const rsJieba = require('@node-rs/jieba')
const nodeJieba = require("nodejieba");

// const text = 'E:\\JIE_BAR\\TEST\\中国City成都峨眉山2019-10-12.png'
// const text = '南京市长江大桥'
// const text = '中国私たちの友人'
// const text = '中国Chinese人民peopleareourfriends'
// const text = '我来到北京清华大学'
const text = '他来到了网易杭研大厦'
// const text = '小明硕士毕业于中国科学院计算所，后在日本京都大学深造"'
const topN = 10

// 提取中文
function extractChineseWords(words) {
  const chineseWords = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (/[\u4e00-\u9fa5]/.test(word)) {
      chineseWords.push(word);
    }
  }
  return chineseWords;
}

// 数组转对象
function arrayToObject(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    obj['key_' + i] = array[i]
  }
  return [obj];
}

// 测试rsJieba
console.log('----------------- rsJieba -----------------')
rsJieba.load()
const cutRes = rsJieba.cut(text, false)
const cutResTrue = rsJieba.cutAll(text, false)
const cutResTag = rsJieba.tag(text)
const cutForSearch = rsJieba.cutForSearch(text, true)
// const chineseRes = extractChineseWords(cutRes)
// const extractRes = rsJieba.extract(text, topN)
console.log(cutRes)
console.log(cutResTrue)
// console.log(cutResTag)
console.log(cutForSearch)
// console.table( chineseRes)
// console.table(extractRes)

// 测试nodeJieba
// console.log('----------------- nodeJieba -----------------')
// const cutRes2 = nodeJieba.cut(text, false)
// const extractRes2 = nodeJieba.extract(text, topN)
// console.table( cutRes2)
// console.table( extractRes2)
