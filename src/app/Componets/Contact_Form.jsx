"use client"

import React, { useState } from 'react'
import { Playfair_Display } from 'next/font/google'
import axios from 'axios'
import { toast } from "react-hot-toast";

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'], // adjust as needed
    style: ['normal', 'italic'], // if you need italic
})

const Contact_Form = () => {
    const options = ['Photography', 'Films', 'Both Photography and Films']
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        guestCount: "",
        eventDetails: "",
        location: "",
        eventDate: "",
        services: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };
    const handleCheckbox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({ ...formData, services: [...formData.services, value], });
        } else {
            setFormData({ ...formData, services: formData.services.filter((item) => item !== value) })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Contact Form Submitted: ", formData);

        try {
            const response = await axios.post("/api/contactform", formData);
            console.log("Response:", response.data);
            toast.success("Form submitted successfully!");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit form. Check backend connection.");
        }
    };


    return (
        <div className="flex justify-center md:px-2 lg:px-8 py-10">
            <div className="bg-white rounded-3xl w-full max-w-5xl md:max-w-4xl text-black shadow-lg">
                <form className="py-10 px-5 md:px-10 md:py-15 font-serif  sm:text-md" onSubmit={handleSubmit}>
                    {/* Name */}
                    <label className="block mb-1">Name <span className="text-xs font-light text-gray-600">(required)</span></label>
                    <input type="text" name="name" id="name" required onChange={handleChange} value={formData.name}
                        className="border border-gray-400 w-full h-12 bg-gray-100  px-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black" />

                    {/* Email */}
                    <label className="block mb-1">Email <span className="text-xs font-light text-gray-600">(required)</span></label>
                    <input type="email" name="email" id="email" required onChange={handleChange} value={formData.email}
                        className="border border-gray-400 w-full h-12 bg-gray-100  px-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black" />

                    {/* Phone */}
                    <label className="block mb-1">Phone <span className="text-xs font-light text-gray-600">(required)</span></label>
                    <input type="number" name="phone" id="phone" required onChange={handleChange} value={formData.phone}
                        className="border border-gray-400 w-full h-12 bg-gray-100  px-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black" />

                    {/* Guest Count */}
                    <label className="block mb-1">Estimated Guest Count{" "}<span className="text-xs font-light text-gray-600">(required)</span></label>
                    <input type="text" name="guestCount" id="guestCount" required onChange={handleChange} value={formData.guestCount}
                        className="border border-gray-400 w-full h-12 bg-gray-100  px-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black" />

                    {/* Event Details */}
                    <label className="block mb-1">Tell us more about your wedding - event flow, venues.{" "} <span className="text-xs font-light text-gray-600">(required)</span></label>
                    <textarea name="eventDetails" id="eventDetails" required onChange={handleChange} value={formData.eventDetails}
                        className="border border-gray-400 w-full bg-gray-100 h-25 px-3 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-black"></textarea>

                    {/* Location */}
                    <label className="block mb-1">Location of the wedding{" "}<span className="text-xs font-light text-gray-600">(required)</span></label>
                    <input type="text" name="location" id="location" required onChange={handleChange} value={formData.location}
                        className="border border-gray-400 w-full h-12 bg-gray-100 px-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black" />

                    {/* Event Dates */}
                    <label className="block text-md mb-1">Event Dates{" "}<span className="text-xs font-light text-gray-600">(required)</span></label>
                    <input type="date" name="eventDate" id="dates" required onChange={handleChange} value={formData.eventDate}
                        className="border border-gray-400 w-full h-12 bg-gray-100 px-3 mb-5 focus:outline-none focus:ring-2 focus:ring-black" />

                    {/* Services */}
                    <p className="font-medium py-2">What services are you looking for?</p>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-6">
                        {options.map((option, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="options"
                                    value={option}
                                    checked={formData.services.includes(option)}
                                    onChange={handleCheckbox}
                                    className="accent-[#000000] w-4 h-4"
                                />
                                <span className="text-sm">{option}</span>
                            </label>
                        ))}
                    </div>

                    {/* Submit */}
                    <button type="submit" className="w-full sm:w-auto bg-[#af6300] text-white px-6 py-3 rounded-md text-sm  hover:bg-[#8e5100] transition duration-200">
                        Submit
                    </button>
                </form>
            </div>
        </div>

    )
}

export default Contact_Form