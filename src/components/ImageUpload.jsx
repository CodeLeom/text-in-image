import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Loading from "./Loading"

const fileTypes = ["JPEG", "PNG", "JPG"];

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [apiRes, setApiRes] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleChange = (file) => {
    setFile(file);
    convertToBase64(file);
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };
  };

  const handleAnalyzeImage = async () => {
    if (!base64Image) {
      alert("No image available");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/services/vision-ai/`, {
        method: "POST",
        headers: {
          "X-AUG-Key": API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: base64Image.split(',')[1], // Remove the data:image/*;base64, part
          operation: "text_detection"
        })
      });
      const data = await res.json();
      setApiRes(data);
    } catch (error) {
      console.error("Error making API call:", error);
    }
  };

  return (
    <div className="App">
        {loading && (
        <div className="loading-overlay">
          <Loading/>
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
      {base64Image && <button onClick={handleAnalyzeImage}>Analyze Image</button>}
      {apiRes && <div><strong>API Response:</strong> {JSON.stringify(apiRes)}</div>}
    </div>
  );
}