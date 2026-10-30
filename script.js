const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Pinta el mensaje del usuario
    appendMessage(text, 'user');
    userInput.value = '';

    // Pinta los tres puntos de "cargando" mientras Gemini responde
    const loadingId = appendMessage('...', 'bot');

    try {
        // Conexión del frontend apuntando a tu servidor en Render
        const response = await fetch('https://stylenova-backend.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // Reemplaza los tres puntos con la respuesta final de Gemini
        document.getElementById(loadingId).innerHTML = formatText(data.reply);
    } catch (error) {
        document.getElementById(loadingId).innerText = 'Error al conectar con el servidor.';
    }
}

// Función para imprimir el mensaje en la pantalla
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('bubble');
    bubbleDiv.innerHTML = text;
    
    // Genera un ID verdaderamente único con el remitente y un número aleatorio
    const uniqueId = 'msg-' + sender + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    bubbleDiv.id = uniqueId;
    
    msgDiv.appendChild(bubbleDiv);
    chatBox.appendChild(msgDiv);
    
    // Hace scroll automático hacia abajo
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return uniqueId;
}

// Función sencilla para procesar saltos de línea y negritas de Markdown
function formatText(text) {
    return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Activa los eventos de clic y de la tecla Enter
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});