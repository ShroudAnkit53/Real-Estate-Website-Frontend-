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
    features: [],
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
  });

  const [userEstates, setUserEstates] = useState([]);

  // ✅ MOVE FILTER LOGIC HERE (BEFORE useEffect)
  const allProjects = [...projectsData, ...userEstates];

  const availableFeatures = Array.from(
    new Set(allProjects.flatMap((p) => p.features || []))
  );

  const filteredProjects = allProjects.filter((project) => {
    const price = Number(String(project.price || "").replace(/[^0-9]/g, ""));

    if (filters.status && project.status !== filters.status) return false;

    if (
      filters.location &&
      !String(project.location || "")
        .toLowerCase()
        .includes(filters.location.toLowerCase())
    )
      return false;

    if (filters.minPrice && price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && price > Number(filters.maxPrice)) return false;

    if (
      filters.features.length &&
      !filters.features.every((f) => (project.features || []).includes(f))
    )
      return false;

    return true;
  });

  // RESPONSIVE CARDS
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

  // AUTO SLIDE (NOW SAFE)
  useEffect(() => {
    if (!isViewAll && cardsToShow === 1 && !selectedProject) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          filteredProjects.length
            ? (prevIndex + 1) % filteredProjects.length
            : 0
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isViewAll, cardsToShow, filteredProjects.length, selectedProject]);

  const handleViewAll = () => {
    setIsViewAll(true);
    setCardsToShow(projectsData.length);
    setCurrentIndex(0);
  };
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      filteredProjects.length
        ? (prev - 1 + filteredProjects.length) % filteredProjects.length
        : 0
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      filteredProjects.length ? (prev + 1) % filteredProjects.length : 0
    );
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    document.body.style.overflow = "auto"; // Restore scrolling
  };
  const handleAddEstate = () => {
    if (
      !newEstate.title ||
      !newEstate.price ||
      !newEstate.location ||
      !newEstate.description ||
      !newEstate.photo
    ) {
      alert("Please fill all required fields and upload a photo.");
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
      features: newEstate.features.filter((f) => f.trim() !== ""),
      timeline: {
        duration: newEstate.timeline.duration,
        area: newEstate.timeline.area,
        completionDate: newEstate.timeline.completionDate,
        teamSize: newEstate.timeline.teamSize,
      },
      isUserListed: true,
    };

    setUserEstates((prev) => [...prev, estateCard]);

    setShowAddEstate(false);

    // reset form
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
    });
  };
  const handleDeleteEstate = (id) => {
    setUserEstates((prev) => prev.filter((e) => e.id !== id));
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
      {/* Centered Header */}
      <div className="text-center mb-12 relative">
        {/* Centered Title and Description */}
        <h1 className="text-2xl sm:text-4xl font-bold mb-3">
          Projects{" "}
          <span className="underline underline-offset-4 decoration-1 font-light">
            Completed
          </span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Crafting Spaces, Building Legacies - Explore Our Portfolio
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setShowFilter(true)}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg bg-white hover:bg-gray-100 transition"
          >
            Filter
          </button>

          <button
            onClick={() => setShowAddEstate(true)}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Add Your Estate
          </button>
        </div>

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
      {showAddEstate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl w-[500px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Your Estate</h2>

            {/* Title */}
            <input
              type="text"
              placeholder="Property Title"
              className="w-full border p-2 rounded mb-3"
              value={newEstate.title}
              onChange={(e) =>
                setNewEstate({ ...newEstate, title: e.target.value })
              }
            />

            {/* Price */}
            <input
              type="number"
              placeholder="Price (₹)"
              className="w-full border p-2 rounded mb-3"
              value={newEstate.price}
              onChange={(e) =>
                setNewEstate({ ...newEstate, price: e.target.value })
              }
            />

            {/* Location */}
            <input
              type="text"
              placeholder="Location"
              className="w-full border p-2 rounded mb-3"
              value={newEstate.location}
              onChange={(e) =>
                setNewEstate({ ...newEstate, location: e.target.value })
              }
            />

            {/* Status */}
            <select
              className="w-full border p-2 rounded mb-3"
              value={newEstate.status}
              onChange={(e) =>
                setNewEstate({ ...newEstate, status: e.target.value })
              }
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Upcoming">Upcoming</option>
            </select>

            {/* Description */}
            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded mb-3"
              rows="3"
              value={newEstate.description}
              onChange={(e) =>
                setNewEstate({ ...newEstate, description: e.target.value })
              }
            />

            {/* FEATURES */}
            <label className="font-semibold">Features</label>

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
              className="text-blue-600 text-sm mb-3"
              onClick={() =>
                setNewEstate({
                  ...newEstate,
                  features: [...newEstate.features, ""],
                })
              }
            >
              + Add Feature
            </button>

            {/* TIMELINE */}
            <h3 className="font-semibold mt-4 mb-2">Timeline</h3>

            <input
              type="number"
              placeholder="Duration (e.g., 14 Months)"
              className="w-full border p-2 rounded mb-2"
              value={newEstate.timeline.duration}
              onChange={(e) =>
                setNewEstate({
                  ...newEstate,
                  timeline: { ...newEstate.timeline, duration: e.target.value },
                })
              }
            />

            <input
              type="number"
              placeholder="Area (e.g., 4200 Sq. Ft.)"
              className="w-full border p-2 rounded mb-2"
              value={newEstate.timeline.area}
              onChange={(e) =>
                setNewEstate({
                  ...newEstate,
                  timeline: { ...newEstate.timeline, area: e.target.value },
                })
              }
            />

            <input
              type="date"
              placeholder="Completion Date"
              className="w-full border p-2 rounded mb-2"
              value={newEstate.timeline.completionDate}
              onChange={(e) =>
                setNewEstate({
                  ...newEstate,
                  timeline: {
                    ...newEstate.timeline,
                    completionDate: e.target.value,
                  },
                })
              }
            />

            <input
              type="number"
              placeholder="Team Size"
              className="w-full border p-2 rounded mb-3"
              value={newEstate.timeline.teamSize}
              onChange={(e) =>
                setNewEstate({
                  ...newEstate,
                  timeline: {
                    ...newEstate.timeline,
                    teamSize: e.target.value,
                  },
                })
              }
            />

            {/* IMAGE */}
            <input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={(e) =>
                setNewEstate({ ...newEstate, photo: e.target.files[0] })
              }
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddEstate(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddEstate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl w-[500px] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Filter Projects</h2>

            {/* STATUS */}
            <select
              className="w-full border p-2 rounded mb-3"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Upcoming">Upcoming</option>
            </select>

            {/* LOCATION */}
            <input
              type="text"
              placeholder="Location"
              className="w-full border p-2 rounded mb-3"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />

            {/* PRICE RANGE */}
            <div className="flex gap-3 mb-3">
              <input
                type="number"
                placeholder="Min ₹"
                className="w-full border p-2 rounded"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Max ₹"
                className="w-full border p-2 rounded"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
              />
            </div>

            {/* FEATURES */}
            <label className="font-semibold mb-2 block">Features</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {availableFeatures.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-2">
                  No features available to filter.
                </p>
              ) : (
                availableFeatures.map((feature, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.features.includes(feature)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          features: prev.features.includes(feature)
                            ? prev.features.filter((f) => f !== feature)
                            : [...prev.features, feature],
                        }))
                      }
                    />
                    {feature}
                  </label>
                ))
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setFilters({
                    status: "",
                    location: "",
                    minPrice: "",
                    maxPrice: "",
                    features: [],
                  })
                }
                className="px-4 py-2 border rounded"
              >
                Clear
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project display container */}
      <div className="overflow-hidden relative">
        {/* LEFT / RIGHT ARROWS (only in slider mode) */}
        {!isViewAll && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
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
              <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Project image */}
                {project.isUserListed && (
                  <button
                    onClick={() => handleDeleteEstate(project.id)}
                    className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition"
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

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Status badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-blue-600">
                      {project.status || "Completed"}
                    </span>
                  </div>
                </div>

                {/* Project info */}
                <div className="bg-white p-5">
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

                {/* Decorative bottom border on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots indicator (only in slider mode) */}
        {!isViewAll && cardsToShow === 1 && (
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
                        Interactive map showing the project location. You can
                        zoom and pan to explore the area.
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div>
                    {/* Project Status & Price */}
                    <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                      <div className="flex items-center">
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
                        {selectedProject.description}
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
                        {selectedProject.features &&
                          selectedProject.features.map((feature, index) => (
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
                        {selectedProject.timeline && (
                          <>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {selectedProject.timeline.duration}
                              </div>
                              <div className="text-sm text-gray-500">
                                Duration
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {selectedProject.timeline.area}
                              </div>
                              <div className="text-sm text-gray-500">Area</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {selectedProject.timeline.completed ||
                                  selectedProject.timeline.completionDate ||
                                  selectedProject.timeline.startDate}
                              </div>
                              <div className="text-sm text-gray-500">
                                {selectedProject.timeline.completed
                                  ? "Completed"
                                  : selectedProject.timeline.completionDate
                                  ? "Completion"
                                  : "Start Date"}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {selectedProject.timeline.teamSize}
                              </div>
                              <div className="text-sm text-gray-500">
                                Team Size
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Specifications */}
                    {selectedProject.specifications && (
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                          Specifications
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">
                              Project Type
                            </div>
                            <div className="font-semibold">
                              {selectedProject.specifications.type}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Floors</div>
                            <div className="font-semibold">
                              {selectedProject.specifications.floors}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Units</div>
                            <div className="font-semibold">
                              {selectedProject.specifications.units}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Parking</div>
                            <div className="font-semibold">
                              {selectedProject.specifications.parking}
                            </div>
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
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 cursor-pointer"
                  >
                    Close
                  </button>

                  {/* RIGHT SIDE BUTTONS */}
                  <div className="flex items-center gap-3">
                    {/* ✅ PAYMENT BUTTON (ADDED) */}
                    <button
                      onClick={() => setShowPayment(true)}
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                    >
                      Payment
                    </button>

                    {/* EXISTING DOWNLOAD BUTTON */}
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

        {showPayment && selectedProject && (
          <>
            {/* Payment Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayment(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            {/* Payment Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[61]"
            >
              <div className="bg-white rounded-xl w-[360px] p-6 shadow-2xl">
                {/* Header */}
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
                  const interestRate = 0.08 / 12; // 8% annual
                  const months = selectedTenure * 12;

                  const emi =
                    (loanAmount *
                      interestRate *
                      Math.pow(1 + interestRate, months)) /
                    (Math.pow(1 + interestRate, months) - 1);

                  return (
                    <>
                      {/* Price Info */}
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

                      {/* EMI Tenure */}
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

                      {/* EMI Amount */}
                      <div className="bg-gray-50 p-3 rounded-lg text-center mb-4">
                        <p className="text-sm text-gray-600">Monthly EMI</p>
                        <p className="text-xl font-bold text-blue-600">
                          ₹{Math.round(emi).toLocaleString()}
                        </p>
                      </div>

                      {/* Pay Button */}
                      <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
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
