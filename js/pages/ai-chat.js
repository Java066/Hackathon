/**
 * AI Chat Page Handler
 */

(function() {
    const AIChat = {
        messages: [
            { type: 'ai', text: 'Hi! 👋 I\'m your AI financial assistant. I can help you with budgeting, spending analysis, and financial advice. What would you like to know?' }
        ],
        
        suggestedPrompts: [
            'How can I reduce my spending?',
            'What\'s my average monthly expense?',
            'Analyze my spending patterns',
            'Budget recommendations for me',
            'How much should I save monthly?',
            'Best financial tips for saving'
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
                    <div class="chat-messages" id="chatMessages">
                    </div>

                    <div class="suggested-prompts" id="suggestedPromptsDiv">
                    </div>

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

        sendMessage() {
            const chatInput = document.getElementById('chatInput');
            const text = chatInput.value.trim();

            if (!text) return;

            this.messages.push({ type: 'user', text });
            chatInput.value = '';
            chatInput.style.height = 'auto';

            this.renderMessages();
            this.renderPrompts();
            this.simulateAIResponse();
        },

        simulateAIResponse() {
            setTimeout(() => {
                const responses = {
                    'reduce': 'To reduce spending, track categories where you overspend. Set category budgets and review weekly. Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
                    'average': 'Based on your recent data, your average monthly expense is around 2,120 AED. This is 47% of your income, leaving room for savings.',
                    'analyze': 'Your top spending categories: Food (28%), Shopping (22%), Entertainment (18%). Consider optimizing Food and Shopping categories.',
                    'budget': 'I recommend: Food 600, Shopping 400, Entertainment 300, Utilities 300, Transport 200. This leaves 320 for other needs.',
                    'save': 'A healthy savings goal is 20% of income. With 4,500 AED income, aim to save 900 AED monthly.',
                    'tip': 'Top financial tips: (1) Automate savings, (2) Track expenses, (3) Build emergency fund, (4) Use the 50/30/20 rule, (5) Review budget monthly.'
                };

                let response = 'That\'s a great question! Based on your financial profile, here\'s what I recommend...';
                const lastMessage = this.messages[this.messages.length - 1].text.toLowerCase();

                for (const [keyword, answer] of Object.entries(responses)) {
                    if (lastMessage.includes(keyword)) {
                        response = answer;
                        break;
                    }
                }

                this.messages.push({ type: 'ai', text: response });
                this.renderMessages();
            }, 1000);
        },

        renderMessages() {
            const messagesDiv = document.getElementById('chatMessages');
            messagesDiv.innerHTML = this.messages.map(msg => `
                <div class="chat-message ${msg.type}">
                    <div class="message-bubble">${this.escapeHtml(msg.text)}</div>
                </div>
            `).join('');

            // Auto-scroll to bottom
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
