export const catchAsyncError = (Function)=>{
    return(req, res, next)=>{
        Promise.resolve(Function(req,res,next)).catch(next); 
    }
}