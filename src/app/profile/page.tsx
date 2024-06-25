"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import Link from 'next/link'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useState,useEffect,useRef } from 'react';
import { useAccount} from 'wagmi'
import { homeSchoolerABI, homeSchoolerAddress } from '@/contracts/contracts';
import { ethers } from 'ethers';
import { useEthersSigner } from '@/signer/signer'
import { uploadToIPFS } from '@/fleek/fleek';
import Notification from '@/components/Notification/Notification';
export default function Profile() {
  const account = useAccount()
  const [isSaving,setIsSaving] = useState(false)
  const [preview,setPreview] = useState()
  const [selectedFile, setSelectedFile] = useState()
  const [target,setTarget] = useState()
  const filename = useRef()
  const [profileExist,setProfileExist] = useState(false)
  const [gotProfile,setGotProfile] = useState(false)
  const [profile,setProfile] = useState({})
  const [refreshData,setRefreshData] = useState(new Date().getTime())
  const signer = useEthersSigner()

// NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
setShow(false);
};

useEffect(()=>{
  async function getProfile(){
   const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer) 
   try{
         const _profile = await contract.getProfile(account.address) 
         if(_profile)
         {
        
           setGotProfile(true)
           setProfileExist(true)   
           setProfile(_profile)
           setPreview(_profile.imageUrl)
         }else
         {
            setGotProfile(true)
            setProfileExist(false)   
         
         }
         
   }catch(error)
   {
      console.log(error)
   }
   
  }
 
    if(account?.address && signer)
      getProfile()
 
 },[account?.address,signer])
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
    setIsSaving(true)
     const name = document.getElementById("name").value
     const description = document.getElementById("description").value 
     if(!selectedFile && !profile?.imageUrl)
     {   setDialogType(2) //Error
         setNotificationTitle("Profile")
         setNotificationDescription("Please select a profile picture")
         setIsSaving(false)
         setShow(true)
         return
     } 
  
     if(!name || !description)
     {
  
      setDialogType(2) //Error
      setNotificationTitle("Profile")
      setNotificationDescription("Please enter profile details")
      setShow(true)
      setIsSaving(false)
  
      return
  
     }
      
      const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer) 
     try{
  
      setDialogType(3) //Info
      setNotificationTitle("Profile");
      setNotificationDescription("Uploading profile image.")
      setShow(true)
    
      let cid
      let url =profile?.imageUrl
      
      if(selectedFile) //upload image file
      {const result = await  uploadToIPFS(filename.current,selectedFile)
      //console.log(await result.json())
      
       cid =result.cid.toV1().toString()
       url = `https://${cid}.ipfs.cf-ipfs.com`
      
       setShow(false)
      }
       
  
       
       const tx = await contract.callStatic.setProfile(url,name,description)
       const tx1 = await contract.setProfile(url,name,description)
       await tx1.wait()
       setDialogType(1) //Success
       setNotificationTitle("Profile");
       setNotificationDescription("Profile updated successfully.")
       setShow(true)
   
       setIsSaving(false)
  
  
     }catch(error)
     {
        setDialogType(2) //Error
        setNotificationTitle("Profile");
        setNotificationDescription(error?.error?.data?.message ? error?.error?.data?.message: error.message )
        setIsSaving(false)
  
        setShow(true)
      return
     }
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
  
     
  <div className="container p-2 ">
               <div className=" w-full flex flex-col min-h-[500px] -mx-4 bg-bg-color flex justify-center items-center    rounded-xl border border-black">
              
           



    
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
                     <img src={preview ? preview: '/images/profile.jpg'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2 ">
                    <button disabled={isSaving }
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    onClick={()=>saveProfile()}
                    type="button"
                    >
                        Save Profile 
                                           </button>
                   
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-5 pt-2">
                    <p className="text-xl font-bold text-white">
                      Profile Details
                    </p>
                  </div>
                  <div className="mb-5">
                        <label
                          for="name"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Name
                        </label>
                        <input
                        disabled={isSaving }
                          required   
                          type="text"
                          name="name"
                          id="name"
                          defaultValue={profile?.name}
                          placeholder="Enter Name"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>                  <div className="-mx-3 flex flex-wrap">
                   

                  </div>

               
                
     
     
              
             
                 
                  <div className="mb-5">
                    <label
                      for="description"
                      className="mb-2 block text-base font-medium text-white"
                    >
                      Description
                    </label>
                    <textarea
                      disabled={isSaving }
                      required
                      rows="10"
                      name="description"
                      id="description"
                      defaultValue={profile?.description}
                      placeholder="Type profile description"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                    ></textarea>
                  </div>
             
                 
                 
                </div>
              </div>
            </div>
          </form>
        </div>
</div>


    
      
    </section>
    <Footer />
    <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />

     </main>
     </>
  )
}
