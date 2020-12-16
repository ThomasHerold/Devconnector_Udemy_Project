const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const axios = require('axios');
const config = require('config');

// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        // REMINDER: req.user is assigned to the authenticated user that we verified with our auth middleware. Payload contains this users Id that we packaged with the token
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); // name & avatar are being referenced from user model to fill profile info
        
        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        } 

        return res.send(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/profile
// @desc   Create or update user profile
// @access Private

router.post('/', [ auth, 
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

    // Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    };

    // Build social object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;


    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            // Update profile if already exists
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true } 
            );
            
            return res.json(profile);
        }

        // Create profile if not found
        profile = new Profile(profileFields);

        await profile.save();
        return res.json(profile);

    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error'); 
    }

});

// @route  GET api/profile
// @desc   Get all profiles
// @access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        return res.json(profile);

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        return res.status(400).send('Server');
    }
});

// @route  DELETE api/profile
// @desc   Delete profile, user and posts
// @access Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove posts
        await Post.deleteMany({ user: req.user.id })
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        return res.json({ msg: 'User deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private

router.put('/experience', [ auth,
    [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // push experience object to beginning of experience array
        profile.experience.unshift(newExp);

        await profile.save();

        return res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route  PATCH api/profile/experience/:experience_id
// @desc   Update profile experience
// @access Private

router.patch(
    '/experience/:experience_id',
    [
      auth,
      [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty(),
      ],
    ],
    async (req, res) => {
      // Capture experience ID 
      const experienceID = req.params.experience_id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
   
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
   
      const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
   
      try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Check if user has created experiences
        if (experienceID) {
          const allExperience = [...profile.experience];
            
          // Find target experience that is changing in the profile object
          const singleExperience = allExperience.find(
            (el) => el._id.toString() === experienceID
          );
            
          // Capture index of targeted experoence element for reassignment
          const index = allExperience.indexOf(singleExperience);
            
          if (title) singleExperience.title = newExperience.title;
          if (company) singleExperience.company = newExperience.company;
          if (location) singleExperience.location = newExperience.location;
          if (to) singleExperience.to = newExperience.to;
          if (from) singleExperience.from = newExperience.from;
          if (current) singleExperience.current = newExperience.current;
          if (description) singleExperience.description = newExperience.description;
          
          // Update profile at index, then set the profile object to new values and save it
          allExperience[index] = singleExperience;
          profile.experience = allExperience;

          await profile.save(); 
        }
   
        return res.json(profile);

      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route  DELETE api/profile/experience/:experience_id
// @desc   Delete experience from profile
// @access Private

router.delete('/experience/:experience_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.experience.map(exp => exp.id).indexOf(req.params.experience_id);

        // Remove targeted experience
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        return res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private

router.put('/education', [ auth,
    [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldOfStudy, from, to, current, description } = req.body;

    const newEdu = {
        school, 
        degree, 
        fieldOfStudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // push school object to beginning of school array
        profile.education.unshift(newEdu);

        await profile.save();

        return res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route  PATCH api/profile/experience/:experience_id
// @desc   Update profile experience
// @access Private

router.patch(
    '/education/:education_id',
    [
      auth,
      [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
      ],
    ],
    async (req, res) => {
      // Capture education ID 
      const educationID = req.params.education_id;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
   
      const {
        school, 
        degree, 
        fieldOfStudy,
        from,
        to,
        current,
        description
      } = req.body;
   
      const newEducation = {
        school, 
        degree, 
        fieldOfStudy,
        from,
        to,
        current,
        description,
      };
   
      try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Check if user has created experiences
        if (educationID) {
          const allEducation = [...profile.education];
            
          // Find target experience that is changing in the profile object
          const singleEducation = allEducation.find(
            (el) => el._id.toString() === educationID
          );
            
          // Capture index of targeted experoence element for reassignment
          const index = allEducation.indexOf(singleEducation);
            
          if (school) singleEducation.school = newEducation.school;
          if (degree) singleEducation.degree = newEducation.degree;
          if (fieldOfStudy) singleEducation.fieldOfStudy = newEducation.fieldOfStudy;
          if (to) singleEducation.to = newEducation.to;
          if (from) singleEducation.from = newEducation.from;
          if (current) singleEducation.current = newEducation.current;
          if (description) singleEducation.description = newEducation.description;
          
          // Update profile at index, then set the profile object to new values and save it
          allEducation[index] = singleEducation;
          profile.education = allEducation;

          await profile.save(); 
        }
   
        return res.json(profile);

      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route  DELETE api/profile/education/:education_id
// @desc   Delete experience from profile
// @access Private

router.delete('/education/:education_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.education.map(exp => exp.id).indexOf(req.params.education_id);

        // Remove targeted education
        profile.education.splice(removeIndex, 1);

        await profile.save();

        return res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET api/profile/github/:username
// @desc   Get user repos from Github
// @access Public

router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };
    
    const gitHubResponse = await axios.get(uri, { headers });

    return res.json(gitHubResponse.data)

  } catch (error) {
    console.error(error.message);
    return res.status(404).json({ msg: 'No Github profile found '});
  }

});


module.exports = router;