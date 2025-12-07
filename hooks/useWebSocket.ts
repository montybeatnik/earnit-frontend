import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@env';
import { decodeJwtPayload, getSession } from '../services/session';

export default function useWebSocket(): string | null {
    const socketRef = useRef<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const connect = async () => {
            const { token } = await getSession();
            if (!token) {
                console.warn("⚠️ No token found in SecureStore");
                return;
            }

            const decoded = decodeJwtPayload(token);
            console.log("🆔 Decoded user:", decoded);
            const wsUrl = `${API_BASE_URL.replace(/^http/, 'ws')}/ws?token=${token}`;
            console.log("🌐 Connecting to WebSocket:", wsUrl);

            // Send the token in the header (primary) while keeping the query for legacy/backward compatibility in dev
            const socket = new WebSocket(wsUrl, undefined, {
                headers: { Authorization: `Bearer ${token}` },
            });

            socket.onopen = () => {
                console.log('✅ WebSocket connected');
                socketRef.current = socket;
            };

            socket.onmessage = (event) => {
                console.log('📨 WebSocket message received:', event.data);
                if (isMounted) {
                    setLastMessage(event.data);
                }
            };

            socket.onerror = (e) => {
                console.error('❌ WebSocket error:', e.message);
            };

            socket.onclose = () => {
                console.log('🔌 WebSocket closed');
                socketRef.current = null;
            };
        };

        connect();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return lastMessage;
}
