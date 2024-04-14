import { createContext, useContext, Context } from 'react';
import { WebSocketService } from '../services/WebSocketService';

export const WsChatContext: Context<WebSocketService> = createContext(new WebSocketService());

export const useWsChat = () => useContext(WsChatContext);
