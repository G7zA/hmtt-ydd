<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="标题" />
    <!-- 登录表单 -->
    <ValidationObserver ref="loginForm">
      <van-cell-group>
        <!--
      name 提示的文本
      rules 验证规则
        required 必填项
      v-slot="{ errors }" 获取校验结果数据
        errors[0] 读取校验结果的失败信息
        -->
        <ValidationProvider name="手机号" rules="required|phone" v-slot="{ errors }">
          <van-field
            v-model="user.mobile"
            clearable
            label="手机号"
            placeholder="请输入手机号"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="验证码" rules="required|max:6" v-slot="{ errors }">
          <van-field
            v-model="user.code"
            clearable
            type="password"
            label="验证码"
            placeholder="请输入验证码"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </van-cell-group>
      <!-- 登录表单 -->
    </ValidationObserver>

    <!-- 登录按钮 -->
    <!-- 给登录按钮注册点击事件处理函数  -->
    <van-button type="info" @click="getLogin">登录</van-button>
  </div>
</template>

<script>
// import resquest from '@/utils/request' // 导入封装好的axios请求函数（request）
import { login } from '@/api/user' // 引入封装的登录请求模块函数
import { setItem } from '@/utils/storage' // 引入设置token的方法请求模块

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
      const isValid = await this.$refs.loginForm.validate()
      // 如果验证失败，阻止表单提交
      if (!isValid) {
        return
      }
      // 验证通过，loading加载 请求
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登录中'
      })

      try {
        //   请求提交表单数据 已经封装用户接口相关请求模块在user.js中
        const { data } = await login(this.user)

        // 请求提交表单数据 已经封装用户接口相关请求模块在user.js中
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/app/v1_0/authorizations',
        //   data: this.user
        // })
        // console.log(data)
        //   结束loading 提示 先清除loading
        // 如果 loading 后面有seccess、fail 之类的提示 就不需要手动的关闭了
        // 因为seccess、fail 会自动把 loading 页关掉
        // toast.clear()

        // 再提示登录成功
        // this.$toast.success({
        //   duration: 2000,
        //   message: '登录成功'
        // })
        // 第三步 登录成功，将数据存储到容器中 为了防止刷新页面token丢失我们单独封装一个本地存储的存储模块（utils下新建一个storge文件）
        this.$store.commit('setUser', data.data)
        // 第五步 为了防止页面刷新数据丢失，登录成功以后将token存储到本地存储 第六步 然后在容器中使用本地存储中的数据进行初始化token
        setItem('user', data.data)
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
  .van-cell {
    padding: 20px;
  }
  .van-button {
    width: 100%;
    background-color: #6db4fb;
    color: #fff;
  }
}
</style>
