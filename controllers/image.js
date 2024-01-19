const clarifai = require('./clarifai');

const handleImage = (db) => (req, res) => {
    const { id, imageUrl, model } = req.body;

    clarifai.makeClarifaiRequest(imageUrl, model)
        .then(result => {
            db('users').where('id', '=', id)
                .increment('entries', 1)
                .catch(err => res.status(400).json('unable to get entries'));
            res.json(result);
        });
}

const handleByteImage = (db) => (req, res) => {
    const { id, image, model } = req.body;

    clarifai.makeByteClarifaiRequest(image, model)
        .then(result => {
            db('users').where('id', '=', id)
                .increment('entries', 1)
                .catch(err => res.status(400).json('unable to get entries'));
            res.json(result);
        });
}

module.exports = {
    handleImage: handleImage,
    handleByteImage: handleByteImage
}