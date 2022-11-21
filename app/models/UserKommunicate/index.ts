export interface UserKommunicate {
  userId: string;
  userName: string;
  connected?: boolean;
  lastSeenAtTime?: number;
  createdAtTime?: number;
  imageLink?: string;
  deactivated?: boolean;
  phoneNumber?: string;
  unreadCount?: string;
  lastLoggedInAtTime?: number;
  lastMessageAtTime?: number;
}
