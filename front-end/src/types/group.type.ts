export interface  Group {
    id?: string;
    groupName: string;
    memberIds: string[];
    createdBy: string ;
    groupMessages:{ id?: string; senderId: string | number; content: string; createdAt: string | Date, isReadBy?: (string | number)[] }[];
    createdAt: string ;
    
}          