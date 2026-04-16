import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from "react-hook-form"

export const CandidateProfile = () => {
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm({
        defaultValues: {
            _id: "",
            candidateID: "",
            jobID: "",
            applicationStatus: "",
            applicationForm: [{ question: "", answer: "" }],
            candidateFeedback: [{ question: "", answer: "" }]
        }
    })

    // ✅ URL se candidate_id aur job_id lo
    const { candidate_id, job_id } = useParams();

    const [application, setApplication] = useState();
    const [candidate, setCandidate] = useState();
    const [recruiter, setRecruiter] = useState();
    const [job, setJob] = useState();

    // ✅ Real API se candidate fetch karo
    useEffect(() => {
        if (!candidate_id) return;
        fetch(`http://localhost:5000/users/user/${candidate_id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Candidate:", data);
                setCandidate(data);
            })
            .catch(err => console.log(err));
    }, [candidate_id]);

    // ✅ Real API se job fetch karo
    useEffect(() => {
        if (!job_id) return;
        fetch(`http://localhost:5000/jobs/current-job/${job_id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Job:", data);
                setJob(data);
            })
            .catch(err => console.log(err));
    }, [job_id]);

    // ✅ Real API se application fetch karo
    useEffect(() => {
        if (!candidate_id) return;
        fetch(`http://localhost:5000/application/all-application/`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.find(item => item.candidateID === candidate_id);
                console.log("Application:", filtered);
                setApplication(filtered);
            })
            .catch(err => console.log(err));
    }, [candidate_id]);

    // ✅ Real API se recruiter fetch karo
    useEffect(() => {
        if (!job_id) return;
        fetch(`http://localhost:5000/recruiter/all-recruiter`)
            .then(res => res.json())
            .then(data => {
                const filtered = data.find(item => item.jobID === job_id);
                console.log("Recruiter:", filtered);
                setRecruiter(filtered);
            })
            .catch(err => console.log(err));
    }, [job_id]);

    const onSubmit = (data) => {
        if (!application) {
            alert("Application not found!");
            return;
        }

        const newData = {
            ...data,
            _id: application._id,
            candidateID: candidate?._id,
            jobID: job?._id,
            applicationStatus: data.applicationStatus,
            candidateFeedback: recruiter && recruiter.feedbackForm
                ? recruiter.feedbackForm.map((q, index) => ({
                    answer: data.candidateFeedback[index]?.answer,
                    question: q
                }))
                : data.candidateFeedback
        }

        console.log("Submitting:", newData);

        fetch("http://localhost:5000/application/update-application", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(newData),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                if (result.message) {
                    alert("Error: " + result.message)
                } else {
                    alert(data.applicationStatus === "shortlist" ?
                        "Candidate Shortlisted! ✅" :
                        "Candidate Rejected! ❌"
                    )
                }
            })
            .catch((err) => {
                console.log(err);
                alert("Something went wrong!")
            });
    }

    return (
        <div className='max-w-scren-2xl w-full md:w-4/6 lg:w-6/8 container mt-2 mx-auto xl:px-24 px-4'>
            <div className='bg-[#efefef] mx-auto py-12 md:px-14 px-8 rounded-lg'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col lg:flex-row gap-8'>

                        {/* CANDIDATE + JOB DETAILS */}
                        <div className='lg:w-1/2 w-full'>
                            {candidate && job &&
                                <div>
                                    <h1 className='text-xl md:text-2xl font-bold'>{candidate.userName}</h1>
                                    <div className='px-1'>
                                        <h2 className='mt-4 mb-2 font-bold'>Candidate Details</h2>
                                        <p className='text-sm md:text-base'>Email: {candidate.userEmail}</p>
                                        <p className='text-sm md:text-base'>Gender: {candidate.gender}</p>
                                        <p className='text-sm md:text-base'>Address: {candidate.address}</p>
                                    </div>
                                    <div className='px-1'>
                                        <h2 className='mt-2 mb-2 font-bold'>Job Details</h2>
                                        <p className='text-sm md:text-base'>Job Role: {job.jobTitle}</p>
                                        <p className='text-sm md:text-base'>Location: {job.location}</p>
                                        <p className='text-sm md:text-base'>Salary: {job.salary}</p>
                                        <p className='text-sm md:text-base'>Description: {job.description}</p>
                                    </div>
                                </div>
                            }

                            {application && application.applicationForm &&
                                <div className='px-1 mt-4'>
                                    <h2 className='mt-2 mb-2 font-bold'>Application Form (R1)</h2>
                                    {application.applicationForm.map((question, index) => (
                                        <div key={index}>
                                            <p className='text-sm'>Q{index + 1}: {question.question}</p>
                                            <p className='text-sm'>Response: <span className='font-semibold'>{question.answer}</span></p>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>

                        {/* FEEDBACK FORM */}
                        <div className='lg:w-1/2 w-full'>
                            <h1 className='text-xl font-bold text-center'>Feedback Form</h1>
                            <div>
                                {recruiter && recruiter.feedbackForm &&
                                    recruiter.feedbackForm.map((question, index) => (
                                        <RenderQuestion
                                            key={index}
                                            index={index}
                                            register={register}
                                            setValue={setValue}
                                            question={question}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* REJECT / SHORTLIST BUTTONS */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-8'>
                        <button
                            type="submit"
                            className='block bg-red-500 text-white text-md py-4 px-16 rounded-md'
                            onClick={() => setValue("applicationStatus", "reject")}
                        >
                            Reject
                        </button>
                        <button
                            type="submit"
                            className='block bg-green-500 text-white text-md py-4 px-16 rounded-md'
                            onClick={() => setValue("applicationStatus", "shortlist")}
                        >
                            Shortlist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function RenderQuestion({ index, question, register }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 items-center pt-2'>
            <label className='block mt-2 m-1 text-sm'>{index + 1}. {question}</label>
            <div className='grid grid-cols-2 items-center justify-items-center'>
                <div className='flex'>
                    <input
                        {...register(`candidateFeedback.${index}.answer`, { required: true })}
                        type="radio"
                        value="Yes"
                        className='mx-2'
                    />
                    <p>Yes</p>
                </div>
                <div className='flex'>
                    <input
                        {...register(`candidateFeedback.${index}.answer`, { required: true })}
                        type="radio"
                        value="No"
                        className='mx-2'
                    />
                    <p>No</p>
                </div>
            </div>
        </div>
    );
}