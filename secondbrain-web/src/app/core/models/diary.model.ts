export type DiaryMood =
  | 'HAPPY'
  | 'SAD'
  | 'EXCITED'
  | 'CALM'
  | 'ANGRY'
  | 'ANXIOUS'
  | 'GRATEFUL'
  | 'NEUTRAL';


export interface DiaryEntry {

  id: string;

  title: string;

  content: string;

  mood: DiaryMood;

  entryDate: string;

  createdAt: string;

  updatedAt: string;

  userId: string;

}


export interface CreateDiaryDto {

  title: string;

  content: string;

  mood: DiaryMood;

  entryDate: string;

}


export interface UpdateDiaryDto {

  title?: string;

  content?: string;

  mood?: DiaryMood;

  entryDate?: string;

}