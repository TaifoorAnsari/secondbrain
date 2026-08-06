export interface Entity {
  id: string;

  name: string;

  type: 'PERSON' | 'COMPANY';

  description: string | null;

  avatar: string | null;

  userId: string;

  createdAt: string;

  updatedAt: string;
}

export interface EntityStats {
  people: number;

  companies: number;

  total: number;
}

export interface CreateEntityDto {
  name: string;
  type: 'PERSON' | 'COMPANY';
  description: string;
}

export interface UpdateEntityDto {
  name?: string;
  type?: 'PERSON' | 'COMPANY';
  description?: string;
}