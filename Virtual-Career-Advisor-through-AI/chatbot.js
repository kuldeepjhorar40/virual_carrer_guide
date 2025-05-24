document.addEventListener('DOMContentLoaded', () => {
    // Chat elements
    const chatbot = document.getElementById('chatbot');
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatLauncher = document.getElementById('chat-launcher');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const openChatBtn = document.getElementById('open-chat-btn');
    const aboutChatBtn = document.getElementById('about-chat-btn');
    
    // Speech to text elements - we'll create and add these to the DOM
    const micButton = document.createElement('button');
    micButton.id = 'mic-button';
    micButton.innerHTML = '<i class="fas fa-microphone"></i>'; // Assuming Font Awesome is available
    micButton.title = 'Click to speak';
    micButton.classList.add('bg-blue-500', 'hover:bg-blue-600', 'text-white', 'rounded-full', 'p-2', 'ml-2', 'focus:outline-none');
    
    // Speech recognition status indicator
    const speechStatus = document.createElement('div');
    speechStatus.id = 'speech-status';
    speechStatus.classList.add('hidden', 'text-sm', 'italic', 'mt-1', 'text-center');
    speechStatus.textContent = 'Listening...';
    
    // Add microphone button next to the send button
    if (sendMessageBtn && sendMessageBtn.parentNode) {
        sendMessageBtn.parentNode.insertBefore(micButton, sendMessageBtn.nextSibling);
        // Add status indicator below the input area
        const inputContainer = userMessageInput.parentNode;
        inputContainer.parentNode.insertBefore(speechStatus, inputContainer.nextSibling);
    }
    
    // Chat state
    let chatHistory = [];
    let isListening = false;
    let recognition = null;
    
    // Initialize speech recognition
    function initSpeechRecognition() {
        // Check if browser supports speech recognition
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            
            // Set recognition properties
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'en-US'; // Set language
            
            // Handle results
            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                
                userMessageInput.value = transcript;
                
                // If final result
                if (event.results[0].isFinal) {
                    stopListening();
                }
            };
            
            // Handle errors
            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                stopListening();
            };
            
            // When recognition ends
            recognition.onend = () => {
                stopListening();
            };
            
            return true;
        } else {
            console.error('Speech recognition not supported in this browser');
            micButton.classList.add('hidden');
            return false;
        }
    }
    
    // Start listening
    function startListening() {
        if (!recognition) {
            if (!initSpeechRecognition()) return;
        }
        
        try {
            recognition.start();
            isListening = true;
            micButton.classList.add('bg-red-500');
            micButton.classList.remove('bg-blue-500');
            micButton.title = 'Click to stop listening';
            speechStatus.classList.remove('hidden');
        } catch (error) {
            console.error('Error starting speech recognition:', error);
        }
    }
    
    // Stop listening
    function stopListening() {
        if (recognition && isListening) {
            recognition.stop();
            isListening = false;
            micButton.classList.remove('bg-red-500');
            micButton.classList.add('bg-blue-500');
            micButton.title = 'Click to speak';
            speechStatus.classList.add('hidden');
        }
    }
    
    // Toggle listening state
    function toggleListening() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }
    
    // Add event listener to microphone button
    micButton.addEventListener('click', toggleListening);
    
    // Groq API Key
    const GROQ_API_KEY = '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';
    
    // Chat visibility handlers
    if (chatLauncher) {
        chatLauncher.addEventListener('click', () => {
            chatbot.classList.remove('hidden');
            chatLauncher.classList.add('hidden');
        });
    }
    
    if (openChatBtn) {
        openChatBtn.addEventListener('click', () => {
            chatbot.classList.remove('hidden');
            chatLauncher.classList.add('hidden');
        });
    }
    
    if (aboutChatBtn) {
        aboutChatBtn.addEventListener('click', () => {
            chatbot.classList.remove('hidden');
            chatLauncher.classList.add('hidden');
            userMessageInput.value = "Tell me more about CareerCompass";
            sendMessage();
        });
    }
    
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatbot.classList.add('hidden');
            chatLauncher.classList.remove('hidden');
            // Stop listening if active when chat is closed
            if (isListening) {
                stopListening();
            }
        });
    }
    
    // Initialize chat
    function initChat() {
        // Add welcome message
        addBotMessage(`Hello! I'm your AI Career Advisor. I can help you explore career paths, provide industry insights, or answer questions about your professional development. What would you like to discuss today?`);
        
        // Initialize speech recognition
        initSpeechRecognition();
    }
    
    // Check if chat is initialized
    if (chatMessages.children.length === 0) {
        initChat();
    }
    
    // Add event listeners
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Send message function
    function sendMessage() {
        const message = userMessageInput.value.trim();
        
        if (message === '') return;
        
        // Stop listening if active
        if (isListening) {
            stopListening();
        }
        
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        userMessageInput.value = '';
        
        // Add to chat history
        chatHistory.push({
            role: 'user',
            content: message
        });
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send to Groq API and get response
        sendToGroqAPI(message)
            .then(response => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add bot response
                addBotMessage(response);
                
                // Add to chat history
                chatHistory.push({
                    role: 'assistant',
                    content: response
                });
            })
            .catch(error => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add error message
                addBotMessage("I'm sorry, I'm having trouble connecting. Please try again in a moment.");
                console.error('Error:', error);
            });
    }
    
    // Add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('user-message', 'message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('bot-message', 'message');
        
        // Process markdown-like formatting for basic styling
        let formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        messageElement.innerHTML = formattedMessage;
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('bot-message', 'message', 'typing-indicator');
        typingIndicator.innerHTML = `
            <div class="flex space-x-2">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
        
        // Add CSS for dots
        const style = document.createElement('style');
        style.textContent = `
            .typing-indicator .dot {
                width: 8px;
                height: 8px;
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                animation: pulse 1.5s infinite ease-in-out;
            }
            .typing-indicator .dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-indicator .dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.3); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
        
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to send message to Groq Cloud API
    async function sendToGroqAPI(message) {
        try {
            const apiURL = 'https://api.groq.com/openai/v1/chat/completions';
            
            const headers = {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            };
            
            // Prepare the full conversation history for context
            const messages = [
                {
                    role: 'system',
                    content: `You are an AI Career Advisor named CareerCompass. You help users explore career paths, provide industry insights, and answer questions about professional development. 
                    Be friendly, supportive, and provide specific, actionable advice. Use markdown formatting (bold with ** and italics with *) for emphasis. 
                    Focus your advice on modern career trends, skills development, and practical steps for career advancement.
                    When appropriate, organize your responses with bullet points for better readability.
                    Limit your responses to 3-4 paragraphs maximum to maintain chat usability.`
                },
                ...chatHistory
            ];
            
            const requestBody = {
                model: 'llama3-70b-8192',  // Groq's LLaMA 3 70B model
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024
            };
            
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('Error calling Groq API:', error);
            throw error;
        }
    }
    
    // Connect the chat with results button if it exists
    const chatAboutResultsBtn = document.getElementById('chat-about-results-btn');
    if (chatAboutResultsBtn) {
        chatAboutResultsBtn.addEventListener('click', () => {
            // Show the chat
            chatbot.classList.remove('hidden');
            chatLauncher.classList.add('hidden');
            
            // Get the results content
            const resultsContent = document.getElementById('results-content');
            const careerMatches = document.getElementById('career-matches');
            
            if (resultsContent && careerMatches) {
                // Create a message about the results
                userMessageInput.value = "I'd like to discuss my career assessment results";
                sendMessage();
            }
        });
    }
});