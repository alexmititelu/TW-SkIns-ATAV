module.exports = mongoose => {
    
    var testimonialeSchema = new mongoose.Schema({
        id_curs: String,
        id_cont: String,
        feedback: String
    });

    var Testimoniale = mongoose.model('Testimoniale', testimonialeSchema);

    return Testimoniale;
}