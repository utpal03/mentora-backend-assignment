import express from 'express';
const app = express();
const PORT = 3000;
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Hello this is master backend of Mentora');
});
