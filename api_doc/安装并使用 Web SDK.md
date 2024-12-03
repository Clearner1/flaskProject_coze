本文介绍如何安装并使用扣子 Web SDK，开发者可以参考本文档在自己开发的网站中快速添加一个智能体，为网站集成智能对话服务。

获取一个访问密钥，用于 Web SDK 的身份认证与鉴权。

-   体验或调试场景：建议开发者生成一个短期的个人访问令牌（PAT），快速跑通 Web SDK 的整体流程。

-   在授权页面添加新令牌，并添加权限。

-   
    
    ![](https://p9-arcosite.byteimg.com/tos-cn-i-goo7wpa0wc/d68a72ab3d7c47ebb33f403288b26d37~tplv-goo7wpa0wc-quality:q75.image)
    
    

-   线上环境：线上环境应使用 OAuth 鉴权方案。OAuth 鉴权方案的详细说明可参考OAuth 授权概述。

-   说明
    
    线上环境不建议使用 PAT 鉴权，PAT 是整个空间的公共密钥，使用 PAT 鉴权时无法区分不同用户的身份信息。
    
    

-   创建 OAuth 应用，并根据鉴权模式进行授权。使用 Web SDK 所需的完整权限列表可参考权限要求。

-   
    
    ![](https://p9-arcosite.byteimg.com/https://p9-arcosite.byteimg.com/obj/tos-cn-i-goo7wpa0wc/29371e8cb542463fb400b1cfbc2f264d~tplv-goo7wpa0wc-quality:q75.image)
    
    

通过扣子访问令牌进行 OpenAPI 的鉴权，支持个人访问密钥（PAT）和普通 OAuth 访问密钥。关于两种访问密钥的区别，可参考鉴权方式。对于已入驻的第三方渠道，也可以使用渠道申请的 OAuth 访问密钥鉴权，申请方式可参考渠道入驻概述。

访问密钥必须被授予指定的权限，才能使用 Web SDK 的各项能力。Web SDK 所需的权限列表如下：

说明

渠道 OAuth 访问密钥的权限点是渠道类型的 OAuth 应用中设置的权限点，创建应用并授权的详细说明可参考OAuth JWT 授权（渠道场景）。



登录[扣子](https://www.coze.com/)平台。 

在智能体的编排页面，复制并保存当前页面 URL 的最后一个字符串。 

-   这个是智能体 ID，将在以后的配置中使用。 

点击发布。 

在发布页面，选择 Web SDK，并单击发布。

-   未发布为 Web SDK 的智能体，使用 Web SDK 时会报错 提示：智能体已经被解绑。

-   
    
    ![](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQyIiBoZWlnaHQ9IjE0MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)
    
    

确认审核通过。

-   你可以在发布历史页面查看每次发布的审核结果，审核通过后再能执行后续操作安装 Web SDK。查看发布历史的方式，可参考管理智能体版本。

重新进入发布页面复制 SDK 安装代码。

回到智能体的编排页面，再次点击发布，进入发布页面。 

在发布页面，点击安装。 

-   页面将展示智能体的安装代码，安装代码中默认使用最新版本的 Web SDK 配置。

-   
    
    ![](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQ4IiBoZWlnaHQ9IjE1MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)
    
    

复制此代码。

你可以直接在页面中通过 script 标签的形式加载 Web SDK 的 js 代码，将步骤一中复制好的安装代码粘贴到网页的 <body> 区域中即可。



<script src\="https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/cn/index.js"\></script\>



安装 Web SDK 后，您现在可以初始化智能体客户端。在页面中通过调用 CozeWebSDK.WebChatClient 来生成聊天框，当前页面中聊天框包括 PC 和移动端两种布局样式。在 PC 端中，聊天框位于页面右下角，移动端聊天框会铺满全屏。

调用 CozeWebSDK.WebChatClient 时，你需要配置以下参数：

-   config：必选参数，表示智能体配置信息。你需要在其中指定 botId，即智能体的 ID，也就是步骤一中在智能体编排页面 URL 中获取的智能体 ID。

-   auth：可选参数，表示鉴权方式，未配置此参数表示不鉴权。如需鉴权，可以将 type 设置为 token，并在 token 中指定访问密钥。调试时建议将 token 指定为准备工作中获取的 PAT。



const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

//鉴权方式，默认type 为unauth，表示不鉴权；建议设置为 token，表示通过PAT或OAuth鉴权

//type 为 token 时，需要设置PAT或OAuth访问密钥

token: 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

//访问密钥过期时，使用的新密钥，可以按需设置。

onRefreshToken: () => 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',



扣子 Web SDK 支持多种属性配置，开发者可以按需调整智能体对话框的多种展示效果，例如展示的用户信息、对话框 UI 效果、悬浮球展示、底部文案等。

你可以在 WebChatClient 方法中添加各种属性，实现对应的效果。目前支持的属性如下：

你可以添加一个 destroy 方法销毁智能体客户端。 



const client = new CozeWebSDK.WebChatClient(options); 



config 参数用于指定智能体。你需要在其中指定 botId，即智能体的 ID，也就是步骤一中在智能体编排页面 URL 中获取的智能体 ID。

auth 属性用于配置鉴权方式。不添加此参数时表示不鉴权，也可以通过此参数指定使用 PAT 或 OAuth 鉴权。配置说明如下：



const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

token: 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

onRefreshToken: async () => 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',



以使用 OAuth 鉴权为例，配置鉴权的方式如下：



const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

token: 'czs\_RQOhsc7vmUzK4bNgb7hn4wqOgRBYAO6xvpFHNbnl6RiQJX3cSXSguIhFDzgy\*\*\*\*',

onRefreshToken: async () => 'czs\_RQOhsc7vmUzK4bNgb7hn4wqOgRBYAO6xvpFHNbnl6RiQJX3cSXSguIhFDzgy\*\*\*\*',



userInfo 参数用于设置对话框中的显示智能体用户信息，包括对话框中的用户头像和用户名。同时，此处指定的用户 ID 也会通过发起对话 API 传递给扣子服务端。



const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

token: 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

onRefreshToken: async () => 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',



ui.base 参数用于添加聊天窗口的整体 UI 效果，包括应用图标、页面展示模式、语言属性等。



const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

token: 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

onRefreshToken: async () => 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',

icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',



asstBtn 参数用于控制是否在页面右下角展示悬浮球。默认展示，用户点击悬浮球后将弹出聊天窗口。



![](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDMxIiBoZWlnaHQ9IjIzOSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)



若设置为不展示悬浮球，开发者需要通过以下方法控制聊天框的展示或隐藏效果。

-   显示聊天框：cozeWebSDK.showChatBot()

-   隐藏聊天框：cozeWebSDK.hideChatBot()



const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

token: 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

onRefreshToken: async () => 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',

icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',



不展示悬浮球时，你可以通过以下方式显示聊天框或隐藏聊天框。



<button onClick\={() => {

cozeWebSDK.showChatBot();

<button onClick\={() => {

cozeWebSDK.hideChatBot();



聊天框底部会展示智能体对话服务的提供方信息，默认为Powered by coze. AI-generated content for reference only.。开发者通过 footer 参数隐藏此文案或改为其他文案，支持在文案中设置超链接。



![](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDYyIiBoZWlnaHQ9IjE1NiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)





const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

token: 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

onRefreshToken: async () => 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',

icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',

expressionText: 'Powered by {{name}}&{{name1}}',

link: 'https://www.test1.com'

link: 'https://www.test2.com'





![](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDU4IiBoZWlnaHQ9IjE2OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)



chatBot 参数用于控制聊天框的 UI 和基础能力，包括标题、大小、位置等基本属性，还可以指定是否支持在聊天框中上传文件。此参数同时提供多个回调方法，用于同步聊天框显示、隐藏等事件通知。

-   onHide：当聊天框隐藏的时候，会回调该方法。

-   onShow: 当聊天框显示的时候，会回调该方法。

-   onBeforeShow: 聊天框显示前调用，如果返回了 false，则不会显示。支持异步函数。

-   onBeforeHide: 聊天框显示前调用，如果返回了 true，则不会隐藏。支持异步函数。

在以下示例中，聊天框标题为 Kids' Playmate | Snowy，并开启上传文件功能。



![](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDc3IiBoZWlnaHQ9IjQ4MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)





const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '740849137970326\*\*\*\*',

token: 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

onRefreshToken: async () => 'pat\_zxzSAzxawer234zASNElEglZxcmWJ5ouCcq12gsAAsqJGALlq7hcOqMcPFV3wEVDiqjrg\*\*\*\*',

url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',

icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',

expressionText: 'Powered by {{name}}&{{name1}}', linkvars: {

link: 'https://www.test1.com'

link: 'https://www.test2.com'

title: "Kids' Playmate | Snowy",



通过 chatbot 的 el 参数设置组件的示例代码如下：



<!-- Do not delete start -->

<link rel\="stylesheet" href\="./main.css" />

<!-- Do not delete end -->

<button onclick\="onClick()"\>Show</button\>

<div id\="id1" style\="postion: absolute; top: 100px; left: 100px;width: 200px; height: 500px"\></div\>

<script src\=" https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/0.1.0-alpha.xd411cb3b3d/libs/cn/index.js"\></script\>

<!-- Do not delete start -->

<script src\="./index.js"\></script\>





扣子 Web SDK 将持续更新迭代，支持丰富的对话能力和展示效果。你可以在 Web SDK 的 script 标签中指定 Web SDK 的最新版本号，体验和使用最新的 Web SDK 对话效果。

在以下代码中，将 {{version}} 部分替换为 Web SDK 的最新版本号。你可以在Web SDK 发布历史中查看最新版本号。



<script src\="https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/{{version}}/libs/cn/index.js"\></script\>



如果不再需要通过 Web SDK 使用智能体，可以在发布页面点击解绑按钮。一旦解绑，智能体就无法通过集成的 Web 应用程序使用。 如果您想恢复 Web 应用程序的访问，需要再次将智能体发布为 Web SDK。 



![](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQ4IiBoZWlnaHQ9IjE1MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==)





<div id\="position\_demo"\></div\>

<script src\="https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.0.0-beta.4/libs/cn/index.js"\></script\>

const cozeWebSDK = new CozeWebSDK.WebChatClient({

botId: '742477211246629\*\*\*\*',

//鉴权方式，默认type 为unauth，表示不鉴权；建议设置为 token，表示通过PAT或OAuth鉴权

//type 为 token 时，需要设置PAT或OAuth访问密钥

token: 'pat\_82GrrdfNWPMnlcY58r98Rzqiev2s5NyrqCR8Ypbh5hOomzZN4ivb325PZAd\*\*\*\*',

//访问密钥过期时，使用的新密钥，可以按需设置。

onRefreshToken: () => 'pat\_82GrrdfNWPMnlcY58r98Rzqiev2s5NyrqCR8Ypbh5hOomzZN4ivb325PZAdZ\*\*\*\*',

