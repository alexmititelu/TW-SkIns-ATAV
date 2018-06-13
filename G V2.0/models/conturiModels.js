module.exports = mongoose => {
    
    var conturiSchema = new mongoose.Schema({
        username: String,
        email: String,
        password: String
    });

    var Conturi = mongoose.model('Conturi', conturiSchema);

    return Conturi;
}