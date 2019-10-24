@testable
class MyTestableClass {

}

function testable (target) {
  target.isTestable = true
}

MyTestableClass.isTestable
