import React, { useEffect, useState } from 'react';
import { assets, projectsData } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const [isViewAll, setIsViewAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(projectsData.length);
      } else {
        setCardsToShow(1);
      }
    };

    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);

    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  // Auto slide when not in "View All" mode
  useEffect(() => {
    if (!isViewAll && cardsToShow === 1 && !selectedProject) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projectsData.length);
      }, 4000); // Auto slide every 4 seconds
      return () => clearInterval(interval);
    }
  }, [isViewAll, cardsToShow, projectsData.length, selectedProject]);

  const handleViewAll = () => {
    setIsViewAll(true);
    setCardsToShow(projectsData.length);
    setCurrentIndex(0);
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  return (
    <motion.div 
      initial={{opacity:0, x:-200}} 
      transition={{duration:1.5}} 
      whileInView={{opacity:1, x:0}} 
      viewport={{once: true}} 
      className="container mx-auto py-4 pt-20 px-6 md:px-20 lg:px-32 my-20 w-full overflow-hidden"
      id="Projects"
    >
      {/* Centered Header */}
      <div className="text-center mb-12 relative">
        {/* Centered Title and Description */}
        <h1 className="text-2xl sm:text-4xl font-bold mb-3">
          Projects{' '}
          <span className="underline underline-offset-4 decoration-1 font-light">
            Completed
          </span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Crafting Spaces, Building Legacies - Explore Our Portfolio
        </p>
        
        {/* View All Button - Right aligned (desktop only) */}
        {!isViewAll && (
          <div className="absolute right-0 top-0 hidden sm:block">
            <motion.button
              onClick={handleViewAll}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group"
            >
              <span>View All Projects</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="white" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6"></path>
              </svg>
            </motion.button>
          </div>
        )}
      </div>

      {/* Mobile View All Button - Centered below header */}
      {!isViewAll && (
        <div className="flex justify-center mb-8 sm:hidden">
          <motion.button
            onClick={handleViewAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <span>View All Projects</span>
            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6"></path>
            </svg>
          </motion.button>
        </div>
      )}

      {/* Project display container */}
      <div className="overflow-hidden">
        <div
          className={`${isViewAll ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex gap-8 transition-transform duration-500 ease-in-out'}`}
          style={{ 
            transform: !isViewAll 
              ? `translateX(-${(currentIndex * 100) / cardsToShow}%)` 
              : 'none' 
          }}
        >
          {projectsData.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={isViewAll ? '' : 'flex-shrink-0 w-full sm:w-1/4'}
            >
              <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Project image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Status badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-blue-600">
                      {project.status || 'Completed'}
                    </span>
                  </div>
                </div>
                
                {/* Project info */}
                <div className="bg-white p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm">{project.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{project.price}</p>
                    </div>
                    
                    <button 
                      onClick={() => openProjectDetails(project)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300 group"
                    >
                      Details
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Decorative bottom border on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Dots indicator (only in slider mode) */}
        {!isViewAll && cardsToShow === 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {projectsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Back to Slider Button (only shown in View All mode on mobile) */}
        {isViewAll && (
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={() => setIsViewAll(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
              </svg>
              <span>Back to Slider</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProjectDetails}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-4 top-4 bottom-4 md:inset-20 lg:inset-32 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{selectedProject.title}</h2>
                  <div className="flex items-center mt-2">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-gray-600">{selectedProject.location}</span>
                  </div>
                </div>
                <button
                  onClick={closeProjectDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Image Gallery & Map */}
                  <div>
                    <div className="rounded-xl overflow-hidden shadow-lg mb-6">
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                    
                    {/* Location Map */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                        </svg>
                        Project Location
                      </h3>
                      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        {/* Interactive Map - Using Google Maps iframe */}
                        <div className="h-64 w-full bg-gray-100 relative">
                          <iframe
                            title={`Location map for ${selectedProject.title}`}
                            className="absolute inset-0 w-full h-full"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedProject.location)}&output=embed&z=14`}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                              </svg>
                              <span className="text-sm font-medium">{selectedProject.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        Interactive map showing the project location. You can zoom and pan to explore the area.
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div>
                    {/* Project Status & Price */}
                    <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                      <div className="flex items-center">
                        <div className={`px-4 py-2 rounded-full ${selectedProject.status === 'Completed' ? 'bg-green-100 text-green-800' : selectedProject.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          <span className="font-semibold">{selectedProject.status || 'Completed'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Project Value</p>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">{selectedProject.price}</p>
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Project Overview
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Features/Specifications */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProject.features && selectedProject.features.map((feature, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <svg className="w-4 h-4 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline/Stats */}
                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Project Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedProject.timeline && (
                          <>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{selectedProject.timeline.duration}</div>
                              <div className="text-sm text-gray-500">Duration</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{selectedProject.timeline.area}</div>
                              <div className="text-sm text-gray-500">Area</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {selectedProject.timeline.completed || selectedProject.timeline.completionDate || selectedProject.timeline.startDate}
                              </div>
                              <div className="text-sm text-gray-500">
                                {selectedProject.timeline.completed ? 'Completed' : 
                                 selectedProject.timeline.completionDate ? 'Completion' : 'Start Date'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{selectedProject.timeline.teamSize}</div>
                              <div className="text-sm text-gray-500">Team Size</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Specifications */}
                    {selectedProject.specifications && (
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Project Type</div>
                            <div className="font-semibold">{selectedProject.specifications.type}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Floors</div>
                            <div className="font-semibold">{selectedProject.specifications.floors}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Units</div>
                            <div className="font-semibold">{selectedProject.specifications.units}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Parking</div>
                            <div className="font-semibold">{selectedProject.specifications.parking}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={closeProjectDetails}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    Close
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download Brochure
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;