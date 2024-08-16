import React from 'react'
import { Link } from 'react-router-dom';

const AddVideo2 = () => {
  return (
    <div>
      <div className='container3 mt-20'>
  <ol className="breadcrumb mb-4 d-flex my-0">
    <li className="breadcrumb-item"><Link to="/admin/Video">Videos</Link></li>
    <li className="breadcrumb-item active text-white">Add Video</li>
  </ol>

  <div className="row py-3 my-3 align-items-center w-100">

      {/* First Picture Upload */}
      <div className="col-md-6">
        <div className="d-flex flex-column">
          <label className="custom-label">Picture 1</label>
          <div
            className="drag-drop-area border border-dark border-2 text-center mb-2"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '150px' /* Adjust height as needed */
            }}
          >
            <span>Drag and drop</span>
          </div>
          <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
          <input
            type="file"
            id="fileInput1"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="border border-dark border-2 mt-2 p-1 bg-silver"
            onClick={() => document.getElementById('fileInput1').click()}
          >
            Choose File
          </button>
        </div>
      </div>

      {/* Second Picture Upload */}
      <div className="col-md-6">
        <div className="d-flex flex-column">
          <label className="custom-label">Picture 2</label>
          <div
            className="drag-drop-area border border-dark border-2 text-center mb-2"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '150px' /* Adjust height as needed */
            }}
          >
            <span>Drag and drop</span>
          </div>
          <span style={{ whiteSpace: 'nowrap' }}>Please choose PNG format only*</span>
          <input
            type="file"
            id="fileInput2"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="border border-dark border-2 mt-2 p-1 bg-silver"
            onClick={() => document.getElementById('fileInput2').click()}
          >
            Choose File
          </button>
        </div>
      </div>

    </div>
      
    </div>
    </div>
  )
}

export default AddVideo2;
