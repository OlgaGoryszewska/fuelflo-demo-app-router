'use client'
import { useState } from "react" 
import supabase from "@/lib/supabaseClient"  

export default async function wizardFuelTransaction(){
  


    const {data, error} = await supabase
    .from('fuel_delivery')
    .insert([
    
    ])

}