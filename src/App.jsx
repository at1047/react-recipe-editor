import React , { useState, useEffect } from 'react';
import './App.css';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import { IngredientList } from './components/IngredientList/ingredientList';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";


function App() {

  const [ingredientFields, setIngredientFields] = useState([])
    // {
    //   id: uuidv4(),
    //   name: 'test',
    //   quantity: 0,
    //   unit: 'g'
    // },{
    //   id: uuidv4(),
    //   name: 'test2',
    //   quantity: 0,
    //   unit: 'g'
    // }
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState();
  const [notes, setNotes] = useState('');
  const [response, setResponse] = useState('');

  const handleFormChange = (id, e) => {
    console.log('handling form name update')
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

  class MyPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({nativeEvent: event}) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          isInteractiveElement(event.target)
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

function isInteractiveElement(element) {
  const interactiveElements = [
    'button',
    'input',
    'textarea',
    'select',
    'option',
  ];

  if (interactiveElements.includes(element.tagName.toLowerCase())) {
    return true;
  }

  return false;
}

  const sensors = useSensors(
    useSensor(MyPointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTaskPos = (id) => ingredientFields.findIndex((ingredient) => ingredient.id === id);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setIngredientFields((ingredientFields) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      console.log(originalPos)
      console.log(newPos)

      return arrayMove(ingredientFields, originalPos, newPos);
    });
  };


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
          <div className='button-row'>
            <div className='button-wrapper'>
              <button onClick={addIngredient}>Add Ingredient</button>
              <button onClick={clearFields}>Clear Fields</button>
              <button type='submit'>Submit Query</button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >

          <IngredientList ingredients={ingredientFields} handleFormChange={handleFormChange} removeIngredient={removeIngredient} />

          </DndContext>

          <div className='notes-wrapper'>
            <label htmlFor='notes'>Notes:</label>
            <textarea id='notes' className='notes-input' name='notes' placeholder='Notes' onChange={(e) => handleNoteChange(e)} />
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
