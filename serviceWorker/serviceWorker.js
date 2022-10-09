// 判断是否支持 serviceWorker
if ('serviceWorker' in navigator) {
  // // 如果支持 则在页面加载好的时候开始注册 Service Worker
  window.addEventListener('load', function () {
    // 注册时候接收 2 个参数：Service Worker 所在目录、以及子目录
    navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      .then(function (registration) {
        // 注册成功
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function (err) {
        // 注册失败
        console.log('ServiceWorker registration failed: ', err);
      });
  });
  navigator.serviceWorker.ready.then(registration => {
    registration.unregister();
  });
}