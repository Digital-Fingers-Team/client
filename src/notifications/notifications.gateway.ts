import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinConversation')
  handleJoinConversation(client: Socket, conversationId: string): void {
    client.join(`conversation_${conversationId}`);
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(client: Socket, conversationId: string): void {
    client.leave(`conversation_${conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(client: Socket, payload: { conversationId: string; message: any }): void {
    this.server.to(`conversation_${payload.conversationId}`).emit('newMessage', payload.message);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
