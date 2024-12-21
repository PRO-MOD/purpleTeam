const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const Score = require('../models/score');
const Submission = require('../models/CTFdChallenges/Submission');
const Flag=require('../models/flags');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendCredentials = require('../utils/sendMail')
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = process.env.JWT_SECRET; // This is to be stored in env.local for security purposes.
const { ObjectId } = require('mongoose').Types;
const multer = require('multer'); // For handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
const xlsx = require('xlsx');
const uploadImageToCloudinary = require('../utils/imageUpload')
const BT = process.env.BT;
const WT = process.env.WT;
const createUploadMiddleware =require('../utils/CTFdChallenges/multerConfig');
const uploadPath = path.join(__dirname, '../uploads/profilephotos');
const uploadnew = createUploadMiddleware(uploadPath);

// Route 1: route for the api with the route og localhost/api/auth/createuser
router.post('/createuser', async (req, res) => {
  let success = false;

  try {

    if (req.body.footwearpasspin !== process.env.PASSPIN) {
      return res.status(403).json({ error: "Bad Request" });
    }

    userEmail = (await User.find({ email: req.body.email })).length
    if (userEmail == 0) {
      let salt = bcrypt.genSaltSync(10);
      let securedPass = bcrypt.hashSync(req.body.password, salt);
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
        role: req.body.role
      })

      // sendCredentials(req.body.email, "Check your Hackathon Credentials !!", `Your Credntials for this session are \nEmail: ${req.body.email} \n Password: ${req.body.password}`)

      if(user.role == BT){
        // Create associated score document
        const userScore = new Score({
        account_id: user._id.toString(), // Or another unique identifier if needed
        name: user.name,
        score: 0, // Initial score
        user: user._id,
        date: new Date(),
        staticScore: 0, // Default static score
      });

      await userScore.save();

      }

      const data = {
        user: {
          id: user.id
        }
      }

      const authtoken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authtoken });
    } else {
      return res.status(400).json({ error: "Email Id already Exists" })
    }
  } catch (err) {
    res.status(500).send("Internal Server Error occured while Authennticating")
  }
})

// Route to upload and process the file
router.post('/uploadusers', upload.single('file'), fetchuser, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a file." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== process.env.WT) {
      return res.status(403).json({ error: "Bad Request" });
    }

    let usersData = [];
    const fileBuffer = req.file.buffer;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      // Process Excel file
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
      const worksheet = workbook.Sheets[sheetName];
      usersData = xlsx.utils.sheet_to_json(worksheet);

      // Validate if the file contains user data
      if (usersData.length === 0) {
        return res.status(400).json({ error: "Uploaded file is empty or improperly formatted." });
      }
    } else {
      return res.status(400).json({ error: "Invalid file format. Only Excel files are supported." });
    }
    console.log(usersData);
    
    // Process each user and create them
    for (let userData of usersData) {
      const userEmail = await User.findOne({ email: userData.email });
      
      if (!userEmail) {
        let salt = bcrypt.genSaltSync(10);
        let securedPass = bcrypt.hashSync(userData.password, salt);

        const user = await User.create({
          name: userData.name,
          email: userData.email,
          password: securedPass,
          role: userData.role,
        });

        await user.save(); // Save user to the database

        // Uncomment if you want to send credentials via email
        // sendCredentials(userData.email, "Check your Hackathon Credentials !!", 
        //   `Your Credentials for this session are \nEmail: ${userData.email} \n Password: ${userData.password}`);

        if (user.role === BT) {
          // Create associated score document
          const userScore = new Score({
            account_id: user._id.toString(),
            name: user.name,
            score: 0,
            user: user._id,
            date: new Date(),
            staticScore: 0,
          });

          await userScore.save();
        }
      }
    }

    return res.json({ success: true, message: "Users created successfully." });
  } catch (err) {
    console.error("Error processing file:", err.message);
    res.status(500).json({ error: "Internal Server Error occurred while uploading and processing the file.", details: err.message });
  }
});


// Route to add multiple users to assignedTeams
router.post('/addUsers/:userId', fetchuser, async (req, res) => {
  const { userId } = req.params;
  const { selectedUserIds } = req.body; 
  console.log("I am in addusers >> " + selectedUserIds);
  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user || !(user.role == WT)) {
      return res.status(404).json({ message: 'User not found or user might not be Volunteer' });
    }

    // Remove any users that are already assigned
    const newSelectedUserIds = selectedUserIds.filter(id => !user.assignedTeams.includes(id));

    // Add the filtered selectedUserIds to the assignedTeams array
    user.assignedTeams.push(...newSelectedUserIds);

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Users added to team successfully', user });
  } catch (error) {
    console.error('Error adding users to team:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




// Route 2: route for the api with the route og localhost/api/auth/login
router.post('/login', async (req, res) => {
  let success = false;

  try {
    const user = await User.findOne({ email: req.body.email, userVisibility: true  })
    if (user) {
      
      if(user.role !== BT && user.role !== WT){
        return res.status(403).json({ error: "Bad Request" });
      }

      const comparePass = bcrypt.compareSync(req.body.password, user.password);
      if (comparePass) {
        const data = {
          user: {
            id: user.id
          }
        }
        success = true;
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ success, authtoken });
      }
      else {
        return res.status(400).json({
          error: "User does not Exists / Invalid Credentials"
        })
      }


    } else {
      return res.status(400).json({ error: "User does not Exists / Invalid Credentials" })
    }
  } catch (err) {
    res.status(500).send("Internal Server Error occured while Authennticating")
  }


})

// Route to fetch all users
router.get('/getallusers', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
      
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }
    const users = await User.find({ role: BT  }, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all users
router.get('/getusersall', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
      
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }
    const users = await User.find({userVisibility: true }).select("-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getWhiteUsersall', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
      
      if (userAdmin.role !== process.env.WT) {
        return res.status(403).json({ error: "Bad Request" });
      }
    const users = await User.find({ role: { $ne: BT }  }).select("-password"); // Exclude users with role "BT" and password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Define the route to handle removing users from the volunteer's assigned teams
router.post('/removeUsers/:volunteerId', fetchuser, async (req, res) => {
  const { volunteerId } = req.params;
  const { unselectedUserIds } = req.body;
  console.log("I am in removeusers >> " + unselectedUserIds);

  try {
    // Find the volunteer by ID
    const volunteer = await User.findById(volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Convert unselectedUserIds to an array of ObjectId instances
    const unselectedObjectIds = unselectedUserIds.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id));

    // Remove unselected users from the volunteer's assigned teams
    volunteer.assignedTeams = volunteer.assignedTeams.filter(teamId => {
      return !unselectedObjectIds.some(unselectedId => unselectedId.equals(teamId));
    });

    // Save the updated volunteer
    await volunteer.save();

    res.status(200).json({ message: 'Users removed from team successfully' });
  } catch (error) {
    console.error('Error removing users from team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE endpoint to delete a user
router.delete('/deleteuser/:userId', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
    if (userAdmin.role !== process.env.WT) {
      return res.status(403).json({ error: "Bad Request" });
    }
      const userId = req.params.userId;
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Perform the deletion
      await User.findByIdAndDelete(userId);
      // Delete the corresponding score document
      await Score.deleteMany({ user: userId });
      // Delete the corresponding submissions
      await Submission.deleteMany({ userId: userId });
      
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to fetch all Volunteer
router.get('/getallVolunteer', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
    if (userAdmin.role !== process.env.WT) {
      return res.status(403).json({ error: "Bad Request" });
    }
    const users = await User.find({ role: WT, userVisibility: true  }, '-password').populate('assignedTeams', 'name');; // Exclude password field
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the route for updating a user
router.put('/updateuser/:userId', fetchuser, async (req, res) => {
  try {
    const userAdmin = await User.findById(req.user.id);
    
    if (userAdmin.role !== process.env.WT) {
      return res.status(403).json({ error: "Bad Request" });
    }
    const userId = req.params.userId;
    const { name, email, password, role } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's information
    user.name = name;
    user.email = email;
    // Update password only if provided
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const securedPass = bcrypt.hashSync(password, salt);
      user.password = securedPass;
    }
    user.role = role;

    // Save the updated user to the database
    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: "Internal Server Error occurred while updating user" });
  }
});



// Route 3: route for the api with the route of localhost/api/auth/getuser with a MIDDLEWARE
// router.post('/getuser', fetchuser, async (req, res) => {

//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId).select("-password");
//     res.send(user);


//   } catch (err) {
//     res.status(500).send("Internal Server Error occured while getting the user from JWT token || MiddleWare")
//   }
// })

router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find the user by ID, ensure userVisibility is true, and exclude the password field
    const user = await User.findOne({ _id: userId, userVisibility: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found or not visible' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).send('Internal Server Error occurred while retrieving the user');
  }
});


// Route to search for user by name
router.get('/user', async (req, res) => {
  const { name } = req.query;

  try {
    const user = await User.findOne({ name, userVisibility: true });
    if (user) {
      res.json({ _id: user._id });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error searching for user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// router.post('/fetch-flag',fetchuser, async (req, res) => {
  
//   const userId = req.user.id;
//   const user = await User.findById(userId).select("-password");
//   const {ctfdFlag } = req.body;
//   const  teamName=user.name;

//   try {
//     const flag = await Flag.findOne({ teamName, ctfdFlag });
    

//     if (flag) {
//       return res.json({ encryptedFlag: flag.encryptedFlag });
//     } else {
//       return res.status(404).json({ error: 'Flag not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching encrypted flag:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// Route to get user details by ID
router.post('/fetch-flag', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find the user by ID, ensure userVisibility is true, and exclude the password field
    const user = await User.findOne({ _id: userId, userVisibility: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found or not visible' });
    }

    const { ctfdFlag } = req.body;
    const teamName = user.name;

    const flag = await Flag.findOne({ teamName, ctfdFlag });

    if (flag) {
      return res.json({ encryptedFlag: flag.encryptedFlag });
    } else {
      return res.status(404).json({ error: 'Flag not found' });
    }
  } catch (error) {
    console.error('Error fetching encrypted flag:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// router.get('/:userId', fetchuser, async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Query the database to find the user by ID
//     const user = await User.findById(userId).select('-password'); // Excluding the password field

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Send the user details as a response
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.post('/change-picture', upload.single('profilePicture'), fetchuser, async (req, res) => {
//   try {
//     // Check if a file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

    
//     // Upload image to Cloudinary
//     const imageUrl = await uploadImageToCloudinary(req.file);

//     // Assuming a User model and store the profile picture URL in the user document
//     const userId = req.user.id; 

//     const user = await User.findById(userId);
//     user.profile = imageUrl;
//     // const updatedUser = await (userId, imageUrl);
//     user.save()
//     return res.status(200).json(user);
//   } catch (error) {
//     console.error('Error changing profile picture:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });


router.get('/:userId', fetchuser, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and ensure userVisibility is true, excluding the password field
    const user = await User.findOne({ _id: userId, userVisibility: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found or not visible' });
    }

    // Send the user details as a response
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/change-picture', uploadnew.single('profilePicture'), fetchuser, async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if the file is an image (png, jpg, jpeg)
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only image files (PNG, JPG, JPEG) are allowed' });
    }

    // Assuming the uploaded file is saved locally, get the file path
    const filePath = path.join('uploads', 'profilephotos', req.file.filename);

    // Assuming a User model and store the profile picture URL in the user document
    const userId = req.user.id; // Get the user ID from the fetched user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profile = filePath; // Save the image path in the user's profile field
    await user.save(user.profile);
    console.log()

    // Return the updated user object
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error changing profile picture:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/toggle-visibility/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the userVisibility status
        user.userVisibility = !user.userVisibility;

        await user.save();
        res.json({ success: true, userVisibility: user.userVisibility });
    } catch (error) {
        console.error('Error updating user visibility:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// API to toggle userVisibility
router.put('/toggleVisibility/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // If user not found, return 404 error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Toggle the userVisibility field
        user.userVisibility = !user.userVisibility;

        // Save the updated user
        await user.save();

        // Return the updated user object
        res.status(200).json({
            success: true,
            message: 'User visibility toggled successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userVisibility: user.userVisibility,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});



module.exports = router