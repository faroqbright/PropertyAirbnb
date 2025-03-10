"use client";

import {
  Bath,
  BedDouble,
  BicepsFlexed,
  Bolt,
  Cat,
  ChartArea,
  CircleParking,
  Dog,
  Dumbbell,
  Flower2,
  HeartHandshake,
  House,
  Settings,
  Shield,
  Trash2,
  WashingMachine,
  WavesLadder,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Properties = ({ propertyData: initialPropertyData }) => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);
  const [selectedRoomFiles, setSelectedRoomFiles] = useState([]);
  const [propertyData, setPropertyData] = useState({
    name: "",
    location: "",
    description: "",
    longitude: "",
    latitude: "",
    pricePerMonth: "",
    additionalCosts: [],
    amenities: [],
    rooms: [],
  });

  const [additionalCosts, setAdditionalCosts] = useState([]);
  const [formInput, setFormInput] = useState({ name: "", cost: "" });
  const [additionalRoomPrice, setAdditionalRoomPrice] = useState([]);
  const [roomInput, setRoomInput] = useState({ price: "" });
  const fileInputRef = useRef(null);
  const [clickedButtons, setClickedButtons] = useState([]);
  const userId = useSelector((state) => state?.auth?.userInfo?.uid);

  useEffect(() => {
    if (initialPropertyData) {
      setPropertyData({
        name: initialPropertyData.name || "",
        location: initialPropertyData.location || "",
        description: initialPropertyData.description || "",
        longitude: initialPropertyData.longitude || "",
        latitude: initialPropertyData.latitude || "",
        pricePerMonth: initialPropertyData.pricePerMonth || "",
        additionalCosts: initialPropertyData.additionalCosts || [],
        amenities: initialPropertyData.amenities || [],
        rooms: initialPropertyData.rooms || [],
      });

      setAdditionalCosts(initialPropertyData.additionalCosts || []);
      setAdditionalRoomPrice(initialPropertyData.rooms || []);

      if (initialPropertyData.amenities) {
        const selectedAmenities = initialPropertyData.amenities.map((amenity) =>
          namesArray.indexOf(amenity)
        );
        setClickedButtons(selectedAmenities);
      }

      if (initialPropertyData.imageUrls) {
        setSelectedImages(initialPropertyData.imageUrls);
        setSelectedFiles(
          initialPropertyData.imageUrls.map((url) => ({
            url,
            isFromFirebase: true,
          }))
        );
      }
    }
  }, [initialPropertyData]);

  const uploadImage = async (file) => {
    try {
      if (!file) {
        throw new Error("No image selected");
      }

      const storage = getStorage();
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `property_images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log(
              `Upload is ${
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              }% done`
            );
          },
          (error) => {
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      toast.error("Error uploading image: " + error.message);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      // Upload images and get their URLs
      const imageUrls = await Promise.all(
        selectedFiles.map((file) => uploadImage(file))
      );

      const updatedRooms = await Promise.all(
        additionalRoomPrice.map(async (room) => {
          const roomImageUrls = await Promise.all(
            room.images.map((file) => uploadImage(file))
          );
          return {
            ...room,
            images: roomImageUrls,
          };
        })
      );

      const dataToSave = {
        userId: userId,
        name: propertyData.name,
        location: propertyData.location,
        description: propertyData.description,
        longitude: propertyData.longitude,
        latitude: propertyData.latitude,
        pricePerMonth: propertyData.pricePerMonth,
        additionalCosts: additionalCosts,
        amenities: clickedButtons.map((index) => namesArray[index]),
        rooms: updatedRooms,
        imageUrls: imageUrls, // Ensure this is set correctly
        status: "Approved",
        active: 1,
      };

      if (initialPropertyData?.id) {
        const propertyRef = doc(db, "properties", initialPropertyData?.id);
        await updateDoc(propertyRef, dataToSave);
        toast.success("Property Updated Successfully");
      } else {
        const docRef = await addDoc(collection(db, "properties"), dataToSave);
        toast.success("Property Created Successfully");
      }

      router.push("/Landing/Home");
    } catch (e) {
      console.error("Error saving document: ", e);
      toast.error("Error saving document: " + e.message);
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (selectedFiles.length + files.length > 7) {
      toast.error("You can only upload up to 7 images.");
      return;
    }

    const newFiles = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setSelectedFiles(updatedFiles);
  };

  const handleImageChangeRoom = (event) => {
    const files = Array.from(event.target.files);

    if (selectedRoomFiles.length + files.length > 7) {
      toast.error("You can only upload up to 7 images.");
      return;
    }

    const newFiles = files.map((file) => URL.createObjectURL(file));
    setSelectedRoomImages((prev) => [...prev, ...newFiles]);
    setSelectedRoomFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveRoomImage = (index) => {
    const updatedImages = selectedRoomImages.filter((_, i) => i !== index);
    const updatedFiles = selectedRoomFiles.filter((_, i) => i !== index);
    setSelectedRoomImages(updatedImages);
    setSelectedRoomFiles(updatedFiles);
  };

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (formInput.name && formInput.cost) {
      setAdditionalCosts([...additionalCosts, formInput]);
      setFormInput({ name: "", cost: "" });
    } else {
      toast.error("Please fill all fields in the Additional Costs section.");
    }
  };

  const handleDelete = (index) => {
    const updatedCosts = additionalCosts.filter((_, i) => i !== index);
    setAdditionalCosts(updatedCosts);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRoomChange = (e) => {
    setRoomInput({ ...roomInput, [e.target.name]: e.target.value });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (roomInput.price && selectedRoomFiles.length >= 5) {
      setAdditionalRoomPrice([
        ...additionalRoomPrice,
        { ...roomInput, images: selectedRoomFiles },
      ]);
      setRoomInput({ price: "" });
      setSelectedRoomImages([]);
      setSelectedRoomFiles([]);
    } else {
      toast.error("Please fill all fields and upload at least 5 images.");
    }
  };

  const handleDeleteRoom = (index) => {
    const updatedRoom = additionalRoomPrice.filter((_, i) => i !== index);
    setAdditionalRoomPrice(updatedRoom);
  };

  const namesArray = [
    "Primary Services",
    "Swimming Pool",
    "Vigilance",
    "Maintenance",
    "House Keeping",
    "Parking",
    "Own Bathroom",
    "Roof Garden",
    "Cat Friendly",
    "Laundry",
    "Common Areas",
    "Gym",
    "Co Working",
    "Dog",
    "LGBT+coLivers",
    "Double Bed",
  ];

  const iconsArray = [
    <Settings size={18} />,
    <WavesLadder size={18} />,
    <Shield size={18} />,
    <Bolt size={18} />,
    <House size={18} />,
    <CircleParking size={18} />,
    <Bath size={18} />,
    <Flower2 size={18} />,
    <Cat size={18} />,
    <WashingMachine size={18} />,
    <ChartArea size={18} />,
    <Dumbbell size={18} />,
    <BicepsFlexed size={18} />,
    <Dog size={18} />,
    <HeartHandshake size={18} />,
    <BedDouble size={18} />,
  ];

  const handleButtonClick = (index) => {
    setClickedButtons((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const validateStep1 = () => {
    if (
      !propertyData.name ||
      !propertyData.location ||
      !propertyData.description ||
      !propertyData.longitude ||
      !propertyData.latitude ||
      selectedImages.length < 5
    ) {
      toast.error("Please fill all fields and upload at least 5 images.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!propertyData.pricePerMonth) {
      toast.error("Please fill all fields in Step 2.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (clickedButtons.length === 0) {
      toast.error("Please select at least one amenity.");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (selectedRoomFiles.length < 5) {
      toast.error("Please upload at least 5 images for the room.");
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;
    setStep(step + 1);
  };

  const handleStepChange = (newStep) => {
    if (newStep < step) {
      setStep(newStep);
      return;
    }
    if (newStep === 2 && !validateStep1()) return;
    if (newStep === 3 && !validateStep2()) return;
    if (newStep === 4 && !validateStep3()) return;
    setStep(newStep);
  };

  return (
    <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-4 mt-10 sm:mt-0 pt-1 pb-4 mb-1">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 items-center mb-5 mt-5">
        <button
          className={`border-slate-300 border-[1px] text-center py-2 rounded-3xl text-textclr ${
            step === 1 ? "bg-purplebutton text-white" : ""
          }`}
          onClick={() => handleStepChange(1)}
        >
          Info
        </button>
        <button
          onClick={() => handleStepChange(2)}
          className={`border-slate-300 border-[1px] py-2 text-center rounded-3xl text-textclr ${
            step === 2 ? "bg-purplebutton text-white" : ""
          }`}
        >
          Pricing
        </button>
        <button
          onClick={() => handleStepChange(3)}
          className={`border-slate-300 border-[1px] py-2 text-center rounded-3xl text-textclr ${
            step === 3 ? "bg-purplebutton text-white" : ""
          }`}
        >
          Amenities
        </button>
        <button
          onClick={() => handleStepChange(4)}
          className={`border-slate-300 border-[1px] py-2 text-center rounded-3xl text-textclr ${
            step === 4 ? "bg-purplebutton text-white" : ""
          }`}
        >
          Room
        </button>
      </div>

      {step === 1 ? (
        <div className="overflow-y-auto h-[600px] scrollbar-hide">
          <div className="flex lg:flex-row flex-col gap-3 my-5">
            <div className="lg:flex gap-10 md:flex-wrap py-3 px-7 pt-5">
              <div className="flex lg:flex-row flex-col gap-3 mt-5">
                <div
                  className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer bg-white"
                  onClick={handleClick}
                >
                  <p className="pt-5 px-16 text-textclr">+</p>
                  <p className="pb-8 px-16 text-textclr">Upload Photos</p>
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative items-center">
                      <img
                        src={image}
                        alt={`Property Preview ${index + 1}`}
                        className="h-28 rounded-xl sm:min-w-full object-cover md:w-full"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-[-15px] right-[-10px] bg-slate-500 text-white rounded-full px-2.5"
                      >
                        <p className="mb-1">x</p>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:mt-[-100px] mt-10">
            <form>
              <div className="mb-5 mt-5 md:mt-28 sm:mt-8">
                <label className="text-textclr mb-5">Name</label>
                <br />
                <input
                  type="text"
                  placeholder="Enter your Property Name"
                  className="border-2 py-2 rounded-full w-full pl-5 mt-3 text-textclr"
                  value={propertyData.name}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-5 mt-5  sm:mt-8">
                <label className="text-textclr mb-5">Location</label>
                <br />
                <input
                  type="text"
                  placeholder="Enter the Location of Property"
                  className="border-2 py-2 rounded-full w-full pl-5 mt-3 text-textclr"
                  value={propertyData.location}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-5">
                <label className="text-textclr">
                  Description
                  <br />
                  <textarea
                    rows="5"
                    placeholder="Enter the Description of your Property"
                    className="border-2 py-2 rounded-xl w-full pl-5 mt-3"
                    value={propertyData.description}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        description: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="lg:flex justify-between mt-5 flex-wrap">
                <label className="text-textclr w-full lg:w-[48%] mb-3">
                  Property Longitude
                  <br />
                  <input
                    type="number"
                    placeholder="Enter Property Longitude"
                    className="border-2 py-2 rounded-3xl w-full pl-5 mt-3"
                    value={propertyData.longitude}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        longitude: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="text-textclr w-full lg:w-[48%]">
                  Property Latitude
                  <br />
                  <input
                    type="number"
                    placeholder="Enter Property Latitude"
                    className="border-2 py-2 rounded-3xl w-full pl-5 mt-3"
                    value={propertyData.latitude}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        latitude: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <button className="bg-slate-200 md:px-14 sm:px-10 py-2 rounded-3xl mt-4 font-semibold text-textclr w-full lg:w-fit mb-7">
                Select From Map
              </button>
            </form>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="overflow-y-auto h-[600px] scrollbar-hide">
          <div className="flex flex-col">
            <form>
              <div className="mb-5 mt-5">
                <label className="text-textclr mb-5">Price Per Month</label>
                <br />
                <input
                  type="number"
                  placeholder="Enter Per Month Prize of Property"
                  className="border-2 py-2 rounded-full w-full pl-5 mt-3 text-textclr"
                  value={propertyData.pricePerMonth}
                  onChange={(e) =>
                    setPropertyData({
                      ...propertyData,
                      pricePerMonth: e.target.value,
                    })
                  }
                />
              </div>

              <div className="bg-slate-100 rounded-lg">
                <h2 className="text-center text-textclr font-bold pt-5">
                  Additional Cost
                </h2>
                <div className="lg:flex justify-around mt-5 pb-5 p-[10px]">
                  <label className="text-textclr w-[47%] p-3">
                    Name
                    <br />
                    <input
                      type="text"
                      name="name"
                      value={formInput.name}
                      onChange={handleChange}
                      placeholder="Enter Name of the Additional Service"
                      className="border-2 py-2 rounded-3xl w-full pl-5 mt-3 bg-slate-100 px-3"
                    />
                  </label>

                  <label className="text-textclr w-[47%] p-3">
                    Cost
                    <br />
                    <input
                      type="number"
                      name="cost"
                      value={formInput.cost}
                      onChange={handleChange}
                      placeholder="Enter the Price"
                      className="border-2 py-2 rounded-3xl w-full pl-5 mt-3 bg-slate-100"
                    />
                  </label>
                </div>

                <div className="w-full flex justify-center pb-10">
                  <button
                    onClick={handleAdd}
                    className="mt-10 text-center text-white items-center bg-purplebutton px-12 py-1.5 rounded-full"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="lg:flex w-full gap-3 mt-5 flex-wrap">
                {additionalCosts.map((cost, index) => (
                  <div
                    key={index}
                    className="lg:w-[45%] bg-white rounded-xl border-[1px] border-gray-200 px-6 mb-4 flex justify-between"
                  >
                    <div className="left p-3">
                      <p className="text-textclr text-xs">{cost.name}</p>
                      <h2 className="text-textclr font-bold">${cost.cost}</h2>
                    </div>

                    <div
                      className="right my-auto border border-slate-500 p-2 rounded-full cursor-pointer"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="text-red-700" size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      ) : step === 3 ? (
        <div className="overflow-y-auto h-[600px] scrollbar-hide">
          <h1 className="text-textclr font-semibold mb-3">
            Select the Amenities
          </h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 my-4 px-7 mb-9">
            {iconsArray.map((icon, index) => (
              <button
                key={index}
                className={`border rounded-3xl py-2 w-full my-2 transition-all duration-300 ${
                  clickedButtons.includes(index)
                    ? "bg-[#B19BD91A] text-[#B19BD9]"
                    : "bg-white text-[#828282]"
                }`}
                onClick={() => handleButtonClick(index)}
              >
                <div className="flex items-center justify-center gap-3">
                  <div>{icon}</div>
                  <p>{namesArray[index]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : step === 4 ? (
        <div className="overflow-y-auto h-[600px] scrollbar-hide">
          <div>
            <div className="bg-purple-50 mb-20 rounded-xl">
              <div className="lg:flex gap-10 md:flex-wrap py-3 px-7 mb-5 pt-5">
                <div className="flex lg:flex-row flex-col gap-3 mt-5 mb-10">
                  <div
                    className="flex flex-col items-center justify-center border-[1.5px] rounded-xl cursor-pointer bg-white"
                    onClick={() =>
                      document.getElementById("image-upload-room").click()
                    }
                  >
                    <p className="pt-5 px-16 text-textclr">+</p>
                    <p className="pb-8 px-16 text-textclr">Upload Photos</p>
                    <input
                      id="image-upload-room"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChangeRoom}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedRoomImages.map((image, index) => (
                      <div key={index} className="relative items-center">
                        <img
                          src={image}
                          alt={`Room Preview ${index + 1}`}
                          className="h-28 rounded-xl sm:min-w-full object-cover md:w-full"
                        />
                        <button
                          onClick={() => handleRemoveRoomImage(index)}
                          className="absolute top-[-15px] right-[-10px] bg-slate-500 text-white rounded-full px-2.5"
                        >
                          <p className="mb-1">x</p>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:flex w-full items-center justify-between gap-8 pb-10 px-4 sm:px-8">
                <div className="flex-1">
                  <label className="text-textclr text-sm font-semibold mb-2 block">
                    Cost
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Your Room Price"
                    name="price"
                    value={roomInput.price}
                    onChange={handleRoomChange}
                    className="border-2 border-gray-300 py-2 px-4 rounded-full w-full focus:outline-none focus:border-purple-500 bg-purple-50 text-textclr transition-all duration-300 lg:w-2/3"
                  />
                </div>
                <div className="flex justify-center lg:justify-start mt-5 lg:mt-0">
                  <button
                    className="bg-purplebutton text-white px-8 py-3 rounded-full lg:mt-7"
                    onClick={handleAddRoom}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="text-textclr">
              {additionalRoomPrice.map((room, index) => (
                <div
                  key={index}
                  className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-6 pt-1 pb-4 mb-1"
                >
                  <div className="flex justify-between pt-4">
                    <div className="flex">
                      <p className="text-gray-400">Room {index + 1}:</p>
                      <h1 className="ml-5 font-semibold">${room.price}</h1>
                    </div>
                    <div
                      className="right my-auto border border-slate-500 p-2 rounded-full cursor-pointer"
                      onClick={() => handleDeleteRoom(index)}
                    >
                      <Trash2 className="text-red-700" size={18} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {room?.images?.map(
                      (image, imgIndex) =>
                        image && (
                          <img
                            key={imgIndex}
                            src={
                              image instanceof File
                                ? URL.createObjectURL(image)
                                : image
                            }
                            alt={`Room ${index + 1} Image ${imgIndex + 1}`}
                            className="h-28 rounded-xl"
                          />
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="w-full flex justify-center mt-6 mb-7">
        {step < 4 && (
          <button
            onClick={handleNextStep}
            className="text-center text-white items-center bg-bluebutton px-16 py-2 rounded-full"
          >
            Next
          </button>
        )}
        {step === 4 && (
          <button
            onClick={handleSave}
            className="text-center items-center bg-bluebutton px-20 py-3 rounded-full text-white"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Properties;
