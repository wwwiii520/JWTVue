<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="Username" prop="username">
      <el-input v-model="ruleForm.username" autocomplete="off" />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >Submit</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useStore } from "vuex";
import router from '../router'
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  username: '',
  password: ''
})

const rules =  {
  username: [
    { required: true, message: "不能为空", trigger: 'blur' }
  ],
  password: [
    { required: true, message: "不能为空", trigger: 'blur' }
  ]
}
const store = useStore()

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      debugger
      console.log('submit!')
      store.dispatch('login', ruleForm)
            .then(() => {
              console.log('登录成功')
              
              router.push({
                path: '/'
              })
            })
            .catch(() => {
              console.log('登录失败')
            })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

var getItemPromise = function getItemPromise(id) {
        return new Promise((resolve, reject) => {
          if(typeof id=='number')
            resolve(id)
          else
            reject(id)
        })
      }
var promise = getItemPromise(1);
      promise.then(function (id) {
        console.log(`resolve ${id}`, window.performance.now());
      });
      promise.then(function (id) {
        console.log(`resolve ${id}`, window.performance.now());
      });
      promise.then(function (id) {
        console.log(`resolve ${id}`, window.performance.now());
      });
      promise.then(function (id) {
        console.log(`resolve ${id}`, window.performance.now());
      });
      promise.then(function (id) {
        console.log(`resolve ${id}`, window.performance.now());
      });

var promise1 = getItemPromise(0);
promise1.then(function (id) {
        console.log(`resolve --- ${id}`, window.performance.now());
        return getItemPromise(1);
      }).then(function (id) {
        console.log(`resolve --- ${id}`, window.performance.now());
        return getItemPromise('2');
      }).then(function (id) {
        console.log(`resolve --- ${id}`, window.performance.now());
        return getItemPromise(3);
      }).catch(function(id){
        console.log(`reject --- ${id}`, window.performance.now());
        return getItemPromise(3);
      }).then(function (id) {
        console.log(`resolve --- ${id}`, window.performance.now());
        return getItemPromise(4);
      }).then(function (id) {
        console.log(`resolve --- ${id}`, window.performance.now());
        return getItemPromise(5);
      }).then(function (id) {
        console.log(`resolve --- ${id}`, window.performance.now());
        return getItemPromise(6);
      });

</script>
