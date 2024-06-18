"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import Link from 'next/link'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useState,useEffect,useRef } from 'react';
import { useAccount} from 'wagmi'
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { homeSchoolerABI, homeSchoolerAddress } from '@/contracts/contracts';
import { useEthersSigner } from '@/signer/signer'

export default function Tutorials() {
  const account = useAccount()
  const router = useRouter()
  const signer = useEthersSigner()


  const [tutorials,setTutorials] = useState([])
 
// NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
setShow(false);
};



useEffect(()=>{

  async function getTutorials(){
   const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer);
   const _tutorials = await contract.getMytutorials()
   let tutorialArray=[]
  for(const index in _tutorials )
    {

      tutorialArray.push({id:_tutorials[index].id,
        system:(_tutorials[index].schoolSystem == "UK" ? "British / Commonwealth":"American / Canadian"),
      year:_tutorials[index].schoolYear,subject:_tutorials[index].subject,
    image:(_tutorials[index].schoolSystem == "UK" ? "/images/british.png":"/images/usacan.webp")})

    } 
   setTutorials(tutorialArray)
  }

  if(account?.address && signer)
    getTutorials()
 
 },[account.address,signer])



  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>Home Schooler - AI Tutor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-blue-medium"
       
     >
         <Header/>

     <section
      id="home"
      className= "  opacity-90 relative  overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
          
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
        <video className=" -z-10 absolute top-0 left-0 w-full h-full object-cover bg-top bg-no-repeat " autoPlay loop muted>
    <source src="/videos/school.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <Link
                  href="/createtutorial"
                  className="sm:ml-8 mt-1 mr-5 mb-5 lg:ml-80 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                >
                  Create Tutorial
                </Link>
  <div className="container  ">
  <div className="-mx-4 flex flex-wrap items-center min-h-[450px] ">
        
                
                <div className="mb-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {tutorials.map((tutorial) => (
                  <div key={tutorial.id} className=' bg-bg-color p-4 rounded-lg border border-dashed border-[#A1A0AE]'>
                  <button  onClick={()=>router.push(`/viewtutorial/${tutorial.id}`)} className="cursor-pointer group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                      <img
                        src="/images/hs2.jpg"
                        alt={tutorial.subject}
                        className="h-[300px]  w-full object-fit object-center group-hover:opacity-75"
                      />
                    </div>
                    </button>

                    <div className="flex items-center mt-4 ">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img crossOrigin  className="cursor-pointer  h-8 w-8 rounded-full " 
                        src={tutorial.image} alt="" />
                      </div>
                      <div className="mt-2 mr-2">
                      <div  className="mb-4 cursor-pointer text-sm font-medium text-white">{tutorial.system}</div>

                         </div>
                    </div> 
                 
                   
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-white">
                      <h3>Year</h3>
                      <p>{tutorial.year}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-white">
                      <h3>Subject</h3>
                      <p>{tutorial.subject}</p>
                    </div>
                    
                  
                  </div>
                ))}
               </div>
                </div>
        
</div>


    
      
    </section>
    <Footer />
   

     </main>
     </>
  )
}
