export interface MessageProps {
   id?: number;
   senderId?: number;
   receiverId?: number;
   groupId?: string;
   content?: string;
   createdAt?: string | Date;
   ImageUrl?: string | null;
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

export interface AssociatedUser {
   id: number;
   associateUserId: number;
   userId: number;
   associatedUser: {
      id: number;
      username: string;
      email?: string;
      imageUrl?: string | null;
      title?: string;
      about?: string;
      location?: string;
      tags?: string[];
      lastSeen?: string | null | Date;
      sentMessages?: {
         id: number;
         senderId: number;
         receiverId: number;
         content: string;
         isRead: boolean;
         ImageUrl?: string | null;
         createdAt: string | Date;
      }[];
      receivedMessages?: {
         id: number;
         senderId: number;
         receiverId: number;
         content: string;
         isRead: boolean;
         ImageUrl?: string | null;
         createdAt: string | Date;
      }[]
   }
   category: string;
   isMuted: boolean;
   isPinned: boolean;
   isOnline?: boolean;
}