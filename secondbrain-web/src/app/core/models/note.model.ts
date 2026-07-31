export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  pinned?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  pinned?: boolean;
}