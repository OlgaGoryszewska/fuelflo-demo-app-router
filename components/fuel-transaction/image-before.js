'use client'
import Image from "next/image"
import camera from "@/public/camera.png"

export default function ImageBefore () {
    return(
    <div>
    <div className="form-header-steps">
        <p className="steps-text pr-2">Step 2 of 5</p>
      </div>
      <p className="mt-4 h-mid-gray-s">Take a Photo </p>
      
      <p className="steps-text">Of the meter before collecting fuel from the tank. Take a clear picture showing the full meter display</p>
      
      <button className="qr-code-scanning-button my-2">
        <Image className="w-24 " alt="icon of camera"
        src={camera}/><p className="pl-2">Open camera</p>
      </button>

    </div>
    )

}