export interface MessageProps {
    id?: number;
    senderId?: number;
    receiverId?: number;
    content?: string;
    createdAt?: Date;
    isRead?: boolean;
}


export interface chatUser {
   id: number;
   username: string;
   email?: string;
   sentMessages?: {
      id: number;
      senderId: number;
      receiverId: number;
      content: string;
      createdAt: Date;
      isRead: boolean;
   }[];
   receivedMessages?: {
      id: number;
      senderId: number;
      receiverId: number;
      content: string;
      createdAt: Date;
      isRead: boolean;
   }[];
}