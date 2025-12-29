import React, { useEffect, useState } from "react";
import { assets, projectsData } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const [isViewAll, setIsViewAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTenure, setSelectedTenure] = useState(10);
  
  // FILTER STATE
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    bedrooms: "",
    transactionType: ""
  });

  // ADD ESTATE STATE
  const [showAddEstate, setShowAddEstate] = useState(false);
  const [newEstate, setNewEstate] = useState({
    title: "",
    price: "",
    location: "",
    status: "Listed",
    description: "",
    features: [""],
    timeline: {
      duration: "",
      area: "",
      completionDate: "",
      teamSize: "",
    },
    photo: null,
    propertyType: "Residential",
    bedrooms: "2",
    transactionType: "Sale"
  });

  const [userEstates, setUserEstates] = useState([]);
  
  // Book Schedule Feature
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: ""
  });
  
  // Notification State
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // Get unique values for filter dropdowns
  const allProjects = [...projectsData, ...userEstates];
  
  const uniqueLocations = [...new Set(allProjects.map(p => p.location))];
  const uniqueStatuses = ["Completed", "In Progress", "Upcoming"];
  const propertyTypes = ["Residential", "Commercial", "Industrial", "Mixed Use"];
  const bedroomsOptions = ["1", "2", "3", "4", "5+"];
  const transactionTypes = ["Sale", "Rent", "Lease"];

  // Filter projects based on selected filters
  const filteredProjects = allProjects.filter(project => {
    // Status filter
    if (filters.status && project.status !== filters.status) return false;
    
    // Location filter
    if (filters.location && !project.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    
    // Price range filter
    const priceNumber = parseFloat(project.price.replace(/[^0-9.-]+/g, ""));
    if (filters.minPrice && priceNumber < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && priceNumber > parseFloat(filters.maxPrice)) return false;
    
    // Property type filter
    if (filters.propertyType && project.propertyType !== filters.propertyType) return false;
    
    // Bedrooms filter
    if (filters.bedrooms && project.bedrooms !== filters.bedrooms) return false;
    
    // Transaction type filter
    if (filters.transactionType && project.transactionType !== filters.transactionType) return false;
    
    return true;
  });

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => value !== "").length;

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(projectsData.length);
      } else {
        setCardsToShow(1);
      }
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);

    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  // Auto slide when not in "View All" mode
  useEffect(() => {
    if (!isViewAll && cardsToShow === 1 && !selectedProject) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProjects.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isViewAll, cardsToShow, filteredProjects.length, selectedProject]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleViewAll = () => {
    setIsViewAll(true);
    setCardsToShow(projectsData.length);
    setCurrentIndex(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + filteredProjects.length) % filteredProjects.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % filteredProjects.length
    );
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    setShowSchedule(false);
    setShowPayment(false);
    document.body.style.overflow = "auto";
  };

  const handleAddEstate = () => {
    if (
      !newEstate.title ||
      !newEstate.price ||
      !newEstate.location ||
      !newEstate.description ||
      !newEstate.photo
    ) {
      showNotification("Please fill all required fields and upload a photo.", "error");
      return;
    }

    const photoURL = URL.createObjectURL(newEstate.photo);
    const basePrice = Number(newEstate.price);
    const finalPrice = basePrice + basePrice * 0.15;
    
    const estateCard = {
      id: Date.now(),
      title: newEstate.title,
      basePrice,
      price: `₹${Number(newEstate.price).toLocaleString()}`,
      location: newEstate.location,
      image: photoURL,
      status: newEstate.status,
      description: newEstate.description,
      features: newEstate.features.filter(f => f.trim() !== ""),
      timeline: {
        duration: newEstate.timeline.duration,
        area: newEstate.timeline.area,
        completionDate: newEstate.timeline.completionDate,
        teamSize: newEstate.timeline.teamSize,
      },
      propertyType: newEstate.propertyType,
      bedrooms: newEstate.bedrooms,
      transactionType: newEstate.transactionType,
      isUserListed: true
    };

    setUserEstates(prev => [...prev, estateCard]);
    setShowAddEstate(false);
    
    showNotification("Your estate has been listed successfully!", "success");

    // Reset form
    setNewEstate({
      title: "",
      price: "",
      location: "",
      status: "Listed",
      description: "",
      features: [""],
      timeline: {
        duration: "",
        area: "",
        completionDate: "",
        teamSize: "",
      },
      photo: null,
      propertyType: "Residential",
      bedrooms: "2",
      transactionType: "Sale"
    });
  };

  const handleDeleteEstate = (id) => {
    setUserEstates(prev => prev.filter(e => e.id !== id));
    showNotification("Estate has been removed successfully!", "info");
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    
    if (!scheduleData.name || !scheduleData.email || !scheduleData.phone || !scheduleData.date || !scheduleData.time) {
      showNotification("Please fill all required fields.", "error");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Schedule Booking:", {
      project: selectedProject?.title,
      ...scheduleData
    });

    // Show success notification
    showNotification(
      `Schedule booked successfully! Our team will contact you at ${scheduleData.phone} to confirm.`,
      "success"
    );

    // Reset form and close modal
    setScheduleData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      notes: ""
    });
    setShowSchedule(false);
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      bedrooms: "",
      transactionType: ""
    });
  };

  // Helper function to get features array with fallback
  const getFeatures = (project) => {
    if (project.features && Array.isArray(project.features)) {
      return project.features;
    }
    // Fallback features if none provided
    return [
      'Modern Architecture',
      'Sustainable Materials',
      'Smart Home Integration',
      'Landscaped Gardens',
      'Energy Efficient',
      'Premium Finishes'
    ];
  };

  // Helper function to get timeline object with fallback
  const getTimeline = (project) => {
    if (project.timeline) {
      return project.timeline;
    }
    // Fallback timeline
    return {
      duration: "12 Months",
      area: "5,000 Sq. Ft.",
      completed: "2023",
      teamSize: "50+ Members"
    };
  };

  // Helper function to get description with fallback
  const getDescription = (project) => {
    if (project.description) {
      return project.description;
    }
    return `This ${project.title} project showcases exceptional craftsmanship and attention to detail. Located in ${project.location}, this project represents our commitment to quality and innovation in construction and design.`;
  };

  // Helper function to get specifications with fallback
  const getSpecifications = (project) => {
    if (project.specifications) {
      return project.specifications;
    }
    // Fallback specifications
    return {
      type: "Residential Project",
      floors: "Not specified",
      units: "Not specified",
      parking: "Available"
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -200 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="container mx-auto py-4 pt-20 px-6 md:px-20 lg:px-32 my-20 w-full overflow-hidden"
      id="Projects"
    >
      {/* Notification Popup - Fixed at top */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className={`fixed top-0 left-0 right-0 z-[100] rounded-b-lg shadow-xl p-4 text-white ${
              notification.type === "success" ? "bg-green-500" :
              notification.type === "error" ? "bg-red-500" :
              "bg-blue-500"
            }`}
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {notification.type === "success" ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : notification.type === "error" ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium">{notification.message}</p>
                </div>
              </div>
              <button
                onClick={() => setNotification({ show: false, message: "", type: "success" })}
                className="ml-4 flex-shrink-0 text-white/80 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Filter and Add Estate Buttons */}
      <div className="mb-12 relative">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          {/* Left - Filter and Add Estate Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilter(true)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg bg-white hover:bg-gray-100 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowAddEstate(true)}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Your Estate
            </button>
          </div>

          {/* Center - Title */}
          <h1 className="text-2xl sm:text-4xl font-bold text-center">
            Properties{" "}
            <span className="underline underline-offset-4 decoration-1 font-light">
              For You
            </span>
          </h1>

          {/* Right - View All Button (desktop only) */}
          {!isViewAll && (
            <div className="hidden sm:block">
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6"
                  ></path>
                </svg>
              </motion.button>
            </div>
          )}
        </div>

        <p className="text-gray-500 max-w-xl mx-auto mb-8 text-center">
          Find Your Dream Property - Browse Our Portfolio
        </p>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-700">Active Filters:</span>
              {filters.status && (
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-medium">Status:</span> {filters.status}
                </span>
              )}
              {filters.location && (
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-medium">Location:</span> {filters.location}
                </span>
              )}
              {filters.propertyType && (
                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-medium">Type:</span> {filters.propertyType}
                </span>
              )}
              {filters.bedrooms && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-medium">Bedrooms:</span> {filters.bedrooms}
                </span>
              )}
              {filters.transactionType && (
                <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-medium">Transaction:</span> {filters.transactionType}
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-medium">Price:</span> 
                  {filters.minPrice && ` ₹${filters.minPrice}`}
                  {filters.minPrice && filters.maxPrice && " - "}
                  {filters.maxPrice && ` ₹${filters.maxPrice}`}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Mobile View All Button */}
      {!isViewAll && (
        <div className="flex justify-center mb-8 sm:hidden">
          <motion.button
            onClick={handleViewAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            <span>View All Projects</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6"
              ></path>
            </svg>
          </motion.button>
        </div>
      )}

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl w-[500px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Filter Properties</h2>
            
            <div className="space-y-5">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {uniqueStatuses.map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        status: prev.status === status ? "" : status
                      }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.status === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {transactionTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        transactionType: prev.transactionType === type ? "" : type
                      }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.transactionType === type
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        propertyType: prev.propertyType === type ? "" : type
                      }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.propertyType === type
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                  <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Price Range (₹)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Bedrooms</label>
                <div className="grid grid-cols-5 gap-2">
                  {bedroomsOptions.map(beds => (
                    <button
                      key={beds}
                      type="button"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        bedrooms: prev.bedrooms === beds ? "" : beds
                      }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.bedrooms === beds
                          ? "bg-yellow-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {beds}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Reset All
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilter(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowFilter(false);
                    showNotification("Filters applied successfully!", "success");
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Estate Modal */}
      {showAddEstate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl w-[500px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Your Estate</h2>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Property Title"
                className="w-full border p-2 rounded"
                value={newEstate.title}
                onChange={(e) => setNewEstate({ ...newEstate, title: e.target.value })}
              />
              
              <input
                type="number"
                placeholder="Price (₹)"
                className="w-full border p-2 rounded"
                value={newEstate.price}
                onChange={(e) => setNewEstate({ ...newEstate, price: e.target.value })}
              />
              
              <input
                type="text"
                placeholder="Location"
                className="w-full border p-2 rounded"
                value={newEstate.location}
                onChange={(e) => setNewEstate({ ...newEstate, location: e.target.value })}
              />
              
              <select
                className="w-full border p-2 rounded"
                value={newEstate.status}
                onChange={(e) => setNewEstate({ ...newEstate, status: e.target.value })}
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Upcoming">Upcoming</option>
              </select>
              
              <select
                className="w-full border p-2 rounded"
                value={newEstate.propertyType}
                onChange={(e) => setNewEstate({ ...newEstate, propertyType: e.target.value })}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed Use">Mixed Use</option>
              </select>
              
              <select
                className="w-full border p-2 rounded"
                value={newEstate.bedrooms}
                onChange={(e) => setNewEstate({ ...newEstate, bedrooms: e.target.value })}
              >
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5+">5+ Bedrooms</option>
              </select>
              
              <select
                className="w-full border p-2 rounded"
                value={newEstate.transactionType}
                onChange={(e) => setNewEstate({ ...newEstate, transactionType: e.target.value })}
              >
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
                <option value="Lease">For Lease</option>
              </select>
              
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                rows="3"
                value={newEstate.description}
                onChange={(e) => setNewEstate({ ...newEstate, description: e.target.value })}
              />
              
              <div>
                <label className="font-semibold block mb-2">Features</label>
                {newEstate.features.map((feature, i) => (
                  <input
                    key={i}
                    type="text"
                    className="w-full border p-2 rounded mb-2"
                    placeholder={`Feature ${i + 1}`}
                    value={feature}
                    onChange={(e) => {
                      const copy = [...newEstate.features];
                      copy[i] = e.target.value;
                      setNewEstate({ ...newEstate, features: copy });
                    }}
                  />
                ))}
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => setNewEstate({
                    ...newEstate,
                    features: [...newEstate.features, '']
                  })}
                >
                  + Add Feature
                </button>
              </div>
              
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded"
                onChange={(e) => setNewEstate({ ...newEstate, photo: e.target.files[0] })}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddEstate(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEstate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project display container */}
      <div className="overflow-hidden relative">
        {/* LEFT / RIGHT ARROWS (only in slider mode) */}
        {!isViewAll && filteredProjects.length > 0 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or adding a new property</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setShowAddEstate(true)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Add Property
              </button>
            </div>
          </div>
        )}

        <div
          className={`${
            isViewAll
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex gap-8 transition-transform duration-500 ease-in-out"
          }`}
          style={{
            transform: !isViewAll
              ? `translateX(-${(currentIndex * 100) / cardsToShow}%)`
              : "none",
          }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={isViewAll ? "" : "flex-shrink-0 w-full sm:w-1/4"}
            >
              <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                {/* Project image */}
                {project.isUserListed && (
                  <button
                    onClick={() => handleDeleteEstate(project.id)}
                    className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition z-10"
                  >
                    Delete
                  </button>
                )}

                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Property Type Badge */}
                  {project.propertyType && (
                    <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      {project.propertyType}
                    </div>
                  )}
                  
                  {/* Status badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className={`text-sm font-semibold ${
                      project.status === "Completed" ? "text-green-600" :
                      project.status === "In Progress" ? "text-yellow-600" :
                      "text-blue-600"
                    }`}>
                      {project.status || "Completed"}
                    </span>
                  </div>

                  {/* Transaction Type Badge */}
                  {project.transactionType && (
                    <div className="absolute bottom-4 left-4 bg-black/80 text-white text-xs px-3 py-1 rounded-full">
                      {project.transactionType === "Sale" && "💰 For Sale"}
                      {project.transactionType === "Rent" && "🏠 For Rent"}
                      {project.transactionType === "Lease" && "📜 For Lease"}
                    </div>
                  )}
                </div>

                {/* Project info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-sm">{project.location}</span>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {project.bedrooms && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {project.bedrooms} Beds
                      </span>
                    )}
                    {project.timeline?.area && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        {project.timeline.area}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {project.price}
                      </p>
                      {project.isUserListed && (
                        <p className="text-xs text-gray-500">
                          Includes 15% platform commission
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => openProjectDetails(project)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300 group"
                    >
                      Details
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots indicator */}
        {!isViewAll && cardsToShow === 1 && filteredProjects.length > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {filteredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Back to Slider Button */}
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                ></path>
              </svg>
              <span>Back to Slider</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* PROJECT DETAILS MODAL - FULL CODE RESTORED */}
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
              className="fixed inset-2 md:inset-10 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center mt-2">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-gray-600">
                      {selectedProject.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeProjectDetails}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
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
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Project Location
                      </h3>
                      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                        {/* Interactive Map - Using Google Maps iframe */}
                        <div className="h-64 w-full bg-gray-100 relative">
                          <iframe
                            title={`Location map for ${selectedProject.title}`}
                            className="absolute inset-0 w-full h-full"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(
                              selectedProject.location
                            )}&output=embed&z=14`}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-2 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              <span className="text-sm font-medium">
                                {selectedProject.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        Interactive map showing the project location.
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div>
                    {/* Project Status & Price */}
                    <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                      <div className="flex items-center gap-4">
                        <div
                          className={`px-4 py-2 rounded-full ${
                            selectedProject.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : selectedProject.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <span className="font-semibold">
                            {selectedProject.status || "Completed"}
                          </span>
                        </div>
                        {selectedProject.propertyType && (
                          <div className="px-4 py-2 rounded-full bg-purple-100 text-purple-800">
                            <span className="font-semibold">
                              {selectedProject.propertyType}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Project Value</p>
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">
                          {selectedProject.price}
                        </p>
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        Project Overview
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {getDescription(selectedProject)}
                      </p>
                    </div>

                    {/* Features/Specifications */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {getFeatures(selectedProject).map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <svg
                              className="w-4 h-4 mr-3 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline/Stats */}
                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Project Details
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(() => {
                          const timeline = getTimeline(selectedProject);
                          return (
                            <>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {timeline.duration}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Duration
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {timeline.area}
                                </div>
                                <div className="text-sm text-gray-500">Area</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {timeline.completed || timeline.completionDate || timeline.startDate || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {timeline.completed ? 'Completed' : 
                                   timeline.completionDate ? 'Completion' : 
                                   timeline.startDate ? 'Start Date' : 'Date'}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {timeline.teamSize}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Team Size
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Specifications</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {(() => {
                          const specs = getSpecifications(selectedProject);
                          return (
                            <>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500">Project Type</div>
                                <div className="font-semibold">{specs.type}</div>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500">Floors</div>
                                <div className="font-semibold">{specs.floors}</div>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500">Units</div>
                                <div className="font-semibold">{specs.units}</div>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-500">Parking</div>
                                <div className="font-semibold">{specs.parking}</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={closeProjectDetails}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 cursor-pointer"
                  >
                    Close
                  </button>

                  {/* RIGHT SIDE BUTTONS */}
                  <div className="flex items-center gap-3">
                    {/* BOOK SCHEDULE BUTTON */}
                    <button
                      onClick={() => setShowSchedule(true)}
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Book a Schedule
                    </button>

                    {/* PAYMENT BUTTON */}
                    <button
                      onClick={() => setShowPayment(true)}
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                    >
                      Payment
                    </button>

                    {/* DOWNLOAD BUTTON */}
                    <button className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Brochure
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Booking Modal */}
      <AnimatePresence>
        {showSchedule && selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSchedule(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[61]"
            >
              <div className="bg-white rounded-xl w-[400px] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Book Site Visit Schedule
                  </h3>
                  <button
                    onClick={() => setShowSchedule(false)}
                    className="text-gray-500 hover:text-red-600 transition"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Schedule a visit for <strong>{selectedProject.title}</strong>
                </p>

                <form onSubmit={handleScheduleSubmit}>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={scheduleData.name}
                      onChange={(e) =>
                        setScheduleData({ ...scheduleData, name: e.target.value })
                      }
                      required
                    />

                    <input
                      type="email"
                      placeholder="Email Address *"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={scheduleData.email}
                      onChange={(e) =>
                        setScheduleData({ ...scheduleData, email: e.target.value })
                      }
                      required
                    />

                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={scheduleData.phone}
                      onChange={(e) =>
                        setScheduleData({ ...scheduleData, phone: e.target.value })
                      }
                      required
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={scheduleData.date}
                        onChange={(e) =>
                          setScheduleData({ ...scheduleData, date: e.target.value })
                        }
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />

                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={scheduleData.time}
                        onChange={(e) =>
                          setScheduleData({ ...scheduleData, time: e.target.value })
                        }
                        required
                      />
                    </div>

                    <textarea
                      placeholder="Additional Notes (optional)"
                      className="w-full p-2 border border-gray-300 rounded"
                      rows="3"
                      value={scheduleData.notes}
                      onChange={(e) =>
                        setScheduleData({ ...scheduleData, notes: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300"
                  >
                    Confirm Booking
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayment(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[61]"
            >
              <div className="bg-white rounded-xl w-[360px] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Payment Details
                  </h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-gray-500 hover:text-red-600 transition"
                  >
                    ✕
                  </button>
                </div>

                {(() => {
                  const price = Number(
                    selectedProject.price.replace(/[^0-9]/g, "")
                  );
                  const downPayment = price * 0.3;
                  const loanAmount = price - downPayment;
                  const interestRate = 0.08 / 12;
                  const months = selectedTenure * 12;

                  const emi =
                    (loanAmount *
                      interestRate *
                      Math.pow(1 + interestRate, months)) /
                    (Math.pow(1 + interestRate, months) - 1);

                  return (
                    <>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span>Total Price</span>
                          <span className="font-medium">
                            {selectedProject.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Down Payment (30%)</span>
                          <span className="font-medium">
                            ₹{downPayment.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loan Amount</span>
                          <span className="font-medium">
                            ₹{loanAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">
                          Choose EMI Tenure
                        </p>
                        <div className="flex gap-2">
                          {[10, 20, 30].map((year) => (
                            <button
                              key={year}
                              onClick={() => setSelectedTenure(year)}
                              className={`px-3 py-2 rounded-lg border text-sm ${
                                selectedTenure === year
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {year} Years
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg text-center mb-4">
                        <p className="text-sm text-gray-600">Monthly EMI</p>
                        <p className="text-xl font-bold text-blue-600">
                          ₹{Math.round(emi).toLocaleString()}
                        </p>
                      </div>

                      <button 
                        onClick={() => {
                          setShowPayment(false);
                          showNotification("Payment initiated successfully! Our team will contact you shortly.", "success");
                        }}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Proceed to Pay
                      </button>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;
