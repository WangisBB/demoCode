importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.3/workbox-sw.js');

if (workbox) {
  console.log(workbox);
  console.log(`Yay! workbox is loaded`);
} else {
  console.log(`Boo! workbox didn't load `);
}

// var swVersion = 'my-test-cache-v2.0'
// workbox.setConfig({
//   modulePathPrefix: '/static/'
// });
// console.log(workbox.precaching.precacheAndRoute);
workbox.core.setCacheNameDetails({
  prefix: 'tms-app',
  suffix: 'v1',
});
workbox.precaching.precacheAndRoute(
  [
    '/static/scrollreveal.js',
    '/static/zh_CN.js',
  ], {
    directoryIndex: null
  }
)

workbox.routing.registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new workbox.strategies.StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache',
  })
);
workbox.routing.registerRoute(
  /^(\/static\/).*\.js$/, // 匹配的路由
  workbox.strategies.networkOnly()
);
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60, // 最大的缓存数，超过之后则走 LRU 策略清除最老最少使用缓存
        maxAgeSeconds: 3 * 24 * 60 * 60, // 这只最长缓存时间为 30 天
      }),
    ],
  }),
);

// // 监听 service worker 的 install 事件
// this.addEventListener('install', function (event) {
//   // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
//   event.waitUntil(
//     // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
//     caches.open(swVersion).then(function (cache) {
//       // console.log(cache)
//       // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
//       return cache.addAll([
//         // '/',
//         // '/static/',
//         '/static/*.js',
//       ]);
//     })
//   );
// });

// this.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {


//       // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
//       if (response) {
//         return response;
//       }

//       // 如果 service worker 没有返回，那就得直接请求真实远程服务
//       var request = event.request.clone(); // 把原始请求拷过来
//       return fetch(request).then(function (httpRes) {
//         // http请求的返回已被抓到，可以处置了。
//         // 请求失败了，直接返回失败的结果就好了。。
//         if (!httpRes || /^[^2]\d{2}$/.test(String(httpRes.status))) {
//           return httpRes;
//         }
//         // 请求成功的话，将请求缓存起来。
//         var responseClone = httpRes.clone();
//         caches.open(swVersion).then(function (cache) {
//           // console.log(cache, request, responseClone);
//           cache.put(event.request, responseClone);
//         });
//         return httpRes;
//       });
//     })
//   );
// });
// // console.log(self);
// self.addEventListener('activate', function (e) {
//   console.log('Service Worker 状态： activate');
//   // 清理旧版本
//   var cachePromise = caches.keys().then(function (keys) {
//     return Promise.all(keys.map(function (key) {
//       if (key !== swVersion) {
//         return caches.delete(key);
//       }
//     }));
//   })
//   e.waitUntil(cachePromise);
//   return self.clients.claim(); // 更新客户端
// });