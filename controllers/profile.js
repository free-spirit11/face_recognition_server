const handleProfileGet = (db) => (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })//when parameter is the same, e.g. id:id, we can just write id one time
        .then(user => {
            if (user.length) {
                res.json(user[0]);

            } else {
                res.status(400).json('Not found');
            }
        })
}

const handleProfileUpdate = (db) => (req, res) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;
console.log("check", name)
    db('users')
        .where({ id })
        .update({ name })
        .then(resp => {
            if (resp) {
                console.log("response from db: ", resp)
                res.json("success")
            } else {
                console.log("response from db in else: ", resp)

                res.status(400).json('Unable to update')
            }
        })
        .catch(err => res.status(400).json('error updating user'))
}

module.exports = {
    handleProfileGet,
    handleProfileUpdate
}