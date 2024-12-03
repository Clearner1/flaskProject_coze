'use strict';

// 导入需要的 React Hooks
const { useState, useRef, useEffect } = React;

// 定义主要的聊天组件
function ChatComponent() {
    // 状态管理
    const [messages, setMessages] = useState([]); // 存储聊天消息
    const [userInput, setUserInput] = useState(''); // 用户输入
    const [isLoading, setIsLoading] = useState(false); // 加载状态
    const [conversationId, setConversationId] = useState(null); // 会话ID
    const [isDarkMode, setIsDarkMode] = useState(false); // 深色模式状态
    const [isInitializing, setIsInitializing] = useState(true); // 初始化状态

    // 引用聊天窗口，用于滚动控制
    const chatBoxRef = useRef(null);

    // 自动滚动到底部的函数
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            const scrollOptions = {
                behavior: 'smooth',
                block: 'end'
            };
            chatBoxRef.current.scrollIntoView(scrollOptions);
        }
    };

    // 监听消息变化，自动滚动
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 组件加载时创建新会话
    useEffect(() => {
        createNewConversation();
    }, []);

    // 创建新会话的函数
    const createNewConversation = async () => {
        try {
            setIsInitializing(true);
            const response = await fetch('/api/conversation/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('创建会话失败');
            }

            const data = await response.json();
            setConversationId(data.conversation_id);

            // 加载现有消息
            await loadConversationMessages(data.conversation_id);
        } catch (error) {
            console.error('创建会话错误:', error);
            // 显示错误提示
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '初始化失败，请刷新页面重试。',
                isError: true
            }]);
        } finally {
            setIsInitializing(false);
        }
    };

    // 加载会话消息的函数
    const loadConversationMessages = async (convId) => {
        try {
            const response = await fetch(`/api/conversation/messages?conversation_id=${convId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages);
                }
            }
        } catch (error) {
            console.error('加载消息失败:', error);
        }
    };

    // 处理消息发送的函数
    const handleSubmit = async (e) => {
        e.preventDefault();
        const messageText = userInput.trim();
        if (!messageText || isLoading || !conversationId) return;

        setUserInput(''); // 清空输入框
        setIsLoading(true); // 设置加载状态

        // 立即添加用户消息到界面
        setMessages(prev => [...prev, {
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString()
        }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    conversation_id: conversationId
                }),
            });

            if (!response.ok) {
                throw new Error('网络响应错误');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // 添加空的助手消息
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '',
                timestamp: new Date().toISOString()
            }]);

            // 处理流式响应
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    lastMessage.content += chunk;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('错误:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '抱歉，发生错误。请稍后重试。',
                isError: true,
                timestamp: new Date().toISOString()
            }]);

            // 如果是会话ID错误，尝试创建新会话
            if (error.message.includes('conversation_id')) {
                await createNewConversation();
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 渲染界面
    return React.createElement(
        'div',
        {
            className: `min-h-screen transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`
        },
        [
            // 顶部导航栏
            React.createElement('nav', {
                key: 'nav',
                className: `fixed top-0 left-0 right-0 ${
                    isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'
                } backdrop-blur-lg border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                } z-50`
            },
                React.createElement('div', {
                    className: 'max-w-4xl mx-auto px-4 py-3 flex items-center justify-between'
                }, [
                    React.createElement('h1', {
                        key: 'title',
                        className: `text-lg font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`
                    }, 'AI Assistant'),
                    React.createElement('button', {
                        key: 'theme-toggle',
                        onClick: () => setIsDarkMode(!isDarkMode),
                        className: `p-2 rounded-full transition-colors ${
                            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`
                    }, '🌓')
                ])
            ),

            // 主聊天区域
            React.createElement('div', {
                key: 'chat-container',
                className: 'max-w-4xl mx-auto pt-16 pb-24 px-4'
            },
                React.createElement('div', {
                    ref: chatBoxRef,
                    className: 'space-y-6 py-8'
                }, [
                    // 欢迎消息
                    messages.length === 0 && React.createElement('div', {
                        key: 'welcome',
                        className: `p-4 rounded-2xl ${
                            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        } shadow-lg text-center`
                    }, '欢迎使用 AI 助手，请输入您的问题。'),

                    // 聊天消息列表
                    ...messages.map((message, index) =>
                        React.createElement('div', {
                            key: index,
                            className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`
                        },
                            React.createElement('div', {
                                className: `max-w-[80%] rounded-2xl p-4 ${
                                  message.role === 'user'
                                      ? 'bg-[rgb(220,248,198)] text-gray-900'
                                      : `${
                                          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                                      } shadow-lg`
                              } ${message.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`
                            },
                                React.createElement('div', {
                                    className: 'prose prose-sm max-w-none',
                                    dangerouslySetInnerHTML: {
                                        __html: message.role === 'assistant'
                                            ? marked.parse(message.content)
                                            : message.content
                                    }
                                })
                            )
                        )
                    ),
                ])
            ),

            // 底部输入区域
            React.createElement('div', {
                key: 'input-container',
                className: `fixed bottom-0 left-0 right-0 ${
                    isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'
                } backdrop-blur-lg border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`
            },
                React.createElement('div', {
                    className: 'max-w-4xl mx-auto px-4 py-4'
                },
                    React.createElement('form', {
                        onSubmit: handleSubmit,
                        className: 'flex items-end space-x-4'
                    }, [
                        React.createElement('div', {
                            key: 'textarea-container',
                            className: 'flex-1'
                        },
                            React.createElement('textarea', {
                                value: userInput,
                                onChange: (e) => setUserInput(e.target.value),
                                onKeyDown: (e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                },
                                placeholder: isInitializing
                                    ? '正在初始化会话...'
                                    : '输入消息...',
                                className: `w-full rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isDarkMode
                                        ? 'bg-gray-700 text-white placeholder-gray-400'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                }`,
                                rows: 1,
                                disabled: isInitializing
                            })
                        ),
                        React.createElement('button', {
                            key: 'submit-button',
                            type: 'submit',
                            disabled: isLoading || isInitializing,
                            className: `p-3 rounded-full ${
                                isLoading || isInitializing
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors`
                        }, '发送')
                    ])
                )
            )
        ]
    );
}

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ChatComponent));