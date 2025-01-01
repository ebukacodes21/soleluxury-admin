"use client"
import React, { FC } from 'react'
import { useParams } from 'next/navigation';
import { useOrigin } from '@/hooks/useOrigin';
import { ApiAlert } from './api-alert';

type ApiListProps = {
    entityName: string;
    entityIdName: string;
}

const ApiList: FC<ApiListProps> = ({ entityIdName, entityName }) => {
    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/${params.storeId}`

  return (
    <>
      <ApiAlert title='GET' variant='admin' description={`${baseUrl}/${entityName}`} />
      <ApiAlert title='GET' variant='admin' description={`${baseUrl}/{${entityIdName}}`} />
      <ApiAlert title='POST' variant='admin' description={`${baseUrl}/${entityName}`} />
      <ApiAlert title='PATCH' variant='admin' description={`${baseUrl}/{${entityIdName}}`} />
      <ApiAlert title='DELETE' variant='admin' description={`${baseUrl}/{${entityIdName}}`} />
    </>
  )
}

export default ApiList
