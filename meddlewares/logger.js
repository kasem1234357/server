const logger = (req,res,next)=>{
    // const {id} = req.params
    // console.table([['params',req.params],['path',req.path]])
    next()
}
module.exports =   logger
