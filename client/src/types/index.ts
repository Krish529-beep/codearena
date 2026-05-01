export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  leetcodeUsername: string;
  onboarded: boolean;
  stats: UserStats;
  streak: StreakData;
  groups: GroupSummary[];
  lastSyncedAt: string | null;
  submissionCalendar: string;
}

export interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  inviteCode?: string;
  admin: {
    _id: string;
    name: string;
    avatar: string;
  };
  challengeSettings: {
    startDate: string | null;
    endDate: string | null;
    target: number;
    isActive: boolean;
  };
  members: GroupMember[];
  memberCount?: number;
  maxMembers: number;
  createdAt: string;
}

export interface GroupSummary {
  _id: string;
  name: string;
  type: 'public' | 'private';
}

export interface GroupMember {
  user: {
    _id: string;
    name: string;
    avatar: string;
    leetcodeUsername: string;
    stats: UserStats;
    streak: StreakData;
  };
  joinedAt: string;
  initialSolvedCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  leetcodeUsername: string;
  totalSolved: number;
  solvedInGroup: number;
  progress: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
  currentStreak: number;
  joinedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}
