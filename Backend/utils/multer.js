import multer from "multer";


// Configure multer storage
const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "uploads/"); // Specify the directory to save uploaded files
    },
    filename: (req, file, cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`); // Generate a unique filename
    },
})

//file filter to allow only images
 const fileFilter = (req, file, cb)=>{
    const allowedTypes = ["image/jpeg","image/png","image/jpg"]

    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
else{
    cb(new Error("Invalid file type. Only JPEG, PNG and JPG are allowed."),false);
}
 }

 const upload = multer({storage, fileFilter});

 export default upload;