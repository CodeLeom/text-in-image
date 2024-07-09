import TextInImage from "./components/TextInImage"


function App() {
 

  return (
    <>
     <div className="App">
      <p>This AI image generator, is built using <a href="https://autogon.ai/playground/text-in-image" target='_blank'>Autogon AI</a> text in image api (OCR)</p>
      <TextInImage />
     </div>
    </>
  )
}

export default App
