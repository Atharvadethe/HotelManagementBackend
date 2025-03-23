const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
// Create a new person
router.post('/signup', async (req, res) => {
    try {
        const newPersonData = req.body;

        // Check if email already exists
        const existingPerson = await Person.findOne({ email: newPersonData.email });
        if (existingPerson) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Save the new user
        const newPerson = new Person(newPersonData);
        const savedPerson = await newPerson.save();
        console.log('Saved person to database');

        // Generate JWT token
        const token = generateToken({ id: savedPerson._id, email: savedPerson.email });
        console.log('Token is:', token);

        res.status(201).json({ response: savedPerson, token: token });
    } catch (error) {
        console.error('Error saving person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//login route

router.post('/login', async(req, res) => {
    try{
        // Extract username and password from request body
        const {username, password} = req.body;

        // Find the user by username
        const user = await Person.findOne({username: username});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        console.log("User Data: ", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Fetch all persons
router.get('/',jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log('Data fetched');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch persons by work type
router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        if (['chef', 'manager', 'waiter'].includes(workType)) {
            const response = await Person.find({ work: workType });
            console.log('Data fetched by work type');
            res.status(200).json(response);
        } else {
            res.status(400).json({ error: 'Invalid work type' });
        }
    } catch (error) {
        console.error('Error fetching person by work type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a person by ID
router.put('/:id', async (req, res) => {
    try {
        const personID = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personID, updatedPersonData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }

        console.log('Data updated');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a person by ID
router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const deletedPerson = await Person.findByIdAndDelete(personId);

        if (!deletedPerson) {
            return res.status(404).json({ error: 'Person not found' });
        }

        console.log('Person deleted successfully');
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
