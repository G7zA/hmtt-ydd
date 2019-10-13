<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="标题" />
    <!-- 登录表单 -->
    <van-cell-group>
      <van-field v-model="user.mobile"  clearable label="手机号" placeholder="请输入手机号"/>

      <van-field v-model="user.code" clearable type="password" label="验证码" placeholder="请输入验证码"/>
    </van-cell-group>
    <!-- 登录表单 -->

    <!-- 登录按钮 -->
    <!-- 给登录按钮注册点击事件处理函数  -->
    <van-button type="info" @click="getLogin">登录</van-button>
  </div>
</template>

<script>
// import resquest from '@/utils/request' // 导入封装好的axios请求函数（request）
import { login } from '@/api/user' // 引入封装的登录请求模块函数

export default {
  //   name: 'LoginIndex'
  data: function () {
    return {
      user: {
        mobile: '18748158195',
        code: '246810'
      }
    }
  },
  methods: {
    //   请求提交登录表单数据 发送请求调用接口 已经封装好了axios直接引入
    async getLogin () {
      //   表单验证
      // 验证通过，loading加载 请求
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登录中'
      })

      try {
        //   请求提交表单数据
        const { data } = await login(this.user)

        // 请求提交表单数据
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/app/v1_0/authorizations',
        //   data: this.user
        // })
        console.log(data)
        //   结束loading 提示 先清除loading
        toast.clear()

        // 再提示登录成功
        // this.$toast.success({
        //   duration: 2000,
        //   message: '登录成功'
        // })
        this.$toast.success('登录成功')
      } catch (err) {
        //   结束loading 提示
        toast.clear()
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败手机号或验证码输入有误')
        }
      }
    //   结束loading 提示
    //   toast.clear()
    }
  }
}
</script>

<style lang="less" scoped>
//导航的样式是公共的其他的页也需要使用所以我们把设置登录页头部的样式写到全局（全局生效）在styles下新建一个index.less，然后在main.js中引入
// 把非公共样式写到页面组件内部，避免和其它组件样式冲突
.login {
    .van-cell{
        padding: 20px;
    }
.van-button{
    width: 100%;
      background-color: #6db4fb;
      color: #fff;
}
}
</style>
