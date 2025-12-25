import express from "express";

const ErrorHandler = (fn)=>{
    return (req,res)=>{
        fn(req,res).catch(err=>{
            return res.status(500).json({
                message:"Internal Server Error",
                error: `Error:${err?.message}`
            })
        })
    }
}

export {ErrorHandler};