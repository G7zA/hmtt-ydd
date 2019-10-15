/** 专门处理时间的功能模块 */
import dayjs from 'dayjs' // 引入day.js
import 'dayjs/locale/zh-cn' // 配置中文语言包
import rTime from 'dayjs/plugin/relativeTime' // 引入插件处理相对时间
import Vue from 'vue' // 10.引入vue

dayjs.extend(rTime) // 调用插件 把插件传给了dayjs的extend方法这样就实现了相对时间的处理

dayjs.locale('zh-cn') // 调用中文语言包

// 为了防止重名我们把引入的插件换个名字叫做rTime 然后把它作为函数名，接收一个参数value
// export function relativeTime (value) {
//   return dayjs().from(dayjs(value))
// //   value:可以是一个具体的时间、也可以是一个字符串、时间戳 日期对象 都可以
// // 计算并返回指定时间到现在最新时间的相对时间
// // 9.这个时候我们可以把处理时间的函数作为过滤器并注册成全局过滤器这样我们就可以在全局的模版中使用
// }

// 11.注册全局过滤器 第一参数：过滤器名字叫relativeTime 第二个参数：过滤器函数 使用过滤器就会调用这个函数，函数return的返回值就会渲染到使用过滤器的模版中
Vue.filter('relativeTime', value => {
  return dayjs().from(dayjs(value))
})
// 12.我们需要让代码执行一下 所以需要在main.js中引入加载 加载代码执行了就会给vue注册过滤器就可以使用了
/**
 * 13.最后在index.vue中找到我们需要做时间处理的发布日期的模版中添加过滤器即可  <span>{{ article.pubdate | relativeTime }}</span>
 * article.pubdate 就会作为参数传递给relativeTime 过滤器函数 那么过滤器函数中接收到的参数value就是我们传递过来的article.pubdate（文章发布时间）这样返回的数据就是已经做过处理的数据了，就绑定在了需要使用过滤器的模版中了也就是需要做相对时间处理的article.pubdate（文章发布时间）
 */

// 这里把处理时间的代码都封装成一个个的小函数，然后在需要的时候引入加载调用即可
