import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Loading from "./Loading";

const fileTypes = ["JPEG", "PNG", "JPG"];

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [apiRes, setApiRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleChange = (file) => {
    setFile(file);
  };

  const handleAnalyzeImage = async () => {
    if (!file) {
      alert("No image available");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("operation", "document_text_detection");
    formData.append("image", file);

    try {
      const res = await fetch(`${BASE_URL}/services/vision-ai/`, {
        method: "POST",
        headers: {
          "X-AUG-Key": API_KEY,
        },
        body: formData,
      });
      const data = await res.json();
      setApiRes(data);
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTextAnnotations = () => {
    if (!apiRes || !apiRes.data || !apiRes.data.textAnnotations) return null;

    const firstAnnotation = apiRes.data.textAnnotations[0];
    return <p>{firstAnnotation.description}</p>;
  };

  return (
    <div className="App">
      {loading && (
        <div className="loading-overlay">
          <Loading />
        </div>
      )}
      <p>Drag your image into the box below or click the box to upload (Max size: 2mb)</p>
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        required={true}
      />
      <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
      {file && <button onClick={handleAnalyzeImage}>Analyze Image</button>}
      {apiRes && apiRes.data && apiRes.data.textAnnotations && (
        <div>
          <strong>Text Detected:</strong>
          {renderTextAnnotations()}
        </div>
      )}
    </div>
  );
}