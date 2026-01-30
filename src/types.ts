export type FishingLog = {
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
};

export type FishingLogUpdatePayload = Partial<
  Omit<FishingLog, "id" | "create_at" | "profile_id">
>;

export type FishingLogFormData = {
  fishName: string;
  location: string | null;
  fishSize: string;
  fishWeight: string;
  comment: string | null;
  imageFile: File | null;
};

export type FishingLogWithProfile = FishingLog & {
  profiles: {
    username: string;
  } | null;
};

export type FishDexEntry = {
  profile_id: string;
  fish_name: string;
  total_count: number;
  max_size: number | null;
  max_weight: number | null;
  id: number;
  created_at: string;
  top_angler: string | null;
};

export type ReactionData = {
  emoji: string;
  count: number;
  me: boolean;
};
