import { Injectable } from '@angular/core';
import { Diary } from '../models/diary.model';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  private STORAGE_KEY = 'diary_entries';

  constructor() {}

  getAllDiaries(): Diary[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveDiary(entry: Diary): void {
    const diaries = this.getAllDiaries();

    entry.id = crypto.randomUUID();
    entry.createdAt = new Date().toISOString();
    entry.updatedAt = new Date().toISOString();

    diaries.unshift(entry);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(diaries)
    );
  }

  getDiaryById(id: string): Diary | undefined {
    return this.getAllDiaries().find(d => d.id === id);
  }

  updateDiary(updatedDiary: Diary): void {
    const diaries = this.getAllDiaries();

    const index = diaries.findIndex(
      d => d.id === updatedDiary.id
    );

    if (index !== -1) {
      updatedDiary.updatedAt = new Date().toISOString();
      diaries[index] = updatedDiary;

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(diaries)
      );
    }
  }

  deleteDiary(id: string): void {
    const diaries = this
      .getAllDiaries()
      .filter(d => d.id !== id);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(diaries)
    );
  }
}