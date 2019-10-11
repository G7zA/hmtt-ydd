<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="标题" />
    <!-- 登录表单 -->
    <van-cell-group>
      <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />

      <van-field v-model="user.code" type="password" label="验证码" placeholder="请输入验证码" required />
    </van-cell-group>
    <!-- 登录表单 -->

    <!-- 登录按钮 -->
    <van-button type="info">信息按钮</van-button>
  </div>
</template>

<script>
export default {
  //   name: 'LoginIndex'
  data: function () {
    return {
      user: {
        mobile: 18748158195,
        code: 246810
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
