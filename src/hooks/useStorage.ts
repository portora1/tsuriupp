import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { handleSupabaseError } from "../lib/errorHandlers";

export const useStorage = (bucketName: string) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      setIsUploading(true);
      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      return urlData.publicUrl;
    } catch (error: unknown) {
      const message = handleSupabaseError(error);
      console.error("Error uploading image:", message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (filePath: string) => {
    if (!user) return;
    try {
      const pathParts = filePath.split("/");
      const fileName = pathParts.pop();
      const userFolder = pathParts.pop();
      if (userFolder !== user.id) {
        throw new Error("You don't have permission to delete this file.");
      }
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([`${userFolder}/${fileName}`]);
      if (error) throw error;
    } catch (err:unknown) {
        const message = handleSupabaseError(err)
      console.error("Error deleting image:", message);
    }
  };

  return { isUploading, uploadImage, deleteImage };
};
