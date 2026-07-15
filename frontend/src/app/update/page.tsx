import fs from 'fs';
import path from 'path';

export default function UpdatePage() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'app', 'page.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // We want to keep everything up to the end of the Topper section.
    let endOfTopper = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('id="topper"')) {
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() === '</section>' || lines[j].trim() === '</section>\r') {
            endOfTopper = j;
            break;
          }
        }
        break;
      }
    }

    if (endOfTopper === 0) {
      return <div>Error: Could not find topper section</div>;
    }

    const keptLines = lines.slice(0, endOfTopper + 1);

    const newSections = `
      {/* --- Courses Section --- */}
      <section id="courses" className="py-20 bg-[#fbfdff] relative z-10 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <div className="text-[12px] font-bold text-[#0a1c5d] uppercase tracking-wider mb-3">OUR COURSES</div>
          <h3 className="text-[28px] md:text-[32px] font-sans font-black text-[#0a1c5d] mb-12">
            We Offer Best Courses For Your Bright Future
          </h3>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {["Class 9th", "Class 10th", "Class 11th", "Class 12th", "BSEB", "CBSE", "Competitive\\nExams", "Foundation\\nCourses"].map((course, idx) => (
              <div key={idx} className="bg-white px-8 py-4 rounded-[12px] border border-gray-150 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] text-center flex items-center justify-center whitespace-pre-line text-[#0a1c5d] font-black text-[14px] hover:border-blue-200 transition-colors">
                {course}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section id="testimonials" className="py-20 bg-white relative z-10 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <div className="text-[12px] font-bold text-[#0a1c5d] uppercase tracking-wider mb-10">WHAT STUDENTS SAY</div>

          <div className="flex flex-col lg:flex-row justify-center gap-6">
            {[
              {
                text: "The environment here is very peaceful and perfect for study. Faculty members are very supportive.",
                name: "Anjali Kumari",
                role: "JMS Student",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
              },
              {
                text: "Thanks to JMS Modern Classes for guiding me and helping me achieve 1st Rank in BSEB Exams.",
                name: "Rohit Kumar",
                role: "Bihar Topper",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
              },
              {
                text: "Best library in Parsauni! 24x7 access, AC rooms and all facilities are excellent.",
                name: "Saurav Singh",
                role: "JMS Student",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-[#fbfdff] p-6 rounded-[20px] border border-gray-150 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex flex-col text-left flex-1 min-w-[280px]">
                <div className="flex gap-4">
                  <svg className="w-8 h-8 text-[#2c4c99] shrink-0 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 11h-4a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h4v8zm11 0h-4a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h4v8z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[13px] text-[#0a1c5d] font-semibold leading-relaxed mt-1">
                    {testimonial.text}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-8 pl-12">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-300">
                    <img src={testimonial.img} className="w-full h-full object-cover" alt={testimonial.name} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-[#0a1c5d]">— {testimonial.name}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Gallery Section --- */}
      <section id="gallery" className="py-20 bg-white relative z-10 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <div className="text-[12px] font-bold text-[#0a1c5d] uppercase tracking-wider mb-6">OUR LIBRARY GALLERY</div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
             {[
               "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=400",
               "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=400",
               "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400",
               "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
               "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400",
               "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=400"
             ].map((imgUrl, i) => (
                <div key={i} className="w-[180px] h-[110px] rounded-[12px] overflow-hidden border border-gray-150 shadow-sm relative group cursor-pointer">
                   <img src={imgUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={"Library " + i} />
                </div>
             ))}
          </div>

          <button className="px-6 py-2 bg-[#f0f4f8] text-[#0a1c5d] font-bold rounded-full text-[12px] flex items-center gap-2 mx-auto hover:bg-[#e2e8f0] transition-colors border border-gray-200 shadow-sm">
            VIEW MORE PHOTOS <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* --- Footer & Contact Block --- */}
      <footer className="pt-20 pb-10 bg-white relative z-10 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          
          {/* Top Info Row */}
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-16 items-start lg:items-center bg-[#fbfdff] p-6 lg:p-8 rounded-[20px] shadow-sm border border-gray-150">
             <div className="flex flex-col">
               <h4 className="text-[14px] font-black text-[#0a1c5d]">Get In Touch</h4>
               <p className="text-[12px] text-gray-600 mt-1 font-medium">We are here to help you.<br/>Reach out for any queries.</p>
             </div>
             
             <div className="w-px h-12 bg-gray-200 hidden lg:block"></div>

             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-[#fff4e6] flex items-center justify-center shrink-0">
                 <Phone className="w-4 h-4 text-[#f48c06]" />
               </div>
               <div>
                 <p className="text-[12px] font-bold text-[#0a1c5d]">Call Us</p>
                 <p className="text-[13px] font-black text-[#0a1c5d] leading-tight mt-0.5">7352527752<br/>9060425858</p>
               </div>
             </div>

             <div className="w-px h-12 bg-gray-200 hidden lg:block"></div>

             <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={openWhatsApp}>
               <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#25d366] fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.12 .95 11.487.95c-5.44 0-9.866 4.372-9.87 9.802 0 2.01.524 3.9 1.515 5.526L2.082 22l5.858-1.518c.005.003.005.004.565.372z" /></svg>
               </div>
               <div>
                 <p className="text-[12px] font-bold text-[#0a1c5d]">WhatsApp Us</p>
                 <p className="text-[12px] text-gray-500 font-medium mt-0.5">Chat with us on WhatsApp</p>
               </div>
             </div>

             <div className="w-px h-12 bg-gray-200 hidden lg:block"></div>

             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-[#fff4e6] flex items-center justify-center shrink-0">
                 <MapPin className="w-4 h-4 text-[#f48c06]" />
               </div>
               <div>
                 <p className="text-[12px] font-bold text-[#0a1c5d]">Visit Us</p>
                 <p className="text-[12px] text-gray-500 font-medium max-w-[200px] leading-snug mt-0.5">Kushwaha Market, Parsauni<br/>Near Parsauni Petrol Pump</p>
               </div>
             </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 items-start">
             <div className="col-span-1">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-9 h-9 bg-white border border-[#f48c06] rounded flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#f48c06]" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[18px] font-black text-[#0a1c5d] leading-none tracking-tight">JMS</span>
                     <span className="text-[10px] font-black text-[#f48c06] leading-none tracking-widest mt-0.5">MODERN CLASSES</span>
                   </div>
                </div>
                <p className="text-[12px] text-gray-500 mt-2 font-medium">Padhaai Aapki, Mahol Hamara</p>
             </div>

             <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center md:gap-20">
               <div>
                 <h5 className="text-[13px] font-black text-[#0a1c5d] mb-4">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-[#0a1c5d] font-semibold">
                   <button onClick={() => handleNavClick("home")} className="text-left hover:text-[#f48c06] transition-colors">Home</button>
                   <button onClick={() => handleNavClick("about-us")} className="text-left hover:text-[#f48c06] transition-colors">About Us</button>
                 </div>
               </div>
               <div>
                 <h5 className="text-[13px] font-black text-[#0a1c5d] mb-4 invisible">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-[#0a1c5d] font-semibold">
                   <button onClick={() => handleNavClick("fee-structure")} className="text-left hover:text-[#f48c06] transition-colors">Fee Structure</button>
                   <button onClick={() => handleNavClick("courses")} className="text-left hover:text-[#f48c06] transition-colors">Courses</button>
                 </div>
               </div>
               <div>
                 <h5 className="text-[13px] font-black text-[#0a1c5d] mb-4 invisible">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-[#0a1c5d] font-semibold">
                   <button onClick={() => handleNavClick("topper")} className="text-left hover:text-[#f48c06] transition-colors">Topper</button>
                   <button onClick={() => handleNavClick("gallery")} className="text-left hover:text-[#f48c06] transition-colors">Gallery</button>
                 </div>
               </div>
               <div>
                 <h5 className="text-[13px] font-black text-[#0a1c5d] mb-4 invisible">Quick Links</h5>
                 <div className="flex flex-col gap-2.5 text-[12px] text-[#0a1c5d] font-semibold">
                   <button onClick={() => handleNavClick("contact")} className="text-left hover:text-[#f48c06] transition-colors">Contact Us</button>
                 </div>
               </div>
             </div>

             <div className="col-span-1 flex flex-col items-start lg:items-end w-full">
                <div className="w-full max-w-xs">
                  <h5 className="text-[13px] font-black text-[#0a1c5d] mb-4">Follow Us</h5>
                  <div className="flex gap-2">
                     <a href="#" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                     </a>
                     <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFB900] via-[#D1016F] to-[#8F01D7] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                     </a>
                     <a href="#" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.12 .95 11.487.95c-5.44 0-9.866 4.372-9.87 9.802 0 2.01.524 3.9 1.515 5.526L2.082 22l5.858-1.518c.005.003.005.004.565.372z"/></svg>
                     </a>
                     <a href="#" className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                     </a>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </footer>
`;

    const endOfFileContent = `      </div>

      {/* Admission lead form modal overlay */}
      <AdmissionModal isOpen={isAdmissionOpen} onClose={() => setIsAdmissionOpen(false)} />
    </div>
  );
}`;

    // Fix string joining
    const newFileLines = [...keptLines, newSections, endOfFileContent];
    const matchNewline = content.match(/\\r\\n/) ? '\\r\\n' : '\\n';
    fs.writeFileSync(filePath, newFileLines.join(matchNewline), 'utf-8');
    
    return <div>Successfully updated the file!</div>;
  } catch (error: any) {
    return <div>Error updating file: {error?.toString() || "Unknown error"}</div>;
  }
}
