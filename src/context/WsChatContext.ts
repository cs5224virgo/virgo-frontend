import { createContext, useContext } from 'react';
import { WebSocketService } from '../services/WebSocketService';
  
export const WsChatContext = createContext<WebSocketService>(new WebSocketService());  

export const useWsChat = () => useContext(WsChatContext);
