import React, {useEffect, useState} from 'react'; 
import './App.css';
import { upload } from '@testing-library/user-event/dist/upload';

function App() {

  //states: ------------------------------------------------------------------------------------------------------------------------------------------------

  // State variables to manage the selected file and API response
  const [selectedFile, setSelectedFile] = useState(null);     //selectedFile: This variable will hold the actual image file that the user selects from their computer.
                                                              //setSelectedFile: This is a special function we will use to update the value of selectedFile.
                                                              //useState(null): The null inside the parentheses is the initial value. It means that when the application first starts, no file has been selected yet.
  const [prediction, setPrediction] = useState(null);         //This variable will hold the data (the plant name, scores, etc.) that we get back from the Pl@ntNet API.   
  const [loading, setLoading] = useState(null);               //This is a boolean (true or false) variable that tells us if the application is currently waiting for the API's response.
  const [error, setError] = useState(null);                   // This variable will hold any error messages that occur, such as a problem with the API request.

  const [uploadSuccess, setUploadSuccess] = useState(false);      // NEW: State for upload success message
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);       // NEW: State for image preview URL: the imagePreviewUrl will hold the temporary URL that the <img> tag will use
  

  //states: ------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
      // console.log("inside the useEffect");  
      if(prediction){
        console.log("prediction had changed and it is prediction: ", prediction);
        console.log("prediction.bestMatch: ", prediction.bestMatch);
        console.log("prediction.results[0].species.scientificNameWithoutAuthor: ",prediction.results[0].species.scientificNameWithoutAuthor);
      }
      
    }, [prediction]);




  //NEW: Function to handle file selection (when the user clicks on the input and uploads the file,this function will handle that)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // This line gets the first file from the file input field.
    setSelectedFile(file);
    // These lines clear any previous results or errors when a new file is selected.
    setPrediction(null);
    setError(null);
    setUploadSuccess(true)
    console.log("file: ",file);

    if(file){
      // Create a temporary URL for the file and store it in state
      setImagePreviewUrl(URL.createObjectURL(file));        //this browser API takes a FILE or Blob object and creates a unique string that the browser can use to display the local file
  
    }else{
      //if there is no file
      setImagePreviewUrl(null);
    }
  };


  //when we click the 'Detect' button:
  const handleDetect = async () => {
    // Check if a file has been selected. If not, set an error and stop.
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true); // Set the loading state to true
    setError(null);   // Clear any old errors

    // Create a new FormData object to package the image file
    const formData = new FormData();
    formData.append('image', selectedFile); // The key 'image' must match what our PHP backend expects

    try {
      // Use the proxy to call our PHP backend .
      //-----------------we have not yet written the /api/identify-plant.php---------------
      const response = await fetch('/api/identify-plant.php', {
        method: 'POST',
        body: formData,
      });

      // If the response is not a success (status code 200), throw an error.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong with the detection.');
      }

      // console.log("response------------------------------------ : ", response);

      // Parse the JSON response from the PHP script.
      const data = await response.json();
      setPrediction(data); // Set the prediction state with the API results

      //console.log("prediction: ",prediction);       //THIS WILL NOT WORK!>>because state updates ARE ASYNCHRONOUS. That means that the setPrediction function does not immediately update the prediction state variable. Instead, it schedules a re-render of the component.
                                                      //ro fix this i use useEffect() ==> IMPORTANT: should be called OUTSIDE any javascript function!
        


    } catch (err) {
      // If an error occurs, set the error state
      console.error("Error during detection:", err);
      setError(err.message);
    } finally {
      // This block always runs, regardless of success or failure.
      setLoading(false); // Set the loading state to false
    }
  };






  return (
    <div className="App">

      <div className="header-bar">
        <img src="/logo.png" alt="Plant Detector Logo" className="logo" />  
        <h1>EcoLens</h1>        
      </div>
  
    
      {prediction ? (
        <div className="results-page">
          {/* <h2>Detection Results</h2> */}
          {/* We will add more here later to display the results */}
          {/* <pre>{JSON.stringify(prediction, null, 2)}</pre> */}

          {imagePreviewUrl ? (
            <div className='uploaded-image-container'>
              
              <div className="left-side-container">
                <img src={imagePreviewUrl} alt='uploaded plant' className='uploaded-image' />
                  
                {/* NOT provided by the PlantNet server ***********************************************************************/}
                <p>Medicinal Uses:<span className="p_content">(the_medicinal_uses_we_get_from_the_backend)</span> </p>
                {/* NOT provided by the PlantNet server ***********************************************************************/}
                <p>Edible:<span className="p_content">(the_edible_we_get_from_the_backend)</span></p> 

              </div>

              <div className="right-side-container">

                {/* provided by the PlantNet server: */}
                <p className="scientific_header">{prediction.bestMatch}</p>

                {/* provided by the PlantNet server */}
                <p>Common names: 
                  <span className="p_content">
                    {prediction.results[0].species.commonNames.map((name, index)=>
                      <span key={index}>
                        {name}
                        {index < prediction.results[0].species.commonNames.length - 1 ? ", " : " "}
                      </span>
                      )
                    
                    }
                  </span>
                </p>

                {/* NOT provided by the PlantNet server ************************************************************************/}
                <p>Description: <span className="p_content">(the_descriptions_we_get_from_the_backend)</span></p>

                {/* provided by the PlantNet server ************************************************************************/}
                <p>Family: <span className="p_content">{prediction.results[0].species.family.scientificName}</span></p>

                {/* provided by the PlantNet server ************************************************************************/}
                <p>Confidence Score: <span className="p_content">{prediction.results[0].score}</span></p>

                {/* NOT provided by the PlantNet server ************************************************************************/}
                <p>Distribution: <span className="p_content">(the_distribution_we_get_from_the_backend)</span></p>

                {/* NOT provided by the PlantNet server ************************************************************************/}     
                {/* <p>Ecology: <span className="p_content">(the_ecology_we_get_from_the_backend)</span></p> */}

                {/* NOT provided by the PlantNet server ************************************************************************/} 
                <p>Toxicity: <span className="p_content">(the_toxicity_we_get_from_the_backend)</span></p>

              </div>


            </div>
            ) : (
              <p>No image</p>


            )
          }


            </div>
          ) : (   
            <div className="main-content">
              <div className="upload-box">
                <p>Upload a photo of a plant to identify it</p>
              
                {/* the reason we place these two inside a label tag is to link their functionality. The style=display-none is cause we dont want the 'Choose a file' button to appear */}
                <label htmlFor="imageInput" className="upload-icon-label">
                  
                  <input type="file" id="imageInput" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                  <img src="/upload_icon.png" alt="Upload icon" className="upload-icon" />  

                </label>
        
                {/* In JSX we use parentheses after the %% opetator for multi-line expressions, like this:
                  {uploadSuccess && (
                    <p style={{ fontSize : '1em' }}>successfuly uploaded ✅</p>
                  )}         
                  Also if we want to use inline styling (to override the css file) we have to make it be a Javascript Object, which means we have to write font-size to fontSize and also use ''      */}

                {uploadSuccess && <p className="success-upload" style={{fontSize : '1em'}}>successfuly uploaded ✅</p>}


              </div>  

              <button className= "detect-button" onClick={handleDetect} disabled={loading || !selectedFile}>
                {loading ? 'Detecting...' : 'Detect'}
              </button>

              {/* If the error doesnt have a value inside (it is null) is stops right there
                  if the error has a value inside like the 'Error during detection:' we wrote earlier then the expression continues and the <p> style gets rendered */}
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        </div>

      )}
      
    </div>
  );
}

export default App;
