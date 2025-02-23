import React, { createContext, useState, useEffect, useContext } from 'react';

export const ModaLReelContext = createContext();

function ModaLReelContextProvider({ children }) {
    const [isModalVisible,setIsModalVisible] = useState(false)
    
    const handleModalVisibility =  ()=>{
        setIsModalVisible(!isModalVisible)
    }    

  return (
    <ModaLReelContext.Provider value={{ isModalVisible,handleModalVisibility }}>
      {children}
    </ModaLReelContext.Provider>
  );
}
export function  useModaLReelContext () {
    return useContext(ModaLReelContext)
}
export default ModaLReelContextProvider;
