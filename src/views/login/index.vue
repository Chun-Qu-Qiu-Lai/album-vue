<template>
  <!-- <a-spin :spinning="false" tip="登录中"> -->
    <div id="page-max">
      <div style="display: flex; justify-content: space-between">
        <div><img src="@/assets/images/icon.png" style="width: 400px;cursor: pointer;" @click="refresh()" /></div>
        <div style="
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 400px
      ">
          <div class="item">
            <div><button @click="showLoginForm()" class="spin circle">登录</button></div>
            <div style="cursor: pointer;" @click="changeTheme()">Theme</div>
          </div>
        </div>
      </div>
      <p></p>
      <div style="display: flex; width: 90%; margin:8% auto; align-items: center">
        <div class="s" id="title" style="padding-top: 140px;color: #000000;">
          <div style="
          font-size: 3.4rem;
          font-weight: 400;
          line-height: 1.333;
          font-family: Open Sans, sans-serif;
          width: 90%;
          margin: auto;
        ">
            Hello There
          </div>
          <div style="
          width: 90%;
          margin: auto;
          line-height: 1.8;
          letter-spacing: 1px;
        ">
            Hi,青春逝去，有叹惋，没有哀怨，一切都是平和恬静的，<br />就像暮散之后独自追忆舞台上曾经的繁华乐章，带有种种淡淡的甜蜜的忧伤。
          </div>
        </div>
        <div class="form" id="form" style="
        background-color: rgba(255, 255, 255, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 30%;
        height: 270px;
        padding: 20px 120px;
        border-radius: 1rem;
        align-items: center;
        box-shadow: 5px 5px 16px rgba(251, 206, 226, 1);
      ">
          <input class="user-input" type="text" placeholder="账号" v-model="username" />
          <input class="psw-input" type="text" placeholder="密码" v-model="password" />
          <button class="custom-btn btn-5" @click="handleLogin()">登录</button>
        </div>
      </div>
      <!-- <mapPic id="mapPic" style="display: none;"></mapPic> -->
    </div>
</template>
<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { login } from '@/api/api.js'
import { message } from 'ant-design-vue'
import { setToken } from '@/utils/token'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
  },
  name: 'HomeView',
  setup () {
    const store = useStore()
    const router = useRouter()
    const data = reactive({
      username: '',
      password: '',
      changeThemeTag: true
    })
    onMounted(function () {
      const body = document.getElementById('page-max')
      body.style.background = 'linear-gradient(-60deg, #fff 0%, #fee5e1 50%, #ffffff 50%, #ffffff 100%)'
    })
    function showLoginForm () {
      const mapPic = document.getElementById('mapPic')
      const form = document.getElementById('form')
      mapPic.style.cssText = 'display:none'
      form.style.display = 'flex'
    }
    function refresh () {
      location.reload()
    }
    // 主题改变
    function changeTheme () {
      const body = document.getElementById('page-max')
      const title = document.getElementById('title')
      if (data.changeThemeTag) {
        data.changeThemeTag = !data.changeThemeTag
        title.style.color = '#ffffff'
        body.style.background = 'linear-gradient(-60deg, #fff 0%, #ffffff 50%, #86b09d 50%, #ffffff 100%)'
      } else {
        data.changeThemeTag = !data.changeThemeTag
        title.style.color = '#000000'
        body.style.background = 'linear-gradient(-60deg, #fff 0%, #fee5e1 50%, #ffffff 50%, #ffffff 100%)'
      }
    }
    // 登录
    async function handleLogin () {
      console.log('提交')
      if (data.username === '') {
        message.error('客官，账号不能为空哦 n(*≧▽≦*)n')
        return
      }
      if (data.password === '') {
        message.error('客官，密码不能为空哦 n(*≧▽≦*)n')
        return
      }
      // store.state.spinning = true
      const { data: res } = await login(data.username, data.password)
      // store.state.spinning = false
      if (res.code === 200) {
        message.success('登录成功')
        setToken(res.data)
      } else {
        message.error('登录失败')
        router.push({
          path: '/home'
        })
      }
    }
    return {
      ...toRefs(data),
      showLoginForm,
      refresh,
      changeTheme,
      handleLogin,
      store
    }
  }
})
</script>

<style scoped lang="scss">
#page-max {
  height: 100vh;
  background: linear-gradient(-60deg, #fff 0%, #8ecae5 50%, #77af77 51%, #fff 100%);
}

//
.user-input {
  height: 40px;
  border-radius: 40px;
  text-align: center;
  outline: none;
  border: 0;
  letter-spacing: 1px;
  width: 200px;
  background-image: url("@/assets/images/user.png");
  background-size: 25px;
  background-repeat: no-repeat;
  background-position: 10px;
  padding-left: 40px;
  transition: .8s;
}

.psw-input {
  height: 40px;
  border-radius: 40px;
  text-align: center;
  outline: none;
  border: 0;
  letter-spacing: 1px;
  width: 200px;
  background-image: url("@/assets/images/psw.png");
  background-size: 25px;
  background-repeat: no-repeat;
  background-position: 10px;
  padding-left: 40px;
  transition: .8s;
}

.item {
  width: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: -12px -12px 10px -9px #f9cbe5, 12px 12px 10px -9px #f9cbe5;
}

input:focus {
  box-shadow: -12px -12px 10px -9px #f9cbe5, 12px 12px 10px -9px #f9cbe5;
  // animation: d 1s forwards;
}

.s div {
  display: block;
  transform: translateY(50%);
  animation: c 2s forwards;
  will-change: transform;
  font-weight: 800;
  counter-increment: my-awesome-counter;
}

p {
  animation: p 2s forwards;
  height: 1px;
  background-color: #55866e;
}

.form {
  animation: form-an 0.5s ease-out forwards;
  width: 400px;
}

@keyframes form-an {
  0% {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}

@keyframes c {
  0% {
    transform: translateY(50%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes p {
  0% {
    width: 0px;
  }

  to {
    width: 100vw;
  }
}

@keyframes d {
  0% {
    box-shadow: none;
  }

  to {
    box-shadow: -12px -12px 10px -9px #f9cbe5, 12px 12px 10px -9px #f9cbe5;
  }
}

//
$background: #fefefe;
$text: #4b507a;

$cyan: #60daaa;
$yellow: #fbca67;
$orange: #ff8a30;
$red: #f45e61;
$purple: #6477b9;
$blue: #f9cbe5;

// Basic styles
.spin {
  background: none;
  border: 0;
  box-sizing: border-box;
  margin: 1em;
  padding: 1em 2em;
  cursor: pointer;
  box-shadow: inset 0 0 0 2px $red;
  font-size: inherit;
  font-weight: 700;

  position: relative;
  vertical-align: middle;

  &::before,
  &::after {
    box-sizing: inherit;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.meet {
  &:hover {
    color: $yellow;
  }

  &::after {
    top: 0;
    left: 0;
  }

  &:hover::before {
    border-top-color: $yellow;
    border-right-color: $yellow;
  }

  &:hover::after {
    border-bottom-color: $yellow;
    border-left-color: $yellow;
    transition: height 0.25s ease-out, width 0.25s ease-out 0.25s;
  }
}

.spin {
  width: 5em;
  height: 5em;
  padding: 0;

  &:hover {
    color: $red;
  }

  &::before,
  &::after {
    top: 0;
    left: 0;
  }

  &::before {
    border: 2px solid transparent;
  }

  &:hover::before {
    border-top-color: $blue;
    border-right-color: $blue;
    border-bottom-color: $blue;

    transition: border-top-color 0.15s linear,
      border-right-color 0.15s linear 0.1s,
      border-bottom-color 0.15s linear 0.2s;
  }

  &::after {
    border: 0 solid transparent;
  }

  &:hover::after {
    border-top: 2px solid $blue;
    border-left-width: 2px;
    border-right-width: 2px;
    transform: rotate(270deg);
    transition: transform 0.4s linear 0s, border-left-width 0s linear 0.35s;
  }
}

.circle {
  border-radius: 100%;
  box-shadow: none;

  &::before,
  &::after {
    border-radius: 100%;
  }
}

// 按钮
.btn-5 {
  width: 130px;
  height: 40px;
  padding: 0;
  border: none;
  background: rgb(255, 27, 0);
  background: linear-gradient(0deg,
      rgba(255, 27, 0, 1) 0%,
      rgba(251, 75, 2, 1) 100%);
}

.btn-5:hover {
  color: #f0094a;
  background: transparent;
  box-shadow: none;
}

.btn-5:before,
.btn-5:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  height: 2px;
  width: 0;
  background: #f0094a;
  box-shadow: -1px -1px 5px 0px #fff, 7px 7px 20px 0px #0003,
    4px 4px 5px 0px #0002;
  transition: 400ms ease all;
}

.btn-5:after {
  right: inherit;
  top: inherit;
  left: 0;
  bottom: 0;
}

.btn-5:hover:before,
.btn-5:hover:after {
  width: 100%;
  transition: 800ms ease all;
}

.custom-btn {
  width: 130px;
  height: 40px;
  color: #55866e;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
  text-align: center;
}
</style>
