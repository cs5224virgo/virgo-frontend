import { createContext, useContext, Context, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { WebSocketService } from '../services/WebSocketService';
import { WebSocketSubject } from 'rxjs/webSocket';
  
export const WsChatContext = createContext<WebSocketService>(new WebSocketService);  

export const useWsChat = () => useContext(WsChatContext);
