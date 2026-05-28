import React from "react";
import { MdPerson } from "react-icons/md";

/**
 * AvatarGroup Component
 * Displays a clustered group of user avatars with a "+X" overflow indicator.
 */
const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
  return (
    <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-2xl border-2 border-white bg-slate-100 shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110"
          style={{ zIndex: maxVisible - index }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={`Team member ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <MdPerson className="text-slate-400 text-lg" />
          )}
        </div>
      ))}

      {avatars.length > maxVisible && (
        <div 
          className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl border-2 border-white shadow-lg transition-transform hover:scale-110"
          style={{ zIndex: 0 }}
        >
          +{avatars.length - maxVisible}
        </div>
      )}
      
      {avatars.length === 0 && (
          <div className="w-10 h-10 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 italic text-[10px] uppercase font-bold px-1 text-center leading-none">
              None
          </div>
      )}
    </div>
  );
};

export default AvatarGroup;