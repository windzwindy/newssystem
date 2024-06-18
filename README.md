# NewsSystem

## db 数据来源

https://gitee.com/wellington8086/react_newssystem

## 千峰 React 视频项目（全球新闻发布管理系统）

- React-V18
- React-Router-V6
- Redux
- Vite
- JSON-Server
- Yarn
- Echarts
- lodash

## 开发

```bash
# 安装依赖
yarn
# 开发
yarn dev
# 编译
yarn build
```

## 已知bug

- 登录后要手动刷新页面才显示数据

- 更新新闻时，新闻编辑器换行再写，内容更新不了

- 等等等等.......

## 其中一些异步更新组件，但要初始化解决方案
```javascript
async () => {
    await setState();

    setTimeout(() => {
        // 初始化
        init();
    });
}
```