module.exports = mongoose => {
    
    var pythonExercisesSchema = new mongoose.Schema({
        nrExercitiu:Number,
        enunt: String,
        input: String,
        rezultat: String
    });

    var PythonExercises = mongoose.model('PythonExercises', pythonExercisesSchema);

    return PythonExercises;
}