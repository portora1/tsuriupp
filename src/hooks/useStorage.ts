import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { handleSupabaseError } from "../lib/errorHandlers";
import { useAuth } from "./useAuth";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";

export const useStorage = (bucketName: string) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      setIsUploading(true);
      let targetFile: File | Blob = file;

      // HEICに対応
      if (file.name.toLocaleLowerCase().endsWith(".heic") || file.type === "image/heic") {
        console.log("HEICを変換");
        const converted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.7
        })

        const blob = Array.isArray(converted) ? converted[0] : converted
        targetFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" })
      }


      // 圧縮設定
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: "image/jpeg"
      }
      // 圧縮処理
      console.log(`圧縮前:${file.size / 1024 / 1024}MB`);
      const compressedFile = await imageCompression(targetFile as File, options)
      console.log(`圧縮後：${file.size / 1024 / 1024} MB`);

      // アップロードのパス
      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      // supabaseへ圧縮してアップロード
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 公開URLを取得
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return urlData.publicUrl;

    } catch (error: unknown) {
      console.error("DEBUG: raw error object", error);
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
      // フォルダとファイル名を抽出
      const pathParts = filePath.split("/");
      const fileName = pathParts.pop();
      const userFolder = pathParts.pop();
      if (userFolder !== user.id) {
        throw new Error("Permission denied");
      }

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([`${userFolder}/${fileName}`]);
      if (error) throw error;
    } catch (err: unknown) {
      const message = handleSupabaseError(err)
      console.error("Error deleting image:", message);
    }
  };

  return { isUploading, uploadImage, deleteImage };
};
