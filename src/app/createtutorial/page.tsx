"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import Link from 'next/link'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useState,useEffect,useRef } from 'react';
import { useAccount} from 'wagmi'

export default function CreateTutorial() {
  const account = useAccount()
  const [isSaving,setIsSaving] = useState(false)
  const [preview,setPreview] = useState()
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
   if(e.target.value=="USA/CAN")
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
        <video className="-z-10 absolute top-0 left-0 w-full h-full object-cover bg-top bg-no-repeat " autoPlay loop muted>
    <source src="/videos/school.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  
     
  <div className="container  ">
               <div className=" w-full flex flex-col min-h-[500px] -mx-4 bg-bg-color flex justify-center items-center ml-5 mr-5   rounded-xl border border-black">
              
           



    
        <form className="w-full p-2 sm:p-10" >
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
              <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                    <input
                      disabled={isSaving }
                      required={!selectedFile ? true: false}
                      type="file"
                      name="profileImage"
                      id="profileImage"
                      className="sr-only"
                      onChange={onSelectFile}
                    />
                    <label
                      for="profileImage"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={preview ? preview: '/images/homeschooler.jpg'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2 ">
                    <button disabled={isSaving }
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    onClick={()=>saveProfile()}
                    type="button"
                    >
                        Create Tutorial
                                           </button>
                   
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-5 pt-2">
                    <p className="text-xl font-bold text-white">
                      Create Tutorial
                    </p>
                  </div>
                  <div className="mb-5">
                        <label
                          for="system"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          System
                        </label>
                        
                        <select onChange={changeSystem} 
                        id="schoolSystem"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                      >
                      <option value="NONE">Select School System</option>
                      <option value="USA/CAN">American / Canadian</option>
                      <option value="UK">Birtish / Commonwealth </option></select>
            
                      </div>                 


                      <div className="mb-5">
                        <label
                          for="schoolYear"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Year
                        </label>
                        
                        <select 
                        id="schoolYear"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                      >
                      <option value="NONE">Select School Year</option>
                       {schoolYears.map((year) => (
    <option key={year.id} value={year.id}>
      {year.year}
    </option>
  ))} </select>
            
                      </div>

               
                      <div className="mb-5">
                        <label
                          for="subject"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Subject
                        </label>
                        
                        <select 
                        id="subject"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                      >
                      <option value="NONE">Select Subject</option>
                     {subjects.map((subject) => (
    <option key={subject} value={subject}>
      {subject}
    </option>
  ))} 
                    </select>
            
                      </div>
     
     
              
             
                 
               
                 
                </div>
              </div>
            </div>
          </form>
        </div>
</div>


    
      
    </section>
    <Footer />
   

     </main>
     </>
  )
}
