import React from 'react'
import Usersidebar from './usersidebar'
import Footer from './Footer'

function Subscription_details() {
  return (
    <div class="work_user">
        <div class="row">
        < Usersidebar/>
        <div className='body-m-user'>
<section class="work_user">
<div className='Wording_user text-center'>
Plan Deatils
</div>
<div className='row subscription'>
<div className='col-4 plan_card-1_user'>
    <form>
        <h2 className='cart-heading_user'>Free</h2>
        <i class="fa-solid fa-check" alter="non" style={{color: "#f3f4f7",}}></i>
            <span className='card_text_user'> Videos,Audios</span><br></br>
            <i class="fa-solid fa-check" alter="non" style={{color: "#f3f4f7",}}></i>
            <span className='card_text_user'> Muliple Users</span><br></br>
            <i class="fa-solid fa-x" alter="non" style={{color: "#f3f4f7",}}></i>
            <span className='card_text_user'> Add Free Videos</span><br></br>
            <i class="fa-solid fa-x" alter="non" style={{color: "#f3f4f7",}}></i>
            <span className='card_text_user'> HD Videos</span><br></br>
            <br></br>
            <br></br>
            <br></br>
            <button type="button" class="btn btn-primary btn-lg_user ">Subscribe</button>
            
    </form>
</div>
<div className=' col-4 plan_card_user'>
<form>
        <h2 className='cart-heading_user'>Paid</h2>
        <i class="fa-solid fa-check" alter="non"></i>
            <span className='card_text_user'> Videos,Audios</span><br></br>
            <i class="fa-solid fa-check" alter="non"></i>
            <span className='card_text_user'> Muliple Users</span><br></br>
            <i class="fa-solid fa-check" alter="non"></i>
            <span className='card_text_user'> Add Free Videos</span><br></br>
            <i class="fa-solid fa-check" alter="non"></i>
            <span className='card_text_user'> HD Videos</span><br></br>
            <span className='card_price_user'> &#8377;800/Year</span><br></br>
            <span className='card_price_user'> &#8377;150/Month</span><br></br>
            <button type="button" class="btn btn-primary btn-lg_user ">Subscribe</button>
    </form>
</div>
</div>
</section>
        < Footer/>
        </div>
        



</div>
    </div>
  )
}

export default Subscription_details