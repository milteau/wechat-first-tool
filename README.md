# 微信记事本小程序

一个简洁易用的微信记事本/备忘录小程序，使用 Uni-app + Vue 3 + TypeScript 开发。

## 功能特性

- 📝 **笔记管理** - 创建、编辑、删除笔记
- 🔍 **搜索功能** - 支持按标题和内容搜索笔记
- 🏷️ **分类管理** - 对笔记进行分类管理，支持自定义颜色标签
- 💾 **本地存储** - 数据保存在本地，无需服务器

## 技术栈

- **框架**: [Uni-app](https://uniapp.dcloud.net.cn/) + Vue 3
- **语言**: TypeScript
- **状态管理**: Pinia
- **样式**: SCSS

## 开发预览

```bash
# 安装依赖
npm install

# 微信小程序开发预览
npm run dev:mp-weixin

# H5 开发预览
npm run dev:h5
```

1. 运行 `npm run dev:mp-weixin` 后，用微信开发者工具导入 `dist/dev/mp-weixin` 目录
2. 即可在微信开发者工具中预览小程序

## 项目结构

```
src/
├── pages/
│   ├── index/          # 笔记列表页
│   ├── detail/         # 笔记编辑页
│   └── category/       # 分类管理页
├── components/
│   ├── NoteCard.vue    # 笔记卡片组件
│   ├── CategoryTag.vue # 分类标签组件
│   └── SearchBar.vue   # 搜索栏组件
├── stores/
│   └── note.ts         # 笔记状态管理
├── utils/
│   └── storage.ts      # 本地存储工具
├── App.vue
├── main.ts
├── pages.json
├── manifest.json
└── uni.scss
```

## 截图预览

| 笔记列表 | 编辑笔记 | 分类管理 |
|:---:|:---:|:---:|
| ![列表](screenshots/list.png) | ![编辑](screenshots/edit.png) | ![分类](screenshots/category.png) |

## 开源协议

MIT License
