import './styles.css';
import { api } from '../../api';

function IngredientListPage() {
  return (
    <>
      <div>IngredientListPage</div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>carbs</th>
              <th>pro</th>
              <th>fats</th>
              <th>kcal</th>
              <th>unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>紅蘿蔔</td>
              <td>8.5 g</td>
              <td>1 g</td>
              <td>0.2 g</td>
              <td>39.8 kcal</td>
              <td>100g</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default IngredientListPage;
