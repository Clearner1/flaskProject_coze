扣子Web SDK 是一个 JavaScript 库，集成了扣子 OpenAPI 的对话、文件上传等能力，便于开发者高效、便捷、快速地搭建一个聊天应用。集成扣子 Web SDK 之后，用户可通过网页悬浮窗方式与智能体对话。 

自 1.0.0-beta.4 版本开始，扣子提供全新的 Web SDK 供开发者使用，改版后，Web SDK 支持扣子 OpenAPI 的鉴权能力，开发者可按需选择是否鉴权及鉴权方式，例如指定个人访问令牌或 OAuth 访问密钥完成 Web SDK 的鉴权。如果选择鉴权，开发者使用 Web SDK 需传入访问密钥，扣子平台会识别不同用户身份，并保存各个用户的消息记录，即使用户更换终端设备或浏览器，仍可以通过访问关联的账户查看历史记录。全新版本的 Web SDK 安装及使用方式，可查看安装并使用 Web SDK。

1.0.0-beta.4 版本之前的 Web SDK 为历史版本，开发者无需鉴权即可集成 SDK。历史版本 Web SDK 仅提供基础的对话能力，安全性及扩展性较低，后续将不再维护和更新。历史版本的 Web SDK 安装及使用方式，可查看（历史版本）Web SDK。



![](https://p9-arcosite.byteimg.com/https://p9-arcosite.byteimg.com/obj/tos-cn-i-goo7wpa0wc/475ae72fedf4423883b90404f28a85f2~tplv-goo7wpa0wc-quality:q75.image)



除了基础的对话能力之外，Web SDK 还提供多种定制化能力，支持多种鉴权模式，可调整聊天框的显示效果等多种配置。 

扣子基础版和专业版账号的 Web SDK 使用限额存在差异。 

-   基础版：Web SDK 的免费额度为每个账号 100 次对话。一旦累计对话次数超过免费额度，此账号将无法继续使用扣子 Web SDK。免费额度不适用于通过扣子平台、其他发布渠道或直接通过 API 发起的请求。 

-   专业版：不限制通过 Web SDK 发起对话的频率和次数。通过 Web SDK 发起对话，本质上是调用[发起对话](https://www.coze.cn/docs/developer_guides/chat_v3) API，根据智能体[调用次数](https://www.volcengine.com/docs/84458/1288966#%E6%99%BA%E8%83%BD%E4%BD%93%EF%BC%88bot%EF%BC%89%E8%B0%83%E7%94%A8)和[方舟模型 Token 消耗](https://www.volcengine.com/docs/84458/1288966#%E6%96%B9%E8%88%9F%E6%A8%A1%E5%9E%8B%E6%9C%8D%E5%8A%A1)收取费用。 