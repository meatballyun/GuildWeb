import { useState } from 'react';
import { api } from '../../api';

function IngredientPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [carbs, setCarbs] = useState('');
  const [pro, setPro] = useState('');
  const [fats, setFats] = useState('');
  const [kcal, setKcal] = useState('');
  const [unit, setUnit] = useState('100g');

  const handleIngredient = async () => {
    const [succ, err] = await api.auth
      .ingredient({ name, description, carbs, pro, fats, kcal, unit })
      .then((res) => [res, null])
      .catch((err) => [null, err]);

    if (err) {
      console.log('err: ', err);
      return;
    }
    if (succ.status === 200) {
      const json = await succ.json();
    }

    //navigate('/');
  };

  return (
    <>
      <div>IngredientPage</div>
      <div>
        <label>name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>carbs</label>
        <input value={carbs} onChange={(e) => setCarbs(e.target.value)} />
      </div>
      <div>
        <label>pro</label>
        <input value={pro} onChange={(e) => setPro(e.target.value)} />
      </div>
      <div>
        <label>fats</label>
        <input value={fats} onChange={(e) => setFats(e.target.value)} />
      </div>
      <div>
        <label>kcal</label>
        <input value={kcal} onChange={(e) => setKcal(e.target.value)} />
      </div>
      <div>
        <label>unit</label>
        <input value={unit} onChange={(e) => setUnit(e.target.value)} />
      </div>
      <button onClick={handleIngredient}>submit</button>
    </>
  );
}

export default IngredientPage;
