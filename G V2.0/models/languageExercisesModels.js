module.exports = mongoose => {
    
    var languageExercisesSchema = new mongoose.Schema({
        nrExercitiu:Number,
        text: String
    });

    var LanguageExercises = mongoose.model('LanguageExercises', languageExercisesSchema);

    return LanguageExercises;
}