import React from"react";
import { Sun, Moon } from"lucide-react";

export default function ThemeToggle({ isDark, onToggle }) {
 return (
 <button
 onClick={onToggle}
 className="relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer flex items-center px-1"
 style={{ backgroundColor: isDark ?"#2E2E35":"#ECECEA"}}
 aria-label="Alternar tema claro/escuro"
 >
 <div
 className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
 style={{
 backgroundColor: isDark ?"#E85D3A":"#FFFFFF",
 transform: isDark ?"translateX(28px)":"translateX(0px)",
 }}
 >
 {isDark ? (
 <Moon className="w-3 h-3 text-white"/>
 ) : (
 <Sun className="w-3 h-3 text-amber-500"/>
 )}
 </div>
 </button>
 );
}
