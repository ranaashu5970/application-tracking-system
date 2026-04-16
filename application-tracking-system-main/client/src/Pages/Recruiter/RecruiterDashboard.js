import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const RecruiterDashboard = () => {
    const tableHeaderCss = "px-4 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold"

    const [loginData, setLoginData] = useState();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        let token = localStorage.getItem("user");
        const user = JSON.parse(token);
        setLoginData(user);
        console.log("Login user:", user);
    }, [])

    useEffect(() => {
        fetch(`http://localhost:5000/application/all-application/`)
            .then(res => res.json())
            .then(data => {
                console.log("All applications:", data);
                const activeApps = data.filter(app => app.applicationStatus === "active");
                setApplications(activeApps);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
            <div className='py-1'>
                <div className='w-full'>
                    <section className="py-1 bg-blueGray-50">
                        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-secondary text-white">
                                    <div className="flex flex-wrap items-center">
                                        <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-center">
                                            <h3 className="font-bold text-base">Review Candidates</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="block w-full overflow-x-hidden">
                                    <table className="items-center bg-transparent w-full border-collapse">
                                        <thead>
                                            <tr>
                                                <th className={tableHeaderCss}>Candidate ID</th>
                                                <th className={tableHeaderCss}>Job ID</th>
                                                <th className={tableHeaderCss}>Status</th>
                                                <th className={tableHeaderCss}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.length > 0 ?
                                                applications.map((application, key) => (
                                                    <RenderTableRows key={key} application={application} />
                                                ))
                                                :
                                                <tr>
                                                    <td colSpan="4" className='text-center py-4 text-sm'>
                                                        No applications found
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function RenderTableRows({ application }) {
    const tableDataCss = "border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
    return (
        <tr>
            <th className={`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6`}>
                {application.candidateID}
            </th>
            <td className={tableDataCss}>
                {application.jobID}
            </td>
            <td className={tableDataCss}>
                {application.applicationStatus}
            </td>
            <td className={tableDataCss}>
                <Link to={`/candidate/${application.candidateID}/${application.jobID}`}>
                    <button className='block bg-primary text-white mx-auto text-md py-2 px-5 md:px-6 rounded-md'>
                        Review
                    </button>
                </Link>
            </td>
        </tr>
    )
}