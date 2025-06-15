import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

function decodeToken(token: string | null): { user_id?: number; role?: string } | null {
    try {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (e) {
        console.warn("❌ Failed to decode token:", e);
        return null;
    }
}

export default function useWebSocket(): string | null {
    const socketRef = useRef<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const connect = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.warn("⚠️ No token found in AsyncStorage");
                return;
            }

            const decoded = decodeToken(token);
            console.log("🆔 Decoded user:", decoded);
            const wsUrl = `${API_BASE_URL.replace(/^http/, 'ws')}/ws?token=${token}`;
            console.log("🌐 Connecting to WebSocket:", wsUrl);

            const socket = new WebSocket(wsUrl);

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