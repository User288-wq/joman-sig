// AIChatbot.jsx - Assistant IA pour analyses
const AIChatbot = ({ map, layers }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant SIG IA. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuery = async (query) => {
    setIsProcessing(true);
    
    // Analyser la requête avec NLP
    const analysis = analyzeSIGQuery(query);
    
    let response = '';
    
    if (analysis.intent === 'buffer') {
      // Créer un buffer
      response = `J'ai créé un buffer de ${analysis.distance}m autour de votre sélection.`;
    } else if (analysis.intent === 'statistics') {
      // Calculer des statistiques
      const stats = calculateLayerStats(layers[0]);
      response = `Statistiques : ${stats.count} entités, superficie ${stats.area} km²`;
    } else if (analysis.intent === 'export') {
      // Préparer l'export
      response = `Je prépare l'export ${analysis.format} de vos données.`;
    }
    
    setMessages(prev => [...prev, 
      { role: 'user', content: query },
      { role: 'assistant', content: response }
    ]);
    setIsProcessing(false);
  };

  const analyzeSIGQuery = (query) => {
    // Logique simple d'analyse NLP
    if (query.includes('buffer') || query.includes('tampon')) {
      const distance = query.match(/\d+/)?.[0] || 100;
      return { intent: 'buffer', distance };
    }
    // ... autres intents
  };

  return (
    <div className="ai-chatbot">
      <div className="chat-header">
        <h3>🤖 Assistant SIG IA</h3>
        <button className="btn-small">🔄 Nouvelle conversation</button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleQuery(input)}
          placeholder="Posez une question SIG..."
        />
        <button onClick={() => handleQuery(input)}>➤</button>
      </div>
      
      <div className="quick-actions">
        <button onClick={() => handleQuery('Créer un buffer de 100m')}>
          ⭕ Buffer 100m
        </button>
        <button onClick={() => handleQuery('Calculer les statistiques')}>
          📊 Statistiques
        </button>
        <button onClick={() => handleQuery('Exporter en GeoJSON')}>
          💾 Export GeoJSON
        </button>
      </div>
    </div>
  );
};