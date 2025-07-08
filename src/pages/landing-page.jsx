import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger, 
  Button, 
  Input
} from "../components/ui"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
  const [longURL, setLongURL] = useState()
  const navigate = useNavigate()

  const handleShorten = (e) => {
    e.preventDefault()
    if(longURL) navigate(`/auth?createNew=${longURL}`)
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='my-6 sm:my-12'>
        <h2 className='my-2 sm:my-5 text-2xl sm:text-4xl lg:text-5xl text-white text-center font-extrabold'>
          Got a link that’s too long? <br /> Let’s fix
        </h2>
        <p className='my-2 sm:my-5 text-1xl text-center'>Shortr is a easy-to-use URL shortener tool to make your links clean, short, and easy to share.</p>
      </div>
      <form onSubmit={handleShorten} className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2'>
        <Input
          type='url'
          value={longURL}
          placeholder='Paste your long URL here...'
          className='h-full flex-1 py-4 px-4'
          onChange={(e) => setLongURL(e.target.value)}
        />
        
        <Button className='h-full bg-brand-green' type='submit' >Shorten!</Button>
      </form>

      <Accordion type="multiple" collapsible='true' className='w-full md:px-11 my-6 sm:my-12'>
        <AccordionItem value="item-1">
          <AccordionTrigger>How does Shortr URL shortener work?</AccordionTrigger>
          <AccordionContent>
          Our tool takes your long, unwieldy URLs and turns them into short, shareable links. Simply paste your original link into the input box, and we’ll generate a unique, shortened version. When someone clicks your short link, they’ll be redirected to the original URL instantly — <span className='font-bold'>no delay, no fuss.</span>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Do I need an account to use the app?</AccordionTrigger>
          <AccordionContent>
            Yes. Creating a free account unlocks extra features like managing your links, customizing your short URLs, accessing click analytics, and setting expiration dates for your links.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Why Shortr a one-stop solution for all my link-sharing needs?</AccordionTrigger>
          <AccordionContent>
          Whether you're an individual, marketer, or business, our tool covers everything you need: link shortening, QR code generation, performance tracking, branded URLs, and more.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item4">
          <AccordionTrigger>How does adding analytics benefit me?</AccordionTrigger>
          <AccordionContent>
          With built-in analytics, you can see how your links perform in real time. Track clicks, user locations, and referrers to understand your audience better. This insight helps you refine campaigns, boost engagement, and make smarter decisions — all from one dashboard.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default LandingPage
