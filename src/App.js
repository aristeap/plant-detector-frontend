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
        console.log("prediction.plantNetData.bestMatch: ", prediction.plantNetData.bestMatch);
        console.log("prediction.plantNetData.results[0].species.scientificNameWithoutAuthor: ",prediction.plantNetData.results[0].species.scientificNameWithoutAuthor);
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


  const backbutton = async() => {
    console.log("inside the backButton");
    // setImagePreviewUrl(null);
    setPrediction(null);
    setSelectedFile(null);
    setUploadSuccess(false);
    setLoading(null);
  }

  const profileDropdown = async() =>{
    console.log("the profile icon has been clicked");
  }



  return (
    <div className="App">

      <div className="header-bar">
        <img src="/logo.png" alt="Plant Detector Logo" className="logo" />  
        <h1>EcoLens</h1>

        <img src="/account.png" alt="profile-icon" className="profile-icon" onClick={profileDropdown} />        
      </div>
  
    
      {prediction ? (
        <div className="results-page">

          {imagePreviewUrl ? (
            <>  
              <img src="/left-arrow.png" alt="back icon" className="back-icon" onClick={backbutton}/> 
              <div className='uploaded-image-container'>
                
                <div className="left-side-container">
                  <img src={imagePreviewUrl} alt='uploaded plant' className='uploaded-image' />
                    

                  {/* NOT provided by the PlantNet server but from the Perenual API***********************************************/}   
                  {/* the reason we are using empty <></> => called React Fragment, is because in the condition we cant have multiple <p> elements  */}
                  {prediction.perenualData ? (
                    <>
                      <p>Sunlight :
                        <span className="p_content">
                          {prediction.perenualData.sunlight.map((name, index)=>
                            <span key={index}>
                              {name}
                              {index < prediction.perenualData.sunlight.length -1 ? ", " : " "}
                            </span>  
                        )}
                        </span>
                      </p>
                      {/* NOT provided by the PlantNet server but from the Perenual API***********************************************/}     
                      <p>Watering: <span className="p_content">{prediction.perenualData.watering || null}</span></p>
                      {/* NOT provided by the PlantNet server but from the Perenual API***********************************************/}     
                      <p>Edible Fruit: <span className="p_content">{prediction.perenualData.edible_fruit || null}</span></p>
                    </>  
                  ): (
                    <p style={{ fontStyle : 'italic'}}>The extra data from the Perenual API are not anymore available for today(free-usage-limit: 100 API calls/day), they will be again tomorrow!</p>
                  )}  
                    

                </div>

                <div className="right-side-container">

                  {/* provided by the PlantNet server: */}
                  <p className="scientific_header">{prediction.plantNetData.bestMatch}</p>

                  {/* provided by the PlantNet server */}
                  {/* the map is used to iterate arrays:  */}
                  <p>Common names: 
                    <span className="p_content">
                      {prediction.plantNetData.results[0].species.commonNames.map((name, index)=>
                        <span key={index}>
                          {name}
                          {index < prediction.plantNetData.results[0].species.commonNames.length - 1 ? ", " : " "}
                        </span>
                        )
                      
                      }
                    </span>
                  </p>


                  {/* provided by the PlantNet server ************************************************************************/}
                  <p>Confidence Score: <span className="p_content">{ (prediction.plantNetData.results[0].score) * 100 }%</span></p>
                  {/* provided by the PlantNet server ************************************************************************/}
                  <p>Genus: <span className="p_content">{prediction.plantNetData.results[0].species.genus.scientificNameWithoutAuthor}</span></p>



                  {prediction.perenualData ? (
                    <>
                      {/* NOT provided by the PlantNet server but from the Perenual API***************************************************/}
                      <p>Origin: <span className="p_content">{prediction.perenualData.origin || null}</span></p>
                      {/* NOT provided by the PlantNet server but from the Perenual API***************************************************/}
                      <p>Flowering Season: <span className="p_content">{prediction.perenualData.flowering_season || null}</span></p>
                      {/* NOT provided by the PlantNet server but from the Perenual API***************************************************/} 
                      <p>Hardiness: <span className="p_content">{prediction.perenualData.hardiness || null}</span></p>
                      {/* NOT provided by the PlantNet server but from the Perenual API***************************************************/} 
                      <p>Poisonous to humans: <span className="p_content">{prediction.perenualData.poisonous_to_humans || null}</span></p>
                      {/* NOT provided by the PlantNet server but from the Perenual API***************************************************/} 
                      <p>Maintenance: <span className="p_content">{prediction.perenualData.maintenance || null}</span></p>
                    </>
                  ) : (
                      <p style={{ fontStyle : 'italic'}}>The extra data from the Perenual API are not anymore available for today(free-usage-limit: 100 API calls/day), they will be again tomorrow!</p>

                  )}  
                    

                </div>
              </div>     

              <div className='extra-buttons-container'>      

                {/* extra buttons that will use a relational database */}
                <button className="extra-button">Related Articles</button>
                
                <button className="extra-button">User's Comments</button>

              </div>    


            </> 
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
