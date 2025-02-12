import React from 'react'

const Forgot = () => {
  return (

    <div className='flex items-center justify-center w-full mb-10 mt-10'>

      <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">

        <div className=' text-center text-textclr font-semibold text-2xl'>
          <h1>Forgot Password!</h1>
        </div>

        <div className='mt-10 w-full'>
          <label className='text-textclr' name="email">Email</label>
          <br />
          <input type="text" name='email' placeholder='Write Here' className='border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full' />
        </div>

        <div className='mt-20'>
          <button className='w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full'>Send</button>
        </div>
      </div >
    </div>
  )
}

export default Forgot