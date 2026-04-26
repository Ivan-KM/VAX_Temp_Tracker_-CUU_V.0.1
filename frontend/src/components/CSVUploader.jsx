import { useState } from "react";
import { uploadCSV } from "../services/api";


const CSVUploader = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;  // <-- critical check

        const file = files[0];
        setUploading(true);
        setMessage(null);
        try {
            const res = await uploadCSV(file);
            setMessage({
                type: "success",
                text: `Uploaded: ${res.data.records_processed} records, ${res.data.alerts_detected} alerts`,
            });
            if (onUploadSuccess) onUploadSuccess();
            // Clear the input so the same file can be uploaded again
            e.target.value = null;
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.detail || "Upload failed",
            });
        } finally {
            setUploading(false);
        }

    };


    return (
        <div className="glass-card p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Import CSV Data</h3>
            <label className="block w-full">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                />
            </label>
            {uploading && <p className="text-sm mt-2">Uploading...</p>}
            {message && (
                <p
                    className={`text-sm mt-2 ${message.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {message.text}
                </p>
            )}
        </div>
    );
}


export default CSVUploader;