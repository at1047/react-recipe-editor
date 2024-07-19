import React , { useState, useEffect } from 'react';
import './App.css';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import IngredientList from './components/IngredientList/ingredientList';


function App() {

  const [ingredientFields, setIngredientFields] = useState([{
      id: uuidv4(),
      name: 'test',
      quantity: 0,
      unit: 'g'
    }]);
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState();
  const [notes, setNotes] = useState('');
  const [response, setResponse] = useState('');

  const handleFormChange = (id, e) => {
    const index = ingredientFields.findIndex(ingredient => ingredient.id === id)
    let _ingredientFields = [...ingredientFields]
    _ingredientFields[index][e.target.name] = e.target.value

    setIngredientFields(_ingredientFields);
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setName(name);
  }

  const handleNoteChange = (e) => {
    const notes = e.target.value
    setNotes(notes);
  }

  const removeIngredient = (id) => {
    let _ingredientFields = [...ingredientFields]
    _ingredientFields = _ingredientFields.filter(ingredient => ingredient.id !== id)
    setIngredientFields(_ingredientFields)
  }



  const updateRecipe = () => {
    const _name = name || ''
    const _notes = notes || ''
    const _ingredients = ingredientFields.map(i => { return { name: i.name, quantity: parseFloat(i.quantity), unit: i.unit } });
    const recipe = {
      name: _name,
      ingredients: _ingredients,
      notes: _notes
    }
    console.log(recipe);
    setRecipe(recipe);
  }


  const clearFields = () => {
    const _recipe = {
      name: '',
      ingredients: [],
      notes: ''
    }

    const _ingredientFields = [];

    setName('');
    setIngredientFields(_ingredientFields);
    setNotes('');
    setRecipe(_recipe);

    (document.getElementById("form-wrapper")).reset();

  }

  const submitForm = (e) => {
    e.preventDefault()

    // const recipe: Recipe = {
    //   name: "test",
    //   ingredients: [],
    //   notes: ""
    // }
    console.log(recipe)
    setResponse('loading...')
    try {
      axios.post('https://andrew-tai.com/api/recipes', recipe)
      .then((res) => setResponse(`${res.status}`))
      .then(clearFields)
    } catch (e) {
      setResponse(`error: ${e}`)
    }

    // console.table(ingredientFields)

  }

  const addIngredient = (e) => {
    e.preventDefault()
    let newIngredient = {
      id: uuidv4(),
      name: '',
      quantity: 0,
      unit: ''
    };

    setIngredientFields([...ingredientFields, newIngredient])
  }

  useEffect(() => {
    updateRecipe()
  }, [ingredientFields, name, notes]);


  return (
    <div className="App">
      <h1>Recipe Editor</h1>
      <form autoComplete="off" id='form-wrapper' onSubmit={(e) => submitForm(e)}>
        <div className='input-wrapper'>
          <div className='name-row'>
            <div className='name-wrapper'>
              <label htmlFor='recipe-name'>Recipe Name:</label>
              <input id='recipe-name' name='name' placeholder='Name' onChange={(e) => handleNameChange(e)} />
            </div>
          </div>

          <IngredientList ingredients={ingredientFields} handleFormChange={handleFormChange} removeIngredient={removeIngredient} />

          <div className='notes-wrapper'>
            <label htmlFor='notes'>Notes:</label>
            <input id='notes' className='notes-input' name='notes' placeholder='Notes' onChange={(e) => handleNoteChange(e)} />
          </div>
          <div className='button-row'>
            <div className='button-wrapper'>
              <button onClick={addIngredient}>Add Ingredient</button>
              <button onClick={clearFields}>Clear Fields</button>
              <button type='submit'>Submit Query</button>
            </div>
          </div>


        </div>
      </form>

      <p className='response-text' style={{visibility: response === ''? 'hidden': 'visible'}}>response: <span style={{color: response == '201'? 'green': ''}}>{response}</span></p>

      <div className='payload-wrapper'>
        <h3>Payload Preview</h3>
        <pre style={{textAlign: 'left'}} >{JSON.stringify(recipe, null, 2)}</pre>
        </div>

    </div>
  );
}

export default App;
