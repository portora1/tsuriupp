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
            if (uploadError) throw uploadError;
            
            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { isUploading, uploadImage };
};