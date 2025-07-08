import { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'

import { Button, Card, CardContent, CardHeader, CardTitle, Error, Input, LinkCard } from '../components'
import { Filter } from 'lucide-react'
import { UrlState } from '../context'
import { useFetch } from '../hooks'
import { getClicksForUrls, getUrls } from '../db'
import CreateLink from '../components/CreateLink'

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const {user} = UrlState()

    const { loading, error, data:urls, fn: fnUrls} = useFetch(getUrls, user?.id)
    const { loading: loadingClicks, data:clicks, fn: fnClicks} = useFetch(
        getClicksForUrls, 
        urls?.map((url)=>url.id)
    )

    useEffect(() => {
      fnUrls()
    }, [])

    useEffect(() => {
      if(urls?.length) fnClicks()
    }, [urls?.length])

    const filteredUrls = urls?.filter((url) => 
        url.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    return (
        <div className='flex flex-col m-auto w-full sm:w-5/6 gap-8'>
            {(loading || loadingClicks) && <BarLoader className='mb-4' width={"100%"} color='#00ffa4' />}
            <div className='grid grid-cols-2 gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-brand-green">Links created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{urls?.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-brand-green">Total clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{clicks?.length}</p>
                    </CardContent>
                </Card>
            </div>
            <div className='flex justify-between'>
                <h1>My Links</h1>
                <CreateLink />
            </div>
            <div className='relative'>
                <Input
                    type='text'
                    placeholder='Filter Links'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                 />
                 <Filter className='absolute top-2 right-2 p-1' />
            </div>
           {error && <Error message={error?.message} />}
           {(filteredUrls || []).map((url,i)=>{
            return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
           })}
        </div>
    )
}

export default Dashboard
