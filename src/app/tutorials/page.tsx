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

export default function Tutorials() {
  const account = useAccount()
  const router = useRouter()

  const [isSaving,setIsSaving] = useState(false)
  const [preview,setPreview] = useState()
  const [tutorials,setTutorials] = useState([{id:1,system:"British / Commonwealth",image:"/images/british.png",year:"Form 1",subject:"Mathematics"}])
  const [system,setSystem] = useState()
  const [schoolYears,setSchoolYears] = useState([])
  const [subjects,setSubjects] = useState([])
  const [selectedFile, setSelectedFile] = useState()
  const [target,setTarget] = useState()
  const filename = useRef()
  const [profileExist,setProfileExist] = useState(false)
  const [gotProfile,setGotProfile] = useState(false)
  const [profile,setProfile] = useState({})
  const [refreshData,setRefreshData] = useState(new Date().getTime())

// NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
setShow(false);
};

// create a preview as a side effect, whenever selected file is changed
useEffect(() => {
    if (!selectedFile) {
        setPreview(undefined)
        return
    }
  
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
        return
    }
  
    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
    filename.current = e.target.files[0].name
    setTarget(e.target.files)
  
  }

const saveProfile = async()=>{

}

const changeSystem = (e)=>{
   if(e.target.value=="USACAN")
      {
          setPreview("/images/usacan.webp")
          setSubjects(["Biology", "Calculus", "Chemistry", "English Language", "French", "Geography", "History", "ICT", "Literature", "Mathematics", "Music", "Physical Education", "Physics", "Science", "Spanish"]);
                 setSchoolYears([{id:"grade7",year:"Grade 7"},{id:"grade8",year:"Grade 8"},{id:"grade9",year:"Grade 9"},{id:"grade10",year:"Grade 10"},{id:"grade11",year:"Grade 11"},{id:"grade12",year:"Grade 12"}])

      
      }
     
   if(e.target.value=="UK")
   {
        setPreview("/images/british.png")
        setSubjects(["Biology", "Chemistry", "English Language", "French", "Geography", "History", "ICT", "Mathematics", "Music", "Physical Education", "Physics", "Science", "Spanish"]);
        setSchoolYears([{id:"form1",year:"Form 1"},{id:"form2",year:"Form 2"},{id:"form3",year:"Form 3"},{id:"form4",year:"Form 4"},{id:"form5",year:"Form 5"}])
   }
   if(e.target.value=="NONE")
   {
      setPreview("/images/homeschooler.jpg")
     setSubjects([])
     setSchoolYears([])
   }
 
  
   
    setSystem(e.target.value)
}
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
                  className="ml-4 mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
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
