const express = require('express');
require('./db/mongoose'); // Only connects to the mongodb database
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disable!');
//     } else {
//         next();
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is under maintenance. Please try again later!');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//     // const task = await Task.findById('5f24f651f2ebc323ae62761a');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner);

//     const user = await User.findById('5f24f583c70779235d385850');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }

// main();