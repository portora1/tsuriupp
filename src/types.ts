export interface FishingLog {
  id: number;
  created_at: string;
  fish_name: string;
  fish_size: number | null;
  fish_weight: number | null;
  location: string | null;
  fished_at: string;
  comment: string | null;
  image_url: string | null;
  profile_id: string;
}

export interface FishingLogFormData {
  fishName: string;
  location: string | null;
  fishSize: string;
  fishWeight: string;
  comment: string | null;
  imageFile: File | null;
}

export interface FishingLogWithProfile extends FishingLog {
  profiles: {
    username: string;
  } | null;
  fishing_log_reactions: ReactionRaw[];
}

export interface FishDexEntry {
  id: number;
  profile_id: string;
  fish_name: string;
  total_count: number;
  max_size: number | null;
  max_weight: number | null;
  created_at: string;
  top_angler: string | null;
  fish_dex_reactions?: ReactionRaw[];
}

export interface ReactionData {
  emoji: string;
  count: number;
  me: boolean;
}

export interface ReactionRaw {
  emoji_id: number;
  user_id: string;
}
