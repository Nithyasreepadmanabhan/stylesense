export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'rejected';
export type ReportTargetType = 'user' | 'designer' | 'outfit' | 'product' | 'design';

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  adminResponse?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface PlatformAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalDesigners: number;
  pendingDesignerApprovals: number;
  totalDesigns: number;
  pendingDesignApprovals: number;
  totalCollections: number;
  totalProducts: number;
  totalOutfits: number;
  totalReports: number;
  userGrowth: Array<{ date: string; users: number; designers: number }>;
  categoryPopularity: Array<{ category: string; count: number; percentage: number }>;
  stylePopularity: Array<{ style: string; count: number }>;
}
