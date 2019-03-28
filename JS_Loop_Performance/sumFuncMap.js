/**
 * Created by OXOYO on 2019/3/28.
 *
 * 求和函数
 */

let sumFuncMap = {
  // for循环
  twoSum_for: function (nums, target) {
    let T = new TimeCconsuming()
    for (let i = 0, L1 = nums.length; i < L1; i++) {
      for (let j = 0, L2 = nums.length; j < L2; j++) {
        if (nums[i] + nums[j] === target) {
          let time = T.get()
          return [i, j, nums[i], nums[j], time]
        }
      }
    }
  },
  // for循环
  twoSum_for1: function (nums, target) {
    let T = new TimeCconsuming()
    for (let i = 0, v1; v1 = nums[i++];) {
      for (let j = 0, v2; v2 = nums[j++];) {
        if (v1 + v2 === target) {
          let time = T.get()
          return [i - 1, j - 1, v1, v2, time]
        }
      }
    }
  },
  // 倒序for循环
  twoSum_for_reverse: function (nums, target) {
    let T = new TimeCconsuming()
    for (let i = nums.length; i > -1; i--) {
      for (let j = nums.length; j > -1; j--) {
        if (nums[i] + nums[j] === target) {
          let time = T.get()
          return [i, j, nums[i], nums[j], time]
        }
      }
    }
  },
  // for...in循环
  twoSum_for_in: function (nums, target) {
    let T = new TimeCconsuming()
    for (let i in nums) {
      for (let j in nums) {
        if (nums[i] + nums[j] === target) {
          let time = T.get()
          return [i, j, nums[i], nums[j], time]
        }
      }
    }
  },
  // forEach循环
  twoSum_forEach: function (nums, target) {
    let T = new TimeCconsuming()
    let res
    nums.forEach(function (v1, i) {
      if (!res) {
        nums.forEach(function (v2, j) {
          if (!res && v1 + v2 === target) {
            let time = T.get()
            res = [i, j, v1, v2, time]
          }
        })
      }
    })
    return res
  },
  // map循环
  twoSum_map: function (nums, target) {
    let T = new TimeCconsuming()
    let res
    nums.map((v1, i) => {
      if (!res) {
        nums.map((v2, j) => {
          if (!res && v1 + v2 === target) {
            let time = T.get()
            res = [i, j, v1, v2, time]
          }
        })
      }
    })
    return res
  },
  // while循环
  twoSum_while: function (nums, target) {
    let T = new TimeCconsuming()
    let i = 0
    let L = nums.length
    let res
    while (i < L) {
      let j = 0
      if (res) {
        break
      }
      while (j < L) {
        if (res) {
          break
        }
        if (nums[i] + nums[j] === target) {
          let time = T.get()
          res = [i, j, nums[i], nums[j], time]
        }
        j++
      }
      i++
    }
    return res
  },
  // 达夫设备
  // FIXME 【暂弃】存在BUG
  twoSum_duff_device: function (nums, target) {
    let T = new TimeCconsuming()
    let duff = function (items, val) {
      let i = items.length % 8
      while(i) {
        process(items[i--], val)
      }
      i = Math.floor(items.length / 8)
      while(i) {
        process(items[i--], val)
        process(items[i--], val)
        process(items[i--], val)
        process(items[i--], val)
        process(items[i--], val)
        process(items[i--], val)
        process(items[i--], val)
        process(items[i--], val)
      }
    }
    let level = 0
    let res
    let process = function (v1, v2) {
      if (!res && v1 + v2 === target) {
        let time = T.get()
        res = [i, j, v1, v2, time]
      }
      level++
      if (level < 2) {
        duff(nums, v1)
      }
    }
    duff(nums)
    return res
  }
}
