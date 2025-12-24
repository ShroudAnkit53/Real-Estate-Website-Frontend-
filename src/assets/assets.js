import logo from './logo.svg'
import logo_dark from './logo_dark.svg'
import cross_icon from './cross_icon.svg'
import menu_icon from './menu_icon.svg'
import star_icon from './star_icon.svg'
import left_arrow from './left_arrow.svg'
import right_arrow from './right_arrow.svg'
import header_img from './header_img.png'
import brand_img from './brand_img.png'
import project_img_1 from './project_img_1.jpg'
import project_img_2 from './project_img_2.jpg'
import project_img_3 from './project_img_3.jpg'
import project_img_4 from './project_img_4.jpg'
import project_img_5 from './project_img_5.jpg'
import project_img_6 from './project_img_6.jpg'
import profile_img_1 from './profile_img_1.png'
import profile_img_2 from './profile_img_2.png'
import profile_img_3 from './profile_img_3.png'

export const assets = {
    logo,
    logo_dark,
    cross_icon,
    menu_icon,
    star_icon,
    header_img,
    brand_img,
    project_img_1,
    project_img_2,
    project_img_3,
    project_img_4,
    left_arrow,
    right_arrow,
}

export const projectsData = [
    {
        title: "Skyline Haven",
        price: "₹12,50,000",
        location: "Mumbai, India",
        image: project_img_1,
        status: "Completed",
        description: "Skyline Haven is a luxurious residential complex offering breathtaking views of the California coastline. This project features state-of-the-art amenities including a rooftop infinity pool, smart home automation, and sustainable energy solutions.",
        features: [
            "Modern Architecture",
            "Sustainable Materials",
            "Smart Home Integration",
            "Landscaped Gardens",
            "Energy Efficient",
            "Premium Finishes",
            "Rooftop Infinity Pool",
            "24/7 Security"
        ],
        timeline: {
            duration: "12 Months",
            area: "5,000 Sq. Ft.",
            completed: "2023",
            teamSize: "50+ Members"
        },
        specifications: {
            type: "Residential Complex",
            floors: "15",
            units: "40",
            parking: "Underground Parking"
        }
    },
    {
        title: "Vista Verde",
        price: "₹13,20,000",
        location: "Delhi, India",
        image: project_img_2,
        status: "In Progress",
        description: "Vista Verde is an eco-friendly residential project in the heart of San Francisco, designed with sustainability at its core. Featuring green roofs, rainwater harvesting, and solar panel integration.",
        features: [
            "Eco-Friendly Design",
            "Green Roof System",
            "Rainwater Harvesting",
            "Solar Panel Integration",
            "Natural Ventilation",
            "Recycled Materials",
            "Community Garden",
            "EV Charging Stations"
        ],
        timeline: {
            duration: "14 Months",
            area: "4,200 Sq. Ft.",
            completionDate: "Q4 2024",
            teamSize: "40+ Members"
        },
        specifications: {
            type: "Eco-Residential",
            floors: "8",
            units: "24",
            parking: "Electric Vehicle Charging"
        }
    },
    {
        title: "Serenity Suites",
        price: "₹11,50,000",
        location: "Bhubaneswar, India",
        image: project_img_3,
        status: "Completed",
        description: "A premium commercial and residential mixed-use development in downtown Chicago. Features luxury apartments, retail spaces, and corporate offices with cutting-edge amenities.",
        features: [
            "Mixed-Use Development",
            "Luxury Apartments",
            "Retail Spaces",
            "Corporate Offices",
            "Fitness Center",
            "Conference Facilities",
            "Underground Parking",
            "High-Speed Connectivity"
        ],
        timeline: {
            duration: "18 Months",
            area: "8,500 Sq. Ft.",
            completed: "2022",
            teamSize: "75+ Members"
        },
        specifications: {
            type: "Mixed-Use Development",
            floors: "22",
            units: "Commercial + Residential",
            parking: "Multi-level Underground"
        }
    },
    {
        title: "Central Square",
        price: "₹14,50,000",
        location: "Chennai, India",
        image: project_img_4,
        status: "Planned",
        description: "Central Square is a revolutionary urban development project that combines living, working, and leisure spaces in a single integrated community.",
        features: [
            "Integrated Community",
            "Co-Working Spaces",
            "Shopping Complex",
            "Entertainment Zone",
            "Sports Facilities",
            "Healthcare Center",
            "Educational Spaces",
            "Public Transport Hub"
        ],
        timeline: {
            duration: "24 Months",
            area: "12,000 Sq. Ft.",
            startDate: "Q1 2024",
            teamSize: "100+ Members"
        },
        specifications: {
            type: "Urban Development",
            floors: "25",
            units: "Mixed Use",
            parking: "Smart Parking System"
        }
    },
    {
        title: "Oceanfront Oasis",
        price: "₹12,90,000",
        location: "Bangalore, India",
        image: project_img_5,
        status: "Completed",
        description: "Luxury beachfront condominiums with direct ocean access, private beach, and world-class amenities for the ultimate coastal living experience.",
        features: [
            "Beachfront Location",
            "Private Beach Access",
            "Ocean View Apartments",
            "Marina Facilities",
            "Spa & Wellness Center",
            "Fine Dining Restaurant",
            "Yacht Club Membership",
            "Concierge Service"
        ],
        timeline: {
            duration: "20 Months",
            area: "6,800 Sq. Ft.",
            completed: "2023",
            teamSize: "60+ Members"
        },
        specifications: {
            type: "Beachfront Condominiums",
            floors: "18",
            units: "35",
            parking: "Valet Parking"
        }
    },
    {
        title: "Mountain Retreat",
        price: "₹11,95,000",
        location: "Pune, India",
        image: project_img_6,
        status: "In Progress",
        description: "Sustainable mountain retreat designed for nature lovers, featuring eco-friendly construction, panoramic mountain views, and adventure facilities.",
        features: [
            "Mountain Views",
            "Eco-Friendly Construction",
            "Adventure Facilities",
            "Fireplace Lounges",
            "Hot Springs",
            "Hiking Trails",
            "Wildlife Observation",
            "Sustainable Energy"
        ],
        timeline: {
            duration: "16 Months",
            area: "3,500 Sq. Ft.",
            completionDate: "Q3 2024",
            teamSize: "35+ Members"
        },
        specifications: {
            type: "Mountain Resort",
            floors: "4",
            units: "15 Villas",
            parking: "Open Parking"
        }
    }
];

export const testimonialsData = [
    {
        name: "Donald Jackman",
        title: "Marketing Manager",
        image: profile_img_1,
        alt: "Portrait of Donald Jackman",
        rating: 5,
        text: "From the very first meeting, they understood my vision and helped me find the perfect property. Their attention to detail and commitment to client satisfaction is unmatched."
    },
    {
        name: "Richard Nelson",
        title: "UI/UX Designer",
        image: profile_img_2,
        alt: "Portrait of Richard Nelson",
        rating: 4,
        text: "From the very first meeting, they understood my vision and helped me find the perfect property. Their attention to detail and commitment to client satisfaction is unmatched."
    },
    {
        name: "James Washington",
        title: "Co-Founder",
        image: profile_img_3,
        alt: "Portrait of James Washington",
        rating: 5,
        text: "From the very first meeting, they understood my vision and helped me find the perfect property. Their attention to detail and commitment to client satisfaction is unmatched."
    }
];