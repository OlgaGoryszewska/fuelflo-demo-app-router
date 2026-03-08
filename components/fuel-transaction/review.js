'use client'

export default function Review () {
    return(
    <div>
    <div className="form-header-steps">
        <p className="steps-text pr-2">Step 4 of 4</p>
      </div>
      <h2 className="mt-4">Review evidence</h2>
      <p className="mt-4 h-mid-gray-s">Image before</p>
      <div className="window"></div>
      
      <p className="mt-4 h-mid-gray-s"> Meter Reading berore delivery</p>
      <input className="mb-4"></input>
      <p className="h-mid-gray-s">Image after</p>
      <div className="window"></div>
      <p className="mt-4 h-mid-gray-s"> Meter Reading after delivery</p>
      <input className="mb-4"></input>
    </div>
    )

}