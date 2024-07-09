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

//   this function handles the file been added to state once upload is done
  const handleChange = (file) => {
    setFile(file);
  };

//   function to analyze the image upload
  const handleAnalyzeImage = async () => {
    if (!file) {
      alert("No image available");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    // the API can be used for other vision AI activity, so you need to define the operation
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

    // the response from the API is much, it firstly return all the text in the image
    // then, it return each word, so, I just grab the first item in the response array
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
     
      {/* this library handles the file upload operation */}
      <FileUploader
        multiple={false}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        required={true}
      />

    {/* conditional rendering to display buttons, and other texts */}
      <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
      {file && <button onClick={handleAnalyzeImage}>Analyze Image</button>}
      {apiRes && apiRes.data && apiRes.data.textAnnotations && (
        <div className="text-container">
          <strong>Text Detected:</strong>
          {renderTextAnnotations()}
        </div>
      )}
    </div>
  );
}