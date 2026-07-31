export interface DashboardStats {
  totalNotes: number;
  pinnedNotes: number;
  categories: number;
}

export interface RecentNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  pinned: boolean;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentNotes: RecentNote[];
}