import React, { useState, useEffect} from 'react'
import axios from 'axios'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


const Home = () => {

    const {transcript, listening} = useSpeechRecognition();


    const [languageList, setlanguageList] = useState([])
    const [inLanguage, setinLanguage] = useState("auto")
    const [targetLanguage, settargetLanguage] = useState("")
    const [text, settext] = useState("")
    const [answer, setanswer] = useState("")
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
      
      axios.get("https://lingva.ml/api/v1/languages")
      .then(function (response) {
        
        setlanguageList(response.data.languages)

      })
      .catch((error)=>console.log(error))

    }, [])
    
    
    const submithandler = async (e) => {
        e.preventDefault();
        setisLoading(true);

        try {
          const encodedText = encodeURIComponent(text);
          const response = await axios.get(
            `https://lingva.ml/api/v1/${inLanguage}/${targetLanguage}/${encodedText}`
          );
      
          console.log("Translated text:", response.data.translation);
          setanswer(response.data.translation)

        } catch (error) {
          console.log(error);
        } finally {
          setisLoading(false)
        }

      }



  return (
    <div className='h-full min-h-screen w-full flex justify-center items-center bg-gray-100 p-4'>
  
        <form 
        onSubmit={(e)=>submithandler(e)}
          className="flex flex-row gap-6 bg-white p-6 rounded-xl shadow-lg"
          >

<div className='flex flex-col w-[22rem] gap-4'>
        <select 
        value={inLanguage}
        onChange={(e) => setinLanguage(e.target.value)}
        className='border border-gray-300 px-3 py-2 bg-white text-sm rounded shadow-sm focus:ring-2 focus:ring-blue-400'>

          {languageList.map(

            (ln, index)=>
              (<option key={index} value={ln.code} > 
              {ln.name}      
              </option>)
            )}
        </select>


        <textarea 
        
        value={text}
        onChange={(e)=>settext(e.target.value)}
        className='border-2 bg-gray-300 font-mono px-3 py-1 h-32 rounded resize-none focus:ring-2 focus:ring-blue-400'
        />

        <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 transition-translate duration-150 active:scale-95"
        disabled={isLoading}

        >
        {isLoading ? "Translating" : "Translate"}
        </button>

        <button 
          onClick={() => {
      
              if (listening) {
                SpeechRecognition.stopListening();
                settext(transcript);
              } else {
                SpeechRecognition.startListening();
              }
            
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 transition-translate duration-150 active:scale-95"
        >
          {listening ? "Stop" : "Start"}
                </button>
        

</div>

<div id='output-field'
className='flex flex-col w-[22rem] gap-4 '
>

        <select 
        value={targetLanguage}
        onChange={(e) => settargetLanguage(e.target.value)}
        className='border border-gray-300 px-3 py-2 bg-white text-sm rounded shadow-sm focus:ring-2 focus:ring-blue-400'>
          
          <option value="" disabled>Select target language</option>
          {languageList.filter((ln) => ln.code !== "auto").map(

            (ln, index)=>
              (<option key={index} value={ln.code} > 
              {ln.name}      
              </option>)
            )}
        </select>
        

        <div id='Output' className='border-2 bg-gray-300 font-mono px-3 py-2 h-32 rounded text-gray-800 overflow-y-auto'>
        
        
        {isLoading ? (
            <p className="italic text-gray-500">Translating...</p>) 
          : answer !== "" ? (
            answer) 
          : (
            <p className="italic text-gray-400">Translation will appear here</p>
            )}

        </div>
</div>
        </form>


    </div>
  )
}

export default Home