# sayfly的网站

基于 Hexo 8.1.2 和定制 Matery 主题的静态博客，计划通过 GitHub Actions 发布到 **https://euxsayfly.github.io/**。不再依赖腾讯云服务器、SSH 部署或已过期域名。

## 当前迁移状态

- 保留原主题、67 篇公开文章及其原有日期/拼音路径。
- 升级到 Node.js 24 LTS、Hexo 8，使用锁文件安装依赖。
- 常用前端库改用随站点发布的本地资源，修复缺图、失效资源引用、代码块及数学公式的渲染兼容问题。
- 已配置 HTTPS 站点地址、canonical、RSS、sitemap、站内搜索和 GitHub Pages 的 404 页面。
- 原带密码测试文章仍留在本机，但不参与构建或 Git 提交。旧密码弹窗不等于加密，新增带密码内容会使构建失败。排除规则只影响新版，不会删除已经公开过的旧部署或 Git 历史；若过去曾暴露有效凭据，仍需单独撤销或更换。
- **仅完成本地配置不等于已经上线**；首次发布仍需 GitHub 登录、推送源码以及在仓库设置中启用 Actions 部署。

## 项目结构

| 位置 | 用途 |
| --- | --- |
| `source/_posts/` | Markdown 文章，同名目录放文章图片 |
| `source/_data/` | 相册、音乐、友情链接等数据 |
| `themes/matery/` | 当前使用的定制主题、模板和静态资源 |
| `_config.yml` | 博客地址、文章路径和构建配置 |
| `themes/matery/_config.yml` | 导航、样式、音乐和第三方功能配置 |
| `scripts/` | 旧链接兼容、公开发布保护及数学公式处理 |
| `tools/` | 渲染回归测试、旧链接清单、生成结果检查 |
| `.github/workflows/pages.yml` | 自动构建、检查和发布 |
| `public/` | 自动生成的网页，不手动编辑，也不提交 |
| `.local/` | 本机备份与辅助工具，全部不提交 |

本次升级前的恢复备份为 `.local/backups/blog-before-upgrade-20260910.zip`。其他旧主题、旧 Gulp 文件和 `.deploy_git/` 保留在本机，不参与新源码发布。

## 本地使用

安装 Node.js **24.15 或更新的 24.x**，然后在仓库目录运行：

```sh
npm ci
npm run build
npm run dev
```

预览地址为 [http://127.0.0.1:4000/](http://127.0.0.1:4000/)，按 Ctrl+C 停止。

本机原先装有 Node.js 10，不适合新项目。可以使用已提供的 PowerShell 入口，它会选择兼容的 Node.js，不会改动系统安装：

在这台电脑打开 PowerShell，平时预览只需要：

```powershell
cd C:\Users\SAYFLY\myBlog
.\blog.ps1 dev
```

然后打开 http://127.0.0.1:4000/ 。预览期间保留终端窗口，结束时按 Ctrl+C。这个地址只能在本机访问，并不代表网站已经上线。修改普通文章后通常会自动更新；修改 `_config.yml` 中的网站名称等设置后，需要停止并重新启动预览。

只有首次安装或依赖发生变化时才需 `install`；希望在发布前完整检查一次时运行 `build`：

```powershell
.\blog.ps1 install
.\blog.ps1 build
.\blog.ps1 dev
```

`npm test` 运行渲染测试；`npm run check` 检查已有生成结果；`npm run build` 会先测试，再清理、生成并验证所有页面。安装必须使用锁文件，不建议运行 `npm audit fix --force`。

## 首次发布到 GitHub Pages

目标仓库：[euxsayfly/euxsayfly.github.io](https://github.com/euxsayfly/euxsayfly.github.io)。

截至迁移检查，远端 `master` 保存的是旧版生成网页，且存在旧域名配置。**保留该分支；新版源码使用独立的 `main` 分支，不强推覆盖 `master`。**

1. 在本机 Git 或 GitHub CLI 中登录 `euxsayfly`。不要把令牌、密码或 SSH 私钥写进文章、配置、提交历史或聊天。
2. 提交源码到 `main`，确认忽略规则没有纳入 `.local/`、`node_modules/`、`public/` 或测试文章，再推送：
   ```sh
   git remote -v
   # 仅在尚无 origin 时添加：
   git remote add origin https://github.com/euxsayfly/euxsayfly.github.io.git
   git add .
   git commit -m "Upgrade blog and configure GitHub Pages"
   git push -u origin main
   ```
3. 在仓库设置中将默认分支改为 `main`；进入 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 在 **Custom domain** 清除旧的 `saysomewy.com` 绑定；本项目不需要 `CNAME` 文件。确认 HTTPS 可用并启用 **Enforce HTTPS**（若界面允许设置）。
5. 如果旧 `github-pages` 环境限制了部署分支，在 **Settings → Environments → github-pages** 中允许 `main`。
6. 在 **Actions → Build and deploy blog** 查看运行结果。首次推送若早于上述设置导致部署失败，设置完成后重新运行；以部署任务成功及真实网页访问通过为准。

工作流在 `main` 推送时发布；PR 只构建和检查，不发布。使用 GitHub 自带的工作流令牌，无需配置个人令牌或服务器部署密钥。

参考：[GitHub Pages 自定义工作流官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 以后更新文章

1. 修改 `source/_posts/` 中的 Markdown；新文章可以通过 `npx hexo new "文章标题"` 创建。日期应明确写入 front matter。
2. 图片优先放同名文章目录，用 `{% asset_img 文件名.jpg %}` 引用。共享资源放 `themes/matery/source/medias/`。文件名大小写必须一致。
3. 公式文章设置 `mathjax: true`，使用成对的 `$...$` 或 `$$...$$`。代码块的结束标记单独占一行，不带额外字符。
4. 运行 `npm run build`，预览后提交并推送到 `main`；Actions 自动更新网站。

不要改动旧文章的日期或标题对应路径；`tools/legacy-routes.json` 会在构建时检查 67 个历史文章地址仍存在。

## 尚需恢复或确认的外部功能

- **相册**：原图引用 `euxsayfly/blog_imgs`。该仓库目前公开访问返回 404，本地也没有相册原图；相册元数据已保留，页面暂时显示“原图待恢复”。找到照片后，修改主题配置的 `gallery.baseUrl`，确认路径大小写和全部图片可访问，再将 `gallery.available` 改为 `true`。例如将照片放到 `source/gallery-images/img/`，对应 `baseUrl: /gallery-images`。
- **音乐**：保留原网易云曲目，链接改为 HTTPS。播放仍受上游接口、版权和网络影响；可改用自己有权发布的本地音频。
- **数学公式**：由 MathJax CDN 在浏览器中排版；正文中的 TeX 会原样保留，不再被 Markdown 的斜体/换行处理破坏。
- 每日诗词、访问统计等仍依赖外部服务。页面提供诗词备用文字；本地验证不保证所有第三方接口在线。
- 评论、百度统计、旧备案信息默认不启用；若需要，重新配置自己的服务。不要把客户端密钥当作隐私保护方式。
- 站点源码仓库是公开的，请只提交可以公开的内容。GitHub Pages 也不适合保存需要身份验证的私密文章。

本次只升级构建与发布方式，不重写旧文章的观点和技术内容；文中较早的软件下载地址与教程可能已过时。

## 主题与许可

沿用原项目的 [hexo-blog-fly](https://github.com/shw2018/hexo-blog-fly) / [Matery](https://github.com/shw2018/hexo-theme-matery) 定制主题及其现有署名。第三方资源遵循各自许可，原仓库许可见 `LICENSE`。博客文章和照片的权利不因构建升级而改变。
