const rsJieba = require('@node-rs/jieba')
const nodeJieba = require("nodejieba");

const text = 'E:\\JIE_BAR\\TEST\\成都峨眉山2019-10-12.png'
// const text = '南京市长江大桥'
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
const chineseRes = extractChineseWords(cutRes)
const extractRes = rsJieba.extract(text, topN)
console.table(cutRes)
console.table( chineseRes)
console.table(extractRes)

// 测试nodeJieba
console.log('----------------- nodeJieba -----------------')
const cutRes2 = nodeJieba.cut(text, false)
const extractRes2 = nodeJieba.extract(text, topN)
console.table( cutRes2)
console.table( extractRes2)
