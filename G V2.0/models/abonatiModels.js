module.exports = mongoose => {
    
    var abonatiSchema = new mongoose.Schema({
        cont_id: String,
        curs_id: String
    });

    var Abonati = mongoose.model('Abonati', abonatiSchema);

    return Abonati;
}