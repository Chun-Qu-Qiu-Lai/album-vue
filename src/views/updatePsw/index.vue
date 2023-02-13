<template>
  <a-form autocomplete="off" name="basic" @finish="submitForm" :model="data.formState" :label-col="{ span: 18 }"
    :wrapper-col="{ span: 10 }">
    <a-form-item :rules="[{ required: true, message: '请输入新密码' }, { max: 10, message: '长度最大10位' }]" label="新密码"
      name="password" :label-col="{ span: 10 }" :wrapper-col="{ offset: 0, span: 4 }">
      <a-input v-model:value="data.formState.password">
      </a-input>
    </a-form-item>
    <a-form-item :rules="[{ required: true, message: '请再次输入新密码' }, { max: 10, message: '长度最大10位' }]" label="再次输入"
      name="checkPassword" :label-col="{ span: 10 }" :wrapper-col="{ offset: 0, span: 4 }">
      <a-input v-model:value="data.formState.checkPassword">
      </a-input></a-form-item>
    <a-button type="primary" html-type="submit">修改</a-button>
  </a-form>
</template>

<script>
import { message } from 'ant-design-vue'
import { defineComponent, reactive } from 'vue'
import { updatePsw } from '@/api/api'
export default defineComponent({
  name: 'updatePasswordIndex',
  setup () {
    const data = reactive({
      formState: {
        password: '',
        checkPassword: ''
      }
    })
    const submitForm = async (value) => {
      const tempPassword = value.password.replace(/\s*/g, '')
      if (tempPassword !== value.password) {
        message.error('输入不合法w(ﾟДﾟ)w')
        return
      }
      if (value.password !== value.checkPassword) {
        message.error('两次密码输入不相同(°ー°〃)')
        return
      }
      console.log(value.password)
      const { data: res } = await updatePsw(value.password, value.checkPassword)
      if (res.code === 200) {
        message.success('修改成功')
        data.formState.password = ''
        data.formState.checkPassword = ''
      } else {
        message.error(res.msg)
      }
    }
    return {
      data,
      submitForm
    }
  }
})
</script>
<style scoped lang="scss">

</style>
