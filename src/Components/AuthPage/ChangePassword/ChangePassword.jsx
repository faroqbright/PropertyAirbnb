import React from 'react'

const ChangePassword = () => {
    return (

        <div className='flex items-center justify-center w-full mb-10 mt-10'>

            <div className="bg-white rounded-xl border-[1.5px] border-gray-200 w-3/4 lg:w-1/2 py-14 lg:px-14 px-5 flex flex-col">

                <div className=' text-center text-textclr font-semibold text-2xl'>
                    <h1>Change Password!</h1>
                </div>
                <div>
                    <div className='mt-5'>
                        <label className='text-textclr' name="password">Old Password</label>
                        <br />
                        <input type="password" name='password' placeholder='xxxx xxxx xxxx xxxx' className='border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full' />
                    </div>
                    <div className='mt-5'>
                        <label className='text-textclr' name="password">New Password</label>
                        <br />
                        <input type="password" name='password' placeholder='xxxx xxxx xxxx xxxx' className='border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full' />
                    </div>

                    <div className='mt-5'>
                        <label className='text-textclr' name="password">Confirm Password</label>
                        <br />
                        <input type="password" name='password' placeholder='xxxx xxxx xxxx xxxx' className='border-[1.5px] w-full mt-3 py-2 pl-3 rounded-full' />
                    </div>
                </div>

                <div className='mt-5'>
                    <button className='w-full text-center mt-5 border-[1.5px] py-2 text-white bg-bluebutton rounded-full'>Save</button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword