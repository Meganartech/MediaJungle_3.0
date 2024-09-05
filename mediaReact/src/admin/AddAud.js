// import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

// import screenfull from 'screenfull'; // For
import React, { useState, useEffect } from 'react';
import API_URL from '../Config';


// import screenfull from 'screenfull'; // For


const AddAud = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  useEffect(() => {
    // Fetch the image from the backend
  //   fetch(`${API_URL}/api/v2/getaudiothumbnailsbyid/8`)
  //     .then(response => response.json())
  //     .then(imageBlob => {
  //       const imageObjectURL = URL.createObjectURL(imageBlob.thumbnail);
  //       setImageSrc(imageObjectURL);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching image:', error);
  //     });
  // }, [API_URL, 8]);

  fetch(`${API_URL}/api/v2/getaudiothumbnailsbyid/8`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {

    const base64Thumbnail = data.thumbnail;
    console.log(base64Thumbnail)
    // setThumbnail(base64Thumbnail);
    if (base64Thumbnail) {
      setImageSrc(`data:image/jpeg;base64,${base64Thumbnail}`);
      // setImageSrc(imageObjectURL);
    } else {
      setImageSrc(null);
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}, [API_URL, 8]);


  const handleImageEdit = () => {
    // Simulate image editing by toggling the isEdited state
    setIsEdited(true);
  };

  const handleImageSubmit = () => {
    // Convert the edited or original image to a Blob
    fetch(imageSrc)
      .then(response => response.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');

        // Send the image back to the backend
        fetch(`${API_URL}/api/v2/image/upload`, {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            console.log('Image uploaded successfully:', data);
          })
          .catch(error => {
            console.error('Error uploading image:', error);
          });
      });
  };

  return (
    <div>
    {imageSrc ? (
      <div>
        <img src={imageSrc} alt="Fetched" style={{ maxWidth: '400px' }} />
        <button onClick={handleImageEdit}>Edit Image</button>
        <button onClick={handleImageSubmit}>Submit Image</button>
      </div>
    ) : (
      <p>Loading image...</p>
    )}
  </div>
);
}
export default AddAud;