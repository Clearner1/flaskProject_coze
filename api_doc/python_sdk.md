本文介绍如何使用 Coze Python SDK 完成扣子的常用操作，例如如何初始化 SDK、创建一个智能体草稿、发布智能体为 API 服务、和智能体对话等。

说明

-   已安装 Coze Python SDK。更多信息，可参见安装 Python SDK。

-   已实现授权流程，并通过环境变量等方式配置了访问密钥。详细说明可参考配置访问密钥。



初始化 Coze client 之后，才可以向扣子服务端发送 OpenAPI 请求。初始化时推荐通过环境变量动态获取访问密钥，以免硬编码引发数据安全风险。



from cozepy import Coze, TokenAuth, COZE\_CN\_BASE\_URL

coze = Coze(auth=TokenAuth(os.getenv("coze\_api\_token")), base\_url=COZE\_CN\_BASE\_URL)



通过 API 方式和智能体对话之前，你需要先创建一个智能体，并将其发布为 API 服务。你可以在扣子平台中创建智能体并发布，也可以通过调用相关的 API 实现。调用 API 创建智能体时，部分配置对应的 API 参数暂未开放，你只能为智能体添加知识库等有限的配置。创建智能体的操作步骤可参考搭建一个 AI 助手智能体，将智能体发布为 API 服务的操作步骤可参考发布智能体为 API 服务。

-   完整示例代码，请参见 [GitHub 示例](https://github.com/coze-dev/coze-py/blob/main/examples/bot_publish.py)。

-   相关 API 接口描述，请参见：

-   创建智能体

-   发布智能体



from pathlib import Path

\# Get an access\_token through personal access token oroauth.

coze\_api\_token = os.getenv("COZE\_API\_TOKEN")

from cozepy import Coze, TokenAuth, BotPromptInfo, Message, ChatEventType, MessageContentType \# noqa

\# Init the Coze client through the access\_token.

coze = Coze(auth=TokenAuth(token=api\_coze\_token), base\_url=COZE\_CN\_BASE\_URL)

\# Call the upload file interface to get the avatar id.

avatar = coze.files.upload(file=Path("/path/avatar.jpg"))

\# Invoke the create interface to create a bot in the draft status.

\# The bot should exist under a space and your space id needs configuration.

space\_id="workspace id",

prompt\_info=BotPromptInfo(prompt="your are a translator, translate the following text from English to Chinese"),

\# Call the publish interface to publish the bot on the api channel.

coze.bots.publish(bot\_id=bot.bot\_id)

\# Call the coze.chat.stream method to create a chat. The create method is a streaming

\# chat and will return a Chat Iterator. Developers should iterate the iterator to get

\# chat event and handle them.

for event in coze.chat.stream(

\# The published bot's id

\# biz user id, maybe random string

additional\_messages=\[Message.build\_user\_question\_text("chinese")\],

event.event == ChatEventType.CONVERSATION\_MESSAGE\_DELTA

and event.message.content.type == MessageContentType.TEXT

print(event.message.content, end="")



发起对话接口用于向指定智能体发起一次对话，支持在对话时添加对话的上下文消息，以便智能体基于历史消息做出合理的回复。开发者可以按需选择响应方式，即流式或非流式响应，响应方式决定了开发者获取智能体回复的方式。

-   流式响应：智能体在生成回复的同时，将回复消息以数据流的形式逐条发送给客户端。处理结束后，服务端会返回一条完整的智能体回复。详细说明可参考[流式响应](https://www.coze.cn/docs/developer_guides/chat_v3#AJThpr1GJe)。 

-   非流式响应：无论对话是否处理完毕，立即发送响应消息。开发者可以通过接口[查看对话详情](https://www.coze.cn/docs/developer_guides/retrieve_chat)确认本次对话处理结束后，再调用[查看对话消息详情](https://www.coze.cn/docs/developer_guides/list_chat_messages)接口查看模型回复等完整响应内容。详细说明可参考[非流式响应](https://www.coze.cn/docs/developer_guides/chat_v3#337f3d53)。

本文档以流式响应为例，演示通过 API 方式和智能体对话相关实例代码。你也可以查看 Coze Python SDK [示例代码目录](https://github.com/coze-dev/coze-py/tree/main/examples)，查看发起对话接口的其他实现方式，例如非流式响应、对话中发送多模态内容等。



\# Get an access\_token through personal access token oroauth.

coze\_api\_token = os.getenv("COZE\_API\_TOKEN")

from cozepy import Coze, TokenAuth, Message, ChatStatus, MessageContentType, ChatEventType \# noqa

\# Init the Coze client through the access\_token.

coze = Coze(auth=TokenAuth(token=coze\_api\_token), base\_url=COZE\_CN\_BASE\_URL)

\# Create a bot instance in Coze, copy the last number from the web link as the bot's ID.

\# The user id identifies the identity of a user. Developers can use a custom business ID

\# Call the coze.chat.stream method to create a chat. The create method is a streaming

\# chat and will return a Chat Iterator. Developers should iterate the iterator to get

\# chat event and handle them.

for event in coze.chat.stream(

bot\_id=bot\_id, user\_id=user\_id, additional\_messages=\[Message.build\_user\_question\_text("How are you?")\]

if event.event == ChatEventType.CONVERSATION\_MESSAGE\_DELTA:

print(f"role={message.role}, content={message.content}")

