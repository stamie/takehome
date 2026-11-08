import { useState } from "react";

export function Footer() {

  return (
      <div className="footer bg-gray-500 mt-4">
    
     <div className="flex flex-row justify-evenly items-center">
    
        <button id="cityButton"
          className="mt-16 py-2 px-4 margin-2 font-bold bg-amber-300 hover:bg-amber-400 active:bg-amber-500 rounded-lg cursor-pointer"
          type="button" onClick={() => window.open("/city.html", "_self")}>Város időjárási adatok lekérése</button>
        <button id="regionButton"
          className="mt-16 py-2 px-4 font-bold bg-amber-300 hover:bg-amber-400 active:bg-amber-500 rounded-lg cursor-pointer"
          type="button" onClick={() => window.open("/region.html", "_self")}>Régio időjárási adatok lekérése</button>
        
      </div>
    <div className="py-4 px-8 max-w-md mx-auto mt-8 border-0 border-solid border-amber-500 rounded-lg">
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">© 2024 Adiumsoft. Minden jog fenntartva.</p>
</div></div>
  </div>  
  );
}
