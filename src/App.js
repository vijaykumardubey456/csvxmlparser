import React, { useState } from "react";
import CSVDisplay from './components/CSV/CSVDisplay.js';
import XMLDisplay from './components/Xml/XMLDisplay.js';

function App() {

  const [file, setFile] = useState();
  const [fileExt, setfileExt] = useState();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
     const extension = e.target.files[0].name.split('.').pop();

    var fileInput = document.getElementById('csvFileInput');
      var filePath = fileInput.value;
   
      // Allowing file type
      var allowedExtensions = /(\.xml|\.csv)$/i;
      if (!allowedExtensions.exec(filePath)) {
          alert('Invalid file type');
          fileInput.value = '';
          return false;
      }
      setfileExt(allowedExtensions.exec(filePath)[0]);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv,.xml"}
          onChange={handleOnChange}
          style={{marginTop:20}}
        />
      </form>
      
      { file ? fileExt=='.csv' ? <CSVDisplay filedata={file}/> : <XMLDisplay filedata={file}/>: null}
    </div>
  );
}

export default App;


