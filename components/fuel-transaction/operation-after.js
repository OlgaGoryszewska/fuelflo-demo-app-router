'use client'
import Image from "next/image"
import camera from "@/public/camera.png"

export default function OperationAfter () {
    return(
    <div>
    <div className="form-header-steps">
        <p className="steps-text pr-2">Step 4 of 5</p>
      </div>
      <h2 className="mt-4">Collect data after fuel delivery</h2>
      <p className="mt-4 h-mid-gray-s">Take a Photo </p>
      
      <p className="steps-text">Take a clear picture showing the full meter display</p>
      
      <button className="qr-code-scanning-button my-2">
        <Image className="w-26 brightness-100 " alt="icon of camera"
        src={camera}/><p className="pl-6">Open camera</p>
      </button>
      <p className="mt-4 h-mid-gray-s"> Type Meter Reading</p>
      
      
      <input className="mb-4"></input>

    </div>
    )

}