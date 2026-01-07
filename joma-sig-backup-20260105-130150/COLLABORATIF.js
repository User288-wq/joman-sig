// ====================
// MODE COLLABORATIF AVEC WEBSOCKETS
// ====================

import { io } from "socket.io-client";

const CollaborativeMode = () => {
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Initialiser la connexion WebSocket
  const initCollaboration = () => {
    const newSocket = io("https://your-sig-server.com", {
      transports: ["websocket"],
      reconnection: true
    });

    newSocket.on("connect", () => {
      console.log("✅ Connecté au serveur collaboratif");
      setSocket(newSocket);
      
      // Créer ou rejoindre une session
      const session = generateSessionId();
      newSocket.emit("join-session", {
        sessionId: session,
        user: {
          id: generateUserId(),
          name: "Utilisateur SIG",
          color: getRandomColor()
        },
        mapState: {
          center: center,
          zoom: zoom,
          layers: mapLayers.map(l => l.id)
        }
      });
      
      setSessionId(session);
    });

    // Écouter les événements
    newSocket.on("user-joined", (user) => {
      setCollaborators(prev => [...prev, user]);
      addChatMessage("system", `${user.name} a rejoint la session`);
    });

    newSocket.on("user-left", (userId) => {
      setCollaborators(prev => prev.filter(u => u.id !== userId));
      addChatMessage("system", "Un utilisateur a quitté");
    });

    newSocket.on("map-update", (update) => {
      // Mettre à jour la carte avec les changements d'autres utilisateurs
      handleRemoteMapUpdate(update);
    });

    newSocket.on("chat-message", (message) => {
      addChatMessage(message.user, message.text);
    });

    newSocket.on("feature-edit", (featureUpdate) => {
      // Mettre à jour une entité modifiée par un collaborateur
      updateRemoteFeature(featureUpdate);
    });

    return () => newSocket.disconnect();
  };

  // Générer un ID de session
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Partager le lien d'invitation
  const shareSessionLink = () => {
    const link = `${window.location.origin}/collab/${sessionId}`;
    navigator.clipboard.writeText(link);
    alert(`Lien copié: ${link}`);
  };

  // Envoyer une mise à jour de carte
  const broadcastMapUpdate = (updateType, data) => {
    if (!socket) return;
    
    socket.emit("map-update", {
      sessionId,
      type: updateType,
      data,
      timestamp: Date.now(),
      userId: getCurrentUserId()
    });
  };

  // Interface utilisateur du mode collaboratif
  const renderCollaborationPanel = () => (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "350px",
      maxHeight: "500px",
      background: "rgba(15, 23, 42, 0.95)",
      border: "2px solid #3b82f6",
      borderRadius: "12px",
      backdropFilter: "blur(10px)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        padding: "15px",
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        color: "white",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <strong>👥 Mode Collaboratif</strong>
          <div style={{ fontSize: "12px", opacity: 0.9 }}>
            Session: {sessionId} • {collaborators.length} participants
          </div>
        </div>
        <button
          onClick={shareSessionLink}
          style={{
            padding: "5px 10px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid white",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer"
          }}
        >
          📋 Inviter
        </button>
      </div>

      {/* Liste des collaborateurs */}
      <div style={{ padding: "15px" }}>
        <div style={{ fontSize: "14px", marginBottom: "10px", color: "#94a3b8" }}>
          Participants en ligne:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
          {collaborators.map(user => (
            <div key={user.id} style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 10px",
              background: "#1e293b",
              borderRadius: "20px",
              border: `2px solid ${user.color}`
            }}>
              <div style={{
                width: "10px",
                height: "10px",
                background: user.color,
                borderRadius: "50%",
                marginRight: "8px"
              }} />
              {user.name}
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{
          borderTop: "1px solid #334155",
          paddingTop: "15px"
        }}>
          <div style={{
            height: "200px",
            overflowY: "auto",
            marginBottom: "10px",
            padding: "10px",
            background: "#0f172a",
            borderRadius: "6px"
          }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: "8px",
                padding: "6px 10px",
                background: msg.type === "system" 
                  ? "rgba(59, 130, 246, 0.1)" 
                  : "rgba(30, 41, 59, 0.5)",
                borderRadius: "8px",
                fontSize: "13px"
              }}>
                <span style={{ 
                  color: msg.color || "#3b82f6",
                  fontWeight: "bold"
                }}>
                  {msg.user}:
                </span> {msg.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Message..."
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "6px",
                color: "white"
              }}
            />
            <button
              onClick={sendChatMessage}
              style={{
                padding: "8px 15px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};