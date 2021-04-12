

//The cathAsync is a function that takes each of this function in as an argument and returns err
// if there's a catch in the function catch block. This is made possible with the .catch(next)


module.exports  = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}