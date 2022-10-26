import { TypedDocumentNode } from '@apollo/client';
import { useEffect, useState, useCallback } from "react";
import { apiQuery } from '../api';

export type UseApiQueryProps = {
  variables?: any,
  initialData?: any,
  pageSize?: number
}

export type Pagination = {
  no: number,
  count: number,
  size: number,
  end:boolean
}

const useApiQuery = <T>(document : TypedDocumentNode, {variables, initialData, pageSize} : UseApiQueryProps = {} ) => {
  
  const [data, setData] = useState<T>(initialData)
  const [page, setPage] = useState<Pagination | undefined>(pageSize ? {no:1, count:0, size:pageSize, end:false} : undefined)
  const [error, setError] = useState<Error | undefined>()
  const [loading, setLoading] = useState(false)

  const loadMore = (vars: any) => load(vars)

  const nextPage = async () => {
    if(!page) 
      return setError(new Error('No page size set!'))

    const first = page.size
    const skip = (page.no*page.size)
    const d = await load({...variables, first, skip})

    const count = d[Object.keys(d).find(k => !isNaN(d[k].count))]?.count || 0;
    const no = page.no+1
    const end = no*pageSize >= count
    const p = { ...page, no, count, end}
    
    setPage(p)
    return p;
  }

  const mergeData = (newData, oldData) => {
  
    if(!oldData) return newData
  
    Object.keys(newData).forEach(k => {
      if(oldData[k] && Array.isArray(oldData[k]))
        newData[k] = oldData[k].concat(newData[k])
    })
  
    return newData;
  }

  const load = useCallback((vars?: any) => {
    
    setLoading(true)
    return apiQuery(document, {variables : vars || variables})
    .then(res => {
      const d = mergeData(res, data)
      setData(d)
      return d
    })
    .catch(err => setError(err))
    .finally(()=> setLoading(false))

  }, [document, variables, data])

	useEffect(()=>{
    if(!initialData)
      load()
    else if(initialData.pagination?.count <= pageSize)
      setPage((page)=>({...page, end:true}))

  }, [initialData, load, setPage, pageSize])

  return {data, error, loading, loadMore, nextPage,  page}
};

export default useApiQuery