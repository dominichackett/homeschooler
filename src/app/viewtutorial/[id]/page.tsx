"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import Link from 'next/link'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useState,useEffect,useRef } from 'react';
import { useAccount} from 'wagmi'
import Speech from 'react-speech';
import { useEthersSigner } from '@/signer/signer'
import {homeSchoolerAddress,homeSchoolerABI} from "@/contracts/contracts"
import Notification from '@/components/Notification/Notification';
import { ethers } from 'ethers';
const style = {
    container: {
      width: '100%'
    },
    text: {
      width: '100%',
      display: 'inline' // You can set the desired display property here
    },
    play: {
      hover: {
        backgroundColor: 'GhostWhite'
      },
      button: {
        width: '34px', // Add unit
        height: '34px', // Add unit
        cursor: 'pointer',
        pointerEvents: 'none',
        outline: 'none',
        backgroundColor: 'Gainsboro',
        border: 'solid 1px rgba(255,255,255,1)',
        borderRadius: '6px' // Add unit
      }
    },
    stop: {
      hover: {
        backgroundColor: 'GhostWhite'
      },
      button: {
        width: '34px', // Add unit
        height: '34px', // Add unit
        cursor: 'pointer',
        pointerEvents: 'none',
        outline: 'none',
        backgroundColor: 'Gainsboro',
        border: 'solid 1px rgba(255,255,255,1)',
        borderRadius: '6px' // Add unit
      }
    },
    pause: {
      hover: {
        backgroundColor: 'GhostWhite'
      },
      button: {
        width: '34px', // Add unit
        height: '34px', // Add unit
        cursor: 'pointer',
        pointerEvents: 'none',
        outline: 'none',
        backgroundColor: 'Gainsboro',
        border: 'solid 1px rgba(255,255,255,1)',
        borderRadius: '6px' // Add unit
      }
    },
    resume: {
      hover: {
        backgroundColor: 'GhostWhite'
      },
      button: {
        width: '34px', // Add unit
        height: '34px', // Add unit
        cursor: 'pointer',
        pointerEvents: 'none',
        outline: 'none',
        backgroundColor: 'Gainsboro',
        border: 'solid 1px rgba(255,255,255,1)',
        borderRadius: '6px' // Add unit
      }
    }
  };
  
export default function ViewTutorial({params}) {
  const account = useAccount()
  const signer = useEthersSigner()
  const [topics,setTopics] = useState([])
  const [isSaving,setIsSaving] = useState(false)
  const [preview,setPreview] = useState()
  const [tutorial,setTutorial] = useState()
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
 const [messages,setMessages] = useState(["Hello","Welcome","British Commonwealth"])
 const contractRef = useRef(null); // useRef to store the contract instance

// NOTIFICATIONS functions
const [notificationTitle, setNotificationTitle] = useState();
const [notificationDescription, setNotificationDescription] = useState();
const [dialogType, setDialogType] = useState(1);
const [show, setShow] = useState(false);
const close = async () => {
setShow(false);
};
async function pause() {
  await new Promise(resolve => setTimeout(resolve, 15000));
  console.log("Paused for 5 seconds");
}


function generateEmbedUrl(youtubeUrl) {
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
      return null; // Handle invalid URL or no video ID found
  }
  return `https://www.youtube.com/embed/${videoId}`;
}

function extractVideoId(url) {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
}

function isYouTubeLink(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
}

const handleOracleResponsed = async(tutorialId, responseDate) => {
  console.log(`OracleResponsed event detected: tutorialId=${tutorialId}, responseDate=${responseDate}`);
  await pause()
  setRefreshData(new Date().getTime());


};
useEffect(() => {
 
  let isMounted = true;

  const setupListener = async () => {
    if (account?.address && signer) {
      try {
        const newContract = new ethers.Contract(homeSchoolerAddress, homeSchoolerABI, signer);

        // Only update the contractRef if the component is still mounted
        if (isMounted) {
          contractRef.current = newContract;
          console.log('Contract instance created:', contractRef.current);

          // Listen for the OracleResponsed event
          contractRef.current.on('OracleResponsed', handleOracleResponsed);
        }

      } catch (error) {
        console.error('Error setting up contract listener:', error);
      }
    }
  };

  setupListener();

  return () => {
    isMounted = false; // Mark the component as unmounted
    if (contractRef.current) {
      console.log('Cleaning up contract listener...');
      contractRef.current.off('OracleResponsed', handleOracleResponsed);
    }
  };
}, [account?.address, signer]);

function messageType(text:any){
  if(text.indexOf("[HSTUTORIAL]")!=-1)
    return 1
  if(text.indexOf("[HSQUIZ]")!=-1)
    return 2
  if(text.indexOf("[HSTEST]")!=-1)
    return 4
  try{
     JSON.parse(text)
     return 3   
  }catch(error)
  {
     return -1
  }
  

}

function removeCode(text:any){
   let content  = text.replaceAll("[HSTUTORIAL]","")
   content  = content.replaceAll("[HSTUTORIALEND]","")
   content  = content.replaceAll("[HSQUIZ]","")
   content  = content.replaceAll("[HSVIDEO]","")
   content = content.replaceAll("[HSTUTORIALTOEND]","")
   content = content.replaceAll("[HSTEST]","")
   content = content.replaceAll("[HSTESTEND]","")


   return content
}
function getTopic(text:any){
const lines = text.split('\n'); // Split the text into an array of lines
 const firstLine = lines[2]; // Get the first element of the array
  return firstLine
}
useEffect(()=>{
async function getTutorial() {
     const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer)
     const _tutorial = await contract.getTutorial(params.id)
     console.log(_tutorial)
     const image = (_tutorial._schoolSystem == "UK" ? "/images/british.png":"/images/usacan.webp")
     const system = (_tutorial._schoolSystem == "UK" ? "British / Commonwealth":"American / Canadian")
     setTutorial({image:image,system,year:_tutorial._schoolYear,subject:_tutorial._subject})  
     const _tutorials = await contract.getTutorialMessages(params.id)
     console.log(_tutorials)
     let tutorialArray = []
     for(const index in _tutorials ){
      if(index > 2 && _tutorials[index].role!="user")
       { 
            let content = removeCode(_tutorials[index].content)
            const _topic = getTopic(content)
             const mtype =messageType(_tutorials[index].content)
             if(mtype == 3)
             content = JSON.parse(content)
            console.log(content)
           const data = {type:mtype,content:content,topic:_topic}
           if(content !="error")
           tutorialArray.push(data)
       } 
        if(index == 2)
        {
           extractList(_tutorials[index].content)
        }
     }
    

     setMessages(tutorialArray)
} 
   
 if(account?.address && signer)
   getTutorial()

},[account.address,signer,refreshData])

const formatText = (text) => {
  if(text == undefined)
     return
  // Split the text by newline character
  const lines = text.split('\n');
  // Map over each line and wrap it in a paragraph tag
  return lines.map((line, index) => <p key={index} className="mt-2 text-white">{line}</p>);
};

const extractList = (text) => {
  const startTag = '[HSLISTSTART]';
  const endTag = '[HSLISTEND]';
  
  const startIndex = text.indexOf(startTag) + startTag.length;
  const endIndex = text.indexOf(endTag);
  
  if (startIndex < startTag.length || endIndex === -1) {
    return [];
  }
  
  const listContent = text.slice(startIndex, endIndex).trim();
  const items = listContent.split('\n').filter(item => item.trim() !== '');
  setTopics(items)
};

const createTopicTutorial = async()=>{
    const selectElement = document.getElementById('topics');
    
    // Get the selected option index
    const selectedIndex = selectElement.selectedIndex;
    
    // Get the selected option text
    const selectedOptionText = selectElement.options[selectedIndex].text;

  if(selectedOptionText =="Select a Topic")   
  { 
    setDialogType(2) //Error
    setNotificationTitle("Create Tutorial")
    setNotificationDescription("Please select a topic.")
    setShow(true)
    return
  }  

  
  
  const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer)
  try{

       setDialogType(3) //Info
       setNotificationTitle("Create Tutorial")
       setNotificationDescription("Creating tutorial please wait.")
       setShow(true)
       
       const prompt = `I want a tutorial with lessons for students to read for  ${selectedOptionText} add [HSTUTORIAL] at the top.  Students should be able to read the lesson and have an understanding of the topic. It must have examples with answers. Make it as comprehensive as possible.`
       const tx = await contract.request(prompt,params.id)
       await tx.wait()
       await pause()
       setRefreshData(new Date().getTime());
       setShow(true)


  }catch(error)
  {
    setDialogType(2) //Error
    setNotificationTitle("Create Tutorial");
    setNotificationDescription(error?.error?.data?.message ? error?.error?.data?.message: error.message )
    setIsSaving(false)

    setShow(true)
  }
}

const createQuiz = async(topic:string)=>{
  const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer)
  try{

    
       setDialogType(3) //Info
       setNotificationTitle("Create Tutorial")
       setNotificationDescription("Creating quiz please wait.")
       setShow(true)
       
       console.log(topic)
       const prompt = `Generate a 2 question quiz for ${topic} ${tutorial.year} ${tutorial.subject} It must be multiple choice with A,B,C and D as options. Put [HSQUIZ] at the top of each question.  Do not show the answers the student will have to figure out the answers. Randomize the answers. Only one question at a time in your response.`
       const tx = await contract.request(prompt,params.id)
       await tx.wait()
       await pause()
       setRefreshData(new Date().getTime());
       setShow(false)
     

  }catch(error)
  {
    setDialogType(2) //Error
    setNotificationTitle("Create Tutorial");
    setNotificationDescription(error?.error?.data?.message ? error?.error?.data?.message: error.message )
    setIsSaving(false)

    setShow(true)
  }
}

const createTest = async(topic:string)=>{
  const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer)
  try{

       setDialogType(3) //Info
       setNotificationTitle("Create Test")
       setNotificationDescription("Creating test please wait.")
       setShow(true)
       
       console.log(topic)
       const prompt = `Generate a 10 question test for ${topic} ${tutorial.year} ${tutorial.subject} .It must be multiple choice with A,B,C and D as options. Put [HSTEST] at the top of each question. Show all questions in your response. Do not show the answers the student will have to figure out the answers. Randomize the answers.`
       const tx = await contract.request(prompt,params.id)
       await tx.wait()
       await pause()
       setRefreshData(new Date().getTime());
       setShow(false)
     

  }catch(error)
  {
    setDialogType(2) //Error
    setNotificationTitle("Create Test");
    setNotificationDescription(error?.error?.data?.message ? error?.error?.data?.message: error.message )
    setIsSaving(false)

    setShow(true)
  }
}

const answerQuiz = async(answer:number)=>{
  const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer)
  try{

       setDialogType(3) //Info
       setNotificationTitle("Tutorial Quiz")
       setNotificationDescription("Answering quiz please wait.")
       setShow(true)
       
       console.log(answer)
       const tx = await contract.answerQuiz(answer,params.id)
       await tx.wait()
       await pause()
       setRefreshData(new Date().getTime());
       setShow(false)
     
  }catch(error)
  {
    setDialogType(2) //Error
    setNotificationTitle("Tutorial Quiz");
    setNotificationDescription(error?.error?.data?.message ? error?.error?.data?.message: error.message )
    setIsSaving(false)

    setShow(true)
  }
}

const getVideos = async(topic:string)=>{
  const contract = new ethers.Contract(homeSchoolerAddress,homeSchoolerABI,signer)
  try{

       setDialogType(3) //Info
       setNotificationTitle("Tutorial Videos")
       setNotificationDescription("Getting videos please wait.")
       setShow(true)
       console.log(topic)
       
       const prompt = `I need youtube videos for ${topic} ${tutorial.year} ${tutorial.subject}`
       
       const tx = await contract.videoTutorials(prompt,params.id)
       
       await tx.wait()
       await pause()
       setRefreshData(new Date().getTime());
       setShow(false)
     
  }catch(error)
  {
    setDialogType(2) //Error
    setNotificationTitle("Tutorial Videos");
    setNotificationDescription(error?.error?.data?.message ? error?.error?.data?.message: error.message )
    setIsSaving(false)

    setShow(true)
  }
}

const copyToClipboard = (content:any) => {
    navigator.clipboard.writeText(content)
      .then(() => {
          })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  
};

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
       
     
  <div className="container  ">
 
        
 {tutorial && <div className="flex items-center mt-4 ml-8 ">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img crossOrigin  className="cursor-pointer  h-8 w-8 rounded-full " 
                        src={tutorial.image} alt="" />
                      </div>
                      <div className="mt-2 mr-2">
                      <div  className="mb-4 cursor-pointer text-lg font-medium text-white">{tutorial.system}</div>

                         </div>
                    </div> }

                    {tutorial &&       <div className="mt-4 ml-8 flex flex-row  text-lg font-medium text-white">
                      <h3>Year: </h3>
                      <p className='ml-10'>{tutorial.year}</p>
                    </div>}
                    {tutorial &&     <div className="mt-4 ml-8 mb-4 flex flex-row text-lg font-medium text-white">
                      <h3>Subject:</h3>
                      <p className='ml-4'>{tutorial.subject}</p>
                    </div>}

                    <div  className="mb-8 p-6  w-full flex flex-col min-h-[150px]  bg-bg-color     rounded-xl border border-black">
              
              <p className='m-6 mb-2  text-2xl text-white font-bold'>Topics: <select id="topics"
                                    className="mt-2 w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                                    ><option value={"-1"}>Select a Topic</option>
              {topics.map((topic,index)=>(
                <option key={index} value={index}>{topic}</option>
              ))}
              </select></p>

<div className='ml-6'><button         onClick={()=>createTopicTutorial()} className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
>Create Topic Tutotrial</button>

</div>


   
       
       </div>

    {messages.map((message,index) =>(
      <div key={index}>
                  <div  className="mb-8  p-6  w-full flex flex-col min-h-[500px]  bg-bg-color     rounded-xl border border-black">
              
            {(message.type <= 2 || message.type== 4) &&  <div className='ml-6'>           <Speech styles={style} text={message.content} stop={true} pause={true} resume={true} /></div>}
            {(message.type <= 2 || message.type == 4) &&   <p className='m-6 mb-2  text-2xl text-white font-bold'>{message.type ==1 ? message.topic :"" }</p>}
               
            {(message.type <= 2 || message.type == 4)  &&  <div className=" m-6 text-white">{formatText(message.content)}</div>}
                        {message.type == 3 &&                   <div className="mb-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">

                        
                        {message.content.map((video,_index) =>(
                         isYouTubeLink(video.link)  == true && <div key={_index} className='mb-6'><iframe width="560" height="315" 
                         src={ generateEmbedUrl(video.link)} title="YouTube video player" 
                         frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>))}
                        </div>}

    

{message.type == 1 && <div className='ml-6'>
<button  onClick={()=>getVideos(message.topic)}                   className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
>Videos</button>
<button        onClick={()=>createQuiz(message.topic)}           className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
>Quiz</button>
<button        onClick={()=>createTest(message.topic)}           className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
>Test</button>

</div>}

{message.type == 2 && <div className='ml-6'><button                   className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
 onClick={()=>answerQuiz(0)}>A</button>
 <button  onClick={()=>answerQuiz(1)}                 className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
 >B</button>
 <button  onClick={()=>answerQuiz(2)}                 className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
 >C</button>
 <button onClick={()=>answerQuiz(3)}                  className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
 >D</button>
 
 </div>}
 
 {message.type == 4 && <div className='ml-6'>
  <button        onClick={()=>copyToClipboard(message.content)}           className="mt-1 mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
>Copy To Clipboard</button>

 
 </div>}
 
    
        
        </div>
          
         </div>
        
    ))}
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
