<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { test } from '../api'

const time = 1 * 5 * 1000
// clearTimeout(timeout)
var timeout1 = function (index) {
  setTimeout(() => {
    test(index || 0).then(response => {
      const { data } = response
      console.log(`Task1:测试成功，返回值 ${data.index}`)
      data.index++
      timeout1(data.index)
    }).catch(error => {
      console.log("Task1:测试失败")
      console.log(error)
    })
  }, 10000)
}
timeout1()

var timeout2 = function (index) {
  setTimeout(() => {
    test(index || 0).then(response => {
      const { data } = response
      console.log(`Task2:测试成功，返回值 ${data.index}`)
      data.index++
      timeout2(data.index)
    }).catch(error => {
      console.log("Task2:测试失败")
      console.log(error)
    })
  }, 200)
}
timeout2()

var timeout3 = function (index) {
  setTimeout(() => {
    test(index || 0).then(response => {
      const { data } = response
      console.log(`Task3:测试成功，返回值 ${data.index}`)
      data.index++
      timeout3(data.index)
    }).catch(error => {
      console.log("Task3:测试失败")
      console.log(error)
    })
  }, 300)
}
timeout3()

var timeout4 = function (index) {
  setTimeout(() => {
    test(index || 0).then(response => {
      const { data } = response
      console.log(`Task4:测试成功，返回值 ${data.index}`)
      data.index++
      timeout4(data.index)
    }).catch(error => {
      console.log("Task4:测试失败")
      console.log(error)
    })
  }, 400)
}
timeout4()

</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
