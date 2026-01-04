import { PostgrestError } from "@supabase/supabase-js";

export const handleSupabaseError = (error: unknown): string => {
  if (!error) return "";

  if (typeof error === "object" && "code" in error && "message" in error) {
    const pgError = error as PostgrestError;
    console.error(
      `[Supabase Error] Code: ${pgError.code},Message: ${pgError.message}`
    );
    return pgError.message;
  }

  if (error instanceof Error) {
    console.error(`[Error] ${error.message}`);
    return error.message;
  }

  console.error(`[Unknown Error]`, error);
  return "予期せぬエラーが発生しました。";
};
