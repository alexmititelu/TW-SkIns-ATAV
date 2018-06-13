module.exports = mongoose => {
    
    var cursuriSchema = new mongoose.Schema({
        titlu_curs: String,
        tag: String,
        descriere: String
    });

    var Cursuri = mongoose.model('Cursuri', cursuriSchema);

    return Cursuri;
}