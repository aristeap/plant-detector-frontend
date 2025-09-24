import React from "react";
import './ArticleModal.css';

function ArticleModal({isOpen, onClose, scientificName, imageUrl}){

    return(
        <div className="modal-overlay">

            <div className="all-articles-box">
                
                <img src='/close.png' alt='close icon' className='close-window-icon' onClick={onClose}/>
                <div className="articles-header">
                    <h1>Related Articles on 
                        <span> {scientificName}</span>
                    </h1>
                </div>


                <div className='articles-box'>
                    <img src={imageUrl} alt='uploaded plant' className='uploaded-image-articles' />
                    <div className="articles-title">
                        <p>The articles header</p>
                    </div>
                    <p>The first article</p>
                </div>

                <div className='articles-box'>
                    <img src={imageUrl} alt='uploaded plant' className='uploaded-image-articles' />
                    
                    <p>The second article</p>
                </div>  

                <div className='articles-box'>
                    <img src={imageUrl} alt='uploaded plant' className='uploaded-image-articles' />
                    
                    <p>The third article</p>
                </div>


                <button className="add-article-button">+Write Your Own Article </button>

            </div>


        </div>
    )


}
export default ArticleModal;