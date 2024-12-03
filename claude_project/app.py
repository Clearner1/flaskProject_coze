from flask import Flask, request, Response, stream_with_context, render_template
from cozepy import Coze, TokenAuth, Message, ChatEventType, MessageContentType
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

app = Flask(__name__)

# 初始化 Coze 客户端
coze_api_token = os.getenv("COZE_API_TOKEN")
bot_id = os.getenv("BOT_ID")
coze = Coze(auth=TokenAuth(token=coze_api_token), base_url="https://api.coze.cn")

# 存储活跃的会话信息
active_conversations = {}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/conversation/create', methods=['POST'])
def create_conversation():
    try:
        # 使用 Coze API 创建新会话
        conversation = coze.conversations.create()
        conversation_id = conversation.id

        # 为这个会话生成一个唯一的用户ID
        user_id = str(uuid.uuid4())

        # 存储会话信息
        active_conversations[conversation_id] = {
            'user_id': user_id,
            'messages': []
        }

        return {
            'conversation_id': conversation_id,
            'user_id': user_id
        }
    except Exception as e:
        return {'error': str(e)}, 500


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    conversation_id = data.get('conversation_id')

    if not user_message:
        return {'error': 'No message provided'}, 400

    if not conversation_id:
        return {'error': 'No conversation_id provided'}, 400

    # 获取会话信息
    conversation = active_conversations.get(conversation_id)
    if not conversation:
        try:
            # 如果会话不存在，尝试重新创建
            new_conversation = coze.conversations.create()
            user_id = str(uuid.uuid4())
            conversation = {
                'user_id': user_id,
                'messages': []
            }
            active_conversations[new_conversation.id] = conversation
            conversation_id = new_conversation.id
        except Exception as e:
            return {'error': f'Failed to create conversation: {str(e)}'}, 500

    def generate():
        try:
            # 使用流式API进行对话
            for event in coze.chat.stream(
                    bot_id=bot_id,
                    user_id=conversation['user_id'],
                    conversation_id=conversation_id,
                    auto_save_history=True,
                    additional_messages=[Message.build_user_question_text(user_message)]
            ):
                if event.event == ChatEventType.CONVERSATION_MESSAGE_DELTA:
                    message = event.message
                    if message.content:
                        yield message.content
                elif event.event == ChatEventType.CONVERSATION_MESSAGE_COMPLETED:
                    if event.message.type == 'answer':
                        # 保存完整的回复消息到会话历史
                        conversation['messages'].append({
                            'role': 'assistant',
                            'content': event.message.content
                        })

        except Exception as e:
            yield f"Error: {str(e)}"

    # 保存用户消息到会话历史
    conversation['messages'].append({
        'role': 'user',
        'content': user_message
    })

    return Response(
        stream_with_context(generate()),
        mimetype='text/plain'
    )


@app.route('/api/conversation/messages', methods=['GET'])
def get_conversation_messages():
    conversation_id = request.args.get('conversation_id')
    if not conversation_id:
        return {'error': 'No conversation_id provided'}, 400

    conversation = active_conversations.get(conversation_id)
    if not conversation:
        return {'error': 'Conversation not found'}, 404

    return {'messages': conversation['messages']}


if __name__ == '__main__':
    app.run(debug=True)