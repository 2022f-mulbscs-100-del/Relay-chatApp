export interface  Group {
    id?: string;
    groupName: string;
    memberIds: (number | string)[];
    createdBy: string ;
    groupMessages:{ id?: string; senderId: string | number; content: string; createdAt: string | Date, isReadBy?: (string | number)[] }[];
    createdAt: string ;
    members?: {
        id?: number | string;
        userId: string | number;
        groupId: string | number;
        isPinned: boolean;
        categoroy?: string;
        isMuted: boolean;
    }[];
    
}         
