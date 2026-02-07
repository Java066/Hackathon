/**
 * AI Chat Page Handler
 */

(function() {
    const AIChat = {
        messages: [
            { type: 'ai', text: 'Hi! 👋 I\'m your AI financial assistant. Ask me where your money goes and I\'ll analyze your summary.' }
        ],

        suggestedPrompts: [
            'Where did most of my money go?',
            'How can I reduce my spending?',
            'Any suspicious transactions?',
            'How can I save more this month?'
        ],

        init() {
            this.render();
        },

        render() {
            const mainLayout = document.getElementById('mainLayout');
            const mainContent = document.getElementById('mainContent');

            mainLayout.innerHTML = Components.createHeader('Ahmed Khan') +
                                   Components.createSidebar('ai-chat');

            mainContent.innerHTML = `
                <h1>🤖 AI Financial Assistant</h1>

                <div class="chat-container card">
                    <div class="chat-messages" id="chatMessages"></div>

                    <div class="suggested-prompts" id="suggestedPromptsDiv"></div>

                    <div class="chat-input-area">
                        <div class="chat-input-wrapper">
                            <textarea
                                id="chatInput"
                                class="chat-input"
                                placeholder="Ask me anything about your finances..."
                                rows="1"
                            ></textarea>
                            <button class="btn btn-primary" id="sendBtn" style="align-self: flex-end;">
                                Send →
                            </button>
                        </div>
                    </div>
                </div>
            `;

            Components.initializeLayout('ai-chat');
            this.setupEventListeners();
            this.renderMessages();
            this.renderPrompts();
        },

        setupEventListeners() {
            const sendBtn = document.getElementById('sendBtn');
            const chatInput = document.getElementById('chatInput');

            sendBtn.addEventListener('click', () => this.sendMessage());

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            chatInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            });
        },

        async sendMessage() {
            const chatInput = document.getElementById('chatInput');
            const sendBtn = document.getElementById('sendBtn');
            const text = chatInput.value.trim();

            if (!text) return;

            this.messages.push({ type: 'user', text });
            chatInput.value = '';
            chatInput.style.height = 'auto';
            sendBtn.disabled = true;

            this.renderMessages();
            this.renderPrompts();

            try {
                const result = await window.ApiClient.postChat({ message: text });
                this.messages.push({ type: 'ai', text: result.reply || 'No reply returned.' });
            } catch (error) {
                this.messages.push({
                    type: 'ai',
                    text: `I couldn't reach the backend API. ${error.message}`
                });
            } finally {
                sendBtn.disabled = false;
                this.renderMessages();
            }
        },

        renderMessages() {
            const messagesDiv = document.getElementById('chatMessages');
            messagesDiv.innerHTML = this.messages.map(msg => `
                <div class="chat-message ${msg.type}">
                    <div class="message-bubble">${this.escapeHtml(msg.text)}</div>
                </div>
            `).join('');

            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        },

        renderPrompts() {
            const promptsDiv = document.getElementById('suggestedPromptsDiv');

            if (this.messages.length <= 1) {
                promptsDiv.innerHTML = this.suggestedPrompts.map(prompt => `
                    <button class="prompt-btn">${this.escapeHtml(prompt)}</button>
                `).join('');

                promptsDiv.querySelectorAll('.prompt-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.getElementById('chatInput').value = btn.textContent;
                        this.sendMessage();
                    });
                });
            } else {
                promptsDiv.innerHTML = '';
            }
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AIChat.init());
    } else {
        AIChat.init();
    }

    window.AIChat = AIChat;
})();
