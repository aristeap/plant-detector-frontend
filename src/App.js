import React, {useEffect, useState} from 'react'; 
import '../src/styling/App.css';
import '../src/styling/header.css';
import '../src/styling/upload-box.css';
import '../src/styling/button.css';
import '../src/styling/side-buttons.css';
import AuthModal from './components/AuthModal';
import ArticleModal from './components/ArticleModal';
import { upload } from '@testing-library/user-event/dist/upload';
import Confetti from 'react-confetti'; // Import the library

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
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // NEW: State for the dropdown menu
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const [isArticleOpen, setArticleOpen] = useState(false);

  // const [showConfetti, setShowConfetti] = useState(false);
  //const flowerImage = new Image();
  //flowerImage.src = "/flower.png";          //for the confetti function i am going to try and replace the confetti with flower icons, for that i would have to create the custom-drawFlowerConfetti
  
  //states: ------------------------------------------------------------------------------------------------------------------------------------------------

  // useEffect(() => {
  //     // console.log("inside the useEffect");  
  //     if(prediction){
  //       console.log("prediction had changed and it is prediction: ", prediction);
  //       console.log("prediction.plantNetData.bestMatch: ", prediction.plantNetData.bestMatch);
  //       console.log("prediction.plantNetData.results[0].species.scientificNameWithoutAuthor: ",prediction.plantNetData.results[0].species.scientificNameWithoutAuthor);
  //       handleConfetti();
  //     }
      
  //   }, [prediction]);  


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
    setError(null);   // Clear any old errors

    // =====================================================================
    // COMMENT OUT THE BELOW CODE TO AVOID API CALLS
    // =====================================================================

    //Create a new FormData object to package the image file
    const formData = new FormData();
    formData.append('image', selectedFile); // The key 'image' must match what our PHP backend expects

    try {
      // Use the proxy to call our PHP backend .
      
      //-----------------------------------------this will be for the deployment-----------------------------//
      const response = await fetch('https://plant-detector-backend.onrender.com/identify-plant.php', {
        method: 'POST',
        body: formData,
      })
      //-----------------------------------------this will be for the deployment-----------------------------//

      //-----------------------------------------this will be for the local version for developing-----------------//
      // const response = await fetch('/api/identify-plant.php', {
      //   method: 'POST',
      //   body: formData,
      // })
      //-----------------------------------------this will be for the local version-----------------------------//


      // If the response is not a success (status code 200), throw an error.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong with the detection.');
      }

      // Parse the JSON response from the PHP script.
      const data = await response.json();
      setPrediction(data); // Set the prediction state with the API results

    } catch (err) {
      // If an error occurs, set the error state
      console.error("Error during detection:", err);
      setError(err.message);
    } finally {
      // This block always runs, regardless of success or failure.
      setLoading(false); // Set the loading state to false
    }

    // =====================================================================
    // ADD THIS HARDCODED DATA FOR TESTING
    // =====================================================================
    // setPrediction(samplePrediction); 
    // setImagePreviewUrl(URL.createObjectURL(selectedFile)); 
    // setLoading(false);
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
    setIsDropdownOpen(prev => !prev);   //toggles the state from true to false and vice-versa
  }

  const openAuthModal = async() =>{
    setIsDropdownOpen(false);
    setIsAuthModalOpen(true);
  }

  const closeAuthModal = async() =>{
    setIsAuthModalOpen(false);
  }

  const openArticleModal = async() =>{
    setArticleOpen(true);
  };

  const closeArticleModal = async() =>{
    setArticleOpen(false);
  }

  // const handleConfetti =() =>{
  //   setShowConfetti(true);
  //   setTimeout( () => {
  //     setShowConfetti(false);
  //   }, 10000);         //the confetti will run for 5 seconds
  // }

  // // NEW: Custom drawShape function for confetti
  // const drawFlowerConfetti = (ctx) => {
  //   // Ensure the image is loaded before attempting to draw it
  //   if (flowerImage.complete){
  //     // ctx.drawImage(image, x, y, width, height) ->default
  //     // The x and y coordinates are usually centered for custom shapes,
  //     // so we use -width/2 and -height/2.
  //     const size = 20;
  //     ctx.drawImage(flowerImage, -size / 2, -size/2, size, size);

  //   }

  // }


  return (
    <div className="App">

      {/* {showConfetti && (
        <Confetti numberOfPieces={1500} gravity={0.1} recycle={false} drawShape={drawFlowerConfetti}/>
      )} */}

     {/* {showConfetti && (<div style={{ 
            // 💡 THIS IS THE MAIN FIX
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 9999, // Ensure it's on top of all other elements
        }}>
          <Confetti numberOfPieces={1500} gravity={0.1} recycle={false} drawShape={drawFlowerConfetti}/>
        </div> 
      )} */}

      <div className="header-bar">
        <div className="logo-section"> 
          <img src="/logo.png" alt="EcoLens Logo" className="logo"/>  
          <h1>EcoLens</h1>
        </div>

        <div className="search-container"> 
          <span className="search-icon-inside"><img src="/search-icon.png"/></span>
          <input type='text' placeholder='Search' className="header-search-input"/>
        </div>

        {/* <div className="profile-container">
          <img src="/user.png" alt="profile-icon" className="profile-icon" onClick={profileDropdown} /> 
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li><button className="dropdown-item">User's history</button></li>
                <li><button className="dropdown-item" onClick={openAuthModal}>Sign-up/Log-in</button></li>
              </ul>
            </div>
          )}   
        </div>   */}

        <div className="header-icons-group">
          <img src='/notification-bell.png'/>
          <img src='/user.png'/>
        </div>

      </div>
  
    
      {prediction ? (
        <div className="results-page">      
          {imagePreviewUrl ? (
            <>  
              <div className='uploaded-image-container'>                
                <div className="left-side-container">
                  <img src={imagePreviewUrl} alt='uploaded plant' className='uploaded-image' />
                  <button className="back-icon" onClick={backbutton}><span className="arrow">←</span>Back</button>
                  

                </div>

                <div className="right-side-container">

                  {prediction.plantNetData ? (
                    
                    <>
                      {/* provided by the PlantNet server: */}
                      <p className="scientific_header">{prediction.plantNetData.bestMatch}</p>

                      {/* provided by the PlantNet server */}
                      {/* the map is used to iterate arrays:  */}
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Common names: 
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
                    </>  
                    ) : (
                      <p style={{ fontStyle : 'italic'}}>No data from the PlantNet</p>

                      )
                  } 

                  {prediction.permapeopleData && (
                    <>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Edible:
                        <span className="p_content">
                          {prediction.permapeopleData["Edible"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Edible parts:
                        <span className="p_content">
                          {prediction.permapeopleData["Edible parts"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Edible uses:
                        <span className="p_content">
                          {prediction.permapeopleData["Edible uses"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Height:
                        <span className="p_content">
                          {prediction.permapeopleData["Height"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Growth:
                        <span className="p_content">
                          {prediction.permapeopleData["Growth"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Light requirement:
                        <span className="p_content">
                          {prediction.permapeopleData["Light requirement"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Water requirement: 
                        <span className="p_content">
                          {prediction.permapeopleData["Water requirement"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Soil type:
                        <span className="p_content">
                          {prediction.permapeopleData["Soil type"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Life cycle:
                        <span className="p_content">
                          {prediction.permapeopleData["Life cycle"] || "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Native to:
                        <span className="p_content">
                          {prediction.permapeopleData["Native to"] 
                            ? prediction.permapeopleData["Native to"].split(',').slice(0, 6).join(', ') + (prediction.permapeopleData["Native to"].split(',').length > 6 ? ', ...' : '')
                            : "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Introduced into:
                        <span className="p_content">
                          {prediction.permapeopleData["Introduced into"] 
                            ? prediction.permapeopleData["Introduced into"].split(',').slice(0, 6).join(', ') + (prediction.permapeopleData["Introduced into"].split(',').length > 6 ? ', ...' : '')
                            : "Unknown"}
                        </span>
                      </p>
                      <p><img src="/tick.png" alt="tick icon" className="tick-icon"/>Warning:
                        <span className="p_content">
                          {prediction.permapeopleData["Warning"] || "Unknown"}
                        </span>
                      </p>
                    </>
                  )}
                      

                </div>
              </div>     


              <div className="sidebar-container">   
                <h3 className="sidebar-title">Learn More</h3>
                {/* extra buttons that will use a relational database */}
                <div className='extra-buttons-container'> 
                  <button className="extra-button" onClick={openArticleModal}>
                    <span>📰</span> 
                    <span>Related Articles</span>
                    <span>›</span>
                  </button>
                  
                  <button className="extra-button">
                    <span>💬</span>
                    <span>User's Comments</span>
                    <span>›</span>
                  </button>

                  <button className="extra-button">
                    <span>🖼️</span>
                    <span>More Images</span>
                    <span>›</span>
                  </button>
                </div>    
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

      {isAuthModalOpen && (
        <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      )}

      {isArticleOpen &&(
        <ArticleModal isOpen={isArticleOpen} onClose={closeArticleModal} scientificName={prediction.plantNetData.bestMatch} imageUrl={imagePreviewUrl} />
      )}

    </div>
  );
}

export default App;
