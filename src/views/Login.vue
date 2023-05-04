<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="demo-ruleForm">
    <el-form-item label="Username" prop="username">
      <el-input v-model="ruleForm.username" autocomplete="off" />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="是否强制登录" prop="isUnique">
      <el-switch v-model="ruleForm.isUnique" :active-value="true" :inactive-value="false" active-color="#13ce66"
        inactive-color="#c2c2c2" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useStore } from "vuex";
import router from '../router'
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  username: '',
  password: '',
  isUnique: false,
  confirmViolent: false
})

const rules = {
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
      login(ruleForm);
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const login = (ruleForm) => {
  store.dispatch('login', ruleForm)
    .then((ViolentLogin) => {
      if (ViolentLogin) {
        ElMessageBox.confirm('该账号已经登录，是否强制登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ruleForm.confirmViolent = true
          login(ruleForm)
        }).catch(() => {
          debugger
          ElMessage.info({
            message: '已取消'
          })
        })
      }
      else {
        console.log('登录成功')

        router.push({
          path: '/'
        })
      }
    })
    .catch(() => {
      console.log('登录失败')
    })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

var getItemPromise = function getItemPromise(id) {
  return new Promise((resolve, reject) => {
    if (typeof id == 'number')
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
}).catch(function (id) {
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
