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

export type FishingLogWithProfile = FishingLog & {
    profiles: {
        username: string;
    } | null;
};

export type FishDexEntry = {
  profile_id: string;
  fish_name: string;
  catch_count: number;
  max_size: number | null;
  max_weight: number | null;
  id: number;
  created_at: string;
};