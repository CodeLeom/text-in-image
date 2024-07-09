import ImageUpload from "./components/ImageUpload"


function App() {
 

  return (
    <>
     <div className="App">
      <h1>Text In Image Detection</h1>
      <p>This Text in image Detection, is built using <a href="https://autogon.ai/playground/text-in-image" target='_blank'>Autogon AI</a> text in image api (OCR)</p>
      <ImageUpload />
     </div>
    </>
  )
}

export default App
