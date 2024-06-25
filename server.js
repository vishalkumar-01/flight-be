const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

mongoose.connect('mongodb://127.0.0.1:27017/')

    .then(() => {
        console.log('Connected to  database');
    })
    .catch((err) => {
        console.error(err);
    });

const DBSchema = new mongoose.Schema({

    todo: { type: String, require: true },
});

const DBModel = mongoose.model('students', DBSchema);

app.use(express.json());
app.use(cors());
app.post('/posting', async (req, resp) => {
    try {
        const user = new DBModel(req.body);
        const results = await user.save();
        const datasending = results.toObject();
        resp.send(datasending);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});

app.get('/getting', async (req, resp) => {
    try {
        const users = await DBModel.find({}, 'todo');
        resp.json(users);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to retrieve user data');
    }
});

app.put('/updating/:id', async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const updatedTodo = await DBModel.findByIdAndUpdate(
            id,
            { todo },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).send('Todo not found');
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Failed to update todo:', error);
        res.status(500).send('Failed to update todo');
    }
});



app.delete('/deleting/:id', async (req, resp) => {
    try {
        const { id } = req.params;

        const result = await DBModel.findByIdAndDelete(id);

        if (!result) {
            return resp.status(404).send('Todo not found');
        }

        resp.send('Todo deleted successfully');
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to delete todo');
    }
});



const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    uname: { type: String, required: true },// 'users' will be your collection na
    email: { type: String, required: true },
    phn: { type: String, required: true },
    address: { type: String, required: true },
    pass: { type: String, required: true },
    cpass: { type: String, required: true },
  });
  
  const UserModel = mongoose.model('users', userSchema); 
  
  app.use(express.json());
  app.use(cors());
  
  app.post('/users', async (req, res) => {
    const { name, uname, email, phn, address, pass, cpass } = req.body;
  
    try {
      const newUser = new UserModel({ name, uname, email, phn, address, pass, cpass });
      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (error) {
      console.error('Failed to save user:', error);
      res.status(500).send('Failed to save user');
    }
  });



  app.post('/login', async (req, res) => {
    const { email, pass } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        if (user.pass !== pass) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
});



app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
