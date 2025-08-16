import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export const useStorage = (bucketName: string) => {
    const { user } = useAuth();
    const[isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File): Promise<string | null> => {
        if(!user) return null;

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
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const deleteImage = async (filePath: string) => {
        if (!user) return;
        try {
            const pathParts = filePath.split('/');
            const fileName = pathParts.pop();
            const userFolder = pathParts.pop();
            if (userFolder !== user.id) {
                throw new Error("You don't have permission to delete this file.");
            }
            const { error } = await supabase.storage
                .from(bucketName)
                .remove([`${userFolder}/${fileName}`]);
                if (error) throw error;
        } catch (err) {
            console.error('Error deleting image:', err);
        }
    };

    return { isUploading, uploadImage, deleteImage };
};