# PanShare Lite · 复古游戏资源分享

一个**纯静态、零后端**的复古游戏资源导航站。汇集 **53 个**复古游戏资源包，总计约 **5.05 TB**、**10 万+** 个文件，全部托管在夸克网盘，免费分享、一键转存。

在线预览：<https://panshare.cc.cd>

## 特性

- **无需服务器** —— 纯 HTML / CSS / JS + 一个 JSON 数据文件，可部署到 Cloudflare Pages、GitHub Pages、Vercel 等任意静态托管
- **纯客户端搜索** —— 数据加载后在浏览器内存中过滤，没有后端接口、没有数据库
- **零外部依赖** —— 不引入任何 CDN 资源，国内网络可直接打开
- **响应式** —— 桌面三列、平板两列、手机单列
- **一键复制** —— 点击卡片上的「复制」按钮直接复制链接，粘贴到夸克 APP 即可转存

## 资源分类

| 分类 | 数量 | 内容 |
| --- | --- | --- |
| 🎮 掌机游戏 | 27 | PSP · PSV · GBA · NDS · 3DS |
| 🕹️ 街机·主机 | 13 | MAME · FBN · PS2 · PS1 · DOS · FC |
| 📟 开源掌机 | 7 | RG35XX · Miyoo · 天马G · Wii 汉化 |
| ⚡ 改版 HACK | 2 | 魔改 · 汉化改版 |
| 📚 游戏周边 | 4 | 杂志攻略 · 金手指 · 模拟器 |

## 目录结构

```
.
├── index.html          # 页面结构
├── resources.json      # 资源数据（唯一数据源）
└── assets/
    ├── style.css
    └── app.js
```

## 本地预览

由于使用了 `fetch()` 读取 JSON，需要通过 HTTP 打开（直接双击 `index.html` 会被浏览器的 file 协议限制拦截）：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 部署到 Cloudflare Pages

1. 登录 Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选择本仓库，点击 **Begin setup**
3. 构建配置：
   - Framework preset：`None`
   - Build command：留空
   - Build output directory：`/`
4. 保存部署后，进入 **Custom domains** 绑定自己的域名

> 根目录部署即可，无需任何构建步骤。

## 添加 / 更新资源

编辑 `resources.json` 中的 `items` 数组，新增一条即可：

```json
{
  "no": 54,
  "name": "资源名称",
  "cat": "掌机游戏",
  "size": "12.3 GB",
  "sizeGB": 12.3,
  "link": "https://pan.quark.cn/s/xxxxxxxx",
  "fileNum": 1200
}
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `no` | 编号，用于排序和展示 |
| `name` | 资源标题 |
| `cat` | 分类名，需与 `cats` 数组中的值一致 |
| `size` | 容量展示字符串 |
| `sizeGB` | 容量数值（GB），用于排序和总容量统计 |
| `link` | 夸克网盘分享链接 |
| `fileNum` | 文件数量 |

修改后同步更新顶部的 `updated`、`total`、`totalSizeGB`、`totalFiles` 字段。

## 免责声明

本站仅收录网络公开分享的资源链接，不存储任何实际文件内容，仅供学习交流与怀旧体验使用。请于下载后 24 小时内删除，喜欢的游戏请购买正版支持开发商。若您是版权方且认为相关内容侵犯了您的权益，请联系 <second250@gmail.com>，我们将在核实后第一时间移除。

## License

[MIT](./LICENSE) © PanShare Lite
