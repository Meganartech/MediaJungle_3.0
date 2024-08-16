import React from 'react'
import { Link } from 'react-router-dom';

const AddVideo1 = () => {
  return (
    <div>
      <div className='container3 mt-20'>
  <ol className="breadcrumb mb-4 d-flex my-0">
    <li className="breadcrumb-item"><Link to="/admin/Video">Videos</Link></li>
    <li className="breadcrumb-item active text-white">Add Video</li>
  </ol>
  

  <div class="outer-container">
    <div className="table-container">
    <div className="row py-3 my-3 align-items-center w-100">
      <div className="col-md-3">
        <label className="custom-label">Category</label>
      </div>
      <div className="col-md-4">
      <select 
        name='age'
        id='age'
        required
        className="form-control border border-dark border-2"
      >
        <option value="">Select category</option>
        <option value="13+">13+</option>
        <option value="16+">16+</option>
        <option value="18+">18+</option>
      </select>
      </div>
    </div>


    <div className="row py-3 my-3 align-items-center w-100">
      <div className="col-md-3">
        <label className="custom-label">Tag</label>
      </div>
      <div className="col-md-4">
      <select 
        name='age'
        id='age'
        required
        className="form-control border border-dark border-2"
      >
        <option value="">Category</option>
        <option value="13+">13+</option>
        <option value="16+">16+</option>
        <option value="18+">18+</option>
      </select>
      </div>
    </div>

    <div className="row py-3 my-3 align-items-center w-100">
      <div className="col-md-3">
        <label className="custom-label">Production Company</label>
      </div>
      <div className="col-md-4">
        <input 
          type='text'
          name='category_name'
          id='name'
          required
        //   value={categoryName}
        //   onChange={(e) => setCategoryName(e.target.value)}
          className="form-control border border-dark border-2" 
          placeholder="Production Company" 
        />
      </div>
    </div>

    <div className="row py-3 my-3 align-items-center w-100">
      <div className="col-md-3">
        <label className="custom-label">Description</label>
      </div>
      <div className="col-md-4">
        <input 
          type='text'
          name='category_name'
          id='name'
          required
        //   value={categoryName}
        //   onChange={(e) => setCategoryName(e.target.value)}
          className="form-control border border-dark border-2" 
          placeholder="Description" 
        />
      </div>
    </div>

    <div className="row py-1 my-1 w-100">
              <div className="col-md-8 ms-auto text-end">
                <Link to="/admin/AddVideo">
                <button
                  className="border border-dark border-2 p-1.5 w-20 mr-5 text-black me-2 rounded-lg"
                  type="button"
                >
                  Back
                </button>
                </Link>
                <Link to="/admin/AddVideo2">
                <button
                  className="border border-dark border-2 p-1.5 w-20 text-white rounded-lg"
                  type="submit"
                  style={{ backgroundColor: 'blue' }}
                >
                  Next
                </button>
                </Link>
              </div>
            </div>


    </div>
    </div>
    </div>
    </div>
    
  )
}

export default AddVideo1
