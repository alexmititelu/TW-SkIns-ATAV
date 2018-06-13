module.exports = mongoose => {
    
    var utilizatoriSchema = new mongoose.Schema({
        cont_id: String,
        first_name: String,
        last_name: String,
        nr_telefon: String,
        interests: String,
        gender : String,
        isSubscribed : String
    });

    var Utilizatori = mongoose.model('Utilizatori', utilizatoriSchema);

    return Utilizatori;
}