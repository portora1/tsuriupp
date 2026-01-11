import React, { useState } from "react";

type FishingLogFormProps = {
    onLogSubmit: (logData:
        {
            fishName: string;
            location: string;
            fishSize: string;
            fishWeight: string;
            comment: string;
            imageFile: File | null
        }) => void;
    isUploading: boolean;
};

export const FishingLogForm = ({ onLogSubmit, isUploading }: FishingLogFormProps) => {
    //投稿フォーム用
    const [fishName, setFishName] = useState('');
    const [fishSize, setFishSize] = useState('');
    const [location, setLocation] = useState('');
    const [comment, setComment] = useState('');
    const [fishWeight, setFishWeitht] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogSubmit({ fishName, location, fishSize, fishWeight, comment, imageFile });
        //フォームのリセット
        setFishName('')
        setFishSize('');
        setFishWeitht('');
        setLocation('');
        setComment('');
        setFishWeitht('');
        setImageFile(null);
    };

    {/*投稿フォーム*/ }
    return (
        <form onSubmit={handleSubmit} className="log-form">
            <h3>新しい釣果を記録</h3>
            <div className="form-row">
                <label htmlFor="fishName">魚の名前(必須)</label>
                <input
                    id="fishName"
                    type="text"
                    value={fishName}
                    onChange={e => setFishName(e.target.value)}
                    placeholder="例:マダイ"
                    required
                    title="カタカナで入力してください"
                />
            </div>


            <div className="form-row">
                <label htmlFor="location">場所(必須)</label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="例:糸島漁港"
                />
            </div>
            <div className="form-row">
                <label htmlFor="fishSize">サイズ(cm)</label>
                <input
                    id="fishSize"
                    type="number"
                    value={fishSize}
                    onChange={e => setFishSize(e.target.value)}
                    placeholder="40"
                />
            </div>
            <div className="form-row">
                <label htmlFor="fishWeight">重さ (g)</label>
                <input
                    id="fishWeight"
                    type="number"
                    value={fishWeight}
                    onChange={e => setFishWeitht(e.target.value)}
                    placeholder="300"
                />
            </div>
            <div className="form-row">
                <label htmlFor="comment">コメント：</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="例:自己ベスト更新！"></textarea>
            </div>
            <div className="form-row">
                <label htmlFor="image-upload">写真</label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                        }
                    }}
                />
            </div>
            <button type="submit" disabled={isUploading}>{isUploading ? '投稿中...' : '投稿する'}</button>
        </form>
    );
};

