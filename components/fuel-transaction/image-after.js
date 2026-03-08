'use client'
import Image from "next/image"
import camera from "@/public/camera.png"

export default function ImageAfter () {
    return(
    <div>
    <div className="form-header-steps">
        <p className="steps-text pr-2">Step 3 of 4</p>
      </div>
      <p className="mt-4 h-mid-gray-s">Take a Photo </p>
      
      <p className="steps-text">Of the meter after collecting fuel from the tank. Take a clear picture showing the full meter display</p>
      
      <button className="qr-code-scanning-button my-2">
        <Image className="w-26 brightness-100 " alt="icon of camera"
        src={camera}/><p className="pl-6">Open camera</p>
      </button>
      <p className="mt-4 h-mid-gray-s">Meter Reading</p>
      
      <p className="steps-text"Enter >After fuel collection</p>
      <input className="mb-4"></input>

    </div>
    )

}