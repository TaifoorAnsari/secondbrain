export interface Timeline {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  entities: TimelineEntity[];
}

export interface TimelineEntity {
  timelineId: string;
  entityId: string;
  entity: Entity;
}

export interface Entity {
  id: string;
  name: string;
  type: 'PERSON' | 'COMPANY';
  description?: string;
  avatar?: string | null;
}

export interface CreateTimelineDto {
  title: string;
  description: string;
  eventDate: string;
  entityIds: string[];
}

export interface UpdateTimelineDto extends CreateTimelineDto {}