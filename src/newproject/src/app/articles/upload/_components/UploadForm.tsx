"use client";

import React, { useState } from "react";
import { uploadFile } from "@/app/articles/upload/_commands/uploadFile";

type Props = {
	onSuccess?: () => void;
};

export const UploadForm: React.FC<Props> = ({ onSuccess }) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (formData: FormData) => {
		setIsLoading(true);
		setError(null);

		const result = await uploadFile(formData);

		if (result.error) {
			setError(result.error);
			setIsLoading(false);
			return;
		}

		setIsLoading(false);

		if (onSuccess) {
			onSuccess();
		}
	}

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
				<form action={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium">タイトル</label>
						<input
							type="text"
							name="title"
							className="w-full p-2 border rounded"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">スラグ</label>
						<input
							type="text"
							name="slug"
							className="w-full p-2 border rounded"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">説明</label>
						<textarea
							name="description"
							className="w-full p-2 border rounded"
							spellCheck={false}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium">公開範囲</label>
						<select
							name="visibility"
							className="w-full p-2 border rounded"
							defaultValue="PUBLIC"
							required
						>
							<option value="PUBLIC">公開</option>
							<option value="PRIVATE">非公開</option>
							<option value="DRAFT">下書き</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium">Markdownファイル</label>
						<input
							type="file"
							name="file"
							accept=".md"
							className="
								file:mr-4 file:rounded-full file:border-0 file:bg-blue-50
								file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100
								dark:file:bg-blue-600 dark:file:text-blue-100 dark:hover:file:bg-violet-500
							"
							required
						/>
					</div>
					{error && <p className="text-red-500">{error}</p>}
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
						disabled={isLoading}
					>
						{isLoading ? "アップロード中..." : "アップロード"}
					</button>
				</form>
            </div>
        </div>
    );
}