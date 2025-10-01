import React, { useState } from "react";
import API from "../api";

const CriminalForm = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    crimeCode: "",
    arrestDate: "",
    convictDate: "",
    address: "",
    state: "",
    lga: "",
    gender: "",
    age: "",
    complexion: "",
    height: "",
    weight: "",
    remarks: "",
    officerInCharge: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [thumbPreview, setThumbPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    if (type === "photo") {
      setPhotoPreview(url);
    } else {
      setThumbPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setLoading(true);
    setError(null);
    try {
      await fetch('/api/criminals', {
        method: 'POST',
        body: formData,
        // No need for Content-Type header; browser sets it automatically for FormData
      });
      alert("Criminal added successfully");
      onClose();
      // Reset form
      setForm({
        name: "",
        crimeCode: "",
        arrestDate: "",
        convictDate: "",
        address: "",
        state: "",
        lga: "",
        gender: "",
        age: "",
        complexion: "",
        height: "",
        weight: "",
        remarks: "",
        officerInCharge: "",
      });
      setPhotoPreview("");
      setThumbPreview("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add criminal");
    } finally {
      setLoading(false);
    }
  };

  // Form field configurations for better organization
  const formSections = [
    {
      title: "Personal Information",
      fields: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "age", label: "Age", type: "number", required: true },
        { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
        { name: "complexion", label: "Complexion", type: "text" }
      ]
    },
    {
      title: "Physical Description",
      fields: [
        { name: "height", label: "Height (cm)", type: "number" },
        { name: "weight", label: "Weight (kg)", type: "number" }
      ]
    },
    {
      title: "Address Information",
      fields: [
        { name: "address", label: "Street Address", type: "text", required: true },
        { name: "lga", label: "Local Government Area", type: "text", required: true },
        { name: "state", label: "State", type: "text", required: true }
      ]
    },
    {
      title: "Crime Details",
      fields: [
        { name: "crimeCode", label: "Crime Code", type: "text", required: true },
        { name: "arrestDate", label: "Arrest Date", type: "date", required: true },
        { name: "convictDate", label: "Conviction Date", type: "date" },
        { name: "officerInCharge", label: "Officer in Charge", type: "text", required: true },
        { name: "remarks", label: "Additional Remarks", type: "textarea" }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Register New Criminal</h2>
                <p className="text-blue-100">Enter criminal information and biometric data</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-220px)]">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Form Fields - Left 3 columns */}
              <div className="lg:col-span-3 space-y-8">
                {formSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field) => (
                        <div key={field.name} className={field.name === 'address' || field.name === 'remarks' ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                              disabled={loading}
                              required={field.required}
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              name={field.name}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                              disabled={loading}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              required={field.required}
                            />
                          ) : (
                            <input
                              name={field.name}
                              type={field.type}
                              value={form[field.name] || ""}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              disabled={loading}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Biometric Data - Right column */}
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Photo</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-white">
                      <input 
                        type="file" 
                        onChange={(e) => handleImage(e, "photo")} 
                        disabled={loading}
                        accept="image/*"
                        className="hidden"
                        id="photo-upload"
                        name="photo"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        {photoPreview ? (
                          <div className="space-y-3">
                            <img src={photoPreview} alt="Photo preview" className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-200" />
                            <p className="text-sm text-gray-600">Click to change photo</p>
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm font-medium">Click to upload photo</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Thumbprint Upload */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Thumbprint</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-white">
                      <input 
                        type="file" 
                        onChange={(e) => handleImage(e, "thumbprint")} 
                        disabled={loading}
                        accept="image/*"
                        className="hidden"
                        id="thumbprint-upload"
                        name="thumbprint"
                      />
                      <label htmlFor="thumbprint-upload" className="cursor-pointer">
                        {thumbPreview ? (
                          <div className="space-y-3">
                            <img src={thumbPreview} alt="Thumbprint preview" className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-200" />
                            <p className="text-sm text-gray-600">Click to change thumbprint</p>
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm font-medium">Click to upload thumbprint</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Criminal...</span>
                </div>
              ) : (
                'Add Criminal'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriminalForm;