export interface MessageProps {
    id?: number;
    senderId?: number;
    receiverId?: number;
    groupId?:  string;
    content?: string;
    createdAt?: string | Date;
    isRead?: boolean;
}


export interface chatUser {
   id: number;
   username: string;
   email?: string;
   profilePic?: string;
   title?: string;
   about?: string;
   location?: string;
   tags?: string[];
   isOnline?: boolean;
   lastSeen?: string | Date;
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