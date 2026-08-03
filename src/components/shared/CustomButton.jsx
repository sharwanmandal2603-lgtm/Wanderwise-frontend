import { LogIn } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CustomButton = ({text, color, link, isLogin}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    if(link){
      navigate(link);
    }
  }

  return (
    <button onClick={handleClick} className="bg-primary px-5 py-1.5 rounded-sm text-white cursor-pointer hover:bg-primary/70 flex items-center gap-2">
        {text} 
        {
          isLogin && <LogIn size={18} />
        }
        
    </button>
  )
}

export default CustomButton