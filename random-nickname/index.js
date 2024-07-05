const randomName = require('chinese-random-name');

const { faker, fakerZH_CN } = require('@faker-js/faker');

// const namey = require('namey');
console.log(randomName.generate());

// console.log(faker.internet.userName())
// console.log(namey('abc', 'def'))

// console.log(faker.internet.displayName())
// console.log(fakerZH_CN.internet.displayName())

// const randomNames = (size = 60, maxLen = 15) => {
//   const names = []
//   while (names.length < size) {
//     const fakerList = [faker, fakerZH_CN]
//     const fakerInstance = fakerList[Math.floor(Math.random() * fakerList.length)]
//     let name = fakerInstance.internet.displayName()
//     if (name.length <= maxLen) {
//       names.push(name)
//     }
//   }
//   return names
// }
//
// console.log(randomNames())


const randomCityNames = (size = 60) => {
  const names = []
  while (names.length < size) {
    names.push(fakerZH_CN.location.cityName())
  }
  return names
}
console.log(randomCityNames())
