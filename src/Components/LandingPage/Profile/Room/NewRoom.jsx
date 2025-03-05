"use client";

import { Bath, BedDouble, BicepsFlexed, Bolt, Cat, ChartArea, CircleParking, Dog, Dumbbell, Flower2, HeartHandshake, House, Settings, Shield, Trash2, WashingMachine, WavesLadder, } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

const Properties = () => {
  const [step, setstep] = useState(1);
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [propertyData, setPropertyData] = useState({
    name: "",
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
  const [roomInput, setRoomInput] = useState({ img: "", price: "" });
  const fileInputRef = useRef(null);
  const [clickedButtons, setClickedButtons] = useState([]);

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
            console.log(`Upload is ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}% done`);
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
      toast.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      const imageUrls = await Promise.all(selectedFiles.map(file => uploadImage(file)));

      const dataToSave = {
        name: propertyData.name,
        description: propertyData.description,
        longitude: propertyData.longitude,
        latitude: propertyData.latitude,
        pricePerMonth: propertyData.pricePerMonth,
        additionalCosts: additionalCosts,
        amenities: clickedButtons.map((index) => namesArray[index]),
        rooms: additionalRoomPrice,
        imageUrls: imageUrls,
        status: "Approved"
      };

      const docRef = await addDoc(collection(db, "properties"), dataToSave);
      toast.success("Property Created Successfully");

      console.log("data is:", dataToSave)
      router.push("/Landing/Home");
    } catch (e) {
      toast.error("Error adding document: ", e);
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length <= 5) {
      const newFiles = files.map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newFiles]);
      setSelectedFiles(prev => [...prev, ...files]);
    } else {
      toast.error("You can only upload up to 5 images.");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setSelectedFiles(updatedFiles);
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

  const handleImageChangeRoom = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      setRoomInput((prev) => ({ ...prev, img: imageUrl }));
    }
    e.target.value = "";
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (roomInput.price && roomInput.img) {
      setAdditionalRoomPrice([...additionalRoomPrice, roomInput]);
      setRoomInput({ img: "", price: "" });
    } else {
      toast.error("Please fill all fields in the Room section.");
    }
  };

  const handleRemoveImageRoom = () => {
    setRoomInput((prev) => ({ ...prev, img: "" }));
    document.getElementById("image-upload-room").value = "";
  };

  const handleDeleteRoom = (index) => {
    const updatedRoom = additionalRoomPrice.filter((_, i) => i !== index);
    setAdditionalRoomPrice(updatedRoom);
  };

  const namesArray = [
    "Primary Services", "Swimming Pool", "Vigilance", "Maintenance", "House Keeping", "Parking", "Own Bathroom", "Roof Garden", "Cat Friendly", "Laundry", "Common Areas", "Gym", "Co Working", "Dog", "LGBT+coLivers", "Double Bed",
  ];

  const iconsArray = [
    <Settings size={18} />, <WavesLadder size={18} />, <Shield size={18} />, <Bolt size={18} />, <House size={18} />, <CircleParking size={18} />, <Bath size={18} />, <Flower2 size={18} />, <Cat size={18} />, <WashingMachine size={18} />, <ChartArea size={18} />, <Dumbbell size={18} />, <BicepsFlexed size={18} />, <Dog size={18} />, <HeartHandshake size={18} />, <BedDouble size={18} />,
  ];

  const handleButtonClick = (index) => {
    setClickedButtons((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]);
  };

  const validateStep1 = () => {
    if (!propertyData.name || !propertyData.description || !propertyData.longitude || !propertyData.latitude || selectedFiles.length === 0) {
      toast.error("Please fill all fields in Step 1.");
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

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setstep(step + 1);
  };

  const handleStepChange = (newStep) => {
    if (newStep < step) {
      setstep(newStep);
      return;
    }
    if (newStep === 2 && !validateStep1()) return;
    if (newStep === 3 && !validateStep2()) return;
    if (newStep === 4 && !validateStep3()) return;
    setstep(newStep);
  };

  return (
    <div className="w-full bg-white rounded-xl border-[1.5px] border-gray-200 px-4 mt-10 sm:mt-0 pt-1 pb-4 mb-1">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 items-center mb-5 mt-5">
        <button
          className={`border-slate-300 border-[1px] text-center py-2 rounded-3xl text-textclr ${step === 1 ? "bg-purplebutton text-white" : ""}`}
          onClick={() => handleStepChange(1)}
        >
          Info
        </button>
        <button
          onClick={() => handleStepChange(2)}
          className={`border-slate-300 border-[1px] py-2 text-center rounded-3xl text-textclr ${step === 2 ? "bg-purplebutton text-white" : ""}`}
        >
          Pricing
        </button>
        <button
          onClick={() => handleStepChange(3)}
          className={`border-slate-300 border-[1px] py-2 text-center rounded-3xl text-textclr ${step === 3 ? "bg-purplebutton text-white" : ""}`}
        >
          Amenities
        </button>
        <button
          onClick={() => handleStepChange(4)}
          className={`border-slate-300 border-[1px] py-2 text-center rounded-3xl text-textclr ${step === 4 ? "bg-purplebutton text-white" : ""}`}
        >
          Room
        </button>
      </div>

      {step === 1 ? (
        <div>
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
                  placeholder="Write Here"
                  className="border-2 py-2 rounded-full w-full pl-5 mt-3 text-textclr"
                  value={propertyData.name}
                  onChange={(e) =>
                    setPropertyData({ ...propertyData, name: e.target.value })
                  }
                />
              </div>

              <div className="mt-5">
                <label className="text-textclr">
                  Description
                  <br />
                  <textarea
                    rows="5"
                    placeholder="Write Here"
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
                    type="text"
                    placeholder="Write Here"
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
                    type="text"
                    placeholder="Write Here"
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
              <br />

              <div className="w-full flex justify-center mt-6 mb-7">
                <button
                  onClick={handleNextStep}
                  className="text-center text-white items-center bg-bluebutton px-16 py-2 rounded-full"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : step === 2 ? (
        <>
          <div className="flex flex-col">
            <form>
              <div className="mb-5 mt-5">
                <label className="text-textclr mb-5">Price Per Month</label>
                <br />
                <input
                  type="text"
                  placeholder="Write Here"
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
                      placeholder="Write Here"
                      className="border-2 py-2 rounded-3xl w-full pl-5 mt-3 bg-slate-100 px-3"
                    />
                  </label>

                  <label className="text-textclr w-[47%] p-3">
                    Cost
                    <br />
                    <input
                      type="text"
                      name="cost"
                      value={formInput.cost}
                      onChange={handleChange}
                      placeholder="Write Here"
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

              <div className="w-full flex justify-center mb-5">
                <button
                  onClick={handleNextStep}
                  className="mt-10 text-center text-white items-center bg-bluebutton px-16 py-2 rounded-full"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </>
      ) : step === 3 ? (
        <>
          <div className="overflow-y-auto scrollbar-hide h-[800px] lg:h-auto">
            <h1 className="text-textclr font-semibold mb-3">
              Select the Amenities
            </h1>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 my-4 px-7 mb-9">
              {iconsArray.map((icon, index) => (
                <button
                  key={index}
                  className={`border rounded-3xl py-2 w-full my-2 transition-all duration-300 ${
                    clickedButtons.includes(index)
                      ? "bg-[#B19BD91A] text-[#B19BD9]" // Pink background and text when clicked
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

            <div className="w-full flex justify-center mb-5">
              <button
                onClick={handleNextStep}
                className="mt-10 text-center items-center bg-bluebutton px-16 py-2 rounded-full text-white"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : step === 4 ? (
        <>
          <div>
            <div className="bg-purple-50 mb-20 rounded-xl">
              <div className="lg:flex gap-10 md:flex-wrap py-3 px-7 mb-5 pt-5">
                <div className="flex lg:flex-row flex-col gap-3 mt-5 mb-10">
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
                      className="hidden"
                      onChange={handleImageChangeRoom}
                    />
                  </div>
                  {roomInput.img && (
                    <div className="relative items-center">
                      <img
                        src={roomInput.img}
                        alt="Room Preview"
                        className="h-28 rounded-xl sm:min-w-full object-cover md:w-full"
                      />
                      <button
                        onClick={handleRemoveImageRoom}
                        className="absolute top-[-15px] right-[-10px] bg-slate-500 text-white rounded-full px-2.5"
                      >
                        <p className="mb-1">x</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:flex w-full items-center justify-between gap-8 pb-10 px-4 sm:px-8">
                <div className="flex-1">
                  <label className="text-textclr text-sm font-semibold mb-2 block">
                    Cost
                  </label>
                  <input
                    type="text"
                    placeholder="Write here"
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
                  <img
                    src={room.img}
                    alt={`Room ${index + 1}`}
                    className="h-28 rounded-xl"
                  />
                </div>
              ))}
              <div className="w-full flex justify-center">
                <button
                  onClick={handleSave}
                  className="text-center items-center bg-bluebutton px-20 mt-24 py-3 rounded-full text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Properties;