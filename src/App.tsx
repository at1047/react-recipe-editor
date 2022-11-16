import React , { useState, useEffect } from 'react';
import './App.css';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

function App() {

  interface Recipe {
    name: string,
    ingredients: _Ingredient[],
    notes: string
  }
    
  interface Ingredient {
      id: string,
      name: string,
      quantity: number,
      unit: string
    }

  interface _Ingredient {
    name: string,
    quantity: number,
    unit: string
  }


  const [ingredientFields, setIngredientFields] = useState<Ingredient[]>([]);
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState<Recipe>();
  const [notes, setNotes] = useState('');
  const [response, setResponse] = useState('');

  const handleFormChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const index = ingredientFields.findIndex(ingredient => ingredient.id === id)
    let _ingredientFields = [...ingredientFields] as any
    _ingredientFields[index][e.target.name] = e.target.value

    setIngredientFields(_ingredientFields);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setName(name);
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const notes = e.target.value
    setNotes(notes);
  }

  const removeIngredient = (id: string) => {
    let _ingredientFields = [...ingredientFields]
    _ingredientFields = _ingredientFields.filter(ingredient => ingredient.id !== id)
    setIngredientFields(_ingredientFields)
  }

  

  const updateRecipe = () => {
    const _name = name || ''
    const _notes = notes || ''
    const _ingredients = ingredientFields.map(i => { return { name: i.name, quantity: parseFloat(i.quantity as any), unit: i.unit } });
    const recipe: Recipe = {
      name: _name,
      ingredients: _ingredients,
      notes: _notes
    }
    console.log(recipe);
    setRecipe(recipe);
  }

 
  const clearFields = () => {
    const _recipe: Recipe = {
      name: '',
      ingredients: [],
      notes: ''
    }
      
    const _ingredientFields: Ingredient[] = [];

    setName('');
    setIngredientFields(_ingredientFields);
    setNotes('');
    setRecipe(_recipe);

    (document.getElementById("form-wrapper")! as HTMLFormElement).reset();

  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
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

  const addIngredient = (e: React.MouseEvent) => {
    e.preventDefault()
    let newIngredient: Ingredient = {
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
          
          
          {ingredientFields.map((input) => {
            return (
              <div key={input.id}>
                <input name='name' placeholder='Ingredient' onChange={(e) => handleFormChange(input.id, e)} />
                <input name='quantity' placeholder='Quantity' type={'number'} step={0.25} onChange={(e) => handleFormChange(input.id, e)} />
                <input name='unit' placeholder='Unit' onChange={(e) => handleFormChange(input.id, e)} />
                <button onClick={() => removeIngredient(input.id)}>Remove</button>
              </div>
              
            )
          })}
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
