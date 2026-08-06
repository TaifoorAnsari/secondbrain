import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { DiaryService } from '../../core/services/diary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Diary } from '../../core/models/diary.model';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent {
  private diaryService = inject(DiaryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  moods = [
    { emoji: '😊', value: 'Happy' },
    { emoji: '😄', value: 'Excited' },
    { emoji: '🙂', value: 'Calm' },
    { emoji: '😐', value: 'Neutral' },
    { emoji: '😔', value: 'Sad' },
    { emoji: '😡', value: 'Angry' }
  ];

  diary = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'Happy',
    content: ''
  };

  selectedMood = signal('Happy');

  selectMood(mood: string) {
    this.selectedMood.set(mood);
    this.diary.mood = mood;
  }


  saveDiary() {

  if (
    !this.diary.title.trim() ||
    !this.diary.content.trim()
  ) {
    alert('Please fill in both title and diary content.');
    return;
  }

  if (this.isEditMode) {

    this.diaryService.updateDiary({
      id: this.currentDiaryId,
      title: this.diary.title,
      content: this.diary.content,
      mood: this.diary.mood,
      date: this.diary.date
    });

    alert("Diary updated successfully!");

  } else {

    this.diaryService.saveDiary({
      title: this.diary.title,
      content: this.diary.content,
      mood: this.diary.mood,
      date: this.diary.date
    });

    alert("Diary saved successfully!");
  }

  this.cancel();
  this.router.navigate(['/diary']);
}

cancel() {
  this.diary = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'Happy',
    content: ''
  };

  this.selectedMood.set('Happy');
}
isEditMode = false;
currentDiaryId = '';
ngOnInit() {

  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.isEditMode = true;
    this.currentDiaryId = id;

    const diary = this.diaryService.getDiaryById(id);

    if (diary) {
      this.diary = {
        title: diary.title,
        date: diary.date,
        mood: diary.mood,
        content: diary.content
      };

      this.selectedMood.set(diary.mood);
    }
  }

}
}