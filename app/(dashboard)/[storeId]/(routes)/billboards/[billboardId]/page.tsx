import { COOKIE_NAME, routes } from '@/constants';
import apiConfig from '@/services/apiconfig';
import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'
import BillboardForm from '../components/billboard-form';

const page = async ({ params }: { params: { billboardId: string }}) => {
    const { billboardId } = await params; 

    const cookieStore = cookies();
    const userToken = (await cookieStore).get(COOKIE_NAME)?.value;
  
    if (!userToken) {
      redirect(routes.SIGNIN);
    }
  
    if (!billboardId || billboardId === typeof undefined) {
      console.error("Store ID is missing!");
      return null; 
    }
  
    let storeData = null;
    try {
        const res = await axios({
          method: "GET",
          url: apiConfig.getBillboard,
          params: { id: Number(billboardId) },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
    
        storeData = res.data;
      } catch (error: any) {
        if (error.code === "ECONNREFUSED") {
          storeData = { error: "Failed to connect to the server." };
        } else if (error.response) {
          storeData = { error: error.response.data };
        } else {
          storeData = { error: "Unknown error occurred." };
        }
      }
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm initialData={storeData}/>
      </div>
    </div>
  )
}

export default page
