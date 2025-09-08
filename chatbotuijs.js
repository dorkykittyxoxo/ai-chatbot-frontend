// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatlogs = document.getElementById('chatlogs');
    
    // Add welcome message when the chat loads
    setTimeout(() => {
        addMessage("Hi there! How can I help you today?", 'bot');
    }, 500);
    
    // Send message when clicking the send button
    sendButton.addEventListener('click', handleSendMessage);
    
    // Send message when pressing Enter in the input field
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Focus the input field when the page loads
    userInput.focus();
    
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            
            // Clear input and focus
            userInput.value = '';
            userInput.focus();
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                // Get AI response
                const response = await getAIResponse(message);
                
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add AI response with a slight delay for realism
                setTimeout(() => {
                    addMessage(response, 'bot');
                }, 300);
                
            } catch (error) {
                // Handle errors
                removeTypingIndicator();
                addMessage("Sorry, I'm having trouble connecting. Please try again later.", 'bot');
                console.error("Error getting AI response:", error);
            }
        }
    }
    
    function addMessage(messageText, sender) {
        // Create message container
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        
        // Add message text
        messageElement.textContent = messageText;
        
        // Add timestamp
        const timeElement = document.createElement('div');
        timeElement.classList.add('message-time');
        
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.appendChild(timeElement);
        
        // Add to chat
        chatlogs.appendChild(messageElement);
        
        // Smooth scroll to bottom
        smoothScrollToBottom();
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator', 'message', 'bot-message');
        typingIndicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }
        
        chatlogs.appendChild(typingIndicator);
        smoothScrollToBottom();
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function smoothScrollToBottom() {
        chatlogs.scrollTo({
            top: chatlogs.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    async function getAIResponse(message) {
        try {
            // URL encode the message to handle special characters
            const encodedMessage = encodeURIComponent(message);
            const response = await fetch(`http://localhost:5000/chat?message=${encodedMessage}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.response;
            
        } catch (error) {
            console.error("Error in API call:", error);
            throw error;
        }
    }
});