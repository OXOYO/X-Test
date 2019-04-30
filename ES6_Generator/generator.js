/**
 * Created by OXOYO on 2019/4/30.
 *
 *
 */

function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

let hw = helloWorldGenerator()

console.log('1', hw.next())
console.log('2', hw.next())
console.log('3', hw.next())
console.log('4', hw.next())
