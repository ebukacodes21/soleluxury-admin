import React, { FC } from 'react'
import { cookies } from 'next/headers'
import { COOKIE_NAME, routes } from '@/constants'
import { redirect } from 'next/navigation'
import axios from 'axios'
import apiConfig from '@/services/apiconfig'
import SettingsForm from './components/settings-form'

type SettingProp = {
  params : { storeId: string }
}

const SettingPage: FC<SettingProp> = async ({ params }) => {
  const { storeId } = await params; 
  const cookieStore = cookies();
  const userToken = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!userToken){
    redirect(routes.SIGNIN);
  }

  let storeData = null;

  try {
    const res = await axios({
      method: "GET",
      url: apiConfig.getStore,
      params: { id: Number(storeId) },
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

  if(!storeData || storeData.error){
    redirect(routes.HOME)
  }

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={storeData.store}/>
      </div>
    </div>
  )
}

export default SettingPage
