import React from 'react'
import styles from './IntroText.module.css'
export default function IntroText() {
    return (
        <div className={`${styles.main} bg-[#10d1c4] !important`}>
            <h1 className=' text-[2rem] font-bol'>
                Electricity Fault Reporting Solution </h1>
            <div className='text-[#ffffffd5]'>
                <p>Say goodbye to cumbersome reporting methods and delayed responses.</p>
                <p>
                    With our Electricity Failure Reporting System, you can effortlessly report outages, monitor the status, and receive real-time updates.
                </p>
                <p>
                    Designed for convenience and efficiency, our system ensures your reports are swiftly handled and resolved.
                </p>
            </div>
        </div>
    )
}
